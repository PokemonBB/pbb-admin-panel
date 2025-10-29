<script lang="ts">
	import { userConfigStore, type Language } from '$lib/stores/userConfig';

	let isOpen = false;

	function setLanguage(language: Language) {
		userConfigStore.setLanguage(language);
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-toggle')) {
			isOpen = false;
		}
	}

	function getLanguageFlag(language: Language): string {
		return language === 'en' ? '🇺🇸' : '🇪🇸';
	}

	function getLanguageName(language: Language): string {
		return language === 'en' ? 'English' : 'Español';
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="language-toggle relative">
	<button
		on:click={toggleDropdown}
		class="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
		type="button"
	>
		<span class="mr-2">{getLanguageFlag($userConfigStore.language)}</span>
		<span>{getLanguageName($userConfigStore.language)}</span>
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
					on:click={() => setLanguage('en')}
					class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 {$userConfigStore.language ===
					'en'
						? 'bg-gray-100 dark:bg-gray-700'
						: ''}"
				>
					<span class="mr-3 text-lg">🇺🇸</span>
					English
				</button>
				<button
					on:click={() => setLanguage('es')}
					class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 {$userConfigStore.language ===
					'es'
						? 'bg-gray-100 dark:bg-gray-700'
						: ''}"
				>
					<span class="mr-3 text-lg">🇪🇸</span>
					Español
				</button>
			</div>
		</div>
	{/if}
</div>
