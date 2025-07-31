import { HttpException, HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import {
	HttpResponseBodySuccessDto,
	IAccessTokenPayload,
	IRefreshTokenPayload,
	OptionalException,
} from 'src/common';
import { jwtConfig } from 'src/configs';

import { AuthRepository } from '../../auth.repository';
import { LoginResponseDto } from '../../dtos';
import { CheckLoginWithGoogleOauthQuery } from '../implements';

@QueryHandler(CheckLoginWithGoogleOauthQuery)
export class CheckLoginWithGoogleOauthHandler
	implements IQueryHandler<CheckLoginWithGoogleOauthQuery>
{
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	async execute(
		command: CheckLoginWithGoogleOauthQuery,
	): Promise<HttpResponseBodySuccessDto<LoginResponseDto> | HttpException> {
		const { socialAccount } = command;
		if (socialAccount instanceof HttpException) {
			return new OptionalException(HttpStatus.UNAUTHORIZED, socialAccount.message);
		}

		const payloadAccessToken: IAccessTokenPayload = {
			userId: socialAccount.user.id,
			role: socialAccount.user.role,
		};

		const payloadRefreshToken: IRefreshTokenPayload = {
			userId: socialAccount.user.id,
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
						id: socialAccount.user.id,
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
