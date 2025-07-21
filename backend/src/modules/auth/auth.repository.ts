import { Injectable } from '@nestjs/common';

import {
	AccountsEntity,
	CreateAccountsDto,
	CreateTokensDto,
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
