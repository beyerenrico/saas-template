<script lang="ts">
	import { browser } from '$app/environment';
	import { globalFontSize, theme } from '$lib/stores';
	import { LocalStorage, Theme } from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/all.css';
	import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';
	import '../app.postcss';
	import NotificationOutput from '../components/NotificationOutput.svelte';

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

	$: globalFontSize.set(globalFontSizeValue);
</script>

<Theme bind:theme={themeValue} persist persistKey="__carbon-theme" />
<LocalStorage key="font-size" bind:value={globalFontSizeValue} />
<NotificationOutput />
<slot />
