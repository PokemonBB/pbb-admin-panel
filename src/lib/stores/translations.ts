import { writable } from 'svelte/store';
import { userConfigStore, type Language } from './userConfig';

interface Translations {
	common: {
		login: string;
		logout: string;
		welcome: string;
		adminPanel: string;
		signIn: string;
		signingIn: string;
		username: string;
		password: string;
		rememberMe: string;
	};
	login: {
		signInToAccount: string;
		authenticationSuccessful: string;
		sessionActive: string;
		accessDenied: string;
	};
	main: {
		users: string;
		pokemons: string;
		moves: string;
		types: string;
		objects: string;
		audit: string;
		documentation: string;
		manageUsers: string;
		managePokemons: string;
		manageMoves: string;
		manageTypes: string;
		manageObjects: string;
		manageAudit: string;
		manageDocs: string;
		swaggerApi: string;
		swaggerApiDescription: string;
		swaggerCds: string;
		swaggerCdsDescription: string;
	};
	users: {
		title: string;
		searchPlaceholder: string;
		username: string;
		email: string;
		role: string;
		status: string;
		createdAt: string;
		updatedAt: string;
		active: string;
		inactive: string;
		noUsers: string;
		loading: string;
		searchError: string;
		loadError: string;
		page: string;
		of: string;
		itemsPerPage: string;
		showing: string;
		to: string;
		results: string;
		userDetails: string;
		manageUser: string;
		backToList: string;
		userInfo: string;
		edit: string;
		save: string;
		saving: string;
		cancel: string;
		userStats: string;
		userId: string;
		dangerZone: string;
		deleteWarning: string;
		deleteUser: string;
		deleting: string;
		deleteConfirm: string;
		updateSuccess: string;
		updateError: string;
		deleteError: string;
		readOnly: string;
		limitedEdit: string;
	};
	audit: {
		user: string;
		action: string;
		resource: string;
		changes: string;
		timestamp: string;
		noLogs: string;
		loading: string;
		loadError: string;
		itemsPerPage: string;
		showing: string;
		to: string;
		of: string;
		results: string;
	};
	theme: {
		light: string;
		dark: string;
		system: string;
	};
}

interface TranslationState {
	translations: Translations | null;
	isLoading: boolean;
	error: string | null;
}

const defaultState: TranslationState = {
	translations: null,
	isLoading: false,
	error: null
};

function createTranslationStore() {
	const { subscribe, update } = writable<TranslationState>(defaultState);

	let currentLanguage: Language = 'en';

	const loadTranslations = async (language: Language): Promise<Translations> => {
		try {
			const module = await import(`../translations/${language}.json`);
			return module.default as Translations;
		} catch (error) {
			console.error(`Error loading translations for ${language}:`, error);
			if (language !== 'en') {
				const module = await import(`../translations/en.json`);
				return module.default as Translations;
			}
			throw error;
		}
	};

	return {
		subscribe,
		loadLanguage: async (language: Language) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const translations = await loadTranslations(language);
				currentLanguage = language;

				update((state) => ({
					...state,
					translations,
					isLoading: false,
					error: null
				}));
			} catch (error) {
				update((state) => ({
					...state,
					isLoading: false,
					error: `Failed to load translations: ${error}`
				}));
			}
		},
		init: async () => {
			// Get current language from userConfigStore
			let currentState: { language: Language } = { language: 'en' };
			const unsubscribe = userConfigStore.subscribe((state) => {
				currentState = { language: state.language };
			});
			unsubscribe();

			await translationStore.loadLanguage(currentState.language);
		},
		getCurrentLanguage: () => currentLanguage
	};
}

export const translationStore = createTranslationStore();
