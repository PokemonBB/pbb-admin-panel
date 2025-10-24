<script lang="ts">
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import { authStore } from '$lib/stores/auth';
	import { userApi, adminApi, type User, type UpdateUserRequest } from '$lib/utils/api';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let user: User | null = null;
	let isLoading = false;
	let isEditing = false;
	let isSaving = false;
	let isDeleting = false;
	let error: string | null = null;
	let successMessage: string | null = null;

	// Form data
	let formData: UpdateUserRequest = {
		username: '',
		email: '',
		role: 'USER',
		active: true
	};

	// Computed properties for permissions
	$: currentUser = $authStore.user;
	$: isRoot = currentUser?.role === 'ROOT';
	$: isAdmin = currentUser?.role === 'ADMIN';
	$: canChangeRole = isRoot;
	$: canChangeActive = isRoot || isAdmin;

	onMount(() => {
		userConfigStore.init();
		translationStore.init();
		loadUser();
	});

	async function loadUser() {
		const userId = $page.params.id;
		if (!userId) return;

		isLoading = true;
		error = null;

		try {
			user = await userApi.getUserById(userId);
			formData = {
				username: user.username,
				email: user.email,
				role: user.role as 'ROOT' | 'ADMIN' | 'USER',
				active: user.active
			};
		} catch (err) {
			error = $translationStore.translations?.users.loadError || 'Error loading user';
			console.error('Error loading user:', err);
		} finally {
			isLoading = false;
		}
	}

	async function saveUser() {
		if (!user) return;

		isSaving = true;
		error = null;
		successMessage = null;

		try {
			const updatedUser = await adminApi.updateUser(user._id, formData);
			user = updatedUser.user;
			successMessage =
				$translationStore.translations?.users.updateSuccess || 'User updated successfully';
			isEditing = false;
		} catch (err) {
			error = $translationStore.translations?.users.updateError || 'Error updating user';
			console.error('Error updating user:', err);
		} finally {
			isSaving = false;
		}
	}

	async function deleteUser() {
		if (!user) return;

		if (
			!confirm(
				$translationStore.translations?.users.deleteConfirm ||
					'Are you sure you want to delete this user?'
			)
		) {
			return;
		}

		isDeleting = true;
		error = null;

		try {
			await adminApi.deleteUser(user._id);
			goto('/users');
		} catch (err) {
			error = $translationStore.translations?.users.deleteError || 'Error deleting user';
			console.error('Error deleting user:', err);
		} finally {
			isDeleting = false;
		}
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
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold" style="color: var(--text-primary);">
				{$translationStore.translations?.users.userDetails || 'User Details'}
			</h1>
			<p class="mt-1 text-sm" style="color: var(--text-secondary);">
				{$translationStore.translations?.users.manageUser ||
					'Manage user information and permissions'}
			</p>
		</div>
		<div class="flex gap-3">
			<button
				on:click={() => goto('/users')}
				class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
				style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary);"
			>
				{$translationStore.translations?.users.backToList || 'Back to Users'}
			</button>
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

	<!-- Success Message -->
	{#if successMessage}
		<div class="mb-4 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-green-800 dark:text-green-200">{successMessage}</h3>
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
					{$translationStore.translations?.users.loading || 'Loading user...'}
				</p>
			</div>
		</div>
	{:else if user}
		<!-- User Information -->
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- User Details Card -->
			<div
				class="rounded-lg border p-6"
				style="border-color: var(--border-primary); background-color: var(--bg-secondary);"
			>
				<div class="mb-4 flex items-center justify-between">
					<div>
						<h2 class="text-lg font-semibold" style="color: var(--text-primary);">
							{$translationStore.translations?.users.userInfo || 'User Information'}
						</h2>
						{#if !canChangeRole && !canChangeActive}
							<p class="text-xs" style="color: var(--text-tertiary);">
								{$translationStore.translations?.users.readOnly ||
									'Read-only mode: You can only view user information'}
							</p>
						{:else if !canChangeRole}
							<p class="text-xs" style="color: var(--text-tertiary);">
								{$translationStore.translations?.users.limitedEdit ||
									'Limited edit: You can modify username, email and status, but not role'}
							</p>
						{/if}
					</div>
					{#if !isEditing && (canChangeRole || canChangeActive)}
						<button
							on:click={() => (isEditing = true)}
							class="rounded-md border px-3 py-1 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
							style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary);"
						>
							{$translationStore.translations?.users.edit || 'Edit'}
						</button>
					{/if}
				</div>

				{#if isEditing}
					<!-- Edit Form -->
					<form on:submit|preventDefault={saveUser} class="space-y-4">
						<div>
							<label
								for="username"
								class="block text-sm font-medium"
								style="color: var(--text-primary);"
							>
								{$translationStore.translations?.users.username || 'Username'}
							</label>
							<input
								id="username"
								type="text"
								bind:value={formData.username}
								required
								class="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
								style="border-color: var(--border-primary); background-color: var(--bg-primary); color: var(--text-primary);"
							/>
						</div>

						<div>
							<label
								for="email"
								class="block text-sm font-medium"
								style="color: var(--text-primary);"
							>
								{$translationStore.translations?.users.email || 'Email'}
							</label>
							<input
								id="email"
								type="email"
								bind:value={formData.email}
								required
								class="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
								style="border-color: var(--border-primary); background-color: var(--bg-primary); color: var(--text-primary);"
							/>
						</div>

						{#if canChangeRole}
							<div>
								<label
									for="role"
									class="block text-sm font-medium"
									style="color: var(--text-primary);"
								>
									{$translationStore.translations?.users.role || 'Role'}
								</label>
								<select
									id="role"
									bind:value={formData.role}
									class="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
									style="border-color: var(--border-primary); background-color: var(--bg-primary); color: var(--text-primary);"
								>
									<option value="USER">USER</option>
									<option value="ADMIN">ADMIN</option>
									<option value="ROOT">ROOT</option>
								</select>
							</div>
						{/if}

						{#if canChangeActive}
							<div>
								<label
									for="active"
									class="block text-sm font-medium"
									style="color: var(--text-primary);"
								>
									{$translationStore.translations?.users.status || 'Status'}
								</label>
								<select
									id="active"
									bind:value={formData.active}
									class="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
									style="border-color: var(--border-primary); background-color: var(--bg-primary); color: var(--text-primary);"
								>
									<option value={true}>
										{$translationStore.translations?.users.active || 'Active'}
									</option>
									<option value={false}>
										{$translationStore.translations?.users.inactive || 'Inactive'}
									</option>
								</select>
							</div>
						{/if}

						<div class="flex gap-3 pt-4">
							<button
								type="submit"
								disabled={isSaving}
								class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
							>
								{isSaving
									? $translationStore.translations?.users.saving || 'Saving...'
									: $translationStore.translations?.users.save || 'Save'}
							</button>
							<button
								type="button"
								on:click={() => {
									isEditing = false;
									if (user) {
										formData = {
											username: user.username,
											email: user.email,
											role: user.role as 'ROOT' | 'ADMIN' | 'USER',
											active: user.active
										};
									}
								}}
								class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
								style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary);"
							>
								{$translationStore.translations?.users.cancel || 'Cancel'}
							</button>
						</div>
					</form>
				{:else if user}
					<!-- Display Mode -->
					<div class="space-y-4">
						<div>
							<label
								for="display-username"
								class="block text-sm font-medium"
								style="color: var(--text-secondary);"
							>
								{$translationStore.translations?.users.username || 'Username'}
							</label>
							<p id="display-username" class="mt-1 text-sm" style="color: var(--text-primary);">
								{user.username}
							</p>
						</div>

						<div>
							<label
								for="display-email"
								class="block text-sm font-medium"
								style="color: var(--text-secondary);"
							>
								{$translationStore.translations?.users.email || 'Email'}
							</label>
							<p id="display-email" class="mt-1 text-sm" style="color: var(--text-primary);">
								{user.email}
							</p>
						</div>

						<div>
							<label
								for="display-role"
								class="block text-sm font-medium"
								style="color: var(--text-secondary);"
							>
								{$translationStore.translations?.users.role || 'Role'}
							</label>
							<div id="display-role" class="mt-1">
								<span class={getRoleBadgeClass(user.role)}>
									{user.role}
								</span>
							</div>
						</div>

						<div>
							<label
								for="display-status"
								class="block text-sm font-medium"
								style="color: var(--text-secondary);"
							>
								{$translationStore.translations?.users.status || 'Status'}
							</label>
							<div id="display-status" class="mt-1">
								<span class={getStatusBadgeClass(user.active)}>
									{user.active
										? $translationStore.translations?.users.active || 'Active'
										: $translationStore.translations?.users.inactive || 'Inactive'}
								</span>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- User Stats Card -->
			<div
				class="rounded-lg border p-6"
				style="border-color: var(--border-primary); background-color: var(--bg-secondary);"
			>
				<h2 class="mb-4 text-lg font-semibold" style="color: var(--text-primary);">
					{$translationStore.translations?.users.userStats || 'User Statistics'}
				</h2>

				<div class="space-y-4">
					<div>
						<label
							for="user-id"
							class="block text-sm font-medium"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.users.userId || 'User ID'}
						</label>
						<p id="user-id" class="mt-1 font-mono text-sm" style="color: var(--text-primary);">
							{user._id}
						</p>
					</div>

					<div>
						<label
							for="created-at"
							class="block text-sm font-medium"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.users.createdAt || 'Created At'}
						</label>
						<p id="created-at" class="mt-1 text-sm" style="color: var(--text-primary);">
							{formatDate(user.createdAt)}
						</p>
					</div>

					<div>
						<label
							for="updated-at"
							class="block text-sm font-medium"
							style="color: var(--text-secondary);"
						>
							{$translationStore.translations?.users.updatedAt || 'Updated At'}
						</label>
						<p id="updated-at" class="mt-1 text-sm" style="color: var(--text-primary);">
							{formatDate(user.updatedAt)}
						</p>
					</div>
				</div>

				<!-- Danger Zone -->
				<div class="mt-6 border-t pt-6" style="border-color: var(--border-primary);">
					<h3 class="text-sm font-medium text-red-600 dark:text-red-400">
						{$translationStore.translations?.users.dangerZone || 'Danger Zone'}
					</h3>
					<p class="mt-1 text-sm" style="color: var(--text-secondary);">
						{$translationStore.translations?.users.deleteWarning ||
							'Once you delete a user, there is no going back. Please be certain.'}
					</p>
					<button
						on:click={deleteUser}
						disabled={isDeleting}
						class="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
					>
						{isDeleting
							? $translationStore.translations?.users.deleting || 'Deleting...'
							: $translationStore.translations?.users.deleteUser || 'Delete User'}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
