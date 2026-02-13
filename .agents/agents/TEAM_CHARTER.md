# EasyWebsiteBuild — Agent Team Charter & Workflow

**Last Updated**: February 2026
**Version**: 2.0

---

## Mission

Build a production-grade, AI-powered website assembly platform that turns structured client intake into fully themed, deployable websites — using a modular component library, intelligent assembly engine, and evolving knowledge base.

We are not building a drag-and-drop editor. We are building an **intelligent assembly system** that gets better with every site it creates.

---

## Who We Build For

**Our users are business owners, not developers.**

- Boutique owners launching their first professional website
- Service providers (salons, studios, consultants) who need results fast
- Creators and freelancers who want a site that reflects their brand
- Small teams who can't afford a design agency but deserve better than templates

**What they need from us:**

- A guided flow that captures their intent without overwhelming them
- Websites that feel crafted and distinctive, not cookie-cutter
- Components that work together seamlessly with consistent theming
- Export capability to take their site and own it

**Success looks like:** A business owner completes the 9-step intake flow in under 10 minutes and gets a professional, themed, multi-section website they're proud to share.

---

## Product Architecture

```
Intake Flow (9 steps)     →  AI + Deterministic Engine  →  Assembled Website
├─ Setup (Steps 1-4)      │  ├─ Claude API (primary)    │  ├─ Theme (87 tokens)
├─ Character (Steps 5-7)  │  └─ Fallback (deterministic)│  ├─ Components (18)
└─ Discovery (Steps 8-9)  │                              │  └─ Export (ZIP)
```

**Tech Stack**: Next.js 16 (App Router) / TypeScript strict / Tailwind v4 + CSS Custom Properties / Convex / Claude SDK / framer-motion / chroma-js / JSZip / Zustand

**Key Systems:**

| System            | Location                          | Purpose                                    |
| ----------------- | --------------------------------- | ------------------------------------------ |
| Component Library | `src/components/library/`         | 18 themed, variant-aware components        |
| Theme Engine      | `src/lib/theme/`                  | 87 tokens, 7 presets, emotional overrides  |
| Assembly Engine   | `src/lib/assembly/`               | Spec → live site rendering                 |
| Intake Flow       | `src/components/platform/intake/` | 9-step guided discovery                    |
| AI Integration    | `convex/ai/`                      | Question generation + site spec generation |
| Export Pipeline   | `src/lib/export/`                 | Static HTML/CSS ZIP bundling               |
| State Management  | `src/lib/stores/`                 | Zustand + localStorage persistence         |

---

## Agent Team

### Core Team

| Agent                   | Role                                | Primary Domain                               |
| ----------------------- | ----------------------------------- | -------------------------------------------- |
| **Karen** (PMO/QA Lead) | Reality checker, final quality gate | All — reviews everyone's work                |
| **Test Engineer**       | TDD methodology, test coverage      | Component, theme, assembly, Convex testing   |
| **JourneyBrain**        | Business advisor, product strategy  | User journey, conversion, pricing, analytics |

### Collaboration Protocol

```
Standard Workflow:
1. Developer implements feature
2. Test Engineer creates/updates tests
3. Karen verifies completion and production-readiness

Every task ends with Karen verification.
```

### Quality Standards

| Area           | Standard                                                     |
| -------------- | ------------------------------------------------------------ |
| TypeScript     | Strict mode, no `any`, explicit return types                 |
| Components     | All themed via CSS Custom Properties, never hardcoded colors |
| Build          | Zero errors, zero warnings                                   |
| Design         | Distinctive and crafted — never generic "AI-looking" output  |
| Testing        | Tests before or alongside implementation                     |
| Content Fields | Must match component type interfaces exactly                 |

---

## Workflow

### Before Starting Any Task

1. Read `CLAUDE.md` for project context and architecture
2. Review relevant source code to understand current state
3. Check component manifests and type interfaces if touching library
4. Plan for Karen verification at completion

### Development Flow

```
Feature Development:
  Implement → Test → /verify (Karen)

Component Library Work:
  Implement component → Verify theme tokens → Test variants → Update registry → /verify

Theme System Changes:
  Update tokens → Verify all 18 components render correctly → /verify

AI Integration Changes:
  Update prompts → Test AI path → Test deterministic fallback → /verify

Export Pipeline Changes:
  Update generator → Test HTML/CSS output → Test ZIP download → /verify
```

### After Completing Any Task

1. Self-review against quality standards above
2. Run `npm run build` — must pass with zero errors
3. Run `npm run lint` — must pass
4. Verify in browser (dev server) that changes work correctly
5. **Call Karen for final verification** (`/verify`)

---

## Quality Gates

### Definition of "Done"

A feature is complete when ALL of these are true:

- Works in the browser with real user interaction
- TypeScript compiles with zero errors in strict mode
- Components use CSS Custom Properties for all visual values
- Content fields match type interfaces exactly (see CLAUDE.md table)
- Assembly engine renders the component correctly from a spec
- Theme tokens apply properly across all 7 presets
- Deterministic fallback works when AI is unavailable
- Export pipeline produces valid HTML/CSS for the component
- Karen has verified and approved

### Build & Lint Requirements

```bash
npm run build    # Zero errors, zero warnings
npm run lint     # Clean pass
```

### Component Library Checklist

- [ ] TypeScript types defined in component directory
- [ ] Manifest with personalityFit (number[], not tuple)
- [ ] All visual values via CSS Custom Properties
- [ ] Registered in COMPONENT_REGISTRY
- [ ] Barrel exported from library index
- [ ] Added to manifest-index
- [ ] Works in AssemblyRenderer
- [ ] Works in export pipeline
- [ ] Preview page updated

---

## Communication

### Escalation Path

```
Implementation question → Check CLAUDE.md and docs/
Architecture decision  → Document reasoning, then implement
Quality concern        → Raise to Karen immediately
Blocked by dependency  → Document what's needed, move to next task
```

### Key Documentation

| Document                                       | Purpose                                      |
| ---------------------------------------------- | -------------------------------------------- |
| `CLAUDE.md`                                    | Project instructions, architecture, patterns |
| `docs/ROADMAP.md`                              | Development phases and priorities            |
| `.agents/agents/AGENT_COLLABORATION_MATRIX.md` | When and how to collaborate                  |
| `.agents/agents/AGENT_CAPABILITIES.md`         | Agent strengths and quick reference          |

---

## Current Phase

**Phase 5A: CSS Visual Foundation** — COMPLETE
**Output Quality Overhaul** — 91% complete (30/33 stories shipped, 3 deferred)

**Recently completed:**

- Phase 5A: CSS Visual Foundation — 14 CSS patterns, 4 section dividers, 5 decorative elements, ImagePlaceholder, visual vocabulary, parallax hook, image-optional components
- Output Quality Overhaul: All 6 tiers shipped (Tier 1-6), 3 deferred (mood boards)
- UI enhancements: iframe-based viewport switcher, animated wireframe loading, mobile UX overhaul

**Deferred**: T4-E1 (Mood Board — premium feature candidate), T4-E2 (Visual Reference URL — depends on T4-E1)
**Next**: Phase 5B — Stock photo integration (Unsplash/Pexels/Pixabay), then Phase 5C (AI images), 5D (advanced scroll), 5E (multi-page generation)

See `docs/ROADMAP.md` for full phase details.

---

**This charter is our shared understanding of what we're building, who we're building it for, and how we hold ourselves accountable. Every agent reads this before starting work.**
