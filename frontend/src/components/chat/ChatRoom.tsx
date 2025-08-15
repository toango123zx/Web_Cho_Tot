import { Chat } from './Chat';

interface Props {
	chatRoom: IChatRoom;
	currentUserId: string;
}

export function ChatRoom({ chatRoom, currentUserId }: Props) {
	if (!chatRoom) {
		return (
			<div className="flex items-center justify-center h-full bg-gray-50">
				<div className="text-center">
					<div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
						<svg
							className="w-8 h-8 text-gray-400"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Chọn một cuộc trò chuyện
					</h3>
					<p className="text-gray-500">
						Hãy chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin
					</p>
				</div>
			</div>
		);
	}

	return <Chat chatRoom={chatRoom} currentUserId={currentUserId} />;
}
