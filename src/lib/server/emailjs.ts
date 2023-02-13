import { SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD, SMTP_PORT, SMTP_FROM } from '$env/static/private';

import { Message, SMTPClient } from 'emailjs';

// Use the emailjs library to set up an SMTP client using your credentials
const client = new SMTPClient({
	user: SMTP_USERNAME,
	password: SMTP_PASSWORD,
	host: SMTP_HOST,
	port: parseInt(SMTP_PORT),
	ssl: false
});

// General function to send an email to a single address
// from your chosen `from` email
export async function sendEmail({
	subject,
	text,
	to,
	attachment
}: {
	subject: string;
	text: string;
	to: string;
	attachment?: any[];
}) {
	const msg = new Message({
		text,
		from: SMTP_FROM,
		to,
		subject,
		// attachment lets us send html
		// in which case, `text` will be use as a fallback
		attachment: attachment ?? []
	});

	const { isValid, validationError } = msg.checkValidity();
	console.assert(isValid, validationError);

	try {
		await client.sendAsync(msg);
		console.log('sent');
	} catch (error) {
		console.log(error);
	}
}
