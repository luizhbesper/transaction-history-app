import { StyleSheet } from "react-native";

// Deliberately plain: this screen exists to exercise the application layer. The design
// handoff is applied in the next pass, along with the theme tokens.
export const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: "#FFFFFF" },
	header: { padding: 16, gap: 8 },
	title: { fontSize: 24, fontWeight: "800" },
	search: {
		borderWidth: 1,
		borderColor: "#DDD",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	chips: { flexDirection: "row", gap: 8 },
	chip: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: "#EEE",
	},
	chipSelected: { backgroundColor: "#14213D" },
	chipLabel: { fontWeight: "700", color: "#333" },
	chipLabelSelected: { color: "#FFF" },
	summary: { flexDirection: "row", justifyContent: "space-between" },
	sectionHeader: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: "#FFF",
		color: "#8B99AD",
		fontWeight: "800",
	},
	row: { flexDirection: "row", padding: 12, gap: 12 },
	rowMain: { flex: 1 },
	merchant: { fontWeight: "700" },
	category: { color: "#8B99AD" },
	income: { color: "#1E8F5F", fontWeight: "700" },
	expense: { color: "#E14B4B", fontWeight: "700" },
	state: { padding: 32, alignItems: "center", gap: 12 },
	action: {
		backgroundColor: "#F1656B",
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 999,
	},
	actionLabel: { color: "#FFF", fontWeight: "700" },
});
