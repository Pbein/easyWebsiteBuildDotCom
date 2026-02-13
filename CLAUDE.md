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
- **Screenshot**: html2canvas (client-side DOM capture)
- **Screenshot (server)**: Playwright (high-quality server-side capture)
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
│   ├── ROADMAP.md               # Development phases and priorities
│   ├── BRAND_CHARACTER_SYSTEM.md  # Brand character design philosophy
│   ├── COMPLETE_DATA_FLOW.md      # End-to-end system data flow
│   ├── EPICS_AND_STORIES.md       # Output Quality Overhaul tracking (33 stories)
│   └── STRATEGIC_ROADMAP.md       # Strategic priorities and competitive analysis
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── page.tsx             # Homepage — product overview
│   │   ├── layout.tsx           # Root layout (ConvexClientProvider → ConditionalLayout)
│   │   ├── demo/
│   │   │   ├── page.tsx         # Demo — 9-step intake flow experience
│   │   │   └── preview/
│   │   │       ├── page.tsx     # Demo preview — assembled site with viewport controls + export
│   │   │       └── render/page.tsx # Isolated iframe renderer for true responsive preview
│   │   ├── docs/page.tsx        # Documentation — (temporarily redirects to /, will be admin-only with Clerk)
│   │   ├── api/screenshot/route.ts # Playwright server-side screenshot API
│   │   ├── dev/
│   │   │   ├── test-cases/page.tsx # Dev-only: named test case management
│   │   │   └── compare/page.tsx    # Dev-only: side-by-side session comparison
│   │   └── preview/page.tsx     # Preview — live component library demo with theme switching
│   ├── components/
│   │   ├── platform/            # Platform UI
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AnimatedSection.tsx
│   │   │   ├── ConditionalLayout.tsx  # Route-aware Navbar/Footer visibility
│   │   │   ├── ConvexClientProvider.tsx # Convex React provider (wraps app)
│   │   │   ├── intake/          # Intake flow step components
│   │   │   │   ├── Step5Emotion.tsx   # Emotional goals selection (Step 5)
│   │   │   │   ├── Step6Voice.tsx     # Voice tone + narrative prompts (Step 6)
│   │   │   │   ├── Step7Culture.tsx   # Brand archetype + anti-references (Step 7)
│   │   │   │   ├── Step5Discovery.tsx # AI-powered discovery questionnaire (Step 8)
│   │   │   │   ├── Step6Loading.tsx   # Animated generation loading screen (Step 9)
│   │   │   │   └── index.ts
│   │   │   └── preview/         # Preview UI components
│   │   │       ├── PreviewSidebar.tsx # Spec metadata sidebar
│   │   │       ├── PreviewToolbar.tsx # Viewport controls + export toolbar
│   │   │       ├── DevPanel.tsx        # Developer diagnostic panel (6 tabs)
│   │   │       └── FeedbackBanner.tsx  # Quick satisfaction rating banner
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
│       │   ├── spec.types.ts    # SiteIntentDocument, PageSpec, ComponentPlacement, VisualConfig
│       │   ├── component-registry.ts  # componentId → React component mapping (18 components)
│       │   ├── font-loader.ts   # Runtime Google Fonts loader with deduplication
│       │   ├── AssemblyRenderer.tsx    # Spec → live site renderer (+ emotional overrides + visual config)
│       │   └── index.ts         # Barrel export
│       ├── export/              # Export pipeline
│       │   ├── generate-project.ts    # SiteIntentDocument → static HTML/CSS files
│       │   ├── create-zip.ts          # JSZip bundling + browser download
│       │   └── index.ts               # Barrel export
│       ├── hooks/
│       │   └── use-is-mobile.ts # Mobile detection hook with debounced resize listener
│       ├── stores/
│       │   └── intake-store.ts  # Zustand store with localStorage persistence (9-step flow)
│       ├── theme/               # Theme system
│       │   ├── types.ts         # ThemeTokens interface (87 tokens, 6 categories)
│       │   ├── token-map.ts     # Token → CSS property mapping
│       │   ├── generate-theme.ts # Personality → tokens generation (chroma-js)
│       │   ├── emotional-overrides.ts # Emotion/anti-reference → token adjustments
│       │   ├── presets.ts       # 7 presets
│       │   ├── ThemeProvider.tsx # React context + CSS variable injection
│       │   └── index.ts         # Barrel export
│       ├── visuals/              # CSS visual system (Phase 5A)
│       │   ├── css-patterns.ts   # 14 CSS-only background patterns
│       │   ├── industry-patterns.ts # 25+ business type → pattern mapping
│       │   ├── visual-vocabulary.ts # Full visual language per business type
│       │   ├── section-dividers.tsx  # Wave, angle, curve, zigzag SVG dividers
│       │   ├── decorative-elements.tsx # Blob, dots, geometric, diamond, circle accents
│       │   ├── image-placeholder.tsx # Gradient/pattern/shimmer placeholder variants
│       │   ├── gradient-utils.ts # Mesh gradient + noise overlay generation
│       │   ├── use-parallax.ts   # Parallax scroll hook (framer-motion + useSyncExternalStore)
│       │   └── index.ts          # Barrel export
│       ├── screenshot/           # Screenshot capture
│       │   ├── types.ts          # ScreenshotResult type
│       │   ├── capture-client.ts # html2canvas DOM-to-base64
│       │   └── index.ts          # Barrel export
│       ├── vlm/                  # VLM evaluation utilities
│       │   ├── types.ts          # DimensionScore, VLMEvaluation
│       │   ├── map-adjustments.ts # VLM feedback → Partial<ThemeTokens>
│       │   └── index.ts          # Barrel export
│       └── types/               # Shared type definitions
│           └── brand-character.ts # Brand character types + display constants
├── convex/                      # Convex backend (excluded from tsconfig)
│   ├── schema.ts                # Database schema (9 tables)
│   ├── siteSpecs.ts             # Site spec CRUD (saveSiteSpec, getSiteSpec)
│   ├── vlmEvaluations.ts         # VLM evaluation save/query
│   ├── pipelineLogs.ts           # Pipeline session logging
│   ├── feedback.ts               # User satisfaction ratings
│   ├── testCases.ts              # Named test case CRUD
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
- Demo (`/demo`) — 9-step guided intake flow (site type → goal → description → personality → emotion → voice → culture → AI discovery → generation)
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

