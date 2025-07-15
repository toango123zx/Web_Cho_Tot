import { Injectable } from '@nestjs/common';

import { UsersEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class UserRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findUserByEmail({ email }: { email: string }): Promise<UsersEntity | null> {
		return this.prismaService.users.findFirst({
			where: {
				email: email,
			},
		});
	}
}
