import { fail } from '@sveltejs/kit';

import { auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';

import { dev } from '$app/environment';

import { sendEmail } from '$lib/server/emailjs';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const { email } = Object.fromEntries(await request.formData()) as Record<string, string>;

			// This example uses MongoDB
			const { user } = await auth.getKeyUser('email', email);

			if (!user) {
				return fail(400, {
					formData: { email },
					error: true,
					errors: [
						{
							field: 'email',
							message: 'We could not find an account with that email'
						}
					]
				});
			}

			const user_id = user.userId;
			// Check if a resetToken already exists for this user
			let token = await prisma.passwordResetToken.findFirst({
				where: { user_id }
			});

			if (!token) {
				token = await prisma.passwordResetToken.create({
					data: {
						user_id
					}
				});
			} else if (token.expires < new Date()) {
				// Each token has an expiry date.
				// If the token is expired, delete it and make a new one
				await prisma.passwordResetToken.delete({
					where: { token }
				});

				token = await prisma.passwordResetToken.create({
					data: {
						user_id
					}
				});
			}

			// The page the user will be directed to from their email
			// We send the resetToken, and the user_id along
			const link = `${dev ? 'localhost:5173/' : '<Your-Site>.com/'}reset-password/${user_id}/${
				token.token
			}`;

			await sendEmail({
				subject: 'Password Reset',
				text: `Reset your password by clicking this link: ${link}`,
				to: email,
				attachment: [
					{
						data: `<div>Click the link below to reset your password: <br/><br/><a href="${link}">Reset password</a></div>`,
						alternative: true
					}
				]
			});

			return { message: 'Password reset email sent' };
		} catch (error) {
			console.error(error);
			return { status: 500, body: { error: 'Internal server error' } };
		}
	}
};
