import axiosPublic from 'axios';
import axios from '@/services/AxiosCustomize';

export const fetchSolPrice = async () => {
	const response = await axiosPublic.get(
		'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
	);
	return response.data;
};

export const depositTransactionAPI = async (signature: string) => {
	const res = await axios.post('/transactions/deposit', { signature });
	return res.data as IBackendRes<ITransaction>;
};

export async function fetchUserTotalBalance() {
	const res = await axios.get('/transactions/total');
	return res.data;
}

export const getTransactionHistory = async (params: { page: number; limit: number }) => {
	const res = await axios.get('/transactions/history', { params });
	return res.data as IModelPaginate<ITransactionHistory[]>;
};
