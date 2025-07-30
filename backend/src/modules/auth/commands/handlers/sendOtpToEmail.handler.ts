import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';
import { OtpsConfig } from 'src/configs/otp.config';
import { MailService } from 'src/modules/mail/services/mail.service';
import { OtpsService } from 'src/modules/otps/services';

import { AuthRepository } from 'src/modules/auth/auth.repository';
import { UserRepository } from 'src/modules/users/users.repository';

import { SendOtpToEmailCommand } from '../implements';

@CommandHandler(SendOtpToEmailCommand)
export class SendOtpToEmailHandler implements ICommandHandler<SendOtpToEmailCommand> {
	constructor(
		private readonly mailService: MailService,
		private readonly otpsService: OtpsService,
		private readonly authRepository: AuthRepository,
		private readonly userRepository: UserRepository,
	) {}

	async execute(
		command: SendOtpToEmailCommand,
	): Promise<HttpResponseBodySuccessDto<string> | HttpException> {
		const user = await this.userRepository.findUserByEmail({ email: command.email });
		if (!user) {
			throw new NotFoundException('email');
		}

		const otp = await this.otpsService.generateOtp({ userId: user.id });

		await this.mailService.sendEmail({
			recipients: [
				{
					address: user.email,
					name: user.name,
				},
			],
			subject: 'Mã xác thực',
			html: `Mã xác thực của bạn là "${otp.otp}". Nó có hiệu lực trong ${OtpsConfig.otpExpiresIn} phút. Vui lòng không chia sẻ mã này với bất kỳ ai.`,
		});

		return {
			success: true,
			data: 'OTP sent successfully',
		};
	}
}
