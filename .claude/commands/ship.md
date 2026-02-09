Stage all changes, commit, and push with automatic pre-commit hook fix loop.

## Usage

```
/ship [commit message]
```

If no message provided, **auto-generate one** from the staged changes.

## Execution Steps

### Step 1: Check for Changes

```bash
git status --porcelain
```

If no changes, inform user "Nothing to commit" and stop.

### Step 2: Stage All Changes

```bash
git add -A
```

### Step 3: Generate Commit Message (if not provided)

If user didn't provide a commit message, analyze the changes and generate one:

1. **Get the diff summary**:

   ```bash
   git diff --cached --stat
   git diff --cached
   ```

2. **Analyze changes to determine**:
   - **Type**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `style`
   - **Scope**: Primary folder/domain affected (e.g., `components`, `theme`, `preview`, `docs`)
   - **Description**: What changed and why (imperative mood, max 50 chars)

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

### Step 4: Attempt Commit (with retry loop)

Attempt the commit up to **3 times**. If pre-commit hook fails:

1. **Identify the issue** from the error output (usually eslint or prettier)
2. **Auto-fix** by running:
   ```bash
   npm run lint -- --fix
   ```
3. **Re-stage** any auto-fixed files:
   ```bash
   git add -A
   ```
4. **Retry** the commit

### Step 5: Commit Format

Use this commit format:

```bash
git commit -m "$(cat <<'EOF'
<user's or generated commit message>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### Step 6: Push

After successful commit:

```bash
git push
```

If push fails due to remote changes:

```bash
git pull --rebase && git push
```

## Error Handling

### Pre-commit Hook Failures

Common issues and fixes:

| Error Type          | Auto-Fix Command                      |
| ------------------- | ------------------------------------- |
| ESLint errors       | `npm run lint -- --fix`               |
| Prettier formatting | `npx prettier --write .`              |
| TypeScript errors   | Show errors, ask user to fix manually |

### Unfixable Errors

If after 3 attempts the commit still fails:

1. Show the remaining errors clearly
2. List the files with issues
3. Ask user: "Would you like me to fix these issues?"

## Output Format

```
## Ship Report

### Changes Staged
- X files modified
- Y files added
- Z files deleted

### Pre-commit Status
- Attempt 1: [PASS/FAIL - reason]
- Attempt 2: [PASS/FAIL - reason] (if needed)
- Attempt 3: [PASS/FAIL - reason] (if needed)

### Commit
- Message: "<commit message>"
- Hash: <short hash>

### Push
- Status: [SUCCESS/FAILED]
- Branch: <branch> -> origin/<branch>

## Result: [SHIPPED / BLOCKED]
```

## Safety Rules

- **NEVER** use `--no-verify` to skip hooks
- **NEVER** force push without explicit user permission
- **NEVER** commit `.env` files or secrets
- **ALWAYS** show what's being committed before proceeding
