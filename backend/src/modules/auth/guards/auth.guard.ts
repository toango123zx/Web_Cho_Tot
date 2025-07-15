import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core/services/reflector.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

import { RoleUserEnum } from '@prisma/client';
import {
	ForbiddenException,
	IAccessTokenPayload,
	ROLE_KEY,
	UnauthorizedException,
} from 'src/common';
import { jwtConfig } from 'src/configs';
import { UserInformationDto } from 'src/modules/user/dtos';

import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly jwtService: JwtService,
		private readonly userRepository: UserRepository,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		let accessToken: string | undefined;
		let user: UserInformationDto;
		let request;

		switch (context.getType()) {
			case 'http': {
				request = context.switchToHttp().getRequest<Response>();
				accessToken = request.cookies.accessToken;
				break;
			}
		}

		if (!accessToken) {
			throw new UnauthorizedException();
		}

		try {
			const payload: IAccessTokenPayload = this.jwtService.verify(accessToken, {
				secret: jwtConfig.secretAccessKey,
			});
			user = new UserInformationDto(
				await this.userRepository.findUserByUserId({
					userId: payload.userId,
				}),
			);

			const requiredRole: string = this.reflector.getAllAndOverride<RoleUserEnum>(
				ROLE_KEY,
				[context.getHandler(), context.getClass()],
			);

			if (requiredRole && (!user.role || requiredRole !== user.role)) {
				throw new ForbiddenException();
			}
			request.user = user;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new UnauthorizedException(error.message);
			}
			throw error;
		}

		return true;
	}
}
