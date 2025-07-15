import { Injectable } from '@nestjs/common';

import { AccountsEntity, CreateAccountsDto } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class AuthRepository {
	constructor(private readonly prismaService: PrismaService) {}

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
}
