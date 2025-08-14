import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common';

export class GetTransactionsQuery implements IQuery {
	constructor(
		public readonly userId: string,
		public readonly pagination: PaginationDto,
	) {}
}
