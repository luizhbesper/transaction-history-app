export type TransactionType = "income" | "expense";

/**
 * A single account movement, as returned by the API.
 */
export type Transaction = {
	id: string;
	amount: number; // Positive for income, negative for expenses
	date: string; // ISO 8601, kept as a string so it survives JSON transport untouched
	merchant: string;
	category: string;
	type: TransactionType;
};
