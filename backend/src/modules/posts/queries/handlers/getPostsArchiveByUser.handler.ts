import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, IPaginationQuery } from 'src/common';
import { PostArchivesDto } from 'src/models';

import { PostsRepository } from '../../posts.repository';
import { GetPostsArchiveByUserQuery } from '../implements';

@QueryHandler(GetPostsArchiveByUserQuery)
export class GetPostsArchiveByUserHandler
	implements IQueryHandler<GetPostsArchiveByUserQuery>
{
	constructor(private readonly postsRepository: PostsRepository) {}

	public async execute(
		query: GetPostsArchiveByUserQuery,
	): Promise<HttpResponseBodySuccessDto<PostArchivesDto[]>> {
		const skip = (query.pagination.page - 1) * query.pagination.limit;

		const pagination: IPaginationQuery = {
			skip,
			take: query.pagination.limit,
		};

		const [postsArchive, totalRecords] =
			await this.postsRepository.findAllArchivedPostsByUser(
				pagination,
				query.userId,
			);

		const totalPage = Math.ceil(totalRecords / query.pagination.limit);
		return {
			success: true,
			data: postsArchive,
			pagination: {
				totalItems: totalRecords,
				itemsPerPage: postsArchive.length,
				currentPage: query.pagination.page,
				totalPages: totalPage,
			},
		};
	}
}
