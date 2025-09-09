type MessageType = 'TEXT' | 'IMAGE';

interface IMessage {
	id?: string;
	userId: string;
	name: string;
	avatar: string;
	chatRoomId: string;
	content: string;
	type: MessageType;
	createdAt: Date;
	isRead: boolean;
}

interface IOnlineUser {
	online: string[];
}
