# Transaction History App

A React Native app that lists financial transactions — merchant, amount, date and category — with
filtering by type, merchant search, and explicit loading, error and empty states.

## Requirements

- Node >= 22.11.0
- **iOS**: Xcode, Ruby + Bundler, CocoaPods
- **Android**: JDK 17, Android SDK

See the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) if any
of the above is missing.

## Setup

```sh
npm install

# iOS only
bundle install
bundle exec pod install --project-directory=ios
```

## Running

```sh
npm start          # Metro bundler
npm run ios        # build and run on iOS simulator
npm run android    # build and run on Android emulator
```

## Scripts

| Script              | Command                  | What it does                  |
| ------------------- | ------------------------ | ----------------------------- |
| `npm start`         | `react-native start`     | Metro bundler                 |
| `npm run ios`       | `react-native run-ios`   | Build & run on iOS            |
| `npm run android`   | `react-native run-android` | Build & run on Android      |
| `npm test`          | `jest`                   | Unit tests                    |
| `npm run typecheck` | `tsc --noEmit`           | TypeScript check (strict)     |
| `npm run lint`      | `biome check .`          | Lint + format check           |
| `npm run format`    | `biome check --write .`  | Fix lint + formatting         |

## Architecture

Four layers, dependencies flowing in a single direction:

```
presentation  →  application  →  data  →  domain
```

`domain` imports nothing. The rule that keeps the boundary honest: **`domain` and `data` never
import React or React Native.**

```
src/
  domain/                     # pure TypeScript, testable without RN
    transaction.ts            # Transaction, TransactionType, TypeFilter, DateRange
    filters.ts                # filterTransactions, summarize, groupByDay
    format.ts                 # formatCurrency, formatDate (Intl)

  data/                       # everything that talks to the outside
    transactions.mock.ts      # 24+ realistic transactions
    handlers.ts               # MSW handlers (success / error / empty)
    transactionsApi.ts        # fetch → Transaction[]

  application/                # state and orchestration (hooks)
    useTransactions.ts        # fetch, loading/error/empty, refresh, retry
    useTransactionFilters.ts  # search + type + range, derived list and summary
    useDebouncedValue.ts

  presentation/
    theme/tokens.ts           # colors, spacing, radius, typography
    screens/                  # TransactionsScreen.tsx + .styles.ts
    components/               # SummaryCard, SearchInput, FilterChips,
                              # TransactionItem, TransactionDetailSheet, ListStates
```

### Decisions

- **No navigation library.** The app is a single screen; the transaction detail is a React Native
  `Modal` presented as a bottom sheet. `@react-navigation/*` would only pay for itself with a second
  screen or deep links.
- **Styles as sibling files.** `Foo.tsx` next to `Foo.styles.ts` — separated from the component
  without a folder per component or a central `styles/` directory.
- **Named exports only** (enforced by Biome's `noDefaultExport`): one canonical name per symbol,
  greppable and refactor-safe.
- **MSW as the mock source**, so the app fetches over HTTP exactly as it would in production;
  swapping in a real API touches only `data/`.

### Trade-offs

- No `TransactionRepository` interface — a single implementation behind an abstraction is
  indirection without a payer. `transactionsApi.ts` is the seam if a second source ever appears.
- No `src/shared`, `src/config` or barrel `index.ts` files: they get added when a second consumer
  actually exists, not upfront.
- Filtering and searching happen client-side over the full list. Fine for hundreds of rows;
  thousands would move filtering server-side and paginate.

### Next steps

## Conventions

Project conventions live in [`CLAUDE.md`](./CLAUDE.md) and [`.claude/rules/`](./.claude/rules)
(code style, commits, tests, documentation).
