import { verifyProtectedRoute } from '$lib/server/session';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await verifyProtectedRoute(locals);
};
