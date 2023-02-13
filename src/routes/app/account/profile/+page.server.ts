import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { fail, redirect, type Actions } from '@sveltejs/kit';

import { schemaProfile } from '$lib/schema';
import { auth } from '$lib/server/lucia';

import { LuciaError } from 'lucia-auth';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate();

	if (!session) {
		throw redirect(302, '/login');
	}

	return {
		user: await auth.getUser(session.userId)
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await locals.validate();

		if (!session) {
			throw redirect(302, '/login');
		}

		const { name, email } = Object.fromEntries(await request.formData()) as Record<string, string>;

		const profileData = schemaProfile.safeParse({ name, email });

		if (!profileData.success) {
			// Loop through the errors array and create a custom errors array
			const errors = profileData.error.errors.map((error) => {
				return {
					field: error.path[0],
					message: error.message
				};
			});

			return fail(400, {
				formData: { name, email },
				error: true,
				errors
			});
		}

		try {
			await auth.updateUserAttributes(session.userId, {
				name,
				email
			});
		} catch (err) {
			if (err instanceof LuciaError) {
				return fail(400, { message: err.message });
			}

			if (err instanceof PrismaClientKnownRequestError) {
				return fail(400, { message: 'The email is already associated with an account.' });
			}

			return fail(400, { message: 'An unknown error occurred.' });
		}
	}
};
