---
name: meaningful-git-commit
description: Generate clear, maintainable git commit messages for human reviewers and AI agents using conventional commit format

version: 2.6.0
author: Son Tung
email: tungtshp99@gmail.com
created: 2026-03-03

trigger_phrases:
  - create git commit
  - generate commit message
  - meaningful commit
  - commit changes
  - conventional commit
  - group related changes
  - analyze diffs
  - clean commit
---
# Meaningful Git Commit

## Purpose

Autonomous commit organization. Analyzes changes, determines optimal groupings using single responsibility principle, presents commit plan for confirmation, then executes. Minimal interaction - one confirmation per session.

## Core Principle: Single Responsibility

Each commit should:
- Do ONE thing (feature, fix, refactor, chore)
- Affect ONE scope when possible
- Be independently revertable
- Tell a clear story in git log

## Autonomous Workflow

### Phase 1: Analyze (Silent)

```bash
git status
git diff --stat
git diff --cached --stat
```

Evaluate changes using scoring matrix:

| Signal | Split Score | Group Score |
|--------|-------------|-------------|
| Different directories | +2 | - |
| Different types (feat vs fix) | +3 | - |
| Same feature module | - | +2 |
| Test + implementation pair | - | +3 |
| Sequential dependency | - | +2 |
| Generated files | +2 (separate) | - |
| Independently revertable | +2 | - |

**Decision**: Split if score > 3, Group if score > 4.

### Phase 2: Classify & Group

**Auto-grouping rules (no asking):**

1. **Feature + Tests** → ONE commit: `feat(scope): description` (even if tests written after)
2. **Model + Repository + Bloc** (same feature) → ONE commit if tightly coupled
3. **Generated files** → Separate `chore: regenerate ...`
4. **Docs/Plans** → Separate `docs(scope): ...`
5. **Config changes** → Separate `chore: ...`
6. **Independent fixes** → Separate commits each

**Hunk-level staging**: when a single file contains changes belonging to two different commits (e.g., a fix hunk + a streaming hunk in `message_list.dart`), use `git add -p` with `printf 'y\nn\n...'` piped input to stage specific hunks. Present this in the commit plan as: `Hunk 3 of 5 from message_list.dart`.

