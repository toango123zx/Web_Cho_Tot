import { ChatRoomsEntity } from 'src/models';

export class GetChatRoomsResponseDto {
	id: string;
	firstUser: {
		id: string;
		name: string;
	};
	secondUser: {
		id: string;
		name: string;
	};
	updatedAt: Date;

	constructor(chatRooms: ChatRoomsEntity[]) {
		chatRooms.forEach((element) => {
			this.id = element.id;
			this.firstUser = {
				id: element.firstUser.id,
				name: element.firstUser.name,
			};
			this.secondUser = {
				id: element.secondUser.id,
				name: element.secondUser.name,
			};
			this.updatedAt = element.updatedAt;
		});
	}
}
