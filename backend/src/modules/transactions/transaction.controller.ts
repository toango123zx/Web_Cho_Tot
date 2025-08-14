import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DepositTransactionCommand } from './commands/implements/deposit-transaction.command';
import { Body, Controller, Post, Get, Query, HttpException } from '@nestjs/common';
import { Auth } from '../auth/decorators';
import { MyInformation } from '../users/decorators';
import { DepositRequestDto } from './dto/deposit-request.dto';
import { UserInformationDto } from '../users/dtos';
import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { TransactionDto } from 'src/models';
import { GetTransactionsQuery } from './queries/implements';

@Controller('transactions')
export class TransactionController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get('total')
	@Auth()
	async getTotal(@MyInformation() user: UserInformationDto) {
		return { balance: user.balance ?? 0 };
	}

	@Get('history')
	@Auth()
	async getTransactionHistory(
		@Query() pagination: PaginationDto,
		@MyInformation() user: UserInformationDto,
	): Promise<HttpResponseBodyDto<TransactionDto[] | HttpException>> {
		return this.queryBus.execute(new GetTransactionsQuery(user.id, pagination));
	}

	@Post('deposit')
	@Auth()
	async deposit(
		@Body() body: DepositRequestDto,
		@MyInformation() user: UserInformationDto,
	) {
		return await this.commandBus.execute(
			new DepositTransactionCommand(body.signature, user.id),
		);
	}
}
