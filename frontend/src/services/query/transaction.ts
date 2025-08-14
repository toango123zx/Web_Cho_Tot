import { keepPreviousData, useMutation } from '@tanstack/react-query';
import { depositTransactionAPI, getTransactionHistory } from '../api/transaction';

import { useQuery } from '@tanstack/react-query';
import { fetchUserTotalBalance } from '../api/transaction';
import { QUERY_KEY } from '@/config/key';

export const useDepositTransaction = () => {
	return useMutation({
		mutationFn: ({ signature }: { signature: string }) =>
			depositTransactionAPI(signature),
	});
};

export function useUserTotalBalance() {
	return useQuery({
		queryKey: QUERY_KEY.getUserTotalBalance(),
		queryFn: fetchUserTotalBalance,
	});
}
export const useTransactionHistory = (page: number, limit: number) => {
	return useQuery({
		queryKey: QUERY_KEY.getTransactionHistory(page, limit),
		queryFn: () => getTransactionHistory({ page, limit }),
		placeholderData: keepPreviousData,
	});
};
