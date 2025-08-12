import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { hash } from 'bcrypt';
import {
	HttpResponseBodySuccessDto,
	IAccessTokenPayload,
	IRefreshTokenPayload,
	NotFoundException,
	UnauthorizedException,
} from 'src/common';
import { jwtConfig } from 'src/configs';

import { AuthRepository } from '../../auth.repository';
import { LoginResponseDto } from '../../dtos';
import { LoginCommand } from '../implements';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	async execute(
		command: LoginCommand,
	): Promise<HttpResponseBodySuccessDto<LoginResponseDto> | HttpException> {
		const { loginDto } = command;
		const account = await this.authRepository.findAccountByEmail({
			email: loginDto.email,
		});
		if (!account) {
			throw new NotFoundException('user');
		}

		const hashedPassword = await hash(loginDto.password, account.salt);

		if (hashedPassword !== account.password) {
			throw new UnauthorizedException();
		}

		const payloadAccessToken: IAccessTokenPayload = {
			userId: account.userId,
			role: account.user.role,
		};

		const payloadRefreshToken: IRefreshTokenPayload = {
			userId: account.userId,
		};

		const accessToken = this.jwtService.sign(payloadAccessToken, {
			expiresIn: jwtConfig.expiresInAccessKey,
			secret: jwtConfig.secretAccessKey,
		});

		const refreshToken = this.jwtService.sign(payloadRefreshToken, {
			expiresIn: jwtConfig.expiresInRefreshKey,
			secret: jwtConfig.secretRefreshKey,
		});

		await this.authRepository.createRefreshToken({
			token: {
				refreshToken: refreshToken,
				user: {
					connect: {
						id: account.userId,
					},
				},
			},
		});

		return {
			success: true,
			data: { accessToken: accessToken },
			cookie: { accessToken: accessToken, refreshToken: refreshToken },
		};
	}
}
