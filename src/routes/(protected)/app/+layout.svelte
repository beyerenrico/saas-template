<script lang="ts">
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink,
		SideNav,
		SideNavItems,
		SideNavLink,
		SkipToContent,
		Content,
		Grid,
		Row,
		Column,
		Button
	} from 'carbon-components-svelte';
	import { Home, UserAvatarFilledAlt } from 'carbon-icons-svelte';
	import { page } from '$app/stores';
	import { PUBLIC_APP_NAME } from '$env/static/public';

	let isSideNavOpen = false;
	let isOpen1 = false;

	const navItems = [
		{
			text: 'Overview',
			href: '/app',
			icon: Home
		}
	];

	const headerPanelItems = [
		{
			text: 'Profile',
			href: '/app/account/profile'
		},
		{
			text: 'Settings',
			href: '/app/account/settings'
		},
		{
			text: 'Security',
			href: '/app/account/security'
		}
	];
</script>

<Header company={PUBLIC_APP_NAME} platformName="v0.0.1" bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderAction bind:isOpen={isOpen1} icon={UserAvatarFilledAlt} closeIcon={UserAvatarFilledAlt}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Account</HeaderPanelDivider>
				{#each headerPanelItems as { href, text }}
					<HeaderPanelLink {href}>{text}</HeaderPanelLink>
				{/each}
				<HeaderPanelDivider />
				<form method="POST" action="/logout">
					<Button type="submit" class="ml-4">Logout</Button>
				</form>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
	<SideNavItems>
		{#each navItems as { text, href, icon }}
			<SideNavLink {icon} {text} {href} isSelected={$page.url.pathname === href} />
		{/each}
	</SideNavItems>
</SideNav>

<Content>
	<Grid>
		<Row>
			<Column class="max-w-4xl">
				<slot />
			</Column>
		</Row>
	</Grid>
</Content>
