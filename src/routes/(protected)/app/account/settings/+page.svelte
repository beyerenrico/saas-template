<script>
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
</script>

<svelte:head>
	<title>Budgetly | Account | Settings</title>
</svelte:head>

<Breadcrumb noTrailingSlash class="mb-4">
	<BreadcrumbItem href="/app">Overview</BreadcrumbItem>
	<BreadcrumbItem href="/app/account">Account</BreadcrumbItem>
	<BreadcrumbItem href="/app/account/settings" isCurrentPage>Settings</BreadcrumbItem>
</Breadcrumb>

<h1>Settings</h1>
