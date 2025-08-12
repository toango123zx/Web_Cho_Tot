import { IQuery } from '@nestjs/cqrs';

export class GetPostQuery implements IQuery {
	constructor(public readonly postId: string) {}
}
