import { colors, font, radius, space } from "@presentation/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	title: {
		marginBottom: space.md,
		fontSize: font.size.sheetTitle,
		fontWeight: font.weight.black,
		letterSpacing: font.letterSpacing.stateTitle,
		color: colors.ink,
	},
	card: {
		backgroundColor: colors.surfaceTint,
		borderRadius: radius.optionCard,
		paddingHorizontal: space.lg,
	},
	option: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: colors.dividerStrong,
	},
	optionLast: { borderBottomWidth: 0 },
	label: {
		fontSize: font.size.body,
		fontWeight: font.weight.semibold,
		color: colors.ink,
	},
});
