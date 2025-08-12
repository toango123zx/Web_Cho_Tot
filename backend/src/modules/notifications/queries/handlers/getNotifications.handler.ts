import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto } from 'src/common';
import { NotificationsDto } from 'src/models';

import { NotificationsRepository } from 'src/modules/notifications/notifications.repository';

import { GetNotificationsQuery } from '../implements';

@QueryHandler(GetNotificationsQuery)
export class GetNotificationsHandler implements IQueryHandler<GetNotificationsQuery> {
	constructor(private readonly notificationsRepository: NotificationsRepository) {}

	public async execute(
		query: GetNotificationsQuery,
	): Promise<HttpResponseBodySuccessDto<NotificationsDto[]>> {
		const notifications = await this.notificationsRepository.getNotifications(
			query.userInformation.id,
		);

		return {
			success: true,
			data: notifications,
		};
	}
}
