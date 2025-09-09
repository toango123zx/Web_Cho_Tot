import { useQuery } from '@tanstack/react-query';
import { getMessagesAPI, getChatUsersAPI } from '@/services/api/message';

export const useMessages = (receiverId: string) => {
	return useQuery({
		queryKey: ['messages', receiverId],
		queryFn: () => getMessagesAPI(receiverId),
		enabled: !!receiverId,
	});
};

export const useChatUsers = () => {
	return useQuery({
		queryKey: ['chat-users'],
		queryFn: getChatUsersAPI,
	});
};
