import { ICommand } from '@nestjs/cqrs';

import { UpdateUserDto } from 'src/modules/users/dtos';

export class UpdateUserCommand implements ICommand {
	constructor(
		public readonly userId: string,
		public readonly updateUserDto: UpdateUserDto,
	) {}
}
