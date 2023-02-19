import { fail, redirect } from '@sveltejs/kit';

import { canVerifyEmail } from '$lib/server/emailVerification';
import { auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';

import { PUBLIC_APP_NAME } from '$env/static/public';

import { sendEmail } from '$lib/server/emailjs';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { user_id, token } = params;

	const valid = await canVerifyEmail({ params: { user_id, token } });

	if (valid.status !== 200) {
		throw redirect(302, '/login');
	}

	try {
		const user = await auth.getUser(user_id);
		const keys = await auth.getAllUserKeys(user_id);
		const primaryKey = keys.find((key) => key.isPrimary);

		if (!primaryKey?.providerUserId) {
			return fail(400, {
				message: 'There was an issue resetting the password'
			});
		}

		await auth.updateUserAttributes(user_id, {
			verified: true
		});

		if ('verifyToken' in valid.data) {
			// Delete the token
			await prisma.emailVerifyToken.delete({
				where: { token: valid.data.verifyToken.token }
			});
		}

		await sendEmail({
			subject: 'Email verified',
			text: `Hi ${user.name},\n\nYour email has been verified\n\nThanks,\n\nThe ${PUBLIC_APP_NAME} team`,
			to: user.email
		});
	} catch (err) {
		return fail(500, { message: 'Internal server error' });
	}

	throw redirect(302, '/app?emailVerified=success');
};
