import { Injectable } from '@nestjs/common';

import { IPaginationQuery } from 'src/common';
import { UsersEntity } from 'src/models';
import { PrismaService } from 'src/modules/database/services';

@Injectable()
export class UserRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findUsers(pagination: IPaginationQuery): Promise<[UsersEntity[], number]> {
		const [users, totalRecords] = await Promise.all([
			this.prismaService.users.findMany({
				where: {
					deletedAt: null,
				},
				skip: pagination.skip,
				take: pagination.take,
			}),
			this.prismaService.users.count(),
		]);
		return [users, totalRecords];
	}

	async findUserByUserId(userId: string): Promise<UsersEntity> {
		return this.prismaService.users.findFirst({
			where: {
				id: userId,
				deletedAt: null,
			},
		});
	}

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

	async deleteUserByUserId(userId: string): Promise<UsersEntity> {
		return this.prismaService.users.update({
			where: {
				id: userId,
			},
			data: {
				deletedAt: new Date(),
			},
		});
	}
}
