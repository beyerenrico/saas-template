import { prisma } from './prisma';

/**
 * Given a user_id and token, check if that token exists for that user, and if it's still valid
 *
 * Will delete an expired token without creating a new one
 */
export const canResetPassword = async (params: { user_id: string; token: string }) => {
	const resetToken = await prisma.passwordResetToken.findUnique({
		where: { token: params.token }
	});

	// Returns a RequestHandlerOutput to use in the password-reset endpoint
	if (!resetToken) {
		return {
			status: 400,
			body: { error: 'Invalid token or user_id', ok: false }
		};
	}

	if (resetToken.expires < new Date()) {
		await prisma.passwordResetToken.delete({
			where: { token: params.token }
		});

		return {
			status: 400,
			body: { error: 'Token expired. Please reset your password again', ok: false }
		};
	}

	return { body: { message: 'Token valid', ok: true, resetToken } };
};
