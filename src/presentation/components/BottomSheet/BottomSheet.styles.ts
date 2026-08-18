import { colors, radius, space } from "@presentation/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	fill: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
	scrim: { backgroundColor: colors.scrim },
	container: { flex: 1, justifyContent: "flex-end" },
	sheet: {
		backgroundColor: colors.surface,
		borderTopLeftRadius: radius.sheet,
		borderTopRightRadius: radius.sheet,
		paddingTop: space.md,
		paddingHorizontal: 22,
		paddingBottom: 30,
		boxShadow: "0px -8px 30px rgba(15,26,45,0.18)",
	},
	grabber: {
		alignSelf: "center",
		width: 38,
		height: 4.5,
		borderRadius: radius.grabber,
		backgroundColor: "#D8E0EA",
		marginBottom: space.lg,
	},
});
