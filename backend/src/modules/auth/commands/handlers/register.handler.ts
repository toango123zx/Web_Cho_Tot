import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { genSalt, hash } from 'bcrypt';
import { ConflictException, HttpResponseBodySuccessDto } from 'src/common';
import { CreateAccountsDto } from 'src/models';

import { UserRepository } from 'src/modules/users/users.repository';

import { AuthRepository } from '../../auth.repository';
import { RegisterResponseDto } from '../../dtos';
import { RegisterCommand } from '../implements';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly userRepository: UserRepository,
	) {}

	async execute(
		command: RegisterCommand,
	): Promise<HttpResponseBodySuccessDto<RegisterResponseDto> | HttpException> {
		const { registerDto } = command;
		const user = await this.userRepository.findUserByEmail({
			email: registerDto.email,
			name: registerDto.name,
		});
		if (user) {
			throw new ConflictException('name or email');
		}

		const salt = await genSalt(10);
		const hashedPassword = await hash(registerDto.password, salt);
		const accountData: CreateAccountsDto = {
			password: hashedPassword,
			salt: salt,
			user: {
				create: {
					name: registerDto.name,
					email: registerDto.email,
				},
			},
		};

		const newAccount: RegisterResponseDto = await this.authRepository.createAccount({
			account: accountData,
		});

		delete newAccount.password;
		delete newAccount.salt;
		newAccount.name = accountData.user.create.name;
		delete newAccount.user;
		return { success: true, data: newAccount };
	}
}
