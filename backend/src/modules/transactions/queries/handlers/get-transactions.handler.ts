import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionsQuery } from '../implements/get-transactions.query';
import { TransactionsRepository } from '../../transactions.repository';
import { HttpResponseBodySuccessDto, IPaginationQuery } from 'src/common';
import { TransactionDto } from 'src/models';

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsHandler implements IQueryHandler<GetTransactionsQuery> {
	constructor(private readonly repo: TransactionsRepository) {}

	public async execute(
		query: GetTransactionsQuery,
	): Promise<HttpResponseBodySuccessDto<TransactionDto[]>> {
		const skip = (query.pagination.page - 1) * query.pagination.limit;
		const pagination: IPaginationQuery = {
			skip,
			take: query.pagination.limit,
		};
		const [transactions, totalRecords] =
			await this.repo.getTransactionsByUserPaginate(query.userId, pagination);
		const totalPage = Math.ceil(totalRecords / query.pagination.limit);
		return {
			success: true,
			data: transactions,
			pagination: {
				totalItems: totalRecords,
				itemsPerPage: transactions.length,
				currentPage: query.pagination.page,
				totalPages: totalPage,
			},
		};
	}
}
