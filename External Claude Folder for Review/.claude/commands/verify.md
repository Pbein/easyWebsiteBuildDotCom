Use the **karen** agent to verify the current task is complete and production-ready.

## Verification Checklist

Please verify ALL of the following:

### 1. Tests Pass

- Run `bun run test:convex` for backend tests
- Run `bun run test:frontend` for frontend tests
- Report any failures with error messages

### 2. Build Succeeds

- Run `bun run build` to verify TypeScript compilation
- No type errors should exist

### 3. Security Patterns Followed

- All Convex functions use `orgQuery`/`orgMutation` wrappers (NOT bare `query`/`mutation`)
- All functions include `organizationId: v.id("organizations")` in args
- Premium features use `requirePayment: true`
- Webhook handlers use `internalMutation`
- No cross-tenant data access possible

### 4. Code Quality

- No `console.log` statements left in code (except intentional logging)
- No TODO comments left unaddressed
- No commented-out code
- Proper error handling in place

### 5. Documentation

- If new patterns were introduced, are they documented?
- If APIs changed, is the change reflected in docs?

## Output Format

Provide a structured report:

```
## Verification Report

### Tests: [PASS/FAIL]
- Convex tests: X/Y passing
- Frontend tests: X/Y passing

### Build: [PASS/FAIL]
- TypeScript compilation: [OK/ERRORS]

### Security: [PASS/FAIL]
- Security wrappers: [All functions checked]
- Issues found: [None/List issues]

### Code Quality: [PASS/FAIL]
- Console.logs: [None found/X found]
- TODOs: [None/X found]

### Documentation: [PASS/FAIL]
- Updates needed: [None/List]

## Overall: [READY/NOT READY]
[Summary and any required actions before shipping]
```
