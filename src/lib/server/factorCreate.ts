import { fail } from '@sveltejs/kit';

import { prisma } from './prisma';

/**
 * Given a user_id and secret, check if that secret exists for that user
 */
export const canCreateFactor = async (params: { user_id: string; secret: string }) => {
	const factor = await prisma.factor.findUnique({
		where: { secret: params.secret }
	});

	if (!factor) {
		return fail(400, { message: 'Invalid secret or user_id' });
	}

	return {
		status: 200,
		data: {
			factor
		}
	};
};
