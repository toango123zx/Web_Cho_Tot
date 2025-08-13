import { ICommand } from '@nestjs/cqrs';

export class DepositTransactionCommand implements ICommand {
	constructor(
		public readonly signature: string,
		public readonly userId: string,
		public readonly solPriceUsd: number,
	) {}
}
