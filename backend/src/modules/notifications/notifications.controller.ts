import { Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto } from 'src/common';
import { NotificationsDto } from 'src/models';
import { Auth } from 'src/modules/auth/decorators';
import { ReadNotificationCommand } from 'src/modules/notifications/commands/implements';
import { GetNotificationsQuery } from 'src/modules/notifications/queries/implements';
import { MyInformation } from 'src/modules/users/decorators';
import { UserInformationDto } from 'src/modules/users/dtos';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Auth()
	@Get()
	async getNotifications(
		@MyInformation() userInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<NotificationsDto[] | HttpException>> {
		return this.queryBus.execute(new GetNotificationsQuery(userInformation));
	}

	@Auth()
	@Post('/read/:notificationId')
	async readNotification(
		@Param('notificationId') notificationId: string,
		@MyInformation() userInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<NotificationsDto | HttpException>> {
		return this.commandBus.execute(
			new ReadNotificationCommand(notificationId, userInformation),
		);
	}
}
