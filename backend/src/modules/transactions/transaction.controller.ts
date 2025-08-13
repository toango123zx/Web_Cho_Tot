import { CommandBus } from '@nestjs/cqrs';
import { DepositTransactionCommand } from './commands/implements/deposit-transaction.command';
import { Body, Controller, Post, Get } from '@nestjs/common';
import { Auth } from '../auth/decorators';
import { MyInformation } from '../users/decorators';
import { DepositRequestDto } from './dto/deposit-request.dto';
import { UserInformationDto } from '../users/dtos';

@Controller('transactions')
export class TransactionController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post('deposit')
	@Auth()
	async deposit(
		@Body() body: DepositRequestDto,
		@MyInformation() user: UserInformationDto,
	) {
		return await this.commandBus.execute(
			new DepositTransactionCommand(body.signature, user.id, body.solPriceUsd),
		);
	}
}
