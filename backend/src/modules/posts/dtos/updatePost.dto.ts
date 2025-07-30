import { ApiProperty } from '@nestjs/swagger';

import { AgePostEnum, PostStatusEnum, SizePostEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	IsEnum,
	IsOptional,
	IsString,
	IsInt,
	Min,
	ValidateNested,
	IsArray,
} from 'class-validator';

export class NewPostImageDto {
	@ApiProperty({ example: 'https://example.com/image.jpg' })
	@IsString()
	url: string;
}

export class UpdatePostDto {
	@ApiProperty({ example: 'Updated post title', required: false })
	@IsOptional()
	@IsString()
	title?: string;

	@ApiProperty({ example: 'Updated post description', required: false })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({ enum: AgePostEnum, enumName: 'AgePostEnum', required: false })
	@IsOptional()
	@IsEnum(AgePostEnum)
	age?: AgePostEnum;

	@ApiProperty({ enum: SizePostEnum, enumName: 'SizePostEnum', required: false })
	@IsOptional()
	@IsEnum(SizePostEnum)
	size?: SizePostEnum;

	@ApiProperty({ minimum: 0, example: 1500000, required: false })
	@IsOptional()
	@IsInt()
	@Min(0)
	price?: number;

	@ApiProperty({ example: 'District 3, Ho Chi Minh City', required: false })
	@IsOptional()
	@IsString()
	address?: string;

	@ApiProperty({
		enum: PostStatusEnum,
		enumName: 'PostStatusEnum',
		required: false,
		example: PostStatusEnum.PUBLISHED,
	})
	@IsOptional()
	@IsEnum(PostStatusEnum)
	status?: PostStatusEnum;

	@ApiProperty({
		example: 'uuid-category-id',
		description: 'New category ID',
		required: false,
	})
	@IsOptional()
	@IsString()
	categoryId?: string;

	@ApiProperty({
		type: [NewPostImageDto],
		description: 'List of new post images',
		required: false,
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => NewPostImageDto)
	newPostImages?: NewPostImageDto[];

	@ApiProperty({
		type: [String],
		description: 'IDs of post images to be deleted',
		required: false,
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	deletePostImageIds?: string[];
}
