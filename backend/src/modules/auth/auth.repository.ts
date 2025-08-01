import { Injectable } from '@nestjs/common';

import {
	AccountsEntity,
	CreateAccountsDto,
	CreateSocialAccountsDto,
	CreateTokensDto,
	SocialAccountsEntity,
	TokensEntity,
	UpdateTokensDto,
} from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class AuthRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findAccountByEmail({
		email,
	}: {
		email: string;
	}): Promise<AccountsEntity | null> {
		return this.prismaService.accounts.findFirst({
			include: {
				user: true,
			},
			where: {
				user: {
					email: email,
				},
			},
		});
	}

	async findTokenByUserId({
		userId,
		refreshToken,
	}: {
		userId?: string;
		refreshToken: string;
	}): Promise<TokensEntity | null> {
		return this.prismaService.tokens.findFirst({
			where: {
				user: {
					id: userId,
				},
				refreshToken: refreshToken,
			},
		});
	}

	async findSocialAccount({
		googleId,
		userId,
		email,
		phoneNumber,
	}: {
		googleId?: string;
		userId?: string;
		email?: string;
		phoneNumber?: string;
	}): Promise<SocialAccountsEntity | null> {
		return this.prismaService.socialAccounts.findFirst({
			include: {
				user: true,
			},
			where: {
				googleId: googleId,
				user: {
					id: userId,
					email: email,
					phoneNumber: phoneNumber,
				},
			},
		});
	}

	async createAccount({
		account,
	}: {
		account: CreateAccountsDto;
	}): Promise<AccountsEntity> {
		return this.prismaService.accounts.create({
			include: {
				user: true,
			},
			data: account,
		});
	}

	async createSocialAccount({
		socialAccount,
	}: {
		socialAccount: CreateSocialAccountsDto;
	}): Promise<SocialAccountsEntity> {
		return this.prismaService.socialAccounts.create({
			include: {
				user: true,
			},
			data: {
				googleId: socialAccount.googleId,
				user: {
					connect: socialAccount.user.connect
						? {
								id: socialAccount.user.connect.id,
							}
						: undefined,
					create: socialAccount.user.create
						? {
								...socialAccount.user.create,
							}
						: undefined,
				},
			},
		});
	}

	async createRefreshToken({
		token,
	}: {
		token: CreateTokensDto;
	}): Promise<TokensEntity> {
		return this.prismaService.tokens.create({
			data: {
				...token,
				user: {
					connect: {
						id: token.user.connect.id,
					},
				},
			},
		});
	}

	async updateRefreshTokenByTokenId({
		tokenId,
		tokenInformation,
	}: {
		tokenId: string;
		tokenInformation: UpdateTokensDto;
	}): Promise<TokensEntity> {
		return this.prismaService.tokens.update({
			where: {
				id: tokenId,
				userId: tokenInformation.user.connect.id,
			},
			data: {
				refreshToken: tokenInformation.refreshToken,
			},
		});
	}
}
