import { ChatRoomsEntity } from 'src/models';
import { UserInformationDto } from 'src/modules/users/dtos';

export class GetChatRoomsResponseDto {
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
	latestMessage?:
		| {
				content: string;
				type: string;
				userId: string;
				isRead: boolean;
				createdAt: Date;
		  }
		| undefined;
	updatedAt: Date;

	constructor({
		chatRoom,
		myInformation,
	}: {
		chatRoom: ChatRoomsEntity;
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
		this.latestMessage =
			chatRoom.messages && chatRoom.messages.length > 0
				? {
						content: chatRoom.messages?.[0]?.content,
						userId: chatRoom.messages?.[0]?.userId,
						type: chatRoom.messages?.[0]?.type,
						isRead: chatRoom.messages?.[0]?.isRead,
						createdAt: chatRoom.messages?.[0]?.createdAt,
					}
				: undefined;
		this.updatedAt = chatRoom.updatedAt;
	}
}
