# Transaction History App

A React Native (CLI) transaction history screen for a personal finance app: merchant, amount, date
and category per row, day grouping with sticky headers, an income/expense summary, filtering by
type and date range, debounced merchant search, and explicit loading, error and empty states,
built in TypeScript strict mode with a layered architecture.

<img width="603" height="1311" alt="simulator_screenshot_F9FDD2B2-A462-47E2-BA02-4A5283EAADF8" src="https://github.com/user-attachments/assets/3834183d-47ad-43e8-89cf-f921c4b623fd" />

## Features

| Requirement | Where |
| --- | --- |
| Transaction list (merchant, amount, date, category) | `TransactionItem`, grouped by day via `groupByDay` |
| Filter All / Income / Expenses | `FilterChips` + `useTransactionFilters`; the summary's income and expenses columns are shortcuts to the same filter |
| Debounced merchant search | `SearchInput` + `useDebouncedValue` (300 ms) |
| Loading / error + retry / empty / no-matches states | `TransactionListSkeleton`, `ListStates` |
| Pull-to-refresh | `RefreshControl` spinner plus a skeleton overlay over the list |
| FlatList performance | `keyExtractor`, `getItemLayout`, fixed windowing (details below) |
| Green income / red expenses | design tokens in `presentation/theme` |
| Locale-aware USD currency & dates | `Intl` formatters in `presentation/utils` |
| Accessibility | labels and roles on rows, chips, search and sheets |

