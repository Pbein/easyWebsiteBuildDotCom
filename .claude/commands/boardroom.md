Convene the Virtual Boardroom — a 9-persona strategic debate system — to analyze the following question:

**$ARGUMENTS**

---

## Execution Protocol

You are orchestrating a 4-round structured debate among 9 executive personas, each with competing incentives and adversarial tensions. Every claim must be grounded in the actual EasyWebsiteBuild codebase.

### Round 1 — CEO Sets the Objective

Read these files first:

- `docs/STRATEGIC_ROADMAP.md`
- `docs/ROADMAP.md`
- `CLAUDE.md`

Then frame the debate:

```markdown
## 🎯 Boardroom Session: [Strategic Question]

### Current State (from codebase)

- Phase: [current phase from CLAUDE.md]
- Components: [count from manifest-index]
- Presets: [count from presets.ts]
- Intake steps: [count]
- Key infrastructure: [Convex, Claude SDK, export pipeline status]

### Success Metric

[How we'll measure whether this question is answered well]

### Constraints

[Budget, timeline, technical, competitive — from STRATEGIC_ROADMAP.md]

### Stakes

[What happens if we get this wrong]
```

---

### Round 2 — Strategy Presentations (All 9 Personas)

For each persona, read their mandatory files (listed in their agent definition in `.agents/agents/boardroom-*.md`), explore the codebase for evidence, then present their strategy.

**Each persona presents:**

#### [Persona Name] — [Title]

**Codebase Evidence**: [Specific files and findings from their mandatory reading + exploration]

**Strategy** (2-3 paragraphs): Their recommended approach to the strategic question, grounded in their domain expertise and codebase evidence.

**Top 3 Actions**:

1. [Action] — [Expected impact] — [Who implements]
2. [Action] — [Expected impact] — [Who implements]
3. [Action] — [Expected impact] — [Who implements]

**Risk If Ignored**: [What happens if this perspective is overruled]

---

**Present all 9 personas in this order:**

1. **CEO** (blue) — Strategic Vision Architect
2. **CMO** (green) — Growth Strategist
3. **CRO** (orange) — Conversion Architect
4. **Product** (purple) — Product Architect (Character Capture)
5. **Infra** (gray) — Technical Infrastructure Strategist
6. **Monetization** (gold) — Monetization Architect
7. **Competitive** (crimson) — Competitive Intelligence Analyst
8. **Partnerships** (cyan) — Partnerships & Integrations Lead
9. **UX Psych** (magenta) — UX Behavioral Psychologist

---

### Round 3 — Adversarial Cross-Examination

This is the critical round. Personas challenge each other based on their competing incentives. Generate **minimum 6 exchanges** where personas directly confront each other.

**Format each exchange:**

> **[Persona A] challenges [Persona B]:**
> "[Specific challenge citing codebase evidence or metrics]"
>
> **[Persona B] responds:**
> "[Defense or concession, also citing evidence]"

**Required tension pairs to explore** (select at least 6):

| Tension                   | A → B                  | Core Disagreement                         |
| ------------------------- | ---------------------- | ----------------------------------------- |
| Traffic vs Funnel         | CMO → CRO              | More users vs better conversion           |
| Traffic vs Margin         | CMO → Infra            | Growth costs vs profitability             |
| Depth vs Breadth          | Product → CEO          | Deeper character capture vs more features |
| Steps vs Speed            | Product → CRO          | 9 rich steps vs reduce friction           |
| Generosity vs Revenue     | CMO/CRO → Monetization | Free growth vs capture revenue            |
| Rich Prompts vs Costs     | Product → Infra        | Better output vs token economics          |
| Integration vs Focus      | Partnerships → CEO     | Ecosystem stickiness vs AI moat           |
| Integration vs Simplicity | Partnerships → Infra   | More connections vs failure modes         |
| Parity vs Differentiation | Competitive → Product  | Match features vs go deeper               |
| Polish vs Performance     | UX Psych → Infra       | Animations vs page load                   |
| Emotion vs Conversion     | UX Psych → CRO         | Journey richness vs fewer steps           |
| Ship Fast vs Stay Focused | Competitive → CEO      | Velocity vs strategy                      |
| Free Wow vs Paid Gate     | CRO → Monetization     | Prove value free vs gate early            |
| Intelligence vs Ecosystem | CEO → Partnerships     | AI moat vs integration moat               |
| Velocity vs Depth         | Competitive → Product  | Feature count vs output quality           |

---

### Round 4 — Decision Output

Synthesize all perspectives into actionable decisions:

```markdown
## 📋 Boardroom Decision — [Question]

### Top 3 Priorities

#### Priority 1: [Title]

- **Champion**: [Persona who proposed this]
- **Opponents**: [Who disagreed and why]
- **Resolution**: [How the tension was resolved]
- **Implementation**: [Specific files to modify, features to build]
- **KPI**: [How to measure success]
- **Timeline**: [Week-by-week plan]

#### Priority 2: [Title]

[Same structure]

#### Priority 3: [Title]

[Same structure]

### Risk Table

| Risk | Raised By | Severity     | Mitigation |
| ---- | --------- | ------------ | ---------- |
| ...  | ...       | High/Med/Low | ...        |

### Consensus Points

[What all or most personas agreed on]

### Unresolved Tensions

[Disagreements that need more data or user input to resolve]

### Implementation Sequence

| Week | Focus | Actions | Owner |
| ---- | ----- | ------- | ----- |
| 1    | ...   | ...     | ...   |
| 2    | ...   | ...     | ...   |
| 3    | ...   | ...     | ...   |
| 4    | ...   | ...     | ...   |

### KPI Dashboard

| Metric | Current | Target | Owner |
| ------ | ------- | ------ | ----- |
| ...    | ...     | ...    | ...   |
```

---

## Grounding Rules (Enforced Across All Rounds)

1. **Cite or qualify**: Every strategic claim must cite a specific file. If no evidence, state "Speculative — no codebase evidence."
2. **Read before opining**: Each persona reads their 4-5 mandatory files BEFORE forming any opinion.
3. **Dynamic exploration**: Use Grep/Glob/Read to find evidence relevant to the specific question.
4. **Speak in metrics**: Component counts (18), preset counts (7), step counts (9), token costs, etc.
5. **No empty agreement**: If a persona agrees with another, they must add NEW information or a nuance.
6. **Adversarial honesty**: Personas must genuinely challenge each other, not softball.
