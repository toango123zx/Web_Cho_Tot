import { ICommand } from '@nestjs/cqrs';

export class AcceptPostCommand implements ICommand {
	constructor(public readonly postId: string) {}
}
