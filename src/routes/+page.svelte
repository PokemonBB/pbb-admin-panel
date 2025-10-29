<script lang="ts">
	import { translationStore } from '$lib/stores/translations';
	import { browser } from '$app/environment';
	import { config } from '$lib/config/environment';

	let gameBaseUrl = '';
	let swaggerApiUrl = '';
	let swaggerCdsUrl = '';
	if (browser) {
		gameBaseUrl = config.WEBAPP_BASE_URL;
		swaggerApiUrl = config.API_BASE_URL;
		swaggerCdsUrl = config.CDS_BASE_URL;
	}

	$: menuItems = [
		{
			path: gameBaseUrl,
			key: 'gameBaseUrl',
			icon: '👾',
			descriptionKey: 'gameBaseUrlDescription',
			external: true
		},
		{ path: '/users', key: 'users', icon: '👥', descriptionKey: 'manageUsers' },
		{
			path: '/pokemons',
			key: 'pokemons',
			icon: '⚡',
			descriptionKey: 'managePokemons',
			disabled: true
		},
		{ path: '/moves', key: 'moves', icon: '🎯', descriptionKey: 'manageMoves', disabled: true },
		{ path: '/types', key: 'types', icon: '🏷️', descriptionKey: 'manageTypes', disabled: true },
		{
			path: '/objects',
			key: 'objects',
			icon: '📦',
			descriptionKey: 'manageObjects',
			disabled: true
		},
		{ path: '/audit', key: 'audit', icon: '📊', descriptionKey: 'manageAudit' },
		{
			path: '/docs',
			key: 'documentation',
			icon: '📚',
			descriptionKey: 'manageDocs',
			disabled: true
		},
		{
			path: swaggerApiUrl,
			key: 'swaggerApi',
			icon: '🔗',
			descriptionKey: 'swaggerApiDescription',
			external: true
		},
		{
			path: swaggerCdsUrl,
			key: 'swaggerCds',
			icon: '🔗',
			descriptionKey: 'swaggerCdsDescription',
			external: true
		}
	];
</script>

<div class="px-4 py-6 sm:px-0">
	<div class="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each menuItems as item}
			{#if item.disabled}
				<div
					class="group relative flex h-full min-h-[160px] cursor-not-allowed flex-col rounded-lg border p-6 opacity-50"
					style="border-color: var(--border-primary); background-color: var(--bg-secondary);"
				>
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<span class="text-3xl">{item.icon}</span>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-medium" style="color: var(--text-primary);">
								{($translationStore.translations?.main as any)?.[item.key] || item.key}
							</h3>
							<p class="text-sm" style="color: var(--text-secondary);">
								{($translationStore.translations?.main as any)?.[item.descriptionKey] ||
									item.descriptionKey}
							</p>
						</div>
					</div>
					<div class="mt-auto flex items-center text-sm" style="color: var(--accent-primary);">
						<span style="color: var(--text-secondary);">
							{($translationStore.translations?.common as any)?.disabled || 'Disabled'}
						</span>
					</div>
				</div>
			{:else}
				<a
					href={item.path}
					target={item.external ? '_blank' : undefined}
					rel={item.external ? 'noopener noreferrer' : undefined}
					class="group relative flex h-full min-h-[160px] flex-col rounded-lg border p-6 transition-all duration-200 hover:shadow-lg"
					style="border-color: var(--border-primary); background-color: var(--bg-secondary);"
					on:mouseenter={(e) => {
						e.currentTarget.style.borderColor = 'var(--accent-primary)';
						e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
					}}
					on:mouseleave={(e) => {
						e.currentTarget.style.borderColor = 'var(--border-primary)';
						e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
					}}
				>
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<span class="text-3xl">{item.icon}</span>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-medium" style="color: var(--text-primary);">
								{($translationStore.translations?.main as any)?.[item.key] || item.key}
							</h3>
							<p class="text-sm" style="color: var(--text-secondary);">
								{($translationStore.translations?.main as any)?.[item.descriptionKey] ||
									item.descriptionKey}
							</p>
						</div>
					</div>
					<div class="mt-auto flex items-center text-sm" style="color: var(--accent-primary);">
						<span>
							{($translationStore.translations?.common as any)?.[item.external ? 'open' : 'goTo'] ||
								(item.external ? 'Open' : 'Go to')}
							{` ${($translationStore.translations?.main as any)?.[item.key] || item.key}`}
						</span>
						<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{#if item.external}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								/>
							{:else}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							{/if}
						</svg>
					</div>
				</a>
			{/if}
		{/each}
	</div>
</div>
