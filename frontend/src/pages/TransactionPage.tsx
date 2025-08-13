import { useState } from 'react';
import { useUserTotalBalance } from '@/services/query/transaction';
import { GoodCoinIcon, OderHistoryIcon, TransactionIcon } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DepositModal } from '@/components/modals/DepositModal';
import { useCurrentApp } from '@/components/context/AppContext';

const services = [
	{
		icon: GoodCoinIcon,
		title: 'Nạp Đồng Tốt',
		color: 'text-yellow-600 bg-yellow-100',
		isSvg: true,
		action: 'deposit',
	},
	{
		icon: OderHistoryIcon,
		title: 'Lịch sử giao dịch',
		color: 'text-gray-600 bg-gray-100',
		isSvg: true,
	},
];

export default function TransactionsPage() {
	const [openDeposit, setOpenDeposit] = useState(false);
	const { user } = useCurrentApp();
	const { data: totalBalance, isLoading: isLoadingBalance } = useUserTotalBalance();
	const handleServiceClick = (service: any) => {
		if (service.action === 'deposit') {
			setOpenDeposit(true);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Dashboard Header */}
			<div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
				<div className="max-w-7xl mx-auto px-4 lg:px-8">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<p className="text-gray-300 mb-1">Xin chào,</p>
							<h1 className="text-2xl font-bold">{user?.name}</h1>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Column */}
					<div className="lg:col-span-2 space-y-6">
						{/* Service Menu */}
						<Card className="p-6">
							<h2 className="text-lg font-semibold mb-2">Danh mục</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{services.map((service, index) => (
									<button
										key={index}
										className="flex flex-col items-center p-2 rounded-lg transition-colors cursor-pointer"
										onClick={() => handleServiceClick(service)}
									>
										<div className={`p-3 rounded-full ${service.color} mb-2`}>
											{service.isSvg ? (
												<img src={service.icon} alt={service.title} className="h-6 w-6" />
											) : (
												<service.icon />
											)}
										</div>
										<span className="text-sm text-center font-medium text-gray-700">
											{service.title}
										</span>
									</button>
								))}
							</div>
						</Card>

						{/* Account Detail */}
						<Card className="p-6">
							<h2 className="text-lg font-semibold mb-4">Chi tiết tài khoản</h2>
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<div className="bg-yellow-100 rounded-full p-2">
										<img src={GoodCoinIcon} alt="Đồng Tốt" className="h-5 w-5" />
									</div>
									<h2 className="text-lg font-semibold">Tài khoản chính</h2>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-xl font-bold">
										{isLoadingBalance ? '...' : (totalBalance?.balance ?? 0)}
									</span>
									<div className="bg-yellow-100 rounded-full p-1">
										<img src={GoodCoinIcon} alt="Đồng Tốt" className="h-4 w-4" />
									</div>
								</div>
							</div>
						</Card>
					</div>

					{/* Right Column - Transaction History */}
					<div className="lg:col-span-1">
						<Card className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-semibold">Lịch sử giao dịch</h2>
								<Button variant="link" className="text-[#306bd9] underline font-normal">
									Xem tất cả
								</Button>
							</div>

							<div className="space-y-0">
								<div className="flex items-center justify-between p-0 bg-transparent rounded-none">
									<div className="flex items-center gap-2">
										<div className="w-7 h-7 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
											<img src={TransactionIcon} alt="Giao dịch" className="h-5 w-5" />
										</div>
										<div>
											<p className="font-semibold text-sm text-[#222] leading-tight">
												<span className="underline">Nạp : 20.000ĐT</span>
											</p>
											<p className="text-xs text-[#6B7280] mt-0.5">09/07/2025</p>
										</div>
									</div>
									<span className="text-[#00B46E] font-semibold text-base">
										+ 20.000 ĐT
									</span>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>

			{/* Deposit Modal */}
			<DepositModal isOpen={openDeposit} onClose={() => setOpenDeposit(false)} />
		</div>
	);
}
