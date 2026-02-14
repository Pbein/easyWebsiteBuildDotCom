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
├── business/
│   ├── HORMOZI_ANALYSIS.md        # Revenue-first business analysis
│   ├── USER_JOURNEY.md            # Full user journey map from codebase analysis
│   └── boardroom/                 # Strategic decision governance
│       ├── PROCESS.md             # How boardroom sessions work + reconciliation rules
│       ├── STRATEGIC_PRINCIPLES.md # Core principles all decisions must align to (P1-P8)
│       ├── DECISIONS_LOG.md       # Running log of all decisions with status tracking
│       └── sessions/              # Individual session transcripts
│           └── 2026-02-12-customization-system.md  # Session 001
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
│   │   └── library/             # Component library (24 components)
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
│       │   ├── component-registry.ts  # componentId → React component mapping (24 components)
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
│       └── generateSiteSpec.ts   # Claude-powered site spec generation (24 components)
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

**All phases through 5B are COMPLETE.** See `docs/ROADMAP.md` for full history.

| Phase   | What shipped                                                                                  |
| ------- | --------------------------------------------------------------------------------------------- |
| 1       | Platform website (homepage, demo, docs) + Navbar/Footer/ConditionalLayout                     |
| 2       | Component library MVP (10 components), theme system (87 tokens, 7 presets), preview page      |
| 3       | 9-step intake flow, AI + deterministic dual-path generation, assembly engine, Convex schema   |
| 4A      | Content field accuracy fixes, questionsInputKey staleness detection                           |
| 4B      | +8 components (18 total), +4 presets (7 total), export pipeline (HTML/CSS ZIP)                |
| 4C      | Brand character system: emotional goals, voice tones, archetypes, anti-references (Steps 5-7) |
| 4D      | Mobile responsiveness: font clamping, responsive carousel/masonry, CTA sizing                 |
| Quality | Output Quality Overhaul: 30/33 stories (6 tiers), VLM feedback loop, dev tooling              |
| 5A      | CSS visual foundation: 14 patterns, 4 dividers, placeholders, parallax, visual vocabulary     |
| Wave 1  | +6 components (24 total), CSS effects system (8 effects), agent playbook                      |
| 5B      | Stock photo integration (Unsplash/Pexels/Pixabay, context-aware, cached)                      |
| UI      | Iframe viewport switcher, wireframe loading animation, mobile bottom sheets                   |

### Current: Phase 6 — Post-Generation Customization System

> Boardroom BD-001: `business/boardroom/sessions/2026-02-12-customization-system.md`

- **6A** (Weeks 1-3): Free Customization MVP — sidebar panel, 7 presets, color picker, 5/14 fonts, headline editing, reset
- **6B** (Weeks 3-5): Shareable preview links + "Built with EWB" badge
- **6C** (Weeks 5-8): Clerk auth + Stripe billing (Pro $19/mo, Agency $49/mo)
- **6D** (Weeks 8-12): Variant switching, personality sliders, section reorder

> Parallel: Phase 5C (AI images), 5D (scroll effects), multi-page, integrations. Visual editor deferred to Phase 9.

## Component Library (24 Components)

| Component            | Variants                              | Key Notes                         |
| -------------------- | ------------------------------------- | --------------------------------- |
| `nav-sticky`         | transparent, solid                    | Responsive mobile menu            |
| `section`            | 6 bg variants, 5 spacing presets      | + dividers, patterns, overlays    |
| `hero-centered`      | with-bg-image, gradient-bg            | Gradient overlay                  |
| `hero-split`         | image-right, image-left               | Image optional (CSS fallback)     |
| `hero-video`         | background-video, embedded, split     | videoUrl + posterImage optional   |
| `content-features`   | icon-cards                            | Lucide icon lookup                |
| `content-split`      | alternating                           | Image optional (CSS fallback)     |
| `content-text`       | centered                              | HTML body support                 |
| `content-stats`      | inline, cards, animated-counter       | `value` is number type            |
| `content-accordion`  | single-open, multi-open, bordered     | Keyboard accessible               |
| `content-timeline`   | vertical, alternating                 | Uses `date` field (not `year`)    |
| `content-logos`      | grid, scroll, fade                    | Has `headline` (no `subheadline`) |
| `content-steps`      | numbered, icon-cards, horizontal      | Lucide icon lookup                |
| `content-comparison` | table, side-by-side, checkmark-matrix | Values: string or boolean         |
| `content-map`        | full-width, split-with-info, embedded | contactInfo with address/phone    |
| `pricing-table`      | simple, featured, comparison          | `plans[]` with PricingPlan        |
| `blog-preview`       | card-grid, featured-row, list         | `posts[]` with BlogPost           |
| `cta-banner`         | full-width, contained                 | 4 bg options                      |
| `form-contact`       | simple                                | Validation + success state        |
| `footer-standard`    | multi-column                          | Social icons, copyright           |
| `proof-testimonials` | carousel                              | Responsive perPage (1/2/3)        |
| `proof-beforeafter`  | slider, side-by-side                  | Uses `comparisons` (not `items`)  |
| `team-grid`          | cards, minimal, hover-reveal          | Uses `image` (not `avatar`)       |
| `commerce-services`  | card-grid, list, tiered               | Uses `name` (not `title`)         |
| `media-gallery`      | grid, masonry, lightbox               | Responsive masonry columns        |

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