### Phase 4C: Brand Character System — COMPLETE

- **3 New Intake Steps** (Steps 5-7, expanding flow from 6 to 9 steps):
  - Step 5 — Emotional Goals: 10 emotion cards, select 1-2 primary feelings
  - Step 6 — Voice & Narrative: 3 A/B/C voice comparisons + 3 optional narrative prompts
  - Step 7 — Culture & Anti-References: 6 brand archetype cards + 8 anti-reference toggle chips
- **Brand Character Types** (`src/lib/types/brand-character.ts`): EmotionalGoal, VoiceTone, BrandArchetype, AntiReference types + display data constants
- **Store & Schema Updates**: 5 new fields in Zustand store + Convex siteSpecs table (all optional, backward compatible)
- **AI Prompt Integration**: generateQuestions + generateSiteSpec updated with character context
- **Deterministic Fallback Enhancement**: Voice-keyed headlines (`getVoiceKeyedHeadline`), voice-keyed CTAs (`getVoiceKeyedCtaText`), anti-reference CTA checks
- **Emotional Theme Overrides** (`src/lib/theme/emotional-overrides.ts`): Adjusts spacing, transitions, animation, radius based on emotional goals + anti-references
- **Preview UI**: Sidebar shows Emotional Goals, Voice & Character, and Anti-References sections
- **Progress Indicator**: Segmented progress bar (Setup | Character | Discovery) replaces 6 circles

### Phase 4D: Mobile Responsiveness — COMPLETE

- **16 of 18 components** updated with mobile-first responsive patterns (NavSticky and ContentText already mobile-friendly)
- **Responsive spacing**: Section headers `mb-8 md:mb-16`, card padding `p-5 md:p-8`, gap reduction on mobile
- **Font size clamping**: `clamp(var(--text-2xl), 5vw, var(--text-4xl))` for stat numbers and pricing
- **CTA button sizing**: `px-5 py-3 md:px-7 md:py-3.5` prevents overflow at 375px
- **Responsive carousel**: ProofTestimonials uses `useState` + `resize` listener for perPage (1/2/3 by breakpoint)
- **Responsive masonry**: MediaGallery adapts column count by viewport width
- **Overflow fix**: CommerceServices tiered card `scale(1.05)` removed to prevent horizontal scroll

