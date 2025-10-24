<script lang="ts">
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import { onMount } from 'svelte';

	onMount(() => {
		userConfigStore.init();
		translationStore.init();
	});
</script>

<div class="px-4 py-6 sm:px-0">
	<div class="text-center">
		<h1 class="mb-4 text-3xl font-bold" style="color: var(--text-primary);">Types Management</h1>
		<p class="text-lg" style="color: var(--text-secondary);">
			Manage Pokémon types and type effectiveness
		</p>
	</div>

	<div
		class="mt-8 rounded-lg border p-8"
		style="border-color: var(--border-primary); background-color: var(--bg-secondary);"
	>
		<div class="text-center">
			<div class="mb-4 text-6xl">🏷️</div>
			<h2 class="mb-2 text-xl font-semibold" style="color: var(--text-primary);">Types Section</h2>
			<p class="text-sm" style="color: var(--text-secondary);">This section is under development</p>
		</div>
	</div>
</div>
