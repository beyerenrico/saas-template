import { z } from 'zod';

const passwordObject = z
	.string()
	.min(8)
	.regex(new RegExp('.*[A-Z].*'), {
		message: 'Password must contain at least one uppercase letter'
	})
	.regex(new RegExp('.*[a-z].*'), {
		message: 'Password must contain at least one lowercase letter'
	})
	.regex(new RegExp('.*[0-9].*'), { message: 'Password must contain at least one number' })
	.regex(new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'), {
		message: 'Password must contain at least one special character'
	});

export const schemaLogin = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export const schemaRegister = z
	.object({
		name: z.string().min(2),
		email: z.string().email(),
		password: passwordObject,
		passwordConfirm: passwordObject
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['passwordConfirm']
			});
		}
	});

export const schemaProfile = z.object({
	name: z.string().min(2).optional(),
	email: z.string().email().optional()
});

export const schemaPassword = z
	.object({
		oldPassword: z.string().min(8),
		password: passwordObject,
		passwordConfirm: passwordObject
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['passwordConfirm']
			});
		}
	});

export const schemaForgotPassword = z
	.object({
		password: passwordObject,
		passwordConfirm: passwordObject
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['passwordConfirm']
			});
		}
	});
