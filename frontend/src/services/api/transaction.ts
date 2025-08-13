import axiosPublic from 'axios';
import axios from '@/services/AxiosCustomize';

export const fetchSolPrice = async () => {
	const response = await axiosPublic.get(
		'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
	);
	return response.data;
};

export const depositTransactionAPI = async (signature: string, solPriceUsd: number) => {
	const res = await axios.post('/transactions/deposit', { signature, solPriceUsd });
	return res.data as IBackendRes<ITransaction>;
};

export async function fetchUserTotalBalance() {
	const res = await axios.get('/transactions/total');
	return res.data;
}
