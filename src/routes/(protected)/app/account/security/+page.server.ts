import { fail, redirect, type Actions } from '@sveltejs/kit';

import { schemaPassword } from '$lib/schema';
import { auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { verifyForm } from '$lib/server/verifyForm';
import { createFactor, deleteFactor, updateFactor } from '$lib/server/controllers/factor';
import { updatePassword, validatePassword } from '$lib/server/controllers/password';
import { sendEmail } from '$lib/server/emailjs';

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

		const valid = await verifyForm(schemaPassword, { oldPassword, password, passwordConfirm });

		if (valid.status === 400) {
			return valid as unknown as App.FormFail;
		}

		await validatePassword(user.email, oldPassword);
		await updatePassword(user.email, password);

		await sendEmail({
			subject: 'Password changed',
			text: `Hi ${user.name},\n\nYour password has been changed.\n\nIf you did not change your email, please contact us immediately`,
			to: user.email
		});

		await auth.invalidateAllUserSessions(session.userId);
		locals.setSession(null);

		throw redirect(302, '/login?passwordChanged=success');
	},
	createFactor: async ({ locals }) => {
		const session = await locals.validate();

		if (!session) {
			throw redirect(302, '/login');
		}

		const factor = await createFactor(session);

		return factor as Database.Factor;
	},
	verifyFactor: async ({ request, locals }) => {
		const session = await locals.validate();

		if (!session) {
			throw redirect(302, '/login');
		}

		const user = await auth.getUser(session.userId);

		const { authCode, secret } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		const valid = await updateFactor(secret, authCode, session, locals);

		if (valid.status === 400) {
			return fail(400, { message: valid.data.message });
		}

		await sendEmail({
			subject: 'Two-factor authentication enabled',
			text: `Hi ${user.name},\n\nTwo-Factor Authentication has been enabled for you account.\n\nIf you did not request this change, please contact us immediately`,
			to: user.email
		});

		return {
			status: 200,
			data: {
				message: valid.data.message
			}
		};
	},
	deleteFactor: async ({ locals }) => {
		const session = await locals.validate();

		if (!session) {
			throw redirect(302, '/login');
		}

		return await deleteFactor(locals, session);
	}
};
