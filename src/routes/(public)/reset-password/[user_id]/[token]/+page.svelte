<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { PasswordInput, Grid, Row, Column, Button, FormGroup } from 'carbon-components-svelte';
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
	<title>Budgetly | Create a new password</title>
</svelte:head>

<Grid class="max-w-xl h-full flex flex-col justify-center">
	<Row>
		<Column class="mb-8">
			<h1 class="text-3xl font-bold">Create a new password</h1>
		</Column>
	</Row>
	<Row>
		<Column>
			<form method="POST" use:enhance={submitPasswordReset}>
				<FormGroup>
					<PasswordInput
						disabled={loading}
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
						invalid={form?.error
							? form?.errors?.filter((e) => e.field === 'password').length > 0
							: false}
					/>
				</FormGroup>
				<FormGroup>
					<PasswordInput
						disabled={loading}
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
				<Button type="submit" disabled={loading} class="w-full max-w-full flex justify-center p-2"
					>Reset password</Button
				>
			</form>
		</Column>
	</Row>
</Grid>
