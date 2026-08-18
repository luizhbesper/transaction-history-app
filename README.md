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

> TBD — filled in as the implementation lands.

### Decisions

### Trade-offs

### Next steps

## Conventions

Project conventions live in [`CLAUDE.md`](./CLAUDE.md) and [`.claude/rules/`](./.claude/rules)
(code style, commits, tests, documentation).
