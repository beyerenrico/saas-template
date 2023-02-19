<script lang="ts">
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import { globalFontSize, theme } from '$lib/stores';
	import {
		Breadcrumb,
		BreadcrumbItem,
		RadioButton,
		RadioButtonGroup
	} from 'carbon-components-svelte';
	import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';

	let themeValue: CarbonTheme;
	let globalFontSizeValue: string;

	theme.subscribe((value) => {
		themeValue = value;
	});

	globalFontSize.subscribe((value) => {
		globalFontSizeValue = value.toString();
	});

	$: theme.set(themeValue);
	$: globalFontSize.set(globalFontSizeValue);
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME} | Account | Settings</title>
</svelte:head>

<Breadcrumb noTrailingSlash class="mb-4">
	<BreadcrumbItem href="/app">Overview</BreadcrumbItem>
	<BreadcrumbItem href="/app/account">Account</BreadcrumbItem>
	<BreadcrumbItem href="/app/account/settings" isCurrentPage>Settings</BreadcrumbItem>
</Breadcrumb>

<h1>Settings</h1>

<RadioButtonGroup legendText="Color Theme" bind:selected={themeValue} class="mt-8">
	{#each ['white', 'g10', 'g80', 'g90', 'g100'] as value}
		<RadioButton labelText={value} {value} />
	{/each}
</RadioButtonGroup>

<RadioButtonGroup legendText="Font Size" bind:selected={globalFontSizeValue} class="mt-8">
	{#each ['16', '18', '20', '24', '30'] as value}
		<RadioButton labelText="{value}px" {value} />
	{/each}
</RadioButtonGroup>
