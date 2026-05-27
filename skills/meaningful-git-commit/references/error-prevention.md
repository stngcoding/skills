# Error Prevention — Gotchas

## Scope Issues

- **Too broad:** `feat: updated application` — which part? Use feature name.
- **Too many:** `feat(auth,chat,ui)` — split into 3 commits.
- **Too specific:** `feat(message_bubble_widget)` — use the feature: `feat(chat)`.

## Type Mismatches

- **Looks like fix but is refactor:** `fix(perf): optimize list rendering`
  → Better: `perf(chat): optimize message list rendering`
- **Looks like feat but is fix:** `feat(scroll): disable stickToBottom on streaming start`
  → If the old behavior was a regression, it's a `fix`, not a `feat`.

## Description Traps

- **Past tense:** "Fixed the bug" → `fix` (imperative, not past)
- **Over 72 chars:** Move details to body, not subject line.
- **Missing scope context:** "Add widget" → "Add message bubble widget"
- **Period at end:** Never. `fix(chat): remove debug print` not `fix(chat): remove debug print.`
