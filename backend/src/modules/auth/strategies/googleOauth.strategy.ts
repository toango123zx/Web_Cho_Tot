import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, Profile } from 'passport-google-oauth20';
import { GoogleOauthConfig } from 'src/configs';
import { CreateSocialAccountsDto, SocialAccountsEntity } from 'src/models';

import { UserRepository } from 'src/modules/users/users.repository';

import { AuthRepository } from '../auth.repository';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly userRepository: UserRepository,
	) {
		super({
			clientID: GoogleOauthConfig.clientId,
			clientSecret: GoogleOauthConfig.clientSecret,
			callbackURL: GoogleOauthConfig.redirectUri,
			scope: ['email', 'profile'],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
	): Promise<SocialAccountsEntity> {
		const userExist = await this.userRepository.findUserByEmail({
			email: profile.emails[0].value,
		});

		if (!userExist) {
			const socialAccount: CreateSocialAccountsDto = {
				googleId: profile.id,
				user: {
					create: {
						email: profile.emails[0].value,
						name: profile.displayName,
						avatar: profile.photos[0].value,
					},
				},
			};

			const socialAccountCreated = await this.authRepository.createSocialAccount({
				socialAccount: socialAccount,
			});
			return socialAccountCreated;
		}

		const socialAccountExist = await this.authRepository.findSocialAccount({
			googleId: profile.id,
			userId: userExist.id,
		});

		if (socialAccountExist) {
			return socialAccountExist;
		}
		const socialAccount: CreateSocialAccountsDto = {
			googleId: profile.id,
			user: {
				connect: {
					id: userExist.id,
				},
			},
		};
		const socialAccountCreated = await this.authRepository.createSocialAccount({
			socialAccount: socialAccount,
		});

		return socialAccountCreated;
	}
}
