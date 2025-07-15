import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, NotFoundException } from 'src/common';
import { UsersDto } from 'src/models';

import { UserRepository } from '../../users.repository';
import { DeleteUserByUserIdQuery } from '../implements';

@QueryHandler(DeleteUserByUserIdQuery)
export class DeleteUserByUserIdHandler implements IQueryHandler<DeleteUserByUserIdQuery> {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		query: DeleteUserByUserIdQuery,
	): Promise<HttpResponseBodySuccessDto<UsersDto>> {
		const user = await this.userRepository.findUserByUserId(query.userId);

		if (!user) {
			throw new NotFoundException('userId');
		}

		const response = await this.userRepository.deleteUserByUserId(query.userId);

		if (!response) {
			throw new NotFoundException('userId');
		}

		return {
			success: true,
			data: user,
		};
	}
}
