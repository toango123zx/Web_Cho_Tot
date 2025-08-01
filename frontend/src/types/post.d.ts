interface IPostImage {
	id: string;
	postId: string;
	url: string;
}

interface ICategory {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

interface IUser {
	id: string;
	name: string;
	avatar: string;
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
	status: string;
	postImages: IPostImage[];
	category: ICategory;
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
