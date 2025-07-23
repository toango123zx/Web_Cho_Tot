import { CreateUserHandler } from './createUser.handler';
import { DeleteUserHandler } from './deleteUser.handler';
import { UpdateUserHandler } from './updateUser.handler';
import { ChangePasswordHandler } from './changePassword.handler';

export const UserCommandHandlers = [
	CreateUserHandler,
	UpdateUserHandler,
	DeleteUserHandler,
	ChangePasswordHandler,
];
