import { colors, radius, shadow, space } from "@presentation/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: colors.brandBlue },
	header: { paddingHorizontal: space.xl },
	sheet: {
		marginTop: 14,
		flex: 1,
		minHeight: 0,
		backgroundColor: colors.surface,
		borderTopLeftRadius: radius.listSheet,
		borderTopRightRadius: radius.listSheet,
		boxShadow: shadow.listSheet,
		overflow: "hidden",
	},
});
