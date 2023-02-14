import { fail, redirect, type Actions } from '@sveltejs/kit';

import { schemaPassword } from '$lib/schema';
import { auth } from '$lib/server/lucia';

import { LuciaError } from 'lucia-auth';

import { prisma } from '$lib/server/prisma';

import twofactor from 'node-2fa';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate();

	if (!session) {
		throw redirect(302, '/login');
	}

	return {
		user: await auth.getUser(session.userId),
		factor: await prisma.factor.findFirst({
			where: { user_id: session.userId }
		})
	};
};

export const actions: Actions = {
	updatePassword: async ({ request, locals }) => {
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
	},
	createFactor: async ({ locals }) => {
		try {
			const session = await locals.validate();

			if (!session) {
				throw redirect(302, '/login');
			}

			const user_id = session.userId;
			// Check if a resetToken already exists for this user
			let factor = await prisma.factor.findFirst({
				where: { user_id }
			});

			if (!factor) {
				const newFactor = twofactor.generateSecret({
					name: 'Budgetly',
					account: user_id
				});

				factor = await prisma.factor.create({
					data: {
						user_id,
						...newFactor
					}
				});
			}

			return { ...factor };
		} catch (err) {
			console.log(err);

			return { status: 500, body: { error: 'Internal server error' } };
		}
	},
	verifyFactor: async ({ request, locals }) => {
		const { authCode, secret } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		const session = await locals.validate();

		if (!session) {
			throw redirect(302, '/login');
		}

		try {
			const valid = twofactor.verifyToken(secret, authCode);

			if (valid?.delta === 0) {
				console.log('Token is valid');
				try {
					await prisma.factor.update({
						where: { secret },
						data: { verified: true }
					});

					console.log('Factor verified');
				} catch (err) {
					console.log(err);
				}
			}

			await auth.invalidateAllUserSessions(session.userId);
			locals.setSession(null);

			throw redirect(302, '/login');
		} catch (err) {
			console.log(err);
		}
	},
	deleteFactor: async ({ locals }) => {
		const session = await locals.validate();

		if (!session) {
			throw redirect(302, '/login');
		}

		try {
			const user_id = session.userId;

			await prisma.factor.delete({
				where: { user_id }
			});

			await auth.invalidateAllUserSessions(session.userId);
			locals.setSession(null);

			throw redirect(302, '/login');
		} catch (err) {
			console.log(err);

			return { status: 500, body: { error: 'Internal server error' } };
		}
	}
};