Extras: a **date range filter** (All / 7 / 30 / 90 days, which the empty state's "active
filters" pill depends on), **skeleton loading** instead of a spinner, **reanimated** transitions on
chips, list items and bottom sheets, and a **transaction detail** bottom sheet.

## Setup

Requires Node >= 22.11 and the standard [React Native CLI environment](https://reactnative.dev/docs/set-up-your-environment)
(Xcode + CocoaPods for iOS, JDK 17 + Android SDK for Android).

```sh
npm install

# iOS only
bundle install
bundle exec pod install --project-directory=ios
```

## Running

```sh
npm start          # Metro bundler
npm run ios        # build and run on the iOS simulator
npm run android    # build and run on the Android emulator
```

Quality gates: `npm test` · `npm run typecheck` · `npm run lint`.

**Demoing the error/empty states:** the mock never fails on its own. Flip `DEMO_SCENARIO` at the
top of `TransactionsScreen.tsx` to `"error"` or `"empty"`.

## Architecture

Four layers, dependencies flowing one way. `domain` and `data` never import React or React Native;
each layer is reached through its alias (`@domain`, `@data`, `@application`, `@presentation`).

```
presentation  →  application  →  data  →  domain

src/
  domain/transaction/     # pure TS: Transaction, filterTransactions, summarize, groupByDay
  data/                   # transactions.json (50 rows) + transactionsApi.ts (async, ~1.1 s latency)
  application/hooks/      # useTransactions, useTransactionFilters, useDebouncedValue
  presentation/
    theme/                # color, spacing, radius, type tokens
    utils/                # Intl currency/date formatters (module-level singletons)
    components/           # SummaryCard, FilterChips, SearchInput, TransactionItem, sheets, states
    screens/              # TransactionsScreen + sibling .styles.ts
```

**Why this architecture?** It was designed to scale without rework and to stay easy to read: each
layer answers one question (what the data is, where it comes from, what state it is in, how it
looks), so a new feature has an obvious home and a reviewer knows where to look. The strict
one-way dependency rule also gives AI agents good grip on the codebase: the boundaries are
mechanical enough to be stated in `CLAUDE.md` and followed reliably, and pure functions in
`domain` plus hooks in `application` are testable without rendering anything. Swapping the mock
for a real API touches exactly one file.

### Key decisions

**A local JSON mock with a simulated API instead of MSW.** MSW v2 expects browser APIs that
Hermes on RN 0.86 does not provide, and after a few rounds of polyfills it still failed at
runtime. Rather than keep patching the platform to satisfy a mock, I took the simple path that
delivers the same value: `transactionsApi.ts` serves `transactions.json` behind an async call with
~1.1 s latency, an injectable failure and an empty scenario, so every UI state is still real and
reachable. `fetchTransactions(scenario?): Promise<Transaction[]>` is the only thing the app knows,
so pointing it at a real API (or reinstating MSW) touches that one file.

**Mock dates are relative offsets, not timestamps.** Rows store `daysAgo` plus a time of day, and
the API materialises ISO dates against "now" on each request. Hardcoded dates would mean no row is
ever "Today" from tomorrow onwards, and the 7-day filter would slowly empty. The 50 rows are
spread deliberately, dense in the last week with a tail reaching ~75 days, so every range filter
returns a different set (27 / 40 / 50 / 50).

**A flat list instead of `SectionList`.** `groupByDay` returns one array of
`{ kind: "header" } | { kind: "row" }` entries. Rows and headers have fixed heights from the
design tokens, so the screen pre-computes running offsets once, which is what makes
`getItemLayout` exact and gives `stickyHeaderIndices` for free. `SectionList` would have made both
harder.

**A "now" that only moves when the data does.** `useTransactions` stamps `loadedAt` when a load
resolves; filtering and the `TODAY`/`YESTERDAY` headers derive from it. Calling `new Date()` in
render would bust the memoized derivation on every keystroke and let day labels drift overnight.
The same hook keeps a request counter so a refresh racing an in-flight load cannot resolve out of
order.

**The debounce hook returns its setter.** The search clear button must reset the field and the
pending debounced value in one batch; otherwise a keystroke already in flight re-filters the list
300 ms after clearing.

**Single screen, no navigation library.** The detail view is a `Modal` bottom sheet;
`@react-navigation` only pays for itself with a second screen or deep links. View-only state
(selected transaction, open sheet) stays as `useState` in the screen, since nothing outside the
view cares about it.

### Performance

- `TransactionItem` is memoized; `renderItem`, `keyExtractor` and `getItemLayout` are stable
  `useCallback`s, so typing in the search box re-renders the list, not every row.
- `getItemLayout` from pre-computed offsets (no measuring), `initialNumToRender={12}`,
  `windowSize={7}`. `removeClippedSubviews` is off: it crashes Android with
  "addViewAt: failed to insert view into parent" when the data swaps mid-refresh.
- The summary follows the date range and the search but not the type filter: it answers "what
  happened in this period", so tapping the expenses column does not zero the column tapped.
- Search is debounced 300 ms; filtering + summary + grouping run in one `useMemo` keyed on the
  debounced query, filters and `loadedAt`.
- `Intl.NumberFormat` / `Intl.DateTimeFormat` are module-level singletons: none constructed in
  the render path, and no `new Date(iso)` per row (parsed once in `groupByDay`).

**Scaling to thousands of rows:** the current design filters client-side over the full list, which
is right for hundreds of rows. Past that the seam is already in place: `fetchTransactions` grows
cursor + filter params, `useTransactions` gains `onEndReached` pagination, and the list already
renders windowed, so the UI layer barely changes.

## Trade-offs (given the time budget)

- **No repository interface.** One implementation behind an abstraction is indirection nobody pays
  for. `transactionsApi.ts` *is* the seam.
- **Client-side filtering, no pagination.** Correct at this scale; the upgrade path is above.
- **en-US / USD only.** `Intl` makes the app locale-ready, but no i18n layer was added for a
  single-locale app.
- **The HTTP stack is unexercised** (a consequence of dropping MSW). Shipping this would need one
  real network test at that seam.
- **No `src/shared`, no barrels everywhere.** Folders and barrels appear when a second consumer
  exists, not upfront.

## Testing

Tests cover the hook layer and the screen states (`npm test`):

- `useTransactions`: loading to ready, error and retry, refresh, out-of-order guard (fake timers,
  no 1.1 s waits)
- `useTransactionFilters`: type/range/search combinations, summary, empty results
- `useDebouncedValue`: debouncing and the clear-race case
- `TransactionsScreen`: loading, error + retry, empty and no-matches states as the user sees them

Pure domain functions are exercised through these rather than tested in isolation; layout and
styling are deliberately untested (see `.claude/rules/tests.md`).

## What I'd improve with more time

1. **Server-side filtering and pagination.** Move filtering and search into the request
   (`fetchTransactions` grows cursor + filter params) instead of filtering the full array on the
   client, which is what performance requires past a few hundred rows.
2. **Broader test coverage**: more unit tests, integration tests across the hook + screen
   boundary, and an e2e suite (Detox or Maestro) for the critical flows.
3. **Persisted filters** across sessions (MMKV) so the screen reopens the way the user left it.
4. **i18n and multi-currency support**: extract strings, drive `Intl` from the device locale, and
   format amounts in the account's currency rather than hardcoding USD.
5. **CI with local gates**: husky + lint-staged running Biome and typecheck on pre-commit, and a
   pipeline running typecheck + lint + tests on every push.
6. **AI-ready skills and documentation**: expand `CLAUDE.md` and `.claude/rules/` into proper
   skills (per-layer conventions, test recipes, decision log) so agent-assisted implementation
   stays consistent with the architecture.

## Conventions

Project conventions live in [`CLAUDE.md`](./CLAUDE.md) and [`.claude/rules/`](./.claude/rules)
(code style, commits, tests, documentation).
