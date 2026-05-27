# Context Writing Guide

## Quality Gate (run before each feat/fix commit)

1. Cover the diff. Read only the context paragraph.
2. Ask: "Does this paragraph predict what breaks if the code is reverted?"
3. Ask: "Does it match any anti-pattern below?"
4. If any check fails → rewrite starting from the failure mode, not the fix.

**Decision line check:**
1. Is a rejected alternative named by name?
2. Was there a real trade-off? (If only one approach considered → omit.)

## Anti-Patterns

| Anti-pattern | Example | Problem |
|---|---|---|
| Describes-what | "Replace X with Y in method Z." | Repeats the diff |
| Too-abstract | "Improves scroll performance." | No mechanism |
| Copies-subject | "Fix blank frame on FAB tap." | Restates the title |

## Sentence Starters

Force causal thinking by starting with:
- `<X> causes <Y> because <mechanism>.`
- `Without this change, <failure mode> when <trigger>.`
- `<Component> requires <constraint> — <reason>.`
- `<Old approach> results in <symptom> because <root cause>.`

## Symbol Names in Prose

Include actual API/symbol names (`stickToBottom`, `applyContentDimensions`) in the context paragraph. This serves human reasoning AND grep terms for agents investigating related bugs. Write `stickToBottom`, not "the flag".

## State-Machine Fixes

When a fix changes a flag or mode for the duration of a condition, the commit must state both the entry AND exit/recovery condition. The most common follow-on regression is a missing exit path.

```
// INCOMPLETE — states entry, not exit
stickToBottom must stay false for the full streaming duration.

// COMPLETE — states both entry and recovery
stickToBottom must stay false for the full streaming duration.
_onScrollEnd re-enables it when the user reaches the bottom outside
of streaming; session-change BlocListener restores it on new session.
```

## Decision Line Format

`Decision: <chosen> (not <rejected>) — <why>`

The rejected approach must appear by name — "other approaches" is not acceptable.

```
// BAD — vague
Decision: use jumpTo for instant scroll.

// GOOD — names the rejected approach
Decision: jumpTo only (not animateTo) — animation adds no value when
user explicitly taps FAB; matches standard chat app pattern.
```

## When to Include What

| Type | Context paragraph | Decision line |
|---|:-:|:-:|
| feat | required ¹ | if trade-off was made |
| fix | required ¹ | required ¹ |
| refactor | if non-obvious | if non-obvious |
| perf | recommended | recommended |
| chore, style, docs | optional | omit |

¹ Trivial exception: omit when the subject line IS the full context — no mechanism to explain.
