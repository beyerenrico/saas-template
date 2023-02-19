<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { PUBLIC_APP_NAME } from '$env/static/public';

	import { Button, Column, Grid, InlineNotification, Row } from 'carbon-components-svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;

	const submitVerification: SubmitFunction = () => {
		loading = true;

		return async ({ update }) => {
			update();
			loading = false;
		};
	};

	$: ({ user } = data);
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME} | Verify your email address</title>
</svelte:head>

<Grid class="max-w-xl h-full flex flex-col justify-center">
	<Row>
		<Column class="mb-8 text-center">
			<h1 class="text-3xl font-bold mb-4">Verify your email address</h1>
			<p>You have entered <strong>{user.email}</strong> as the email address for your account.</p>
			<p>Please click the button below to verify your email address.</p>
		</Column>
	</Row>
	<Row>
		<Column>
			<form method="POST" use:enhance={submitVerification}>
				<input type="hidden" name="email" value={user.email} />
				<Button type="submit" disabled={loading} class="w-full max-w-full flex justify-center p-2">
					{#if form?.type === 'success'}
						Resend verification email
					{:else}
						Verify your email
					{/if}
				</Button>
			</form>
			{#if form?.message}
				<InlineNotification kind={form?.type ?? 'info'} subtitle={form?.message} />
			{/if}
		</Column>
	</Row>
</Grid>
