import { ApiProperty } from '@nestjs/swagger';

import { PostStatusEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { GetApiConfig } from 'src/configs';

enum FilterablePostStatus {
	PENDING = 'PENDING',
	PUBLISHED = 'PUBLISHED',
	EXPIRED = 'EXPIRED',
}

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
		enum: FilterablePostStatus,
		enumName: 'FilterablePostStatus',
		required: false,
		description: 'Filter by post status (excludes DELETED)',
	})
	@IsOptional()
	@IsEnum(PostStatusEnum)
	status?: Exclude<PostStatusEnum, 'DELETED'>;
}
