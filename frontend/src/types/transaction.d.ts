interface ITransaction {
	transactionId: string;
	from: string;
	to: string;
	solAmount: number;
	solPriceUsd: number;
	dongTotAmount: number;
	status: string;
}
