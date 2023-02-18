// See https://kit.svelte.dev/docs/types#app

import type { PrismaClient } from '@prisma/client';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			validate: import('@lucia-auth/sveltekit').Validate;
			validateUser: import('@lucia-auth/sveltekit').ValidateUser;
			setSession: import('@lucia-auth/sveltekit').SetSession;
		}
		// interface PageData {}
		// interface Platform {}

		type Factor = {
			id: string;
			qr: string;
			secret: string;
			uri: string;
			user_id: string;
			verified: string;
		};

		type ValidationError = {
			field: string | number;
			message: string;
		};

		type FormFail = {
			formData: Record<string, string>;
			error: boolean;
			errors: ValidationError[];
		};

		type EmailAttachment = {
			data: string;
			alternative: boolean;
		};

		type Notification = {
			title: string;
			subtitle?: string;
			caption?: string;
			kind?: 'success' | 'error' | 'warning' | 'info';
		};
	}

	let __prisma: PrismaClient;

	/// <reference type="lucia-auth" />
	declare namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type UserAttributes = {
			name: string;
			email: string;
			verified: boolean;
			created_at: Date;
			updated_at: Date;
		};
	}

	declare namespace Database {
		type User = {
			id: string;
			name: string;
			email: string;
			session: Session[];
			key: Key[];
			factor: Factor;
			PasswordResetToken: PasswordResetToken;
			verified: boolean;
			created_at: Date;
			updated_at: Date;
		};

		type Session = {
			id: string;
			user_id: string;
			active_expires: number;
			idle_expires: number;
			user: User;
		};

		type Key = {
			id: string;
			hashed_password: string;
			user_id: string;
			user: User;
			created_at: Date;
			updated_at: Date;
		};

		type PasswordResetToken = {
			id: string;
			token: string;
			expires: Date;
			user_id: string;
			user: User;
		};

		type EmailVerifyToken = {
			id: string;
			token: string;
			expires: Date;
			user_id: string;
			user: User;
		};

		type Factor = {
			id: string;
			secret: string;
			uri: string;
			qr: string;
			verified: boolean;
			user_id: string;
			user: User;
		};
	}
}

export {};
