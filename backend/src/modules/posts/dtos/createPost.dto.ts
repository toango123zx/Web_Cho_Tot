import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsInt,
	Min,
	ValidateNested,
	IsArray,
	IsUUID,
	ArrayMinSize,
} from 'class-validator';

export enum AgePostEnum {
	PUPPY = 'PUPPY',
	YOUNG_DOG = 'YOUNG_DOG',
	ADULT_DOG = 'ADULT_DOG',
	OTHER = 'OTHER',
}

export enum SizePostEnum {
	MINI = 'MINI',
	SMALL = 'SMALL',
	MEDIUM = 'MEDIUM',
	LARGE = 'LARGE',
}

export enum PostStatusEnum {
	PENDING = 'PENDING',
	PUBLISHED = 'PUBLISHED',
	EXPIRED = 'EXPIRED',
	DELETED = 'DELETED',
}

export class PostImageInput {
	@ApiProperty({ example: 'https://example.com/image.jpg' })
	@IsString()
	url: string;
}

export class CreatePostDto {
	@ApiProperty({ example: 'Post title' })
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({ example: 'Detailed post description' })
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty({ enum: AgePostEnum, enumName: 'AgePostEnum' })
	@IsEnum(AgePostEnum)
	age: AgePostEnum;

	@ApiProperty({ enum: SizePostEnum, enumName: 'SizePostEnum' })
	@IsEnum(SizePostEnum)
	size: SizePostEnum;

	@ApiProperty({ minimum: 0, example: 1000000 })
	@IsInt()
	@Min(0)
	price: number;

	@ApiProperty({ example: 'District 1, Ho Chi Minh City' })
	@IsString()
	@IsNotEmpty()
	address: string;

	@ApiProperty({
		enum: PostStatusEnum,
		enumName: 'PostStatusEnum',
		default: PostStatusEnum.PENDING,
	})
	@IsEnum(PostStatusEnum)
	@IsOptional()
	status?: PostStatusEnum = PostStatusEnum.PENDING;

	@ApiProperty({ example: 'uuid-category-id', description: 'ID of the category' })
	@IsString()
	@IsUUID()
	@IsNotEmpty()
	categoryId: string;

	@ApiProperty({
		type: [PostImageInput],
		required: true,
		description: 'List of post images (required)',
	})
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => PostImageInput)
	postImages: PostImageInput[];
}
