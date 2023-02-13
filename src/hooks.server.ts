import { handleHooks } from '@lucia-auth/sveltekit';

import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { auth } from '$lib/server/lucia';

export const customHandle: Handle = async ({ resolve, event }) => {
	return resolve(event);
};

export const handle: Handle = sequence(handleHooks(auth), customHandle);
