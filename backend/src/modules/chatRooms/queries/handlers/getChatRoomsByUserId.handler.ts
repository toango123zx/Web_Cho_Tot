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
	): Promise<HttpResponseBodySuccessDto<GetChatRoomsResponseDto> | HttpException> {
		const { myInformation, pagination, filter } = command;

		const page = new PaginationUtils().extractSkipTakeFromPagination(pagination);

		const [chatRooms, totalRecordchatRoomsExists] =
			await this.chatRoomsRepository.findChatRooms({
				chatRoomMember: [myInformation.id, myInformation.id],
				pagination: page,
				userName: filter.keyword,
				filter: {
					updatedAt: OrderByEnum.DESC,
				},
			});

		return {
			success: true,
			data: new GetChatRoomsResponseDto(chatRooms),
			pagination: page.convertPaginationResponseDtoFromTotalRecords(
				totalRecordchatRoomsExists,
			),
		};
	}
}
