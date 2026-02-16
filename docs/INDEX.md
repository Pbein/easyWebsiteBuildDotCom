# Documentation Index — EasyWebsiteBuild

> **Last audited:** 2026-02-16
> **Total docs:** ~30 project files (excludes node_modules, .agents/skills/)
>
> Use this file as the master map for all project documentation. When adding new docs, register them here.

---

## Quick Reference

| Need to understand...       | Read this first                        |
| --------------------------- | -------------------------------------- |
| Project rules & conventions | `CLAUDE.md` (root)                     |
| System architecture         | `docs/ARCHITECTURE.md`                 |
| What's been built           | `docs/ROADMAP.md`                      |
| What's next                 | `docs/ROADMAP.md` § Current Priorities |
| Strategic decisions         | `business/boardroom/DECISIONS_LOG.md`  |
| Business strategy           | `business/HORMOZI_ANALYSIS.md`         |
| Component library           | `docs/COMPONENT_SPEC.md`               |
| Adding a component          | `docs/AGENT_PLAYBOOK.md`               |
| Feature-specific plans      | `docs-specific-feature-plans/`         |

---

## Root Level

| File                        | Purpose                                                                     | Updated    |
| --------------------------- | --------------------------------------------------------------------------- | ---------- |
| **CLAUDE.md**               | Master project instructions — role, stack, rules, current status, standards | 2026-02-16 |
| **posthog-setup-report.md** | PostHog analytics integration report                                        | 2026-02-12 |

---

## docs/ — Architecture & Specifications

| File                          | Purpose                                                                 | Updated    |
| ----------------------------- | ----------------------------------------------------------------------- | ---------- |
| **INDEX.md**                  | This file — master documentation map                                    | 2026-02-16 |
| **ARCHITECTURE.md**           | 4-layer system architecture (Intent, Assembly, Theming, Knowledge Base) | 2026-02-16 |
| **COMPONENT_SPEC.md**         | Component library spec — 24 components, file patterns, property tables  | 2026-02-16 |
| **THEME_SYSTEM.md**           | 87 design tokens, 7 presets, generation, emotional overrides, VLM       | 2026-02-16 |
| **ASSEMBLY_ENGINE.md**        | Spec → live site pipeline, registry, font loading, export               | 2026-02-16 |
| **INTAKE_FLOW.md**            | 9-step deep flow + 2-step express path, brand character capture         | 2026-02-16 |
| **BRAND_CHARACTER_SYSTEM.md** | Emotional identity, voice, archetype, anti-reference design philosophy  | 2026-02-12 |
| **COMPLETE_DATA_FLOW.md**     | End-to-end 6-phase pipeline with what exists vs what's missing          | 2026-02-16 |
| **KNOWLEDGE_BASE.md**         | Evolving decision trees, recipes, embeddings (partially built)          | 2026-02-12 |
| **ROADMAP.md**                | All phases + current priorities (Revenue Foundation tracks)             | 2026-02-16 |
| **EPICS_AND_STORIES.md**      | Output Quality Overhaul tracking — 30/33 stories shipped                | 2026-02-12 |
| **STRATEGIC_ROADMAP.md**      | Honest assessment, limitation inventory, competitive analysis           | 2026-02-16 |
| **AGENT_PLAYBOOK.md**         | Step-by-step guide for adding components or CSS effects                 | 2026-02-12 |

---

## docs-specific-feature-plans/ — Feature Specifications

| File                                 | Purpose                                            | Status  |
| ------------------------------------ | -------------------------------------------------- | ------- |
| **PRICING_MONETIZATION_STRATEGY.md** | Tier structure, Clerk + Stripe, feature gates      | Planned |
| **DESIGN_QUALITY_RD_BENCHMARK.md**   | Quality scoring, reference sites, Wix comparison   | Planned |
| **AI_IMAGE_GENERATION.md**           | Gemini image gen via convex-nano-banana (Phase 5C) | Planned |

---

## business/ — Strategy & Governance

| File                    | Purpose                                          | Updated    |
| ----------------------- | ------------------------------------------------ | ---------- |
| **HORMOZI_ANALYSIS.md** | Revenue-first analysis ($100M Offers framework)  | 2026-02-12 |
| **USER_JOURNEY.md**     | Granular user journey map from codebase analysis | 2026-02-16 |

