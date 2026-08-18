---
paths:
  - "**/*.{ts,tsx}"
  - "package.json"
---

# Code style

- Formatting is Biome's job. Don't debate style — run `npm run format`.
- TypeScript is strict: no `any`, no `@ts-ignore`, no `as` cast to silence the compiler. If the type doesn't fit, the model is wrong.
- Type the return of exported functions; leave local inference alone.
- `type` for shapes and unions; `interface` only when declaration merging or `extends` is needed.
- Relative imports only — no `@/` alias is configured in Metro/Babel.
- Components: named function, `StyleSheet.create` outside the component. No new styling library.
- No new dependency without asking. Prefer platform APIs and already-installed libs.
- Look for an existing helper before writing a new one.
