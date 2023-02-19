<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import { onMount } from 'svelte';
	import { notifications } from '$lib/notification';

	export let data: PageData;

	onMount(() => {
		if ($page.url.searchParams.get('emailVerified') === 'success') {
			notifications.enqueue({
				kind: 'success',
				title: 'Your email has been verified',
				caption: new Date().toLocaleString(),
				timeout: 5000
			});
		}
	});
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME} | App</title>
</svelte:head>

<Breadcrumb noTrailingSlash class="mb-4">
	<BreadcrumbItem href="/app" isCurrentPage>Overview</BreadcrumbItem>
</Breadcrumb>

<h1>Welcome, {data.user?.name}</h1>
