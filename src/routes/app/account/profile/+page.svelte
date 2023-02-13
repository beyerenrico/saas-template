<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { toast } from '@zerodevx/svelte-toast';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		FormGroup,
		InlineNotification,
		TextInput
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
					toast.push('Profile updated.');
					break;
				case 'error':
					toast.push('There was an error updating your profile.');
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
	<title>Budgetly | Account | Profile</title>
</svelte:head>

<Breadcrumb noTrailingSlash class="mb-4">
	<BreadcrumbItem href="/app">Overview</BreadcrumbItem>
	<BreadcrumbItem href="/app/account">Account</BreadcrumbItem>
	<BreadcrumbItem href="/app/account/profile" isCurrentPage>Profile</BreadcrumbItem>
</Breadcrumb>

<h1>Profile</h1>

{#if form?.error}
	<InlineNotification title="Error:" subtitle="Please check the form and try again." />
{/if}
{#if form?.message}
	<InlineNotification title="Error:" subtitle={form.message} />
{/if}
<form method="POST" class="pt-8" use:enhance={submitUpdate}>
	<FormGroup>
		<TextInput
			disabled={loading}
			type="text"
			labelText="Name"
			placeholder="Enter name..."
			required
			id="name"
			name="name"
			value={user?.name}
			invalidText={form?.error
				? form?.errors
						?.filter((e) => e.field === 'name')
						.map((e) => e.message)
						.join(', ')
				: ''}
			invalid={form?.error ? form?.errors?.filter((e) => e.field === 'name').length > 0 : false}
		/>
	</FormGroup>
	<FormGroup>
		<TextInput
			disabled={loading}
			type="email"
			labelText="Email"
			placeholder="Enter email..."
			required
			id="email"
			name="email"
			value={user?.email}
			invalidText={form?.error
				? form?.errors
						?.filter((e) => e.field === 'email')
						.map((e) => e.message)
						.join(', ')
				: ''}
			invalid={form?.error
				? form?.errors?.filter((e) => e.field === 'email').length > 0
				: form?.message
				? true
				: false}
		/>
	</FormGroup>
	<Button type="submit" disabled={loading}>Update Profile</Button>
</form>
