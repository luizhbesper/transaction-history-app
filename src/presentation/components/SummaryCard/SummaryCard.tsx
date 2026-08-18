import type { TransactionSummary } from "@domain/transaction";
import { currency } from "@presentation/utils";
import { Text, View } from "react-native";
import { styles } from "./SummaryCard.styles";

export type SummaryCardProps = {
	/** Totals for the transactions currently on screen, or `null` while none are known. */
	summary: TransactionSummary | null;
};

const PLACEHOLDER = "—";

/**
 * Income, expenses and net for whatever the filters currently select.
 *
 * @param {SummaryCardProps} props - The totals to display, or `null` to show placeholders.
 * @returns {React.JSX.Element} The three-column balance card.
 */
export function SummaryCard({ summary }: SummaryCardProps): React.JSX.Element {
	const columns = [
		{
			label: "INCOME",
			style: styles.income,
			value: summary && currency.formatCurrency(summary.income),
		},
		{
			label: "EXPENSES",
			style: styles.expenses,
			value: summary && currency.formatCurrency(summary.expenses),
		},
		{
			label: "NET",
			style: styles.net,
			value: summary && currency.formatSignedCurrency(summary.net),
		},
	];

	return (
		<View style={styles.card}>
			{columns.map((column, index) => (
				<View
					key={column.label}
					style={[styles.column, index > 0 && styles.divided]}
				>
					<Text style={styles.label}>{column.label}</Text>
					<Text style={[styles.value, column.style]}>
						{column.value ?? PLACEHOLDER}
					</Text>
				</View>
			))}
		</View>
	);
}
