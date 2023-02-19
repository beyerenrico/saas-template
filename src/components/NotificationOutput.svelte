<script lang="ts">
	import { notifications } from '$lib/notification';
	import { ToastNotification } from 'carbon-components-svelte';
	import { fly } from 'svelte/transition';
</script>

{#if $notifications}
	<div class="absolute right-3 top-0 z-[9001]">
		{#each $notifications as { title, subtitle, caption, kind }}
			<div transition:fly={{ x: 500 }} class="w-[24rem]">
				<ToastNotification {kind} {title} {subtitle} {caption} fullWidth />
			</div>
		{/each}
	</div>
{/if}
