<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import { enhance } from '$app/forms';
	import {
		TextInput,
		PasswordInput,
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
</script>

<svelte:head>
	<title>Budgetly | Login</title>
</svelte:head>

<Grid class="max-w-xl h-full flex flex-col justify-center">
	<Row>
		<Column class="mb-8">
			<h1 class="text-3xl font-bold">Sign in to your account</h1>
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
				<InlineNotification title="Error:" subtitle={form?.message} />
			{/if}
			<form method="POST" use:enhance>
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
							: form?.message
							? true
							: false}
					/>
					<div class="pt-2">
						<small>
							Forgot password? <Link href="/reset-password">Reset password</Link>
						</small>
					</div>
				</FormGroup>
				<Button type="submit" class="w-full max-w-full flex justify-center p-2">Login</Button>
			</form>
		</Column>
	</Row>
</Grid>
