import { cn } from '@/lib/utils';

interface AvatarProps {
	isLoggedIn: boolean;
	username: string;
	avatarURL?: string;
	size?: number;
}

export function Avatar({ isLoggedIn, username, avatarURL, size = 28 }: AvatarProps) {
	if (!isLoggedIn || !avatarURL) {
		return (
			<div
				className={cn(
					'rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-medium',
					'w-[28px] h-[28px]',
				)}
				style={{ width: size, height: size }}
			>
				{username?.charAt(0).toUpperCase() || 'U'}
			</div>
		);
	}

	return (
		<img
			src={avatarURL}
			alt={username}
			className="rounded-full object-cover"
			style={{
				width: size,
				height: size,
			}}
			onError={(e) => {
				e.currentTarget.onerror = null;
				e.currentTarget.src =
					'https://ui-avatars.com/api/?name=' + encodeURIComponent(username);
			}}
		/>
	);
}
