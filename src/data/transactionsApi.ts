import type { Transaction } from "@domain/transaction";
import seeds from "./transactions.json";

const LATENCY_MS = 1100; // Matches `mockLatency` in the design handoff

/**
 * Forces a specific outcome. Exists so the error and empty states are reachable in a
 * demo; it disappears along with this mock once a real API exists.
 */
export type MockScenario = "error" | "empty";

/** One raw entry of `transactions.json`, before its date is materialised. */
type TransactionSeed = (typeof seeds)[number];

/**
 * Suspends for a while, standing in for network latency.
 *
 * @param {number} ms - How long to wait, in milliseconds.
 * @returns {Promise<void>} Resolves once the time has elapsed.
 */
const wait = (ms: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Turns a seed into a transaction, resolving its day offset against a reference time.
 *
 * The dataset stores offsets instead of timestamps so "today" and "yesterday" rows keep
 * working however long the mock lives.
 *
 * @param {TransactionSeed} seed - The raw entry from `transactions.json`.
 * @param {Date} now - The reference time the offset is measured back from.
 * @returns {Transaction} The seed with a real ISO date.
 */
const toTransaction = (seed: TransactionSeed, now: Date): Transaction => {
	const [hour, minute] = seed.at;
	const date = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() - seed.daysAgo,
		hour,
		minute,
	);
	// A same-day seed scheduled later than the current hour would read as a future
	// transaction, so it rolls back a day instead.
	if (date > now) date.setDate(date.getDate() - 1);

	return {
		id: seed.id,
		merchant: seed.merchant,
		amount: seed.amount,
		category: seed.category,
		type: seed.type === "income" ? "income" : "expense",
		date: date.toISOString(),
	};
};

/**
 * Fetches the transaction history from the local mock, with the latency a real request
 * would have.
 *
 * @param {MockScenario} [scenario] - Forces a failure or an empty account. Omit for the
 * happy path.
 * @returns {Promise<Transaction[]>} The transactions, or an empty array.
 * @throws {Error} When `scenario` is `"error"`, so the caller can render the error state.
 */
export const fetchTransactions = async (
	scenario?: MockScenario,
): Promise<Transaction[]> => {
	await wait(LATENCY_MS);

	if (scenario === "error") {
		throw new Error("Failed to load transactions (500)");
	}
	if (scenario === "empty") {
		return [];
	}

	const now = new Date();
	return seeds.map((seed) => toTransaction(seed, now));
};
