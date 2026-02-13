Perform a comprehensive pre-deployment checklist to verify the codebase is ready for production deployment.

## Pre-Deployment Verification

### Phase 1: Code Quality

#### 1.1 Build Verification

```bash
npm run build
```

- TypeScript compilation must succeed
- No type errors

#### 1.2 Lint Check

```bash
npm run lint
```

- Zero errors allowed
- Review any warnings

### Phase 2: Security Verification

#### 2.1 Sensitive Data

- No API keys in source code
- No hardcoded credentials or secrets
- No debug `console.log` statements in production code
- No PII in logs

#### 2.2 XSS Prevention

- Components using `dangerouslySetInnerHTML` properly sanitize input
- User-provided content is escaped before rendering

### Phase 3: Component Library Verification

#### 3.1 Theme Token Compliance

- All library components use CSS Custom Properties only
- No hardcoded color values in component library
- Token map covers all required tokens

#### 3.1b Visual System Compliance

- CSS patterns produce valid background values for all 14 pattern types
- Section dividers render without overflow at all viewports
- `ImagePlaceholder` renders as CSS gradient fallback (not broken image tags)
- `VisualConfig` flows from spec → AssemblyRenderer → Section props
- Visual vocabulary defaults produce reasonable output for all business types
- Parallax respects `prefers-reduced-motion` and disables on mobile (<768px)

#### 3.2 Component Manifests

- All manifests are valid JSON
- Required fields present: `id`, `name`, `category`, `variants`, `personalityFit`
- Barrel exports up to date

#### 3.3 Preview Page

- All components render correctly with each preset theme
- Theme switching works without errors
- No console errors in browser

### Phase 4: Platform Pages

#### 4.1 Homepage

- All sections render correctly
- CTA links navigate properly
- Animations perform smoothly

#### 4.2 Demo Page

- Intake flow works end to end
- Form validation functions correctly

#### 4.3 Docs Page

- All sections render and navigate correctly
- Code examples display properly

#### 4.4 Preview Page

- Theme selector functions correctly
- All components visible with sample data
- Exit button navigates back to homepage

### Phase 5: Git State

```bash
git status
git log --oneline -5
```

- No uncommitted changes
- All changes pushed to remote
- Clean working directory

## Output Format

```
## Deployment Readiness Report

### Code Quality
| Check | Status | Details |
|-------|--------|---------|
| Build | [PASS/FAIL] | [Clean/Errors] |
| Lint | [PASS/FAIL] | X errors, Y warnings |

### Security
| Check | Status | Details |
|-------|--------|---------|
| Hardcoded Secrets | [PASS/FAIL] | [None/Found] |
| XSS Prevention | [PASS/FAIL] | [Clean/Issues] |

### Component Library
| Check | Status | Details |
|-------|--------|---------|
| Theme Tokens | [PASS/FAIL] | [Compliant/Issues] |
| Visual System | [PASS/FAIL] | [Patterns/Dividers/Placeholders working] |
| Manifests | [PASS/FAIL] | [Valid/Issues] |
| Preview Page | [PASS/FAIL] | [Working/Issues] |

### Platform Pages
| Check | Status | Details |
|-------|--------|---------|
| Homepage | [PASS/FAIL] | [Working/Issues] |
| Demo | [PASS/FAIL] | [Working/Issues] |
| Docs | [PASS/FAIL] | [Working/Issues] |
| Preview | [PASS/FAIL] | [Working/Issues] |

### Git State
| Check | Status | Details |
|-------|--------|---------|
| Clean Working Dir | [PASS/FAIL] | [Clean/Uncommitted] |
| Pushed to Remote | [PASS/FAIL] | [Up to date/Behind] |

## Overall Deployment Status: [READY / NOT READY]

### Blockers (Must Fix Before Deploy)
[List any blocking issues]

### Warnings (Should Review)
[List any non-blocking concerns]
```

## Deployment Commands

When ready to deploy:

```bash
# Vercel deployment is automatic via Git push to main
# Verify deployment at https://easywebsitebuild.com after push

# If Convex backend is active:
# npx convex deploy
```
