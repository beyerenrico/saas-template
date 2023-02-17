import { fail, type ActionFailure } from '@sveltejs/kit';

import type { z } from 'zod';

export const verifyForm = (
	schema: z.ZodSchema<unknown>,
	fields: Record<string, string>
):
	| ActionFailure<{
			formData: Record<string, string>;
			error: boolean;
			errors: App.ValidationError[];
	  }>
	| { status: number } => {
	let response;
	const verifyData = schema.safeParse(fields);

	if (!verifyData.success) {
		const errors: App.ValidationError[] = verifyData.error.errors.map((error) => {
			return {
				field: error.path[0],
				message: error.message
			};
		});

		response = fail(400, {
			formData: fields,
			error: true,
			errors
		});
	} else {
		response = {
			status: 200
		};
	}

	return response;
};
