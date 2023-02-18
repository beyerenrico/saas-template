<script lang="ts">
	import 'carbon-components-svelte/css/g90.css';
	import '../app.postcss';
	import NotificationOutput from '../components/NotificationOutput.svelte';
	import { toast } from '$lib/notification';
	onMount(() => {
		if ($page.url.searchParams.get('logout') === 'success') {
			toast({
				kind: 'success',
				title: 'Logout successful',
				caption: new Date().toLocaleString()
			});
		}

		if ($page.url.searchParams.get('factorDeleted') === 'success') {
			toast({
				kind: 'warning',
				title: 'Two-factor authentication has been disabled',
				subtitle: 'You have been logged out on all devices',
				caption: new Date().toLocaleString()
			});
		}

		if ($page.url.searchParams.get('passwordChanged') === 'success') {
			toast({
				kind: 'success',
				title: 'Password has been changed',
				subtitle: 'Please login with your new credentials',
				caption: new Date().toLocaleString()
			});
		}

		if ($page.url.searchParams.get('emailVerified') === 'success') {
			toast({
				kind: 'success',
				title: 'Your email has been verified',
				caption: new Date().toLocaleString()
			});
		}
	});
</script>

<slot />
