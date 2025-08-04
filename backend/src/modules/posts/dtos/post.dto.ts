import { ApiProperty } from '@nestjs/swagger';

import { AgePostEnum, PostStatusEnum, SizePostEnum } from '@prisma/client';
import { CategoryDto, PostArchivesEntity, PostImagesDto } from 'src/models';

export class UserPreviewDto {
	@ApiProperty({ type: 'string' })
	id: string;

	@ApiProperty({ type: 'string' })
	name: string;

	@ApiProperty({ type: 'string' })
	avatar: string;

	@ApiProperty({ type: 'string' })
	phoneNumber?: string;
}

export class PostsDto {
	@ApiProperty({ type: 'string' })
	id: string;

	@ApiProperty({ type: 'string' })
	title: string;

	@ApiProperty({ type: 'string' })
	description: string;

	@ApiProperty({ enum: AgePostEnum, enumName: 'AgePostEnum' })
	age: AgePostEnum;

	@ApiProperty({ enum: SizePostEnum, enumName: 'SizePostEnum' })
	size: SizePostEnum;

	@ApiProperty({ minimum: 0, type: 'integer', format: 'int32' })
	price: number;

	@ApiProperty({ type: 'boolean' })
	isArchived?: boolean;

	@ApiProperty({ type: 'string' })
	address: string;

	@ApiProperty({ type: 'string', format: 'date-time' })
	createdAt: Date;

	@ApiProperty({ type: 'string', format: 'date-time' })
	updatedAt: Date;

	@ApiProperty({ type: 'string', format: 'date-time', nullable: true })
	deletedAt: Date | null;

	@ApiProperty({ enum: PostStatusEnum, enumName: 'PostStatusEnum' })
	status: PostStatusEnum;

	@ApiProperty({ type: 'string' })
	userId: string;

	@ApiProperty({ type: () => UserPreviewDto, required: false })
	user?: UserPreviewDto;

	@ApiProperty({ type: 'string' })
	categoryId: string;

	@ApiProperty({ type: () => CategoryDto, required: false })
	category?: CategoryDto;

	@ApiProperty({ type: () => [PostImagesDto] })
	postImages?: PostImagesDto[];

	@ApiProperty({ type: () => [PostArchivesEntity] })
	postArchives?: PostArchivesEntity[];
}
