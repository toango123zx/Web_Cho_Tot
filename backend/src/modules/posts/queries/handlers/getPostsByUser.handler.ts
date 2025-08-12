import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto } from 'src/common';
import { PostsDto } from 'src/modules/posts/dtos';

import { PostsRepository } from '../../posts.repository';
import { GetPostsByUserQuery } from '../implements';

@QueryHandler(GetPostsByUserQuery)
export class GetPostsByUserHandler implements IQueryHandler<GetPostsByUserQuery> {
	constructor(private readonly postsRepository: PostsRepository) {}

	public async execute(
		query: GetPostsByUserQuery,
	): Promise<HttpResponseBodySuccessDto<PostsDto[]>> {
		const skip = (query.filter.page - 1) * query.filter.limit;

		const pagination = {
			skip,
			take: query.filter.limit,
			...(query.filter.status && { status: query.filter.status }),
		};

		const [posts, totalRecords] = await this.postsRepository.findPosts(
			pagination,
			query.userId,
		);

		const totalPage = Math.ceil(totalRecords / query.filter.limit);
		return {
			success: true,
			data: posts,
			pagination: {
				totalItems: totalRecords,
				itemsPerPage: posts.length,
				currentPage: query.filter.page,
				totalPages: totalPage,
			},
		};
	}
}
