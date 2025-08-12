import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import {
	IsIn,
	IsInt,
	IsOptional,
	IsPositive,
	IsString,
	IsUUID,
	Min,
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { GetApiConfig } from 'src/configs';

export const FILTERABLE_STATUS = ['PENDING', 'PUBLISHED', 'EXPIRED'] as const;
export type FilterablePostStatus = (typeof FILTERABLE_STATUS)[number];

export const AGE_VALUES = ['PUPPY', 'YOUNG_DOG', 'ADULT_DOG', 'OTHER'] as const;
export const SIZE_VALUES = ['MINI', 'SMALL', 'MEDIUM', 'LARGE'] as const;

export const SORT_BY_VALUES = ['createdAt', 'price', 'title'] as const;
export const SORT_ORDER_VALUES = ['asc', 'desc'] as const;

@ValidatorConstraint({ name: 'IsPriceRangeValid', async: false })
class IsPriceRangeValid implements ValidatorConstraintInterface {
	validate(_: unknown, args: ValidationArguments): boolean {
		const o = args.object as FilterPostDto;
		if (o.minPrice != null && o.maxPrice != null) return o.maxPrice >= o.minPrice;
		return true;
	}
	defaultMessage(): string {
		return 'maxPrice must be greater than or equal to minPrice';
	}
}

export class FilterPostDto {
	@ApiPropertyOptional({ type: 'number', default: GetApiConfig.defaultPage })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	page: number = GetApiConfig.defaultPage;

	@ApiPropertyOptional({ type: 'number', default: GetApiConfig.defaultLimitPage })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	limit: number = GetApiConfig.defaultLimitPage;

	@ApiPropertyOptional({
		enum: FILTERABLE_STATUS,
		enumName: 'FilterablePostStatus',
		description: 'Filter by post status (excludes DELETED)',
	})
	@IsOptional()
	@IsIn(FILTERABLE_STATUS)
	status?: FilterablePostStatus;

	@ApiPropertyOptional({ description: 'Search term for title and description' })
	@IsOptional()
	@IsString()
	@Transform(({ value }) =>
		typeof value === 'string' ? value.trim() || undefined : value,
	)
	search?: string;

	@ApiPropertyOptional({ description: 'Filter by category ID' })
	@IsOptional()
	@IsUUID()
	@Transform(({ value }) =>
		typeof value === 'string' ? value.trim() || undefined : value,
	)
	categoryId?: string;

	@ApiPropertyOptional({
		enum: AGE_VALUES,
		enumName: 'AgePostEnum',
		description: 'Filter by pet age',
	})
	@IsOptional()
	@IsIn(AGE_VALUES)
	age?: (typeof AGE_VALUES)[number];

	@ApiPropertyOptional({
		enum: SIZE_VALUES,
		enumName: 'SizePostEnum',
		description: 'Filter by pet size',
	})
	@IsOptional()
	@IsIn(SIZE_VALUES)
	size?: (typeof SIZE_VALUES)[number];

	@ApiPropertyOptional({ type: 'number', description: 'Minimum price filter' })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	minPrice?: number;

	@ApiPropertyOptional({ type: 'number', description: 'Maximum price filter' })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	@Validate(IsPriceRangeValid)
	maxPrice?: number;

	@ApiPropertyOptional({ description: 'Filter by location/address' })
	@IsOptional()
	@IsString()
	@Transform(({ value }) =>
		typeof value === 'string' ? value.trim() || undefined : value,
	)
	address?: string;

	@ApiPropertyOptional({ description: 'Filter by district' })
	@IsOptional()
	@IsString()
	@Transform(({ value }) =>
		typeof value === 'string' ? value.trim() || undefined : value,
	)
	district?: string;

	@ApiPropertyOptional({ description: 'Filter by province' })
	@IsOptional()
	@IsString()
	@Transform(({ value }) =>
		typeof value === 'string' ? value.trim() || undefined : value,
	)
	province?: string;

	@ApiPropertyOptional({ enum: SORT_BY_VALUES, description: 'Sort field' })
	@IsOptional()
	@IsIn(SORT_BY_VALUES)
	sortBy?: (typeof SORT_BY_VALUES)[number];

	@ApiPropertyOptional({ enum: SORT_ORDER_VALUES, description: 'Sort order' })
	@IsOptional()
	@Transform(({ value }) => value?.toLowerCase())
	@IsIn(SORT_ORDER_VALUES)
	sortOrder?: (typeof SORT_ORDER_VALUES)[number];
}
