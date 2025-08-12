import { Injectable } from '@nestjs/common';

import { NotificationsEntity } from 'src/models';
import { PrismaService } from 'src/modules/database/services';

@Injectable()
export class NotificationsRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async getNotifications(userId: string): Promise<NotificationsEntity[]> {
		return this.prismaService.notifications.findMany({
			where: {
				userId,
			},
			orderBy: { createdAt: 'desc' },
		});
	}

	async findNotification(notificationId: string): Promise<NotificationsEntity | null> {
		return this.prismaService.notifications.findFirst({
			where: { id: notificationId },
		});
	}

	async createNotification(
		userId: string,
		content: string,
		url?: string,
	): Promise<NotificationsEntity> {
		return this.prismaService.notifications.create({
			data: {
				userId,
				content,
				url,
			},
		});
	}

	async readNotification(notificationId: string): Promise<NotificationsEntity> {
		return this.prismaService.notifications.update({
			where: { id: notificationId },
			data: { isRead: true },
		});
	}
}
