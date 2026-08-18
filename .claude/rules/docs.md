---
paths:
  - "**/*.{ts,tsx}"
---

# Comments & documentation

- JSDoc is required on exported functions, hooks, and components. Internal ones don't need it.
- JSDoc says **what and why**, not how.
- Full JSDoc on exported functions: a `@param {Type} name -` line for every parameter, plus
  `@returns {Type}`, and `@throws` where the function can reject. Write them even when the
  name already answers it — the tooling reads the tags, not the prose.
- Field-level notes go on the same line as the field, not above it:
  `amount: number; // Positive for income, negative for expenses`
- Inline comments only for non-obvious decisions: workaround, platform constraint, business rule. Never narrate the next line.
- No decorative section banners, no ownerless `TODO`s, no commented-out code — delete it, git remembers.
- A good name beats a comment. If a comment is needed to explain *what* a function does, rename it.
- Architecture decisions go in the README, not in comments.
