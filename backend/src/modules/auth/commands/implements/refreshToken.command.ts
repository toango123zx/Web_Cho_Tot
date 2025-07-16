import { ICommand } from '@nestjs/cqrs';

import { UserInformationDto } from 'src/modules/users/dtos';

export class RefreshTokenCommand implements ICommand {
	constructor(
		public readonly myInformation: UserInformationDto,
		public readonly token: string,
	) {}
}
