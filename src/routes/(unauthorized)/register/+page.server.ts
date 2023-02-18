import { fail, redirect } from '@sveltejs/kit';

import { auth } from '$lib/server/lucia';
import { schemaRegister } from '$lib/schema';
import { verifyForm } from '$lib/server/verifyForm';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const { name, email, password, passwordConfirm } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;

		const valid = await verifyForm(schemaRegister, { name, email, password, passwordConfirm });

		if (valid.status !== 200) {
			return valid as unknown as App.FormFail;
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
					email,
					verified: false,
					created_at: new Date(),
					updated_at: new Date()
				}
			});
		} catch (err) {
			return fail(400, { message: 'There is already an account with this email address.' });
		}
		throw redirect(302, '/login');
	}
};
