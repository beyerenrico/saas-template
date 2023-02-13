import { fail, redirect, type Actions } from '@sveltejs/kit';

import { auth } from '$lib/server/lucia';
import { canResetPassword } from '$lib/server/passwordReset';
import { prisma } from '$lib/server/prisma';
import { schemaForgotPassword } from '$lib/schema';
import { serializeNonPOJOs } from '$lib/utils';
import { sendEmail } from '$lib/server/emailjs';

import type { PageServerLoad } from './$types';

// Checks that the token is valid for the given user
// Allows the page to be loaded
export const load: PageServerLoad = async ({ params }) => {
	const { user_id, token } = params;

	// Using the function defined earlier in step 2
	const valid = await canResetPassword({ user_id, token });

	if (!valid.body.ok) {
		throw redirect(302, '/login');
	}

	return serializeNonPOJOs({ body: { ok: valid.body.ok } });
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

			const resetPasswordData = schemaForgotPassword.safeParse({ password, passwordConfirm });

			if (!resetPasswordData.success) {
				// Loop through the errors array and create a custom errors array
				const errors = resetPasswordData.error.errors.map((error) => {
					return {
						field: error.path[0],
						message: error.message
					};
				});

				return fail(400, {
					formData: { password, passwordConfirm },
					error: true,
					errors
				});
			}

			if (!user_id || !token) return { status: 400, body: { error: 'Invalid token or user_id' } };

			const valid = await canResetPassword({ user_id, token });

			if (!valid.body.ok) return valid;

			const keys = await auth.getAllUserKeys(user_id);
			const primaryKey = keys.find((key) => key.isPrimary);

			if (!primaryKey?.providerUserId) {
				return fail(400, { message: 'There was an issue resetting the password' });
			}

			await auth.updateKeyPassword('email', primaryKey.providerUserId, password);

			// Delete the token
			await prisma.passwordResetToken.delete({
				where: { token: valid.body.resetToken.token }
			});

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

			return { message: 'Your password has been reset.' };
		} catch (error) {
			console.log(error);
			return fail(500, { message: 'Unexpected server error' });
		}
	}
};
