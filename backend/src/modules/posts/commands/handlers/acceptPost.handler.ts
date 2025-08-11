import { HttpException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostStatusEnum } from '@prisma/client';
import { HttpResponseBodySuccessDto, OptionalException } from 'src/common';
import { PostsEntity } from 'src/models';
import { CreateNotificationCommand } from 'src/modules/notifications/commands/implements';

import { PostsRepository } from 'src/modules/posts/posts.repository';

import { AcceptPostCommand } from '../implements';

@CommandHandler(AcceptPostCommand)
export class AcceptPostHandler implements ICommandHandler<AcceptPostCommand> {
	constructor(
		private readonly postsRepository: PostsRepository,
		private readonly commandBus: CommandBus,
	) {}

	async execute(
		command: AcceptPostCommand,
	): Promise<HttpResponseBodySuccessDto<PostsEntity> | HttpException> {
		const { postId } = command;

		const post = await this.postsRepository.findPostById(postId, true);
		if (!post) {
			throw new OptionalException(404, 'Post not found');
		}

		if (post.status !== PostStatusEnum.PENDING) {
			throw new OptionalException(400, 'Post is not in a pending state');
		}

		const updatedPost = await this.postsRepository.acceptPost(postId);

		if (!updatedPost) {
			throw new OptionalException(500, 'Post update failed');
		}

		await this.commandBus.execute(
			new CreateNotificationCommand(
				post.userId,
				`Bài viết "${post.title}" của bạn đã được duyệt.`,
				`/posts/${post.id}`,
			),
		);

		return { success: true, data: updatedPost };
	}
}
