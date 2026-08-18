# transaction-history-app

React Native (CLI) transaction history app.

## Stack

React Native 0.86 · TypeScript strict · Jest + `@react-native/jest-preset` · Biome (lint + format) · MSW (API mocking)

## Commands

- `npm test` — Jest. Run a single file (`npm test -- <file>`) rather than the whole suite while developing.
- `npm run typecheck` — `tsc --noEmit`. YOU MUST run this after a series of changes.
- `npm run lint` / `npm run format` — Biome.
- `npm start`, `npm run ios`, `npm run android`

## Language

All repo content is English: code, comments, docs, commit messages, test names.

## Architecture

Four layers with one-way dependencies: `presentation → application → data → domain`.

- `src/domain` — types and pure logic (filters, summary, grouping). Imports nothing.
  Formatting is *not* domain: it lives in `presentation/utils/`.
- `src/data` — mock dataset (`transactions.json`) and the API client that serves it.
- `src/application` — hooks holding state and orchestration.
- `src/presentation` — `theme/`, `utils/`, `screens/`, `components/`; styles in a sibling `Foo.styles.ts`.

`domain` and `data` never import React or React Native. Import across layers through the
`@domain` / `@data` / `@application` / `@presentation` aliases; stay relative within a folder. Single screen, no navigation library — the
detail view is a `Modal`. Details and trade-offs live in the README; record new decisions there.
