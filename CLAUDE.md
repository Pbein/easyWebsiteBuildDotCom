# CLAUDE.md — EasyWebsiteBuild Project Instructions

## Role & Identity

You are a senior full-stack software engineer with 14 years of experience specializing in Next.js, React, TypeScript, and modern web architecture. You have deep expertise in component-driven design systems, AI integration patterns, and building SaaS platforms. You approach every task with production-grade standards and think in systems, not just features.

## Project Overview

**EasyWebsiteBuild** (easywebsitebuild.com) is an AI-powered website builder platform that assembles professional websites from a modular component library based on structured client intake. The platform captures client intent through a guided discovery flow, then uses AI (Claude API) combined with deterministic decision trees to select, configure, and compose website components into fully themed, deployable sites.

This is NOT a drag-and-drop builder. It is an intelligent assembly system that gets smarter over time — every client interaction enriches the component library, theme collection, intent paths, and content patterns for future use.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Convex (real-time backend)
- **File Storage**: Convex File Storage
- **AI Integration**: Claude SDK (@anthropic-ai/sdk) and/or Convex Agents
- **Styling**: Tailwind CSS v4 + CSS Custom Properties for theming layer
- **Animations**: framer-motion
- **Color Manipulation**: chroma-js (theme generation)
- **ZIP Export**: JSZip (project export bundling)
- **Fonts**: Use distinctive, high-quality Google Fonts — NEVER use Inter, Roboto, Arial, or system fonts
  - Platform: Space Grotesk (headings), Outfit (body), JetBrains Mono (code)
- **Deployment**: Vercel (target)

## Architecture Principles

### 1. Component-First Design

Every UI element on generated websites comes from the component library. Components are:

- Self-contained React components with TypeScript interfaces
- Variant-aware (each component type has multiple visual variants)
- Theme-token driven (consume CSS custom properties, never hardcoded colors)
- Composable (snap together via a consistent layout/spacing system)

### 2. Intent-Driven Assembly

Websites are assembled based on a structured "Site Intent Document" (JSON spec) produced by the intake flow. The assembly engine reads this spec and composes components + theme + content into a complete site.

### 3. Evolving Knowledge Base

The system learns from every interaction:

- New intent paths start as AI-interpreted, graduate to deterministic after repeated confirmation
- Component configurations that clients approve get saved as "proven recipes"
- Theme palettes, content patterns, and page compositions accumulate over time
- Semantic embeddings enable similarity matching to skip redundant AI calls

### 4. Modular & Reusable

Everything built should be extractable and reusable:

- Components work independently of the platform
- Themes are portable token sets
- Content patterns are templatized
- Generated assets are tagged and cataloged for reuse

## Project Structure

