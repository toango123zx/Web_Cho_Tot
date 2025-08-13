import { useMutation } from '@tanstack/react-query';
import { depositTransactionAPI } from '../api/transaction';

import { useQuery } from '@tanstack/react-query';
import { fetchUserTotalBalance } from '../api/transaction';
import { QUERY_KEY } from '@/config/key';

export const useDepositTransaction = () => {
	return useMutation({
		mutationFn: ({
			signature,
			solPriceUsd,
		}: {
			signature: string;
			solPriceUsd: number;
		}) => depositTransactionAPI(signature, solPriceUsd),
	});
};

export function useUserTotalBalance() {
	return useQuery({
		queryKey: QUERY_KEY.getUserTotalBalance(),
		queryFn: fetchUserTotalBalance,
	});
}
