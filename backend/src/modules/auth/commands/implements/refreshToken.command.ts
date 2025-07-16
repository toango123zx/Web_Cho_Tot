import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/user/dtos';

export class RefreshTokenCommand implements ICommand {
	constructor(
		public readonly myInformation: UserInformationDto,
		public readonly token: string,
	) {}
}
