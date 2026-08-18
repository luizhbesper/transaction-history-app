import type { Transaction } from "./Transaction";

/**
 * One entry of the rendered list. Day headers and rows share a single flat array so
 * every entry has a known height, which is what makes `getItemLayout` viable.
 *
 * Headers carry the raw day rather than a label: turning it into `TODAY` or `AUG 12`
 * is formatting, and formatting lives in the presentation layer.
 */
export type TransactionListItem =
	| { kind: "header"; key: string; day: Date }
	| {
			kind: "row";
			key: string;
			transaction: Transaction;
			date: Date; // Parsed once here to keep `new Date()` out of the render path
	  };

/**
 * Builds a stable key identifying the calendar day a date belongs to.
 *
 * @param {Date} date - The date to key.
 * @returns {string} A key unique to that calendar day, in the device's timezone.
 */
const toDayKey = (date: Date): string =>
	`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

/**
 * Flattens a sorted list into day headers followed by their rows.
 *
 * The ISO date is parsed once per transaction and handed down on the item, so no
 * `new Date()` runs while rendering.
 *
 * @param {Transaction[]} transactions - Transactions already sorted newest first.
 * @returns {TransactionListItem[]} Headers and rows in a single flat array.
 */
export const groupByDay = (
	transactions: Transaction[],
): TransactionListItem[] => {
	const items: TransactionListItem[] = [];
	let currentKey = "";

	for (const transaction of transactions) {
		const date = new Date(transaction.date);
		const key = toDayKey(date);

		if (key !== currentKey) {
			currentKey = key;
			items.push({ kind: "header", key, day: date });
		}

		items.push({ kind: "row", key: transaction.id, transaction, date });
	}

	return items;
};
