import type { Transaction } from "@domain/transaction";
import { categoryColorsFor } from "@presentation/theme";
import { currency, dates, maskTransactionId } from "@presentation/utils";
import { Pressable, Text, View } from "react-native";
import { BottomSheetUtil } from "../BottomSheet";
import { styles } from "./TransactionDetailSheet.styles";

export type TransactionDetailSheetProps = {
	transaction: Transaction;
	/** The transaction's date, parsed once by the list. */
	date: Date;
};

/**
 * The contents of the transaction detail sheet: the amount, and the four facts behind it.
 *
 * @param {TransactionDetailSheetProps} props - The transaction and its parsed date.
 * @returns {React.JSX.Element} The sheet body.
 */
export function TransactionDetailSheet({
	transaction,
	date,
}: TransactionDetailSheetProps): React.JSX.Element {
	const isIncome = transaction.type === "income";
	const palette = categoryColorsFor(transaction.category);

	return (
		<View>
			<View style={styles.head}>
				<View style={[styles.avatar, { backgroundColor: palette.bg }]}>
					<Text style={[styles.initial, { color: palette.fg }]}>
						{transaction.merchant.charAt(0)}
					</Text>
				</View>
				<Text
					style={[styles.amount, isIncome ? styles.income : styles.expense]}
				>
					{currency.formatSignedCurrency(transaction.amount)}
				</Text>
				<Text style={styles.merchant}>{transaction.merchant}</Text>
			</View>

			<View style={styles.card}>
				<View style={styles.detail}>
					<Text style={styles.label}>Category</Text>
					<Text style={styles.value}>{transaction.category}</Text>
				</View>
				<View style={styles.detail}>
					<Text style={styles.label}>Date</Text>
					<Text style={styles.value}>{dates.formatFullDate(date)}</Text>
				</View>
				<View style={styles.detail}>
					<Text style={styles.label}>Status</Text>
					<Text style={styles.status}>Completed</Text>
				</View>
				<View style={[styles.detail, styles.detailLast]}>
					<Text style={styles.label}>Transaction ID</Text>
					<Text style={styles.transactionId}>
						{maskTransactionId(transaction.id)}
					</Text>
				</View>
			</View>

			<Pressable
				style={styles.done}
				onPress={BottomSheetUtil.hide}
				accessibilityRole="button"
				accessibilityLabel="Close transaction details"
			>
				<Text style={styles.doneLabel}>Done</Text>
			</Pressable>
		</View>
	);
}
