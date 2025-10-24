<script lang="ts">
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import { userApi, type User, type UsersResponse } from '$lib/utils/api';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let users: User[] = [];
	let total = 0;
	let currentPage = 1;
	let totalPages = 0;
	let limit = 10;
	let searchQuery = '';
	let isLoading = false;
	let error: string | null = null;
	let searchTimeout: NodeJS.Timeout;

	onMount(() => {
		userConfigStore.init();
		translationStore.init();
		loadUsers();
	});

	async function loadUsers() {
		isLoading = true;
		error = null;

		try {
			let response: UsersResponse;

			if (searchQuery.trim()) {
				response = await userApi.searchUsers({
					query: searchQuery.trim(),
					page: currentPage,
					limit
				});
			} else {
				response = await userApi.getUsers({
					page: currentPage,
					limit
				});
			}

			users = response.data;
			total = response.pagination.total;
			totalPages = response.pagination.totalPages;
		} catch (err) {
			error = $translationStore.translations?.users.loadError || 'Error loading users';
			console.error('Error loading users:', err);
		} finally {
			isLoading = false;
		}
	}

	function handleSearch() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			currentPage = 1;
			loadUsers();
		}, 500);
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			loadUsers();
		}
	}

	function changeLimit(newLimit: number) {
		limit = newLimit;
		currentPage = 1;
		loadUsers();
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString();
	}

	function getStatusBadgeClass(active: boolean): string {
		return active
			? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
			: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
	}

	function getRoleBadgeClass(role: string): string {
		switch (role) {
			case 'ROOT':
				return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
			case 'ADMIN':
				return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
			case 'USER':
				return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
			default:
				return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
		}
	}
</script>

<div class="px-4 py-6 sm:px-0">
	<!-- Search and Controls -->
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="max-w-md flex-1">
			<input
				type="text"
				placeholder={$translationStore.translations?.users.searchPlaceholder ||
					'Search users by username...'}
				bind:value={searchQuery}
				on:input={handleSearch}
				class="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary); --tw-placeholder-color: var(--text-tertiary);"
			/>
		</div>

		<div class="flex items-center gap-4">
			<label for="items-per-page" class="text-sm" style="color: var(--text-secondary);">
				{$translationStore.translations?.users.itemsPerPage || 'Items per page'}:
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
					{$translationStore.translations?.users.loading || 'Loading users...'}
				</p>
			</div>
		</div>
	{:else if users.length === 0}
		<!-- No Users -->
		<div
			class="rounded-lg border p-8 text-center"
			style="border-color: var(--border-primary); background-color: var(--bg-secondary);"
		>
			<div class="mb-4 text-6xl">👥</div>
			<h3 class="text-lg font-medium" style="color: var(--text-primary);">
				{$translationStore.translations?.users.noUsers || 'No users found'}
			</h3>
		</div>
	{:else}
		<!-- Users Table -->
		<div class="overflow-hidden rounded-lg border" style="border-color: var(--border-primary);">
			<table class="min-w-full divide-y" style="border-color: var(--border-primary);">
				<thead style="background-color: var(--bg-tertiary);">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.users.username || 'Username'}
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.users.email || 'Email'}
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.users.role || 'Role'}
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.users.status || 'Status'}
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.users.createdAt || 'Created'}
						</th>
					</tr>
				</thead>
				<tbody
					class="divide-y"
					style="background-color: var(--bg-secondary); border-color: var(--border-primary);"
				>
					{#each users as user}
						<tr
							class="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
							on:click={() => goto(`/users/${user._id}`)}
							on:keydown={(e) => e.key === 'Enter' && goto(`/users/${user._id}`)}
							role="button"
							tabindex="0"
						>
							<td
								class="px-6 py-4 text-sm font-medium whitespace-nowrap"
								style="color: var(--text-primary);"
							>
								{user.username}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap" style="color: var(--text-secondary);">
								{user.email}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class={getRoleBadgeClass(user.role)}>
									{user.role}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class={getStatusBadgeClass(user.active)}>
									{user.active
										? $translationStore.translations?.users.active || 'Active'
										: $translationStore.translations?.users.inactive || 'Inactive'}
								</span>
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap" style="color: var(--text-secondary);">
								{formatDate(user.createdAt)}
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
					{$translationStore.translations?.users.showing || 'Showing'}
					{(currentPage - 1) * limit + 1}
					{$translationStore.translations?.users.to || 'to'}
					{Math.min(currentPage * limit, total)}
					{$translationStore.translations?.users.of || 'of'}
					{total}
					{$translationStore.translations?.users.results || 'results'}
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
