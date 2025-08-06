import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, OptionalException } from 'src/common';
import { PostsEntity } from 'src/models';

import { CategoriesRepository } from 'src/modules/categories/categories.repository';
import { PostsRepository } from 'src/modules/posts/posts.repository';

import { UpdatePostCommand } from '../implements';

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
	constructor(
		private readonly postsRepository: PostsRepository,
		private readonly categoriesRepository: CategoriesRepository,
	) {}

	async execute(
		command: UpdatePostCommand,
	): Promise<HttpResponseBodySuccessDto<PostsEntity> | HttpException> {
		const { updatePostDto, postId, myInformation } = command;

		const post = await this.postsRepository.findPostById(postId, false);
		if (!post) {
			throw new OptionalException(404, 'Post not found');
		}

		if (post.userId !== myInformation.id) {
			throw new OptionalException(
				403,
				'You do not have permission to update this post',
			);
		}

		if (updatePostDto.categoryId) {
			const category = await this.categoriesRepository.findCategoryById(
				updatePostDto.categoryId,
			);
			if (!category) {
				throw new OptionalException(404, 'Category not found');
			}
		}

		if (updatePostDto.deletePostImageIds) {
			const checkIds = await this.postsRepository.findPostImagesById(
				updatePostDto.deletePostImageIds,
			);

			if (!checkIds) {
				throw new OptionalException(404, 'Some post images not found');
			}
		}

		const updatedPost = await this.postsRepository.updatePost(postId, updatePostDto);

		if (!updatedPost) {
			throw new OptionalException(400, 'Post update failed');
		}

		return { success: true, data: updatedPost };
	}
}
