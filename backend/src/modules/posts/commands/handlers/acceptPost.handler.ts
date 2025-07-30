import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostStatusEnum } from '@prisma/client';
import { HttpResponseBodySuccessDto, OptionalException } from 'src/common';
import { PostsEntity } from 'src/models';

import { PostsRepository } from 'src/modules/posts/posts.repository';

import { AcceptPostCommand } from '../implements';

@CommandHandler(AcceptPostCommand)
export class AcceptPostHandler implements ICommandHandler<AcceptPostCommand> {
	constructor(private readonly postsRepository: PostsRepository) {}

	async execute(
		command: AcceptPostCommand,
	): Promise<HttpResponseBodySuccessDto<PostsEntity> | HttpException> {
		const { postId } = command;

		const post = await this.postsRepository.findPostById(postId);
		if (!post) {
			throw new OptionalException(404, 'Post not found');
		}

		if (post.status !== PostStatusEnum.PENDING) {
			throw new OptionalException(400, 'Post is not in a pending state');
		}

		const updatedPost = await this.postsRepository.updatePost(postId, {
			status: PostStatusEnum.PUBLISHED,
		});

		if (!updatedPost) {
			throw new OptionalException(500, 'Post update failed');
		}

		return { success: true, data: updatedPost };
	}
}
