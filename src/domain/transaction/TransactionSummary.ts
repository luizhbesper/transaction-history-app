import type { Transaction } from "./Transaction";

/**
 * Totals for a set of transactions.
 */
export type TransactionSummary = {
	income: number;
	expenses: number; // Positive magnitude, the minus sign is a presentation decision
	net: number;
};

/**
 * Adds up income and expenses. Meant to run on the already filtered list, so the
 * summary reacts to whatever the user is currently looking at.
 *
 * @param {Transaction[]} transactions - The transactions to total up.
 * @returns {TransactionSummary} Income, expenses as a positive magnitude, and the net.
 */
export const summarize = (transactions: Transaction[]): TransactionSummary => {
	let income = 0;
	let expenses = 0;

	for (const transaction of transactions) {
		if (transaction.amount > 0) income += transaction.amount;
		else expenses -= transaction.amount;
	}

	return { income, expenses, net: income - expenses };
};
