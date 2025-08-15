import { Body, Controller, Get, HttpException, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { ChatRoomsEntity } from 'src/models';

import { Auth } from '../auth/decorators';
import { MyInformation } from '../users/decorators';
import { UserInformationDto } from '../users/dtos';

import { CreateChatRoomCommand } from './commands/implements';
import {
	CreateChatRoomRequestDto,
	GetChatRoomResponseDto,
	GetChatRoomsResponseDto,
} from './dtos';
import {
	GetChatRoomByChatRoomIdQuery,
	GetChatRoomsByUserIdQuery,
} from './queries/implements';

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
	): Promise<HttpResponseBodyDto<GetChatRoomsResponseDto[] | HttpException>> {
		return this.queryBus.execute(
			new GetChatRoomsByUserIdQuery(userInformation, pagination),
		);
	}

	@Auth()
	@Get(':chatRoomId')
	async getChatRoomById(
		@Param('chatRoomId') chatRoomId: string,
		@MyInformation() userInformation: UserInformationDto,
		@Query() pagination: PaginationDto,
	): Promise<HttpResponseBodyDto<GetChatRoomResponseDto | HttpException>> {
		return this.queryBus.execute(
			new GetChatRoomByChatRoomIdQuery(chatRoomId, pagination, userInformation),
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
