import { fail, redirect, type ActionFailure } from '@sveltejs/kit';

import type { Session } from 'lucia-auth';

import twofactor from 'node-2fa';

import { auth } from '../lucia';
import { prisma } from '../prisma';

export const createFactor = async (
	session: Session
): Promise<
	| ActionFailure<{
			message: string;
	  }>
	| Database.Factor
> => {
	try {
		const user_id = session.userId;

		const user = await auth.getUser(user_id);

		// Check if a factor already exists for this user
		let factor: Database.Factor | null = await prisma.factor.findFirst({
			where: { user_id }
		});

		if (!factor) {
			const newFactor = twofactor.generateSecret({
				name: 'Budgetly',
				account: user.email
			});

			factor = await prisma.factor.create({
				data: {
					user_id,
					...newFactor
				}
			});
		}

		return factor as Database.Factor;
	} catch (err) {
		return fail(500, { message: 'Internal server error' });
	}
};

export const updateFactor = async (
	secret: string,
	authCode: string,
	session: Session,
	locals: App.Locals
) => {
	try {
		const valid = twofactor.verifyToken(secret, authCode);

		if (valid?.delta === 0) {
			try {
				await prisma.factor.update({
					where: { secret },
					data: { verified: true }
				});
			} catch (err) {
				return fail(500, { message: 'Internal server error' });
			}
		} else {
			return fail(400, { message: 'Invalid token' });
		}

		await auth.invalidateAllUserSessions(session.userId);
		locals.setSession(null);

		throw redirect(302, '/login');
	} catch (err) {
		return fail(500, { message: 'Internal server error' });
	}
};

export const deleteFactor = async (locals: App.Locals, session: Session) => {
	try {
		const user_id = session.userId;

		await prisma.factor.delete({
			where: { user_id }
		});

		await auth.invalidateAllUserSessions(session.userId);
		locals.setSession(null);

		throw redirect(302, '/login');
	} catch (err) {
		return fail(500, { message: 'Internal server error' });
	}
};
