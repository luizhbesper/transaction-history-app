import { fetchTransactions, type MockScenario } from "@data/transactionsApi";
import type { Transaction } from "@domain/transaction";
import { useCallback, useEffect, useRef, useState } from "react";

/** Where a load currently stands, from the list's point of view. */
export type Phase = "loading" | "error" | "ready";

type TransactionsState = {
	transactions: Transaction[];
	loadedAt: Date;
	phase: Phase;
	refreshing: boolean;
	/** Reloads while keeping the current list on screen, for pull-to-refresh. */
	refresh: () => void;
	/** Reloads from scratch, back through the loading state, for the error CTA. */
	retry: () => void;
};

/**
 * Loads the transaction history and tracks the states the user actually sees.
 *
 * `loadedAt` is stamped once per load and handed out rather than read from the clock on
 * demand: it is the `now` that filtering and the `TODAY` header measure against, and a
 * fresh `Date` on every render would invalidate every memo downstream.
 *
 * @param {MockScenario} [scenario] - Forces the mock to fail or return nothing, so the
 * error and empty states are reachable in a demo.
 * @returns {TransactionsState} The list, its phase, and the two ways to reload it.
 */
export const useTransactions = (scenario?: MockScenario): TransactionsState => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loadedAt, setLoadedAt] = useState(() => new Date());
	const [phase, setPhase] = useState<Phase>("loading");
	const [refreshing, setRefreshing] = useState(false);
	// Only the newest request may write state: a refresh started while another is still in
	// flight would otherwise resolve out of order.
	const requestId = useRef(0);

	const load = useCallback(
		async (isRefresh: boolean) => {
			const id = ++requestId.current;
			if (isRefresh) setRefreshing(true);
			else setPhase("loading");

			try {
				const result = await fetchTransactions(scenario);
				if (id !== requestId.current) return;
				setTransactions(result);
				setLoadedAt(new Date());
				setPhase("ready");
			} catch {
				if (id !== requestId.current) return;
				setPhase("error");
			} finally {
				if (id === requestId.current && isRefresh) setRefreshing(false);
			}
		},
		[scenario],
	);

	useEffect(() => {
		load(false);
		// Drops any in-flight response on unmount.
		return () => {
			requestId.current++;
		};
	}, [load]);

	const refresh = useCallback(() => {
		load(true);
	}, [load]);

	const retry = useCallback(() => {
		load(false);
	}, [load]);

	return { transactions, loadedAt, phase, refreshing, refresh, retry };
};
