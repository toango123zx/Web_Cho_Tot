import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
} from 'src/common';
import { PostsEntity } from 'src/models';

import { PostsRepository } from 'src/modules/posts/posts.repository';

import { DeletePostCommand } from '../implements';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
	constructor(private readonly postsRepository: PostsRepository) {}

	async execute(
		command: DeletePostCommand,
	): Promise<HttpResponseBodySuccessDto<PostsEntity> | HttpException> {
		const { postId, myInformation } = command;

		const post = await this.postsRepository.findPostById(postId);
		if (!post) {
			throw new NotFoundException('postId');
		}

		if (post.userId !== myInformation.id) {
			throw new OptionalException(
				403,
				'You do not have permission to delete this post',
			);
		}

		const deletedPost = await this.postsRepository.deletePostById(postId);

		if (!deletedPost) {
			throw new OptionalException(400, 'Post deletion failed');
		}

		return { success: true, data: deletedPost };
	}
}