### business/boardroom/ — Strategic Decision Governance

| File                        | Purpose                                           | Updated    |
| --------------------------- | ------------------------------------------------- | ---------- |
| **PROCESS.md**              | Boardroom session lifecycle, reconciliation rules | 2026-02-12 |
| **STRATEGIC_PRINCIPLES.md** | P0-P7 principles all decisions must align to      | 2026-02-14 |
| **DECISIONS_LOG.md**        | Running log of all decisions with status tracking | 2026-02-16 |

### business/boardroom/sessions/ — Session Transcripts

| File                                     | Session | Topic                                 |
| ---------------------------------------- | ------- | ------------------------------------- |
| **2026-02-12-customization-system.md**   | 001     | Phase 6A customization sidebar        |
| **2026-02-14-rd-and-pricing.md**         | 002     | R&D benchmark + pricing ($12/$29/$99) |
| **2026-02-15-product-simplification.md** | 003     | Express path + one core action        |

---

## .agents/ — Agent System

| File                                     | Purpose                                       |
| ---------------------------------------- | --------------------------------------------- |
| **agents/README.md**                     | Team directory — 3 specialists + 10 boardroom |
| **agents/TEAM_CHARTER.md**               | Mission, team structure, quality standards    |
| **agents/AGENT_CAPABILITIES.md**         | Quick reference for each agent's strengths    |
| **agents/AGENT_COLLABORATION_MATRIX.md** | Task routing matrix, collaboration workflows  |
| **agents/BOARDROOM_TENSION_MAP.md**      | 20 adversarial tensions for decision quality  |
| **agents/USER_DELIGHT_MANIFESTO.md**     | P0 principle philosophy & practice            |

### Specialist Agents (3)

`karen-pmo-expert.md`, `tdd-test-engineer.md`, `journey-brain.md`

### Boardroom Personas (10)

`boardroom-ceo.md`, `boardroom-cmo.md`, `boardroom-cro.md`, `boardroom-product.md`, `boardroom-infra.md`, `boardroom-monetization.md`, `boardroom-competitive.md`, `boardroom-partnerships.md`, `boardroom-ux-psych.md`, `boardroom-delight.md`

### Skills (~110+ files)

Skill documentation lives in `.agents/skills/` with subdirectories per skill. These are reference docs consumed by Claude Code, not project documentation.

---

## memory/ — Session Memory

| File                    | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| **MEMORY.md**           | Auto-loaded project memory (supplementary) |
| **completed-phases.md** | Detailed summaries of all completed phases |

---

## Cross-Reference Map

```
CLAUDE.md (master)
├── references → docs/ARCHITECTURE.md
├── references → docs/ROADMAP.md
├── references → docs/EPICS_AND_STORIES.md
├── references → business/boardroom/PROCESS.md
├── references → business/boardroom/STRATEGIC_PRINCIPLES.md
└── references → business/boardroom/DECISIONS_LOG.md

business/boardroom/PROCESS.md (governance)
├── requires → STRATEGIC_PRINCIPLES.md
├── requires → DECISIONS_LOG.md
├── requires → docs/STRATEGIC_ROADMAP.md
├── requires → business/HORMOZI_ANALYSIS.md
└── requires → business/USER_JOURNEY.md

docs/ROADMAP.md (what's built + what's next)
├── references → business/boardroom/sessions/*
├── references → business/boardroom/DECISIONS_LOG.md
└── references → docs-specific-feature-plans/*
```

---

## Audit Checklist

When auditing docs for staleness, check these in order:

1. **CLAUDE.md** — Current Status table, Project Structure tree, component count
2. **docs/ROADMAP.md** — Phase completion status, "Current Priorities" section
3. **business/boardroom/DECISIONS_LOG.md** — Decision statuses (ACTIVE → COMPLETED)
4. **docs/\*.md status blocks** — The `> Implementation Status` block at the top of each doc
5. **docs/COMPLETE_DATA_FLOW.md** — "What's Missing" section
6. **docs/STRATEGIC_ROADMAP.md** — Limitation inventory (resolved items)
7. **business/USER_JOURNEY.md** — Journey flow, homepage description, friction points
8. **memory/MEMORY.md** — Current Focus section
9. **This file (INDEX.md)** — Updated dates in tables above
