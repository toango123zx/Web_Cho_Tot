import { TypeMessageEnum } from '@prisma/client';
import { ChatRoomsEntity, MessagesEntity } from 'src/models';
import { UserInformationDto } from 'src/modules/users/dtos';

export class GetChatRoomResponseDto {
	id: string;
	firstUser: {
		id: string;
		name: string;
		avatar: string;
	};
	secondUser: {
		id: string;
		name: string;
		avatar: string;
	};
	messages: {
		id: string;
		content: string;
		userId: string;
		name: string;
		avatar: string;
		type: TypeMessageEnum;
		createdAt: Date;
		isRead: boolean;
	}[];
	updatedAt: Date;

	constructor({
		chatRoom,
		messages,
		myInformation,
	}: {
		chatRoom: ChatRoomsEntity;
		messages: MessagesEntity[];
		myInformation: UserInformationDto;
	}) {
		const user =
			myInformation.id === chatRoom.firstUser.id
				? chatRoom.secondUser
				: chatRoom.firstUser;

		this.id = chatRoom.id;
		this.firstUser = {
			id: myInformation.id,
			name: myInformation.name,
			avatar: myInformation.avatar,
		};
		this.secondUser = {
			id: user.id,
			name: user.name,
			avatar: user.avatar,
		};
		this.messages =
			messages && messages.length > 0
				? messages.map((message) => ({
						id: message.id,
						content: message.content,
						userId: message.user.id,
						name: message.user.name,
						avatar: message.user.avatar,
						type: message.type,
						createdAt: message.createdAt,
						isRead: message.isRead,
					}))
				: [];
		this.updatedAt = chatRoom.updatedAt;
	}
}
