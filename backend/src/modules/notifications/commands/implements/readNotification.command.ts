import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/users/dtos';

export class ReadNotificationCommand implements ICommand {
	constructor(
		public readonly notificationId: string,
		public readonly userInformation: UserInformationDto,
	) {}
}
