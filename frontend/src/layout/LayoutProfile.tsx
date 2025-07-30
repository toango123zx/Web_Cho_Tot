import type * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

type ProfileLayoutProps = {
	children: React.ReactNode;
};

export function ProfileLayout({ children }: ProfileLayoutProps) {
	const navigate = useNavigate();
	const location = useLocation();

	let title = 'Thông tin cá nhân';
	if (location.pathname === '/user/settings/account') {
		title = 'Cài đặt tài khoản';
	}

	return (
		<div className="min-h-screen bg-gray-100 py-8">
			<div className="max-w-6xl mx-auto px-4">
				<h1 className="text-xl font-bold text-gray-900 mb-6">{title}</h1>
				<div className="flex">
					<div className="w-64 bg-white rounded-md shadow border border-gray-200 pl-2 pt-2 pb-2 h-fit">
						<nav className="space-y-2">
							<button
								onClick={() => navigate('/user/settings/profile')}
								className={cn(
									'block w-full text-left px-3 py-2 rounded-md text-sm font-medium cursor-pointer',
									location.pathname === '/user/settings/profile'
										? 'text-[#222222]'
										: 'text-[#8c8c8c]',
								)}
							>
								Thông tin cá nhân
							</button>

							<button
								onClick={() => navigate('/user/settings/account')}
								className={cn(
									'block w-full text-left px-3 py-2 rounded-md text-sm font-medium cursor-pointer',
									location.pathname === '/user/settings/account'
										? 'text-[#222222]'
										: 'text-[#8c8c8c]',
								)}
							>
								Cài đặt tài khoản
							</button>
						</nav>
					</div>

					<div className="ml-8 flex-1">
						<div className="bg-white shadow rounded-md p-8">{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
