import { IQuery } from '@nestjs/cqrs';

export class GetTransactionsQuery implements IQuery {
	constructor(public readonly userId: string) {}
}
