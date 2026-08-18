import { colors } from "@presentation/theme";
import { ChevronDown } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { styles } from "./ScreenHeader.styles";

export type ScreenHeaderProps = {
	/** The active date range, already labelled — for example `Last 30 days`. */
	rangeLabel: string;
	onPressRange: () => void;
};

/**
 * The screen title, the date-range trigger under it and the account avatar.
 *
 * @param {ScreenHeaderProps} props - The range label and the handler opening its picker.
 * @returns {React.JSX.Element} The header row.
 */
export function ScreenHeader({
	rangeLabel,
	onPressRange,
}: ScreenHeaderProps): React.JSX.Element {
	return (
		<View style={styles.row}>
			<View>
				<Text style={styles.title}>Transactions</Text>
				<Pressable
					style={styles.range}
					onPress={onPressRange}
					accessibilityRole="button"
					accessibilityLabel="Change date range"
				>
					<Text style={styles.rangeLabel}>{rangeLabel}</Text>
					<ChevronDown size={11} color={colors.inkOnBlue} strokeWidth={2} />
				</Pressable>
			</View>
			<View style={styles.avatar}>
				<Text style={styles.initials}>AR</Text>
			</View>
		</View>
	);
}
