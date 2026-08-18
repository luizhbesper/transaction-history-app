import type { Transaction, TransactionType } from "./Transaction";

const DAY_MS = 86_400_000;

export type TypeFilter = "all" | TransactionType;

/** Days back from now, or every transaction. */
export type RangeFilter = "all" | "7" | "30" | "90";

/**
 * Everything currently narrowing the transaction list.
 */
export type TransactionFilters = {
	query: string; // Merchant search, matched case-insensitively
	type: TypeFilter;
	range: RangeFilter;
};

/**
 * Applies type, date range and merchant search, newest first.
 *
 * `now` is a parameter rather than an internal `new Date()` so the result is
 * reproducible: the mock data is generated relative to the current time.
 *
 * @param {Transaction[]} transactions - The full history to narrow down.
 * @param {TransactionFilters} filters - Type, date range and merchant search.
 * @param {Date} now - The reference time the date range is measured back from.
 * @returns {Transaction[]} The matching transactions, most recent first.
 */
export const filterTransactions = (
	transactions: Transaction[],
	filters: TransactionFilters,
	now: Date,
): Transaction[] => {
	const query = filters.query.trim().toLowerCase();
	const cutoff =
		filters.range === "all"
			? 0
			: now.getTime() - Number(filters.range) * DAY_MS;

	return transactions
		.filter((transaction) => {
			if (filters.type !== "all" && transaction.type !== filters.type)
				return false;
			if (Date.parse(transaction.date) < cutoff) return false;
			return query === "" || transaction.merchant.toLowerCase().includes(query);
		})
		.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
};

/**
 * Whether anything is narrowing the list. Tells the two empty states apart: nothing to
 * show at all, versus nothing matching the current filters.
 *
 * @param {TransactionFilters} filters - The filters currently applied.
 * @returns {boolean} `true` when at least one filter is active.
 */
export const hasActiveFilters = (filters: TransactionFilters): boolean =>
	filters.query.trim() !== "" ||
	filters.type !== "all" ||
	filters.range !== "all";
