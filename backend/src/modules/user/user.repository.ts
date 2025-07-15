import { Injectable } from '@nestjs/common';

import { UsersEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class UserRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findUserByEmail({
		email,
		name,
		phoneNumber,
	}: {
		email: string;
		name?: string;
		phoneNumber?: string;
	}): Promise<UsersEntity | null> {
		return this.prismaService.users.findFirst({
			where: {
				OR: [{ email: email }, { name: name }, { phoneNumber: phoneNumber }],
			},
		});
	}

	async findUserByUserId({ userId }: { userId: string }): Promise<UsersEntity | null> {
		return this.prismaService.users.findFirst({
			where: {
				id: userId,
			},
		});
	}
}
