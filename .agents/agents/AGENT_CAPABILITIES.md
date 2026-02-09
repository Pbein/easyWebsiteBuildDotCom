# Agent Capabilities Reference

**Purpose**: Quick reference for each agent's strengths, tools, and when to deploy them.
**Last Updated**: February 2026

---

## Agent Roster

### Karen — PMO & Quality Gate

**File**: `karen-pmo-expert.md`
**Invoke**: `/verify` or call directly

**Strengths:**

- Reality assessment — determines what's actually working vs what's claimed
- Component library compliance checking (CSS Custom Properties, type interfaces)
- Content field accuracy validation (the #1 recurring bug in this project)
- Build/lint verification
- Full system integration checks
- No-nonsense completion criteria enforcement

**Use When:**

- Finishing any feature or task
- Before deployment
- When you suspect something is "done" but might not actually work
- Phase completion assessment
- Component library audit

**Output:** Structured reality check with pass/fail for each system, specific file/line references for issues, and actionable completion plan.

---

### Test Engineer — TDD & Coverage

**File**: `tdd-test-engineer.md`
**Invoke**: Call directly

**Strengths:**

- Component variant testing (all 18 components, all variants)
- Theme token compliance testing
- Assembly engine spec-to-render validation
- Intake flow state management testing (bridge pattern, Zustand persistence)
- Export pipeline HTML/CSS output validation
- Content field name accuracy testing
- AI integration dual-path testing (AI + deterministic fallback)
- Edge case identification

**Use When:**

- Adding a new component to the library
- Modifying the theme system
- Changing assembly engine behavior
- Updating intake flow state management
- Modifying AI integration or fallback logic
- Before Karen verification (tests should pass first)

**Output:** Test suites organized by domain, coverage reports highlighting critical paths, specific regression tests for known bug patterns.

---

## When to Use Which Agent

| Situation                               | Agent                                 | Why                            |
| --------------------------------------- | ------------------------------------- | ------------------------------ |
| "Is this feature actually done?"        | Karen                                 | Reality assessment             |
| "Does this component work correctly?"   | Test Engineer → Karen                 | Test first, then verify        |
| "Are all components themed properly?"   | Karen                                 | Library compliance audit       |
| "Do content fields match interfaces?"   | Karen or Test Engineer                | #1 bug source needs validation |
| "Does the intake flow work end-to-end?" | Test Engineer → Karen                 | State management + integration |
| "Is the export valid HTML?"             | Test Engineer                         | Output validation              |
| "Ready to deploy?"                      | Karen via `/deploy-ready` → `/verify` | Full pre-deployment check      |
| "Phase complete?"                       | Karen                                 | Comprehensive reality check    |

---

## Workflow Patterns

### Pattern 1: Build → Test → Verify

```
Developer builds feature
→ Test Engineer writes/updates tests
→ Tests pass
→ /verify (Karen)
→ Done
```

Best for: New features, component additions, system changes.

### Pattern 2: Fix → Verify

```
Developer fixes bug
→ Verifies fix in browser
→ /verify (Karen)
→ Done
```

Best for: Bug fixes, small corrections, content field fixes.

### Pattern 3: Audit → Plan → Fix → Verify

```
Karen assesses current state
→ Produces reality check with issues list
→ Developer fixes issues in priority order
→ /verify (Karen confirms fixes)
→ Done
```

Best for: Phase transitions, pre-deployment, quality audits.

---

## Key Project Systems Each Agent Covers

```
                          Karen    Test Engineer
Component Library (18)      ✅          ✅
Theme System (87 tokens)    ✅          ✅
Assembly Engine             ✅          ✅
Intake Flow (9 steps)       ✅          ✅
AI Integration              ✅          ✅
Export Pipeline              ✅          ✅
Build/Lint                   ✅          —
Browser Verification         ✅          —
Content Field Accuracy       ✅          ✅
Design Quality               ✅          —
```

---

## Adding New Agents

When adding a new agent to the team:

1. Create agent file in `.agents/agents/` with frontmatter (name, description, color)
2. Include EasyWebsiteBuild project context (tech stack, architecture, key systems)
3. Define specific validation criteria for the agent's domain
4. Reference content field accuracy table (if touching components)
5. Add to `AGENT_COLLABORATION_MATRIX.md` task routing table
6. Update this file with the new agent's capabilities
7. Update `TEAM_CHARTER.md` agent roster
8. Have Karen verify the new agent's definition is complete and accurate
