import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, IPaginationQuery } from 'src/common';
import { CategoryDto } from 'src/models';

import { CategoriesRepository } from '../../categories.repository';
import { GetCategoriesQuery } from '../implements';

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler implements IQueryHandler<GetCategoriesQuery> {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	public async execute(
		query: GetCategoriesQuery,
	): Promise<HttpResponseBodySuccessDto<CategoryDto[]>> {
		const skip = (query.pagination.page - 1) * query.pagination.limit;

		const pagination: IPaginationQuery = {
			skip,
			take: query.pagination.limit,
		};

		const [categories, totalRecords] =
			await this.categoriesRepository.findCategories(pagination);

		const totalPage = Math.ceil(totalRecords / query.pagination.limit);
		return {
			success: true,
			data: categories,
			pagination: {
				totalItems: totalRecords,
				itemsPerPage: categories.length,
				currentPage: query.pagination.page,
				totalPages: totalPage,
			},
		};
	}
}
