import { QUERY_KEY } from '@/config/key';
import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
	createChatRoomAPI,
	getChatRoomByChatRoomIdAPI,
	getChatRoomsAPI,
} from '../api/chatRoom';

interface ChatRoomQueryProps {
	chatRoomId?: string;
	page: number;
	limit: number;
	search?: string;
}

export function useChatRoomsQueryWithPagination({
	page,
	limit,
	search,
}: ChatRoomQueryProps) {
	const query = useQuery({
		// page, limit, search
		queryKey: QUERY_KEY.getChatRooms(page, limit, search || ''),
		queryFn: () => getChatRoomsAPI(page, limit, search),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	return query;
}

export function useChatRoomByChatRoomIdQueryWithPagination({
	chatRoomId = '',
	page,
	limit,
}: ChatRoomQueryProps) {
	const query = useQuery({
		queryKey: QUERY_KEY.getChatRoomByChatRoomId(chatRoomId, { page, limit }),
		queryFn: () => getChatRoomByChatRoomIdAPI(chatRoomId, page, limit),
		staleTime: 1000 * 60 * 5, // 5 minutes
		enabled: !!chatRoomId, // Only run when chatRoomId exists
	});

	return query;
}

export function useCreateChatRoom() {
	return useMutation({
		mutationFn: (payload: { userId: string }) => createChatRoomAPI(payload.userId),
	});
}

export function useInfiniteChatRooms({
	limit = 10,
	search = '',
}: {
	limit?: number;
	search?: string;
}) {
	return useInfiniteQuery({
		queryKey: [...QUERY_KEY.getChatRooms(0, limit, search), 'infinite'],
		initialPageParam: 1,
		queryFn: ({ pageParam }) => getChatRoomsAPI(pageParam as number, limit, search),
		getNextPageParam: (lastPage) => {
			if (!lastPage.success) return undefined;
			const { currentPage, totalPages } = lastPage.pagination;
			return currentPage < totalPages ? currentPage + 1 : undefined;
		},
	});
}

export function useInfiniteMessages({
	chatRoomId,
	limit = 20,
}: {
	chatRoomId?: string;
	limit?: number;
}) {
	return useInfiniteQuery({
		queryKey: ['chatRoomMessages', chatRoomId, limit],
		enabled: !!chatRoomId,
		initialPageParam: 1,
		queryFn: ({ pageParam }) =>
			getChatRoomByChatRoomIdAPI(chatRoomId || '', pageParam as number, limit),
		getNextPageParam: (lastPage, _pages, lastPageParam) => {
			if (!lastPage.success) return undefined;
			const messages = lastPage.data?.messages || [];
			return messages.length < limit ? undefined : (lastPageParam as number) + 1;
		},
	});
}
