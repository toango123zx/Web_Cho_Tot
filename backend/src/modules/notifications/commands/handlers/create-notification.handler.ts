import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AppGateway } from 'src/gateway/app.gateway';

import { NotificationsRepository } from 'src/modules/notifications/notifications.repository';

import { CreateNotificationCommand } from '../implements';

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationHandler
	implements ICommandHandler<CreateNotificationCommand>
{
	constructor(
		private readonly notificationsRepository: NotificationsRepository,
		private readonly gateway: AppGateway,
	) {}

	async execute(command: CreateNotificationCommand): Promise<void> {
		const { userId, content, url } = command;

		const notification = await this.notificationsRepository.createNotification(
			userId,
			content,
			url,
		);

		this.gateway.sendNotification(userId, notification);
	}
}
