import { IsString, Length, IsNumber } from 'class-validator';

export class DepositRequestDto {
	// Solana transaction signature (usually base58 ~87 chars)
	@IsString()
	@Length(40, 120)
	signature: string;

	// SOL price at the time FE posted
	@IsNumber()
	solPriceUsd: number;
}
