import { IQuery } from '@nestjs/cqrs';

import { UsersDto } from 'src/models';

export class GetMeQuery implements IQuery {
	constructor(public readonly user: UsersDto) {}
}
