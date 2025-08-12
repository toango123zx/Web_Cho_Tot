import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, OptionalException } from 'src/common';
import { NotificationsEntity } from 'src/models';

import { NotificationsRepository } from 'src/modules/notifications/notifications.repository';

import { ReadNotificationCommand } from '../implements';

@CommandHandler(ReadNotificationCommand)
export class ReadNotificationHandler implements ICommandHandler<ReadNotificationCommand> {
	constructor(private readonly notificationsRepository: NotificationsRepository) {}

	async execute(
		command: ReadNotificationCommand,
	): Promise<HttpResponseBodySuccessDto<NotificationsEntity>> {
		const { notificationId, userInformation } = command;

		const notification =
			await this.notificationsRepository.findNotification(notificationId);

		if (!notification) {
			throw new OptionalException(404, 'Notification not found');
		}

		if (notification.userId !== userInformation.id) {
			throw new OptionalException(
				403,
				'You do not have permission to read this notification',
			);
		}

		if (notification.isRead) {
			throw new OptionalException(400, 'Notification already read');
		}

		const updatedNotification =
			await this.notificationsRepository.readNotification(notificationId);

		if (!updatedNotification) {
			throw new OptionalException(500, 'Failed to update notification');
		}

		return {
			success: true,
			data: updatedNotification,
		};
	}
}
