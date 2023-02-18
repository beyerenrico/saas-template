<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import { defaultEnhanceFunction } from '$lib/utils';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		FormGroup,
		PasswordInput
	} from 'carbon-components-svelte';
	import type { ActionData, PageData } from './$types';
	import MobileAppAuthetication from './MobileAppAuthetication.svelte';

	export let form: ActionData;
	export let data: PageData;

	$: ({ factor } = data);
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME} | Account | Security</title>
</svelte:head>

<Breadcrumb noTrailingSlash class="mb-4">
	<BreadcrumbItem href="/app">Overview</BreadcrumbItem>
	<BreadcrumbItem href="/app/account">Account</BreadcrumbItem>
	<BreadcrumbItem href="/app/account/security" isCurrentPage>Security</BreadcrumbItem>
</Breadcrumb>

<h2>Password</h2>

<form action="?/updatePassword" method="POST" class="pt-8" use:enhance={defaultEnhanceFunction}>
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
	<Button type="submit">Update Password</Button>
</form>

<hr class="my-12 border-gray-500" />

<MobileAppAuthetication {factor} />
