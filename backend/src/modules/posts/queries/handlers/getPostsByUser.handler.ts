import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, IPaginationQuery } from 'src/common';
import { PostsDto } from 'src/models';

import { PostsRepository } from '../../posts.repository';
import { GetPostsByUserQuery } from '../implements';

@QueryHandler(GetPostsByUserQuery)
export class GetPostsByUserHandler implements IQueryHandler<GetPostsByUserQuery> {
	constructor(private readonly postsRepository: PostsRepository) {}

	public async execute(
		query: GetPostsByUserQuery,
	): Promise<HttpResponseBodySuccessDto<PostsDto[]>> {
		const skip = (query.pagination.page - 1) * query.pagination.limit;

		const pagination: IPaginationQuery = {
			skip,
			take: query.pagination.limit,
		};

		const [posts, totalRecords] = await this.postsRepository.findPosts(
			pagination,
			query.userId,
		);

		const totalPage = Math.ceil(totalRecords / query.pagination.limit);
		return {
			success: true,
			data: posts,
			pagination: {
				totalItems: totalRecords,
				itemsPerPage: posts.length,
				currentPage: query.pagination.page,
				totalPages: totalPage,
			},
		};
	}
}
