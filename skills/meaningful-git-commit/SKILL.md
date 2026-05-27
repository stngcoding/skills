---
name: meaningful-git-commit
description: Generate clear, maintainable git commit messages for human reviewers and AI agents using conventional commit format

version: 3.0.0
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

Analyze staged/unstaged changes, group by single responsibility, present a commit plan for confirmation, then execute. One confirmation per session.

## Workflow

### 1. Analyze

```bash
git status
git diff --stat
git diff --cached --stat
```

### 2. Group Changes

Each commit does ONE thing — one feature, one fix, one refactor. Each must be independently revertable.

**Always group:** implementation + its tests, tightly coupled layers (model → repo → bloc) for the same feature, changes where reverting one breaks others.

**Always split:** different features/scopes, different types (feat + chore), independent bugs, generated files from logic changes.

**When uncertain**, default to split — easier to squash later than split after.

**Hunk-level staging**: when a file has changes belonging to different commits, use `git add -p` with piped input to stage specific hunks.

**Auto-discard**: log files, formatting-only diffs, whitespace — don't commit noise.

### 3. Present Plan

```
## Commit Plan

### 1. feat(chat): add model selector widget
Files: model_selector.dart, chat_input.dart
Reason: single UI feature, independently revertable

### 2. chore: regenerate asset files
Files: assets.gen.dart, fonts.gen.dart
Reason: generated files — separate from logic

---
Proceed? (y/n/edit)
```

### 4. Execute

Before each `feat`/`fix` commit, run the quality gate from `references/context-writing.md`. Then stage → commit → repeat. Show `git log --oneline -n` at the end.

## Commit Format (Conventional Commits)

```
<type>(<scope>): <description>

[context paragraph — required for non-trivial feat/fix]

[- bullet points — file-level changes]

[Decision: <chosen> (not <rejected>) — <why>]

[footer — BREAKING CHANGE, Closes #issue]
```

**Types**: feat, fix, refactor, perf, test, docs, chore, style

**Subject line**: imperative, lowercase, under 72 chars, no period.

**Body**: wrap all lines at 72 chars. Context paragraph explains **why** — what breaks if reverted and the causal mechanism. Include actual symbol names for grepability.

**Context paragraph**: required for `feat` and `fix` unless the subject line IS the full context (no mechanism to explain). `fix: correct typo` → omit. `fix(scroll): blank frame on FAB tap` → required (WHY?).

**Decision line**: `Decision: <chosen> (not <rejected>) — <why>`. Include only when a real trade-off existed. Don't invent alternatives.

## Example

```
feat(chat): wrap getSessions in ChatSessionListResponse

getSessions returned a raw List<ChatSession> which gave the bloc no
way to distinguish "empty list" from "request not yet made". Wrapping
in a response object gives the bloc a typed status without adding a
separate status field to the state.

- Update ChatRepository.getSessions return type
- Update SessionBloc to handle response wrapper
- Add ChatSessionListResponse with fromList factory

Decision: response object over nullable list — null has ambiguous
semantics; named factory makes deserialization intent explicit.
```

## References (load on demand)

- `references/context-writing.md` — quality gate, anti-patterns, sentence starters, state-machine fix guidance. Read before writing non-trivial feat/fix commits.
- `references/examples.md` — additional commit patterns (trivial features, tests, config, grouped changes).
- `references/error-prevention.md` — common mistakes: wrong type, bad scope, description traps.

## Model

**Haiku** — lightweight task, cost-efficient.
