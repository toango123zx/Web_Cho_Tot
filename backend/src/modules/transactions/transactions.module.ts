import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserRepository } from 'src/modules/users/users.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { DepositTransactionHandler } from './commands/handlers/deposit-transaction.handler';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsCommandHandlers } from './commands/handlers';
import { TransactionsQueryHandlers } from './queries/handlers';

@Module({
	imports: [DatabaseModule, AuthModule, CqrsModule],
	controllers: [TransactionController],
	providers: [
		UserRepository,
		...TransactionsCommandHandlers,
		...TransactionsQueryHandlers,
		TransactionsRepository,
	],
})
export class TransactionsModule {}
