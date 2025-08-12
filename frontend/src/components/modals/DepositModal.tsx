import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { SolanaIcon } from '@/assets/icons/solana-icon';
import { GoodCoinIcon } from '@/assets/icons';
import { fetchSolPrice as fetchSolPriceApi } from '@/services/api/transaction';

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

	const fetchSolPrice = async () => {
		setIsLoadingPrice(true);
		try {
			const data = await fetchSolPriceApi();
			console.log('Fetched SOL price:', data);
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
		const dongTotAmountNum = Number.parseFloat(dongTotAmount) || 0;
		dongTotReceived = dongTotAmountNum;
		usdValue = dongTotAmountNum * 0.1;
		solNeeded = usdValue / solPrice;
	} else {
		// User inputs SOL or USD amount, calculate ĐT received
		if (inputMode === 'usd') {
			const usdAmountNum = Number.parseFloat(usdAmount) || 0;
			usdValue = usdAmountNum;
			solNeeded = usdAmountNum / solPrice;
			dongTotReceived = usdAmountNum / 0.1;
		} else {
			const solAmountNum = Number.parseFloat(solAmount) || 0;
			solNeeded = solAmountNum;
			usdValue = solAmountNum * solPrice;
			dongTotReceived = usdValue / 0.1;
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

	return (
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
								value={getCurrentInputValue()}
								onChange={(e) => {
									if (selectedCurrency === 'dongTot') {
										setDongTotAmount(e.target.value);
									} else if (inputMode === 'usd') {
										setUsdAmount(e.target.value);
									} else {
										setSolAmount(e.target.value);
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
										{solNeeded.toFixed(4)} SOL
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
										: `${solNeeded.toFixed(4)} SOL`}
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
							</div>
						</div>
					</div>
				</div>
				{/* Total and Payment */}
				<div className="p-6 pt-4 border-t border-gray-100 bg-white sticky bottom-0 left-0 w-full z-10">
					<div className="flex justify-between items-center mb-4">
						<span className="text-lg font-semibold text-gray-900">TỔNG TIỀN</span>
						<span className="text-2xl font-bold text-green-600">
							{solNeeded.toFixed(4)} SOL
						</span>
					</div>
					<Button
						className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
						onClick={() => {
							// Handle payment logic here
							console.log('Processing payment:', {
								mode: selectedCurrency,
								inputMode: selectedCurrency === 'sol' ? inputMode : 'dongTot',
								dongTotReceived,
								solNeeded,
								usdValue,
								solPrice,
							});
							onClose();
						}}
					>
						<CheckCircle className="w-5 h-5 mr-2" />
						Thanh toán
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
