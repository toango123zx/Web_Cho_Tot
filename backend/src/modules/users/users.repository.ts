import { Injectable } from '@nestjs/common';

import { IPaginationQuery } from 'src/common';
import { AccountsEntity, UsersEntity } from 'src/models';
import { PrismaService } from 'src/modules/database/services';
import { UpdateUserDto } from 'src/modules/users/dtos';

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

	async checkUserExistsByNameOrPhoneNumber({
		phoneNumber,
		name,
		userId,
	}: {
		phoneNumber?: string;
		name?: string;
		userId?: string;
	}): Promise<boolean> {
		const user = await this.prismaService.users.findFirst({
			where: {
				NOT: { id: userId },
				OR: [{ phoneNumber: phoneNumber }, { name: name }],
			},
		});
		return !!user;
	}

	async updateAccountByUserId({
		userId,
		updateUserDto,
	}: {
		userId: string;
		updateUserDto: UpdateUserDto;
	}): Promise<AccountsEntity> {
		return this.prismaService.accounts.update({
			where: {
				userId,
			},
			data: {
				user: {
					update: {
						...(updateUserDto.name && { name: updateUserDto.name }),
						...(updateUserDto.phoneNumber && {
							phoneNumber: updateUserDto.phoneNumber,
						}),
						...(updateUserDto.address && { address: updateUserDto.address }),
						...(updateUserDto.gender && { gender: updateUserDto.gender }),
						...(updateUserDto.dateOfBirth && {
							dob: updateUserDto.dateOfBirth,
						}),
						...(updateUserDto.bio && { bio: updateUserDto.bio }),
						...(updateUserDto.avatar && { avatar: updateUserDto.avatar }),
					},
				},
			},
		});
	}
}