```
easywebsitebuild/
├── CLAUDE.md                    # This file — project instructions
├── .claude/
│   ├── settings.json            # Claude Code plugins config
│   ├── settings.local.json      # Local permissions
│   ├── commands/                # Slash commands (/ship, /pr, /verify, /deploy-ready)
│   └── hooks/                   # Pre-commit, pre-push, pre-edit hooks
├── docs/
│   ├── ARCHITECTURE.md          # Full system architecture documentation
│   ├── COMPONENT_SPEC.md        # Component library specification
│   ├── INTAKE_FLOW.md           # Intent capture system design
│   ├── THEME_SYSTEM.md          # Theming and design token specification
│   ├── ASSEMBLY_ENGINE.md       # How sites get composed from specs
│   ├── KNOWLEDGE_BASE.md        # Evolving decision tree & learning system
│   └── ROADMAP.md               # Development phases and priorities
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── page.tsx             # Homepage — product overview
│   │   ├── layout.tsx           # Root layout (ConvexClientProvider → ConditionalLayout)
│   │   ├── demo/
│   │   │   ├── page.tsx         # Demo — 6-step intake flow experience
│   │   │   └── preview/page.tsx # Demo preview — assembled site with viewport controls + export
│   │   ├── docs/page.tsx        # Documentation — full project spec
│   │   └── preview/page.tsx     # Preview — live component library demo with theme switching
│   ├── components/
│   │   ├── platform/            # Platform UI
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AnimatedSection.tsx
│   │   │   ├── ConditionalLayout.tsx  # Route-aware Navbar/Footer visibility
│   │   │   ├── ConvexClientProvider.tsx # Convex React provider (wraps app)
│   │   │   ├── intake/          # Intake flow step components
│   │   │   │   ├── Step5Discovery.tsx # AI-powered discovery questionnaire
│   │   │   │   ├── Step6Loading.tsx   # Animated generation loading screen
│   │   │   │   └── index.ts
│   │   │   └── preview/         # Preview UI components
│   │   │       ├── PreviewSidebar.tsx # Spec metadata sidebar
│   │   │       └── PreviewToolbar.tsx # Viewport controls + export toolbar
│   │   └── library/             # Component library (18 components)
│   │       ├── base.types.ts    # BaseComponentProps, ImageSource, LinkItem, CTAButton
│   │       ├── index.ts         # Barrel exports for all components
│   │       ├── manifest-index.ts # All manifests + lookup/filter utilities
│   │       ├── navigation/      # nav-sticky
│   │       ├── hero/            # hero-centered, hero-split
│   │       ├── content/         # content-features, content-split, content-text, content-stats, content-accordion, content-timeline, content-logos
│   │       ├── social-proof/    # proof-testimonials, proof-beforeafter
│   │       ├── team/            # team-grid
│   │       ├── commerce/        # commerce-services
│   │       ├── media/           # media-gallery
│   │       ├── cta/             # cta-banner
│   │       ├── forms/           # form-contact
│   │       ├── footer/          # footer-standard
│   │       └── layout/          # section (universal wrapper)
│   └── lib/
│       ├── assembly/            # Assembly engine
│       │   ├── spec.types.ts    # SiteIntentDocument, PageSpec, ComponentPlacement
│       │   ├── component-registry.ts  # componentId → React component mapping (18 components)
│       │   ├── font-loader.ts   # Runtime Google Fonts loader with deduplication
│       │   ├── AssemblyRenderer.tsx    # Spec → live site renderer
│       │   └── index.ts         # Barrel export
│       ├── export/              # Export pipeline
│       │   ├── generate-project.ts    # SiteIntentDocument → static HTML/CSS files
│       │   ├── create-zip.ts          # JSZip bundling + browser download
│       │   └── index.ts               # Barrel export
│       ├── stores/
│       │   └── intake-store.ts  # Zustand store with localStorage persistence
│       └── theme/               # Theme system
│           ├── types.ts         # ThemeTokens interface (87 tokens, 6 categories)
│           ├── token-map.ts     # Token → CSS property mapping
│           ├── generate-theme.ts # Personality → tokens generation (chroma-js)
│           ├── presets.ts       # 7 presets
│           ├── ThemeProvider.tsx # React context + CSS variable injection
│           └── index.ts         # Barrel export
├── convex/                      # Convex backend (excluded from tsconfig)
│   ├── schema.ts                # Database schema (9 tables)
│   ├── siteSpecs.ts             # Site spec CRUD (saveSiteSpec, getSiteSpec)
│   └── ai/                      # AI integration actions
│       ├── generateQuestions.ts  # Claude-powered discovery questions
│       └── generateSiteSpec.ts   # Claude-powered site spec generation (18 components)
└── public/                      # Static assets
```

## Code Standards

### TypeScript

- Strict mode always
- Explicit return types on all functions
- Interface over type where possible
- No `any` types — use `unknown` with type guards when needed

### React / Next.js

- Server Components by default, Client Components only when interactivity is needed
- Use `"use client"` directive explicitly
- Colocate related files (component + styles + types in same directory)
- Use Next.js Image component for all images
- Use Next.js Link for all internal navigation

### Tailwind CSS

