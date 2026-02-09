# Agent Team — EasyWebsiteBuild

This directory contains the AI agent definitions, team charter, and collaboration protocols for the EasyWebsiteBuild project.

## Agents

| Agent             | File                   | Purpose                                                                                            |
| ----------------- | ---------------------- | -------------------------------------------------------------------------------------------------- |
| **Karen**         | `karen-pmo-expert.md`  | PMO & QA lead. Reality checker. Final quality gate for all work. Invoke via `/verify`.             |
| **Test Engineer** | `tdd-test-engineer.md` | TDD specialist. Component testing, theme validation, assembly engine testing, intake flow testing. |

## Team Documents

| Document                        | Purpose                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `TEAM_CHARTER.md`               | Mission, team structure, quality standards, workflows, and definition of "done". **Read this first.** |
| `AGENT_COLLABORATION_MATRIX.md` | Task routing — which agent handles what, collaboration workflows, pre/post-work checklists.           |
| `AGENT_CAPABILITIES.md`         | Quick reference for each agent's strengths and when to use them.                                      |

## How It Works

```
Developer implements feature
    ↓
Test Engineer creates/updates tests
    ↓
npm run build (must pass)
npm run lint (must pass)
    ↓
/verify → Karen reviews and approves
    ↓
Done
```

**Every task ends with Karen verification.** No exceptions.

## Quick Start

1. **Read** `TEAM_CHARTER.md` for project context and quality standards
2. **Check** `AGENT_COLLABORATION_MATRIX.md` for the right workflow
3. **Build** your feature following the patterns in `CLAUDE.md`
4. **Run** `/verify` when you think you're done

## Key Commands

| Command         | What It Does                                |
| --------------- | ------------------------------------------- |
| `/verify`       | Karen's quality gate — run after every task |
| `/deploy-ready` | Pre-deployment checklist                    |
| `/ship`         | Stage, commit, push with auto-fix           |

## Project Context

**EasyWebsiteBuild** is an AI-powered website assembly platform. It captures client intent through a 9-step guided flow, then assembles professional websites from a modular component library (18 components) with a theme system (87 tokens, 7 presets).

- **Tech**: Next.js 16 / TypeScript strict / Tailwind v4 / Convex / Claude SDK
- **Status**: Phase 4C (Brand Character System) complete. Phase 5 next.
- **Full details**: See `CLAUDE.md` in project root.
