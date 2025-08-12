import { ApiProperty } from '@nestjs/swagger';

import { GenderUserEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { AutoTrim } from 'src/common';
import { IsBeforeNow } from 'src/modules/users/decorators/isBeforeNow.decorator';

export class UpdateUserDto {
	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
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
		required: false,
	})
	@IsOptional()
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
		required: false,
	})
	@IsOptional()
	@IsString()
	@AutoTrim()
	bio: string;

	@ApiProperty({
		type: 'string',
		required: false,
	})
	@IsOptional()
	@IsString()
	@AutoTrim()
	avatar: string;
}
