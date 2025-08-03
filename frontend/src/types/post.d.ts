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
	status: IPostStatus;
	postImages: IPostImage[];
}

interface IPostWithCategoryAndUser extends IPost {
	category: Category;
	user: IUser;
}

type PetAge = 'PUPPY' | 'YOUNG_DOG' | 'ADULT_DOG';
type PetSize = 'MINI' | 'SMALL' | 'MEDIUM' | 'LARGE';

interface ICreatePostImage {
	url: string;
}

interface ICreatePostPayload {
	title: string;
	description: string;
	age: PetAge;
	size: PetSize;
	price: number;
	address: string;
	categoryId: string;
	postImages: ICreatePostImage[];
}
