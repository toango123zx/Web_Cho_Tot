import { ICommand } from '@nestjs/cqrs';

import { CreateUserDto } from 'src/modules/users/dtos';

export class CreateUserCommand implements ICommand {
	constructor(public readonly createUserDto: CreateUserDto) {}
}
