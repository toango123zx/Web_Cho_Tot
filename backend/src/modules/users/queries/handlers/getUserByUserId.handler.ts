import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';
import { UsersDto } from 'src/models';

import { UserRepository } from '../../users.repository';
import { GetUserByUserIdQuery } from '../implements';

@QueryHandler(GetUserByUserIdQuery)
export class GetUserByUserIdHandler implements IQueryHandler<GetUserByUserIdQuery> {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		query: GetUserByUserIdQuery,
	): Promise<HttpResponseBodySuccessDto<UsersDto>> {
		const user = await this.userRepository.findUserByUserId(query.userId);

		if (!user) {
			throw new NotFoundException('userId');
		}

		return {
			success: true,
			data: user,
		};
	}
}
