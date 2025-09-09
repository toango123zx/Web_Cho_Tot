import { MessagesEntity } from 'src/models';

export class MessageResponseDto {
	id: string;
	content: string;
	type: string;
	createdAt: Date;
	chatRoomId: string;
	userId: string;
	name: string;
	avatar: string;
	isRead: boolean;

	constructor(message: MessagesEntity) {
		this.id = message.id;
		this.content = message.content;
		this.type = message.type;
		this.createdAt = message.createdAt;
		this.chatRoomId = message.chatRoomId;
		this.userId = message.user.id;
		this.name = message.user.name;
		this.avatar = message.user.avatar;
		this.isRead = message.isRead;
	}
}
