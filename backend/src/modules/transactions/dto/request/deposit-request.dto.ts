import { IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositRequestDto {
	@ApiProperty({
		description: 'Solana transaction signature (base58 string)',
		minLength: 40,
		maxLength: 120,
		example: '5KaVNauTkvP8E9xqXr3Ree2WZMH36c5ZhM37F6RJ3kWzF',
	})
	@IsString()
	@Length(40, 120)
	signature: string;
}
