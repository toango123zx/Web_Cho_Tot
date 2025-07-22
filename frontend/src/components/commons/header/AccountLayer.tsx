import { GoodCoinIcon } from '@/assets/icons';
import { ChevronRight, Pencil, Star } from 'lucide-react';

interface AccountLayerProps {
	accountLayerRef: React.RefObject<HTMLDivElement | null>;
	isLoggedIn: boolean;
	username?: string;
}

export function AccountLayer({
	accountLayerRef,
	isLoggedIn,
	username,
}: AccountLayerProps) {
	const handleLoginClick = () =>
		window.open(
			'/login',
			'_blank',
			'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=420,height=680',
		);

	const handleRegisterClick = () =>
		window.open(
			'/register',
			'_blank',
			'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=420,height=680',
		);

	return (
		<div
			ref={accountLayerRef}
			className="absolute top-[calc(100%+30px)] right-0 w-[300px] bg-white py-2 shadow-xl max-h-[800px] overflow-y-auto"
		>
			<div className="flex gap-3 p-3">
				{isLoggedIn ? (
					<div className="size-12 rounded-full bg-red-400 inline-flex justify-center items-center text-xl font-bold text-white relative">
						{username?.charAt(0).toUpperCase() || 'U'}
						<span className="aspect-square rounded-full bg-[#c1c1c0]">
							<Pencil className="absolute bottom-0 right-0 text-black" size={12} />
						</span>
					</div>
				) : (
					<img
						src="https://static.chotot.com/storage/marketplace/common/png/default_user.png"
						alt="User Avatar"
						className="size-12"
					/>
				)}
				{!isLoggedIn ? (
					<p className="text-lg font-bold inline-flex items-center gap-1">
						<span onClick={handleLoginClick}>Đăng nhập</span> /{' '}
						<span onClick={handleRegisterClick}>Đăng ký</span>
					</p>
				) : (
					<div className="flex flex-col justify-between">
						<span className="font-bold">{username}</span>
						<p className="inline-flex items-center gap-2">
							<span className="font-bold">0.0</span>
							<span className="flex items-center">
								{Array.from({ length: 5 })
									.fill(0)
									.map((_, index) => (
										<Star
											key={index}
											fill="currentColor"
											color="currentColor"
											size={12}
											className="text-[#c1c1c0]"
										/>
									))}
							</span>
							<span className="text-xs text-[#c1c1c0]">Chưa có đánh giá</span>
						</p>

						<hr className="my-3" />

						<div className="flex">
							<p className="text-xs text-gray-500 pr-2 border-r">
								<b className="text-black">0</b> Người theo dõi
							</p>
							<hr />
							<p className="text-xs text-gray-500 pl-2">
								<b className="text-black">0</b> Đang theo dõi
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Deposite good coin button */}
			<div className="px-3">
				<div className="relative bg-[#306bd9] text-white flex items-center justify-between rounded-lg h-10">
					<img
						src="https://static.chotot.com/storage/icons/png/virtual-account-banner-icon.png"
						alt="Coin"
						width={50}
						height={40}
						className="absolute object-cover left-1 bottom-3"
					/>
					<span className="pl-[54px] text-xs font-bold">
						Nạp Đồng Tốt giá trị linh hoạt
					</span>
					<ChevronRight size={15} />
				</div>

				{/* Coin card */}
				{isLoggedIn && (
					<div className="flex gap-2 pt-3">
						<div className="shadow-lg px-3 py-2 rounded-lg flex flex-col flex-1">
							<span>Điểm Tốt</span>
							<span className="inline-flex gap-2 mt-1">
								<img
									src="https://static.chotot.com/storage/icons/svg/good-point.svg"
									alt="Green Star"
									width={16}
									height={16}
								/>
								<span>0</span>
							</span>
						</div>
						<div className="shadow-lg px-3 py-2 rounded-lg flex flex-col flex-1">
							<span>Đồng Tốt</span>
							<span className="inline-flex gap-2 mt-1">
								<img src={GoodCoinIcon} alt="Coin" width={16} height={16} />
								<span>0</span>
							</span>
						</div>
					</div>
				)}
			</div>

			{
				<div className="mt-3">
					<div className="px-3 py-2 font-semibold text-gray-500 bg-gray-200">
						Quản lí đơn hàng
					</div>
					<div className="hover:bg-gray-100 px-3 py-2 flex items-center gap-2">
						<img
							src="https://static.chotot.com/storage/chotot-icons/svg/escrow_buy_orders.svg"
							className="size-5"
							alt="order buy"
						/>
						<span>Đơn mua</span>
					</div>
					<div className="hover:bg-gray-100 px-3 py-2 flex items-center gap-2">
						<img
							src="https://static.chotot.com/storage/chotot-icons/svg/escrow-orders.svg"
							className="size-5"
							alt="order sell"
						/>
						<span>Đơn bán</span>
					</div>

					<div className="px-3 py-2 font-semibold text-gray-500 bg-gray-200">
						Tiện ích
					</div>
					<div className="hover:bg-gray-100 px-3 py-2 flex items-center gap-2">
						<img
							src="https://static.chotot.com/storage/chotot-icons/svg/menu-saved-ad.svg"
							className="size-5"
							alt="bookmark"
						/>
						<span>Tin đăng đã lưu</span>
					</div>
					<div className="hover:bg-gray-100 px-3 py-2 flex items-center gap-2">
						<img
							src="https://static.chotot.com/storage/chotot-icons/svg/menu-saved-search.svg"
							className="size-5"
							alt="search"
						/>
						<span>Tìm kiếm đã lưu</span>
					</div>
					<div className="hover:bg-gray-100 px-3 py-2 flex items-center gap-2">
						<img
							src="https://static.chotot.com/storage/chotot-icons/svg/menu-rating-management.svg"
							className="size-5"
							alt="review"
						/>
						<span>Đánh giá từ tôi</span>
					</div>

					<div className="px-3 py-2 font-semibold text-gray-500 bg-gray-200">
						Dịch vụ trả phí
					</div>
					<div className="hover:bg-gray-100 px-3 py-2 flex items-center gap-2">
						<img src={GoodCoinIcon} className="size-5" alt="Good coin Icon" />
						<span>Đồng Tốt</span>
					</div>

					<div className="hover:bg-gray-100 px-3 py-2 flex items-center gap-2">
						<img
							src="https://st.chotot.com/storage/chotot-icons/svg/circle-list.svg"
							className="size-5"
							alt="Good coin Icon"
						/>
						<span>Lịch sử giao dịch</span>
					</div>

					<div className="px-3 py-2 font-semibold text-gray-500 bg-gray-200">Khác</div>
					<div className="hover:bg-gray-100 px-3 py-2 flex items-center gap-2">
						<img
							src="https://static.chotot.com/storage/icons/svg/setting.svg"
							className="size-5"
							alt="settings"
						/>
						<span>Cài đặt tài khoản</span>
					</div>

					<div className="hover:bg-gray-100 px-3 py-2 flex items-center gap-2">
						<img
							src="https://static.chotot.com/storage/icons/svg/logout.svg"
							className="size-5"
							alt="settings"
						/>
						<span>Đăng xuất</span>
					</div>
				</div>
			}
		</div>
	);
}
