import { fail } from '@sveltejs/kit';

import { prisma } from './prisma';

/**
 * Given a user_id and token, check if that token exists for that user, and if it's still valid
 *
 * Will delete an expired token without creating a new one
 */
export const canResetPassword = async ({
	params
}: {
	params: { user_id: string; token: string };
}) => {
	const resetToken: Database.PasswordResetToken = await prisma.passwordResetToken.findUnique({
		where: { token: params.token }
	});

	if (!resetToken) {
		return fail(400, {
			message: 'Invalid token or user_id'
		});
	}

	if (resetToken.expires < new Date()) {
		await prisma.passwordResetToken.delete({
			where: { token: params.token }
		});

		return fail(400, {
			message: 'Token expired. Please reset your password again'
		});
	}

	return {
		status: 200,
		data: {
			message: 'Token valid',
			resetToken
		}
	};
};
