<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { PUBLIC_API_BASE_URL } from '$env/static/public';
	import { PUBLIC_CDS_BASE_URL } from '$env/static/public';

	onMount(() => {
		userConfigStore.init();
		translationStore.init();

		// Debug: Check if translations are loading
		const unsubscribe = translationStore.subscribe((state) => {
			console.log('Translation state:', state);
		});
		unsubscribe();
	});

	// Get URLs for Swagger
	let swaggerApiUrl = '';
	let swaggerCdsUrl = '';
	if (browser) {
		swaggerApiUrl = `${PUBLIC_API_BASE_URL}`;
		swaggerCdsUrl = `${PUBLIC_CDS_BASE_URL}`;
	}

	$: menuItems = [
		{ path: '/users', key: 'users', icon: '👥', descriptionKey: 'manageUsers' },
		{ path: '/pokemons', key: 'pokemons', icon: '⚡', descriptionKey: 'managePokemons' },
		{ path: '/moves', key: 'moves', icon: '🎯', descriptionKey: 'manageMoves' },
		{ path: '/types', key: 'types', icon: '🏷️', descriptionKey: 'manageTypes' },
		{ path: '/objects', key: 'objects', icon: '📦', descriptionKey: 'manageObjects' },
		{ path: '/audit', key: 'audit', icon: '📊', descriptionKey: 'manageAudit' },
		{ path: '/docs', key: 'documentation', icon: '📚', descriptionKey: 'manageDocs' },
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

	function getTranslation(key: string): string {
		return ($translationStore.translations?.main as any)?.[key] || key;
	}
</script>

<div class="px-4 py-6 sm:px-0">
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each menuItems as item}
			<a
				href={item.path}
				target={item.external ? '_blank' : undefined}
				rel={item.external ? 'noopener noreferrer' : undefined}
				class="group relative rounded-lg border p-6 transition-all duration-200 hover:shadow-lg"
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
							{item.external
								? ($translationStore.translations?.main as any)?.[item.key] || item.key
								: getTranslation(item.key)}
						</h3>
						<p class="text-sm" style="color: var(--text-secondary);">
							{item.external
								? ($translationStore.translations?.main as any)?.[item.descriptionKey] ||
									item.descriptionKey
								: getTranslation(item.descriptionKey)}
						</p>
					</div>
				</div>
				<div class="mt-4 flex items-center text-sm" style="color: var(--accent-primary);">
					<span
						>{item.external ? 'Open' : 'Go to'}
						{item.external
							? ($translationStore.translations?.main as any)?.[item.key] || item.key
							: getTranslation(item.key)}</span
					>
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
		{/each}
	</div>
</div>
