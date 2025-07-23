import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
} from 'src/common';
import { CategoryEntity } from 'src/models';

import { CategoriesRepository } from 'src/modules/categories/categories.repository';

import { UpdateCategoryCommand } from '../implements';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	async execute(
		command: UpdateCategoryCommand,
	): Promise<HttpResponseBodySuccessDto<CategoryEntity> | HttpException> {
		const { updateCategoryDto, categoryId } = command;

		const category = await this.categoriesRepository.findCategoryById(categoryId);
		if (!category) {
			throw new NotFoundException('categoryId');
		}

		const updatedCategory = await this.categoriesRepository.updateCategory(
			categoryId,
			updateCategoryDto,
		);

		if (!updatedCategory) {
			throw new OptionalException(400, 'Category update failed');
		}

		return { success: true, data: updatedCategory };
	}
}
