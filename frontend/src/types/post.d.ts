type IPostStatus = 'PENDING' | 'PUBLISHED' | 'EXPIRED' | 'DELETED';

interface IPostImage {
	id: string;
	postId: string;
	url: string;
}

interface IPost {
	id: string;
	userId: string;
	title: string;
	categoryId: string;
	description: string;
	age: string;
	size: string;
	price: number;
	address: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	status: IPostStatus;
	postImages: IPostImage[];
}

interface IPostWithCategoryAndUser extends IPost {
	category: Category;
	user: IUser;
}
