import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

import {
	IAccessTokenPayload,
	OptionalException,
	UnauthorizedException,
} from 'src/common';
import { jwtConfig } from 'src/configs';
import { UserInformationDto } from 'src/modules/user/dtos';

import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class AuthRefreshTokenGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepository: UserRepository,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		let accessToken: string | undefined;
		let refreshToken: string | undefined;
		let user: UserInformationDto;
		let request;

		switch (context.getType()) {
			case 'http': {
				request = context.switchToHttp().getRequest<Response>();
				accessToken = request.cookies.accessToken;
				refreshToken = request.cookies.refreshToken;
				break;
			}
		}

		if (!accessToken && !refreshToken) {
			throw new UnauthorizedException();
		}

		try {
			const payload: IAccessTokenPayload = this.jwtService.verify(refreshToken, {
				secret: jwtConfig.secretRefreshKey,
			});
			user = new UserInformationDto(
				await this.userRepository.findUserByUserId({
					userId: payload.userId,
				}),
			);

			request.user = user;
			request.refreshToken = refreshToken;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new OptionalException(HttpStatus.UNAUTHORIZED, error.message);
			}
			if (error instanceof JsonWebTokenError) {
				throw new UnauthorizedException(error.message);
			}
			throw error;
		}

		return true;
	}
}
