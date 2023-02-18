import { fail, redirect } from '@sveltejs/kit';

import { auth } from '$lib/server/lucia';
import { schemaLogin } from '$lib/schema';
import { prisma } from '$lib/server/prisma';

import twofactor from 'node-2fa';

import { verifyForm } from '$lib/server/verifyForm';

import type { Actions } from './$types';

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const { email, password } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		const valid = await verifyForm(schemaLogin, { email, password });

		if (valid.status !== 200) {
			return valid as unknown as App.FormFail;
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
				try {
					const session = await auth.createSession(userId);
					locals.setSession(session);
				} catch (err) {
					return fail(500, { message: 'Internal server error.' });
				}
			} else {
				return fail(400, { message: 'Invalid authentication code.' });
			}
		} catch (err) {
			return fail(500, { message: 'Internal server error.' });
		}

		throw redirect(302, '/app');
	}
};
