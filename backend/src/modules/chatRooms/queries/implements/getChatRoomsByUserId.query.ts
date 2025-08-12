import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserInformationDto } from 'src/modules/users/dtos';

import { ChatRoomsFilterDto } from '../../dtos';

export class GetChatRoomsByUserIdQuery implements IQuery {
	constructor(
		public readonly myInformation: UserInformationDto,
		public readonly pagination: PaginationDto,
		public readonly filter?: ChatRoomsFilterDto,
	) {}
}
