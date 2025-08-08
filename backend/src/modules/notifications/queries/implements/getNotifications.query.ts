import { IQuery } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/users/dtos';

export class GetNotificationsQuery implements IQuery {
	constructor(public readonly userInformation: UserInformationDto) {}
}
