import type { TypeFilter } from "@domain/transaction";
import { colors, motion } from "@presentation/theme";
import { formatResultCount } from "@presentation/utils";
import { Pressable, View } from "react-native";
import Animated, {
	interpolateColor,
	LinearTransition,
	useAnimatedStyle,
	useDerivedValue,
	withTiming,
} from "react-native-reanimated";
import { styles } from "./FilterChips.styles";

const OPTIONS: { value: TypeFilter; label: string; hint: string }[] = [
	{ value: "all", label: "All", hint: "Show all transactions" },
	{ value: "income", label: "Income", hint: "Show income only" },
	{ value: "expense", label: "Expenses", hint: "Show expenses only" },
];

type ChipProps = {
	label: string;
	hint: string;
	selected: boolean;
	onPress: () => void;
};

function Chip({ label, hint, selected, onPress }: ChipProps) {
	const progress = useDerivedValue(() =>
		withTiming(selected ? 1 : 0, { duration: motion.chipSwap }),
	);

	const chipStyle = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(
			progress.value,
			[0, 1],
			[colors.surface, colors.ink],
		),
	}));

	const labelStyle = useAnimatedStyle(() => ({
		color: interpolateColor(
			progress.value,
			[0, 1],
			[colors.textOnCard, colors.surface],
		),
	}));

	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			accessibilityState={{ selected }}
			accessibilityLabel={hint}
		>
			<Animated.View style={[styles.chip, chipStyle]}>
				<Animated.Text style={[styles.chipLabel, labelStyle]}>
					{label}
				</Animated.Text>
			</Animated.View>
		</Pressable>
	);
}

export type FilterChipsProps = {
	value: TypeFilter;
	onChange: (type: TypeFilter) => void;
	/** How many transactions matched, or `null` while there is nothing to count. */
	count: number | null;
};

/**
 * The type filter — all, income or expenses — and the result count beside it.
 *
 * @param {FilterChipsProps} props - The selected type, its change handler and the count.
 * @returns {React.JSX.Element} The chip row.
 */
export function FilterChips({
	value,
	onChange,
	count,
}: FilterChipsProps): React.JSX.Element {
	return (
		<View style={styles.row}>
			{OPTIONS.map((option) => (
				<Chip
					key={option.value}
					label={option.label}
					hint={option.hint}
					selected={value === option.value}
					onPress={() => onChange(option.value)}
				/>
			))}
			{count === null ? null : (
				<Animated.Text style={styles.count} layout={LinearTransition}>
					{formatResultCount(count)}
				</Animated.Text>
			)}
		</View>
	);
}
