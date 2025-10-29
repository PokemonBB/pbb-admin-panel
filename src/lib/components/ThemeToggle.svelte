<script lang="ts">
	import { userConfigStore, type Theme } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';

	let isOpen = false;

	function setTheme(theme: Theme) {
		userConfigStore.setTheme(theme);
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.theme-toggle')) {
			isOpen = false;
		}
	}

	function getThemeTranslation(theme: Theme): string {
		switch (theme) {
			case 'light':
				return $translationStore.translations?.theme.light || 'Light';
			case 'dark':
				return $translationStore.translations?.theme.dark || 'Dark';
			case 'system':
				return $translationStore.translations?.theme.system || 'System';
		}
		return '';
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="theme-toggle relative">
	<button
		on:click={toggleDropdown}
		class="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
		type="button"
	>
		{#if $userConfigStore.theme === 'light'}
			☀️
		{:else if $userConfigStore.theme === 'dark'}
			🌙
		{:else}
			🖥️
		{/if}
		<span class="ml-2">{getThemeTranslation($userConfigStore.theme)}</span>
		<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="ring-opacity-5 absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none dark:bg-gray-800 dark:ring-gray-600"
		>
			<div class="py-1">
				<button
					on:click={() => setTheme('light')}
					class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 {$userConfigStore.theme ===
					'light'
						? 'bg-gray-100 dark:bg-gray-700'
						: ''}"
				>
					☀️
					{getThemeTranslation('light')}
				</button>
				<button
					on:click={() => setTheme('dark')}
					class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 {$userConfigStore.theme ===
					'dark'
						? 'bg-gray-100 dark:bg-gray-700'
						: ''}"
				>
					🌙
					{getThemeTranslation('dark')}
				</button>
				<button
					on:click={() => setTheme('system')}
					class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 {$userConfigStore.theme ===
					'system'
						? 'bg-gray-100 dark:bg-gray-700'
						: ''}"
				>
					🖥️
					{getThemeTranslation('system')}
				</button>
			</div>
		</div>
	{/if}
</div>
