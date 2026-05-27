# Examples

## Trivial feature (no context needed)
```
feat(chat): add copy button to message bubble
```

## Trivial fix (subject IS the context)
```
fix(routing): display chat route in bottom navigation
```

## Fix with context
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

## Fix with streaming constraint
```
fix(scroll): disable auto-scroll while AI response is streaming

stickToBottom causes applyContentDimensions to snap to maxScrollExtent
on every streaming token. Users cannot read earlier content while the
AI response is generating. The flag must stay false for the full
duration of streaming, not just at its start.

- Add BlocListener that clears stickToBottom on streaming start
- Guard _onScrollEnd so bottom-of-list during streaming does not
  re-enable stickToBottom

Decision: read bloc state in _onScrollEnd (not a _isStreaming field) —
bloc is already the source of truth; avoids redundant derived state.
```

## Test addition
```
test(chat): add unit tests for message bubble widget
```

## Generated files
```
chore: regenerate asset and font files
```

## Refactor
```
refactor(chat): extract message formatting into MessageFormatter
```

## Grouped multi-file change
```
feat(chat): refactor bloc and enhance message bubble widget

ChatMessageBloc's single-event model cannot distinguish multi-turn
approval flows from regular messages — the bloc processes both
identically, causing approval blocks to render as plain text.
Splitting ChatEvent into typed variants lets the bloc route each
message type to the correct rendering path.

- Refactor ChatMessageBloc to dispatch on typed ChatEvent variants
- Extend ChatEvent model with ApprovalEvent and StreamEvent subtypes
- Update MessageBubble to select renderer based on event type
- Add integration tests covering multi-turn approval flow

Decision: typed event variants (not a messageType string field) —
exhaustive switch catches missing cases at compile time.
```

## Multi-commit session output
```
Created 3 commits:
abc1234 feat(chat): add model selector dropdown
def5678 feat(chat): wrap getSessions in response object
ghi9012 chore: regenerate asset files

Remaining unstaged: .claude/hooks/.logs/ (ignored)
```
