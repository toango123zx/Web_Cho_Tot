import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/services';
import { TransactionTargetEnum, TransactionStatusEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';

@Injectable()
export class TransactionsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createDepositTransaction(data: {
		signature: string;
		userId: string;
		amount: number;
		target: TransactionTargetEnum;
		status: TransactionStatusEnum;
		description: string;
	}) {
		const transaction = await this.prisma.transaction.create({
			data: {
				signature: data.signature,
				amount: data.amount,
				description: data.description,
				target: data.target,
				status: data.status,
				user: {
					connect: { id: data.userId },
				},
			},
		});

		if (data.target === 'deposit' && data.status === 'completed') {
			await this.prisma.users.update({
				where: { id: data.userId },
				data: {
					balance: {
						increment: data.amount,
					},
				},
			});
		}

		return transaction;
	}

	async getTransactionsByUser(userId: string) {
		return this.prisma.transaction.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		});
	}

	async getTransactionsByUserPaginate(
		userId: string,
		pagination: IPaginationQuery,
	): Promise<[any[], number]> {
		const [transactions, totalRecords] = await Promise.all([
			this.prisma.transaction.findMany({
				where: { userId },
				orderBy: { createdAt: 'desc' },
				skip: pagination.skip,
				take: pagination.take,
			}),
			this.prisma.transaction.count({ where: { userId } }),
		]);
		return [transactions, totalRecords];
	}

	async findBySignature(signature: string) {
		return this.prisma.transaction.findUnique({ where: { signature } });
	}
}
