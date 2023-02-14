<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { toast } from '@zerodevx/svelte-toast';
	import {
		Button,
		CopyButton,
		ListItem,
		Modal,
		OrderedList,
		PasswordInput,
		SkeletonPlaceholder,
		TextInput
	} from 'carbon-components-svelte';

	type Factor = {
		id: string;
		qr: string;
		secret: string;
		uri: string;
		user_id: string;
		verified: string;
	};

	export let factor: Factor;

	let open = false;
	let loading = false;
	let newFactor: Factor;

	const submitCreateFactor: SubmitFunction = () => {
		loading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					open = true;
					newFactor = result.data as typeof newFactor;
					break;
				case 'error':
					break;
				case 'failure':
					break;
				default:
					break;
			}

			update();

			loading = false;
		};
	};

	const submitVerifyFactor: SubmitFunction = () => {
		loading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					open = false;

					toast.push('Two-factor authentication has been enabled. You will be logged out.', {
						duration: 20000
					});
					break;
				case 'error':
					break;
				case 'failure':
					break;
				default:
					break;
			}

			update();

			loading = false;
		};
	};

	const submitDeleteFactor: SubmitFunction = () => {
		loading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					open = false;

					toast.push('Two-factor authentication has been removed. You will be logged out.', {
						duration: 20000
					});
					break;
				case 'error':
					break;
				case 'failure':
					break;
				default:
					break;
			}

			update();

			loading = false;
		};
	};
</script>

<h2>Mobile App Authentication (2FA)</h2>
<p class="mb-4">Secure your account with TOTP two-factor authentication.</p>

{#if factor === null || !factor?.verified}
	<form action="?/createFactor" method="POST" use:enhance={submitCreateFactor}>
		<Button type="submit" disabled={loading}>Setup 2FA</Button>
	</form>

	<Modal
		passiveModal
		modalHeading="Setup Two-Factor Authentication"
		primaryButtonText="Verify & Activate"
		secondaryButtonText="Cancel"
		bind:open
		on:open
		on:close
	>
		<h3 class="text-[16px] font-bold mb-2">Configuring your mobile authentication app</h3>
		<OrderedList class="ml-6">
			<ListItem
				>Install a mobile authentication app, for example Goolge Authenticator or Authy</ListItem
			>
			<ListItem>In the authenticator app, press the "+" icon</ListItem>
			<ListItem
				>Select to scan a QR code and use the phone's camera to scan the QR code below</ListItem
			>
		</OrderedList>

		<h3 class="text-[16px] font-bold mb-2 mt-6">Scan QR Code</h3>
		{#if newFactor?.qr}
			<img src={newFactor.qr} alt="QR Code" style="height: 16rem; width: 16rem;" />
		{:else}
			<SkeletonPlaceholder style="height: 16rem; width: 16rem;" />
		{/if}

		<h3 class="text-[16px] font-bold mb-2 mt-6">Or use the code below to setup your app</h3>
		<div class="flex items-center gap-2">
			<PasswordInput
				readonly
				labelText="Secret Key"
				value={newFactor?.secret}
				helperText="Do not share this code with anyone!"
				hidePasswordLabel="Hide"
				showPasswordLabel="Show"
			/>
			<CopyButton text={newFactor?.secret} feedback="Copied to clipboard" class="mt-1" />
		</div>

		<h3 class="text-[16px] font-bold mb-2 mt-6">Verify code</h3>
		<form action="?/verifyFactor" method="POST" use:enhance={submitVerifyFactor}>
			<TextInput
				type="text"
				placeholder="Authentication Code"
				required
				id="authCode"
				name="authCode"
				helperText="To confirm the activation please enter the authentication code provided by the app"
			/>
			<div class="flex mt-6 gap-2">
				<Button type="button" kind="secondary" on:click={() => (open = false)}>Cancel</Button>
				<Button type="submit">Verify & Activate</Button>
				<input type="hidden" name="secret" value={newFactor?.secret} />
			</div>
		</form>
	</Modal>
{:else}
	<p class="mb-2">
		You have enabled two-factor authentication. To disable it, click the button below.
	</p>
	<form action="?/deleteFactor" method="POST" use:enhance={submitDeleteFactor}>
		<Button type="submit" disabled={loading}>Disable 2FA</Button>
	</form>
{/if}
