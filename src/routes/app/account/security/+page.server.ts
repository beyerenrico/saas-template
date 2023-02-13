import { fail, redirect, type Actions } from '@sveltejs/kit';

import { schemaPassword } from '$lib/schema';
import { auth } from '$lib/server/lucia';

import { LuciaError } from 'lucia-auth';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate();

	if (!session) {
		throw redirect(302, '/login');
	}

	return {
		user: await auth.getUser(session.userId)
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await locals.validate();

		if (!session) {
			throw redirect(302, '/login');
		}

		const user = await auth.getUser(session.userId);

		const { oldPassword, password, passwordConfirm } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;

		const passwordData = schemaPassword.safeParse({ oldPassword, password, passwordConfirm });

		if (!passwordData.success) {
			// Loop through the errors array and create a custom errors array
			const errors = passwordData.error.errors.map((error) => {
				return {
					field: error.path[0],
					message: error.message
				};
			});

			return fail(400, {
				formData: { oldPassword, password, passwordConfirm },
				error: true,
				errors
			});
		}

		try {
			await auth.validateKeyPassword('email', user.email, oldPassword);
		} catch (err) {
			if (err instanceof LuciaError) {
				return fail(400, { message: err.message });
			}

			return fail(400, { message: 'An unknown error occurred.' });
		}

		try {
			await auth.updateKeyPassword('email', user.email, password);
		} catch (err) {
			if (err instanceof LuciaError) {
				return fail(400, { message: err.message });
			}

			return fail(400, { message: 'An unknown error occurred.' });
		}

		await auth.invalidateAllUserSessions(session.userId);
		console.log('Invalidated all sessions');
		throw redirect(302, '/login');
	}
};
