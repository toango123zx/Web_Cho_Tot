import { IQuery } from '@nestjs/cqrs';

import { FilterPostDto } from 'src/modules/posts/dtos';

export class GetPostsArchiveByUserQuery implements IQuery {
	constructor(
		public readonly filter: FilterPostDto,
		public readonly userId: string,
	) {}
}
