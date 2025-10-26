<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/pokeball.png';
	import pbbLogo from '$lib/assets/pbb-logo.png';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';
	import CreateInvitationButton from '$lib/components/CreateInvitationButton.svelte';
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import { page } from '$app/stores';

	let { children } = $props();

	onMount(() => {
		// Initialize browser configuration first (before login)
		userConfigStore.init();
		translationStore.init();

		// Then check authentication
		authStore.checkAuth();
	});

	$effect(() => {
		if (typeof window !== 'undefined') {
			if ($authStore.isAuthenticated === false && $authStore.isLoading === false) {
				// Redirect to login if not authenticated and not already on login page
				if (!window.location.pathname.includes('/login')) {
					goto('/login');
				}
			} else if ($authStore.isAuthenticated === true && $authStore.isLoading === false) {
				// Redirect to home if authenticated and on login page
				if (window.location.pathname.includes('/login')) {
					goto('/');
				}
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>PokémonBB Admin Panel</title>
</svelte:head>

{#if $authStore.isLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="h-32 w-32 animate-spin rounded-full border-b-2 border-indigo-600"></div>
	</div>
{:else if $authStore.isAuthenticated}
	<div class="min-h-screen" style="background-color: var(--bg-primary);">
		<nav
			class="shadow"
			style="background-color: var(--bg-secondary); box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);"
		>
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 justify-between">
					<div class="flex items-center space-x-3">
						<a href="/" class="flex items-center space-x-3 hover:opacity-90">
							<img src={pbbLogo} alt="PBB Logo" class="h-8 w-8" />
							<h1 class="text-xl font-semibold" style="color: var(--text-primary);">
								{$translationStore.translations?.common.adminPanel || 'Admin Panel'}
							</h1>
						</a>
					</div>
					<div class="flex items-center space-x-4">
						<LanguageToggle />
						<ThemeToggle />
						<CreateInvitationButton />
						<span class="text-sm" style="color: var(--text-secondary);"
							>{$translationStore.translations?.common.welcome || 'Welcome'}, {$authStore.user
								?.username}</span
						>
						<LogoutButton />
					</div>
				</div>
			</div>
		</nav>

		<!-- Breadcrumb -->
		{#if $page.url.pathname !== '/'}
			<div class="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
				<nav class="flex" aria-label="Breadcrumb">
					<ol class="flex items-center space-x-2">
						<li>
							<a href="/" class="text-sm hover:underline" style="color: var(--text-secondary);">
								Home
							</a>
						</li>
						<li>
							<svg
								class="h-4 w-4"
								fill="currentColor"
								viewBox="0 0 20 20"
								style="color: var(--text-tertiary);"
							>
								<path
									fill-rule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</li>
						<li>
							<span class="text-sm font-medium capitalize" style="color: var(--text-primary);">
								{$page.url.pathname.split('/')[1]}
							</span>
						</li>
					</ol>
				</nav>
			</div>
		{/if}

		<main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
			{@render children?.()}
		</main>
	</div>
{:else}
	{@render children?.()}
{/if}
