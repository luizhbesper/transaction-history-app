import { BottomSheetHost } from "@presentation/components";
import { TransactionsScreen } from "@presentation/screens";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export function App() {
	return (
		<SafeAreaProvider>
			<StatusBar barStyle="dark-content" />
			<TransactionsScreen />
			<BottomSheetHost />
		</SafeAreaProvider>
	);
}
