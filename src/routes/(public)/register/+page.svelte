<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		TextInput,
		PasswordInput,
		Grid,
		Row,
		Column,
		Button,
		FormGroup,
		Link
	} from 'carbon-components-svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Budgetly | Register</title>
</svelte:head>
<Grid class="max-w-xl h-full flex flex-col justify-center">
	<Row>
		<Column class="mb-8">
			<h1 class="text-3xl font-bold">Create a new account</h1>
			<p class="text-gray-500">
				Already have an account? <Link href="/login">Sign in</Link>
			</p>
		</Column>
	</Row>
	<Row>
		<Column>
			<form method="POST" use:enhance>
				<FormGroup>
					<TextInput
						type="text"
						labelText="Name"
						placeholder="Enter name..."
						required
						id="name"
						name="name"
						invalidText={form?.error
							? form?.errors
									?.filter((e) => e.field === 'name')
									.map((e) => e.message)
									.join(', ')
							: ''}
						invalid={form?.error
							? form?.errors?.filter((e) => e.field === 'name').length > 0
							: false}
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
						invalid={form?.error
							? form?.errors?.filter((e) => e.field === 'password').length > 0
							: false}
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
				<Button type="submit" class="w-full max-w-full flex justify-center p-2">Register</Button>
			</form>
		</Column>
	</Row>
</Grid>
