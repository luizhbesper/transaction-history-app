import { colors, font, radius, shadow, space } from "@presentation/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	row: {
		marginTop: space.md,
		flexDirection: "row",
		alignItems: "center",
		gap: space.gapChips,
	},
	chip: {
		paddingVertical: 7,
		paddingHorizontal: 15,
		borderRadius: radius.pill,
		boxShadow: shadow.chip,
	},
	chipLabel: {
		fontSize: font.size.caption + 0.5,
		fontWeight: font.weight.bold,
	},
	count: {
		marginLeft: "auto",
		fontSize: font.size.captionSm,
		fontWeight: font.weight.bold,
		color: colors.inkOnBlue,
	},
});