## Important Patterns & Notes

### Core Architecture

- **Bridge pattern**: Steps 1-4 use local React state, `bridgeToStore()` syncs to Zustand at Step 4→5
- **Dual-path generation**: AI-first with deterministic fallback in both `generateQuestions` and `generateSiteSpec`
- **COMPONENT_REGISTRY**: Maps componentId strings → React components; `UNWRAPPED_COMPONENTS` for nav/footer
- **AssemblyRenderer**: personalityVector → theme (+ emotional overrides) → Google Fonts → ThemeProvider → component tree
- **ConditionalLayout**: Hides platform Navbar/Footer on `/preview` and `/demo/preview` routes
- **ConvexClientProvider**: Wraps entire app in `layout.tsx` — required for `useQuery`/`useAction` hooks
- **Iframe preview**: `/demo/preview/render` in isolated iframe; `postMessage` with `ewb:` prefix

### Content & Brand Character

- **Voice-keyed content**: Deterministic fallback produces different headlines/CTAs per voice mode (warm/polished/direct), with anti-reference constraints
- **Emotional overrides**: `applyEmotionalOverrides()` adjusts spacing/transitions/radius based on goals + anti-references
- **Step 8 staleness**: `questionsInputKey` fingerprint from siteType|goal|businessName|description|emotionalGoals|voiceProfile|brandArchetype

### Visual System

- **Visual config flow**: `VisualConfig` on `ComponentPlacement` → `buildSectionVisualProps()` → Section props
- **CSS patterns**: `generatePattern(patternId, color)` → CSS background; `getPatternSize()`/`getPatternPosition()`
- **Visual vocabulary**: `getVisualVocabulary()` → `applyArchetypeOverrides()` → `applyPersonalityOverrides()`
- **Industry visual defaults**: Convex `VISUAL_DEFAULTS` inlined in `generateSiteSpec.ts` (cannot import from `src/`)
- **CSS Effects**: `EFFECT_REGISTRY` for lookup, `buildEffectStyles()` in AssemblyRenderer, `injectKeyframes()` deduplicates

### VLM & Screenshots

- **VLM feedback loop**: Screenshot → Claude Vision 5-dimension scoring → `mapAdjustmentsToTokenOverrides()` → Partial<ThemeTokens>
- **Screenshot capture**: html2canvas dynamic import, fonts.ready + 300ms settle, 4000px height cap, scale=1

### Platform Notes

- Convex requires `npx convex dev` to generate types — excluded from tsconfig
- Husky pre-commit hook runs lint-staged (ESLint + Prettier)
- Platform design: dark theme with amber/gold (#e8a849) + teal (#3ecfb4)
- AI uses `@anthropic-ai/sdk` — requires `ANTHROPIC_API_KEY`; both actions have deterministic fallbacks
- Demo preview at `/demo/preview?session=<sessionId>` fetches spec from Convex
- Export generates static HTML/CSS ZIP via JSZip from PreviewToolbar
- **Boardroom governance**: Strategic decisions go through Virtual Boardroom (9 personas). Read `business/boardroom/PROCESS.md` + `STRATEGIC_PRINCIPLES.md` + `DECISIONS_LOG.md` before sessions.
- **Document alignment**: `business/`, `docs/`, and `CLAUDE.md` must stay in sync

## Content Field Naming (Critical for Spec Generation)

When generating component content, field names MUST match type interfaces exactly:

| Component            | Field                          | Type                     |
| -------------------- | ------------------------------ | ------------------------ |
| `commerce-services`  | `name` (not `title`)           | `ServiceItem`            |
| `team-grid`          | `image` (not `avatar`)         | `TeamMember`             |
| `content-timeline`   | `date` (not `year`)            | `TimelineItem`           |
| `proof-beforeafter`  | `comparisons` (not `items`)    | `ProofBeforeAfterProps`  |
| `content-stats`      | `value` (number, not string)   | `StatItem`               |
| `content-split`      | `sections` (not `rows`)        | `ContentSplitProps`      |
| `content-split`      | `image` (OPTIONAL per section) | `ContentSplitSection`    |
| `hero-split`         | `image` (OPTIONAL)             | `HeroSplitProps`         |
| `content-logos`      | `headline` (no `subheadline`)  | `ContentLogosProps`      |
| `pricing-table`      | `plans[]` with `PricingPlan`   | `PricingTableProps`      |
| `content-steps`      | `steps[]` with `StepItem`      | `ContentStepsProps`      |
| `content-comparison` | `columns` + `rows`             | `ContentComparisonProps` |
| `blog-preview`       | `posts[]` with `BlogPost`      | `BlogPreviewProps`       |
| `content-map`        | `contactInfo` object           | `ContentMapProps`        |

## Key Files to Reference

Before starting work, always read:

1. This file (CLAUDE.md)
2. `docs/ARCHITECTURE.md` — for system design context
3. `docs/ROADMAP.md` — for current priorities (Phase 6: Customization System is next)
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
