# my-skills

Personal Claude Code skills collection.

## Install a skill

```bash
npx github:stngcoding/my-skills add meaningful-git-commit
```

## List available skills

```bash
npx github:stngcoding/my-skills list
```

## Skills

| Skill | Description |
|-------|-------------|
| [meaningful-git-commit](./skills/meaningful-git-commit/SKILL.md) | Generate clear, maintainable git commit messages using conventional commit format |

## Adding more skills

Copy a skill directory into `skills/` and push to GitHub:

```bash
cp -r ~/.claude/skills/my-skill skills/
git add skills/my-skill
git commit -m "feat: add my-skill"
git push
```
