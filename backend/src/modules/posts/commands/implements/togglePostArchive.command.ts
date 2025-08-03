import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/users/dtos';

export class TogglePostArchiveCommand implements ICommand {
	constructor(
		public readonly postId: string,
		public readonly myInformation: UserInformationDto,
	) {}
}
