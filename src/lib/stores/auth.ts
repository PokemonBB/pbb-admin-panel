import { writable } from 'svelte/store';
import { authApi, type LoginRequest, type ApiError } from '$lib/utils/api';
import { userConfigStore } from './userConfig';

interface User {
	id: string;
	username: string;
	email: string;
	role: string;
}

interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	isLoading: false,
	error: null
};

function createAuthStore() {
	const { subscribe, update } = writable<AuthState>(initialState);

	return {
		subscribe,
		login: async (credentials: LoginRequest) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await authApi.login(credentials);

				if (response.message === 'Login successful' && response.user) {
					// Check if user has admin privileges (ROOT or ADMIN)
					if (response.user.role === 'USER') {
						const errorMessage = 'Access denied: This panel is only for administrators';
						update((state) => ({
							...state,
							isLoading: false,
							error: errorMessage,
							isAuthenticated: false,
							user: null
						}));
						return { success: false, error: errorMessage };
					}

					update((state) => ({
						...state,
						isAuthenticated: true,
						user: response.user as User,
						isLoading: false,
						error: null
					}));

					// Initialize user configuration after successful login
					await userConfigStore.initializeUserConfig();

					return { success: true };
				} else {
					update((state) => ({
						...state,
						isLoading: false,
						error: response.message || 'Login failed'
					}));
					return { success: false, error: response.message };
				}
			} catch (error) {
				const apiError = error as ApiError;
				update((state) => ({
					...state,
					isLoading: false,
					error: apiError.message || 'Network error'
				}));
				return { success: false, error: apiError.message };
			}
		},
		logout: async () => {
			update((state) => ({ ...state, isLoading: true }));

			try {
				await authApi.logout();
			} catch (error) {
				console.warn('Logout API call failed:', error);
			}

			update((state) => ({
				...state,
				isAuthenticated: false,
				user: null,
				isLoading: false,
				error: null
			}));
		},
		checkAuth: async () => {
			update((state) => ({ ...state, isLoading: true }));

			try {
				const response = await authApi.verify();
				console.log('Auth verification response:', response);

				// Check for successful authentication (either "Login successful" or "Authentication verified")
				if (
					(response.message === 'Login successful' ||
						response.message === 'Authentication verified') &&
					response.user
				) {
					// Check if user has admin privileges (ROOT or ADMIN)
					if (response.user.role === 'USER') {
						const errorMessage = 'Access denied: This panel is only for administrators';
						update((state) => ({
							...state,
							isAuthenticated: false,
							user: null,
							isLoading: false,
							error: errorMessage
						}));
					} else {
						update((state) => ({
							...state,
							isAuthenticated: true,
							user: response.user as User,
							isLoading: false,
							error: null
						}));
					}
				} else {
					update((state) => ({
						...state,
						isAuthenticated: false,
						user: null,
						isLoading: false,
						error: null
					}));
				}
			} catch {
				update((state) => ({
					...state,
					isAuthenticated: false,
					user: null,
					isLoading: false,
					error: null
				}));
			}
		},
		clearError: () => {
			update((state) => ({ ...state, error: null }));
		}
	};
}

export const authStore = createAuthStore();
