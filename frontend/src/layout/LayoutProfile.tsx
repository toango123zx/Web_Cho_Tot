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
	} else if (location.pathname === '/user/settings/profile') {
		title = 'Thông tin cá nhân';
	}

	return (
		<div className="min-h-screen bg-gray-50 py-4 sm:py-8">
			<div className="max-w-5xl mx-auto px-4">
				<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
					{title}
				</h1>
				<div className="flex flex-col sm:flex-row bg-white shadow-md rounded-lg overflow-hidden">
					{/* Sidebar */}
					<div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r">
						<div className="p-4 sm:p-6">
							<h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
								Thông tin cá nhân
							</h2>
							<nav className="space-y-2">
								<button
									onClick={() => navigate('/user/settings/profile')}
									className={cn(
										'block w-full text-left px-3 py-2 rounded-md text-sm font-medium cursor-pointer',
										location.pathname === '/user/settings/profile'
											? 'text-blue-600 bg-blue-50'
											: 'text-gray-700 hover:bg-gray-100',
									)}
								>
									Thông tin cá nhân
								</button>
								<button
									onClick={() => navigate('/user/settings/account')}
									className={cn(
										'block w-full text-left px-3 py-2 rounded-md text-sm font-medium cursor-pointer',
										location.pathname === '/user/settings/account'
											? 'text-blue-600 bg-blue-50'
											: 'text-gray-700 hover:bg-gray-100',
									)}
								>
									Cài đặt tài khoản
								</button>
							</nav>
						</div>
					</div>

					{/* Main Content */}
					<div className="flex-1 p-4 sm:p-8">
						<div className="max-w-2xl">{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
