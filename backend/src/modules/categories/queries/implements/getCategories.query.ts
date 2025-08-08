import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

export class GetCategoriesQuery implements IQuery {
	constructor(
		public readonly pagination: PaginationDto,
		public readonly search?: string,
	) {}
}
