import type {
	RangeFilter,
	Transaction,
	TransactionFilters,
	TransactionListItem,
	TransactionSummary,
	TypeFilter,
} from "@domain/transaction";
import {
	filterTransactions,
	groupByDay,
	hasActiveFilters,
	summarize,
} from "@domain/transaction";
import { useCallback, useMemo, useState } from "react";
import { useDebouncedValue } from "./useDebouncedValue";

const SEARCH_DEBOUNCE_MS = 300;

type TransactionFiltersState = {
	/** What the field shows, updated on every keystroke. */
	query: string;
	setQuery: (query: string) => void;
	/** Clears the field and the pending search at once, with no debounce delay. */
	clearQuery: () => void;
	filters: TransactionFilters;
	setType: (type: TypeFilter) => void;
	setRange: (range: RangeFilter) => void;
	clearFilters: () => void;
	items: TransactionListItem[];
	summary: TransactionSummary;
	/** How many transactions matched, for the `{n} results` count. */
	count: number;
	/** Whether anything is narrowing the list, which tells the two empty states apart. */
	isFiltered: boolean;
};

/**
 * Holds the filter state and derives everything the list renders from it.
 *
 * Filtering, totals and day grouping run in one memo so a keystroke walks the list once,
 * and the summary always describes exactly what is on screen.
 *
 * @param {Transaction[]} transactions - The full history to narrow down.
 * @param {Date} now - The reference time the date range is measured back from.
 * @returns {TransactionFiltersState} The filters, their setters, and the derived list.
 */
export const useTransactionFilters = (
	transactions: Transaction[],
	now: Date,
): TransactionFiltersState => {
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useDebouncedValue(
		query,
		SEARCH_DEBOUNCE_MS,
	);
	const [type, setType] = useState<TypeFilter>("all");
	const [range, setRange] = useState<RangeFilter>("all");

	const filters = useMemo<TransactionFilters>(
		() => ({ query: debouncedQuery, type, range }),
		[debouncedQuery, type, range],
	);

	const derived = useMemo(() => {
		const filtered = filterTransactions(transactions, filters, now);
		return {
			items: groupByDay(filtered),
			summary: summarize(filtered),
			count: filtered.length,
		};
	}, [transactions, filters, now]);

	const clearQuery = useCallback(() => {
		setQuery("");
		setDebouncedQuery("");
	}, [setDebouncedQuery]);

	const clearFilters = useCallback(() => {
		clearQuery();
		setType("all");
		setRange("all");
	}, [clearQuery]);

	return {
		query,
		setQuery,
		clearQuery,
		filters,
		setType,
		setRange,
		clearFilters,
		...derived,
		isFiltered: hasActiveFilters(filters),
	};
};
