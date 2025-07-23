import { ICommand } from '@nestjs/cqrs';

import { UpdateCategoryDto } from 'src/models';

export class UpdateCategoryCommand implements ICommand {
	constructor(
		public readonly categoryId: string,
		public readonly updateCategoryDto: UpdateCategoryDto,
	) {}
}
