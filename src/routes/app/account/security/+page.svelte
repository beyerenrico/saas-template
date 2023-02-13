<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { toast } from '@zerodevx/svelte-toast';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		FormGroup,
		InlineNotification,
		PasswordInput
	} from 'carbon-components-svelte';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;

	let loading = false;

	const submitUpdate: SubmitFunction = () => {
		loading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
				case 'redirect':
					toast.push('Password updated. Please log in with your new credentials.', {
						duration: 20000
					});
					update();
					break;
				case 'error':
					toast.push('There was an error updating your password.');
					break;
				case 'failure':
					update();
					break;
				default:
					break;
			}

			loading = false;
		};
	};

	$: ({ user } = data);
</script>

<svelte:head>
	<title>Budgetly | Account | Security</title>
</svelte:head>

<Breadcrumb noTrailingSlash class="mb-4">
	<BreadcrumbItem href="/app">Overview</BreadcrumbItem>
	<BreadcrumbItem href="/app/account">Account</BreadcrumbItem>
	<BreadcrumbItem href="/app/account/security" isCurrentPage>Security</BreadcrumbItem>
</Breadcrumb>

<h1>Security</h1>

{#if form?.error}
	<InlineNotification title="Error:" subtitle="Please check the form and try again." />
{/if}
{#if form?.message}
	<InlineNotification title="Error:" subtitle={form.message} />
{/if}
<form method="POST" class="pt-8" use:enhance={submitUpdate}>
	<FormGroup>
		<PasswordInput
			required
			type="password"
			labelText="Old Password"
			placeholder="Enter old password..."
			id="oldPassword"
			name="oldPassword"
			invalidText={form?.error
				? form?.errors
						?.filter((e) => e.field === 'oldPassword')
						.map((e) => e.message)
						.join(', ')
				: ''}
			invalid={form?.error
				? form?.errors?.filter((e) => e.field === 'oldPassword').length > 0
				: false}
		/>
	</FormGroup>
	<FormGroup>
		<PasswordInput
			required
			type="password"
			labelText="Password"
			placeholder="Enter password..."
			id="password"
			name="password"
			invalidText={form?.error
				? form?.errors
						?.filter((e) => e.field === 'password')
						.map((e) => e.message)
						.join(', ')
				: ''}
			invalid={form?.error ? form?.errors?.filter((e) => e.field === 'password').length > 0 : false}
		/>
	</FormGroup>
	<FormGroup>
		<PasswordInput
			required
			type="password"
			labelText="Confirm Password"
			placeholder="Confirm password..."
			id="passwordConfirm"
			name="passwordConfirm"
			invalidText={form?.error
				? form?.errors
						?.filter((e) => e.field === 'passwordConfirm')
						.map((e) => e.message)
						.join(', ')
				: ''}
			invalid={form?.error
				? form?.errors?.filter((e) => e.field === 'passwordConfirm').length > 0
				: false}
		/>
	</FormGroup>
	<Button type="submit" disabled={loading}>Update Password</Button>
</form>
