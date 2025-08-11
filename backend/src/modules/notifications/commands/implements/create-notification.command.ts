import { ICommand } from '@nestjs/cqrs';

export class CreateNotificationCommand implements ICommand {
	constructor(
		public readonly userId: string,
		public readonly content: string,
		public readonly url?: string,
	) {}
}
