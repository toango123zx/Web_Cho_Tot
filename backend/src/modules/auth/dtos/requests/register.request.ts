import { ApiProperty } from '@nestjs/swagger';

import { GenderUserEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
	IsDateString,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
} from 'class-validator';
import { AutoTrim } from 'src/common';

export class RegisterRequestDto {
	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => value.trim())
	@IsEmail()
	email: string;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
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
	@Transform(({ value }) => value.trim())
	name: string;

	@ApiProperty({
		type: 'string',
		enum: GenderUserEnum,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsEnum(GenderUserEnum)
	gender: GenderUserEnum;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	phoneNumber: string;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	address: string;

	@ApiProperty({
		type: 'string',
		format: 'date-time',
		required: false,
		nullable: true,
	})
	@IsOptional()
	@IsDateString()
	@AutoTrim()
	dateOfBirth: Date;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	nickName: string;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	bio: string;
}
