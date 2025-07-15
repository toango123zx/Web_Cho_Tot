import { Controller, Delete, Get, HttpException, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleUserEnum } from '@prisma/client';
import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { UsersDto } from 'src/models';
import { Auth, AuthRole } from 'src/modules/auth/decorators';
import { MyInformation } from 'src/modules/users/decorators';
import { DeleteUserByUserIdQuery } from 'src/modules/users/queries/implements/deleteUserByUserId.query';

import { GetMeQuery, GetUserByUserIdQuery, GetUsersQuery } from './queries/implements';

@ApiTags('User')
@Controller('users')
export class UsersController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@AuthRole(RoleUserEnum.ADMIN)
	@Get()
	@ApiOperation({ summary: 'Get paginated list of users for tadmin' })
	async getUsers(
		@Query() pagination: PaginationDto,
	): Promise<HttpResponseBodyDto<UsersDto[] | HttpException>> {
		return this.queryBus.execute(new GetUsersQuery(pagination));
	}

	@Auth()
	@Get('/me')
	async getMe(
		@MyInformation() userInformation: UsersDto,
	): Promise<HttpResponseBodyDto<UsersDto | HttpException>> {
		return this.queryBus.execute(new GetMeQuery(userInformation));
	}

	@Auth()
	@Get('/:userId')
	async findUserByUserId(
		@Param('userId') userId: string,
	): Promise<HttpResponseBodyDto<UsersDto | HttpException>> {
		return this.queryBus.execute(new GetUserByUserIdQuery(userId));
	}

	@AuthRole(RoleUserEnum.ADMIN)
	@Delete('/:userId')
	async deleteUserByUserId(
		@Param('userId') userId: string,
	): Promise<HttpResponseBodyDto<UsersDto | HttpException>> {
		return this.queryBus.execute(new DeleteUserByUserIdQuery(userId));
	}
}
