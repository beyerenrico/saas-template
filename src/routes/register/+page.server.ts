import { fail, redirect } from '@sveltejs/kit';

import { auth } from '$lib/server/lucia';
import { schemaRegister } from '$lib/schema';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate();
	if (session) {
		throw redirect(302, '/login');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const { name, email, password, passwordConfirm } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;

		const registerData = schemaRegister.safeParse({ name, email, password, passwordConfirm });

		if (!registerData.success) {
			// Loop through the errors array and create a custom errors array
			const errors = registerData.error.errors.map((error) => {
				return {
					field: error.path[0],
					message: error.message
				};
			});

			return fail(400, {
				formData: { name, email, password, passwordConfirm },
				error: true,
				errors
			});
		}

		try {
			await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: email,
					password
				},
				attributes: {
					name,
					email
				}
			});
		} catch (err) {
			console.error(err);
			return fail(400, { message: 'There is already an account with this email address.' });
		}
		throw redirect(302, '/login');
	}
};