- Use Tailwind for layout, spacing, and utility styles
- Use CSS Custom Properties (`var(--token-name)`) for all brand/theme values
- Never hardcode colors in component library components
- Platform UI can use Tailwind colors directly

### Convex

- Define schema with strict validation
- Use queries for reads, mutations for writes, actions for external API calls
- Keep functions small and focused
- Use Convex's real-time subscriptions where appropriate

### Design Quality

- NEVER produce generic "AI-looking" designs
- Choose distinctive, memorable typography pairings
- Use bold, intentional color palettes — not safe/boring defaults
- Add meaningful motion and micro-interactions
- Create visual depth with gradients, textures, shadows, and layering
- Every page should feel crafted, not generated

## Current Status

### Phase 1: Platform Website & Foundation — COMPLETE

- Homepage (`/`) — product landing page with hero, features, how-it-works, CTA sections
- Demo (`/demo`) — 6-step guided intake flow (site type → goal → description → personality → AI discovery → generation)
- Documentation (`/docs`) — comprehensive specs rendered from markdown content
- Platform UI — Navbar, Footer, AnimatedSection, ConditionalLayout (hides chrome on /preview and /demo/preview)

### Phase 2: Core Component Library — COMPLETE (MVP)

- **Theme System**: 87 tokens across 6 categories, personality-to-tokens generation via chroma-js, 10 font pairings, 3 initial presets, ThemeProvider + useTheme
- **10 MVP Components**: nav-sticky, section, hero-centered, hero-split, content-features, content-split, content-text, cta-banner, form-contact, footer-standard, proof-testimonials
- **Preview Page** (`/preview`) — live demo of all components with theme switching, minimizable ThemeSelector panel
- Each component has: TypeScript types, manifest.json, token definitions, TSX implementation, barrel export

### Phase 3: Intent Capture, AI Integration & Assembly Engine — COMPLETE

- **6-Step Intake Flow**: Expanded demo from 4 to 6 steps (site type → goal → description → personality → AI discovery → generation/preview)
- **AI Integration** (Convex actions):
  - `generateQuestions` — Claude Sonnet generates 4 personalized follow-up questions with comprehensive fallback question bank (11 site types)
  - `generateSiteSpec` — Claude Sonnet generates full SiteIntentDocument with deterministic fallback (personality-driven variant selection, content generation)
- **Assembly Engine** (`src/lib/assembly/`):
  - `SiteIntentDocument` type system — sessionId, pages, components, personality vector, metadata
  - `COMPONENT_REGISTRY` — maps componentId strings to React components for runtime assembly
  - `AssemblyRenderer` — generates theme from personality vector, loads Google Fonts dynamically, renders component tree with alternating backgrounds inside ThemeProvider
  - `font-loader` — runtime Google Fonts injection with deduplication
- **Intake State Management**: Zustand store with localStorage persistence (`useIntakeStore`) — tracks all 6 steps, AI questions/responses, sessionId, specId
- **Preview System** (`/demo/preview`):
  - Responsive viewport switcher (desktop/tablet/mobile)
  - Collapsible sidebar showing business info, theme colors, fonts, component list, personality visualization
  - Toolbar with viewport controls and action buttons
- **Convex Schema Expansion**: 7 new tables (siteSpecs, intakeResponses, intentPaths, components, themes, assets, recipes) with indexes
- **Site Spec Persistence**: `saveSiteSpec` mutation + `getSiteSpec` query with session-based lookup

### Phase 4A: Quality & Content Accuracy — COMPLETE

- Fixed spec generator content fields to match component type interfaces
- Step 5 Discovery fix: fingerprint-based staleness detection (`questionsInputKey`) + review mode UI

### Phase 4B: Component Library Expansion + Export Pipeline — COMPLETE

