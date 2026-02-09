Run the complete test suite and provide a comprehensive report.

## Test Execution

Execute the following test suites in order:

### 1. Backend Tests (Convex)

```bash
bun run test:convex
```

- Tests Convex functions, mutations, actions
- Uses Vitest with convex-test
- Target: 95%+ coverage for critical paths

### 2. Frontend Tests

```bash
bun run test:frontend
```

- Tests React components with Testing Library
- Uses Jest
- Target: 85%+ coverage

### 3. Linting

```bash
bun run lint
```

- ESLint checks
- Should have zero errors

### 4. Type Checking

```bash
bun run build
```

- TypeScript compilation
- Should compile without errors

### 5. Specific Test Categories (if relevant)

```bash
bun run test:ai          # AI-related tests
bun run test:sms         # SMS compliance tests
bun run test:stripe      # Stripe webhook tests
bun run test:security    # Security & RBAC tests
bun run test:hooks       # React hooks tests
```

## Output Format

```
## Test Suite Report

### Backend Tests (Convex)
- **Status**: [PASS/FAIL]
- **Tests**: X passing, Y failing, Z skipped
- **Coverage**: X%
- **Duration**: Xs

#### Failing Tests (if any)
| Test | Error |
|------|-------|
| [test name] | [error message] |

### Frontend Tests
- **Status**: [PASS/FAIL]
- **Tests**: X passing, Y failing, Z skipped
- **Coverage**: X%
- **Duration**: Xs

#### Failing Tests (if any)
| Test | Error |
|------|-------|
| [test name] | [error message] |

### Linting
- **Status**: [PASS/FAIL]
- **Errors**: X
- **Warnings**: Y

### Type Checking
- **Status**: [PASS/FAIL]
- **Errors**: X

## Summary

| Suite | Status | Pass Rate |
|-------|--------|-----------|
| Convex | [PASS/FAIL] | X% |
| Frontend | [PASS/FAIL] | X% |
| Lint | [PASS/FAIL] | - |
| Types | [PASS/FAIL] | - |

### Overall: [ALL PASSING / X FAILURES]

### Recommended Fixes
[If there are failures, list recommended fixes for each]
```

## Coverage Goals

- **Critical paths** (billing, auth, security): 95%+
- **Business logic** (campaigns, contacts): 85%+
- **UI components**: 80%+
- **Utilities**: 75%+
