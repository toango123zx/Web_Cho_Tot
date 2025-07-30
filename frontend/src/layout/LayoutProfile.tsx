import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';

type ProfileLayoutProps = {
	children: React.ReactNode;
};

export function ProfileLayout({ children }: ProfileLayoutProps) {
	const navigate = useNavigate();
	const location = useLocation();

	const currentPath = location.pathname;
	const isProfile = currentPath === '/user/settings/profile';
	const isAccount = currentPath === '/user/settings/account';

	let title = 'Thông tin cá nhân';
	if (isAccount) title = 'Cài đặt tài khoản';

	return (
		<div className="min-h-screen bg-gray-100 py-8">
			<div className="max-w-6xl mx-auto px-4">
				<h1 className="text-xl font-bold text-gray-900 mb-6">{title}</h1>
				<div className="flex flex-col md:flex-row">
					{/* Mobile dropdown */}
					<div className="block md:hidden mb-4">
						<Select
							value={isProfile ? 'profile' : 'account'}
							onValueChange={(value) => {
								if (value === 'profile') navigate('/user/settings/profile');
								else if (value === 'account') navigate('/user/settings/account');
							}}
						>
							<SelectTrigger className="w-full bg-white border border-gray-300 ">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="profile">Thông tin cá nhân</SelectItem>
								<SelectItem value="account">Cài đặt tài khoản</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Sidebar desktop */}
					<div className="hidden md:block w-64 bg-white rounded-md shadow border border-gray-200 pl-2 pt-2 pb-2 h-fit">
						<nav className="space-y-2">
							<button
								onClick={() => navigate('/user/settings/profile')}
								className={cn(
									'block w-full text-left px-3 py-2 rounded-md text-sm font-medium cursor-pointer',
									isProfile ? 'text-[#222222]' : 'text-[#8c8c8c]',
								)}
							>
								Thông tin cá nhân
							</button>

							<button
								onClick={() => navigate('/user/settings/account')}
								className={cn(
									'block w-full text-left px-3 py-2 rounded-md text-sm font-medium cursor-pointer',
									isAccount ? 'text-[#222222]' : 'text-[#8c8c8c]',
								)}
							>
								Cài đặt tài khoản
							</button>
						</nav>
					</div>

					<div className="mt-4 md:mt-0 md:ml-8 flex-1">
						<div className="bg-white shadow rounded-md p-8">{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
