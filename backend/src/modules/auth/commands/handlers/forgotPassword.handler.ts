import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { genSalt, hash } from 'bcrypt';
import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';
import { OtpsService } from 'src/modules/otps/services/otps.service';

import { UserRepository } from 'src/modules/users/users.repository';

import { AuthRepository } from '../../auth.repository';
import { ForgotPasswordResponseDto } from '../../dtos';
import { ForgotPasswordCommand } from '../implements';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
	constructor(
		private readonly otpsService: OtpsService,
		private readonly authRepository: AuthRepository,
		private readonly userRepository: UserRepository,
	) {}

	async execute(
		command: ForgotPasswordCommand,
	): Promise<HttpResponseBodySuccessDto<ForgotPasswordResponseDto> | HttpException> {
		const { forgotPassword } = command;
		const user = await this.userRepository.findUserByEmail({
			email: forgotPassword.email,
		});
		if (!user) {
			throw new NotFoundException('email');
		}

		await this.otpsService.verifyOtp({
			otp: forgotPassword.otp,
			userId: user.id,
		});

		const salt = await genSalt(10);
		const hashedPassword = await hash(forgotPassword.newPassword, salt);

		const account: ForgotPasswordResponseDto =
			await this.authRepository.updatePasswordByUserId({
				userId: user.id,
				salt: salt,
				newPassword: hashedPassword,
			});

		delete account.password;
		delete account.salt;
		if (account.user) {
			account.name = account.user.name;
			delete account.user;
		}
		return { success: true, data: account };
	}
}
