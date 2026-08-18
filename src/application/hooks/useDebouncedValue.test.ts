import { act, renderHook } from "@testing-library/react-native";
import { useDebouncedValue } from "./useDebouncedValue";

beforeEach(() => {
	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

describe("useDebouncedValue", () => {
	it("holds the new value back until the delay has passed", async () => {
		// Arrange
		const { result, rerender } = await renderHook(
			({ value }: { value: string }) => useDebouncedValue(value, 300),
			{ initialProps: { value: "" } },
		);

		// Act
		await rerender({ value: "starbucks" });

		// Assert
		expect(result.current[0]).toBe("");
		await act(async () => {
			jest.advanceTimersByTime(300);
		});
		expect(result.current[0]).toBe("starbucks");
	});

	it("drops a pending keystroke when the value is set immediately", async () => {
		// Arrange
		const { result, rerender } = await renderHook(
			({ value }: { value: string }) => useDebouncedValue(value, 300),
			{ initialProps: { value: "star" } },
		);

		// Act: the field is cleared while the "star" keystroke is still in flight
		await rerender({ value: "" });
		await act(async () => {
			result.current[1]("");
		});

		// Assert
		expect(result.current[0]).toBe("");
		await act(async () => {
			jest.advanceTimersByTime(300);
		});
		expect(result.current[0]).toBe("");
	});
});
