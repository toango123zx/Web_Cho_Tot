import { Injectable } from '@nestjs/common';

import {
	AccountsEntity,
	CreateAccountsDto,
	CreateTokensDto,
	TokensEntity,
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
}
