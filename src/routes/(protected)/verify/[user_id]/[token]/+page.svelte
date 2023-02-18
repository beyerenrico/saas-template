<script lang="ts">
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import { Grid, Row, Column } from 'carbon-components-svelte';
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME} | Email verification</title>
</svelte:head>

<Grid class="max-w-xl h-full flex flex-col justify-center">
	<Row>
		<Column class="mb-8">
			<h1 class="text-3xl font-bold">Verifying email address...</h1>
		</Column>
	</Row>
</Grid>
