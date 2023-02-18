<script lang="ts">
	import type { PageData } from './$types';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';

	export let data: PageData;
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME} | App</title>
</svelte:head>

<Breadcrumb noTrailingSlash class="mb-4">
	<BreadcrumbItem href="/app" isCurrentPage>Overview</BreadcrumbItem>
</Breadcrumb>

<h1>Welcome, {data.user?.name}</h1>
