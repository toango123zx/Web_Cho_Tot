import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageItem } from './MessageItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { uploadFileToCloudinary } from '@/services/api/cloudinary';
import { useSocket } from '@/components/context/SocketContext';
import { toast } from 'sonner';
import { useChatRoomRead } from '@/hooks';

interface UploadedImage {
	id: string;
	file: File;
	preview: string;
	cloudinaryUrl?: string;
	isUploading: boolean;
	publicId?: string;
	uploaded: boolean;
}

interface Props {
	chatRoom: IChatRoom;
	currentUserId: string;
	onMessageSent?: (chatRoomId: string, message: IMessage) => void;
	onMessageReceived?: (chatRoomId: string) => void;
}

import { useInfiniteMessages } from '@/services/query/chatRoom';

export function Chat({
	chatRoom,
	currentUserId,
	onMessageSent,
	onMessageReceived,
}: Props) {
	const [localMessages, setLocalMessages] = useState<IMessage[]>([]);
	const [input, setInput] = useState('');
	const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { socket, isConnected } = useSocket();
	const otherUser = chatRoom.secondUser;
	const currentUser = chatRoom.firstUser;
	const { markCurrentChatRoomAsRead } = useChatRoomRead();

	useEffect(() => {
		setLocalMessages([]);
		setInput('');
		setUploadedImages((prev) => {
			prev.forEach((img) => URL.revokeObjectURL(img.preview));
			return [];
		});

		if (chatRoom.id) {
			markCurrentChatRoomAsRead(chatRoom.id);
		}
	}, [chatRoom.id, markCurrentChatRoomAsRead]);

	const scrollToBottom = () => {
		if (scrollAreaRef.current) {
			const scrollElement = scrollAreaRef.current.querySelector(
				'[data-radix-scroll-area-viewport]',
			);
			if (scrollElement) {
				scrollElement.scrollTop = scrollElement.scrollHeight;
			}
		}
	};

	const createMessage = (
		content: string,
		type: 'TEXT' | 'IMAGE',
		index = 0,
	): IMessage => ({
		id: (new Date().getTime() + index + 1).toString(),
		userId: currentUser?.id || '',
		name: currentUser?.name || '',
		avatar: currentUser?.avatar || '',
		content,
		type,
		createdAt: new Date(Date.now() + index * 100),
		isRead: false,
		chatRoomId: chatRoom.id,
	});

	const sendToSocket = (content: string, type: 'TEXT' | 'IMAGE') => {
		if (socket && isConnected) {
			socket.emit('chat:sendMessage', {
				chatRoomId: chatRoom.id,
				receiverId: otherUser?.id,
				content,
				type,
			});
		}
	};

	const validateAndFilterFiles = (files: FileList): File[] => {
		const validFiles: File[] = [];
		const maxSize = 10 * 1024 * 1024;

		Array.from(files).forEach((file) => {
			if (!file.type.startsWith('image/')) {
				toast.error(`File ${file.name} không phải là ảnh hợp lệ`);
				return;
			}
			if (file.size > maxSize) {
				toast.error(`File ${file.name} quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB`);
				return;
			}
			validFiles.push(file);
		});

		return validFiles;
	};

	const uploadSingleImage = async (
		image: UploadedImage,
	): Promise<UploadedImage | null> => {
		try {
			const result = await uploadFileToCloudinary(image.file);

			if (result.success && result.data?.secure_url) {
				return {
					...image,
					cloudinaryUrl: result.data.secure_url,
					publicId: result.data.public_id,
					isUploading: false,
					uploaded: true,
				};
			} else {
				toast.error(`Không thể tải lên ảnh ${image.file.name}. Vui lòng thử lại!`);
				URL.revokeObjectURL(image.preview);
				return null;
			}
		} catch (error) {
			toast.error(`Không thể tải lên ảnh ${image.file.name}. Vui lòng thử lại!`);
			URL.revokeObjectURL(image.preview);
			return null;
		}
	};

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteMessages({
		chatRoomId: chatRoom.id,
		limit: 20,
	});

	useEffect(() => {
		const pages = data?.pages
			?.filter((p) => p.success)
			.map((p: any) => p.data?.messages || []);
		if (pages && pages.length) {
			const merged = ([] as IMessage[]).concat(...pages);
			merged.sort(
				(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			);
			setLocalMessages(merged);
		}
	}, [data, chatRoom.id]);

	useEffect(scrollToBottom, [localMessages]);

	useEffect(() => {
		const timer = setTimeout(scrollToBottom, 100);
		return () => clearTimeout(timer);
	}, [chatRoom.id]);

	const handleScroll = useCallback(() => {
		if (!scrollAreaRef.current) return;
		const viewport = scrollAreaRef.current.querySelector(
			'[data-radix-scroll-area-viewport]',
		) as HTMLElement | null;
		if (!viewport) return;
		if (viewport.scrollTop <= 0 && hasNextPage && !isFetchingNextPage) {
			const prevHeight = viewport.scrollHeight;
			fetchNextPage().then(() => {
				requestAnimationFrame(() => {
					const newHeight = viewport.scrollHeight;
					viewport.scrollTop = newHeight - prevHeight;
				});
			});
		}
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	useEffect(() => {
		const viewport = scrollAreaRef.current?.querySelector(
			'[data-radix-scroll-area-viewport]',
		) as HTMLElement | null;
		if (!viewport) return;
		viewport.addEventListener('scroll', handleScroll);
		return () => viewport.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	useEffect(() => {
		if (!socket || !isConnected) return;

		const handleNewMessage = (message: IMessage) => {
			if (message.chatRoomId === chatRoom.id && message.userId !== currentUserId) {
				const newMessage: IMessage = {
					...message,
					id: message.id || Date.now().toString(),
					type: message.type || 'TEXT',
					createdAt: new Date(message.createdAt || Date.now()),
					isRead: message.isRead || false,
					chatRoomId: chatRoom.id,
				};

				setLocalMessages((prev) => {
					const exists = prev.some((msg) => msg.id === newMessage.id);
					return exists ? prev : [...prev, newMessage];
				});

				if (onMessageReceived) {
					onMessageReceived(chatRoom.id);
				}
			}
		};

		socket.on('newMessage', handleNewMessage);

		return () => {
			socket.off('newMessage', handleNewMessage);
		};
	}, [socket, isConnected, chatRoom.id, currentUserId]);

	useEffect(() => {
		return () => {
			uploadedImages.forEach((img) => URL.revokeObjectURL(img.preview));
		};
	}, [uploadedImages]);

	const handleSendMessage = () => {
		if (!input.trim()) return;

		const newMessage = createMessage(input.trim(), 'TEXT');
		sendToSocket(input.trim(), 'TEXT');
		setLocalMessages((prev) => [...prev, newMessage]);

		if (onMessageSent) {
			onMessageSent(chatRoom.id, newMessage);
		}

		setInput('');
	};

	const handleFileSelect = async (files: FileList) => {
		const validFiles = validateAndFilterFiles(files);
		if (validFiles.length === 0) return;

		const newImages: UploadedImage[] = validFiles.map((file) => ({
			id: Date.now() + Math.random().toString(),
			file,
			preview: URL.createObjectURL(file),
			isUploading: false,
			uploaded: false,
		}));

		setUploadedImages((prev) => [...prev, ...newImages]);
	};

	const handleRemoveImage = (imageId: string) => {
		const imageToRemove = uploadedImages.find((img) => img.id === imageId);
		if (imageToRemove) {
			URL.revokeObjectURL(imageToRemove.preview);
			setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
		}
	};

	const handleSendAll = async () => {
		const imagesToUpload = uploadedImages.filter(
			(img) => !img.uploaded && !img.isUploading,
		);
		const successfullyUploadedImages: UploadedImage[] = [];

		if (imagesToUpload.length > 0) {
			setUploadedImages((prev) =>
				prev.map((img) =>
					imagesToUpload.some((toUpload) => toUpload.id === img.id)
						? { ...img, isUploading: true }
						: img,
				),
			);

			for (const image of imagesToUpload) {
				const uploadedImage = await uploadSingleImage(image);
				if (!uploadedImage) {
					setUploadedImages((prev) => prev.filter((img) => img.id !== image.id));
					return;
				}

				successfullyUploadedImages.push(uploadedImage);
				setUploadedImages((prev) =>
					prev.map((img) => (img.id === image.id ? uploadedImage : img)),
				);
			}
		}

		if (input.trim()) {
			const textMessage = createMessage(input.trim(), 'TEXT');
			sendToSocket(input.trim(), 'TEXT');
			setLocalMessages((prev) => [...prev, textMessage]);

			if (onMessageSent) {
				onMessageSent(chatRoom.id, textMessage);
			}
		}

		const previouslyUploadedImages = uploadedImages.filter(
			(img) =>
				img.cloudinaryUrl &&
				img.uploaded &&
				!imagesToUpload.some((toUpload) => toUpload.id === img.id),
		);
		const allUploadedImages = [
			...previouslyUploadedImages,
			...successfullyUploadedImages,
		];

		for (let index = 0; index < allUploadedImages.length; index++) {
			const image = allUploadedImages[index];
			const imageMessage = createMessage(image.cloudinaryUrl!, 'IMAGE', index);

			sendToSocket(image.cloudinaryUrl!, 'IMAGE');
			setLocalMessages((prev) => [...prev, imageMessage]);

			if (onMessageSent) {
				onMessageSent(chatRoom.id, imageMessage);
			}

			if (index < allUploadedImages.length - 1) {
				await new Promise((resolve) => setTimeout(resolve, 200));
			}
		}

		setInput('');
		uploadedImages.forEach((img) => URL.revokeObjectURL(img.preview));
		setUploadedImages([]);

		if (allUploadedImages.length > 0) {
			toast.success(`Đã gửi ${allUploadedImages.length} ảnh thành công!`);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			uploadedImages.length > 0 ? handleSendAll() : handleSendMessage();
		}
	};

	const renderImagePreview = (image: UploadedImage) => (
		<div key={image.id} className="relative flex-shrink-0">
			<img
				src={image.preview}
				alt="Preview"
				className="w-20 h-20 object-cover rounded-lg"
			/>

			{image.isUploading && (
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
					<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}

			<button
				onClick={() => handleRemoveImage(image.id)}
				className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
			>
				×
			</button>

			{image.uploaded && !image.isUploading && (
				<div className="absolute top-1 left-1 w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center">
					<svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
			)}

			{!image.uploaded && !image.isUploading && (
				<div className="absolute top-1 left-1 w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center">
					<svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
			)}
		</div>
	);

	const getButtonTitle = () => {
		if (!isConnected) return 'Mất kết nối';
		return 'Gửi tin nhắn';
	};

	const isButtonDisabled = () => {
		return (
			(!input.trim() && uploadedImages.length === 0) ||
			!isConnected ||
			uploadedImages.some((img) => img.isUploading)
		);
	};

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="flex-shrink-0 border-b p-4 bg-white">
				<div className="flex items-center gap-3">
					<img
						src={otherUser?.avatar}
						alt={otherUser?.name}
						className="w-10 h-10 rounded-full object-cover"
					/>
					<div>
						<h3 className="font-semibold text-gray-900">{otherUser?.name}</h3>
					</div>
				</div>
			</div>

			<div className="flex-1 min-h-0 overflow-hidden">
				<ScrollArea ref={scrollAreaRef} className="h-full">
					<div className="p-4 space-y-4">
						{hasNextPage && (
							<div className="text-center py-2 text-xs text-gray-400">
								{isFetchingNextPage ? 'Đang tải...' : 'Kéo lên để tải thêm'}
							</div>
						)}
						{localMessages.map((message) => (
							<MessageItem
								key={message.id}
								message={message}
								isOwn={message.userId === currentUserId}
								userAvatar={
									message.userId === currentUserId
										? currentUser?.avatar
										: otherUser?.avatar
								}
							/>
						))}
					</div>
				</ScrollArea>
			</div>

			<div className="flex-shrink-0 border-t bg-white">
				{uploadedImages.length > 0 && (
					<div className="p-4 border-b">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-600">
								Ảnh đã chọn ({uploadedImages.filter((img) => img.uploaded).length}/
								{uploadedImages.length})
							</span>
						</div>
						<div className="flex gap-2 overflow-x-auto">
							{uploadedImages.map(renderImagePreview)}
						</div>
					</div>
				)}

				<div className="p-4">
					<div className="flex items-center gap-2">
						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept="image/*"
							onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
							className="hidden"
						/>

						<button
							onClick={() => fileInputRef.current?.click()}
							className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
							title="Chọn ảnh"
						>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
									clipRule="evenodd"
								/>
							</svg>
						</button>

						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Nhập tin nhắn..."
							className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>

						<button
							onClick={uploadedImages.length > 0 ? handleSendAll : handleSendMessage}
							disabled={isButtonDisabled()}
							className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
							title={getButtonTitle()}
						>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
