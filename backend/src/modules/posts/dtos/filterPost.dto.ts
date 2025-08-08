import { ApiProperty } from '@nestjs/swagger';

import { AgePostEnum, PostStatusEnum, SizePostEnum } from '@prisma/client';
import { Type, Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';
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

	@ApiProperty({
		type: 'string',
		required: false,
		description: 'Search term for title and description',
	})
	@IsOptional()
	@IsString()
	search?: string;

	@ApiProperty({
		type: 'string',
		required: false,
		description: 'Filter by category ID',
	})
	@IsOptional()
	@IsString()
	categoryId?: string;

	@ApiProperty({
		type: 'string',
		enum: AgePostEnum,
		enumName: 'AgePostEnum',
		required: false,
		description: 'Filter by pet age',
	})
	@IsOptional()
	@IsEnum(AgePostEnum)
	age?: AgePostEnum;

	@ApiProperty({
		type: 'string',
		enum: SizePostEnum,
		enumName: 'SizePostEnum',
		required: false,
		description: 'Filter by pet size',
	})
	@IsOptional()
	@IsEnum(SizePostEnum)
	size?: SizePostEnum;

	@ApiProperty({ type: 'number', required: false, description: 'Minimum price filter' })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	minPrice?: number;

	@ApiProperty({ type: 'number', required: false, description: 'Maximum price filter' })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	maxPrice?: number;

	@ApiProperty({
		type: 'string',
		required: false,
		description: 'Filter by location/address',
	})
	@IsOptional()
	@IsString()
	address?: string;

	@ApiProperty({
		type: 'string',
		required: false,
		description: 'Filter by district',
	})
	@IsOptional()
	@IsString()
	district?: string;

	@ApiProperty({
		type: 'string',
		required: false,
		description: 'Filter by province',
	})
	@IsOptional()
	@IsString()
	province?: string;

	@ApiProperty({ type: 'string', required: false, description: 'Sort field' })
	@IsOptional()
	@IsString()
	sortBy?: 'createdAt' | 'price' | 'title';

	@ApiProperty({ type: 'string', required: false, description: 'Sort order' })
	@IsOptional()
	@IsString()
	@Transform(({ value }) => value?.toLowerCase())
	sortOrder?: 'asc' | 'desc';
}