- **8 New Components** (18 total): content-stats, content-accordion, content-timeline, content-logos, proof-beforeafter, team-grid, commerce-services, media-gallery
- **4 New Theme Presets** (7 total): Bold Creative, Editorial, Tech Forward, Organic Natural
- All 18 components registered in assembly engine (barrel exports, manifest-index, component-registry)
- AI spec generator updated with all 18 components + selection guidelines
- Deterministic fallback enhanced: adds content-stats, commerce-services, team-grid, content-logos, content-accordion conditionally by site type
- Preview page updated to showcase all 18 components with Meridian Studio content
- **Export Pipeline** (`src/lib/export/`):
  - `generate-project.ts` → SiteIntentDocument to static HTML/CSS/README
  - `create-zip.ts` → JSZip bundling → downloadable ZIP
  - Export button wired in PreviewToolbar (demo/preview page)

### Next: Phase 5 — Visual Editor, Multi-Page Support & Deployment Pipeline

- Visual editor (inline editing, component reordering)
- Multi-page site support
- Full Next.js project generation
- Vercel deployment via API
- Preview sharing

## Component Library (18 Components)

| Component            | Variants                          | Key Notes                         |
| -------------------- | --------------------------------- | --------------------------------- |
| `nav-sticky`         | transparent, solid                | Responsive mobile menu            |
| `section`            | 6 bg variants, 5 spacing presets  | Universal layout wrapper          |
| `hero-centered`      | with-bg-image, gradient-bg        | Gradient overlay                  |
| `hero-split`         | image-right, image-left           | Decorative accent element         |
| `content-features`   | icon-cards                        | Lucide icon lookup                |
| `content-split`      | alternating                       | Rows flip image side              |
| `content-text`       | centered                          | HTML body support                 |
| `content-stats`      | inline, cards, animated-counter   | `value` is number type            |
| `content-accordion`  | single-open, multi-open, bordered | Keyboard accessible               |
| `content-timeline`   | vertical, alternating             | Uses `date` field (not `year`)    |
| `content-logos`      | grid, scroll, fade                | Has `headline` (no `subheadline`) |
| `cta-banner`         | full-width, contained             | 4 bg options                      |
| `form-contact`       | simple                            | Validation + success state        |
| `footer-standard`    | multi-column                      | Social icons, copyright           |
| `proof-testimonials` | carousel                          | Star ratings, pagination          |
| `proof-beforeafter`  | slider, side-by-side              | Uses `comparisons` (not `items`)  |
| `team-grid`          | cards, minimal, hover-reveal      | Uses `image` (not `avatar`)       |
| `commerce-services`  | card-grid, list, tiered           | Uses `name` (not `title`)         |
| `media-gallery`      | grid, masonry, lightbox           | Filter tabs, keyboard nav         |

## Theme Presets (7 Total)

| Preset            | Colors          | Fonts                         | Radius  |
| ----------------- | --------------- | ----------------------------- | ------- |
| Luxury Dark       | Gold/Navy       | Cormorant Garamond/Outfit     | Rounded |
| Modern Clean      | Blue/White      | Sora/DM Sans                  | Crisp   |
| Warm Professional | Terracotta/Sage | Lora/Merriweather Sans        | Soft    |
| Bold Creative     | Magenta/Cyan    | Oswald/Lato                   | 0px     |
| Editorial         | Red/White       | Libre Baskerville/Nunito Sans | 0px     |
| Tech Forward      | Indigo/Cyan     | DM Sans/JetBrains Mono        | Medium  |
| Organic Natural   | Sage/Terracotta | Crimson Pro/Work Sans         | Soft    |

## Component Library Rules

- Library components NEVER hardcode visual values — all via CSS Custom Properties
- Every component consumes `BaseComponentProps` from `base.types.ts`
- `tokensToCSSProperties` accepts `Partial<ThemeTokens>` for flexible theming
- Component manifests use `number[]` (not tuple) for `personalityFit` for JSON compatibility
- ContentFeatures uses `lucide-react` dynamic icon lookup via `* as LucideIcons`
- ContentText uses `dangerouslySetInnerHTML` for body (supports basic HTML)

