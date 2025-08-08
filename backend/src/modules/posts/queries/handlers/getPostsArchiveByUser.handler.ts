import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto } from 'src/common';
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
		const skip = (query.filter.page - 1) * query.filter.limit;

		const pagination = {
			skip,
			take: query.filter.limit,
			...(query.filter.status && { status: query.filter.status }),
			...(query.filter.search && { search: query.filter.search }),
			...(query.filter.categoryId && { categoryId: query.filter.categoryId }),
			...(query.filter.age && { age: query.filter.age }),
			...(query.filter.size && { size: query.filter.size }),
			...(query.filter.minPrice !== undefined && {
				minPrice: query.filter.minPrice,
			}),
			...(query.filter.maxPrice !== undefined && {
				maxPrice: query.filter.maxPrice,
			}),
			...(query.filter.address && { address: query.filter.address }),
			...(query.filter.district && { district: query.filter.district }),
			...(query.filter.province && { province: query.filter.province }),
			...(query.filter.sortBy && { sortBy: query.filter.sortBy }),
			...(query.filter.sortOrder && { sortOrder: query.filter.sortOrder }),
		};

		const [postsArchive, totalRecords] =
			await this.postsRepository.findAllArchivedPostsByUser(
				pagination,
				query.userId,
			);

		const totalPage = Math.ceil(totalRecords / query.filter.limit);
		return {
			success: true,
			data: postsArchive,
			pagination: {
				totalItems: totalRecords,
				itemsPerPage: postsArchive.length,
				currentPage: query.filter.page,
				totalPages: totalPage,
			},
		};
	}
}
