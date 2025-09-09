import { Avatar } from '@/components/ui/avatar';
import { formatTimeAgo } from '@/lib/format-time-ago';
import { cn } from '@/lib/utils';

interface Props {
	message: IMessage;
	isOwn: boolean;
	userAvatar?: string;
}

export function MessageItem({ message, isOwn, userAvatar }: Props) {
	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const target = e.target as HTMLImageElement;
		target.style.display = 'none';
		target.parentElement!.innerHTML = `
			<div class="px-4 py-2 text-sm text-red-500">
				Không thể tải ảnh
			</div>
		`;
	};

	const handleImageClick = () => window.open(message.content, '_blank');

	const renderMessageContent = () => {
		switch (message.type) {
			case 'TEXT':
				return <p className="text-sm leading-relaxed">{message.content}</p>;

			case 'IMAGE':
				return (
					<div className="relative">
						<img
							src={message.content}
							alt="Shared image"
							className="max-w-[250px] max-h-[300px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
							onError={handleImageError}
							onClick={handleImageClick}
						/>
					</div>
				);

			default:
				return (
					<p className="text-sm leading-relaxed text-gray-500 italic">
						Loại tin nhắn không được hỗ trợ
					</p>
				);
		}
	};

	return (
		<div className={cn('flex gap-3', isOwn && 'flex-row-reverse')}>
			<div className="flex-shrink-0">
				<Avatar className="w-8 h-8">
					<img
						src={userAvatar || '/api/placeholder/32/32'}
						alt="Avatar"
						className="w-full h-full object-cover"
					/>
				</Avatar>
			</div>

			<div className={cn('flex flex-col max-w-[70%]', isOwn && 'items-end')}>
				<div
					className={cn(
						'rounded-2xl break-words',
						isOwn
							? 'bg-yellow-400 text-black rounded-br-md'
							: 'bg-gray-200 text-black rounded-bl-md',
						message.type === 'TEXT' ? 'px-4 py-2' : 'p-1',
					)}
				>
					{renderMessageContent()}
				</div>

				<span className="text-xs text-gray-500 mt-1 px-2">
					{formatTimeAgo(new Date(message.createdAt).toISOString())}
				</span>
			</div>
		</div>
	);
}
