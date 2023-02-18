import { fail } from '@sveltejs/kit';

import { prisma } from './prisma';

/**
 * Given a user_id and token, check if that token exists for that user, and if it's still valid
 *
 * Will delete an expired token without creating a new one
 */
export const canVerifyEmail = async ({
	params
}: {
	params: { user_id: string; token: string };
}) => {
	const verifyToken: Database.EmailVerifyToken = await prisma.emailVerifyToken.findUnique({
		where: { token: params.token }
	});

	if (!verifyToken) {
		return fail(400, {
			message: 'Invalid token or user_id'
		});
	}

	if (verifyToken.expires < new Date()) {
		await prisma.emailVerifyToken.delete({
			where: { token: params.token }
		});

		return fail(400, {
			message: 'Token expired'
		});
	}

	return {
		status: 200,
		data: {
			message: 'Token valid',
			verifyToken
		}
	};
};
