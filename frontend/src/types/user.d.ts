interface IUser {
	id: string;
	name: string;
	role: 'USER' | 'ADMIN' | string;
	email: string;
	address: string | null;
	phoneNumber: string | null;
	avatar: string;
	bio: string | null;
	gender: 'male' | 'female' | 'other' | null;
	dob: string | null; // ISO format (e.g., "1990-01-01") if available
	balance: number;
}

interface ILogin {
	accessToken: string;
}

interface IRegister {
	id: string;
	userId: string;
	verify: boolean;
	createdAt: string;
	name: string;
}

interface IUserUpdatePayload {
	id: number;
	name: string;
	email: string;
}

interface IFetchAccount extends IUser {}

interface IUserTable extends IUser {
	createdAt: string;
	updatedAt: string;
}
