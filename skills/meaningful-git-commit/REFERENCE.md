# Quality Standards & Error Prevention

## Quality Standards

### Do's ✅
- Use present tense: "add feature" not "added feature"
- Be specific: "fix null reference in chat input" not "fix bug"
- Reference issues: "Closes #123"
- Explain WHY in body, not description
- Keep scope singular and focused
- Use lowercase except proper nouns

### Don'ts ❌
- Don't mix unrelated changes (split into multiple commits)
- Don't use vague descriptions ("update", "fix", "change")
- Don't include ticket numbers in description (use footer)
- Don't put implementation details in description
- Don't write in past tense
- Don't use multiple scopes

## Error Prevention

### Scope Issues
- **Too broad:** `feat: updated application` (which part?)
- **Too many:** `feat(auth,chat,ui)` (split into 3 commits)
- **Too specific:** `feat(message_bubble_widget)` (use feature, `feat(chat)`)

### Type Mismatches
- **Looks like fix but is refactor:** `fix(perf): optimize list rendering`
  - Better: `perf(chat): optimize message list rendering`
- **Mixes types:** Feature + test in one commit
  - Better: Split into `feat(chat): ...` and `test(chat): ...`

### Description Problems
- **Imperative issue:** "Fixed the bug" → should be "Fix the bug"
- **Too long:** Goes over 72 chars → move details to body
- **Missing context:** "Add widget" → "Add message bubble widget"

## Integration

This skill integrates with:
- **Git workflow** - Stage files before generating commits
- **Repository standards** - Follows semantic versioning convention
- **CI/CD systems** - Enables automated changelog and release generation
- **Code review process** - Provides clear context for reviewers
- **AI agents** - Writes messages agent-readable for code understanding

## Next Steps

After creating commits:
1. Review commit history: `git log --oneline -n 10`
2. Verify message clarity: `git show <commit-hash>`
3. Push to remote when ready: `git push origin <branch>`
4. Use commit messages for code review context
5. Track issue relationships via footers

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Commit Best Practices](https://git-scm.com/docs/git-commit)
- [Semantic Versioning](https://semver.org/)
