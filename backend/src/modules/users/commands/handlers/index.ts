import { CreateUserHandler } from './createUser.handler';
import { DeleteUserHandler } from './deleteUser.handler';
import { UpdateUserHandler } from './updateUser.handler';

export const UserCommandHandlers = [
	CreateUserHandler,
	UpdateUserHandler,
	DeleteUserHandler,
];
