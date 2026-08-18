import type { Transaction } from "@domain/transaction";
import { act, renderHook } from "@testing-library/react-native";
import { useTransactionFilters } from "./useTransactionFilters";

const NOW = new Date("2026-08-17T12:00:00Z");

const TRANSACTIONS: Transaction[] = [
	{
		id: "txn_1",
		merchant: "Blue Bottle Coffee",
		amount: -6.75,
		date: "2026-08-17T08:42:00Z",
		category: "Food & Drink",
		type: "expense",
	},
	{
		id: "txn_2",
		merchant: "Sunfresh Market",
		amount: -54.18,
		date: "2026-08-16T13:05:00Z",
		category: "Groceries",
		type: "expense",
	},
	{
		id: "txn_3",
		merchant: "Acme Payroll",
		amount: 1840,
		date: "2026-08-15T06:30:00Z",
		category: "Income",
		type: "income",
	},
];

/** Types into the search field and waits out the 300 ms debounce. */
const search = async (setQuery: (q: string) => void, query: string) => {
	await act(() => {
		setQuery(query);
	});
	await act(() => {
		jest.advanceTimersByTime(300);
	});
};

beforeEach(() => {
	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

describe("useTransactionFilters", () => {
	it("narrows the list and the summary to the searched merchant", async () => {
		// Arrange
		const { result } = await renderHook(() =>
			useTransactionFilters(TRANSACTIONS, NOW),
		);

		// Act
		await search(result.current.setQuery, "sunfresh");

		// Assert
		expect(result.current.count).toBe(1);
		expect(result.current.summary).toEqual({
			income: 0,
			expenses: 54.18,
			net: -54.18,
		});
	});

	it("reports an empty result as filtered out rather than as no data", async () => {
		// Arrange
		const { result } = await renderHook(() =>
			useTransactionFilters(TRANSACTIONS, NOW),
		);

		// Act
		await act(() => {
			result.current.setType("income");
		});
		await search(result.current.setQuery, "sunfresh");

		// Assert
		expect(result.current.count).toBe(0);
		expect(result.current.isFiltered).toBe(true);
	});

	it("restores the full list when the filters are cleared", async () => {
		// Arrange
		const { result } = await renderHook(() =>
			useTransactionFilters(TRANSACTIONS, NOW),
		);
		await search(result.current.setQuery, "sunfresh");

		// Act
		await act(() => {
			result.current.clearFilters();
		});

		// Assert: no debounce delay before the list comes back
		expect(result.current.count).toBe(3);
		expect(result.current.isFiltered).toBe(false);
	});
});
