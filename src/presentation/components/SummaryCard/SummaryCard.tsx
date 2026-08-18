import type { TransactionSummary, TypeFilter } from "@domain/transaction";
import { currency } from "@presentation/utils";
import { Pressable, Text, View } from "react-native";
import { styles } from "./SummaryCard.styles";

export type SummaryCardProps = {
	/** Totals for the transactions currently on screen, or `null` while none are known. */
	summary: TransactionSummary | null;
	/** Applies the type filter behind the tapped column. */
	onSelectType: (type: TypeFilter) => void;
};

const PLACEHOLDER = "—";

/**
 * Income, expenses and net for whatever the filters currently select. Tapping the income
 * or expenses column filters the list down to that type.
 *
 * @param {SummaryCardProps} props - The totals to display and the type filter setter.
 * @returns {React.JSX.Element} The three-column balance card.
 */
export function SummaryCard({
	summary,
	onSelectType,
}: SummaryCardProps): React.JSX.Element {
	const columns = [
		{
			label: "INCOME",
			type: "income" as const,
			style: styles.income,
			value: summary && currency.formatCurrency(summary.income),
		},
		{
			label: "EXPENSES",
			type: "expense" as const,
			style: styles.expenses,
			value: summary && currency.formatCurrency(summary.expenses),
		},
		{
			label: "NET",
			type: null,
			style: styles.net,
			value: summary && currency.formatSignedCurrency(summary.net),
		},
	];

	return (
		<View style={styles.card}>
			{columns.map((column, index) => {
				const Column = column.type === null ? View : Pressable;
				return (
					<Column
						key={column.label}
						style={[styles.column, index > 0 && styles.divided]}
						onPress={
							column.type === null ? undefined : () => onSelectType(column.type)
						}
						accessibilityRole={column.type === null ? undefined : "button"}
						accessibilityLabel={
							column.type === null
								? undefined
								: `Show ${column.label.toLowerCase()} only`
						}
					>
						<Text style={styles.label}>{column.label}</Text>
						<Text style={[styles.value, column.style]}>
							{column.value ?? PLACEHOLDER}
						</Text>
					</Column>
				);
			})}
		</View>
	);
}
