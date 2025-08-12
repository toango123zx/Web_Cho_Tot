import { Injectable } from '@nestjs/common';

import { IPaginationQuery } from 'src/common/interfaces/paginationQuery.interface';
import { ChatRoomsEntity, CreateChatRoomsDto } from 'src/models';
import { PrismaService } from 'src/modules/database/services';

import { ChatRoomOrderByDto } from './dtos';

@Injectable()
export class ChatRoomsRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findChatRooms({
		chatRoomId,
		chatRoomMember = [],
		pagination = {} as IPaginationQuery,
		filter,
	}: {
		chatRoomId?: string[];
		chatRoomMember?: string[];
		pagination?: IPaginationQuery;
		filter?: ChatRoomOrderByDto;
	}): Promise<[ChatRoomsEntity[], number]> {
		const orderBy = Object.entries(filter || {})
			.filter(([_, value]) => Boolean(value))
			.map(([key, value]) => ({ [key]: value }));

		const [chatRooms, totalRecords] = await Promise.all([
			this.prismaService.chatRooms.findMany({
				where: {
					id: {
						in: chatRoomId,
					},
					firstUserId: {
						in: chatRoomMember,
					},
					secondUserId: {
						in: chatRoomMember,
					},
				},
				skip: pagination.skip,
				take: pagination.take,
				orderBy: orderBy,
			}),
			this.prismaService.chatRooms.count({
				where: {
					id: {
						in: chatRoomId,
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
						chatRoomMember[0] === chatRoomMember[1]
							? {
									OR: [
										{
											firstUserId: chatRoomMember[0],
										},
										{
											secondUserId: chatRoomMember[0],
										},
									],
								}
							: undefined,
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
