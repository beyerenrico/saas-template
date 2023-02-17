import { redirect, type Actions } from '@sveltejs/kit';

import { schemaPassword } from '$lib/schema';
import { auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { verifyProtectedRoute } from '$lib/server/session';
import { verifyForm } from '$lib/server/verifyForm';
import { createFactor, deleteFactor, updateFactor } from '$lib/server/controllers/factor';
import { updatePassword, validatePassword } from '$lib/server/controllers/password';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await verifyProtectedRoute(locals);

	return {
		user: await auth.getUser(session.userId),
		factor: await prisma.factor.findFirst({
			where: { user_id: session.userId }
		})
	};
};

export const actions: Actions = {
	updatePassword: async ({ request, locals }) => {
		const session = await verifyProtectedRoute(locals);

		const user = await auth.getUser(session.userId);

		const { oldPassword, password, passwordConfirm } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;

		const valid = await verifyForm(schemaPassword, { oldPassword, password, passwordConfirm });

		if (valid.status === 400) {
			return valid as unknown as App.FormFail;
		}

		await validatePassword(user.email, oldPassword);
		await updatePassword(user.email, password);
		await auth.invalidateAllUserSessions(session.userId);

		throw redirect(302, '/login');
	},
	createFactor: async ({ locals }) => {
		const session = await verifyProtectedRoute(locals);
		const factor = await createFactor(session);

		return factor as Database.Factor;
	},
	verifyFactor: async ({ request, locals }) => {
		const { authCode, secret } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		const session = await verifyProtectedRoute(locals);
		await updateFactor(secret, authCode, session, locals);
	},
	deleteFactor: async ({ locals }) => {
		const session = await verifyProtectedRoute(locals);
		await deleteFactor(locals, session);
	}
};
