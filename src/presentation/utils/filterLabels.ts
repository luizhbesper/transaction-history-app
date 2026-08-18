import type { RangeFilter, TransactionFilters } from "@domain/transaction";

const RANGE_LABELS: Record<RangeFilter, string> = {
	all: "All activity",
	"7": "Last 7 days",
	"30": "Last 30 days",
	"90": "Last 90 days",
};

/** The four date ranges, in the order the picker lists them. */
export const RANGE_OPTIONS: RangeFilter[] = ["all", "7", "30", "90"];

/**
 * Names a date range for the header trigger and the range picker.
 *
 * @param {RangeFilter} range - The range to label.
 * @returns {string} For example `Last 30 days`.
 */
export const formatRangeLabel = (range: RangeFilter): string =>
	RANGE_LABELS[range];

/**
 * Spells out what is currently narrowing the list, so an empty result can say why.
 *
 * @param {TransactionFilters} filters - The filters in effect.
 * @returns {string} The active filters joined by ` · `, for example `starbucks · Expenses`.
 */
export const describeFilters = (filters: TransactionFilters): string => {
	const parts: string[] = [];
	const query = filters.query.trim();

	if (query !== "") parts.push(query);
	if (filters.type !== "all")
		parts.push(filters.type === "income" ? "Income" : "Expenses");
	if (filters.range !== "all") parts.push(RANGE_LABELS[filters.range]);

	return parts.join(" · ");
};

/**
 * Labels the result count under the filters.
 *
 * @param {number} count - How many transactions matched.
 * @returns {string} `1 result` or `{n} results`.
 */
export const formatResultCount = (count: number): string =>
	count === 1 ? "1 result" : `${count} results`;
