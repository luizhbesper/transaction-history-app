import { colors, font, size, space } from "@presentation/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	title: {
		fontSize: font.size.title,
		fontWeight: font.weight.black,
		letterSpacing: font.letterSpacing.title,
		lineHeight: font.size.title * 1.1,
		color: colors.ink,
	},
	range: {
		marginTop: space.xs,
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
	},
	rangeLabel: {
		fontSize: font.size.bodySm,
		fontWeight: font.weight.semibold,
		color: colors.inkOnBlue,
	},
	avatar: {
		width: size.avatarHeader,
		height: size.avatarHeader,
		borderRadius: size.avatarHeader / 2,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.avatarOnBlue,
	},
	initials: {
		fontSize: 14,
		fontWeight: font.weight.bold,
		color: "#4E6C93",
	},
});
