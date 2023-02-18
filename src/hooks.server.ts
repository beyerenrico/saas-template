import { handleHooks } from '@lucia-auth/sveltekit';

import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { auth } from '$lib/server/lucia';

export const protectedHandle: Handle = async ({ resolve, event }) => {
	const session = await event.locals.validate();
	let user;

	if (session) user = await auth.getUser(session.userId);

	if (!session && event.route.id?.includes('protected')) {
		throw redirect(302, '/login');
	}

	if (
		session &&
		!user?.verified &&
		event.route.id?.includes('protected') &&
		!event.route.id?.includes('verify')
	) {
		throw redirect(302, '/verify');
	}

	return resolve(event);
};

export const unauthorizedHandle: Handle = async ({ resolve, event }) => {
	const session = await event.locals.validate();
	let user;

	if (session) user = await auth.getUser(session.userId);

	if (session && user?.verified && event.route.id?.includes('unauthorized')) {
		throw redirect(302, '/app');
	}

	if (session && !user?.verified && event.route.id?.includes('unauthorized')) {
		throw redirect(302, '/verify');
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleHooks(auth), protectedHandle, unauthorizedHandle);
