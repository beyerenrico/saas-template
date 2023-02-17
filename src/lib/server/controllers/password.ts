import { fail } from '@sveltejs/kit';

import { LuciaError } from 'lucia-auth';

import { auth } from '../lucia';

export const validatePassword = async (email: string, oldPassword: string) => {
	try {
		await auth.validateKeyPassword('email', email, oldPassword);
	} catch (err) {
		if (err instanceof LuciaError) {
			return fail(400, { message: err.message });
		}

		return fail(500, { message: 'Internal server error' });
	}
};

export const updatePassword = async (email: string, password: string) => {
	try {
		await auth.updateKeyPassword('email', email, password);
	} catch (err) {
		if (err instanceof LuciaError) {
			return fail(400, { message: err.message });
		}

		return fail(500, { message: 'Internal server error' });
	}
};
