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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleUserEnum } from '@prisma/client';
import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { UsersDto } from 'src/models';
import { Auth, AuthRole } from 'src/modules/auth/decorators';
import {
	ChangePasswordCommand,
	CreateUserCommand,
	DeleteUserCommand,
} from 'src/modules/users/commands/implements';
import { UpdateUserCommand } from 'src/modules/users/commands/implements/updateUser.command';
import { MyInformation } from 'src/modules/users/decorators';
import {
	ChangePasswordDto,
	CreateUserDto,
	UpdateUserDto,
	UserInformationDto,
} from 'src/modules/users/dtos';

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
	@ApiOperation({ summary: 'Get paginated list of users for admin' })
	async getUsers(
		@Query() pagination: PaginationDto,
	): Promise<HttpResponseBodyDto<UsersDto[] | HttpException>> {
		return this.queryBus.execute(new GetUsersQuery(pagination));
	}

	@Auth()
	@Get('/me')
	async getMe(
		@MyInformation() userInformation: UserInformationDto,
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
		return this.commandBus.execute(new DeleteUserCommand(userId));
	}

	@AuthRole(RoleUserEnum.ADMIN)
	@Post()
	async createUser(
		@Body() createUserDto: CreateUserDto,
	): Promise<HttpResponseBodyDto<CreateUserDto | HttpException>> {
		return this.commandBus.execute(new CreateUserCommand(createUserDto));
	}

	@Auth()
	@Patch('/:userId')
	async updateUserByUserId(
		@Param('userId') userId: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<HttpResponseBodyDto<UsersDto | HttpException>> {
		return this.commandBus.execute(new UpdateUserCommand(userId, updateUserDto));
	}

	@Auth()
	@Post('/change-password')
	async changePassword(
		@Body() changePasswordDto: ChangePasswordDto,
		@MyInformation() userInformation: UserInformationDto,
	): Promise<HttpResponseBodyDto<UsersDto | HttpException>> {
		return this.commandBus.execute(
			new ChangePasswordCommand(changePasswordDto, userInformation),
		);
	}
}
