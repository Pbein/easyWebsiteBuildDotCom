Perform a comprehensive pre-deployment checklist to verify the codebase is ready for production deployment.

## Pre-Deployment Verification

### Phase 1: Code Quality

#### 1.1 Run Full Test Suite

```bash
bun run test:convex
bun run test:frontend
```

- All tests must pass
- Coverage must meet minimums (85%+ overall)

#### 1.2 Build Verification

```bash
bun run build
```

- TypeScript compilation must succeed
- No type errors

#### 1.3 Lint Check

```bash
bun run lint
```

- Zero errors allowed
- Review any warnings

### Phase 2: Security Verification

#### 2.1 Security Wrapper Check

- Verify all Convex functions use `orgQuery`/`orgMutation`
- Verify webhook handlers use `internalMutation`
- Verify premium features have `requirePayment: true`

#### 2.2 Environment Variables

- Verify no hardcoded secrets in code
- Verify all required env vars documented
- Verify PROD vs DEV environment separation

#### 2.3 Sensitive Data

- No API keys in code
- No PII in logs
- No debug console.logs in production code

### Phase 3: Environment Configuration

#### 3.1 Convex Deployment Check

```bash
bunx convex env list --prod
```

- Verify all required env vars are set in production
- Verify production values (sk*live*, pk*live*, etc.)

#### 3.2 Vercel Environment

- Preview deployments working
- Production env vars configured
- Domain configuration correct

### Phase 4: Database & Schema

#### 4.1 Schema Validation

- No pending schema migrations
- Indexes defined for performance-critical queries
- No breaking schema changes without migration plan

#### 4.2 Data Integrity

- Foreign key relationships valid
- No orphaned data patterns

### Phase 5: Feature Flags & Rollback

#### 5.1 Feature Flags

- New features behind flags if needed
- Gradual rollout plan in place

#### 5.2 Rollback Plan

- Previous deployment tagged/identified
- Rollback procedure documented
- Database rollback plan if schema changed

## Output Format

```
## Deployment Readiness Report

### Code Quality
| Check | Status | Details |
|-------|--------|---------|
| Tests | [PASS/FAIL] | X/Y passing |
| Build | [PASS/FAIL] | [Clean/Errors] |
| Lint | [PASS/FAIL] | X errors, Y warnings |

### Security
| Check | Status | Details |
|-------|--------|---------|
| Security Wrappers | [PASS/FAIL] | [All verified/Issues] |
| Environment Vars | [PASS/FAIL] | [No hardcoded/Found] |
| Sensitive Data | [PASS/FAIL] | [Clean/Issues] |

### Environment
| Check | Status | Details |
|-------|--------|---------|
| Convex PROD | [PASS/FAIL] | [All vars set/Missing] |
| Vercel | [PASS/FAIL] | [Configured/Issues] |

### Database
| Check | Status | Details |
|-------|--------|---------|
| Schema | [PASS/FAIL] | [No changes/Migration needed] |
| Indexes | [PASS/FAIL] | [All defined/Missing] |

### Rollback
| Check | Status | Details |
|-------|--------|---------|
| Previous Tag | [READY/NOT READY] | [Tag ID] |
| Procedure | [DOCUMENTED/NEEDED] | [Link] |

## Overall Deployment Status: [READY / NOT READY]

### Blockers (Must Fix Before Deploy)
[List any blocking issues]

### Warnings (Should Review)
[List any non-blocking concerns]

### Post-Deployment Checklist
- [ ] Monitor error rates
- [ ] Check Stripe webhook delivery
- [ ] Verify A2P registration status
- [ ] Test critical user flows
- [ ] Monitor database performance
```

## Deployment Commands

When ready to deploy:

```bash
# 1. Deploy Convex to production
bunx convex deploy --prod

# 2. Verify Vercel deployment
# (Automatic via Git push to main)

# 3. Post-deployment verification
# Run smoke tests against production
```
