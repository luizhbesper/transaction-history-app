import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { type Metrics, SafeAreaProvider } from "react-native-safe-area-context";
import { TransactionsScreen } from "./TransactionsScreen";

// The provider reads its insets from a native measurement that never arrives in Jest.
const METRICS: Metrics = {
	frame: { x: 0, y: 0, width: 402, height: 874 },
	insets: { top: 59, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
	render(
		<SafeAreaProvider initialMetrics={METRICS}>
			<TransactionsScreen />
		</SafeAreaProvider>,
	);

beforeEach(() => {
	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

/** Skips the mock's simulated network latency, and then the search debounce. */
const settle = async (ms = 1500) => {
	await act(async () => {
		jest.advanceTimersByTime(ms);
	});
};

describe("TransactionsScreen", () => {
	it("shows the transactions once they load", async () => {
		// Arrange
		await renderScreen();

		// Act
		await settle();

		// Assert
		expect(screen.getByText("Blue Bottle Coffee")).toBeOnTheScreen();
	});

	it("shows the no-matches state when the search matches nothing", async () => {
		// Arrange
		await renderScreen();
		await settle();

		// Act
		await fireEvent.changeText(
			screen.getByLabelText("Search by merchant name"),
			"zzzz",
		);
		await settle(400);

		// Assert
		expect(screen.getByText("No matches")).toBeOnTheScreen();
	});

	it("brings the transactions back when the filters are cleared", async () => {
		// Arrange
		await renderScreen();
		await settle();
		await fireEvent.changeText(
			screen.getByLabelText("Search by merchant name"),
			"zzzz",
		);
		await settle(400);

		// Act
		await fireEvent.press(screen.getByLabelText("Clear filters"));
		await settle(400);

		// Assert
		expect(screen.getByText("Blue Bottle Coffee")).toBeOnTheScreen();
	});
});
