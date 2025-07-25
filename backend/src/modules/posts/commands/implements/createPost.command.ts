import { ICommand } from '@nestjs/cqrs';

import { CreatePostDto } from 'src/modules/posts/dtos';
import { UserInformationDto } from 'src/modules/users/dtos';

export class CreatePostCommand implements ICommand {
	constructor(
		public readonly createPostDto: CreatePostDto,
		public readonly myInformation: UserInformationDto,
	) {}
}
