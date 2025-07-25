import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/users/dtos';

export class DeletePostCommand implements ICommand {
	constructor(
		public readonly postId: string,
		public readonly myInformation: UserInformationDto,
	) {}
}