### Output Quality Overhaul — 91% COMPLETE (30/33 stories shipped)

- **Tier 1: Content Fidelity** (9/9) — AI prompt restructured, business-type-aware content, narrative prompts, content validator + auto-fix
- **Tier 2: Visual Character** (6/6) — Industry color hues, emotional color overrides, business-aware fonts and variants
- **Tier 3: Feedback Loop** (5/5) — Screenshot capture (html2canvas + Playwright), Claude Vision evaluation (5 dimensions), VLM feedback → theme adjustments, satisfaction rating, pipeline logging
- **Tier 4: Intake Upgrades** (1/1 active, 3 deferred) — A/B theme variant toggle; mood boards deferred as premium
- **Tier 5: Anti-References** (2/2) — Redesigned with genuine aesthetic trade-offs + industry-specific suggestions
- **Tier 6: Dev Tooling** (7/7) — Dev panel (6 tabs), named test cases, side-by-side comparison
- 376+ tests across 24+ test files
- Tracked in `docs/EPICS_AND_STORIES.md`

### Phase 5A: CSS Visual Foundation — COMPLETE

- **New `src/lib/visuals/` directory** with 9 modules for CSS-driven visual design
- **14 CSS patterns** (pinstripe, herringbone, waves, dots, grid, zigzag, seigaiha, topography, etc.) mapped to 25+ business sub-types
- **4 section divider components** (wave, angle, curve, zigzag) as SVG, absolutely positioned at section edges
- **5 decorative accent elements** (blob, dot-grid, geometric-frame, diamond, circle)
- **ImagePlaceholder component** with 3 variants (gradient, pattern, shimmer) — no more broken/empty images
- **Visual vocabulary system**: Each business type gets a coherent visual language (divider style, accent shape, image overlay, parallax, scroll reveal intensity) with archetype and personality overrides
- **`hero-split` and `content-split` images made optional** — CSS gradient fallback renders when no image provided
- **Section component extended** with `dividerTop`, `dividerBottom`, `pattern`, `patternSize`, `patternPosition`, `patternOpacity` props
- **`VisualConfig` type** added to `ComponentPlacement` — patterns and dividers flow through the spec
- **AssemblyRenderer** resolves `visualConfig` into Section props (pattern CSS, dividers) using theme colors
- **Parallax hook** (`useParallax`) using `useSyncExternalStore` + framer-motion `useScroll` — respects `prefers-reduced-motion`, disables on mobile
- **Deterministic fallback updated**: Removed hardcoded Unsplash URL, added visual config per component, added `content-split` sections, skips `media-gallery`/`proof-beforeafter` (require real images)
- **AI prompt updated**: Images optional, `visualConfig` field documented, image-heavy components excluded until stock photos available

### Recent UI Enhancements (shipped alongside Phase 5A)

- **Iframe-based viewport switcher** — Preview renders in isolated iframe at `/demo/preview/render`, parent-iframe `ewb:` PostMessage protocol (set-theme, set-page, request-screenshot), true responsive breakpoints
- **Animated wireframe assembly loading** — Step 9 loading screen shows animated wireframe blocks assembling into place (replaces cycling progress bar)
- **Mobile UX overhaul** — Bottom sheet modals for sidebar (max 65vh), scroll position reset on tab change, tab-based mobile interface, `useIsMobile()` hook with debounced detection (`src/lib/hooks/use-is-mobile.ts`)

### Next: Phase 5B-D — Stock Photos, AI Images, Advanced Scroll

> Priorities informed by [docs/STRATEGIC_ROADMAP.md](docs/STRATEGIC_ROADMAP.md) — honest assessment, impact × feasibility ranking, integration-first strategy.

