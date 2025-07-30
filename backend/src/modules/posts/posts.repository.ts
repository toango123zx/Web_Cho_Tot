import { Injectable } from '@nestjs/common';

import { IPaginationQuery } from 'src/common';
import { PostsEntity } from 'src/models';
import { PrismaService } from 'src/modules/database/services';
import { CreatePostDto, UpdatePostDto } from 'src/modules/posts/dtos';

@Injectable()
export class PostsRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findPosts(
		pagination: IPaginationQuery,
		userId?: string,
	): Promise<[PostsEntity[], number]> {
		const filter = {
			deletedAt: null,
			...(userId ? { userId } : {}),
		};

		const [posts, totalRecords] = await Promise.all([
			this.prismaService.posts.findMany({
				where: filter,
				skip: pagination.skip,
				take: pagination.take,
				include: {
					postImages: true,
					category: true,
					user: true,
				},
				orderBy: {
					createdAt: 'asc',
				},
			}),

			this.prismaService.posts.count({
				where: filter,
			}),
		]);

		return [posts, totalRecords];
	}

	async findPostById(postId: string): Promise<PostsEntity> {
		return this.prismaService.posts.findFirst({
			where: { id: postId, deletedAt: null },
			include: {
				postImages: true,
				category: true,
				user: true,
			},
		});
	}

	async createPost(createPostDto: CreatePostDto, userId: string): Promise<PostsEntity> {
		const {
			categoryId,
			postImages,
			title,
			description,
			age,
			size,
			price,
			address,
			status,
		} = createPostDto;

		return this.prismaService.posts.create({
			data: {
				title,
				description,
				age,
				size,
				price,
				address,
				status: status ?? 'PENDING',
				user: {
					connect: { id: userId },
				},
				category: {
					connect: { id: categoryId },
				},
				postImages: postImages?.length
					? {
							create: postImages.map((img) => ({ url: img.url })),
						}
					: undefined,
			},
			include: {
				postImages: true,
				category: true,
				user: true,
			},
		});
	}

	async updatePost(postId: string, updatePostDto: UpdatePostDto): Promise<PostsEntity> {
		const { newPostImages, deletePostImageIds, ...updateData } = updatePostDto;

		return this.prismaService.$transaction(async (tx) => {
			if (deletePostImageIds?.length) {
				await tx.postImages.deleteMany({
					where: {
						id: { in: deletePostImageIds },
						postId,
					},
				});
			}

			if (newPostImages?.length) {
				await tx.postImages.createMany({
					data: newPostImages.map((img) => ({
						...img,
						postId,
					})),
				});
			}

			return tx.posts.update({
				where: { id: postId },
				data: updateData,
				include: { postImages: true, category: true },
			});
		});
	}

	async deletePostById(postId: string): Promise<PostsEntity> {
		return this.prismaService.posts.update({
			where: { id: postId },
			data: { deletedAt: new Date() },
		});
	}

	async findPostImagesById(ids: string[]): Promise<boolean> {
		const images = await this.prismaService.postImages.findMany({
			where: {
				id: { in: ids },
			},
			select: { id: true },
		});

		return images.length === ids.length;
	}
}
