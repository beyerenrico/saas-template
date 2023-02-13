<script>
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
</script>

<svelte:head>
	<title>Budgetly | Account</title>
</svelte:head>

<Breadcrumb noTrailingSlash class="mb-4">
	<BreadcrumbItem href="/app">Overview</BreadcrumbItem>
	<BreadcrumbItem href="/app/account" isCurrentPage>Account</BreadcrumbItem>
</Breadcrumb>

<h1>Account</h1>