- **Phase 5B: Stock photo integration** — Multi-provider search (Unsplash/Pexels/Pixabay), keyword builder, image caching, color-filtered search
- **Phase 5C: AI image generation** — convex-nano-banana (Gemini), priority queue, reactive loading, experimental headshots
- **Phase 5D: Advanced scroll effects** — CSS scroll-timeline, depth scrolling, scale transforms
- Then: Multi-page generation & routing, refinement chat MVP, Vercel deployment, user accounts
- Later: Integrations (booking, commerce, blog/CMS) via third-party services — we build the UI, they handle functionality
- Visual editor deferred to Phase 9 (high effort, lower immediate impact)

## Component Library (18 Components)

| Component            | Variants                          | Key Notes                         |
| -------------------- | --------------------------------- | --------------------------------- |
| `nav-sticky`         | transparent, solid                | Responsive mobile menu            |
| `section`            | 6 bg variants, 5 spacing presets  | + dividers, patterns, overlays    |
| `hero-centered`      | with-bg-image, gradient-bg        | Gradient overlay                  |
| `hero-split`         | image-right, image-left           | Image optional (CSS fallback)     |
| `content-features`   | icon-cards                        | Lucide icon lookup                |
| `content-split`      | alternating                       | Image optional (CSS fallback)     |
| `content-text`       | centered                          | HTML body support                 |
| `content-stats`      | inline, cards, animated-counter   | `value` is number type            |
| `content-accordion`  | single-open, multi-open, bordered | Keyboard accessible               |
| `content-timeline`   | vertical, alternating             | Uses `date` field (not `year`)    |
| `content-logos`      | grid, scroll, fade                | Has `headline` (no `subheadline`) |
| `cta-banner`         | full-width, contained             | 4 bg options                      |
| `form-contact`       | simple                            | Validation + success state        |
| `footer-standard`    | multi-column                      | Social icons, copyright           |
| `proof-testimonials` | carousel                          | Responsive perPage (1/2/3)        |
| `proof-beforeafter`  | slider, side-by-side              | Uses `comparisons` (not `items`)  |
| `team-grid`          | cards, minimal, hover-reveal      | Uses `image` (not `avatar`)       |
| `commerce-services`  | card-grid, list, tiered           | Uses `name` (not `title`)         |
| `media-gallery`      | grid, masonry, lightbox           | Responsive masonry columns        |

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
- **Mobile-first responsive**: All spacing/padding uses `mobile md:desktop` pattern (e.g., `mb-8 md:mb-16`, `p-5 md:p-8`)
- **Font clamping**: Large display text uses `clamp()` to prevent overflow on narrow viewports
- **Responsive behavior**: Components with viewport-dependent layout (carousel perPage, masonry columns) use `useState` + `resize` listener
- **Image optional pattern**: `hero-split` and `content-split` images are optional — render `ImagePlaceholder` (gradient/pattern/shimmer) when absent
- **Section visual extensions**: Section accepts `dividerTop`, `dividerBottom`, `pattern`, `patternOpacity` props for CSS-driven visual richness
- **Visual vocabulary**: Each business type has a coherent visual language (pattern, divider, accent shape, parallax, scroll reveal) resolved by `getVisualVocabulary()`

## Important Patterns

