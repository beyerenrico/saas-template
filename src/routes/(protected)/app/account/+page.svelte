<script>
	import { PUBLIC_APP_NAME } from '$env/static/public';
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME} | Account</title>
</svelte:head>

<Breadcrumb noTrailingSlash class="mb-4">
	<BreadcrumbItem href="/app">Overview</BreadcrumbItem>
	<BreadcrumbItem href="/app/account" isCurrentPage>Account</BreadcrumbItem>
</Breadcrumb>

<h1>Account</h1>
