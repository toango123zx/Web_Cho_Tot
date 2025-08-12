import { Body, Controller, Get, HttpException, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { ChatRoomsEntity } from 'src/models';

import { Auth } from '../auth/decorators';
import { MyInformation } from '../users/decorators';
import { UserInformationDto } from '../users/dtos';

import { CreateChatRoomCommand } from './commands/implements';
import {
	ChatRoomsFilterDto,
	CreateChatRoomRequestDto,
	GetChatRoomsResponseDto,
} from './dtos';
import { GetChatRoomsByUserIdQuery } from './queries/implements';

@ApiTags('ChatRoom')
@Controller('chat-rooms')
export class ChatRoomsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Auth()
	@Get()
	async getChatRoomsByUserId(
		@MyInformation() userInformation: UserInformationDto,
		@Query() pagination: PaginationDto,
		@Query() filter?: ChatRoomsFilterDto,
	): Promise<HttpResponseBodyDto<GetChatRoomsResponseDto | HttpException>> {
		return this.queryBus.execute(
			new GetChatRoomsByUserIdQuery(userInformation, pagination, filter),
		);
	}

	@Auth()
	@Post()
	async createChatRoom(
		@MyInformation() userInformation: UserInformationDto,
		@Body() createChatRoomRequest: CreateChatRoomRequestDto,
	): Promise<HttpResponseBodyDto<ChatRoomsEntity | HttpException>> {
		return this.commandBus.execute(
			new CreateChatRoomCommand(userInformation, createChatRoomRequest),
		);
	}
}
