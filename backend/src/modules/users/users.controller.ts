import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { UsersDto } from 'src/models';

import { GetUsersQuery } from './queries/implements';

@ApiTags('User')
@Controller('users')
export class UsersController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	@ApiOperation({ summary: 'Get paginated list of users for tadmin' })
	async getUsers(
		@Query() pagination: PaginationDto,
	): Promise<HttpResponseBodyDto<UsersDto[] | HttpException>> {
		return this.queryBus.execute(new GetUsersQuery(pagination));
	}
}
