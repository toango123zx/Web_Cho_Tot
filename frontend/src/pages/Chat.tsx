import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatSidebar, type ChatSidebarRef } from '@/components/chat';
import { ChatRoom } from '@/components/chat';
import { Button } from '@/components/ui/button';
import { useChatRoomByChatRoomIdQueryWithPagination } from '@/services/query/chatRoom';
import { useCurrentApp } from '@/components/context/AppContext';
import { useChatRoomRead } from '@/hooks';

export default function Chat() {
	const [selectedUserId, setSelectedUserId] = useState<string>('');
	const location = useLocation();
	const [showSidebar, setShowSidebar] = useState(true);
	const [chatRooms, setChatRooms] = useState<IChatRoom>({} as IChatRoom);
	const { user } = useCurrentApp();
	const chatSidebarRef = useRef<ChatSidebarRef>(null);
	const { markCurrentChatRoomAsRead } = useChatRoomRead();

	const { data: chatRoomData } = useChatRoomByChatRoomIdQueryWithPagination({
		chatRoomId: selectedUserId,
		page: 1,
		limit: 100,
	});

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const roomId = params.get('room');
		if (roomId) setSelectedUserId(roomId);
	}, [location.search]);

	useEffect(() => {
		if (chatRoomData?.success) {
			setChatRooms(chatRoomData.data);
		}
	}, [chatRoomData]);

	const handleSelectUser = (userId: string) => {
		setSelectedUserId(userId);

		markCurrentChatRoomAsRead(userId);

		if (chatSidebarRef.current) {
			chatSidebarRef.current.markMessagesAsRead(userId);
		}

		if (window.innerWidth < 768) {
			setShowSidebar(false);
		}
	};

	const handleBackToSidebar = () => {
		setShowSidebar(true);
		setSelectedUserId('');
	};

	const handleMessageSent = (chatRoomId: string, message: IMessage) => {
		if (chatSidebarRef.current) {
			chatSidebarRef.current.updateChatRoomOnSend(chatRoomId, message);
		}
	};

	const handleMessageReceived = (chatRoomId: string) => {
		if (chatSidebarRef.current && selectedUserId === chatRoomId) {
			chatSidebarRef.current.markMessagesAsRead(chatRoomId);
		}
	};

	return (
		<div className="flex bg-gray-50 h-full overflow-hidden">
			<div
				className={`w-full md:w-80 border-r bg-white ${showSidebar ? 'block' : 'hidden md:block'}`}
			>
				<ChatSidebar
					ref={chatSidebarRef}
					selectedUserId={selectedUserId}
					onSelectUser={handleSelectUser}
				/>
			</div>

			<div
				className={`flex-1 ${!showSidebar || selectedUserId ? 'block' : 'hidden md:block'}`}
			>
				{selectedUserId ? (
					<div className="h-full relative">
						<div className="md:hidden absolute top-4 left-4 z-10">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleBackToSidebar}
								className="bg-white shadow-md"
							>
								← Quay lại
							</Button>
						</div>
						<ChatRoom
							chatRoom={chatRooms}
							currentUserId={user?.id || ''}
							onMessageSent={handleMessageSent}
							onMessageReceived={handleMessageReceived}
						/>
					</div>
				) : (
					<div className="h-full flex items-center justify-center text-gray-500">
						<div className="text-center">
							<div className="text-6xl mb-4">💬</div>
							<p className="text-lg">Chọn một cuộc trò chuyện để bắt đầu</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
