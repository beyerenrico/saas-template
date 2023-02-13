import { fail, redirect } from '@sveltejs/kit';

import { auth } from '$lib/server/lucia';
import { schemaLogin } from '$lib/schema';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate();
	if (session) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { email, password } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		const loginData = schemaLogin.safeParse({ email, password });

		if (!loginData.success) {
			// Loop through the errors array and create a custom errors array
			const errors = loginData.error.errors.map((error) => {
				return {
					field: error.path[0],
					message: error.message
				};
			});

			return fail(400, {
				formData: { email, password },
				error: true,
				errors
			});
		}

		try {
			const key = await auth.validateKeyPassword('email', email, password);
			const session = await auth.createSession(key.userId);
			locals.setSession(session);
		} catch (err) {
			console.error(err);
			return fail(400, { message: 'Invalid email or password.' });
		}
		throw redirect(302, '/app');
	}
};
