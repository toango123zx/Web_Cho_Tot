import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

export class GetPostsByUserQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly userId: string,
	) {}
}
