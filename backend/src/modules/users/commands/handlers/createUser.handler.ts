import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { genSalt, hash } from 'bcrypt';
import { ConflictException, HttpResponseBodySuccessDto } from 'src/common';
import { CreateAccountsDto, UsersDto } from 'src/models';

import { AuthRepository } from 'src/modules/auth/auth.repository';
import { UserRepository } from 'src/modules/users/users.repository';

import { CreateUserCommand } from '../implements';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly userRepository: UserRepository,
	) {}

	async execute(
		command: CreateUserCommand,
	): Promise<HttpResponseBodySuccessDto<UsersDto> | HttpException> {
		const { createUserDto } = command;
		const user = await this.userRepository.findUserByEmail({
			email: createUserDto.email,
		});
		if (user) {
			throw new ConflictException('username or email');
		}

		const salt = await genSalt(10);
		const hashedPassword = await hash(createUserDto.password, salt);
		const accountData: CreateAccountsDto = {
			password: hashedPassword,
			salt: salt,
			user: {
				create: {
					name: createUserDto.name,
					email: createUserDto.email,
					phoneNumber: createUserDto.phoneNumber,
					address: createUserDto.address,
					gender: createUserDto.gender,
					dob: createUserDto.dateOfBirth,
					bio: createUserDto.bio,
				},
			},
		};

		const newAccount = await this.authRepository.createAccount({
			account: accountData,
		});

		const userResponse = await this.userRepository.findUserByUserId(
			newAccount.userId,
		);

		return { success: true, data: userResponse };
	}
}
