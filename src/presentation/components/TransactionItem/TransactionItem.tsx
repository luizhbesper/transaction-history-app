import type { Transaction } from "@domain/transaction";
import { categoryColorsFor, motion } from "@presentation/theme";
import { currency, dates } from "@presentation/utils";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { styles } from "./TransactionItem.styles";

export type TransactionItemProps = {
	transaction: Transaction;
	/** The transaction's date, parsed once upstream so no `Date` is built while rendering. */
	date: Date;
	onPress: (transaction: Transaction, date: Date) => void;
};

/**
 * One transaction row: who, what category, how much and when.
 *
 * Memoised because the list re-renders on every keystroke while the rows themselves
 * rarely change.
 *
 * @param {TransactionItemProps} props - The transaction, its parsed date and the press handler.
 * @returns {React.JSX.Element} The row.
 */
export const TransactionItem = memo(function TransactionItem({
	transaction,
	date,
	onPress,
}: TransactionItemProps): React.JSX.Element {
	const isIncome = transaction.type === "income";
	const palette = categoryColorsFor(transaction.category);

	return (
		<Animated.View entering={FadeIn.duration(motion.rowFadeIn)}>
			<Pressable
				style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
				onPress={() => onPress(transaction, date)}
				accessibilityRole="button"
				accessibilityLabel={`${transaction.merchant}, ${transaction.category}, ${
					isIncome ? "income" : "expense"
				} ${currency.formatCurrency(transaction.amount)}`}
			>
				<View style={[styles.avatar, { backgroundColor: palette.bg }]}>
					<Text style={[styles.initial, { color: palette.fg }]}>
						{transaction.merchant.charAt(0)}
					</Text>
				</View>
				<View style={styles.main}>
					<Text style={styles.merchant} numberOfLines={1}>
						{transaction.merchant}
					</Text>
					<Text style={styles.category} numberOfLines={1}>
						{transaction.category}
					</Text>
				</View>
				<View style={styles.side}>
					<Text
						style={[styles.amount, isIncome ? styles.income : styles.expense]}
					>
						{currency.formatSignedCurrency(transaction.amount)}
					</Text>
					<Text style={styles.time}>{dates.formatTime(date)}</Text>
				</View>
			</Pressable>
		</Animated.View>
	);
});
