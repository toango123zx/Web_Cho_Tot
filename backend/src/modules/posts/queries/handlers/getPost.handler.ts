import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';
import { PostsDto } from 'src/models';

import { PostsRepository } from '../../posts.repository';
import { GetPostQuery } from '../implements';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
	constructor(private readonly postsRepository: PostsRepository) {}

	public async execute(
		query: GetPostQuery,
	): Promise<HttpResponseBodySuccessDto<PostsDto>> {
		const post = await this.postsRepository.findPostById(query.postId);

		if (!post) {
			throw new NotFoundException('postId');
		}

		return {
			success: true,
			data: post,
		};
	}
}
