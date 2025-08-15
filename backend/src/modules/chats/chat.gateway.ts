import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { commonAppConfig } from 'src/configs';
import { CreateMessagesDto } from 'src/models';

import { ChatRoomsRepository } from '../chatRooms/chatRooms.repository';
import { AppGateway } from '../gateway/app.gateway';

import { ChatsRepository } from './chats.repository';
import { MessageRequestDto, MessageResponseDto } from './dto';

@WebSocketGateway({
	cors: commonAppConfig.corsOrigin,
})
export class ChatGateway {
	@WebSocketServer() server: Server;

	constructor(
		private readonly appGateway: AppGateway,
		private readonly chatRoomsRepository: ChatRoomsRepository,
		private readonly chatsRepository: ChatsRepository,
	) {}

	@SubscribeMessage('chat:sendMessage')
	async handleSendMessage(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: MessageRequestDto = new MessageRequestDto(),
	): Promise<void> {
		try {
			const myInformationId = this.appGateway.getUserIdBySocketId(client.id);
			if (!myInformationId) {
				client.emit('error', { message: 'Người dùng chưa đăng nhập' });
				return;
			}

			const { chatRoomId, content, type } = data;
			const chatRoom = await this.chatRoomsRepository.findChatRoom({
				chatRoomId: chatRoomId,
				userId: myInformationId,
			});

			if (!chatRoom) {
				client.emit('error', { message: 'Không tìm thấy chatRoomId' });
				return;
			}

			const newMessage: CreateMessagesDto = {
				chatRoom: {
					connect: {
						id: chatRoomId,
					},
				},
				user: {
					connect: {
						id: myInformationId,
					},
				},
				content: content,
				type: type,
			};

			const newMessageCreated = await this.chatsRepository.createMessage({
				message: newMessage,
			});

			this.appGateway.emitToUser({
				userId:
					chatRoom.firstUser.id === myInformationId
						? chatRoom.secondUser.id
						: chatRoom.firstUser.id,
				event: 'newMessage',
				data: new MessageResponseDto(newMessageCreated),
			});
		} catch {
			client.emit('error', { message: 'Đã xảy ra lỗi' });
		}
	}
}
