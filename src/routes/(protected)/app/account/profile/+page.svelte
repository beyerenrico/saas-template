<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import { defaultEnhanceFunction, noClearEnhanceFunction } from '$lib/utils';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		FormGroup,
		TextInput
	} from 'carbon-components-svelte';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;

	$: ({ user } = data);
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME} | Account | Profile</title>
</svelte:head>

<Breadcrumb noTrailingSlash class="mb-4">
	<BreadcrumbItem href="/app">Overview</BreadcrumbItem>
	<BreadcrumbItem href="/app/account">Account</BreadcrumbItem>
	<BreadcrumbItem href="/app/account/profile" isCurrentPage>Profile</BreadcrumbItem>
</Breadcrumb>

<h1>Profile</h1>

<form method="POST" class="pt-8" use:enhance={defaultEnhanceFunction}>
	<FormGroup>
		<TextInput
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
			type="email"
			labelText="Email"
			placeholder="Enter email..."
			required
			id="email"
			name="email"
			value={user?.email}
			warn={user?.verified ? false : true}
			warnText="Your email is not verified yet"
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
	<Button type="submit">Update Profile</Button>
</form>
