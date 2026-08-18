import { colors, font, radius, size, space } from "@presentation/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	bar: {
		marginTop: 14,
		height: size.searchBar,
		flexDirection: "row",
		alignItems: "center",
		gap: 9,
		backgroundColor: colors.surface,
		borderRadius: radius.input,
		paddingHorizontal: space.md,
	},
	input: {
		flex: 1,
		padding: 0,
		fontSize: font.size.body,
		fontWeight: font.weight.medium,
		color: colors.ink,
	},
	clear: {
		width: 20,
		height: 20,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.clearButton,
	},
});
