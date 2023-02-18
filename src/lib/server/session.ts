import { redirect } from '@sveltejs/kit';

import { auth } from './lucia';

export const invalidateSession = async (locals: App.Locals) => {
	const session = await locals.validate();

	if (!session) {
		throw redirect(302, '/login');
	}

	await auth.invalidateSession(session.sessionId);
	locals.setSession(null);

	return {
		status: 200
	};
};
