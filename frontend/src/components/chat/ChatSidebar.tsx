import {
	useState,
	useEffect,
	useRef,
	useCallback,
	forwardRef,
	useImperativeHandle,
} from 'react';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTimeAgo } from '@/lib/format-time-ago';
import { useInfiniteChatRooms } from '@/services/query/chatRoom';
import { useSocket } from '@/components/context/SocketContext';
import { useCurrentApp } from '@/components/context/AppContext';

interface Props {
	selectedUserId: string;
	onSelectUser: (userId: string) => void;
}

export interface ChatSidebarRef {
	updateChatRoomOnSend: (chatRoomId: string, message: IMessage) => void;
	markMessagesAsRead: (chatRoomId: string) => void;
}

export const ChatSidebar = forwardRef<ChatSidebarRef, Props>(
	({ selectedUserId, onSelectUser }, ref) => {
		const [searchTerm, setSearchTerm] = useState('');
		const [chatRoomsList, setChatRoomsList] = useState<IChatRoom[]>([]);
		const [viewedRoomsTimestamp, setViewedRoomsTimestamp] = useState<Map<string, Date>>(
			new Map(),
		);

		const { socket, isConnected } = useSocket();
		const { user } = useCurrentApp();
		const currentUserId = user?.id;

		const {
			data,
			isLoading,
			isError,
			error,
			fetchNextPage,
			hasNextPage,
			isFetchingNextPage,
		} = useInfiniteChatRooms({ limit: 10, search: searchTerm });

		useEffect(() => {
			const newChatRooms =
				data?.pages?.filter((p) => p.success).flatMap((p: any) => p.data) || [];
			setChatRoomsList(newChatRooms);
		}, [data]);

		useEffect(() => {
			if (selectedUserId) {
				setViewedRoomsTimestamp((prev) => {
					const newMap = new Map(prev);
					newMap.set(selectedUserId, new Date());
					return newMap;
				});
			}
		}, [selectedUserId]);

		useEffect(() => {
			if (!socket || !isConnected || !currentUserId) return;

			const handleNewMessage = (message: IMessage) => {
				setChatRoomsList((prevRooms) => {
					const updatedRooms = [...prevRooms];
					const roomIndex = updatedRooms.findIndex(
						(room) => room.id === message.chatRoomId,
					);

					if (roomIndex !== -1) {
						const room = updatedRooms[roomIndex];

						const isMessageFromCurrentUser = message.userId === currentUserId;
						const isCurrentlySelectedRoom = selectedUserId === message.chatRoomId;
						const shouldMarkAsRead = isMessageFromCurrentUser || isCurrentlySelectedRoom;

						const updatedRoom: IChatRoom = {
							...room,
							latestMessage: {
								content: message.content,
								type: message.type,
								userId: message.userId,
								isRead: shouldMarkAsRead,
								createdAt: message.createdAt,
							},
							updatedAt: message.createdAt,
						};

						updatedRooms.splice(roomIndex, 1);
						updatedRooms.unshift(updatedRoom);
					}

					return updatedRooms;
				});

				if (selectedUserId === message.chatRoomId && message.userId !== currentUserId) {
					setViewedRoomsTimestamp((prev) => {
						const newMap = new Map(prev);
						newMap.set(message.chatRoomId, new Date());
						return newMap;
					});
				}
			};

			socket.on('newMessage', handleNewMessage);

			return () => {
				socket.off('newMessage', handleNewMessage);
			};
		}, [socket, isConnected, currentUserId, selectedUserId]);

		const updateChatRoomOnSend = useCallback((chatRoomId: string, message: IMessage) => {
			setChatRoomsList((prevRooms) => {
				const updatedRooms = [...prevRooms];
				const roomIndex = updatedRooms.findIndex((room) => room.id === chatRoomId);

				if (roomIndex !== -1) {
					const room = updatedRooms[roomIndex];
					const updatedRoom: IChatRoom = {
						...room,
						latestMessage: {
							content: message.content,
							type: message.type,
							userId: message.userId,
							isRead: true,
							createdAt: message.createdAt,
						},
						updatedAt: message.createdAt,
					};

					updatedRooms.splice(roomIndex, 1);
					updatedRooms.unshift(updatedRoom);
				}

				return updatedRooms;
			});
		}, []);

		const markMessagesAsRead = useCallback(
			(chatRoomId: string) => {
				setChatRoomsList((prevRooms) => {
					return prevRooms.map((room) => {
						if (
							room.id === chatRoomId &&
							room.latestMessage &&
							!room.latestMessage.isRead &&
							room.latestMessage.userId !== currentUserId
						) {
							return {
								...room,
								latestMessage: {
									...room.latestMessage,
									isRead: true,
								},
							};
						}
						return room;
					});
				});

				setViewedRoomsTimestamp((prev) => {
					const newMap = new Map(prev);
					newMap.set(chatRoomId, new Date());
					return newMap;
				});
			},
			[currentUserId],
		);

		useImperativeHandle(
			ref,
			() => ({
				updateChatRoomOnSend,
				markMessagesAsRead,
			}),
			[updateChatRoomOnSend, markMessagesAsRead],
		);

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

			const hasUnreadFromOthers =
				lastMessage && !lastMessage.isRead && lastMessage.userId !== currentUserId;
			const lastViewedTime = viewedRoomsTimestamp.get(chatRoom.id);
			const isMessageAfterLastView =
				!lastViewedTime ||
				(lastMessage && new Date(lastMessage.createdAt) > lastViewedTime);
			const shouldBeBold = hasUnreadFromOthers && !isSelected && isMessageAfterLastView;

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
							<h3
								className={`text-gray-900 truncate ${shouldBeBold ? 'font-bold' : 'font-medium'}`}
							>
								{chatRoom.secondUser.name}
							</h3>
							{chatRoom.updatedAt && (
								<span
									className={`text-xs text-gray-500 ${shouldBeBold ? 'font-semibold' : ''}`}
								>
									{formatTimeAgo(chatRoom.updatedAt.toString())}
								</span>
							)}
						</div>
						<p
							className={`text-xs text-gray-600 truncate ${shouldBeBold ? 'font-semibold text-gray-800' : ''}`}
						>
							{preview ||
								(chatRoom.updatedAt ? formatTimeAgo(chatRoom.updatedAt.toString()) : '')}
						</p>
					</div>

					{shouldBeBold && (
						<div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
					)}
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
					<div className="text-center py-8 text-gray-500">
						Chưa có cuộc trò chuyện nào
					</div>
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
	},
);
