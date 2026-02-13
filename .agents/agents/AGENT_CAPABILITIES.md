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

### JourneyBrain — Business Advisor & Product Strategy

**File**: `journey-brain.md`
**Invoke**: Call directly
**Data source**: `/business/USER_JOURNEY.md` (canonical journey map)

**Strengths:**

- End-to-end user journey mapping and gap identification
- Conversion funnel analysis (drop-off risks, friction points)
- Loading screen optimization (productive use of wait time)
- Pricing strategy and billing trigger recommendations
- Feature prioritization through revenue-impact lens (not tech-cool lens)
- Analytics event naming and measurement plans
- Character capture quality assessment (does a Mexican restaurant look like a Mexican restaurant?)

**Use When:**

- Planning a new feature and need to understand where it fits in the user journey
- Optimizing conversion at any funnel step
- Deciding what to build next (revenue-driven prioritization)
- Designing loading/wait states
- Adding analytics or measurement
- Evaluating whether output quality matches user intent
- Business model or pricing decisions

**Output:** Journey understanding + gaps/risks + prioritized recommendations (each with step ID, friction, proposed change, implementation detail, measurement plan) + patch update to USER_JOURNEY.md.

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
| "What should we build next?"            | JourneyBrain                          | Revenue-driven prioritization  |
| "Where are users dropping off?"         | JourneyBrain                          | Funnel analysis                |
| "How should the loading screen work?"   | JourneyBrain                          | Wait state optimization        |
| "What should pricing look like?"        | JourneyBrain                          | Business model strategy        |
| "Does the output match user intent?"    | JourneyBrain → Karen                  | Quality + journey alignment    |

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
                          Karen    Test Engineer    JourneyBrain
Component Library (18)      ✅          ✅               —
Theme System (87 tokens)    ✅          ✅               —
CSS Visual System            ✅          ✅               —
Assembly Engine             ✅          ✅               —
Intake Flow (9 steps)       ✅          ✅               ✅
AI Integration              ✅          ✅               —
Export Pipeline              ✅          ✅               —
Build/Lint                   ✅          —                —
Browser Verification         ✅          —                —
Content Field Accuracy       ✅          ✅               —
Design Quality               ✅          —                —
User Journey Mapping          —          —                ✅
Conversion Optimization       —          —                ✅
Business Strategy             —          —                ✅
Analytics & Measurement       —          —                ✅
Loading State Design          —          —                ✅
```

**CSS Visual System** covers: 14 CSS patterns, 4 section dividers, 5 decorative elements, ImagePlaceholder (3 variants), visual vocabulary per business type (18+ types), archetype/personality overrides, VisualConfig flow through spec pipeline, pattern/divider rendering in Section component.

---

## Virtual Boardroom — 9 Strategic Personas

The boardroom is a multi-agent debate system invoked via `/boardroom <question>`. Each persona reads domain-specific files, explores the codebase for evidence, and argues from competing incentives. See `BOARDROOM_TENSION_MAP.md` for the 15 adversarial tensions.

### CEO — Strategic Vision Architect

**File**: `boardroom-ceo.md` | **Color**: blue
**Strengths**: Moat analysis, differentiation strategy, priority setting, long-term valuation thinking
**Use When**: Assessing defensibility, resolving cross-functional disagreements, setting quarterly priorities

### CMO — Growth Strategist

**File**: `boardroom-cmo.md` | **Color**: green
**Strengths**: SEO (platform + generated sites), brand positioning, CAC analysis, channel strategy, funnel top
**Use When**: Planning growth, evaluating homepage messaging, assessing marketing channels

### CRO — Conversion Architect

**File**: `boardroom-cro.md` | **Color**: orange
**Strengths**: Funnel friction analysis, drop-off identification, wow moment optimization, click-path counting
**Use When**: Analyzing intake flow drop-off, optimizing preview reveal, evaluating step necessity

### Product — Product Architect (Character Capture)

**File**: `boardroom-product.md` | **Color**: purple
**Strengths**: Character-to-output tracing, variant differentiation analysis, output quality assessment, component strategy
**Use When**: Evaluating whether character data affects output, comparing AI vs deterministic quality, planning component library

### Infra — Technical Infrastructure Strategist

**File**: `boardroom-infra.md` | **Color**: gray
**Strengths**: Per-session cost modeling, API token analysis, scalability assessment, bundle size, caching strategy
**Use When**: Estimating AI costs, evaluating Convex table growth, optimizing prompts for cost, assessing performance

### Monetization — Monetization Architect

**File**: `boardroom-monetization.md` | **Color**: gold
**Strengths**: Tier design, feature gating strategy, LTV analysis, pricing model evaluation, revenue projections
**Use When**: Designing free/paid boundaries, evaluating subscription vs one-time pricing, planning upsell paths

### Competitive — Competitive Intelligence Analyst

**File**: `boardroom-competitive.md` | **Color**: crimson
**Strengths**: Feature parity matrices, competitor tracking, market velocity, table-stakes gap identification
**Use When**: Comparing against Wix/Framer/10Web, identifying critical missing features, assessing shipping velocity

### Partnerships — Partnerships & Integrations Lead

**File**: `boardroom-partnerships.md` | **Color**: cyan
**Strengths**: Integration prioritization, build-vs-embed decisions, ecosystem stickiness scoring, upsell ladder design
**Use When**: Evaluating which integrations to add, assessing third-party dependencies, planning the integration tier roadmap

### UX Psych — UX Behavioral Psychologist

**File**: `boardroom-ux-psych.md` | **Color**: magenta
**Strengths**: IKEA effect, Zeigarnik effect, Peak-End rule, cognitive load analysis, emotional journey mapping
**Use When**: Evaluating loading screens, debating step count, assessing trust signals, optimizing micro-celebrations

---

### Boardroom Routing

| Strategic Question                | Key Personas                       | Why                              |
| --------------------------------- | ---------------------------------- | -------------------------------- |
| "What should we build next?"      | CEO + Competitive + Product        | Strategy + market + depth        |
| "How do we increase conversions?" | CRO + UX Psych + CMO               | Funnel + psychology + traffic    |
| "What should pricing look like?"  | Monetization + CRO + Competitive   | Revenue + conversion + market    |
| "What are our AI costs at scale?" | Infra + Product + Monetization     | Costs + quality + revenue        |
| "Which integrations matter?"      | Partnerships + Infra + Competitive | Ecosystem + complexity + parity  |
| "Is our output good enough?"      | Product + Competitive + UX Psych   | Quality + market + perception    |
| "Full strategic review"           | All 9 via `/boardroom`             | Comprehensive adversarial debate |

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
