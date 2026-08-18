import { useTransactionFilters, useTransactions } from "@application/hooks";
import type { MockScenario } from "@data/transactionsApi";
import type {
  RangeFilter,
  Transaction,
  TransactionListItem,
} from "@domain/transaction";
import {
  BottomSheetUtil,
  DateRangeSheet,
  EmptyState,
  ErrorState,
  FilterChips,
  NoMatchesState,
  ScreenHeader,
  SearchInput,
  SectionHeader,
  SummaryCard,
  TransactionDetailSheet,
  TransactionItem,
  TransactionListSkeleton,
} from "@presentation/components";
import { colors, size, space } from "@presentation/theme";
import { dates, formatRangeLabel } from "@presentation/utils";
import { useCallback, useMemo, useRef } from "react";
import {
  FlatList,
  type ListRenderItemInfo,
  RefreshControl,
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

/**
 * The transaction history screen: the header block on the brand blue, and the list sheet
 * below it showing whichever of loading, error, empty or the list applies.
 *
 * @returns {React.JSX.Element} The screen.
 */
export function TransactionsScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { transactions, loadedAt, phase, refreshing, refresh, retry } =
    useTransactions(DEMO_SCENARIO);
  const {
    query,
    setQuery,
    clearQuery,
    filters,
    setType,
    setRange,
    clearFilters,
    items,
    summary,
    count,
    isFiltered,
  } = useTransactionFilters(transactions, loadedAt);

  // The range sheet is rendered once, imperatively, so it needs the current value and
  // setter without re-opening itself on every render.
  const latest = useRef({ range: filters.range, setRange });
  latest.current = { range: filters.range, setRange };

  const isReady = phase === "ready";

  // Rows and headers have fixed, different heights: pre-computing the running offsets is
  // what lets `getItemLayout` skip measuring, and gives the sticky headers their indices.
  const layout = useMemo(() => {
    const offsets: number[] = [];
    const heights: number[] = [];
    const stickyHeaderIndices: number[] = [];
    let offset = 0;

    items.forEach((item, index) => {
      const height =
        item.kind === "header" ? size.sectionHeaderHeight : size.rowHeight;
      if (item.kind === "header") stickyHeaderIndices.push(index);
      offsets.push(offset);
      heights.push(height);
      offset += height;
    });

    return { offsets, heights, stickyHeaderIndices };
  }, [items]);

  const openDetail = useCallback((transaction: Transaction, date: Date) => {
    BottomSheetUtil.show(
      <TransactionDetailSheet transaction={transaction} date={date} />,
    );
  }, []);

  const openRangePicker = useCallback(() => {
    BottomSheetUtil.show(
      <DateRangeSheet
        value={latest.current.range}
        onChange={(range: RangeFilter) => latest.current.setRange(range)}
      />,
    );
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TransactionListItem>) =>
      item.kind === "header" ? (
        <SectionHeader label={dates.formatDayLabel(item.day, loadedAt)} />
      ) : (
        <TransactionItem
          transaction={item.transaction}
          date={item.date}
          onPress={openDetail}
        />
      ),
    [loadedAt, openDetail],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<TransactionListItem> | null | undefined, index: number) => ({
      length: layout.heights[index] ?? size.rowHeight,
      offset: layout.offsets[index] ?? 0,
      index,
    }),
    [layout],
  );

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(space.screenTop, insets.top + space.sm) },
        ]}
      >
        <ScreenHeader
          rangeLabel={formatRangeLabel(filters.range)}
          onPressRange={openRangePicker}
        />
        <SummaryCard summary={isReady ? summary : null} />
        <SearchInput
          value={query}
          onChangeText={setQuery}
          onClear={clearQuery}
        />
        <FilterChips
          value={filters.type}
          onChange={setType}
          count={isReady ? count : null}
        />
      </View>

      <View style={styles.sheet}>
        {phase === "loading" ? (
          <TransactionListSkeleton />
        ) : phase === "error" ? (
          <ErrorState onRetry={retry} />
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            getItemLayout={getItemLayout}
            stickyHeaderIndices={layout.stickyHeaderIndices}
            initialNumToRender={12}
            windowSize={7}
            removeClippedSubviews
            keyboardDismissMode="on-drag"
            contentContainerStyle={{
              paddingBottom: space.listBottom + insets.bottom,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={colors.coral}
              />
            }
            ListEmptyComponent={
              isFiltered ? (
                <NoMatchesState
                  filters={filters}
                  onClearFilters={clearFilters}
                />
              ) : (
                <EmptyState />
              )
            }
          />
        )}
      </View>
    </View>
  );
}
