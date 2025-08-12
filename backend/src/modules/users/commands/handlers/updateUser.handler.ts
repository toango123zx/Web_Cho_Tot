import { HttpException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ConflictException, HttpResponseBodySuccessDto } from 'src/common';
import { UsersDto } from 'src/models';
import { UpdateUserCommand } from 'src/modules/users/commands/implements/updateUser.command';

import { UserRepository } from 'src/modules/users/users.repository';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(
		command: UpdateUserCommand,
	): Promise<HttpResponseBodySuccessDto<UsersDto> | HttpException> {
		const { updateUserDto, userId } = command;
		const existingUser = await this.userRepository.checkUserExistsByNameOrPhoneNumber(
			{
				phoneNumber: updateUserDto.phoneNumber,
				name: updateUserDto.name,
				userId,
			},
		);

		if (existingUser) {
			throw new ConflictException('name or phoneNumber');
		}

		const updatedUser = await this.userRepository.updateAccountByUserId({
			userId,
			updateUserDto,
		});

		if (!updatedUser) {
			throw new NotFoundException('userId');
		}

		const userResponse = await this.userRepository.findUserByUserId(
			updatedUser.userId,
		);

		return { success: true, data: userResponse };
	}
}
