import { HttpException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	PaginationUtils,
} from 'src/common';

import { ChatsRepository } from 'src/modules/chats/chats.repository';

import { ChatRoomsRepository } from '../../chatRooms.repository';
import { GetChatRoomResponseDto } from '../../dtos';
import { GetChatRoomByChatRoomIdQuery } from '../implements';

@QueryHandler(GetChatRoomByChatRoomIdQuery)
export class GetChatRoomByChatRoomIdHandler
	implements IQueryHandler<GetChatRoomByChatRoomIdQuery>
{
	constructor(
		private readonly chatRoomsRepository: ChatRoomsRepository,
		private readonly chatsRepository: ChatsRepository,
	) {}

	async execute(
		command: GetChatRoomByChatRoomIdQuery,
	): Promise<HttpResponseBodySuccessDto<GetChatRoomResponseDto> | HttpException> {
		const { chatRoomId, myInformation, pagination } = command;

		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);

		const chatRoom = await this.chatRoomsRepository.findChatRoom({
			chatRoomId: chatRoomId,
			userId: myInformation.id,
		});

		if (!chatRoom) {
			throw new NotFoundException('chatRoomId');
		}

		const messages = (
			await this.chatsRepository.findMessages({
				chatRoomId: chatRoom.id,
				pagination: page,
			})
		)[0];

		return {
			success: true,
			data: new GetChatRoomResponseDto({
				chatRoom: chatRoom,
				messages: messages,
				myInformation: myInformation,
			}),
		};
	}
}
