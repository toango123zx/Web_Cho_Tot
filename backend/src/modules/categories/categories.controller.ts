import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { RoleUserEnum } from '@prisma/client';
import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from 'src/models';
import { AuthRole } from 'src/modules/auth/decorators';
import {
	CreateCategoryCommand,
	DeleteCategoryCommand,
	UpdateCategoryCommand,
} from 'src/modules/categories/commands/implements';
import {
	GetCategoriesQuery,
	GetCategoryQuery,
} from 'src/modules/categories/queries/implements';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	async getCategories(
		@Query() pagination: PaginationDto,
	): Promise<HttpResponseBodyDto<CategoryDto[] | HttpException>> {
		return this.queryBus.execute(
			new GetCategoriesQuery(pagination, pagination.search),
		);
	}

	@Get('/:categoryId')
	async findCategoryById(
		@Param('categoryId') categoryId: string,
	): Promise<HttpResponseBodyDto<CategoryDto | HttpException>> {
		return this.queryBus.execute(new GetCategoryQuery(categoryId));
	}

	@AuthRole(RoleUserEnum.ADMIN)
	@Post()
	async createCategory(
		@Body() createCategoryDto: CreateCategoryDto,
	): Promise<HttpResponseBodyDto<CategoryDto | HttpException>> {
		return this.commandBus.execute(new CreateCategoryCommand(createCategoryDto));
	}

	@AuthRole(RoleUserEnum.ADMIN)
	@Patch('/:categoryId')
	async updateCategory(
		@Param('categoryId') categoryId: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
	): Promise<HttpResponseBodyDto<CategoryDto | HttpException>> {
		return this.commandBus.execute(
			new UpdateCategoryCommand(categoryId, updateCategoryDto),
		);
	}

	@AuthRole(RoleUserEnum.ADMIN)
	@Delete('/:categoryId')
	async deleteCategory(
		@Param('categoryId') categoryId: string,
	): Promise<HttpResponseBodyDto<CategoryDto | HttpException>> {
		return this.commandBus.execute(new DeleteCategoryCommand(categoryId));
	}
}
