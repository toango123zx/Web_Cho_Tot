import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatSidebar } from '@/components/chat';
import { ChatRoom } from '@/components/chat';
import { Button } from '@/components/ui/button';
import { useChatRoomByChatRoomIdQueryWithPagination } from '@/services/query/chatRoom';
import { useCurrentApp } from '@/components/context/AppContext';

export default function Chat() {
	const [selectedUserId, setSelectedUserId] = useState<string>('');
	const location = useLocation();
	const [showSidebar, setShowSidebar] = useState(true);
	const [chatRooms, setChatRooms] = useState<IChatRoom>({} as IChatRoom);
	const { user } = useCurrentApp();

	// Move hook to top level and pass selectedUserId as parameter
	const { data: chatRoomData } = useChatRoomByChatRoomIdQueryWithPagination({
		chatRoomId: selectedUserId, // Pass the selected user ID
		page: 1,
		limit: 100,
	});

	// Parse room param from URL
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const roomId = params.get('room');
		if (roomId) setSelectedUserId(roomId);
	}, [location.search]);

	// Handle data when it changes
	useEffect(() => {
		if (chatRoomData?.success) {
			setChatRooms(chatRoomData.data);
		}
	}, [chatRoomData]);

	const handleSelectUser = (userId: string) => {
		setSelectedUserId(userId);

		// Ẩn sidebar trên mobile khi chọn user
		if (window.innerWidth < 768) {
			setShowSidebar(false);
		}
	};

	const handleBackToSidebar = () => {
		setShowSidebar(true);
		setSelectedUserId('');
	};

	return (
		<div className="flex bg-gray-50 h-full overflow-hidden">
			{/* Sidebar danh sách cuộc trò chuyện */}
			<div
				className={`w-full md:w-80 border-r bg-white ${showSidebar ? 'block' : 'hidden md:block'}`}
			>
				<ChatSidebar selectedUserId={selectedUserId} onSelectUser={handleSelectUser} />
			</div>

			{/* Cửa sổ chat chính */}
			<div
				className={`flex-1 ${!showSidebar || selectedUserId ? 'block' : 'hidden md:block'}`}
			>
				{selectedUserId ? (
					<div className="h-full relative">
						{/* Back button cho mobile */}
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
						<ChatRoom chatRoom={chatRooms} currentUserId={user?.id || ''} />
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
