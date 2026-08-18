import {
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export function App() {
	const isDarkMode = useColorScheme() === "dark";

	return (
		<SafeAreaProvider>
			<StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
			<View style={style.container}>
				<Text> Hello Transaction App</Text>
			</View>
		</SafeAreaProvider>
	);
}

const style = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center",
	},
});
