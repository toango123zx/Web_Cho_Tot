import axiosPublic from 'axios';
import axios from '@/services/AxiosCustomize';

// Public (no auth) fetch SOL price
export const fetchSolPrice = async () => {
	const response = await axiosPublic.get(
		'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
	);
	return response.data;
};

// Deposit transaction (requires auth cookie)
export const depositTransactionAPI = async (signature: string, solPriceUsd: number) => {
	const res = await axios.post('/transactions/deposit', { signature, solPriceUsd });
	return res.data as IBackendRes<{
		transactionId: string;
		from: string;
		to: string;
		solAmount: number;
		solPriceUsd: number;
		dongTotAmount: number;
		status: string;
	}>;
};
