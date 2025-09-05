import { Info } from 'lucide-react';
import { GoodCoinIcon } from '@/assets/icons';
import { useTransactionHistory } from '@/services/query/transaction';
import { useState } from 'react';

const SOL_EXPLORER_BASE = 'https://explorer.solana.com/tx/';
// Get cluster from VITE_SOL_RPC_ENDPOINT in .env
function getSolCluster() {
	const endpoint = import.meta.env.VITE_SOL_RPC_ENDPOINT as string;
	if (!endpoint) return 'devnet';
	if (endpoint.includes('mainnet')) return 'mainnet-beta';
	if (endpoint.includes('testnet')) return 'testnet';
	return 'devnet';
}
const SOL_CLUSTER = getSolCluster();

export default function TransactionHistory() {
	// Pagination state
	const [page, setPage] = useState(1);
	const limit = 10;
	const { data, isLoading, isError } = useTransactionHistory(page, limit);

	return (
		<div className="bg-gray-50 min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-2xl font-semibold text-gray-900 mt-10 mb-6">
					Lịch sử giao dịch
				</h1>

				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
					<Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
					<p className="text-blue-800 text-sm">
						Trong trường hợp đơn hàng đã thanh toán nhưng không xuất hiện trong lịch sử
						giao dịch, vui lòng quay lại trang này sau 5 phút để có kết quả cập nhật mới
						nhất.
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-sm">
					<div className="border-b border-gray-200">
						<div className="px-6 py-4">
							<div className="border-b-2 border-orange-500 inline-block">
								<button className="text-orange-600 font-semibold text-sm pb-2">
									ĐỒNG TỐT
								</button>
							</div>
						</div>
					</div>

					<div className="p-6">
						{isLoading ? (
							<div>Đang tải...</div>
						) : isError ? (
							<div className="text-red-500">Lỗi khi tải dữ liệu.</div>
						) : data?.success === false ? (
							<div className="text-red-500">
								{data?.message || 'Lỗi khi tải dữ liệu.'}
							</div>
						) : Array.isArray(data?.data) && data.data.length === 0 ? (
							<div className="text-gray-500">Không có giao dịch nào.</div>
						) : Array.isArray(data?.data) ? (
							<div className="space-y-6">
								{data.data.map((tx: any) => (
									<div
										key={tx.id}
										className="flex items-center justify-between border-b pb-4 last:border-b-0"
									>
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
												<img src={GoodCoinIcon} alt="Đồng Tốt" className="w-8 h-8" />
											</div>
											<div className="space-y-1">
												<h3 className="font-semibold text-gray-900">
													{`Nạp ${tx.amount} ĐT`}
												</h3>
												<div className="text-sm text-gray-600 space-y-0.5">
													<div>
														Thời gian:{' '}
														<span className="font-medium">
															{new Date(tx.createdAt).toLocaleString('vi-VN')}
														</span>
													</div>
													<div>
														<a
															href={`${SOL_EXPLORER_BASE}${tx.signature}?cluster=${SOL_CLUSTER}`}
															target="_blank"
															rel="noopener noreferrer"
															className="text-blue-600 underline text-xs"
														>
															Xem trên Solana Explorer
														</a>
													</div>
												</div>
											</div>
										</div>
										<div className="text-right">
											<div className="text-lg font-semibold text-gray-900 mb-2">
												+{tx.amount} ĐT
											</div>
											<div className="flex items-center gap-2">
												<div
													className={`w-2 h-2 rounded-full ${tx.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'}`}
												></div>
												<span
													className={`text-sm font-medium ${tx.status === 'completed' ? 'text-green-600' : 'text-gray-600'}`}
												>
													{tx.status === 'completed' ? 'Thành công' : tx.status}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-gray-500">Không có dữ liệu.</div>
						)}
					</div>

					{/* Pagination */}
					{data?.success === true &&
						data.pagination &&
						data.pagination.totalPages > 1 && (
							<div className="flex justify-center items-center py-4 gap-2">
								<button
									className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50 cursor-pointer"
									disabled={page === 1}
									onClick={() => setPage(page - 1)}
								>
									Trước
								</button>
								<span className="text-sm">
									Trang {page} / {data.pagination.totalPages}
								</span>
								<button
									className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50 cursor-pointer"
									disabled={page === data.pagination.totalPages}
									onClick={() => setPage(page + 1)}
								>
									Sau
								</button>
							</div>
						)}
				</div>
			</div>
		</div>
	);
}
