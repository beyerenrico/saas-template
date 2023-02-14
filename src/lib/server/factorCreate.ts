import { prisma } from './prisma';

/**
 * Given a user_id and token, check if that token exists for that user, and if it's still valid
 *
 * Will delete an expired token without creating a new one
 */
export const canCreateFactor = async (params: { user_id: string; secret: string }) => {
	const factor = await prisma.factor.findUnique({
		where: { secret: params.secret }
	});

	// Returns a RequestHandlerOutput to use in the password-reset endpoint
	if (!factor) {
		return {
			status: 400,
			body: { error: 'Invalid secret or user_id', ok: false }
		};
	}

	return { body: { message: 'Secret valid', ok: true, factor } };
};
