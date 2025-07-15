import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto } from 'src/common';
import { UsersDto } from 'src/models';
import { GetMeQuery } from 'src/modules/users/queries/implements';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
	async execute(query: GetMeQuery): Promise<HttpResponseBodySuccessDto<UsersDto>> {
		return {
			success: true,
			data: query.user,
		};
	}
}
