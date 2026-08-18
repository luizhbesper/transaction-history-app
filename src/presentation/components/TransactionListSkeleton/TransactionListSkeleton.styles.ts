import { colors, radius, size, space } from "@presentation/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: { paddingTop: 6, paddingHorizontal: space.xl, paddingBottom: 24 },
	headerBar: {
		width: 64,
		height: 11,
		borderRadius: radius.skeletonBar,
		backgroundColor: colors.skeleton.cool,
		marginTop: 14,
		marginBottom: space.md,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: space.gapRow,
		paddingVertical: 11,
	},
	avatar: {
		width: size.avatarRow,
		height: size.avatarRow,
		borderRadius: size.avatarRow / 2,
		backgroundColor: colors.skeleton.base,
	},
	main: { flex: 1, gap: 7 },
	side: { alignItems: "flex-end", gap: 7 },
	barLarge: {
		height: 11,
		borderRadius: radius.skeletonBar,
		backgroundColor: colors.skeleton.base,
	},
	barSmall: {
		height: 9,
		borderRadius: radius.skeletonBar,
		backgroundColor: colors.skeleton.light,
	},
});
