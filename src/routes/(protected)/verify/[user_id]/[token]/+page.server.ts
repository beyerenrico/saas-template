import { fail, redirect } from '@sveltejs/kit';

import { canVerifyEmail } from '$lib/server/emailVerification';
import { auth } from '$lib/server/lucia';
import { sendEmail } from '$lib/server/emailjs';
import { prisma } from '$lib/server/prisma';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { user_id, token } = params;

	const valid = await canVerifyEmail({ params: { user_id, token } });

	if (valid.status !== 200) {
		throw redirect(302, '/login');
	}

	try {
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
			subject: 'Your email has been verified',
			text: 'Your email has been verified. If you did not request this, please contact us immediately.',
			to: primaryKey.providerUserId,
			attachment: [
				{
					data: '<div>Your email has been verified. If you did not request this, please contact us immediately.</div>',
					alternative: true
				}
			]
		});
	} catch (err) {
		return fail(500, { message: 'Internal server error' });
	}

	throw redirect(302, '/app?emailVerified=success');
};
