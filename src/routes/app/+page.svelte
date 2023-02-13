<script lang="ts">
	import type { PageData } from './$types';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Budgetly | App</title>
</svelte:head>

<Breadcrumb noTrailingSlash class="mb-4">
	<BreadcrumbItem href="/app" isCurrentPage>Overview</BreadcrumbItem>
</Breadcrumb>

<h1>Welcome, {data.user?.name}</h1>
