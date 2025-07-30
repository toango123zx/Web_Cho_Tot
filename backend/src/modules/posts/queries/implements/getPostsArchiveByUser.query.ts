import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

export class GetPostsArchiveByUserQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly userId: string,
	) {}
}
