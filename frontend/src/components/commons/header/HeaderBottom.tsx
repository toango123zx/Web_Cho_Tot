import { NotificationDropdown } from '@/components/commons/header/NotificationDropDown';
import { useCurrentApp } from '@/components/context/AppContext';
import { Button } from '@/components/ui';
import { useClickOutside, useNotificationListener } from '@/hooks';
import { useInfiniteCategoriesQuery } from '@/services/query/category';
import { useGetNotifications } from '@/services/query/notification';
import {
	Bell,
	ChevronDown,
	ChevronRight,
	CircleUserRound,
	Dog,
	List,
	Loader,
	MessageSquareText,
	Newspaper,
	ShoppingBag,
	SquarePen,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from './AccountAvatar';
import { AccountLayer } from './AccountLayer';
import { HeaderSearch } from './HeaderSearch';

export function HeaderBottom() {
	const [isAccountLayerShown, setIsAccountLayerShown] = useState(false);
	const { isAuthenticated, user } = useCurrentApp();
	const isLoggedIn = isAuthenticated;
	const username = user?.name || 'Unknown';

	const {
		data: categoriesData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteCategoriesQuery({
		limit: 10,
	});
	const categories =
		categoriesData?.pages.flatMap((page) => (page.success ? page.data : [])) ?? [];

	useNotificationListener();
	const { data } = useGetNotifications(isAuthenticated);

	const notifications = data?.success ? data.data : [];
	const countNotificationsUnread = notifications.filter(
		(notification) => !notification.isRead,
	).length;

	const [isNotificationOpen, setIsNotificationOpen] = useState(false);

	const accountLayerRef = useRef<HTMLDivElement>(null);
	const notificationRef = useRef<HTMLDivElement | null>(null);

	useClickOutside(accountLayerRef, () => {
		setIsAccountLayerShown(false);
	});

	useClickOutside(notificationRef, () => {
		setIsNotificationOpen(false);
	});

	const handleToggleAccountLayer = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsAccountLayerShown((prev) => !prev);
	};

	const handleToggleNotification = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsNotificationOpen((prev) => !prev);
	};

	const navigate = useNavigate();

	return (
		<div className="flex flex-col sm:flex-row items-center px-4 sm:px-6 py-2 gap-4 sm:gap-0">
			<figure className="flex-shrink-0">
				<Link to="/">
					<img
						src="https://static.chotot.com/storage/APP_WRAPPER/logo/chotot-logo-appwrapper.png"
						alt="Logo Chotot"
						className="h-8 sm:h-9 w-auto"
					/>
				</Link>
				{/* avatarURL={user?.avatar} */}
			</figure>

			{/* Categories */}
			<div className="relative inline-flex items-center gap-2 sm:gap-3 cursor-pointer group w-full sm:w-auto">
				<List className="w-4 h-4 sm:w-5 sm:h-5 group-hover:opacity-70" />
				<span className="text-xs sm:text-sm font-normal group-hover:opacity-70">
					Danh mục
				</span>
				<ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 group-hover:opacity-70" />

				<div className="absolute top-full left-0 min-h-[300px] sm:left-auto w-full sm:w-[250px] md:w-[300px] sm:pt-2 hidden group-hover:flex rounded-sm z-[20]">
					<div className="flex flex-col bg-white rounded-sm shadow-lg w-full">
						<div className="relative inline-flex items-center justify-between bg-white rounded-sm hover:bg-gray-300/70 px-3 sm:px-4 py-2 group/menu">
							<span className="inline-flex items-center gap-2 sm:gap-3">
								<Dog className="w-4 h-4 sm:w-5 sm:h-5" />
								<span className="text-xs sm:text-sm line-clamp-1">Chó</span>
							</span>
							<ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />

							<div className="absolute top-0 sm:left-full w-full sm:w-[250px] md:w-[300px] hidden group-hover/menu:flex rounded-sm z-10">
								<div className="flex flex-col bg-white rounded-sm shadow-lg w-full overflow-y-auto h-[300px]">
									{!isLoading && categories.length === 0 ? (
										<div className="inline-flex items-center justify-between bg-white rounded-sm hover:bg-gray-300/70 px-3 sm:px-4 py-2">
											<span className="inline-flex items-center gap-2 sm:gap-3">
												<span className="text-xs sm:text-sm line-clamp-1">
													Không có danh mục nào
												</span>
											</span>
										</div>
									) : (
										categories.map((category) => (
											<div
												key={category.id}
												className="inline-flex items-center justify-between bg-white rounded-sm hover:bg-gray-300/70 px-3 sm:px-4 py-2"
											>
												<Link
													to={`/search?categoryId=${category.id}`}
													className="inline-flex items-center gap-2 sm:gap-3 w-full"
												>
													<span className="text-xs sm:text-sm line-clamp-1">
														{category.name}
													</span>
												</Link>
											</div>
										))
									)}
									{isLoading ||
										(isFetchingNextPage && (
											<div className="inline-flex items-center justify-center bg-white rounded-sm hover:bg-gray-300/70 px-3 sm:px-4 py-2">
												<Loader className="animate-spin" />
											</div>
										))}
									{hasNextPage && (
										<Button
											variant="ghost"
											className="w-full text-xs sm:text-sm"
											onClick={() => fetchNextPage()}
											disabled={isFetchingNextPage}
										>
											{isFetchingNextPage ? 'Đang tải...' : 'Tải thêm'}
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Search */}
			<HeaderSearch />

			{/* Right-side actions */}
			<div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm flex-wrap justify-center sm:justify-end">
				<div
					className="relative order-4 sm:order-none"
					onClick={handleToggleNotification}
				>
					<div className="relative">
						<Bell className="w-4 h-4 sm:w-5 sm:h-5 hover:opacity-70 cursor-pointer" />
						{countNotificationsUnread > 0 && (
							<span className="absolute rounded-full size-5 flex items-center justify-center -top-2.5 -right-2.5 text-xs bg-app-secondary cursor-pointer text-white">
								{countNotificationsUnread}
							</span>
						)}
					</div>
					{isNotificationOpen && (
						<NotificationDropdown
							notifications={notifications}
							notificationRef={notificationRef}
							onClose={() => setIsNotificationOpen(false)}
						/>
					)}
				</div>
				<MessageSquareText className="order-1 sm:order-none w-4 h-4 sm:w-5 sm:h-5 hover:opacity-70 cursor-pointer" />
				<ShoppingBag className="order-2 sm:order-none w-4 h-4 sm:w-5 sm:h-5 hover:opacity-70 cursor-pointer" />
				<div className="order-3 sm:order-none inline-flex items-center gap-1 sm:gap-2 cursor-pointer group">
					<Newspaper className="w-4 h-4 sm:w-5 sm:h-5 group-hover:opacity-70" />
					<Link to="/manage-post">
						<span className="group-hover:opacity-70 hidden sm:inline cursor-pointer">
							Quản lí tin
						</span>
					</Link>
					<ChevronDown size={14} className="group-hover:opacity-70" />
				</div>
				<div
					onClick={handleToggleAccountLayer}
					className="order-5 sm:order-none relative inline-flex items-center gap-1 sm:gap-2 cursor-pointer group"
				>
					{isLoggedIn ? (
						<Avatar
							isLoggedIn={isLoggedIn}
							username={username}
							avatarURL={user?.avatar}
							size={isLoggedIn ? 28 : 18}
						/>
					) : (
						<CircleUserRound size={18} className="group-hover:opacity-70" />
					)}
					<span className="group-hover:opacity-70 hidden sm:inline">
						{isLoggedIn ? username || 'Unknown' : 'Tài khoản'}
					</span>
					<ChevronDown size={14} className="group-hover:opacity-70" />

					{/* Layer */}
					{isAccountLayerShown && (
						<AccountLayer
							isLoggedIn={isLoggedIn}
							username={username}
							user={user ?? undefined}
							accountLayerRef={accountLayerRef}
						/>
					)}
				</div>
				<Button
					variant="app-secondary"
					className="uppercase order-6 sm:order-none"
					size="lg"
					onClick={() => navigate('/posts')}
				>
					<SquarePen className="w-4 h-4 sm:w-5 sm:h-5" />
					<span className="hidden sm:inline">Đăng tin</span>
				</Button>
			</div>
		</div>
	);
}
