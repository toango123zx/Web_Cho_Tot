import { Injectable } from '@nestjs/common';

import { IPaginationQuery } from 'src/common/interfaces/paginationQuery.interface';
import { ChatRoomsEntity, CreateChatRoomsDto } from 'src/models';
import { PrismaService } from 'src/modules/database/services';

import { ChatRoomOrderByDto } from './dtos';

@Injectable()
export class ChatRoomsRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findChatRoom({
		chatRoomId,
		userId,
	}: {
		chatRoomId: string;
		userId?: string;
	}): Promise<ChatRoomsEntity | null> {
		return await this.prismaService.chatRooms.findFirst({
			include: {
				firstUser: true,
				secondUser: true,
				messages: {
					take: 1,
					skip: 0,
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
			where: {
				id: chatRoomId,
				OR: [
					{
						firstUserId: userId,
					},
					{
						secondUserId: userId,
					},
				],
			},
		});
	}

	async findChatRooms({
		chatRoomIds,
		chatRoomMember = [],
		userName,
		pagination = {} as IPaginationQuery,
		filter,
	}: {
		chatRoomIds?: string[];
		chatRoomMember?: string[];
		userName?: string;
		pagination?: IPaginationQuery;
		filter?: ChatRoomOrderByDto;
	}): Promise<[ChatRoomsEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));

		const [chatRooms, totalRecords] = await Promise.all([
			this.prismaService.chatRooms.findMany({
				include: {
					firstUser: true,
					secondUser: true,
					messages: {
						take: 1,
						skip: 0,
						orderBy: {
							createdAt: 'desc',
						},
					},
				},
				where: {
					id: {
						in: chatRoomIds,
					},
					OR: [
						{
							firstUserId: {
								in: chatRoomMember,
							},
							secondUserId: {
								in: chatRoomMember,
							},
						},
						{
							OR:
								chatRoomMember[0] === chatRoomMember[1]
									? [
											{
												firstUserId: chatRoomMember[0],
												secondUser: {
													name: userName,
												},
											},
											{
												secondUserId: chatRoomMember[0],
												firstUser: {
													name: userName,
												},
											},
										]
									: undefined,
						},
					],
				},
				skip: pagination.skip,
				take: pagination.take,
				orderBy: orderBy,
			}),
			this.prismaService.chatRooms.count({
				where: {
					id: {
						in: chatRoomIds,
					},
					OR: [
						{
							firstUserId: {
								in: chatRoomMember,
							},
							secondUserId: {
								in: chatRoomMember,
							},
						},
						{
							OR:
								chatRoomMember[0] === chatRoomMember[1]
									? [
											{
												firstUserId: chatRoomMember[0],
												secondUser: {
													name: userName,
												},
											},
											{
												secondUserId: chatRoomMember[0],
												firstUser: {
													name: userName,
												},
											},
										]
									: undefined,
						},
					],
				},
			}),
		]);

		return [chatRooms, totalRecords];
	}

	async createChatRoom({
		chatRoom,
	}: {
		chatRoom: CreateChatRoomsDto;
	}): Promise<ChatRoomsEntity> {
		return await this.prismaService.chatRooms.create({
			data: {
				firstUser: {
					connect: { id: chatRoom.firstUser.connect.id },
				},
				secondUser: {
					connect: { id: chatRoom.secondUser.connect.id },
				},
			},
		});
	}
}
