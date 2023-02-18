import { fail } from '@sveltejs/kit';

import { auth } from '../lucia';
import { prisma } from '../prisma';
import { invalidateSession } from '../session';

export const updateKeyIdentifier = async (
	providerId: string,
	providerValue: string,
	userId: string,
	locals: App.Locals
) => {
	try {
		const primaryKey: Database.Key = await prisma.key.findFirst({
			where: {
				primary: true,
				user_id: userId
			}
		});

		if (primaryKey.id === `${providerId}:${providerValue}`) return;

		await prisma.key.update({
			where: {
				id: primaryKey.id
			},
			data: {
				id: `${providerId}:${providerValue}`,
				updated_at: new Date()
			}
		});

		await auth.updateUserAttributes(userId, {
			verified: false,
			updated_at: new Date()
		});

		return await invalidateSession(locals);
	} catch (err) {
		return fail(500, { message: 'Internal server error' });
	}
};
