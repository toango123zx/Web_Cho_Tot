import { GetChatRoomByChatRoomIdHandler } from './getChatRoomByChatRoomId.handler';
import { GetChatRoomsByUserIdHandler } from './getChatRoomsByUserId.handler';

export const ChatRoomQueryHandlers = [
	GetChatRoomsByUserIdHandler,
	GetChatRoomByChatRoomIdHandler,
];
