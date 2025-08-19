import { IsString, IsNumber } from 'class-validator';

export class DepositResponseDto {
	@IsString()
	transactionId: string;

	@IsString()
	from: string;

	@IsString()
	to: string;

	@IsNumber()
	solAmount: number;

	@IsNumber()
	solPriceUsd: number;

	@IsNumber()
	dongTotAmount: number;

	@IsString()
	status: string;
}
