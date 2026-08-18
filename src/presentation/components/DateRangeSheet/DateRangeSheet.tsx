import type { RangeFilter } from "@domain/transaction";
import { colors } from "@presentation/theme";
import { formatRangeLabel, RANGE_OPTIONS } from "@presentation/utils";
import { Check } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { BottomSheetUtil } from "../BottomSheet";
import { styles } from "./DateRangeSheet.styles";

export type DateRangeSheetProps = {
	value: RangeFilter;
	onChange: (range: RangeFilter) => void;
};

/**
 * The contents of the date range sheet. Picking a range applies it and closes the sheet.
 *
 * @param {DateRangeSheetProps} props - The selected range and its change handler.
 * @returns {React.JSX.Element} The sheet body.
 */
export function DateRangeSheet({
	value,
	onChange,
}: DateRangeSheetProps): React.JSX.Element {
	return (
		<View>
			<Text style={styles.title}>Date range</Text>
			<View style={styles.card}>
				{RANGE_OPTIONS.map((range, index) => {
					const label = formatRangeLabel(range);

					return (
						<Pressable
							key={range}
							style={[
								styles.option,
								index === RANGE_OPTIONS.length - 1 && styles.optionLast,
							]}
							onPress={() => {
								onChange(range);
								BottomSheetUtil.hide();
							}}
							accessibilityRole="button"
							accessibilityState={{ selected: range === value }}
							accessibilityLabel={label}
						>
							<Text style={styles.label}>{label}</Text>
							{range === value ? (
								<Check size={17} color={colors.coral} strokeWidth={2.4} />
							) : null}
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}
