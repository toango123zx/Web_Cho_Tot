import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

export class GetPostsQuery implements IQuery {
	constructor(public readonly pagination: PaginationDto) {}
}