- **Bridge pattern**: Steps 1-4 use local React state, `bridgeToStore()` syncs to Zustand at Step 4→5
- **Dual-path generation**: AI-first with deterministic fallback in both `generateQuestions` and `generateSiteSpec`
- **COMPONENT_REGISTRY**: Maps componentId strings to React components; `UNWRAPPED_COMPONENTS` for nav/footer
- **AssemblyRenderer**: Generates theme from personalityVector, applies emotional overrides if character data present, loads Google Fonts, renders in ThemeProvider
- **ConditionalLayout**: Hides platform Navbar/Footer on `/preview` and `/demo/preview` routes
- **ConvexClientProvider**: Wraps entire app in `layout.tsx` — required for `useQuery`/`useAction` hooks
- **Step 8 staleness detection**: `questionsInputKey` fingerprint computed from siteType|goal|businessName|description|emotionalGoals|voiceProfile|brandArchetype
- **Export pipeline**: `generateProject()` → `ExportResult` → `createProjectZip()` → `downloadBlob()`
- **Brand character flow**: Steps 5-7 capture emotional goals, voice tone (A/B/C comparison), brand archetype, and anti-references — all stored in Zustand + Convex
- **Voice-keyed content**: Deterministic fallback produces different headlines/CTAs per voice mode (warm/polished/direct), with anti-reference constraints
- **Emotional overrides**: `applyEmotionalOverrides()` adjusts spacing, transitions, animation intensity, radius based on emotional goals and anti-references
- **Responsive carousel**: ProofTestimonials `perPage` adapts via `useState` + `resize` listener — 1 (mobile), 2 (tablet), 3 (desktop); page resets on breakpoint change
- **Responsive masonry**: MediaGallery `masonryColumns` adapts via `useState<number>` + `resize` listener — 1 (<640px), min(columns, 2) (640-1023px), columns (>=1024px)
- **VLM feedback loop**: Screenshot (html2canvas client / Playwright server) → Claude Vision 5-dimension scoring → mapAdjustmentsToTokenOverrides() → Partial<ThemeTokens> merged into activeTheme
- **VLM evaluation**: On-demand via DevPanel VLM tab, ~$0.03/eval, deterministic fallback returns 5/10 for all dimensions
- **vlmOverrides state**: In preview page, merged into activeTheme via useMemo, triggers instant re-render without spec regeneration
- **Screenshot capture**: html2canvas dynamic import, fonts.ready + 300ms settle, 4000px height cap, scale=1
- **Convex vlmEvaluations table**: sessionId index, stores dimensions/summary/themeAdjustments per evaluation
- **Visual config flow**: `VisualConfig` on `ComponentPlacement` → `buildSectionVisualProps()` in AssemblyRenderer → Section props (pattern CSS, dividers)
- **CSS patterns**: `generatePattern(patternId, color)` → CSS background value; `getPatternSize()`/`getPatternPosition()` for gradient patterns
- **Industry visual defaults**: Convex `VISUAL_DEFAULTS` inlined in `generateSiteSpec.ts` (Convex cannot import from `src/`); mirrors `src/lib/visuals/industry-patterns.ts`
- **Section dividers**: `SectionDivider` renders wave/angle/curve/zigzag SVGs at top/bottom edges; colors from theme tokens
- **ImagePlaceholder**: 3 variants (gradient, pattern, shimmer); used by `hero-split` and `content-split` when image is absent
- **Parallax hook**: `useParallax()` uses `useSyncExternalStore` for viewport detection (not setState in effect); disables below 768px and for `prefers-reduced-motion`
- **Visual vocabulary resolution**: `getVisualVocabulary()` → `applyArchetypeOverrides()` → `applyPersonalityOverrides()` for full visual language per site
- **Iframe preview**: `/demo/preview/render` renders the site in isolation; parent communicates via `postMessage` with `ewb:` prefix (set-theme, set-page, request-screenshot)
- **Mobile detection**: `useIsMobile()` hook in `src/lib/hooks/use-is-mobile.ts` with debounced resize listener; drives bottom sheet vs sidebar layout

## Content Field Naming (Critical for Spec Generation)

When generating component content, field names MUST match type interfaces exactly:

| Component           | Field                          | Type                    |
| ------------------- | ------------------------------ | ----------------------- |
| `commerce-services` | `name` (not `title`)           | `ServiceItem`           |
| `team-grid`         | `image` (not `avatar`)         | `TeamMember`            |
| `content-timeline`  | `date` (not `year`)            | `TimelineItem`          |
| `proof-beforeafter` | `comparisons` (not `items`)    | `ProofBeforeAfterProps` |
| `content-stats`     | `value` (number, not string)   | `StatItem`              |
| `content-split`     | `sections` (not `rows`)        | `ContentSplitProps`     |
| `content-split`     | `image` (OPTIONAL per section) | `ContentSplitSection`   |
| `hero-split`        | `image` (OPTIONAL)             | `HeroSplitProps`        |
| `content-logos`     | `headline` (no `subheadline`)  | `ContentLogosProps`     |

## Key Files to Reference

Before starting work, always read:

