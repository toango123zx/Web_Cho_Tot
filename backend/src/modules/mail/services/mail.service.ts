import { Injectable } from '@nestjs/common';

import { MailConfig, MailTransportConfig } from 'src/configs';

import { SendEmailDto } from '../dtos';

@Injectable()
export class MailService {
	constructor() {}

	async sendEmail(data: SendEmailDto): Promise<{ success: boolean } | null> {
		const { sender, recipients, subject, html, text } = data;

		await MailTransportConfig.sendMail({
			from: sender || {
				address: MailConfig.senderAddress,
				name: MailConfig.senderName,
			},
			to: recipients,
			subject: subject,
			html: html,
			text: text,
		});
		return { success: true };
	}
}
