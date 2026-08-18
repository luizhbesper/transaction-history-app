import { colors, font, size, space } from "@presentation/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	header: {
		height: size.sectionHeaderHeight,
		justifyContent: "flex-end",
		paddingHorizontal: space.xl,
		paddingBottom: 7,
		backgroundColor: colors.surface,
	},
	label: {
		fontSize: font.size.sectionHeader,
		fontWeight: font.weight.black,
		letterSpacing: font.letterSpacing.sectionHeader,
		color: colors.textMuted,
	},
});
