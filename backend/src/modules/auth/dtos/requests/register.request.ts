import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { AutoTrim } from 'src/common';

export class RegisterRequestDto {
	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	@IsEmail()
	email: string;

	@ApiProperty({
		type: 'string',
		minLength: 8,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/, {
		message:
			'Password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character',
	})
	password: string;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	name: string;
}
