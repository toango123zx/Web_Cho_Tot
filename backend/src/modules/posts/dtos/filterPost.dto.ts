import { ApiProperty } from '@nestjs/swagger';

import { PostStatusEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { GetApiConfig } from 'src/configs';

export class FilterPostDto {
	@ApiProperty({ type: 'number', required: false })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	page: number = GetApiConfig.defaultPage;

	@ApiProperty({ type: 'number', required: false })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	limit: number = GetApiConfig.defaultLimitPage;

	@ApiProperty({
		type: 'string',
		enum: PostStatusEnum,
		enumName: 'PostStatusEnum',
		required: false,
	})
	@IsOptional()
	@IsEnum(PostStatusEnum)
	status?: PostStatusEnum;
}
