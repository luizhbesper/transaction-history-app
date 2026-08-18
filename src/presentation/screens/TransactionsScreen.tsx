import { useTransactionFilters, useTransactions } from "@application/hooks";
import type { MockScenario } from "@data/transactionsApi";
import type {
	Transaction,
	TransactionListItem,
	TypeFilter,
} from "@domain/transaction";
import { currency, dates } from "@presentation/utils";
import { memo, useCallback, useState } from "react";
import {
	FlatList,
	type ListRenderItemInfo,
	Pressable,
	RefreshControl,
	Text,
	TextInput,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./TransactionsScreen.styles";

/**
 * Forces the mock into a state that the happy path never reaches on its own. The error
 * state only ever happens because it is asked for here — flip this to `"error"` or
 * `"empty"` to demo those screens, and back to `undefined` for real data.
 */
const DEMO_SCENARIO: MockScenario | undefined = undefined;

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "income", label: "Income" },
	{ value: "expense", label: "Expenses" },
];

type RowProps = {
	transaction: Transaction;
	date: Date;
	onPress: (transaction: Transaction) => void;
};

const Row = memo(function Row({ transaction, date, onPress }: RowProps) {
	const isIncome = transaction.type === "income";

	return (
		<Pressable
			style={styles.row}
			onPress={() => onPress(transaction)}
			accessibilityRole="button"
			accessibilityLabel={`${transaction.merchant}, ${transaction.category}, ${
				isIncome ? "income" : "expense"
			} ${currency.formatCurrency(transaction.amount)}`}
		>
			<View style={styles.rowMain}>
				<Text style={styles.merchant} numberOfLines={1}>
					{transaction.merchant}
				</Text>
				<Text style={styles.category}>{transaction.category}</Text>
			</View>
			<View>
				<Text style={isIncome ? styles.income : styles.expense}>
					{currency.formatSignedCurrency(transaction.amount)}
				</Text>
				<Text style={styles.category}>{dates.formatTime(date)}</Text>
			</View>
		</Pressable>
	);
});

/**
 * The transaction history screen.
 *
 * @returns {React.JSX.Element} The list, its filters and its loading, error and empty states.
 */
export function TransactionsScreen(): React.JSX.Element {
	const insets = useSafeAreaInsets();
	const { transactions, loadedAt, phase, refreshing, refresh, retry } =
		useTransactions(DEMO_SCENARIO);
	const {
		query,
		setQuery,
		filters,
		setType,
		clearFilters,
		items,
		summary,
		count,
		isFiltered,
	} = useTransactionFilters(transactions, loadedAt);
	const [selected, setSelected] = useState<Transaction | null>(null);

	const renderItem = useCallback(
		({ item }: ListRenderItemInfo<TransactionListItem>) =>
			item.kind === "header" ? (
				<Text style={styles.sectionHeader}>
					{dates.formatDayLabel(item.day, loadedAt)}
				</Text>
			) : (
				<Row
					transaction={item.transaction}
					date={item.date}
					onPress={setSelected}
				/>
			),
		[loadedAt],
	);

	return (
		<View style={[styles.screen, { paddingTop: insets.top }]}>
			<View style={styles.header}>
				<Text style={styles.title}>Transactions</Text>
				<View style={styles.summary}>
					<Text>Income {currency.formatCurrency(summary.income)}</Text>
					<Text>Expenses {currency.formatCurrency(summary.expenses)}</Text>
					<Text>Net {currency.formatSignedCurrency(summary.net)}</Text>
				</View>
				<TextInput
					style={styles.search}
					value={query}
					onChangeText={setQuery}
					placeholder="Search merchant"
					accessibilityLabel="Search by merchant name"
				/>
				<View style={styles.chips}>
					{TYPE_FILTERS.map(({ value, label }) => (
						<Pressable
							key={value}
							style={[
								styles.chip,
								filters.type === value && styles.chipSelected,
							]}
							onPress={() => setType(value)}
							accessibilityRole="button"
							accessibilityLabel={
								value === "all" ? "Show all transactions" : `Show ${value} only`
							}
						>
							<Text
								style={[
									styles.chipLabel,
									filters.type === value && styles.chipLabelSelected,
								]}
							>
								{label}
							</Text>
						</Pressable>
					))}
				</View>
				<Text>{count === 1 ? "1 result" : `${count} results`}</Text>
			</View>

			{phase === "loading" ? (
				<Text style={styles.state}>Loading…</Text>
			) : phase === "error" ? (
				<View style={styles.state}>
					<Text>Couldn't load transactions</Text>
					<Pressable
						style={styles.action}
						onPress={retry}
						accessibilityRole="button"
						accessibilityLabel="Retry loading transactions"
					>
						<Text style={styles.actionLabel}>Retry</Text>
					</Pressable>
				</View>
			) : (
				<FlatList
					data={items}
					renderItem={renderItem}
					keyExtractor={(item) => item.key}
					initialNumToRender={12}
					removeClippedSubviews
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={refresh} />
					}
					ListEmptyComponent={
						<View style={styles.state}>
							<Text>{isFiltered ? "No matches" : "No transactions yet"}</Text>
							{isFiltered ? (
								<Pressable
									style={styles.action}
									onPress={clearFilters}
									accessibilityRole="button"
									accessibilityLabel="Clear filters"
								>
									<Text style={styles.actionLabel}>Clear filters</Text>
								</Pressable>
							) : null}
						</View>
					}
				/>
			)}

			{selected ? (
				<Pressable
					style={styles.state}
					onPress={() => setSelected(null)}
					accessibilityRole="button"
					accessibilityLabel="Close transaction details"
				>
					<Text>
						{selected.merchant} ·{" "}
						{currency.formatSignedCurrency(selected.amount)}
					</Text>
				</Pressable>
			) : null}
		</View>
	);
}
