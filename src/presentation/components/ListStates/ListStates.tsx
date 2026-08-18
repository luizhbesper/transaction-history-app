import type { TransactionFilters } from "@domain/transaction";
import { colors } from "@presentation/theme";
import { describeFilters } from "@presentation/utils";
import { Search, TriangleAlert, Wallet } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./ListStates.styles";

type StateCardProps = {
	/** Whatever sits above the title: an icon badge, or the active-filters pill. */
	top: ReactNode;
	title: string;
	body: string;
	action?: { label: string; hint: string; onPress: () => void };
};

function StateCard({ top, title, body, action }: StateCardProps) {
	return (
		<View style={styles.wrapper}>
			<View style={styles.card}>
				{top}
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.body}>{body}</Text>
				{action ? (
					<Pressable
						style={styles.action}
						onPress={action.onPress}
						accessibilityRole="button"
						accessibilityLabel={action.hint}
					>
						<Text style={styles.actionLabel}>{action.label}</Text>
					</Pressable>
				) : null}
			</View>
		</View>
	);
}

export type ErrorStateProps = { onRetry: () => void };

/**
 * Shown when the transactions could not be loaded, with the way back.
 *
 * @param {ErrorStateProps} props - The retry handler.
 * @returns {React.JSX.Element} The error card.
 */
export function ErrorState({ onRetry }: ErrorStateProps): React.JSX.Element {
	return (
		<StateCard
			top={
				<View style={styles.icon}>
					<TriangleAlert size={28} color={colors.expense} strokeWidth={2} />
				</View>
			}
			title="Couldn't load transactions"
			body="Check your connection and try again. Nothing was lost."
			action={{
				label: "Retry",
				hint: "Retry loading transactions",
				onPress: onRetry,
			}}
		/>
	);
}

/**
 * Shown when the account has no transactions at all — nothing to filter, nothing to clear.
 *
 * @returns {React.JSX.Element} The empty card.
 */
export function EmptyState(): React.JSX.Element {
	return (
		<StateCard
			top={
				<View style={styles.icon}>
					<Wallet size={28} color="#5C82AC" strokeWidth={2} />
				</View>
			}
			title="No transactions yet"
			body="Once you spend or get paid, everything shows up here."
		/>
	);
}

export type NoMatchesStateProps = {
	filters: TransactionFilters;
	onClearFilters: () => void;
};

/**
 * Shown when transactions exist but none match. Names what was filtered, so the user can
 * see why the list is empty rather than guess.
 *
 * @param {NoMatchesStateProps} props - The active filters and the reset handler.
 * @returns {React.JSX.Element} The no-matches card.
 */
export function NoMatchesState({
	filters,
	onClearFilters,
}: NoMatchesStateProps): React.JSX.Element {
	return (
		<StateCard
			top={
				<View style={styles.pill}>
					<Search size={14} color={colors.textMuted} strokeWidth={2.2} />
					<Text style={styles.pillLabel}>{describeFilters(filters)}</Text>
				</View>
			}
			title="No matches"
			body="No transactions match this search and filter combination."
			action={{
				label: "Clear filters",
				hint: "Clear filters",
				onPress: onClearFilters,
			}}
		/>
	);
}
