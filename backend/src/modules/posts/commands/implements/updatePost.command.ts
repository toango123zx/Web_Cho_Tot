import { ICommand } from '@nestjs/cqrs';

import { UpdatePostDto } from 'src/modules/posts/dtos';
import { UserInformationDto } from 'src/modules/users/dtos';

export class UpdatePostCommand implements ICommand {
	constructor(
		public readonly postId: string,
		public readonly updatePostDto: UpdatePostDto,
		public readonly myInformation: UserInformationDto,
	) {}
}
