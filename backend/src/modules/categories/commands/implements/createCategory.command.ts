import { ICommand } from '@nestjs/cqrs';

import { CreateCategoryDto } from 'src/models';

export class CreateCategoryCommand implements ICommand {
	constructor(public readonly createCategoryDto: CreateCategoryDto) {}
}
