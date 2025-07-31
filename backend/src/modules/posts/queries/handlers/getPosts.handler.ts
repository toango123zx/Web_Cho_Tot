import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto } from 'src/common';
import { PostsDto } from 'src/models';

import { PostsRepository } from '../../posts.repository';
import { GetPostsQuery } from '../implements';

@QueryHandler(GetPostsQuery)
export class GetPostsHandler implements IQueryHandler<GetPostsQuery> {
	constructor(private readonly postsRepository: PostsRepository) {}

	public async execute(
		query: GetPostsQuery,
	): Promise<HttpResponseBodySuccessDto<PostsDto[]>> {
		const skip = (query.filter.page - 1) * query.filter.limit;

		const filter = {
			skip,
			take: query.filter.limit,
			...(query.filter.status && { status: query.filter.status }),
		};

		const [posts, totalRecords] = await this.postsRepository.findPosts(filter);

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
