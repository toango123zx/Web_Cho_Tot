import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto } from 'src/common';

import { AuthRepository } from '../../auth.repository';
import { LogoutCommand } from '../implements';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
	constructor(private readonly authRepository: AuthRepository) {}

	async execute(
		command: LogoutCommand,
	): Promise<HttpResponseBodySuccessDto<string> | HttpException> {
		const { myInformation, token } = command;

		await this.authRepository.deleteRefreshToken({
			refreshToken: token,
			userId: myInformation.id,
		});

		return {
			success: true,
			data: 'Đăng xuất thành công',
			cookie: { accessToken: undefined, refreshToken: undefined },
		};
	}
}
