import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, OptionalException } from 'src/common';
import { PostsEntity } from 'src/models';

import { PostsRepository } from 'src/modules/posts/posts.repository';

import { TogglePostArchiveCommand } from '../implements';

@CommandHandler(TogglePostArchiveCommand)
export class TogglePostArchiveHandler
	implements ICommandHandler<TogglePostArchiveCommand>
{
	constructor(private readonly postsRepository: PostsRepository) {}

	async execute(
		command: TogglePostArchiveCommand,
	): Promise<HttpResponseBodySuccessDto<PostsEntity> | HttpException> {
		const { postId, myInformation } = command;

		const post = await this.postsRepository.findPostById(postId, true);
		if (!post) {
			throw new OptionalException(404, 'Post not found');
		}

		const togglePostArchive = await this.postsRepository.togglePostArchive(
			postId,
			myInformation.id,
		);

		if (!togglePostArchive) {
			throw new OptionalException(404, 'Post not found');
		}

		return { success: true, data: togglePostArchive };
	}
}
