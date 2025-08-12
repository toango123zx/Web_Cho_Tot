import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, OptionalException } from 'src/common';
import { PostsEntity } from 'src/models';

import { CategoriesRepository } from 'src/modules/categories/categories.repository';
import { PostsRepository } from 'src/modules/posts/posts.repository';

import { CreatePostCommand } from '../implements';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
	constructor(
		private readonly postsRepository: PostsRepository,
		private readonly categoriesRepository: CategoriesRepository,
	) {}

	async execute(
		command: CreatePostCommand,
	): Promise<HttpResponseBodySuccessDto<PostsEntity> | HttpException> {
		const { createPostDto, myInformation } = command;

		const category = await this.categoriesRepository.findCategoryById(
			createPostDto.categoryId,
		);
		if (!category) {
			throw new OptionalException(404, 'Category not found');
		}

		const createdPost = await this.postsRepository.createPost(
			createPostDto,
			myInformation.id,
		);

		if (!createdPost) {
			throw new OptionalException(500, 'Post creation failed');
		}

		return { success: true, data: createdPost };
	}
}
