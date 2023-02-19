<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { PUBLIC_APP_NAME } from '$env/static/public';
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
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';
	import { page } from '$app/stores';
	import { notifications } from '$lib/notification';

	export let form: ActionData;

	let factor: App.Factor;
	let loading = false;

	onMount(() => {
		if ($page.url.searchParams.get('logout') === 'success') {
			notifications.enqueue({
				kind: 'success',
				title: 'Logout successful',
				caption: new Date().toLocaleString(),
				timeout: 5000
			});
		}

		if ($page.url.searchParams.get('factorDeleted') === 'success') {
			notifications.enqueue({
				kind: 'warning',
				title: 'Two-factor authentication has been disabled',
				subtitle: 'You have been logged out on all devices',
				caption: new Date().toLocaleString(),
				timeout: 5000
			});
		}

		if ($page.url.searchParams.get('passwordChanged') === 'success') {
			notifications.enqueue({
				kind: 'success',
				title: 'Password has been changed',
				subtitle: 'Please login with your new credentials',
				caption: new Date().toLocaleString(),
				timeout: 5000
			});
		}

		if ($page.url.searchParams.get('emailChanged') === 'success') {
			notifications.enqueue({
				kind: 'success',
				title: 'Your email has been changed',
				subtitle: 'You have been logged out on all devices',
				caption: new Date().toLocaleString(),
				timeout: 5000
			});
		}
	});

	const submitLogin: SubmitFunction = () => {
		loading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					factor = result.data?.factor as App.Factor;
					update();
					break;
				case 'redirect':
					notifications.enqueue({
						kind: 'success',
						title: 'Successful login',
						caption: new Date().toLocaleString(),
						timeout: 5000
					});
					update();
					break;
				case 'failure':
					notifications.enqueue({
						kind: 'error',
						title: 'Login failed',
						caption: result.data?.message,
						timeout: 5000
					});
					break;
			}
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME} | Login</title>
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
			{#if factor}
				<p class="mb-4">Please authenticate to proceed with your login</p>
				<form action="?/verifyFactor" method="POST" use:enhance={submitLogin}>
					<FormGroup>
						<TextInput
							type="text"
							labelText="Verification Code"
							placeholder="Enter verification code..."
							required
							id="authCode"
							name="authCode"
						/>
					</FormGroup>
					<Button type="submit" class="w-full max-w-full flex justify-center p-2">Verify</Button>
					<input type="hidden" name="secret" value={factor?.secret} />
					<input type="hidden" name="userId" value={factor?.user_id} />
				</form>
			{:else}
				<form action="?/login" method="POST" use:enhance={submitLogin}>
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
			{/if}
		</Column>
	</Row>
</Grid>
