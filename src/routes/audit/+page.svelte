<script lang="ts">
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import { auditApi, type AuditLog, type AuditLogsResponse } from '$lib/utils/api';
	import { onMount } from 'svelte';

	let auditLogs: AuditLog[] = [];
	let total = 0;
	let currentPage = 1;
	let totalPages = 0;
	let limit = 10;
	let isLoading = false;
	let error: string | null = null;

	onMount(() => {
		userConfigStore.init();
		translationStore.init();
		loadAuditLogs();
	});

	async function loadAuditLogs() {
		isLoading = true;
		error = null;

		try {
			const response: AuditLogsResponse = await auditApi.getAuditLogs({
				page: currentPage,
				limit
			});

			auditLogs = response.audits;
			total = response.pagination.total;
			totalPages = response.pagination.pages;
		} catch (err) {
			error = $translationStore.translations?.audit.loadError || 'Error loading audit logs';
			console.error('Error loading audit logs:', err);
		} finally {
			isLoading = false;
		}
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			loadAuditLogs();
		}
	}

	function changeLimit(newLimit: number) {
		limit = newLimit;
		currentPage = 1;
		loadAuditLogs();
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleString();
	}

	function getActionBadgeClass(action: string): string {
		switch (action) {
			case 'CREATE':
				return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
			case 'UPDATE':
				return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
			case 'DELETE':
				return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
			default:
				return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
		}
	}

	function formatValues(values: Record<string, unknown> | undefined): string {
		if (!values) return '-';
		return Object.entries(values)
			.map(([key, value]) => `${key}: ${value}`)
			.join(', ');
	}
</script>

<div class="px-4 py-6 sm:px-0">
	<!-- Controls -->
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<label for="items-per-page" class="text-sm" style="color: var(--text-secondary);">
				{$translationStore.translations?.audit.itemsPerPage || 'Items per page'}:
			</label>
			<select
				id="items-per-page"
				bind:value={limit}
				on:change={() => changeLimit(limit)}
				class="rounded-md border px-3 py-1 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary);"
			>
				<option value={10}>10</option>
				<option value={25}>25</option>
				<option value={50}>50</option>
				<option value={100}>100</option>
			</select>
		</div>
	</div>

	<!-- Error Message -->
	{#if error}
		<div class="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
				</div>
			</div>
		</div>
	{/if}

	<!-- Loading State -->
	{#if isLoading}
		<div class="flex justify-center py-8">
			<div class="text-center">
				<div class="mb-4 text-4xl">⏳</div>
				<p class="text-sm" style="color: var(--text-secondary);">
					{$translationStore.translations?.audit.loading || 'Loading audit logs...'}
				</p>
			</div>
		</div>
	{:else if auditLogs.length === 0}
		<!-- No Audit Logs -->
		<div
			class="rounded-lg border p-8 text-center"
			style="border-color: var(--border-primary); background-color: var(--bg-secondary);"
		>
			<div class="mb-4 text-6xl">📋</div>
			<h3 class="text-lg font-medium" style="color: var(--text-primary);">
				{$translationStore.translations?.audit.noLogs || 'No audit logs found'}
			</h3>
		</div>
	{:else}
		<!-- Audit Logs Table -->
		<div class="overflow-hidden rounded-lg border" style="border-color: var(--border-primary);">
			<table class="min-w-full divide-y" style="border-color: var(--border-primary);">
				<thead style="background-color: var(--bg-tertiary);">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.audit.user || 'User'}
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.audit.action || 'Action'}
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.audit.resource || 'Resource'}
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.audit.changes || 'Changes'}
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.audit.timestamp || 'Timestamp'}
						</th>
					</tr>
				</thead>
				<tbody
					class="divide-y"
					style="background-color: var(--bg-secondary); border-color: var(--border-primary);"
				>
					{#each auditLogs as log}
						<tr>
							<td
								class="px-6 py-4 text-sm font-medium whitespace-nowrap"
								style="color: var(--text-primary);"
							>
								{log.username}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class={getActionBadgeClass(log.action)}>
									{log.action}
								</span>
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap" style="color: var(--text-secondary);">
								{log.resource}
							</td>
							<td class="px-6 py-4 text-sm" style="color: var(--text-secondary);">
								<div class="max-w-xs truncate">
									{#if log.oldValues && log.newValues}
										<div class="text-xs">
											<span class="font-medium">Old:</span>
											{formatValues(log.oldValues)}
										</div>
										<div class="text-xs">
											<span class="font-medium">New:</span>
											{formatValues(log.newValues)}
										</div>
									{:else if log.newValues}
										<div class="text-xs">
											<span class="font-medium">New:</span>
											{formatValues(log.newValues)}
										</div>
									{:else}
										-
									{/if}
								</div>
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap" style="color: var(--text-secondary);">
								{formatDate(log.createdAt)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="mt-6 flex items-center justify-between">
				<div class="text-sm" style="color: var(--text-secondary);">
					{$translationStore.translations?.audit.showing || 'Showing'}
					{(currentPage - 1) * limit + 1}
					{$translationStore.translations?.audit.to || 'to'}
					{Math.min(currentPage * limit, total)}
					{$translationStore.translations?.audit.of || 'of'}
					{total}
					{$translationStore.translations?.audit.results || 'results'}
				</div>

				<div class="flex items-center space-x-2">
					<button
						on:click={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1}
						class="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800"
						style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary);"
					>
						Previous
					</button>

					{#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
						const startPage = Math.max(1, currentPage - 2);
						const pageNum = startPage + i;
						return pageNum <= totalPages ? pageNum : null;
					}).filter((pageNum): pageNum is number => pageNum !== null) as pageNum}
						<button
							on:click={() => goToPage(pageNum)}
							class="rounded-md border px-3 py-1 text-sm {pageNum === currentPage
								? 'border-blue-500 bg-blue-500 text-white'
								: 'hover:bg-gray-50 dark:hover:bg-gray-800'}"
							style="border-color: var(--border-primary); background-color: {pageNum === currentPage
								? 'var(--accent-primary)'
								: 'var(--bg-secondary)'}; color: {pageNum === currentPage
								? 'white'
								: 'var(--text-primary)'};"
						>
							{pageNum}
						</button>
					{/each}

					<button
						on:click={() => goToPage(currentPage + 1)}
						disabled={currentPage === totalPages}
						class="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800"
						style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary);"
					>
						Next
					</button>
				</div>
			</div>
		{/if}
	{/if}
</div>