**Noise handling (auto-clean):**
- Log files → Ignore (don't commit)
- Formatting-only → Separate `style:` or discard
- Whitespace → Discard unless intentional

### Phase 3: Present Plan (Single Output)

Output format for human + agent readability:

```
## Commit Plan

### 1. feat(chat): add model selector widget
Files: model_selector.dart, chat_input.dart, nebula_card.dart
Reason: UI feature - single concern, independently revertable

### 2. feat(chat): wrap getSessions in response object
Files: chat_repository.dart, session_bloc.dart, *_test.dart
Reason: API layer change - repository + bloc + tests tightly coupled

### 3. chore: regenerate asset files
Files: assets.gen.dart, fonts.gen.dart
Reason: Generated files - separate from logic changes

---
Proceed? (y/n/edit)
```

### Phase 4: Execute

Before creating each feat/fix commit, run this quality gate:

**Context paragraph check (run before each feat/fix commit):**
1. Cover the diff. Read only the context paragraph.
2. Ask: "Does this paragraph predict what will break if the code is reverted?"
3. Ask: "Does it match any of the three anti-patterns (describes-what, too-abstract, copies-subject)?"
4. If any check fails → rewrite using this recipe:
   - Start with the failure mode: "Without this, `<X>` happens when `<trigger>`."
   - Add the mechanism: "because `<root cause>`."
   - Add the constraint: "`<Component>` requires `<invariant>`."

**Decision line check:**
1. Is a rejected alternative named by name?
2. Was there a real trade-off? (If you only considered one approach → omit)
3. If named alternative is missing and a trade-off existed → add it before committing

Then:
1. Stage files for commit 1
2. Create commit
3. Repeat for remaining commits
4. Show final `git log --oneline -n`

## Commit Format

```
<type>(<scope>): <description>

[context paragraph — required for feat/fix, optional for others]

[bullet points — file-level changes]

[Decision: <chosen> (not <rejected>) — <why>]

[optional footer — BREAKING CHANGE, Closes #issue]
```

**Types**: feat, fix, refactor, perf, test, docs, chore, style

**Description rules (subject line):**
- Imperative: "add", "fix", "update" (not "added", "fixed")
- Under 72 chars
- No period
- Lowercase

**Body rules:**
- Wrap all body lines at 72 chars (git log, GitHub, terminal all assume 72)
- Context paragraph: prose, wrapped
- Bullet points: `- ` prefix, wrapped
- Decision line: single line or wrapped at 72 chars; continuation indented 2 spaces, no bullet prefix
  ```
  Decision: context.read<>() in _onScrollEnd (not _isStreaming field)
    — bloc is source of truth; avoids redundant derived state.
  ```

## Context-Rich Commits (feat, fix)

For `feat` and `fix` commits, always include a body with two parts:

### 1. Context Paragraph (1–3 sentences)

Explain **why** the problem exists or the feature is needed — not what the code does. Write for someone who has never seen this codebase. Use causal language: "causes", "because", "results in", "→".

**The paragraph must answer: "What breaks if this commit is reverted, and why?"**

**Sentence starters that force causal thinking:**
- `<X> causes <Y> because <mechanism>.`
- `Without this change, <failure mode> when <trigger>.`
- `<Component> requires <constraint> — <reason>.`
- `<Old approach> results in <symptom> because <root cause>.`

**API/symbol names in prose** — include the actual symbol names (`stickToBottom`, `applyContentDimensions`, `_onScrollEnd`) in the context paragraph. This serves two purposes: human reasoning AND grep terms for agents investigating related bugs. Do not paraphrase: write `stickToBottom`, not "the flag".

**State-machine fixes: state the exit/recovery condition** — if the fix changes a flag or mode for the duration of a condition (e.g. "flag must stay false during streaming"), the commit must also state what restores normal state after the condition ends, and under what guard. The most common source of follow-on regressions is the missing exit path. Example:

```
// INCOMPLETE — states entry, not exit
stickToBottom must stay false for the full streaming duration.

// COMPLETE — states both entry and recovery
stickToBottom must stay false for the full streaming duration.
_onScrollEnd re-enables it when the user reaches the bottom outside
of streaming; session-change BlocListener restores it on new session.
```

**Three anti-patterns to reject:**

| Anti-pattern | Example | Problem |
|--------------|---------|---------|
| Describes-what | "Replace X with Y in method Z." | Repeats the diff |
| Too-abstract | "Improves scroll performance." | No mechanism |
| Copies-subject | "Fix blank frame on FAB tap." | Restates the title |

**Mechanical self-check:** Cover the code diff. Read only the context paragraph. Ask: *"If I broke this code right now, would this paragraph predict the failure mode?"* If no → rewrite starting from the failure mode, not the fix.

```
// BAD — describes what the code does (anti-pattern 1)
Replace jumpTo+animateTo with jumpTo only in _scrollToBottomDirect.

// GOOD — explains the constraint and causal chain
jumpTo+animateTo in the same sync call starts the animation before a
layout pass can occur. The viewport renders items at positions never
laid out → blank frame. jumpTo alone skips all intermediate frames.
```

**Trivial exception (fix AND feat):** If the subject line IS the context — no mechanism to explain, no root cause beyond the title — omit the paragraph. Do not write filler.

Test: "Does the context paragraph say anything that the subject line doesn't already say?"
- `fix: correct typo in error message` → subject IS the context → omit
- `feat(chat): add copy button to message bubble` → subject IS the context → omit
- `fix(scroll): blank frame on FAB tap` → subject is not enough (WHY?) → context required
- `feat(chat): wrap getSessions in response object` → subject is not enough (WHY not raw list?) → context required

### 2. Decision Line

Summarize the **specific approach chosen** and explicitly name the rejected alternative. The rejected approach **must appear by name** — vague "other approaches" is not acceptable. Format: `Decision: <chosen> (not <rejected>) — <why>`.

```
// BAD — vague, no named alternative
Decision: use jumpTo for instant scroll.

// GOOD — names the rejected approach by name
Decision: jumpTo only (not animateTo) — animation adds no value when
user explicitly taps FAB; matches standard chat app pattern.
```

**If you genuinely considered only one approach**, the Decision line is not required — don't invent alternatives. Only write it when a real trade-off existed.

### When to include context

| Type | Context paragraph | Decision line |
|------|:-----------------:|:-------------:|
| `feat` | **required** ¹ | if trade-off was made |
| `fix` | **required** ¹ | **required** ¹ |
| `refactor` | if non-obvious | if non-obvious |
| `perf` | recommended | recommended |
| `chore`, `style`, `docs` | optional | omit |

¹ **Trivial fix exception**: the fix is trivial when the subject line IS the full context — no mechanism to explain. Examples:

| Trivial (omit context) | Non-trivial (context required) |
|------------------------|-------------------------------|
| `fix: correct typo in error message` | `fix(auth): token refresh fails on 401 retry` |
| `fix: remove debug print` | `fix(scroll): blank frame on FAB tap` |
| `fix: null-check guard for edge case` | `fix(api): race condition in concurrent requests` |

**"If trade-off was made"** (feat): include Decision when you chose between two real implementation options. Skip for straightforward additive features (adding a button, adding a field) where there was only one sensible approach.

## Grouping Decision Matrix

```
┌─────────────────────────────────────────────────────────────┐
│                    SPLIT vs GROUP                           │
├─────────────────────────────────────────────────────────────┤
│ ALWAYS SPLIT:                                               │
│ • Different features (chat vs auth)                         │
│ • Different types (feat + chore)                            │
│ • Independent bugs                                          │
│ • Generated files from logic changes                        │
├─────────────────────────────────────────────────────────────┤
│ ALWAYS GROUP:                                               │
│ • Implementation + its tests                                │
│ • Model → Repository → Bloc (same feature, tight coupling)  │
│ • Breaking change across files                              │
│ • Reverting one breaks others                               │
├─────────────────────────────────────────────────────────────┤
│ JUDGMENT CALL → Default to SPLIT:                           │
│ • When uncertain, smaller commits are safer                 │
│ • Easier to squash later than split after                   │
└─────────────────────────────────────────────────────────────┘
```

## Agent-Friendly Output

Commits optimized for AI parsing:

```
feat(chat): add WebSocket message streaming

The existing HTTP polling approach added 800ms average latency per
token. SSE pushes each chunk as it arrives, keeping the UI reactive
without blocking the Dart event loop.

- Add ChatStreamService for SSE handling
- Implement message chunk accumulation in bloc
- Update ChatBubble to render streaming content

Decision: SSE over WebSocket — simpler reconnect semantics; server
already uses HTTP/2 which multiplexes SSE streams efficiently.

Enables: real-time AI response display
Depends: network/sse_client.dart
```

Key elements:
- **Scope** identifies affected module
- **Context paragraph** explains the constraint or root cause (critical for conflict resolution)
- **Bullet points** list file-level changes
- **Decision** records the specific choice and rejected alternatives
- **Enables/Depends** hints for agents tracing dependencies

## Noise Detection (Auto-handled)

| Pattern | Action |
|---------|--------|
| `*.g.dart`, `*.gen.dart`, `*.freezed.dart` | Separate chore commit |
| `.log`, `.cache`, `node_modules` | Skip (add to .gitignore) |
| Import reordering only | Discard or style commit |
| Whitespace/formatting | Discard unless intentional |
| Debug prints | Warn user, suggest removal |

## Model

**Haiku** for this skill - lightweight task, cost-efficient.

## Examples

### Fix with context
```
fix(scroll): jump to bottom instantly on FAB tap to prevent blank frame

jumpTo+animateTo in the same sync call starts the animation before a
layout pass can occur. The viewport renders items at positions that
were never laid out → blank frame on complex message lists.

- Remove animateThreshold jump+animate combo
- Set stickToBottom synchronously (no .then() callback gap)

Decision: jumpTo only (not animateTo) — animation adds no UX value
when user explicitly taps FAB; matches standard chat app pattern.
```

### Fix with streaming constraint
```
fix(scroll): disable auto-scroll while AI response is streaming

stickToBottom causes applyContentDimensions to snap to maxScrollExtent
on every streaming token. Users cannot read earlier content while the
AI response is generating. The flag must stay false for the full
duration of streaming, not just at its start.

- Add BlocListener that clears stickToBottom on streaming start
  (covers retry and all paths, not just new-message entries)
- Guard _onScrollEnd so bottom-of-list during streaming does not
  re-enable stickToBottom

Decision: read bloc state in _onScrollEnd (not a _isStreaming field) —
bloc is already the source of truth; avoids redundant derived state.
```

### Feature with decision
```
feat(chat): wrap getSessions in ChatSessionListResponse

getSessions returned a raw List<ChatSession> which gave the bloc no
way to distinguish between "empty session list" and "request not yet
made". Wrapping in a response object gives the bloc a typed status
without adding a separate status field to the state.

- Update ChatRepository.getSessions return type
- Update SessionBloc to handle response wrapper
- Add ChatSessionListResponse with fromList factory

Decision: response object over nullable list — null has ambiguous
semantics; named factory makes deserialization intent explicit.
```

### Generated Files (no context needed)
```
chore: regenerate asset and font files
```

### Multi-commit Session Output
```
Created 3 commits:
abc1234 feat(chat): add model selector dropdown
def5678 feat(chat): wrap getSessions in response object
ghi9012 chore: regenerate asset files

Remaining unstaged: .claude/hooks/.logs/ (ignored)
```
