# Meaningful Git Commit Skill

Generate clear, maintainable git commit messages for human reviewers and AI coding agents using conventional commit format.

## Overview

This skill analyzes staged changes and generates meaningful git commit messages that follow industry-standard conventional commit format. It helps teams maintain clear, searchable git history that works well with both humans and AI tools.

**Key Features:**
- Analyzes staged file changes automatically
- Generates conventional commit format messages
- Identifies appropriate type (feat, fix, test, chore, etc.)
- Detects scope and breaking changes
- Validates message quality before committing
- Ensures imperative mood and proper description length

## Installation

### For Claude Code

```bash
# Clone or navigate to your project
cd /path/to/your/project

# Link the skill globally
ln -sf /path/to/this/skill ~/.claude/skills/meaningful-git-commit
```

### For GitHub Copilot CLI

```bash
ln -sf /path/to/this/skill ~/.copilot/skills/meaningful-git-commit
```

### For Codex

```bash
ln -sf /path/to/this/skill ~/.codex/skills/meaningful-git-commit
```

## Usage

### Basic Workflow

1. **Stage your changes:**
   ```bash
   git add lib/features/chat/presentation/widgets/message_bubble.dart
   git add lib/features/chat/presentation/widgets/message_list.dart
   ```

2. **Request a commit message:**
   ```bash
   # In Claude Code or your AI assistant
   "Create a meaningful git commit for these changes"
   ```

3. **Review the generated options:**
   The skill analyzes your staged changes and suggests 2-3 commit message options

4. **Accept and commit:**
   Choose the best option or provide feedback for refinement

### Example Usage

**Scenario 1: Feature Implementation**

Staged changes:
- lib/features/chat/presentation/widgets/message_bubble.dart (new)
- lib/features/chat/presentation/widgets/message_list.dart (new)

Generated commit:
```
feat(chat): implement message bubble and list widgets
```

**Scenario 2: Bug Fix**

Staged changes:
- lib/config/router/app_route.dart (modified)
- lib/config/router/widget/bottom_nav_bar.dart (modified)

Generated commit:
```
fix(routing): display chat route in bottom navigation
```

**Scenario 3: Test Addition**

Staged changes:
- test/features/chat/presentation/widgets/message_bubble_test.dart (new)

Generated commit:
```
test(chat): add unit tests for message bubble widget
```

**Scenario 4: Configuration Update**

Staged changes:
- CLAUDE.md (modified)
- lib/gen/assets.gen.dart (modified)

Generated commit:
```
chore: update configuration and generated assets
```

## Commit Message Format

### Basic Structure

```
<type>(<scope>): <description>
```

**Example:**
```
feat(chat): add message bubble widget
```

### With Body (For Complex Changes)

```
<type>(<scope>): <description>

<body explaining why and how>

<footer with breaking changes or issue references>
```

**Example:**
```
feat(chat): add real-time message updates via WebSocket

Previous implementation used polling every 3 seconds.
WebSocket provides instant updates with reduced bandwidth.

Tested with 100+ concurrent connections.
Closes #234
```

## Commit Types

| Type | Usage | Example |
|------|-------|---------|
| `feat` | New feature | `feat(chat): add message encryption` |
| `fix` | Bug fix | `fix(auth): resolve login token expiration` |
| `refactor` | Code restructuring | `refactor(chat): simplify message state management` |
| `perf` | Performance improvement | `perf(api): reduce network request size` |
| `test` | Test additions | `test(chat): add message validation tests` |
| `docs` | Documentation only | `docs: update API documentation` |
| `chore` | Build, config, deps | `chore: update dependencies` |
| `style` | Code formatting | `style: fix indentation` |

## Common Scopes

- `chat` - Chat feature module
- `auth` - Authentication system
- `routing` - Navigation and routing
- `network` - API and network layer
- `ui` - User interface components
- `theme` - Design tokens and styling
- `state` - State management (BLoC, Cubit)
- `test` - Testing utilities

## Quality Checklist

Before committing, ensure your message:

- ✅ Uses correct type (feat, fix, refactor, etc.)
- ✅ Has specific scope (not generic or missing)
- ✅ Description starts with imperative verb
- ✅ Description is under 72 characters
- ✅ Description is lowercase (unless proper noun)
- ✅ No period at end of description
- ✅ Body explains WHY, not WHAT
- ✅ Related issues referenced in footer

## Best Practices

### Do's
- Keep commits focused on one logical change
- Write descriptions in imperative mood ("add" not "added")
- Be specific and descriptive
- Reference related issues in footer
- Explain the "why" in the body, not the description

### Don'ts
- Don't mix multiple unrelated changes
- Don't use vague descriptions ("fix bug", "update")
- Don't include implementation details in description
- Don't write in past tense
- Don't use generic scopes

## Integration with Tools

This skill works with:
- **Git history** - Clear, searchable commit log
- **Changelog generation** - Auto-generate changelogs from commits
- **Semantic versioning** - Determine version bumps from commit types
- **Code review** - Better context for reviewers
- **Issue tracking** - Link commits to issues via footer

## Troubleshooting

### Issue: "Cannot determine commit type"
- Check what files are staged: `git status`
- Ensure changes are clear (not mixing features, tests, and refactoring)
- Add the file context to your request

### Issue: "Scope is unclear"
- Make sure changes are from a single feature area
- Consider splitting into multiple commits if mixing unrelated changes

### Issue: "Description too long"
- Keep description under 72 characters
- Move detailed explanation to body section
- Focus on WHAT changed, not HOW

## Next Steps

1. **Test the skill** with your current staged changes
2. **Review the generated messages** and provide feedback
3. **Adopt conventional commits** across your team
4. **Set up automated tools** that leverage commit types (semantic-release, conventional-changelog)

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Commit Best Practices](https://git-scm.com/docs/git-commit)
- [Semantic Versioning](https://semver.org/)

## Support

For issues or improvements, refer to the detailed SKILL.md documentation.
