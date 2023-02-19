import { fail, redirect, type Actions } from '@sveltejs/kit';

import { schemaProfile } from '$lib/schema';
import { auth } from '$lib/server/lucia';

import { LuciaError } from 'lucia-auth';

import { verifyForm } from '$lib/server/verifyForm';
import { updateKeyIdentifier } from '$lib/server/controllers/key';
import { sendEmail } from '$lib/server/emailjs';

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
		let response: { status: number } | undefined;
		const session = await locals.validate();

		if (!session) {
			throw redirect(302, '/login');
		}

		const { name, email } = Object.fromEntries(await request.formData()) as Record<string, string>;

		const valid = await verifyForm(schemaProfile, { name, email });

		if (valid.status !== 200) {
			return valid as unknown as App.FormFail;
		}

		const user = await auth.getUser(session.userId);

		try {
			await auth.updateUserAttributes(session.userId, {
				name,
				email,
				updated_at: new Date()
			});

			response = await updateKeyIdentifier('email', email, session.userId, locals);
		} catch (err) {
			if (err instanceof LuciaError) {
				return fail(400, { message: err.message });
			}

			if (err?.constructor.name === 'PrismaClientKnownRequestError') {
				return fail(400, { message: 'The email is already associated with another account.' });
			}

			return fail(500, { message: 'Internal server error' });
		}

		if (response?.status === 200) {
			await sendEmail({
				subject: 'Email changed',
				text: `Hi ${user.name},\n\nYour email has been changed to ${email}.\n\nIf you did not change your email, please contact us immediately`,
				to: user.email
			});

			throw redirect(302, '/login?emailChanged=success');
		}
	}
};
