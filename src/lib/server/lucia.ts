import prismaAdapter from '@lucia-auth/adapter-prisma';

import lucia from 'lucia-auth';

import { dev } from '$app/environment';

import { prisma } from '$lib/server/prisma';

export const auth = lucia({
	adapter: prismaAdapter(prisma),
	env: dev ? 'DEV' : 'PROD',
	transformUserData: (userData) => {
		return {
			userId: userData.id as string,
			name: userData.name as string,
			email: userData.email as string,
			verified: userData.verified as boolean,
			created_at: userData.created_at as Date,
			updated_at: userData.updated_at as Date
		};
	}
});

export type Auth = typeof auth;
