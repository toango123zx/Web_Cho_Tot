interface ITransaction {
	transactionId: string;
	from: string;
	to: string;
	solAmount: number;
	solPriceUsd: number;
	dongTotAmount: number;
	status: string;
}
type TransactionTargetEnum = 'deposit' | 'usage';

type TransactionStatusEnum = 'pending' | 'completed' | 'cancelled';

interface ITransactionHistory {
	id: string;
	userId: string;
	amount: number;
	description: string;
	target: TransactionTargetEnum;
	createdAt: string;
	status: TransactionStatusEnum;
	signature: string;
}
