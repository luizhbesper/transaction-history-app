---
paths:
  - "**/*.{ts,tsx}"
---

# Comments & documentation

- JSDoc is required on exported functions, hooks, and components. Internal ones don't need it.
- JSDoc says **what and why**, not how. Add `@param`/`@returns` only when the name doesn't already answer it.
- Inline comments only for non-obvious decisions: workaround, platform constraint, business rule. Never narrate the next line.
- No decorative section banners, no ownerless `TODO`s, no commented-out code — delete it, git remembers.
- A good name beats a comment. If a comment is needed to explain *what* a function does, rename it.
- Architecture decisions go in the README, not in comments.
