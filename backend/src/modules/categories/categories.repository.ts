import { Injectable } from '@nestjs/common';

import { IPaginationQuery } from 'src/common';
import { CategoryEntity, UpdateCategoryDto } from 'src/models';
import { CreateCategoryDto } from 'src/models/category/dto/create-category.dto';
import { PrismaService } from 'src/modules/database/services';

@Injectable()
export class CategoriesRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findCategories(
		pagination: IPaginationQuery,
	): Promise<[CategoryEntity[], number]> {
		const [categories, totalRecords] = await Promise.all([
			this.prismaService.category.findMany({
				where: {
					deletedAt: null,
				},
				skip: pagination.skip,
				take: pagination.take,
				orderBy: {
					createdAt: 'asc',
				},
			}),
			this.prismaService.category.count({
				where: {
					deletedAt: null,
				},
			}),
		]);
		return [categories, totalRecords];
	}

	async findCategoryById(categoryId: string): Promise<CategoryEntity> {
		return this.prismaService.category.findFirst({
			where: { id: categoryId, deletedAt: null },
			include: { posts: true },
		});
	}

	async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
		return this.prismaService.category.create({
			data: createCategoryDto,
		});
	}

	async updateCategory(
		categoryId: string,
		updateCategoryDto: UpdateCategoryDto,
	): Promise<CategoryEntity> {
		return this.prismaService.category.update({
			where: { id: categoryId },
			data: updateCategoryDto,
		});
	}

	async deleteCategoryById(categoryId: string): Promise<CategoryEntity> {
		return this.prismaService.category.update({
			where: { id: categoryId },
			data: { deletedAt: new Date() },
		});
	}
}
