import type { MockScenario } from "@data/transactionsApi";
import { act, renderHook } from "@testing-library/react-native";
import { useTransactions } from "./useTransactions";

beforeEach(() => {
	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

// Comfortably past the mock's simulated network latency.
const LATENCY_MS = 1500;

/** Skips the mock's simulated network latency. */
const settle = () =>
	act(async () => {
		jest.advanceTimersByTime(LATENCY_MS);
	});

describe("useTransactions", () => {
	it("shows the loading state until the transactions arrive", async () => {
		// Arrange & Act
		const { result } = await renderHook(() => useTransactions());
		const initialPhase = result.current.phase;
		await settle();

		// Assert
		expect(initialPhase).toBe("loading");
		expect(result.current.phase).toBe("ready");
		expect(result.current.transactions.length).toBeGreaterThan(0);
	});

	it("recovers from a failed load when the user retries", async () => {
		// Arrange
		const { result, rerender } = await renderHook(
			({ scenario }: { scenario: MockScenario | undefined }) =>
				useTransactions(scenario),
			{ initialProps: { scenario: "error" as MockScenario | undefined } },
		);
		await settle();
		expect(result.current.phase).toBe("error");

		// Act: the next attempt succeeds
		await rerender({ scenario: undefined });
		await act(async () => {
			result.current.retry();
		});
		await settle();

		// Assert
		expect(result.current.phase).toBe("ready");
		expect(result.current.transactions.length).toBeGreaterThan(0);
	});
});
