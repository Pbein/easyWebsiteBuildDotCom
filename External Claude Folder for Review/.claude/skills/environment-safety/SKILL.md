---
name: environment-safety
description: Prevents production environment accidents when working with Convex deployments and environment variables. Auto-applies when running bunx convex commands or editing .env files.
allowed-tools:
  - Read
  - Bash
  - Grep
---

# Environment Safety

This skill prevents accidental production environment modifications.

## Deployment Identifiers

| Environment     | Deployment Name         | URL                                          |
| --------------- | ----------------------- | -------------------------------------------- |
| **PRODUCTION**  | `gallant-blackbird-7`   | `https://gallant-blackbird-7.convex.cloud`   |
| **DEVELOPMENT** | `grateful-hedgehog-640` | `https://grateful-hedgehog-640.convex.cloud` |

## Critical Rules

### 1. ALWAYS Use CLI Flags (Not Env Vars)

```bash
# PRODUCTION - Use --prod flag
bunx convex env set STRIPE_SECRET_KEY "sk_live_..." --prod
bunx convex env list --prod

# DEVELOPMENT - No flag needed (default)
bunx convex env set STRIPE_SECRET_KEY "sk_test_..."
bunx convex env list

# Specific deployment by name
bunx convex env set KEY VALUE --deployment-name gallant-blackbird-7
```

### 2. NEVER Use CONVEX_DEPLOYMENT for Targeting

```bash
# WRONG - Unreliable!
CONVEX_DEPLOYMENT=prod:gallant-blackbird-7 bunx convex env set ...

# WRONG - No flag = goes to DEV, not PROD!
bunx convex env set STRIPE_SECRET_KEY "sk_live_..."  # Goes to DEV!
```

### 3. Environment Variable Prefixing

ALL environment variables in `.env` MUST use prefixes:

```bash
# CORRECT - Properly prefixed
PROD_STRIPE_SECRET_KEY=sk_live_...
DEV_STRIPE_SECRET_KEY=sk_test_...
PROD_TWILIO_ACCOUNT_SID=AC...
DEV_TWILIO_ACCOUNT_SID=AC...

# WRONG - Missing prefix (DELETE these if found!)
STRIPE_SECRET_KEY=sk_test_...
```

### 4. Key Value Patterns

| Variable                 | PROD Pattern       | DEV Pattern      |
| ------------------------ | ------------------ | ---------------- |
| `STRIPE_SECRET_KEY`      | `sk_live_...`      | `sk_test_...`    |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...`      | `pk_test_...`    |
| `WORKOS_API_KEY`         | Production key     | Staging key      |
| `TWILIO_*`               | Production account | Test/dev account |

### 5. Verification Before Setting

**Before updating Convex environment variables:**

```bash
# 1. List current values to see what exists
bunx convex env list --prod  # or without flag for dev

# 2. Verify you're targeting the RIGHT deployment
# PROD = gallant-blackbird-7
# DEV = grateful-hedgehog-640

# 3. Double-check value pattern
# PROD: sk_live_, pk_live_, production URLs
# DEV: sk_test_, pk_test_, staging URLs

# 4. Set the value with explicit flag
bunx convex env set KEY VALUE --prod

# 5. Verify after setting
bunx convex env get KEY --prod
```

### 6. Protected Files

These files require extra caution:

- `.env` - Single source of truth for all env vars
- `.env.keys` - dotenvx encryption keys (NEVER commit)
- `convex.json` - Deployment configuration

## Validation Checklist

Before any environment operation:

- [ ] Am I targeting the RIGHT deployment? (prod vs dev)
- [ ] PROD values have `live` or production credentials?
- [ ] DEV values have `test` or staging credentials?
- [ ] Using CLI flags (not CONVEX_DEPLOYMENT env var)?
- [ ] Verified after setting with `bunx convex env get`?

## Recovery

If you accidentally set wrong values:

```bash
# Immediately set correct value
bunx convex env set KEY "correct_value" --prod

# Verify the fix
bunx convex env get KEY --prod
```

## Reference Files

- **Environment config**: `.env`
- **Encryption keys**: `.env.keys` (local only, never commit)
- **Deployment config**: `convex.json`
- **Documentation**: `docs/ENV_FILE_STANDARD.md`
