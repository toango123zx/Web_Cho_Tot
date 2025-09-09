import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ConflictException, HttpResponseBodySuccessDto, OrderByEnum } from 'src/common';
import { ChatRoomsEntity, CreateChatRoomsDto } from 'src/models';

import { ChatRoomsRepository } from '../../chatRooms.repository';
import { CreateChatRoomCommand } from '../implements';

@CommandHandler(CreateChatRoomCommand)
export class CreateChatRoomHandler implements ICommandHandler<CreateChatRoomCommand> {
	constructor(private readonly chatRoomsRepository: ChatRoomsRepository) {}

	async execute(
		command: CreateChatRoomCommand,
	): Promise<HttpResponseBodySuccessDto<ChatRoomsEntity> | HttpException> {
		const { myInformation, createChatRoomRequest } = command;

		const totalRecordchatRoomsExists = (
			await this.chatRoomsRepository.findChatRooms({
				chatRoomMember: [myInformation.id, createChatRoomRequest.userId],
				filter: {
					updatedAt: OrderByEnum.DESC,
				},
			})
		)[1];

		if (totalRecordchatRoomsExists != 0) {
			throw new ConflictException('ChatRoom');
		}

		const chatRoom: CreateChatRoomsDto = {
			firstUser: {
				connect: {
					id: myInformation.id,
				},
			},
			secondUser: {
				connect: {
					id: createChatRoomRequest.userId,
				},
			},
		};

		const chatRoomCreated = await this.chatRoomsRepository.createChatRoom({
			chatRoom: chatRoom,
		});

		return {
			success: true,
			data: chatRoomCreated,
		};
	}
}
