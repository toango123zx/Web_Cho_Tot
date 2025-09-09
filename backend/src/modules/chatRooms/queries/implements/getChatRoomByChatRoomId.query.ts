import { IQuery } from '@nestjs/cqrs';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserInformationDto } from 'src/modules/users/dtos';

export class GetChatRoomByChatRoomIdQuery implements IQuery {
	constructor(
		public readonly chatRoomId: string,
		public readonly pagination: PaginationDto,
		public readonly myInformation: UserInformationDto,
	) {}
}
