import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTimeAgo } from '@/lib/format-time-ago';
import { useInfiniteChatRooms } from '@/services/query/chatRoom';

interface Props {
	selectedUserId: string;
	onSelectUser: (userId: string) => void;
}

export function ChatSidebar({ selectedUserId, onSelectUser }: Props) {
	const [searchTerm, setSearchTerm] = useState('');

	const {
		data,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteChatRooms({ limit: 10, search: searchTerm });

	const chatRoomsList =
		data?.pages?.filter((p) => p.success).flatMap((p: any) => p.data) || [];

	// Intersection Observer sentinel for lazy loading
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	const onIntersect = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const first = entries[0];
			if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[hasNextPage, isFetchingNextPage, fetchNextPage],
	);

	useEffect(() => {
		const observer = new IntersectionObserver(onIntersect, {
			root: null,
			rootMargin: '0px',
			threshold: 1.0,
		});
		const current = sentinelRef.current;
		if (current) observer.observe(current);
		return () => {
			if (current) observer.unobserve(current);
			observer.disconnect();
		};
	}, [onIntersect]);
	const filteredChatRooms = searchTerm
		? chatRoomsList.filter((chatRoom: any) =>
				chatRoom.secondUser.name.toLowerCase().includes(searchTerm.toLowerCase()),
			)
		: chatRoomsList;

	const renderChatRoomItem = (chatRoom: IChatRoom) => {
		const isSelected = selectedUserId === chatRoom.id;
		const lastMessage = chatRoom.latestMessage;
		let preview = lastMessage
			? lastMessage.type === 'IMAGE'
				? '[Ảnh]'
				: lastMessage.content
			: '';
		if (preview) {
			preview = preview.replace(/\s+/g, ' ').trim();
			if (preview.length > 30) preview = preview.slice(0, 30) + '…';
		}
		return (
			<div
				key={chatRoom.id}
				onClick={() => onSelectUser(chatRoom.id)}
				className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
					isSelected ? 'bg-blue-50 border border-blue-200' : ''
				}`}
			>
				<Avatar className="w-12 h-12">
					<img
						src={chatRoom.secondUser.avatar || '/api/placeholder/48/48'}
						alt={chatRoom.secondUser.name}
						className="w-full h-full object-cover"
					/>
				</Avatar>

				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between mb-1">
						<h3 className="font-medium text-gray-900 truncate">
							{chatRoom.secondUser.name}
						</h3>
						{chatRoom.updatedAt && (
							<span className="text-xs text-gray-500">
								{formatTimeAgo(chatRoom.updatedAt.toString())}
							</span>
						)}
					</div>
					<p className="text-xs text-gray-600 truncate">
						{preview ||
							(chatRoom.updatedAt ? formatTimeAgo(chatRoom.updatedAt.toString()) : '')}
					</p>
				</div>
			</div>
		);
	};

	const renderContent = () => {
		if (isLoading) {
			return (
				<div className="text-center py-8 text-gray-500">
					Đang tải danh sách người dùng...
				</div>
			);
		}

		if (isError) {
			return (
				<div className="text-center py-8 text-red-500">
					Có lỗi xảy ra khi tải dữ liệu: {error?.message}
				</div>
			);
		}

		if (!chatRoomsList.length && !isLoading) {
			return (
				<div className="text-center py-8 text-gray-500">Chưa có cuộc trò chuyện nào</div>
			);
		}

		if (!filteredChatRooms.length) {
			return (
				<div className="text-center py-8 text-gray-500">
					Không tìm thấy cuộc trò chuyện nào
				</div>
			);
		}

		return (
			<>
				{filteredChatRooms.map(renderChatRoomItem)}
				<div ref={sentinelRef} />
				<div className="py-2 text-center text-xs text-gray-500">
					{isFetchingNextPage && 'Đang tải thêm...'}
				</div>
			</>
		);
	};

	return (
		<div className="h-full max-h-full flex flex-col overflow-hidden">
			<div className="flex-shrink-0 p-4 border-b">
				<h2 className="text-xl font-semibold mb-3">Tin nhắn</h2>
				<Input
					type="text"
					placeholder="Tìm kiếm cuộc trò chuyện..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full"
				/>
			</div>

			<div className="flex-1 min-h-0 overflow-hidden">
				<ScrollArea className="h-full">
					<div className="p-2">{renderContent()}</div>
				</ScrollArea>
			</div>
		</div>
	);
}