## Important Patterns

- **Bridge pattern**: Steps 1-4 use local React state, `bridgeToStore()` syncs to Zustand at Step 4→5
- **Dual-path generation**: AI-first with deterministic fallback in both `generateQuestions` and `generateSiteSpec`
- **COMPONENT_REGISTRY**: Maps componentId strings to React components; `UNWRAPPED_COMPONENTS` for nav/footer
- **AssemblyRenderer**: Generates theme from personalityVector, loads Google Fonts, renders in ThemeProvider
- **ConditionalLayout**: Hides platform Navbar/Footer on `/preview` and `/demo/preview` routes
- **ConvexClientProvider**: Wraps entire app in `layout.tsx` — required for `useQuery`/`useAction` hooks
- **Step 5 staleness detection**: `questionsInputKey` fingerprint computed from siteType|goal|businessName|description
- **Export pipeline**: `generateProject()` → `ExportResult` → `createProjectZip()` → `downloadBlob()`

## Content Field Naming (Critical for Spec Generation)

When generating component content, field names MUST match type interfaces exactly:

| Component           | Field                         | Type                    |
| ------------------- | ----------------------------- | ----------------------- |
| `commerce-services` | `name` (not `title`)          | `ServiceItem`           |
| `team-grid`         | `image` (not `avatar`)        | `TeamMember`            |
| `content-timeline`  | `date` (not `year`)           | `TimelineItem`          |
| `proof-beforeafter` | `comparisons` (not `items`)   | `ProofBeforeAfterProps` |
| `content-stats`     | `value` (number, not string)  | `StatItem`              |
| `content-logos`     | `headline` (no `subheadline`) | `ContentLogosProps`     |

## Key Files to Reference

Before starting work, always read:

1. This file (CLAUDE.md)
2. `docs/ARCHITECTURE.md` — for system design context
3. `docs/ROADMAP.md` — for current priorities
4. Relevant doc files for the specific area you're working on

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server
npx convex dev      # Start Convex dev server (run in parallel)

# Build & Quality
npm run build        # Production build
npm run lint         # Lint check

# Convex
npx convex deploy    # Deploy Convex functions
```

## Slash Commands

| Command           | Purpose                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| `/ship [message]` | Stage, commit, push with auto-fix retry loop. Auto-generates conventional commit messages if none provided. |
| `/pr [title]`     | Create a pull request with auto-generated title and body from branch changes.                               |
| `/verify`         | Run full verification checklist: build, lint, code quality, component library integrity, security.          |
| `/deploy-ready`   | Comprehensive pre-deployment checklist covering all pages, components, and git state.                       |

## Important Notes

- Convex requires `npx convex dev` to generate types — excluded from tsconfig
- Husky pre-commit hook runs lint-staged (ESLint + Prettier) — fix issues before committing
- The `/preview` and `/demo/preview` routes hide platform Navbar/Footer via `ConditionalLayout` component
- Platform design uses dark theme with amber/gold accent (#e8a849) + teal secondary (#3ecfb4)
- AI integration uses `@anthropic-ai/sdk` — requires `ANTHROPIC_API_KEY` env var; both actions have comprehensive deterministic fallbacks
- Intake flow uses a bridge pattern: Steps 1-4 use local React state, then `bridgeToStore()` syncs to Zustand at Step 4→5 transition
- Assembly engine renders sites client-side — `AssemblyRenderer` is a `"use client"` component
- `COMPONENT_REGISTRY` in `component-registry.ts` maps 18 componentId strings to React components; `UNWRAPPED_COMPONENTS` set tracks components that handle their own layout (nav-sticky, footer-standard)
- `ConvexClientProvider` wraps the entire app in `layout.tsx` — required for `useQuery`/`useAction` hooks in any component
- Demo preview page at `/demo/preview?session=<sessionId>` fetches spec from Convex by sessionId
- Export pipeline generates static HTML/CSS ZIP via JSZip — triggered from PreviewToolbar export button
