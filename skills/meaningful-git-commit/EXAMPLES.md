# Commit Message Examples

## Feature Implementation
```bash
git add lib/features/chat/presentation/widgets/message_bubble.dart
git add lib/features/chat/presentation/widgets/message_list.dart
```
**Commit:** `feat(chat): implement message bubble and list widgets`

## Bug Fix
```bash
git add lib/config/router/app_route.dart
git add lib/config/router/widget/bottom_nav_bar.dart
```
**Commit:** `fix(routing): display chat route in bottom navigation`

## Test Addition
```bash
git add test/features/chat/presentation/widgets/message_bubble_test.dart
```
**Commit:** `test(chat): add unit tests for message bubble widget`

## Configuration Update
```bash
git add CLAUDE.md
git add lib/gen/assets.gen.dart
```
**Commit:** `chore: update configuration and generated assets`

## Refactoring
```bash
git add lib/features/chat/data/models/chat_event.dart
git add lib/features/chat/repository/chat_repository.dart
```
**Commit:** `refactor(chat): simplify message state management`

## Grouped Related Changes
```bash
git add lib/features/chat/presentation/bloc/chat_message_bloc.dart
git add lib/features/chat/data/models/chat_event.dart
git add lib/features/chat/presentation/widgets/message_bubble.dart
git add test/features/chat/presentation/bloc/chat_message_bloc_test.dart
git add test/features/chat/presentation/widgets/message_bubble_test.dart
```
**Commit:**
```
feat(chat): refactor bloc and enhance message bubble widget

- Refactor ChatMessageBloc for improved state handling
  of multi-turn conversations and approval blocks
- Extend ChatEvent model to support new message types
- Add rich formatting and markdown rendering to MessageBubble
- Add comprehensive integration tests for bloc refactor
- Add unit tests for widget rendering and interactions

These changes are logically coupled: the bloc refactor
enables the widget enhancement, and the model changes
support both. Tested as an integrated unit.
```

**Why grouped:**
- Bloc refactor enables widget enhancement (sequential dependency)
- Model change supports both layers (shared concern)
- Tests validate the integrated behavior
- Reverting one breaks the others
