import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';
import { CategoryDto } from 'src/models';

import { CategoriesRepository } from '../../categories.repository';
import { GetCategoryQuery } from '../implements';

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler implements IQueryHandler<GetCategoryQuery> {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	public async execute(
		query: GetCategoryQuery,
	): Promise<HttpResponseBodySuccessDto<CategoryDto>> {
		const category = await this.categoriesRepository.findCategoryById(
			query.categoryId,
		);

		if (!category) {
			throw new NotFoundException('categoryId');
		}

		return {
			success: true,
			data: category,
		};
	}
}
