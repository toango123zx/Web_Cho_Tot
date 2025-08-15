import { Injectable } from '@nestjs/common';

import { IPaginationQuery } from 'src/common';
import { CreateMessagesDto, MessagesEntity } from 'src/models';

import { PrismaService } from '../database/services';

@Injectable()
export class ChatsRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findMessages({
		chatRoomId,
		pagination = {} as IPaginationQuery,
	}: {
		chatRoomId?: string;
		pagination?: IPaginationQuery;
	}): Promise<[MessagesEntity[], number]> {
		const [messages, totalRecords] = await Promise.all([
			this.prismaService.messages.findMany({
				include: {
					user: true,
				},
				where: {
					chatRoomId: chatRoomId,
				},
				take: pagination.take,
				skip: pagination.skip,
				orderBy: {
					createdAt: 'asc',
				},
			}),
			this.prismaService.messages.count({
				where: {
					chatRoomId: chatRoomId,
				},
			}),
		]);

		return [messages, totalRecords];
	}

	async createMessage({
		message,
	}: {
		message: CreateMessagesDto;
	}): Promise<MessagesEntity> {
		return this.prismaService.$transaction(async (prisma) => {
			await prisma.chatRooms.update({
				where: {
					id: message.chatRoom.connect.id,
				},
				data: {
					updatedAt: new Date(),
				},
			});

			return await prisma.messages.create({
				include: {
					user: true,
				},
				data: {
					...message,
					chatRoom: {
						connect: {
							id: message.chatRoom.connect.id,
						},
					},
					user: {
						connect: {
							id: message.user.connect.id,
						},
					},
				},
			});
		});
	}
}
