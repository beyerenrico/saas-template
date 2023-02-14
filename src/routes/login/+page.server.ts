import { fail, redirect } from '@sveltejs/kit';

import { auth } from '$lib/server/lucia';
import { schemaLogin } from '$lib/schema';
import { prisma } from '$lib/server/prisma';

import twofactor from 'node-2fa';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate();
	if (session) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
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
			const factor = await prisma.factor.findUnique({
				where: {
					user_id: key.userId
				}
			});

			if (factor && factor.verified) {
				return {
					status: 200,
					factor
				};
			}

			const session = await auth.createSession(key.userId);
			locals.setSession(session);
		} catch (err) {
			console.error(err);
			return fail(400, { message: 'Invalid email or password.' });
		}
		throw redirect(302, '/app');
	},
	verifyFactor: async ({ request, locals }) => {
		const { authCode, secret, userId } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		try {
			const valid = twofactor.verifyToken(secret, authCode);

			if (valid?.delta === 0) {
				console.log('Token is valid');
				try {
					const session = await auth.createSession(userId);
					locals.setSession(session);

					console.log('Successfully authenticated via 2FA');
				} catch (err) {
					console.log(err);
				}
				throw redirect(302, '/app');
			}
			return fail(400, { message: 'Invalid authentication code.' });
		} catch (err) {
			console.log(err);
		}
	}
};
