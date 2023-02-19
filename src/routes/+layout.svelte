<script lang="ts">
	import { browser } from '$app/environment';
	import { globalFontSize, theme } from '$lib/stores';
	import { LocalStorage, Theme } from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/all.css';
	import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';
	import '../app.postcss';
	import NotificationOutput from '../components/NotificationOutput.svelte';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { toast } from '$lib/notification';

	let themeValue: CarbonTheme;
	let globalFontSizeValue: string;

	theme.subscribe((value) => {
		themeValue = value;
	});

	globalFontSize.subscribe((value) => {
		globalFontSizeValue = value;

		if (browser) {
			document.documentElement.style.fontSize = value + 'px';
		}
	});

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

	$: globalFontSize.set(globalFontSizeValue);
</script>

<Theme bind:theme={themeValue} persist persistKey="__carbon-theme" />
<LocalStorage key="font-size" bind:value={globalFontSizeValue} />
<NotificationOutput />
<slot />
