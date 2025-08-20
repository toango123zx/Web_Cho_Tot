import { useMessageListener } from '@/components/context/MessageListenerContext';

export function useChatRoomRead() {
	const { markChatRoomAsRead } = useMessageListener();

	const markCurrentChatRoomAsRead = (chatRoomId: string) => {
		if (chatRoomId) {
			markChatRoomAsRead(chatRoomId);
		}
	};

	return {
		markCurrentChatRoomAsRead,
	};
}
