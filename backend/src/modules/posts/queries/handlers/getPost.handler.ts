import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, OptionalException } from 'src/common';
import { PostsDto } from 'src/models';

import { PostsRepository } from '../../posts.repository';
import { GetPostQuery } from '../implements';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
	constructor(private readonly postsRepository: PostsRepository) {}

	public async execute(
		query: GetPostQuery,
	): Promise<HttpResponseBodySuccessDto<PostsDto>> {
		const post = await this.postsRepository.findPostById(query.postId, true);

		if (!post) {
			throw new OptionalException(404, 'Post not found');
		}

		return {
			success: true,
			data: post,
		};
	}
}
