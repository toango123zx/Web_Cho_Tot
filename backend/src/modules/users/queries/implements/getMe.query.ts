import { IQuery } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/users/dtos';

export class GetMeQuery implements IQuery {
	constructor(public readonly user: UserInformationDto) {}
}
