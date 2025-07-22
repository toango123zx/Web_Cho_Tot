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
import { IsBeforeNow } from 'src/modules/users/decorators/isBeforeNow.decorator';

export class CreateUserDto {
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
		required: false,
		example: '0912345678',
	})
	@IsOptional()
	@IsString()
	@AutoTrim()
	@Matches(/^\d{10}$/, {
		message: 'phoneNumber must be exactly 10 digits',
	})
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
	@IsBeforeNow()
	dateOfBirth: Date;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	bio: string;
}
