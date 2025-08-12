import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto } from 'src/common';
import { ChatRoomsEntity } from 'src/models';

import { Auth } from '../auth/decorators';
import { MyInformation } from '../users/decorators';
import { UserInformationDto } from '../users/dtos';

import { CreateChatRoomCommand } from './commands/implements';
import { CreateChatRoomRequestDto } from './dtos';

@ApiTags('ChatRoom')
@Controller('chat-rooms')
export class ChatRoomsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

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
