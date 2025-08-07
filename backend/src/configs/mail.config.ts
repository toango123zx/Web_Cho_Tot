import { createTransport } from 'nodemailer';

export const MailConfig = {
	host: process.env.MAIL_HOST,
	port: Number(process.env.MAIL_PORT) || 587,
	user: process.env.EMAIL_USER,
	pass: process.env.EMAIL_PASS,
	senderAddress: process.env.MAIL_SENDER_ADDRESS,
	senderName: process.env.MAIL_SENDER_NAME,
};

export const MailTransportConfig = createTransport({
	host: MailConfig.host,
	port: MailConfig.port,
	secure: false,
	auth: {
		user: MailConfig.user,
		pass: MailConfig.pass,
	},
	from: {
		address: MailConfig.senderAddress,
		name: MailConfig.senderName,
	},
	sender: {
		address: MailConfig.senderAddress,
		name: MailConfig.senderName,
	},
});