1. This file (CLAUDE.md)
2. `docs/ARCHITECTURE.md` — for system design context
3. `docs/ROADMAP.md` — for current priorities (Phase 5B: stock photo integration is next)
4. `docs/EPICS_AND_STORIES.md` — for Output Quality Overhaul tracking (30/33 shipped)
5. Relevant doc files for the specific area you're working on

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
- Intake flow is 9 steps: Setup (1-4) → Character (5-7) → Discovery (8) → Generation (9); bridge pattern syncs Steps 1-4 local state to Zustand at Step 4→5 transition
- Brand character data (emotional goals, voice profile, archetype, anti-references, narrative prompts) flows through AI prompts and deterministic fallback for differentiated output
- Assembly engine renders sites client-side — `AssemblyRenderer` is a `"use client"` component; applies emotional theme overrides when character data is present
- `COMPONENT_REGISTRY` in `component-registry.ts` maps 18 componentId strings to React components; `UNWRAPPED_COMPONENTS` set tracks components that handle their own layout (nav-sticky, footer-standard)
- `ConvexClientProvider` wraps the entire app in `layout.tsx` — required for `useQuery`/`useAction` hooks in any component
- Demo preview page at `/demo/preview?session=<sessionId>` fetches spec from Convex by sessionId
- Export pipeline generates static HTML/CSS ZIP via JSZip — triggered from PreviewToolbar export button

## Testing Philosophy & Failure Protocol

### Test Failure Protocol

When a test fails, follow this decision tree **IN ORDER**:

1. **Is the test correct?** Read the test carefully. Does it test a real requirement or expected behavior? Check if the test matches the documented spec, the component's type interface, or the function's documented contract.
2. **If the test IS correct → fix the source code.** The test is telling you something is broken. Find the root cause in the source code and fix it there. Do NOT modify the test to match broken behavior.
3. **If the test is WRONG → fix the test, but explain why.** If the test was written with incorrect assumptions (wrong expected value, wrong API usage, testing an implementation detail that legitimately changed), fix the test AND add a comment explaining what was wrong with the original test.
4. **If it's ambiguous → ask.** If you're not sure whether the test or the source code is "right," flag it with a comment and keep moving. Don't silently change either one.

### What Counts as a Band-Aid (DO NOT DO THESE)

- ❌ Changing `expect(result).toBe('Book Now')` to `expect(result).toBe('Shop Now')` because the function returns `'Shop Now'` — if the function is supposed to return `'Book Now'` for a booking site, the function is broken, not the test.
- ❌ Wrapping a failing assertion in try/catch and swallowing the error
- ❌ Changing `toHaveLength(6)` to `toHaveLength(5)` because one item is missing — find out WHY it's missing
- ❌ Adding `skip` or `todo` to a failing test without explanation
- ❌ Removing a test entirely because it's "too strict"
- ❌ Loosening a specific assertion to a vague one (e.g., changing `toContain('Book Now')` to `toBeTruthy()`)

### What Counts as a Legitimate Test Fix

- ✅ The test used a wrong function signature (the API changed intentionally and the test wasn't updated)
- ✅ The test hardcoded a value that was never part of the contract (e.g., testing exact hex color output when only "valid hex" matters)
- ✅ The test is testing an implementation detail that changed, not a behavior (e.g., testing internal state structure instead of public output)
- ✅ The test has a typo or logic error (wrong variable name, incorrect assertion method)

### Root Cause Principle

When fixing a bug exposed by a test:

- Fix it at the **DEEPEST level** where the problem originates
- If a component shows wrong data, but the data comes from a generator function, fix the generator — not the component
- If a theme generates wrong colors, but the issue is in the personality-to-hue mapping, fix the mapping function — not the color output post-hoc
- After fixing the root cause, verify that the fix doesn't break other tests

### Writing Good Tests

- **Test behavior, not implementation.** Test "returns a valid hex color" not "calls chroma.hex()". Test "business name appears in nav" not "logoText prop is set".
- **Test the contract.** If a function's documented purpose is "generate theme from personality vector," test that it returns a valid theme for various vectors — not that it uses a specific internal algorithm.
- **Use descriptive test names.** Not `test('works')` but `test('generateThemeFromVector returns dark background for luxury preset vector')`.
- **One assertion per concept.** Multiple `expect()` calls are fine if they test the same concept. Don't test theme generation AND component rendering in the same test.
- **Edge cases matter.** Test boundary values (all zeros, all ones, empty strings, missing optional fields). These are where bugs live.
