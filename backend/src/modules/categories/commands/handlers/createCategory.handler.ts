import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto } from 'src/common';
import { CategoryEntity } from 'src/models';

import { CategoriesRepository } from 'src/modules/categories/categories.repository';

import { CreateCategoryCommand } from '../implements';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	async execute(
		command: CreateCategoryCommand,
	): Promise<HttpResponseBodySuccessDto<CategoryEntity> | HttpException> {
		const { createCategoryDto } = command;

		const createdCategory =
			await this.categoriesRepository.createCategory(createCategoryDto);

		if (!createdCategory) {
			throw new HttpException('Category creation failed', 500);
		}

		return { success: true, data: createdCategory };
	}
}
