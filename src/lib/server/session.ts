import { redirect } from '@sveltejs/kit';

import type { Session } from 'lucia-auth/types';

import { auth } from './lucia';

export const verifyProtectedRoute = async (locals: App.Locals): Promise<Session> => {
	const session = await locals.validate();
	if (!session) {
		throw redirect(302, '/login');
	}

	return session;
};

export const verifyPublicRoute = async (locals: App.Locals): Promise<null> => {
	const session = await locals.validate();
	if (session) {
		throw redirect(302, '/');
	}

	return session;
};

export const invalidateSession = async (locals: App.Locals) => {
	const session = await verifyProtectedRoute(locals);

	await auth.invalidateSession(session.sessionId);
	locals.setSession(null);

	return {
		status: 200
	};
};
