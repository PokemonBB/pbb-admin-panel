<script lang="ts">
	import { invitationApi } from '$lib/utils/api';
	import { translationStore } from '$lib/stores/translations';
	import { config } from '$lib/config/environment';

	let isOpen = false;
	let isLoading = false;
	let link: string = '';
	let copied = false;
	let code: string = '';
	let copiedCode = false;
	let error: string | null = null;

	async function openModal() {
		isOpen = true;
		copied = false;
		link = '';
		error = null;
		isLoading = true;
		try {
			const res = await invitationApi.create();
			code = res.invitation.code;
			link = `${config.WEBAPP_BASE_URL}/register?code=${code}`;
		} catch (e) {
			error = 'Error creating invitation';
		} finally {
			isLoading = false;
		}
	}

	async function copyToClipboard() {
		if (!link) return;
		try {
			await navigator.clipboard.writeText(link);
			copied = true;
			setTimeout(() => (copied = false), 1200);
		} catch {}
	}
	async function copyCodeToClipboard() {
		if (!code) return;
		try {
			await navigator.clipboard.writeText(code);
			copiedCode = true;
			setTimeout(() => (copiedCode = false), 1200);
		} catch {}
	}
	function closeModal() {
		isOpen = false;
	}
</script>

<button
	on:click={openModal}
	class="rounded-md border px-3 py-2 text-sm font-medium shadow-sm hover:opacity-90"
	style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary);"
>
	{($translationStore.translations?.common as any)?.createInvitation || 'Create invitation'}
	<span class="ml-1">➕</span>
</button>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<button class="absolute inset-0 bg-black/40" on:click={closeModal} aria-label="Close overlay"
		></button>
		<div
			class="relative z-10 w-full max-w-lg rounded-lg border p-6"
			style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary);"
		>
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold">
					{($translationStore.translations?.common as any)?.createInvitation || 'Create invitation'}
				</h3>
				<button
					on:click={closeModal}
					class="rounded-md px-2 py-1 text-sm hover:opacity-80"
					style="color: var(--text-secondary);"
					aria-label={($translationStore.translations?.common as any)?.close || 'Close'}>✕</button
				>
			</div>

			{#if isLoading}
				<div class="py-6 text-sm" style="color: var(--text-secondary);">Generating...</div>
			{:else if error}
				<div class="py-6 text-sm" style="color: var(--text-secondary);">{error}</div>
			{:else}
				<div>
					<label
						class="block text-sm font-medium"
						for="invite-link"
						style="color: var(--text-primary);">Link</label
					>
					<div class="mt-2 flex items-center gap-2">
						<input
							id="invite-link"
							class="w-full rounded-md border px-3 py-2 text-sm"
							style="border-color: var(--border-primary); background-color: var(--bg-primary); color: var(--text-primary);"
							value={link}
							readonly
						/>
						<button
							type="button"
							on:click={copyToClipboard}
							class="rounded-md border px-3 py-2 text-sm font-medium hover:opacity-90"
							style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary);"
						>
							{#if copied}
								{($translationStore.translations?.common as any)?.copied || 'Copied'}
							{:else}
								{($translationStore.translations?.common as any)?.copyLink || 'Copy link'}
							{/if}
						</button>
					</div>
				</div>

				<div class="mt-4">
					<label
						class="block text-sm font-medium"
						for="invite-code"
						style="color: var(--text-primary);">Code</label
					>
					<div class="mt-2 flex items-center gap-2">
						<input
							id="invite-code"
							class="w-full rounded-md border px-3 py-2 text-sm"
							style="border-color: var(--border-primary); background-color: var(--bg-primary); color: var(--text-primary);"
							value={code}
							readonly
						/>
						<button
							type="button"
							on:click={copyCodeToClipboard}
							class="rounded-md border px-3 py-2 text-sm font-medium hover:opacity-90"
							style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary);"
						>
							{#if copiedCode}
								{($translationStore.translations?.common as any)?.copied || 'Copied'}
							{:else}
								{($translationStore.translations?.common as any)?.copyCode || 'Copy code'}
							{/if}
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
