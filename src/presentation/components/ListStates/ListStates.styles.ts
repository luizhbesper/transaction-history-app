import { colors, font, radius, shadow, size, space } from "@presentation/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	wrapper: {
		paddingTop: space.xxl,
		paddingHorizontal: space.xl,
		paddingBottom: space.listBottom,
	},
	card: {
		backgroundColor: colors.surfaceTintBlue,
		borderRadius: radius.stateCard,
		paddingTop: space.xxl,
		paddingHorizontal: 24,
		paddingBottom: 24,
		alignItems: "center",
		gap: space.gapRow,
	},
	icon: {
		width: size.stateIcon,
		height: size.stateIcon,
		borderRadius: size.stateIcon / 2,
		backgroundColor: colors.surface,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		marginTop: space.xs,
		fontSize: font.size.stateTitle,
		fontWeight: font.weight.black,
		letterSpacing: font.letterSpacing.stateTitle,
		color: colors.ink,
	},
	body: {
		maxWidth: 250,
		textAlign: "center",
		fontSize: font.size.bodySm,
		fontWeight: font.weight.medium,
		lineHeight: font.size.bodySm * 1.5,
		color: colors.textSecondary,
	},
	action: {
		marginTop: space.md,
		alignSelf: "stretch",
		alignItems: "center",
		paddingVertical: 13,
		borderRadius: radius.pill,
		backgroundColor: colors.coral,
		boxShadow: shadow.ctaCoral,
	},
	actionLabel: {
		fontSize: font.size.body,
		fontWeight: font.weight.bold,
		color: colors.surface,
	},
	pill: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: colors.surface,
		borderRadius: radius.pill,
		paddingVertical: 6,
		paddingLeft: 10,
		paddingRight: space.md,
	},
	pillLabel: {
		fontSize: font.size.caption,
		fontWeight: font.weight.bold,
		color: colors.textOnCard,
	},
});
