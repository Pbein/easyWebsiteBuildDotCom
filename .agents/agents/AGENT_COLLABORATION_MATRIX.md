# Agent Collaboration Matrix

**Purpose**: Define when and how agents collaborate on EasyWebsiteBuild tasks.
**Last Updated**: February 2026

---

## Quick Reference

| Command         | What It Does             | When to Use                      |
| --------------- | ------------------------ | -------------------------------- |
| `/verify`       | Karen quality gate       | After completing any task        |
| `/deploy-ready` | Pre-deployment checklist | Before any production deployment |
| `/ship`         | Stage, commit, push      | When ready to commit changes     |

**Use commands first. Fall back to direct agent calls for complex multi-step coordination.**

---

## Task Routing

| Task Type                | Primary Agent        | Then                                            |
| ------------------------ | -------------------- | ----------------------------------------------- |
| **New component**        | Developer implements | Test Engineer → Karen `/verify`                 |
| **Theme system change**  | Developer implements | Verify all 7 presets → Karen `/verify`          |
| **Assembly engine work** | Developer implements | Test all 18 components render → Karen `/verify` |
| **Intake flow change**   | Developer implements | Test full 9-step flow → Karen `/verify`         |
| **AI integration**       | Developer implements | Test AI + fallback paths → Karen `/verify`      |
| **Export pipeline**      | Developer implements | Test ZIP output → Karen `/verify`               |
| **Bug fix**              | Developer fixes      | Test Engineer verifies → Karen `/verify`        |
| **Phase completion**     | All agents involved  | Karen full reality assessment                   |
| **Pre-deployment**       | Developer            | `/deploy-ready` → Karen `/verify`               |

---

## Collaboration Workflows

### Standard Feature Development

```
1. Developer implements feature
2. Test Engineer creates/updates tests
3. npm run build (must pass)
4. npm run lint (must pass)
5. /verify → Karen verification
```

### Component Library Addition

```
1. Developer builds component (types, manifest, TSX, variants)
2. Register in COMPONENT_REGISTRY + barrel exports + manifest-index
3. Test Engineer validates:
   - All variants render
   - CSS Custom Properties only (no hardcoded colors)
   - Content fields match type interface
   - Works in AssemblyRenderer
   - Works in export pipeline
4. Update /preview page
5. /verify → Karen full component checklist
```

### Theme System Change

```
1. Developer modifies tokens/generation/presets
2. Test all 7 presets render correctly
3. Test emotional overrides still apply
4. Verify all 18 components respond to theme changes
5. /verify → Karen theme verification
```

### AI Integration Change

```
1. Developer updates Convex action (generateQuestions or generateSiteSpec)
2. Test AI path with valid API key
3. Test deterministic fallback (simulate AI failure)
4. Verify content field names match type interfaces
5. Verify brand character context flows through
6. /verify → Karen dual-path verification
```

### Pre-Deployment

```
1. npm run build → zero errors
2. npm run lint → zero warnings
3. /deploy-ready → full checklist
4. /verify → Karen go/no-go decision
```

---

## Karen's Role

Karen is the **final authority** on completion. No task is "done" without Karen's approval.

**Karen verifies:**

- Build and lint pass cleanly
- Components follow library rules (CSS Custom Properties, correct types)
- Content fields match interfaces (the #1 bug source)
- Assembly engine renders correctly
- Theme system works across all presets
- Intake flow manages state correctly
- Export produces valid output
- Design is distinctive, not generic

**How to invoke Karen:**

| Method              | When                                                     |
| ------------------- | -------------------------------------------------------- |
| `/verify` command   | Standard verification (fastest)                          |
| Call Karen directly | Complex validation, deep investigation, phase assessment |

---

## Agent Responsibilities

### Karen (PMO/QA Lead)

- Reviews ALL work from ALL agents and developers
- Determines "actually done" vs "looks done"
- Has veto power over completion claims
- Runs build/lint verification
- Checks component library compliance
- Validates content field accuracy

### Test Engineer

- Creates test suites for new components and features
- Validates theme token compliance
- Tests assembly engine spec-to-render pipeline
- Tests intake flow state management
- Tests export pipeline output
- Identifies edge cases and regression risks

---

## Pre-Work Checklist (All Agents)

### Before Starting Any Task

1. Read `CLAUDE.md` for project architecture and patterns
2. Review relevant source code
3. Check component type interfaces if touching library
4. Plan for Karen verification at completion

### After Completing Any Task

1. Self-review against quality standards
2. `npm run build` — must pass
3. `npm run lint` — must pass
4. Verify in browser (dev server)
5. `/verify` — Karen's final check

---

## Common Mistakes

### Don't Do This

```
Implement component → Mark as done
Result: Hardcoded colors, missing registry entry, wrong content fields
```

### Do This Instead

```
Implement component → Register everywhere → Test variants → Test theming → /verify
Result: Fully integrated, themed, tested, Karen-approved
```

---

## Priority When Multiple Agents Needed

1. **Developer** — implements the feature
2. **Test Engineer** — creates tests
3. **Karen** — final verification (ALWAYS MANDATORY)

Nothing ships without Karen's stamp.

---

**Last Updated**: February 2026
**Review Cadence**: After adding new agents or identifying new patterns
