import { ICommand } from '@nestjs/cqrs';

export class SendOtpToEmailCommand implements ICommand {
	constructor(public readonly email: string) {}
}
