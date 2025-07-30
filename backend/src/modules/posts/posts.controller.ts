import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { RoleUserEnum } from '@prisma/client';
import { HttpResponseBodyDto, PaginationDto } from 'src/common';
import { PostsDto } from 'src/models';
import { Auth, AuthRole } from 'src/modules/auth/decorators';
import {
	AcceptPostCommand,
	CreatePostCommand,
	DeletePostCommand,
	UpdatePostCommand,
} from 'src/modules/posts/commands/implements';
import { CreatePostDto, UpdatePostDto } from 'src/modules/posts/dtos';
import {
	GetPostQuery,
	GetPostsByUserQuery,
	GetPostsQuery,
} from 'src/modules/posts/queries/implements';
import { MyInformation } from 'src/modules/users/decorators';
import { UserInformationDto } from 'src/modules/users/dtos';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	async getPosts(
		@Query() pagination: PaginationDto,
	): Promise<HttpResponseBodyDto<PostsDto[] | HttpException>> {
		return this.queryBus.execute(new GetPostsQuery(pagination));
	}

	@Get('/:postId')
	async findPostById(
		@Param('postId') postId: string,
	): Promise<HttpResponseBodyDto<PostsDto | HttpException>> {
		return this.queryBus.execute(new GetPostQuery(postId));
	}

	@Auth()
	@Post()
	async createPost(
		@MyInformation() userInformation: UserInformationDto,
		@Body() createPostDto: CreatePostDto,
	): Promise<HttpResponseBodyDto<PostsDto | HttpException>> {
		return this.commandBus.execute(
			new CreatePostCommand(createPostDto, userInformation),
		);
	}

	@Auth()
	@Patch('/:postId')
	async updatePost(
		@MyInformation() userInformation: UserInformationDto,
		@Param('postId') postId: string,
		@Body() updatePostDto: UpdatePostDto,
	): Promise<HttpResponseBodyDto<PostsDto | HttpException>> {
		return this.commandBus.execute(
			new UpdatePostCommand(postId, updatePostDto, userInformation),
		);
	}

	@Auth()
	@Delete('/:postId')
	async deletePost(
		@MyInformation() userInformation: UserInformationDto,
		@Param('postId') postId: string,
	): Promise<HttpResponseBodyDto<PostsDto | HttpException>> {
		return this.commandBus.execute(new DeletePostCommand(postId, userInformation));
	}

	@AuthRole(RoleUserEnum.ADMIN)
	@Patch('/:postId/accept')
	async acceptPost(
		@Param('postId') postId: string,
	): Promise<HttpResponseBodyDto<PostsDto | HttpException>> {
		return this.commandBus.execute(new AcceptPostCommand(postId));
	}

	@Get('/user/:userId')
	async getPostsByUser(
		@Query() pagination: PaginationDto,
		@Param('userId') userId: string,
	): Promise<HttpResponseBodyDto<PostsDto[] | HttpException>> {
		return this.queryBus.execute(new GetPostsByUserQuery(pagination, userId));
	}
}
