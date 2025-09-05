import { ICommand } from '@nestjs/cqrs';

import { ForgotPasswordRequestDto } from '../../dtos';

export class ForgotPasswordCommand implements ICommand {
	constructor(public readonly forgotPassword: ForgotPasswordRequestDto) {}
}
