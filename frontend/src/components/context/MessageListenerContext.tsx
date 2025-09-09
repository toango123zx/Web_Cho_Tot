import { useSocket } from '@/components/context/SocketContext';
import { useCurrentApp } from '@/components/context/AppContext';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface MessageListenerContextType {
	hasUnreadMessages: boolean;
	unreadChatRooms: Set<string>;
	markChatRoomAsRead: (chatRoomId: string) => void;
	markAllMessagesAsRead: () => void;
}

const MessageListenerContext = createContext<MessageListenerContextType | undefined>(
	undefined,
);

export const useMessageListener = () => {
	const context = useContext(MessageListenerContext);
	if (!context) {
		throw new Error('useMessageListener must be used within MessageListenerProvider');
	}
	return context;
};

interface MessageListenerProviderProps {
	children: ReactNode;
}

export const MessageListenerProvider = ({ children }: MessageListenerProviderProps) => {
	const { socket } = useSocket();
	const { user, isAuthenticated } = useCurrentApp();
	const [unreadChatRooms, setUnreadChatRooms] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (!socket || !user || !isAuthenticated) return;

		const handleNewMessage = (message: IMessage) => {
			if (message.userId !== user.id && message.chatRoomId) {
				setUnreadChatRooms((prev) => new Set(prev).add(message.chatRoomId));
			}
		};

		socket.on('newMessage', handleNewMessage);

		return () => {
			socket.off('newMessage', handleNewMessage);
		};
	}, [socket, user, isAuthenticated]);

	const markChatRoomAsRead = (chatRoomId: string) => {
		setUnreadChatRooms((prev) => {
			const newSet = new Set(prev);
			newSet.delete(chatRoomId);
			return newSet;
		});
	};

	const markAllMessagesAsRead = () => {
		setUnreadChatRooms(new Set());
	};

	const hasUnreadMessages = unreadChatRooms.size > 0;

	return (
		<MessageListenerContext.Provider
			value={{
				hasUnreadMessages,
				unreadChatRooms,
				markChatRoomAsRead,
				markAllMessagesAsRead,
			}}
		>
			{children}
		</MessageListenerContext.Provider>
	);
};
