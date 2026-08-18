import { colors, font, size, space, tabular } from "@presentation/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	row: {
		height: size.rowHeight,
		flexDirection: "row",
		alignItems: "center",
		gap: space.gapRow,
		paddingHorizontal: space.xl,
	},
	rowPressed: { backgroundColor: colors.rowPressed },
	avatar: {
		width: size.avatarRow,
		height: size.avatarRow,
		borderRadius: size.avatarRow / 2,
		alignItems: "center",
		justifyContent: "center",
	},
	initial: { fontSize: font.size.cta, fontWeight: font.weight.black },
	main: { flex: 1 },
	merchant: {
		fontSize: font.size.body,
		fontWeight: font.weight.bold,
		color: colors.ink,
	},
	category: {
		marginTop: 2,
		fontSize: font.size.caption,
		fontWeight: font.weight.medium,
		color: colors.textMuted,
	},
	side: { alignItems: "flex-end" },
	amount: {
		fontSize: font.size.body,
		fontWeight: font.weight.bold,
		fontVariant: tabular,
	},
	income: { color: colors.income },
	expense: { color: colors.expense },
	time: {
		marginTop: 2,
		fontSize: font.size.time,
		fontWeight: font.weight.medium,
		color: colors.textFaint,
		fontVariant: tabular,
	},
});
