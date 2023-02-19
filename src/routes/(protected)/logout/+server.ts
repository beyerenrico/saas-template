import { redirect } from '@sveltejs/kit';

import { invalidateSession } from '$lib/server/session';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	await invalidateSession(locals);
	throw redirect(302, '/login?logout=success');
};
