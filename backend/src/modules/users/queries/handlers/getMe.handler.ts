import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto } from 'src/common';
import { UserInformationDto } from 'src/modules/users/dtos';
import { GetMeQuery } from 'src/modules/users/queries/implements';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
	async execute(
		query: GetMeQuery,
	): Promise<HttpResponseBodySuccessDto<UserInformationDto>> {
		return {
			success: true,
			data: query.user,
		};
	}
}
