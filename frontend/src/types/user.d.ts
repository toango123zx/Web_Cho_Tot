type UserRole = 'ADMIN' | 'USER';
type Gender = 'MALE' | 'FEMALE' | 'OTHER';

interface IUser {
	id: string;
	name: string;
	role: UserRole;
	email: string;
	address: string | null;
	phoneNumber: string | null;
	avatar: string;
	bio: string | null;
	gender: Gender | null;
	dob: string | null;
	balance: number;
	createdAt: string;
	deletedAt: string | null;
}

interface IUserCreation {
	email: string;
	password: string;
	name: string;
	gender: Gender | null;
	// role: UserRole;
	phoneNumber: string | null;
	address: string | null;
	dateOfBirth: string | null;
	bio: string | null;
}

interface IUserUpdatePayload {
	name: string | null;
	address: string | null;
	phoneNumber?: string | null;
	avatar: string | null;
	bio: string | null;
	gender: Gender | null;
	dateOfBirth: string | null;
	avatar: string | null;
}
interface IFetchAccount extends IUser {}

interface IChangePassword {
	id: string;
	userId: string;
	verify: boolean;
}
