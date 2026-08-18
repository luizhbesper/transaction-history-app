# Tests

- AAA pattern (Arrange, Act, Assert) with the three parts visible.
- Test names describe behavior: `it("shows empty state when no transactions match the filter")`.
- **Cover**: hooks and state logic, formatting (currency/date), filtering and search, API data transformation, loading/error/empty states.
- **Don't cover**: layout and styling (UI snapshots, colors, spacing), or the pure domain/type layer.
- Focus on the happy path plus the error path a user actually sees. Don't enumerate unlikely edge cases.
- No tautological tests (`const foo = "bar"; expect(foo).toBe("bar")`) and no tests that just restate the implementation (spying on internal calls, giant snapshots).
- One meaningful `expect` beats five trivial ones.
- Mock network with MSW handlers, not `jest.mock` on fetch. MSW is installed but unwired — create the setup alongside the first test that hits the API.
- Run `npm test -- <file>` while developing; full suite before committing.
