interface IChatRoom {
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
	latestMessage?: {
		content: string;
		type: string;
		userId: string;
		isRead: boolean;
		createdAt: Date;
	};
	messages?: IMessage[];
	updatedAt: Date;
}
