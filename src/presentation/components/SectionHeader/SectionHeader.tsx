import { Text, View } from "react-native";
import { styles } from "./SectionHeader.styles";

export type SectionHeaderProps = {
	/** The day label, already formatted — `TODAY`, `YESTERDAY` or `AUG 12`. */
	label: string;
};

/**
 * The sticky day header separating one group of transactions from the next.
 *
 * @param {SectionHeaderProps} props - The formatted day label.
 * @returns {React.JSX.Element} The header row.
 */
export function SectionHeader({
	label,
}: SectionHeaderProps): React.JSX.Element {
	return (
		<View style={styles.header}>
			<Text style={styles.label}>{label}</Text>
		</View>
	);
}
