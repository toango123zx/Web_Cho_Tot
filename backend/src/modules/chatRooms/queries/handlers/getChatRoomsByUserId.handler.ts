import { HttpException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto, OrderByEnum, PaginationUtils } from 'src/common';

import { ChatRoomsRepository } from '../../chatRooms.repository';
import { GetChatRoomsResponseDto } from '../../dtos';
import { GetChatRoomsByUserIdQuery } from '../implements';

@QueryHandler(GetChatRoomsByUserIdQuery)
export class GetChatRoomsByUserIdHandler
	implements IQueryHandler<GetChatRoomsByUserIdQuery>
{
	constructor(private readonly chatRoomsRepository: ChatRoomsRepository) {}

	async execute(
		command: GetChatRoomsByUserIdQuery,
	): Promise<HttpResponseBodySuccessDto<GetChatRoomsResponseDto[]> | HttpException> {
		const { myInformation, pagination } = command;

		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);

		const [chatRooms, totalRecordchatRoomsExists] =
			await this.chatRoomsRepository.findChatRooms({
				chatRoomMember: [
					myInformation.id,
					pagination.search ? pagination.search : myInformation.id,
				],
				pagination: page,
				filter: {
					updatedAt: OrderByEnum.DESC,
				},
			});

		const chatRoomsResponse = chatRooms.map(
			(chatRoom) =>
				new GetChatRoomsResponseDto({
					chatRoom: chatRoom,
					myInformation: myInformation,
				}),
		);

		return {
			success: true,
			data: chatRoomsResponse,
			pagination: page.convertPaginationResponseDtoFromTotalRecords(
				totalRecordchatRoomsExists,
			),
		};
	}
}
