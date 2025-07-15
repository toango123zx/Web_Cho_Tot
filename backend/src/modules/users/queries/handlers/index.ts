import { DeleteUserByUserIdHandler } from './deleteUserByUserId.handler';
import { GetMeHandler } from './getMe.handler';
import { GetUserByUserIdHandler } from './getUserByUserId.handler';
import { GetUsersHandler } from './getUsers.handler';

export const UserQueryHandlers = [
	GetUsersHandler,
	GetMeHandler,
	GetUserByUserIdHandler,
	DeleteUserByUserIdHandler,
];
