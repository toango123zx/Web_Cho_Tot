import { IQuery } from '@nestjs/cqrs';

import { FilterPostDto } from 'src/modules/posts/dtos';
import { UserInformationDto } from 'src/modules/users/dtos';

export class GetPostsQuery implements IQuery {
	constructor(
		public readonly filter: FilterPostDto,
		public readonly userInformation?: UserInformationDto,
	) {}
}
