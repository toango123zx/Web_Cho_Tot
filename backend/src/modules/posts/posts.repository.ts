import { Injectable } from '@nestjs/common';

import { AgePostEnum, PostStatusEnum, SizePostEnum } from '@prisma/client';
import { PostsEntity } from 'src/models';
import { PrismaService } from 'src/modules/database/services';
import { CreatePostDto, PostsDto, UpdatePostDto } from 'src/modules/posts/dtos';

type PostFilter = {
	skip: number;
	take: number;
	status?: Exclude<PostStatusEnum, 'DELETED'>;
	search?: string;
	categoryId?: string;
	age?: string;
	size?: string;
	minPrice?: number;
	maxPrice?: number;
	address?: string;
	district?: string;
	province?: string;
	sortBy?: string;
	sortOrder?: string;
};

type PostResult<T extends boolean> = T extends true ? PostsDto : PostsEntity;

@Injectable()
export class PostsRepository {
	constructor(private readonly prismaService: PrismaService) {}

	private buildAddressFilter(filterPost: PostFilter): object {
		const addressConditions = [];

		// If specific address search is provided
		if (filterPost.address) {
			addressConditions.push({
				address: {
					contains: filterPost.address,
					mode: 'insensitive' as const,
				},
			});
		}

		// If district is specified, search for it in the address
		if (filterPost.district) {
			addressConditions.push({
				address: {
					contains: filterPost.district,
					mode: 'insensitive' as const,
				},
			});
		}

		// If province is specified, search for it in the address
		if (filterPost.province) {
			addressConditions.push({
				address: {
					contains: filterPost.province,
					mode: 'insensitive' as const,
				},
			});
		}

		// Return the appropriate filter condition
		if (addressConditions.length === 0) {
			return {};
		} else if (addressConditions.length === 1) {
			return addressConditions[0];
		} else {
			// Multiple address conditions - all must match (AND logic)
			return {
				AND: addressConditions,
			};
		}
	}

	async findPosts(
		filterPost: PostFilter,
		userId?: string,
	): Promise<[PostsDto[], number]> {
		const filter = {
			deletedAt: null,
			...(userId ? { userId } : {}),
			...(filterPost.status ? { status: filterPost.status } : {}),
			...(filterPost.categoryId ? { categoryId: filterPost.categoryId } : {}),
			...(filterPost.age ? { age: filterPost.age as AgePostEnum } : {}),
			...(filterPost.size ? { size: filterPost.size as SizePostEnum } : {}),
			...this.buildAddressFilter(filterPost),
			...(filterPost.minPrice !== undefined || filterPost.maxPrice !== undefined
				? {
						price: {
							...(filterPost.minPrice !== undefined
								? { gte: filterPost.minPrice }
								: {}),
							...(filterPost.maxPrice !== undefined
								? { lte: filterPost.maxPrice }
								: {}),
						},
					}
				: {}),
			...(filterPost.search
				? {
						OR: [
							{
								title: {
									contains: filterPost.search,
									mode: 'insensitive' as const,
								},
							},
							{
								description: {
									contains: filterPost.search,
									mode: 'insensitive' as const,
								},
							},
						],
					}
				: {}),
		};

		// Determine sort order
		const sortBy = filterPost.sortBy || 'createdAt';
		const sortOrder = filterPost.sortOrder || 'asc';
		const orderBy = {
			[sortBy]: sortOrder,
		};

		const [posts, totalRecords] = await Promise.all([
			this.prismaService.posts.findMany({
				where: filter,
				skip: filterPost.skip,
				take: filterPost.take,
				include: {
					postImages: true,
					category: true,
					postArchives: true,
					user: {
						select: {
							id: true,
							name: true,
							avatar: true,
						},
					},
				},
				orderBy,
			}),

			this.prismaService.posts.count({
				where: filter,
			}),
		]);

		return [posts, totalRecords];
	}

	async findPostById<T extends boolean>(
		postId: string,
		includeUser: T,
	): Promise<PostResult<T>> {
		return this.prismaService.posts.findFirst({
			where: { id: postId, deletedAt: null },
			include: {
				postImages: true,
				category: true,
				...(includeUser && {
					user: {
						select: {
							id: true,
							name: true,
							avatar: true,
							phoneNumber: true,
						},
					},
				}),
			},
		});
	}

	async createPost(createPostDto: CreatePostDto, userId: string): Promise<PostsEntity> {
		const { categoryId, postImages, title, description, age, size, price, address } =
			createPostDto;

		return this.prismaService.posts.create({
			data: {
				title,
				description,
				age,
				size,
				price,
				address,
				status: PostStatusEnum.PENDING,
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
			},
		});
	}

	async acceptPost(postId: string): Promise<PostsEntity> {
		return this.prismaService.posts.update({
			where: { id: postId },
			data: { status: PostStatusEnum.PUBLISHED },
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
			data: { deletedAt: new Date(), status: PostStatusEnum.DELETED },
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

	async togglePostArchive(postId: string, userId: string): Promise<PostsEntity> {
		return this.prismaService.$transaction(async (tx) => {
			const existingPostArchive = await tx.postArchives.findFirst({
				where: { postId, userId },
			});

			if (existingPostArchive) {
				await tx.postArchives.delete({
					where: { id: existingPostArchive.id },
				});
			} else {
				await tx.postArchives.create({
					data: { postId, userId },
				});
			}

			return tx.posts.findUnique({
				where: { id: postId },
				include: { postImages: true, category: true, postArchives: true },
			});
		});
	}

	async findAllArchivedPostsByUser(
		filterPost: PostFilter,
		userId: string,
	): Promise<[PostsDto[], number]> {
		const filter = {
			postArchives: {
				some: { userId },
			},
			deletedAt: null,
			...(filterPost.status ? { status: filterPost.status } : {}),
			...(filterPost.categoryId ? { categoryId: filterPost.categoryId } : {}),
			...(filterPost.age ? { age: filterPost.age as AgePostEnum } : {}),
			...(filterPost.size ? { size: filterPost.size as SizePostEnum } : {}),
			...this.buildAddressFilter(filterPost),
			...(filterPost.minPrice !== undefined || filterPost.maxPrice !== undefined
				? {
						price: {
							...(filterPost.minPrice !== undefined
								? { gte: filterPost.minPrice }
								: {}),
							...(filterPost.maxPrice !== undefined
								? { lte: filterPost.maxPrice }
								: {}),
						},
					}
				: {}),
			...(filterPost.search
				? {
						OR: [
							{
								title: {
									contains: filterPost.search,
									mode: 'insensitive' as const,
								},
							},
							{
								description: {
									contains: filterPost.search,
									mode: 'insensitive' as const,
								},
							},
						],
					}
				: {}),
		};

		// Determine sort order
		const sortBy = filterPost.sortBy || 'createdAt';
		const sortOrder = filterPost.sortOrder || 'asc';
		const orderBy = {
			[sortBy]: sortOrder,
		};

		const [postsArchive, totalRecords] = await Promise.all([
			this.prismaService.posts.findMany({
				where: filter,
				skip: filterPost.skip,
				take: filterPost.take,
				include: {
					postImages: true,
					category: true,
					user: {
						select: {
							id: true,
							name: true,
							avatar: true,
						},
					},
				},
				orderBy,
			}),

			this.prismaService.posts.count({
				where: filter,
			}),
		]);

		return [postsArchive, totalRecords];
	}
}
