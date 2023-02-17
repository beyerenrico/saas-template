import { fail, redirect, type Actions } from '@sveltejs/kit';

import { auth } from '$lib/server/lucia';
import { canResetPassword } from '$lib/server/passwordReset';
import { prisma } from '$lib/server/prisma';
import { schemaForgotPassword } from '$lib/schema';
import { sendEmail } from '$lib/server/emailjs';
import { verifyForm } from '$lib/server/verifyForm';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { user_id, token } = params;

	const valid = await canResetPassword({ params: { user_id, token } });

	if (valid.status !== 200) {
		throw redirect(302, '/login');
	}

	return {
		valid: valid
	};
};

// Resets password
export const actions: Actions = {
	default: async ({ request, params }) => {
		try {
			const { user_id, token } = params;
			const { password, passwordConfirm } = Object.fromEntries(await request.formData()) as Record<
				string,
				string
			>;

			const valid = await verifyForm(schemaForgotPassword, { password, passwordConfirm });

			if (valid.status !== 200) {
				return valid as unknown as App.FormFail;
			}

			if (!user_id || !token) {
				return fail(400, {
					message: 'Invalid token or user_id'
				});
			}

			const allowed = await canResetPassword({ params: { user_id, token } });

			if (allowed.status === 400) return allowed;

			const keys = await auth.getAllUserKeys(user_id);
			const primaryKey = keys.find((key) => key.isPrimary);

			if (!primaryKey?.providerUserId) {
				return fail(400, {
					message: 'There was an issue resetting the password'
				});
			}

			await auth.updateKeyPassword('email', primaryKey.providerUserId, password);

			if ('resetToken' in allowed.data) {
				// Delete the token
				await prisma.passwordResetToken.delete({
					where: { token: allowed.data.resetToken.token }
				});
			}

			await sendEmail({
				subject: 'Your password has been reset',
				text: 'Your password has been reset. If you did not request this, please contact us immediately.',
				to: primaryKey.providerUserId,
				attachment: [
					{
						data: '<div>Your password has been reset. If you did not request this, please contact us immediately.</div>',
						alternative: true
					}
				]
			});

			return {
				status: 200,
				data: {
					message: 'Your password has been reset.'
				}
			};
		} catch (err) {
			return fail(500, { message: 'Internal server error' });
		}
	}
};
