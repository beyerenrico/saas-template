import { fail, redirect } from '@sveltejs/kit';

import { githubAuth } from '$lib/providers/github';
import { auth } from '$lib/server/lucia';

import type { RequestHandler } from './$types';

// handle GET requests
export const GET: RequestHandler = async ({ locals, request, cookies }) => {
	// get code and state params from url
	const url = new URL(request.url);
	const code = url.searchParams.get('code'); // http://localhost:3000/api/google?code=abc&state=efg => abc
	const state = url.searchParams.get('state'); // http://localhost:3000/api/google?code=abc&state=efg => efg

	if (!code || !state) {
		fail(400, {
			message: 'Invalid request'
		});
	}

	// get stored state from cookies
	const storedState = cookies.get('state');

	// validate state
	if (state !== storedState) throw new Error(); // invalid state

	const { existingUser, providerUser, createUser } = await githubAuth.validateCallback(code);

	const user =
		existingUser ??
		(await createUser({
			name: providerUser.name,
			email: '',
			verified: true,
			created_at: new Date(),
			updated_at: new Date()
		})); // create a new user if the user does not exist

	const session = await auth.createSession(user.userId);
	locals.setSession(session); // store session cookie

	throw redirect(302, '/'); // redirect to home page
};
