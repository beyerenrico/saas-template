<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import {
		TextInput,
		Grid,
		Row,
		Column,
		Button,
		FormGroup,
		InlineNotification,
		Link
	} from 'carbon-components-svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading = false;

	const submitPasswordReset: SubmitFunction = () => {
		loading = true;

		return async ({ update }) => {
			update();
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>Budgetly | Forgot password?</title>
</svelte:head>

<Grid class="max-w-xl h-full flex flex-col justify-center">
	<Row>
		<Column class="mb-8">
			<h1 class="text-3xl font-bold">Reset your password</h1>
			<p class="text-gray-500">
				Don't have an account? <Link href="/register">Sign up</Link>
			</p>
		</Column>
	</Row>
	<Row>
		<Column>
			{#if form?.error}
				<InlineNotification title="Error:" subtitle="Please check the form and try again." />
			{/if}
			{#if form?.message}
				<InlineNotification kind="success" subtitle={form?.message} />
			{/if}
			<form method="POST" use:enhance={submitPasswordReset}>
				<FormGroup>
					<TextInput
						disabled={loading}
						type="email"
						labelText="Email"
						placeholder="Enter email..."
						required
						id="email"
						name="email"
						invalidText={form?.error
							? form?.errors
									?.filter((e) => e.field === 'email')
									.map((e) => e.message)
									.join(', ')
							: ''}
						invalid={form?.error
							? form?.errors?.filter((e) => e.field === 'email').length > 0
							: false}
					/>
				</FormGroup>
				<Button type="submit" disabled={loading} class="w-full max-w-full flex justify-center p-2"
					>Send reset request</Button
				>
			</form>
		</Column>
	</Row>
</Grid>
