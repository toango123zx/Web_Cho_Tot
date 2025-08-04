import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IAccessTokenPayload } from 'src/common';
import { jwtConfig } from 'src/configs';
import { UserInformationDto } from 'src/modules/users/dtos';

import { UserRepository } from 'src/modules/users/users.repository';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private userRepository: UserRepository,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const token = request.cookies?.accessToken;

		if (token) {
			try {
				const payload: IAccessTokenPayload = this.jwtService.verify(token, {
					secret: jwtConfig.secretAccessKey,
				});

				const user = await this.userRepository.findUserByUserId(payload.userId);
				request.user = new UserInformationDto(user);
			} catch {
				request.user = null;
			}
		} else {
			request.user = null;
		}

		return true;
	}
}
