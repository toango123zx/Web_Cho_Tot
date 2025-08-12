interface IRegister {
	id: string;
	userId: string;
	verify: boolean;
	createdAt: string;
	name: string;
}

interface ILogin {
	accessToken: string;
}
