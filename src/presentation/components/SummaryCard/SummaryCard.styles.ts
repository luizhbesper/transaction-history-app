import {
	colors,
	font,
	radius,
	shadow,
	space,
	tabular,
} from "@presentation/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	card: {
		marginTop: space.lg,
		flexDirection: "row",
		backgroundColor: colors.surface,
		borderRadius: radius.summaryCard,
		paddingVertical: space.lg,
		paddingHorizontal: space.sm,
		boxShadow: shadow.summaryCard,
	},
	column: { flex: 1, alignItems: "center" },
	divided: { borderLeftWidth: 1, borderLeftColor: colors.divider },
	label: {
		fontSize: font.size.overline,
		fontWeight: font.weight.bold,
		letterSpacing: font.letterSpacing.overline,
		color: colors.textMuted,
	},
	value: {
		marginTop: space.xs,
		fontSize: font.size.summaryValue,
		fontWeight: font.weight.bold,
		fontVariant: tabular,
	},
	income: { color: colors.income },
	expenses: { color: colors.expense },
	net: { color: colors.ink },
});
