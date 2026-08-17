# Impact Engineer — React Native Frontend

**Time:** ~3-4 hours + 30 min for README and recording | **Tech:** React Native CLI, TypeScript

---

## The Challenge

Build a **Transaction History** screen for Gerald's personal finance app. This feature displays a user's recent transactions, allows filtering, and handles real-world edge cases gracefully.

This challenge tests how you *think* about building features, not just your ability to write React Native code.

---

## What to Build

### 1. Transaction List Screen

- Fetch transactions from a mock data source (you build the mock — see below)
- Display: merchant name, amount, date, category
- Format currency and dates appropriately (USD, locale-aware)
- Color-code: green for income, red for expenses

### 2. Filter Functionality

- Filter by type: All / Income / Expenses
- Search by merchant name (debounced)

### 3. States & Edge Cases

- Loading state while fetching
- Error state with retry option
- Empty state when no transactions match filters
- Pull-to-refresh

---

## Mock Data

**You are responsible for creating your own mock data source.** Options:

- Local JSON file with realistic transaction data
- MSW to simulate API responses
- In-memory data store with async fetch simulation

Your mock should return transactions matching this interface:

```tsx
interface Transaction {
  id: string;
  merchant: string;      // e.g., "Starbucks", "Direct Deposit"
  amount: number;        // positive for income, negative for expenses
  date: string;          // ISO 8601 format
  category: string;      // e.g., "Food & Drink", "Income", "Shopping"
  type: "income" | "expense";
}
```

Include **20+ transactions** with a realistic mix to properly test filtering and list performance.

> Why we ask you to build the mock: This tests your ability to structure realistic test data and think through edge cases.

---

## Technical Requirements

**Required:**

- React Native CLI (not Expo)
- TypeScript with proper typing
- FlatList with performance optimizations (keyExtractor, getItemLayout or FlashList)
- Consider how your solution would scale to hundreds or thousands of transactions
- Basic accessibility: screen reader labels on key interactive elements

**Encouraged (not required):**

- react-native-reanimated for filter transitions
- Unit tests for at least one component or utility
- Skeleton loading states instead of spinners

---

## A Note on AI Tools

You're welcome to use AI assistants (Copilot, Cursor, ChatGPT, etc.). We expect most candidates will.

At Gerald, we actively use AI-powered development tools to work faster. That said: regardless of how your code was written, you must be able to understand and defend every decision in it. We will ask about your choices.

---

## What We Evaluate

| Area | Weight | What We Care About |
| --- | --- | --- |
| **Code Quality & Structure** | 30% | Clean architecture, separation of concerns, reusable patterns, meaningful TypeScript |
| **Performance Awareness** | 20% | Avoiding unnecessary re-renders, debounced search, list optimizations |
| **User Experience Thinking** | 20% | Thoughtful state handling, clear financial data display, accessibility |
| **Communication & Ownership** | 30% | README quality, trade-off explanations, demonstrated understanding of your own code |

> Your README is weighted equally to your code quality. We want to see that you understand *why* you made the choices you did. A well-explained partial solution beats a complete one you can't discuss.

---

## Deliverables

### 1. Code Repository

GitHub repo (or zip) with your implementation.

### 2. README.md

- Setup instructions
- Architecture decisions and reasoning
- Trade-offs you made given the time constraint
- What you'd improve with more time

### 3. Video (3-5 min) — REQUIRED

This is critical. We want to see your thinking, not just your code.

**Cover these:**

- **Walk through one architectural decision** — why did you structure things this way?
- **Show the feature working** — happy path, filters, edge cases
- **One trade-off:** What did you choose between, and why?
- **What would you ask** before shipping this to production?

Speak naturally. It's okay to say "I wasn't sure about X, so I assumed Y."

---

## Time Budget

| Target | 3–4 hours |
| --- | --- |
| Plus | 30 min for README and recording |

We respect your time. If you go significantly over, stop and document what you would have done next. A well-thought-out partial solution beats a rushed complete one.
