# Decisions

Notes on the choices behind this implementation, and the reasoning I can defend.

## Dropping MSW for a local JSON mock

**Decision.** The app reads its data from `src/data/transactions.json` through a single
handler in `src/data/transactionsApi.ts`, which adds latency and can simulate failure.
MSW was removed from the project entirely.

**Why.** MSW v2 assumes a browser-grade environment: a spec-compliant Fetch API, WHATWG
Streams and a full `XMLHttpRequest`. Hermes — the default engine in React Native 0.86 —
provides none of the first two, and only an approximation of the third. `msw/native`
exists, but it solves *module resolution*, not the runtime.

I did not assume this; I measured it on the simulator:

| Global | Hermes / RN 0.86 |
| --- | --- |
| `TransformStream`, `ReadableStream`, `WritableStream` | missing |
| `TextDecoder`, `structuredClone`, `MessageEvent`, `BroadcastChannel` | missing |
| `URL`, `URLSearchParams`, `fetch`, `Response`, `XMLHttpRequest` | present |

Getting MSW to *load* took four polyfills: `web-streams-polyfill` plus hand-written shims
for `MessageEvent`, `BroadcastChannel` and `XMLHttpRequestUpload`. It still did not
*work*, and the reason is structural rather than a missing global:

- **Fetch path.** React Native's `fetch`/`Response` come from `whatwg-fetch`
  (`react-native/Libraries/Network/fetch.js` is a one-line `require('whatwg-fetch')`).
  That implementation is built on `XMLHttpRequest` and has no streaming body. MSW hands
  the response body over as a `ReadableStream`, which that `Response` silently ignores —
  the request was intercepted correctly, but the body arrived empty
  (`JSON Parse error: Unexpected end of input`).
- **XHR path.** MSW's `XMLHttpRequestInterceptor` calls
  `getAllResponseHeaders().split(...)`. React Native returns `null` there where the spec
  requires an empty string, so it throws before any response is built.

Closing that gap means replacing React Native's `fetch` with a streaming-capable one
(`react-native-fetch-api` plus a `TextDecoder` polyfill) — more dependencies, in a stack
where each fix so far had revealed the next one.

**The trade-off.** What MSW buys is realism: the app performs a real HTTP request, and
swapping in a production API becomes a change of URL rather than a change of code. What
it costs here is a fragile pile of runtime polyfills that exists only to satisfy the mock.
For a feature whose entire data layer is *pretend*, that is a bad trade. I chose the
simpler path, because a simple API emulation is all this needs.

**What is kept.** The properties that actually mattered are all still there:

- ~1100 ms of latency, so the loading state is real rather than theoretical
- an injectable failure and an empty result, so the error and empty states are reachable
  in the demo (`fetchTransactions("error" | "empty")`)
- an `async` boundary the UI must treat as remote

**What is lost.** The app is not exercising its HTTP stack. If this were going to
production, that is exactly the seam I would want covered by a real network test.

**Where the seam is.** `fetchTransactions(scenario?): Promise<Transaction[]>` is the only
thing the rest of the app knows about. Pointing it at a real API — or reinstating MSW —
touches that one file and nothing else.

## Mock dates are relative, not absolute

The design prototype pinned every transaction to a fixed date in August 2026. Copying
those timestamps means that from the next day onwards no row is "Today", and the 7-day
filter slowly empties out.

So `transactions.json` stores an offset (`daysAgo` plus a local time) instead of a
timestamp, and the handler materialises the ISO date against the current time on each
request. The day grouping stays correct however long the mock lives, and pull-to-refresh
will keep returning accurate data in a long session.

`filterTransactions` takes `now` as a parameter rather than calling `new Date()`
internally, which keeps the date range reproducible.

The 50 transactions are spread deliberately: dense in the last week so day grouping has
something to show, with a tail reaching ~75 days back so that every date range returns a
different set (27 / 40 / 50 / 50 for 7 / 30 / 90 / all).

## Formatting lives in presentation, not in the domain

`presentation/utils/` holds `currency.ts`, `date.ts` and `transactionId.ts`, consumed as
`currency.formatCurrency(amount)`.

The first draft put these in `domain/`, following the repo's own definition of the layer
("types and pure logic — filters, summary, formatting"). On reflection that was wrong.
The domain decides *what* a number is: that an expense is a negative amount, that a
transaction falls inside the last 30 days. Turning `-54.18` into `−$54.18`, or a
timestamp into `TODAY`, is a rendering choice — and specifically an en-US one. Being pure
and side-effect free does not make something domain logic; it just makes it testable.

The layering forced the point rather than merely suggesting it. `groupByDay` used to
label its own headers by calling `formatDayLabel`. Once formatting moved to
presentation, the domain could no longer reach it — dependencies only flow one way. So
`groupByDay` now emits the raw `Date` on each header, and the screen decides whether that
reads as `TODAY` or `AUG 12`. That is the better boundary anyway: it is the same
grouping regardless of locale.

Three modules split by subject, rather than one `format.ts` grab-bag, so the namespace
import makes the call site say which kind of formatting it is.

All the date helpers take a `Date`, never an ISO string. The parse happens once, in
`groupByDay`, which hands the parsed value down on the list item — so no `new Date()`
runs in the render path of a long list. `Intl` formatters are module-level singletons for
the same reason.

## A flat list instead of `SectionList`

`groupByDay` returns a single array of `{ kind: "header" } | { kind: "row" }` entries.
Every entry then has a known height (60 for rows, 33 for headers, both from the design
tokens), which is what makes `getItemLayout` viable. `SectionList` would have made that
considerably harder for no gain here.

## Date range filter, though the brief does not ask for it

The challenge asks for type filtering and merchant search. The design also specifies an
All / 7 / 30 / 90 day range, and the empty state depends on it (the "active filters" pill
lists it). It is about five lines in `filterTransactions` plus one type, so it was
cheaper to include than to retrofit.

## No repository interface

`transactionsApi.ts` is a module of functions, not an implementation behind an
interface. A single implementation hidden behind an abstraction is indirection with
nobody paying for it. If a second data source ever appears, that file is the seam.

## `loadedAt` instead of reading the clock in render

`useTransactions` stamps a `Date` when a load resolves and hands it out. Filtering and the
`TODAY` / `YESTERDAY` headers both need a "now", and calling `new Date()` in the screen would
produce a new object every render — busting the derivation memo on every keystroke, and
letting the day labels drift in a session left open past midnight. One value, refreshed
exactly when the data is.

The same hook keeps a request counter in a ref: a pull-to-refresh fired while another load is
still in flight would otherwise be free to resolve out of order.

## The debounce hook returns its setter

`useDebouncedValue(value, delay)` returns `[debounced, setDebounced]` rather than just the
value. The clear button in the search field has to reset the field *and* the pending search
at once — without the setter, a keystroke already in flight lands 300 ms after the field was
cleared and the list filters itself again. Setting both in the same batch reschedules the
timer, so the stale keystroke can no longer arrive.

## View state stays in the screen

`useTransactionFilters` owns the filters and the list derived from them. The detail sheet's
`selected` transaction and the range sheet's open flag are `useState` in the screen: nothing
outside the view cares about them, and putting them in the application layer would only make
the hook harder to describe.

## `@testing-library/react-native` for the hook tests

The repo had only `react-test-renderer`, which has no `renderHook`. Rather than hand-roll one,
RTL is the RN ecosystem standard and covers the presentation-layer component tests too. Its
v14 API is async (`await renderHook`, `await act`), and the mock's 1100 ms latency is skipped
with fake timers rather than waited out.
