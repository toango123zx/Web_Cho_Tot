import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Connection, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TransactionsRepository } from '../../transactions.repository';
import { TransactionStatusEnum, TransactionTargetEnum } from '@prisma/client';
import { DepositTransactionCommand } from '../implements';
import axios from 'axios';

const SOL_RECEIVE_ADDRESS = process.env.SOL_RECEIVE_ADDRESS;
if (!SOL_RECEIVE_ADDRESS) {
	throw new Error('SOL_RECEIVE_ADDRESS environment variable is not configured');
}
const RPC_ENDPOINT = process.env.SOL_RPC_ENDPOINT || 'https://api.devnet.solana.com';
const DONGTOT_USD_RATE = 0.1;

@CommandHandler(DepositTransactionCommand)
export class DepositTransactionHandler
	implements ICommandHandler<DepositTransactionCommand>
{
	private connection: Connection;
	// private readonly logger = new Logger(DepositTransactionHandler.name);

	constructor(private readonly repo: TransactionsRepository) {
		this.connection = new Connection(RPC_ENDPOINT, 'confirmed');
	}
	private async getSolPriceUsd(): Promise<number> {
		const url =
			'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';
		const { data } = await axios.get(url);
		const price = data?.solana?.usd;
		if (!price) throw new Error('Unable to retrieve the SOL price from the API');
		return price;
	}
	async execute(command: DepositTransactionCommand) {
		const existingTx = await this.repo.findBySignature(command.signature);
		if (existingTx) {
			throw new BadRequestException('Transaction already processed.');
		}

		const tx = await this.connection.getTransaction(command.signature, {
			commitment: 'confirmed',
			maxSupportedTransactionVersion: 0,
		});
		if (!tx || !tx.meta) {
			throw new BadRequestException('Transaction not found or not confirmed.');
		}

		const accountKeys = tx.transaction.message.getAccountKeys({});

		const transferIx = tx.transaction.message.compiledInstructions.find(
			(ix) =>
				accountKeys.staticAccountKeys[ix.programIdIndex]?.toBase58() ===
				SystemProgram.programId.toBase58(),
		);
		if (!transferIx) {
			throw new BadRequestException('No SOL transfer instruction found.');
		}

		const fromIndex = transferIx.accountKeyIndexes[0];
		const toIndex = transferIx.accountKeyIndexes[1];

		const fromAddress = accountKeys.staticAccountKeys[fromIndex].toBase58();
		const toAddress = accountKeys.staticAccountKeys[toIndex].toBase58();

		if (toAddress !== SOL_RECEIVE_ADDRESS) {
			throw new BadRequestException('Recipient address mismatch.');
		}

		const lamports = tx.meta.postBalances[toIndex] - tx.meta.preBalances[toIndex];
		const solAmount = lamports / LAMPORTS_PER_SOL;

		const solPriceUsd = await this.getSolPriceUsd();
		const dongTotAmount = Math.floor(
			Number(((solAmount * solPriceUsd) / DONGTOT_USD_RATE).toFixed(8)),
		);

		const transaction = await this.repo.createDepositTransaction({
			userId: command.userId,
			amount: dongTotAmount,
			description: `Deposit from SOL`,
			target: TransactionTargetEnum.deposit,
			status: TransactionStatusEnum.completed,
			signature: command.signature,
		});

		return {
			success: true,
			data: {
				transactionId: transaction.id,
				from: fromAddress,
				to: toAddress,
				solAmount,
				solPriceUsd,
				dongTotAmount,
				status: transaction.status,
			},
		};
	}
}
