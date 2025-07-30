import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
} from 'src/common';
import { CategoryEntity } from 'src/models';

import { CategoriesRepository } from 'src/modules/categories/categories.repository';

import { DeleteCategoryCommand } from '../implements';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand> {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	async execute(
		command: DeleteCategoryCommand,
	): Promise<HttpResponseBodySuccessDto<CategoryEntity> | HttpException> {
		const { categoryId } = command;

		const category = await this.categoriesRepository.findCategoryById(categoryId);

		if (!category) {
			throw new NotFoundException('categoryId');
		}

		if (category.posts.filter((post) => post.deletedAt === null).length > 0) {
			throw new OptionalException(
				400,
				'Category cannot be deleted because it has associated posts',
			);
		}

		const deletedCategory =
			await this.categoriesRepository.deleteCategoryById(categoryId);

		if (!deletedCategory) {
			throw new OptionalException(400, 'Category deletion failed');
		}

		return { success: true, data: deletedCategory };
	}
}
