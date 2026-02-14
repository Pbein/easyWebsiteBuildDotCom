# Boardroom Process & Governance

> How boardroom sessions are run, logged, and reconciled with existing strategy.

---

## Purpose

The Virtual Boardroom is a 9-persona strategic debate system that produces grounded, adversarially-tested decisions for EasyWebsiteBuild. Every session produces actionable priorities that must be reconciled with existing strategic documents before implementation begins.

## Directory Structure

```
business/boardroom/
├── PROCESS.md              ← This file: governance and reconciliation rules
├── DECISIONS_LOG.md        ← Running log of all decisions, status, and outcomes
├── STRATEGIC_PRINCIPLES.md ← Core principles that all decisions must align to
└── sessions/
    └── YYYY-MM-DD-topic.md ← Individual session transcripts
```

## Session Lifecycle

### 1. Pre-Session: Context Loading

Before any boardroom session begins, the facilitator MUST:

- Read `business/boardroom/STRATEGIC_PRINCIPLES.md` — non-negotiable alignment check
- Read `business/boardroom/DECISIONS_LOG.md` — what has already been decided
- Read `docs/STRATEGIC_ROADMAP.md` — current technical/business roadmap
- Read `business/HORMOZI_ANALYSIS.md` — revenue-first lens
- Read `business/USER_JOURNEY.md` — current user experience reality

This ensures every new session builds on past decisions rather than contradicting them.

### 2. During Session: The 4-Round Protocol

| Round                          | Purpose                                         | Output                                              |
| ------------------------------ | ----------------------------------------------- | --------------------------------------------------- |
| **R1: CEO Frames**             | Anchors debate in codebase reality              | Current state, success metrics, constraints, stakes |
| **R2: 9 Personas Present**     | Each presents strategy with codebase evidence   | 9 strategies with top-3 actions each                |
| **R3: Adversarial Cross-Exam** | Personas challenge each other (min 6 exchanges) | Tensions identified, compromises reached            |
| **R4: Decision Output**        | Synthesized priorities with implementation plan | Top 3 priorities, risk table, KPIs, timeline        |

### 3. Post-Session: Reconciliation (CRITICAL)

After every session, before any implementation begins:

#### Step A: Save the Session

- Save transcript to `business/boardroom/sessions/YYYY-MM-DD-topic.md`

#### Step B: Reconciliation Check

Compare new decisions against:

1. **STRATEGIC_PRINCIPLES.md** — Does this decision align with core principles?
   - If YES: proceed
   - If NO: the session must explicitly document WHY the principle is being overridden, and the principle document must be updated

2. **DECISIONS_LOG.md** — Does this contradict any active decision?
   - If NO conflict: add new decisions to the log
   - If CONFLICT: document the conflict, the reasoning for the change, and mark the old decision as `SUPERSEDED` with a reference to the new session
   - If EVOLUTION: mark the old decision as `EVOLVED` and note what changed and why

3. **STRATEGIC_ROADMAP.md** — Does the implementation sequence fit the current roadmap?
   - If YES: update roadmap with new phase/items
   - If REORDER: document why priorities shifted
   - If NEW PHASE: add it with clear dependencies

#### Step C: Update All Affected Documents

After reconciliation, update:

- `DECISIONS_LOG.md` — add new entries
- `STRATEGIC_PRINCIPLES.md` — if principles evolved
- `docs/STRATEGIC_ROADMAP.md` — if roadmap changed
- `docs/ROADMAP.md` — if development phases changed
- `docs/EPICS_AND_STORIES.md` — if new epics/stories were defined

#### Step D: Flag Unresolved Tensions

Any boardroom tension that was NOT resolved must be:

- Logged in `DECISIONS_LOG.md` with status `NEEDS_DATA`
- Assigned a trigger condition ("revisit when we have X data")
- Reviewed at the start of the next relevant boardroom session

---

## Decision Statuses

| Status       | Meaning                                                        |
| ------------ | -------------------------------------------------------------- |
| `ACTIVE`     | Currently being implemented or guiding decisions               |
| `COMPLETED`  | Fully implemented and verified                                 |
| `SUPERSEDED` | Replaced by a newer decision (link to replacement)             |
| `EVOLVED`    | Core intent preserved but approach changed (link to evolution) |
| `DEFERRED`   | Intentionally postponed with trigger condition                 |
| `NEEDS_DATA` | Cannot be resolved without more information                    |
| `REJECTED`   | Considered and explicitly rejected with reasoning              |

## Conflict Resolution Rules

When new decisions conflict with past decisions:

0. **User delight is the foundational constraint (P0)** — any decision that degrades user experience must justify itself against the Delight Champion's challenge. The burden of proof is on the proposer.
1. **Revenue-impact decisions take precedence** over feature-scope decisions (Hormozi principle: revenue validates) — but only when P0 is satisfied
2. **User-facing improvements take precedence** over internal tooling (unless tooling is blocking user-facing work)
3. **Simpler implementations take precedence** over architecturally pure ones (solo developer constraint)
4. **The most recent boardroom consensus takes precedence** over individual persona opinions from past sessions
5. **Core principles are HARD constraints** — overriding them requires explicit rationale and principle document update

## When to Convene the Boardroom

- Before any new major phase begins
- When a strategic pivot is being considered
- When competitive landscape shifts significantly
- When user data contradicts current assumptions
- When scope/priority conflicts arise between active work streams
- Quarterly strategic review (even if no crisis)

## Personas

| Persona                       | Focus                           | Tension Role                       | Authority         |
| ----------------------------- | ------------------------------- | ---------------------------------- | ----------------- |
| **Delight Champion**          | User joy, product love, craft   | Challenges anything that kills joy | **ELEVATED (P0)** |
| CEO (Marcus Chen)             | Strategic vision, sequencing    | Balances speed vs depth            | Standard          |
| CMO (Sierra Washington)       | Growth, virality, brand         | Pushes for generosity and reach    | Standard          |
| CRO (Diego Morales)           | Conversion, funnel optimization | Pushes for fewer steps, more CTAs  | Standard          |
| Product (Amara Okafor)        | Character system, AI quality    | Pushes for depth and coherence     | Standard          |
| Infra (Viktor Petrov)         | Cost, performance, scalability  | Pushes for sustainability          | Standard          |
| Monetization (Priya Sharma)   | Revenue, pricing, tiers         | Pushes for capture and gates       | Standard          |
| Competitive (James Whitfield) | Market position, feature parity | Pushes for speed and matching      | Standard          |
| Partnerships (Elena Vasquez)  | Integrations, ecosystem         | Pushes for connectivity            | Standard          |
| UX Psych (Dr. Miriam Sato)    | Behavior, emotion, psychology   | Pushes for journey quality         | Standard          |
