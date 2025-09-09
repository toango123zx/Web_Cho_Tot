import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/users/dtos/userInformation.dto';

import { CreateChatRoomRequestDto } from '../../dtos';

export class CreateChatRoomCommand implements ICommand {
	constructor(
		public readonly myInformation: UserInformationDto,
		public readonly createChatRoomRequest: CreateChatRoomRequestDto,
	) {}
}
