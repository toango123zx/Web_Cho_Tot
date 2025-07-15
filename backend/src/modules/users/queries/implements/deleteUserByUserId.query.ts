import { IQuery } from '@nestjs/cqrs';

export class DeleteUserByUserIdQuery implements IQuery {
	constructor(public readonly userId: string) {
		this.userId = userId.trim();
	}
}
