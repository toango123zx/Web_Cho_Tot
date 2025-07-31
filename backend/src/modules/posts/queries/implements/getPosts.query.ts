import { IQuery } from '@nestjs/cqrs';

import { FilterPostDto } from 'src/modules/posts/dtos';

export class GetPostsQuery implements IQuery {
	constructor(public readonly filter: FilterPostDto) {}
}
