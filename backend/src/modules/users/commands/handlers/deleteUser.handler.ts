import { HttpException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto } from 'src/common';
import { UsersDto } from 'src/models';
import { DeleteUserCommand } from 'src/modules/users/commands/implements';

import { UserRepository } from 'src/modules/users/users.repository';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(
		command: DeleteUserCommand,
	): Promise<HttpResponseBodySuccessDto<UsersDto> | HttpException> {
		const { userId } = command;
		const user = await this.userRepository.findUserByUserId(userId);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const response = await this.userRepository.deleteUserByUserId(userId);

		if (!response) {
			throw new NotFoundException('Failed to delete user');
		}

		return {
			success: true,
			data: user,
		};
	}
}
