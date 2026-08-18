import { colors } from "@presentation/theme";
import { Search, X } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";
import { styles } from "./SearchInput.styles";

export type SearchInputProps = {
	value: string;
	onChangeText: (value: string) => void;
	/** Empties the field and cancels the pending debounced search. */
	onClear: () => void;
};

/**
 * The merchant search field, with a clear button once something is typed.
 *
 * @param {SearchInputProps} props - The current text and its change and clear handlers.
 * @returns {React.JSX.Element} The search bar.
 */
export function SearchInput({
	value,
	onChangeText,
	onClear,
}: SearchInputProps): React.JSX.Element {
	return (
		<View style={styles.bar}>
			<Search size={17} color={colors.textMuted} strokeWidth={2} />
			<TextInput
				style={styles.input}
				value={value}
				onChangeText={onChangeText}
				placeholder="Search merchant"
				placeholderTextColor={colors.textMuted}
				autoCorrect={false}
				autoCapitalize="none"
				returnKeyType="search"
				accessibilityLabel="Search by merchant name"
			/>
			{value !== "" ? (
				<Pressable
					style={styles.clear}
					onPress={onClear}
					hitSlop={10}
					accessibilityRole="button"
					accessibilityLabel="Clear search"
				>
					<X size={9} color={colors.surface} strokeWidth={2} />
				</Pressable>
			) : null}
		</View>
	);
}
