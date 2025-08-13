import { useMutation } from '@tanstack/react-query';
import { depositTransactionAPI } from '../api/transaction';

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
