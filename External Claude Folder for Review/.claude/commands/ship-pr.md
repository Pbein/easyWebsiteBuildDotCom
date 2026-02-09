Stage all changes, commit, push, and create a PR with smart branch targeting.

## Usage

```
/ship-pr [commit message / PR title]
```

If no message provided, **auto-generate one** from the changes.

## Smart Branch Targeting

Automatically determines PR target based on current branch:

| Current Branch        | PR Target | Rationale                          |
| --------------------- | --------- | ---------------------------------- |
| `feature/*`, `feat/*` | `dev`     | Feature work goes to dev first     |
| `fix/*`, `bugfix/*`   | `dev`     | Bug fixes go to dev first          |
| `dev`                 | `test`    | Dev promotes to test               |
| `test`                | `main`    | Test promotes to main (production) |
| `hotfix/*`            | `main`    | Hotfixes go direct to production   |
| `release/*`           | `main`    | Releases go to production          |
| Any other branch      | `main`    | Default fallback                   |

## Execution Steps

### Step 1: Determine Current Branch and Target

```bash
CURRENT=$(git branch --show-current)
```

Apply targeting logic:

```bash
case "$CURRENT" in
  feature/*|feat/*) TARGET="dev" ;;
  fix/*|bugfix/*) TARGET="dev" ;;
  dev) TARGET="test" ;;
  test) TARGET="main" ;;
  hotfix/*|release/*) TARGET="main" ;;
  *) TARGET="main" ;;
esac
```

**Show the user**: "Will create PR: `$CURRENT` → `$TARGET`"

### Step 2: Stage All Changes

```bash
git add -A
```

If no changes, skip to PR creation (maybe just need to create PR for existing commits).

### Step 3: Generate Commit Message (if not provided)

If user didn't provide a message, analyze the changes and generate one:

1. **Get the diff summary**:

   ```bash
   git diff --cached --stat
   git diff --cached
   git log $TARGET..HEAD --oneline  # Include existing commits
   ```

2. **Analyze changes to determine**:
   - **Type**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `style`
   - **Scope**: Primary folder/domain affected
   - **Description**: What changed (imperative mood, max 50 chars)

3. **Generate conventional commit format**:

   ```
   <type>(<scope>): <description>

   - <bullet point 1>
   - <bullet point 2>
   ```

**Commit Type Guidelines**:

| Type       | When to Use                              |
| ---------- | ---------------------------------------- |
| `feat`     | New feature or capability                |
| `fix`      | Bug fix                                  |
| `refactor` | Code change that neither fixes nor adds  |
| `docs`     | Documentation only                       |
| `test`     | Adding or updating tests                 |
| `chore`    | Maintenance, deps, config                |
| `perf`     | Performance improvement                  |
| `style`    | Formatting, whitespace (no logic change) |

**Show the generated message to user before committing**.

### Step 4: Commit with Auto-Fix Loop (up to 3 attempts)

```bash
git commit -m "<message>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

If pre-commit fails:

1. Run `bun run lint --fix`
2. Re-stage: `git add -A`
3. Retry commit

### Step 5: Ensure Branch is Tracked by Graphite

```bash
gt branch info 2>&1 || gt track --parent $TARGET
```

### Step 6: Submit with Graphite (Push + Create/Update PR)

Use Graphite to push and create/update PR (enables AI code reviews):

```bash
gt submit -m "<message>"
```

This single command will:

- Push the branch to remote
- Create or update the PR
- Enable Graphite AI code reviews automatically

If you need to add a detailed body:

```bash
gt submit -m "<message>" --body "$(cat <<'EOF'
## Summary
<generated from commits>

## Changes
<files changed summary>

## Test Plan
- [ ] Verify changes work as expected
- [ ] Run relevant tests

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### Step 7: Check PR Status

```bash
gt log short
```

If Graphite submit fails, fall back to gh:

```bash
git push -u origin $(git branch --show-current)
gh pr create \
  --base $TARGET \
  --title "<message>" \
  --body "..."
```

### Step 8: Report Result

Show PR URL and next steps.

## Output Format

```
## Ship & PR Report

### Git Operations
- Staged: X files
- Committed: <short hash> "<message>"
- Pushed: <branch> → origin/<branch>

### Pull Request
- **Source**: <current-branch>
- **Target**: <target-branch> (auto-detected)
- **Title**: <message>
- **URL**: <pr-url>
- **Number**: #<number>

## Result: SHIPPED & PR CREATED ✅

Next: Review at <pr-url>
```

## Override Target

User can override auto-detection:

```
/ship-pr --base main Fix critical bug in production
```

This forces PR target to `main` regardless of branch name.

## Error Handling

| Error                       | Resolution                                 |
| --------------------------- | ------------------------------------------ |
| On main/test/dev directly   | Warn user, suggest creating feature branch |
| Target branch doesn't exist | Show error, list available branches        |
| Pre-commit fails 3x         | Show errors, ask user to fix manually      |
| PR already exists           | Show existing PR URL, offer to open        |

## Safety Rules

- **NEVER** skip pre-commit hooks
- **NEVER** force push
- **ALWAYS** show target branch before creating PR
- **ALWAYS** return PR URL when done
