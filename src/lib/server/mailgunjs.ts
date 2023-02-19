import { fail } from '@sveltejs/kit';

import { MAILGUN_API_KEY, MAILGUN_DOMAIN, SMTP_FROM } from '$env/static/private';

import mailgun from 'mailgun-js';

const mg = mailgun({
	apiKey: MAILGUN_API_KEY,
	domain: MAILGUN_DOMAIN
});

export async function sendMailgunEmail({
	subject,
	to,
	template,
	variables
}: {
	subject: string;
	to: string;
	template: App.MailgunTemplates;
	variables: Record<string, string>;
}) {
	const data = {
		from: SMTP_FROM,
		to,
		subject,
		template,
		'h:X-Mailgun-Variables': JSON.stringify(variables)
	};

	mg.messages().send(data, (error, body) => {
		if (error) {
			fail(500, {
				message: 'We could not send the email'
			});
		}

		return body;
	});
}
