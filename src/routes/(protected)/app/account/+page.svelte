<script>
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import { Breadcrumb, BreadcrumbItem, ClickableTile } from 'carbon-components-svelte';
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME} | Account</title>
</svelte:head>

<Breadcrumb noTrailingSlash class="mb-4">
	<BreadcrumbItem href="/app">Overview</BreadcrumbItem>
	<BreadcrumbItem href="/app/account" isCurrentPage>Account</BreadcrumbItem>
</Breadcrumb>

<h1>Account</h1>

<div class="mt-4 flex flex-col space-y-2">
	<ClickableTile href="/app/account/profile">Profile</ClickableTile>
	<ClickableTile href="/app/account/settings">Settings</ClickableTile>
	<ClickableTile href="/app/account/security">Security</ClickableTile>
</div>
