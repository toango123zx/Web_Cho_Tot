import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import {
	HttpResponseBodySuccessDto,
	IAccessTokenPayload,
	IRefreshTokenPayload,
	NotFoundException,
} from 'src/common';
import { jwtConfig } from 'src/configs';

import { AuthRepository } from '../../auth.repository';
import { LoginResponseDto } from '../../dtos';
import { RefreshTokenCommand } from '../implements';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	async execute(
		command: RefreshTokenCommand,
	): Promise<HttpResponseBodySuccessDto<LoginResponseDto> | HttpException> {
		const { myInformation, token } = command;
		const tokenDb = await this.authRepository.findTokenByUserId({
			userId: myInformation.id,
			refreshToken: token,
		});
		if (!tokenDb) {
			throw new NotFoundException('token');
		}

		const payloadAccessToken: IAccessTokenPayload = {
			userId: myInformation.id,
			role: myInformation.role,
		};

		const payloadRefreshToken: IRefreshTokenPayload = {
			userId: myInformation.id,
		};

		const accessToken = this.jwtService.sign(payloadAccessToken, {
			expiresIn: jwtConfig.expiresInAccessKey,
			secret: jwtConfig.secretAccessKey,
		});

		const refreshToken = this.jwtService.sign(payloadRefreshToken, {
			expiresIn: jwtConfig.expiresInRefreshKey,
			secret: jwtConfig.secretRefreshKey,
		});

		await this.authRepository.updateRefreshTokenByTokenId({
			tokenId: tokenDb.id,
			tokenInformation: {
				refreshToken: refreshToken,
				user: {
					connect: {
						id: myInformation.id,
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
