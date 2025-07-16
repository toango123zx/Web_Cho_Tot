import { CircleUserRound } from 'lucide-react'

export interface AvatarProps {
	isLoggedIn: boolean
	username?: string
	avatarURL?: string
	size?: number
}

export function Avatar({ isLoggedIn, username, avatarURL, size = 18 }: AvatarProps) {
	if (!isLoggedIn) {
		return (
			<div className='w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-300 flex items-center justify-center'>
				<CircleUserRound
					size={18}
					className='w-4 h-4 sm:w-5 sm:h-5'
				/>
			</div>
		)
	}

	return !avatarURL ? (
		<div
			style={{ width: size, height: size }}
			className='inline-flex items-center justify-center rounded-full bg-red-400 text-white'
		>
			{username?.charAt(0).toUpperCase() || 'U'}
		</div>
	) : (
		<img
			src={avatarURL}
			width={size}
			height={size}
			className='inline-flex items-center justify-center rounded-full object-cover'
			alt={username || 'User Avatar'}
		/>
	)
}
