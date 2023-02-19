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

	const themes = [
		{
			label: 'White',
			value: 'white'
		},
		{
			label: 'Gray (10)',
			value: 'g10'
		},
		{
			label: 'Gray (80)',
			value: 'g80'
		},
		{
			label: 'Gray (90)',
			value: 'g90'
		},
		{
			label: 'Gray (100)',
			value: 'g100'
		}
	];

	const fontSizes = [
		{
			label: 'Small',
			value: '16'
		},
		{
			label: 'Medium',
			value: '18'
		},
		{
			label: 'Large',
			value: '20'
		}
	];

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
	{#each themes as { label, value }}
		<RadioButton labelText={label} {value} />
	{/each}
</RadioButtonGroup>

<RadioButtonGroup legendText="Font Size" bind:selected={globalFontSizeValue} class="mt-8">
	{#each fontSizes as { label, value }}
		<RadioButton labelText={label} {value} />
	{/each}
</RadioButtonGroup>
