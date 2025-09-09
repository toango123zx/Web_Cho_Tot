import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserInformationDto } from 'src/modules/users/dtos';

export class GetChatRoomsByUserIdQuery implements IQuery {
	constructor(
		public readonly myInformation: UserInformationDto,
		public readonly pagination: PaginationDto,
	) {}
}
