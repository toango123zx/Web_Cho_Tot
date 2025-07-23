import { ICommand } from '@nestjs/cqrs';
import { ChangePasswordDto, UserInformationDto } from 'src/modules/users/dtos';

export class ChangePasswordCommand implements ICommand {
	constructor(
		public readonly changePasswordDto: ChangePasswordDto,
		public readonly userInformation: UserInformationDto,
	) {}
}
