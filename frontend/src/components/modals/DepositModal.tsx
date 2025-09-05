import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { SolanaIcon } from '@/assets/icons/solana-icon';
import { GoodCoinIcon } from '@/assets/icons';
import { fetchSolPrice as fetchSolPriceApi } from '@/services/api/transaction';
import { useDepositTransaction } from '@/services/query/transaction';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
	Dialog as PhantomDialog,
	DialogContent as PhantomDialogContent,
} from '@/components/ui/dialog';
import { PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { QUERY_KEY } from '@/config/key';

interface DepositModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
	const [selectedCurrency, setSelectedCurrency] = useState<'sol' | 'dongTot'>('sol');
	const [dongTotAmount, setDongTotAmount] = useState('100');
	const [solAmount, setSolAmount] = useState('0.067');
	const [usdAmount, setUsdAmount] = useState('10');
	const [inputMode, setInputMode] = useState<'sol' | 'usd'>('usd'); // Toggle between SOL/USD input
	const [solPrice, setSolPrice] = useState<number>(150); // Real SOL price from CoinGecko
	const [isLoadingPrice, setIsLoadingPrice] = useState(false);
	const [isPaying, setIsPaying] = useState(false);
	const [isAirdropping, setIsAirdropping] = useState(false);

	// SOL airdrop function for users on devnet (5 SOL)
	const handleAirdrop = async () => {
		if (!publicKey) {
			toast.error('Bạn cần kết nối ví trước!');
			return;
		}
		if (isAirdropping) return;
		setIsAirdropping(true);
		try {
			const sig = await connection.requestAirdrop(publicKey, 5 * LAMPORTS_PER_SOL);
			const latest = await connection.getLatestBlockhash();
			await connection.confirmTransaction({ signature: sig, ...latest }, 'confirmed');
			toast.success('Nhận 5 SOL devnet thành công!');
		} catch (e: any) {
			toast.error('Airdrop thất bại: ' + (e?.message || e));
		} finally {
			setIsAirdropping(false);
		}
	};

	const fetchSolPrice = async () => {
		setIsLoadingPrice(true);
		try {
			const data = await fetchSolPriceApi();
			setSolPrice(data.solana.usd);
		} catch (error) {
			console.error('Failed to fetch SOL price:', error);
		} finally {
			setIsLoadingPrice(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			fetchSolPrice();
		}
	}, [isOpen]);

	let dongTotReceived: number, solNeeded: number, usdValue: number;

	if (selectedCurrency === 'dongTot') {
		// User inputs ĐT amount, calculate SOL needed
		const dongTotAmountNum = Number.parseInt(dongTotAmount) || 0;
		dongTotReceived = dongTotAmountNum;
		usdValue = dongTotAmountNum * 0.1;
		solNeeded = usdValue / solPrice;
	} else {
		// User inputs SOL or USD amount, calculate ĐT received
		if (inputMode === 'usd') {
			const usdAmountNum = Number.parseFloat(usdAmount) || 0;
			usdValue = usdAmountNum;
			solNeeded = usdAmountNum / solPrice;
			dongTotReceived = Math.floor(Number((usdAmountNum / 0.1).toFixed(8)));
		} else {
			const solAmountNum = Number.parseFloat(solAmount) || 0;
			solNeeded = solAmountNum;
			usdValue = solAmountNum * solPrice;
			dongTotReceived = Math.floor(
				Number((Number(usdValue.toFixed(2)) / 0.1).toFixed(8)),
			);
		}
	}

	const quickAmounts =
		selectedCurrency === 'dongTot'
			? [25, 50, 100, 500]
			: inputMode === 'usd'
				? [2.5, 5, 10, 50]
				: [0.017, 0.033, 0.067, 0.333];

	const handleQuickAmount = (amount: number) => {
		if (selectedCurrency === 'dongTot') {
			setDongTotAmount(amount.toString());
		} else if (inputMode === 'usd') {
			setUsdAmount(amount.toString());
		} else {
			setSolAmount(amount.toString());
		}
	};

	const getCurrentInputValue = () => {
		if (selectedCurrency === 'dongTot') return dongTotAmount;
		return inputMode === 'usd' ? usdAmount : solAmount;
	};

	const getCurrentInputUnit = () => {
		if (selectedCurrency === 'dongTot') return 'ĐT';
		return inputMode === 'usd' ? 'USD' : 'SOL';
	};

	const [showPhantomModal, setShowPhantomModal] = useState(false);

	// Close deposit dialog when opening Phantom modal
	useEffect(() => {
		if (showPhantomModal) {
			onClose();
		}
	}, [showPhantomModal]);

	useEffect(() => {
		const observer = new MutationObserver(() => {
			const walletModal = document.querySelector('.wallet-adapter-modal-wrapper');
			if (walletModal && showPhantomModal) {
				setShowPhantomModal(false);
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, [showPhantomModal]);

	// Phantom Wallet hooks
	const { publicKey, sendTransaction, connected } = useWallet();
	const { connection } = useConnection();

	// Track wallet connection state to show success toast exactly once upon connection
	const prevConnectedRef = useRef<boolean>(connected);
	useEffect(() => {
		if (!prevConnectedRef.current && connected) {
			toast.success('Kết nối ví thành công!');
		}
		prevConnectedRef.current = connected;
	}, [connected]);

	const queryClient = useQueryClient();
	const depositMutation = useDepositTransaction();

	const SOL_RECEIVE_ADDRESS =
		import.meta.env.VITE_SOL_RECEIVE_ADDRESS || 'YourSolanaWalletAddress';

	const handlePayment = async () => {
		if (!connected || !publicKey) {
			setShowPhantomModal(true);
			return;
		}
		if (isPaying) return;

		const MIN_USD = 1;
		const MIN_DONG_TOT = 10;
		const isBelowMin =
			(selectedCurrency === 'dongTot' && dongTotReceived < MIN_DONG_TOT) ||
			(selectedCurrency === 'sol' && usdValue < MIN_USD);

		if (isBelowMin) {
			toast.error('Giao dịch tối thiểu là 1 USD hoặc 10 Đồng Tốt.');
			return;
		}

		try {
			setIsPaying(true);

			const balance = await connection.getBalance(publicKey);
			const lamports = Math.round(Number(solNeeded) * LAMPORTS_PER_SOL);

			console.log('SOL balance:', balance / LAMPORTS_PER_SOL);

			const recipient = new PublicKey(SOL_RECEIVE_ADDRESS);
			const latestBlockhash = await connection.getLatestBlockhash();

			const transaction = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: publicKey,
					toPubkey: recipient,
					lamports,
				}),
			);

			transaction.feePayer = publicKey;
			transaction.recentBlockhash = latestBlockhash.blockhash;

			const { value: feeEstimate } = await connection.getFeeForMessage(
				transaction.compileMessage(),
			);

			if (feeEstimate === null) {
				toast.error('Không thể ước lượng phí mạng. Vui lòng thử lại sau.');
				setIsPaying(false);
				return;
			}
			console.log('Fee estimate:', feeEstimate / LAMPORTS_PER_SOL);

			if (balance < lamports + feeEstimate) {
				toast.error('Số dư SOL không đủ. Vui lòng nạp thêm SOL.');
				return;
			}

			const signature = await sendTransaction(transaction, connection);
			toast.success('Đã gửi giao dịch! Đang xác nhận...');

			await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

			toast.success('Giao dịch xác nhận thành công!');

			const res = await depositMutation.mutateAsync({ signature });

			if (res?.success) {
				queryClient.invalidateQueries({ queryKey: QUERY_KEY.getUserTotalBalance() });
				queryClient.invalidateQueries({
					queryKey: QUERY_KEY.getTransactionHistory(1, 1),
				});

				toast.success('Nạp Đồng Tốt thành công!');
				onClose();
			} else {
				toast.error(res?.message || 'Nạp thất bại');
			}
		} catch (e: any) {
			const msg = e?.message?.toLowerCase?.() || '';
			const code = e?.code;
			if (code === 4001 || msg.includes('reject') || msg.includes('denied')) {
				toast.info('Bạn đã hủy giao dịch.');
			} else {
				toast.error('Có lỗi xảy ra: ' + (e?.message || e));
			}
		} finally {
			setIsPaying(false);
		}
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-md mx-auto bg-white rounded-2xl p-0 overflow-hidden max-h-screen">
					{/* Header */}
					<DialogHeader className="p-6 pb-4 border-b border-gray-100">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-900">Quy đổi giá trị nạp</h2>
						</div>
					</DialogHeader>

					<div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
						{/* Currency Selection */}
						<div className="flex gap-3">
							<button
								onClick={() => setSelectedCurrency('sol')}
								className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors cursor-pointer ${
									selectedCurrency === 'sol'
										? 'border-green-500 bg-green-50'
										: 'border-gray-200 bg-white hover:bg-gray-50'
								}`}
							>
								<div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-green-400 rounded-full flex items-center justify-center">
									<SolanaIcon className="w-4 h-4 text-white" />
								</div>
								<span className="font-medium text-gray-900">Từ SOL</span>
							</button>

							<button
								onClick={() => setSelectedCurrency('dongTot')}
								className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors cursor-pointer ${
									selectedCurrency === 'dongTot'
										? 'border-green-500 bg-green-50'
										: 'border-gray-200 bg-white hover:bg-gray-50'
								}`}
							>
								<img src={GoodCoinIcon} alt="Good Coin" className="w-8 h-8" />

								<span className="font-medium text-gray-900">Từ Đồng Tốt</span>
							</button>
						</div>

						{/* Input Mode Toggle for SOL tab */}
						{selectedCurrency === 'sol' && (
							<div className="flex gap-2">
								<Button
									variant={inputMode === 'usd' ? 'default' : 'outline'}
									onClick={() => setInputMode('usd')}
									className="flex-1"
								>
									USD
								</Button>
								<Button
									variant={inputMode === 'sol' ? 'default' : 'outline'}
									onClick={() => setInputMode('sol')}
									className="flex-1"
								>
									SOL
								</Button>
							</div>
						)}

						{/* Amount Input */}
						<div className="space-y-3">
							<h3 className="font-medium text-gray-900">
								{selectedCurrency === 'dongTot'
									? 'Nhập số Đồng Tốt bạn muốn mua'
									: `Nhập số ${inputMode === 'usd' ? 'USD' : 'SOL'} bạn muốn nạp`}
							</h3>
							<div className="relative">
								<Input
									type="number"
									min={0}
									step={selectedCurrency === 'dongTot' ? 1 : 'any'}
									value={getCurrentInputValue()}
									onChange={(e) => {
										let raw = e.target.value;
										if (raw.startsWith('-')) return; // ignore negative input
										if (selectedCurrency === 'dongTot') {
											if (raw && !/^\d*$/.test(raw)) return; // only allow integers
											setDongTotAmount(raw);
										} else if (inputMode === 'usd') {
											if (raw && !/^\d*(\.|$)/.test(raw)) return; // allow decimals for USD
											setUsdAmount(raw);
										} else {
											if (raw && !/^\d*(\.|$)/.test(raw)) return; // allow decimals for SOL
											setSolAmount(raw);
										}
									}}
									placeholder={`Nhập số ${getCurrentInputUnit()}`}
									className="text-lg py-3 pr-16"
								/>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
									{getCurrentInputUnit()}
								</span>
							</div>
						</div>

						{/* Quick Amount Buttons */}
						<div className="flex gap-2 overflow-x-auto pb-2">
							{quickAmounts.map((quickAmount) => (
								<Button
									key={quickAmount}
									variant={
										getCurrentInputValue() === quickAmount.toString()
											? 'default'
											: 'outline'
									}
									onClick={() => handleQuickAmount(quickAmount)}
									className={`flex-shrink-0 ${
										getCurrentInputValue() === quickAmount.toString()
											? 'bg-green-500 hover:bg-green-600 text-white'
											: 'border-gray-300 hover:bg-gray-50'
									}`}
								>
									{quickAmount} {getCurrentInputUnit()}
								</Button>
							))}
						</div>

						{/* SOL Price Display */}
						<div className="text-sm text-gray-600 flex items-center gap-2">
							<span>Giá SOL hiện tại:</span>
							{isLoadingPrice ? (
								<span>Đang tải...</span>
							) : (
								<span className="font-semibold">${solPrice.toFixed(2)} USD</span>
							)}
							<Button
								variant="ghost"
								size="sm"
								onClick={fetchSolPrice}
								className="h-6 px-2 text-xs"
								disabled={isLoadingPrice}
							>
								Làm mới
							</Button>
						</div>

						{/* Conversion Info */}
						<div className="space-y-4">
							<h3 className="font-medium text-gray-900">Thông tin nạp tiền</h3>

							{/* Conversion Display */}
							<div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-green-400 rounded-full flex items-center justify-center">
										<SolanaIcon className="w-5 h-5 text-white" />
									</div>
									<div>
										<div className="text-sm text-gray-600">SOL</div>
										<div className="font-semibold text-gray-900">
											{solNeeded.toFixed(5)} SOL
										</div>
									</div>
								</div>

								<ArrowRight className="w-5 h-5 text-gray-400" />

								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full flex items-center justify-center">
										<img src={GoodCoinIcon} alt="Good Coin" className="w-10 h-10" />
									</div>
									<div>
										<div className="text-sm text-gray-600">Đồng Tốt</div>
										<div className="font-semibold text-gray-900">
											{dongTotReceived.toLocaleString()} ĐT
										</div>
									</div>
								</div>
							</div>

							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-600">
										{selectedCurrency === 'dongTot' ? 'Số Đồng Tốt' : 'SOL thanh toán'}
									</span>
									<span className="text-gray-900">
										{selectedCurrency === 'dongTot'
											? `${dongTotReceived.toLocaleString()} ĐT`
											: `${solNeeded.toFixed(5)} SOL`}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Giá trị USD</span>
									<span className="text-gray-900">${usdValue.toFixed(2)}</span>
								</div>
								<div className="border-t border-gray-200 pt-2">
									<div className="flex justify-between font-semibold">
										<span className="text-gray-900">Đồng Tốt nhận được</span>
										<span className="text-green-600">
											{dongTotReceived.toLocaleString()} ĐT
										</span>
									</div>
									<div className="text-xs text-gray-500 mt-1">
										<span className="text-xs font-semibold text-red-600">
											Lưu ý: Số Đồng Tốt nhận được có thể nhỏ hơn 1 do trừ đi phí giao
											dịch.
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* Total and Payment */}
					<div className="p-6 pt-4 border-t border-gray-100 bg-white sticky bottom-0 left-0 w-full z-10">
						<div className="flex justify-between items-center mb-4">
							<span className="text-lg font-semibold text-gray-900">TỔNG TIỀN</span>
							<span className="text-2xl font-bold text-green-600">
								{solNeeded.toFixed(5)} SOL
							</span>
						</div>
						<Button
							className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium disabled:opacity-60"
							onClick={handlePayment}
							disabled={isPaying}
						>
							<CheckCircle className="w-5 h-5 mr-2" />
							{isPaying ? 'Đang xử lý...' : 'Thanh toán'}
						</Button>
						{/* Airdrop button only appears when on devnet and wallet connected */}{' '}
						{connection.rpcEndpoint.includes('devnet') && connected && (
							<Button
								className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 text-base font-medium disabled:opacity-60"
								onClick={handleAirdrop}
								variant="outline"
								disabled={isAirdropping}
							>
								{isAirdropping ? 'Đang airdrop...' : 'Nhận 5 SOL Devnet miễn phí'}
							</Button>
						)}
					</div>
				</DialogContent>
			</Dialog>
			{/* Private Phantom wallet connection modal */}
			<PhantomDialog open={showPhantomModal} onOpenChange={setShowPhantomModal}>
				<PhantomDialogContent className="max-w-xs mx-auto bg-white rounded-2xl p-6 text-center">
					<h3 className="font-semibold text-lg text-green-700 mb-4">
						Kết nối ví Phantom để thanh toán
					</h3>
					<div className="flex justify-center mb-2">
						<WalletMultiButton />
					</div>
					<Button
						className="w-full mt-4"
						variant="outline"
						onClick={() => setShowPhantomModal(false)}
					>
						Đóng
					</Button>
				</PhantomDialogContent>
			</PhantomDialog>
		</>
	);
}
