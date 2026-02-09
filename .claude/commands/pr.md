Create a pull request from the current branch to main.

## Usage

```
/pr [title]
```

If no title provided, **auto-generate one** from the changes.

## Execution Steps

### Step 1: Verify Branch State

```bash
git status
git branch --show-current
```

- Ensure not on `main` or `master` branch
- Check for uncommitted changes - if any, ask user if they want to `/ship` first

### Step 2: Ensure Branch is Pushed

```bash
git push -u origin $(git branch --show-current)
```

### Step 3: Analyze Changes for PR Description

Run these in parallel to understand the full scope:

```bash
# All commits on this branch
git log main..HEAD --oneline

# Full diff from main
git diff main...HEAD --stat
git diff main...HEAD
```

### Step 4: Generate PR Title and Description

If user didn't provide a title, analyze the changes and generate one:

1. **Analyze changes to determine**:
   - **Type**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`
   - **Scope**: Primary folder/domain affected
   - **Description**: What changed (imperative mood, max 50 chars)

2. **Generate conventional commit format for title**:
   ```
   <type>(<scope>): <description>
   ```

**Commit Type Guidelines**:

| Type       | When to Use                             |
| ---------- | --------------------------------------- |
| `feat`     | New feature or capability               |
| `fix`      | Bug fix                                 |
| `refactor` | Code change that neither fixes nor adds |
| `docs`     | Documentation only                      |
| `test`     | Adding or updating tests                |
| `chore`    | Maintenance, deps, config               |
| `perf`     | Performance improvement                 |

**Title**: User-provided or generated (imperative mood, 50 chars max)

**Body Template**:

```markdown
## Summary

<2-4 bullet points describing what this PR does>

## Changes

<List key files/areas modified>

## Test Plan

- [ ] <Checklist of testing steps>

---

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Step 5: Create PR

```bash
gh pr create --title "<title>" --body "$(cat <<'EOF'
<generated body>
EOF
)"
```

### Step 6: Report Result

Show the PR URL and key details.

## Output Format

```
## Pull Request Created

### Branch
- Source: <current-branch>
- Target: main

### Commits Included
<list of commits>

### PR Details
- **Title**: <title>
- **URL**: <pr-url>
- **Number**: #<number>

## Next Steps
- Review: <pr-url>
- Merge when ready
```

## Options

If user says `/pr --draft`:

```bash
gh pr create --draft --title "..." --body "..."
```

If user says `/pr --base <branch>`:

- Use specified branch instead of main

## Error Handling

| Error                    | Resolution                                  |
| ------------------------ | ------------------------------------------- |
| Not logged into gh       | Run `gh auth login`                         |
| No commits ahead of main | Inform user, nothing to PR                  |
| On main branch           | Ask user to create/switch to feature branch |
| Uncommitted changes      | Offer to run `/ship` first                  |

## Safety Rules

- **NEVER** create PR from main to main
- **ALWAYS** show the commits being included before creating
- **ALWAYS** return the PR URL when done
