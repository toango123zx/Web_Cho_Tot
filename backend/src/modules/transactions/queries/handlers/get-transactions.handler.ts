import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionsQuery } from '../implements/get-transactions.query';
import { TransactionsRepository } from '../../transactions.repository';

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsHandler implements IQueryHandler<GetTransactionsQuery> {
	constructor(private readonly repo: TransactionsRepository) {}

	async execute(query: GetTransactionsQuery) {
		const transactions = await this.repo.getTransactionsByUser(query.userId);
		return { success: true, data: transactions };
	}
}
