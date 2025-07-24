import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { hash } from 'bcrypt';
import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
} from 'src/common';
import { AccountsEntity } from 'src/models';

import { AuthRepository } from 'src/modules/auth/auth.repository';
import { UserRepository } from 'src/modules/users/users.repository';

import { ChangePasswordCommand } from '../implements';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly userRepository: UserRepository,
	) {}

	async execute(
		command: ChangePasswordCommand,
	): Promise<HttpResponseBodySuccessDto<AccountsEntity> | HttpException> {
		const { changePasswordDto, userInformation } = command;

		const account = await this.authRepository.findAccountByEmail({
			email: userInformation.email,
		});

		if (!account) {
			throw new NotFoundException('Account not found');
		}

		const hashedPassword = await hash(
			changePasswordDto.currentPassword,
			account.salt,
		);

		if (hashedPassword !== account.password) {
			throw new OptionalException(400, 'Current password is incorrect');
		}

		const newHashedPassword = await hash(changePasswordDto.newPassword, account.salt);

		if (newHashedPassword === account.password) {
			throw new OptionalException(
				400,
				'New password cannot be the same as the current password',
			);
		}

		const updatedAccount = await this.userRepository.changePassword({
			id: account.id,
			newPassword: newHashedPassword,
		});

		delete updatedAccount.password;
		delete updatedAccount.salt;

		return { success: true, data: updatedAccount };
	}
}
