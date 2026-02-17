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
│       └── sessions/              # Individual session transcripts (001-003)
│           ├── 2026-02-12-customization-system.md  # Session 001: Phase 6 customization
│           ├── 2026-02-14-rd-and-pricing.md        # Session 002: R&D benchmark + pricing
│           └── 2026-02-15-product-simplification.md # Session 003: Express path + one core action
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
│   │   ├── error.tsx            # Root error boundary (PostHog tracking)
│   │   ├── demo/
│   │   │   ├── page.tsx         # Demo — 9-step intake flow experience
│   │   │   ├── error.tsx        # Demo-specific error boundary
│   │   │   ├── loading.tsx      # Demo loading spinner
│   │   │   └── preview/
│   │   │       ├── page.tsx     # Demo preview — assembled site with viewport controls + export
│   │   │       ├── error.tsx    # Preview-specific error boundary
│   │   │       ├── loading.tsx  # Preview loading spinner
│   │   │       └── render/page.tsx # Isolated iframe renderer for true responsive preview
│   │   ├── s/[shareId]/         # Shared preview page (public, reads from sharedPreviews)
│   │   │   └── SharedPreviewClient.tsx # Client component: loads snapshot, renders with customizations
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
│   │   │       ├── CustomizationSidebar.tsx # Customization panel (presets, color, fonts, headlines, reset)
│   │   │       ├── PreviewSidebar.tsx # Spec metadata sidebar (legacy, replaced by CustomizationSidebar)
│   │   │       ├── PreviewToolbar.tsx # Viewport controls + export toolbar
│   │   │       ├── DevPanel.tsx        # Developer diagnostic panel (6 tabs)
│   │   │       └── FeedbackBanner.tsx  # Quick satisfaction rating banner
│   │   └── library/             # Component library (24 components)
│   │       ├── base.types.ts    # BaseComponentProps, ImageSource, LinkItem, CTAButton
│   │       ├── spacing.ts       # Shared SPACING_MAP + SPACING_MAP_ELEMENT constants
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
│       │   ├── font-loader.ts   # Runtime Google Fonts loader (50-font cap, error handling, cleanup)
│       │   ├── AssemblyRenderer.tsx    # Spec → live site renderer (+ emotional overrides + visual config)
│       │   └── index.ts         # Barrel export
│       ├── export/              # Export pipeline
│       │   ├── generate-project.ts    # SiteIntentDocument → static HTML/CSS files
│       │   ├── create-zip.ts          # JSZip bundling + browser download
│       │   └── index.ts               # Barrel export
│       ├── sanitize.ts         # DOMPurify HTML sanitizer (SSR-safe, strips tags on server)
│       ├── content/
│       │   └── voice-keyed.ts # Voice-appropriate headline/CTA templates (canonical source)
│       ├── share/
│       │   └── generate-share-id.ts # Cryptographic URL-safe share ID generator
│       ├── hooks/
│       │   └── use-is-mobile.ts # Mobile detection hook with debounced resize listener
│       ├── stores/
│       │   ├── intake-store.ts  # Zustand store with localStorage persistence (9-step + express mode)
│       │   └── customization-store.ts # Zustand store for post-generation customizations (presets, colors, fonts, content, brand character)
│       ├── theme/               # Theme system
│       │   ├── theme.types.ts   # ThemeTokens interface (87 tokens, 6 categories)
│       │   ├── token-map.ts     # Token → CSS property mapping
│       │   ├── generate-theme.ts # Personality → tokens generation (chroma-js)
│       │   ├── emotional-overrides.ts # Emotion/anti-reference → token adjustments
│       │   ├── presets.ts       # 7 presets
│       │   ├── font-pairings.ts # 14 font pairings + FREE_FONT_IDS + selection logic
│       │   ├── derive-from-primary.ts # Single hex → full palette derivation (chroma-js)
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
│   ├── schema.ts                # Database schema (10 tables)
│   ├── siteSpecs.ts             # Site spec CRUD (saveSiteSpec, getSiteSpec)
│   ├── sharedPreviews.ts        # Share link CRUD (createShareLink, getByShareId, incrementViewCount)
│   ├── vlmEvaluations.ts         # VLM evaluation save/query
│   ├── pipelineLogs.ts           # Pipeline session logging
│   ├── feedback.ts               # User satisfaction ratings
│   ├── testCases.ts              # Named test case CRUD
│   └── ai/                      # AI integration actions
│       ├── generateQuestions.ts  # Claude-powered discovery questions (XML prompt boundaries)
│       └── generateSiteSpec.ts   # Claude-powered site spec generation (XML prompt boundaries)
├── tests/                       # Test suite (989 tests, 64 files)
│   ├── setup.ts                 # Global test setup (jsdom, mocks)
│   ├── helpers/                 # Test utilities (fixtures, assertions, render-with-theme)
│   ├── unit/                    # Unit tests (components, assembly, theme, visuals, convex)
│   ├── integration/             # Integration tests (flows, postmessage, theme-to-components)
│   └── e2e/                     # Playwright E2E specs
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

**All phases through 6C are COMPLETE.** See `docs/ROADMAP.md` for full history and `docs/INDEX.md` for documentation map.

| Phase   | What shipped                                                                                                                     |
| ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1       | Platform website (homepage, demo, docs) + Navbar/Footer/ConditionalLayout                                                        |
| 2       | Component library MVP (10 components), theme system (87 tokens, 7 presets), preview page                                         |
| 3       | 9-step intake flow, AI + deterministic dual-path generation, assembly engine, Convex schema                                      |
| 4A      | Content field accuracy fixes, questionsInputKey staleness detection                                                              |
| 4B      | +8 components (18 total), +4 presets (7 total), export pipeline (HTML/CSS ZIP)                                                   |
| 4C      | Brand character system: emotional goals, voice tones, archetypes, anti-references (Steps 5-7)                                    |
| 4D      | Mobile responsiveness: font clamping, responsive carousel/masonry, CTA sizing                                                    |
| Quality | Output Quality Overhaul: 30/33 stories (6 tiers), VLM feedback loop, dev tooling                                                 |
| 5A      | CSS visual foundation: 14 patterns, 4 dividers, placeholders, parallax, visual vocabulary                                        |
| Wave 1  | +6 components (24 total), CSS effects system (8 effects), agent playbook                                                         |
| 5B      | Stock photo integration (Unsplash/Pexels/Pixabay, context-aware, cached)                                                         |
| UI      | Iframe viewport switcher, wireframe loading animation, mobile bottom sheets                                                      |
| 6A      | Free Customization MVP: sidebar panel, 7 presets, color picker, 5/14 fonts, headline editing, reset, Zustand customization store |
| 6B      | Shareable preview links, "Built with EWB" badge, customization snapshot persistence, share button + Web Share API                |
| 6C      | Express path (3-step, <90s), immersive 3s reveal, brand discovery sidebar with real-time theme/content feedback                  |
| Audit   | Testing suite (989 tests, 64 files), security hardening, a11y fixes, SPACING_MAP dedup, SSR-safe sanitizer                       |

### Next: Monetization (P1)

> Boardroom Sessions: BD-003 (Pricing/Monetization)
> See `docs/ROADMAP.md` for full details and `business/boardroom/DECISIONS_LOG.md` for decision context.

**Revenue Foundation — remaining tracks:**

| Track           | Status        | What                                                                                            | Key Decision |
| --------------- | ------------- | ----------------------------------------------------------------------------------------------- | ------------ |
| Express Path    | **DONE**      | 3-step intake, deterministic generation, <90s to preview                                        | BD-004-01    |
| Preview Reveal  | **DONE**      | Full-screen immersive 3s reveal, progressive disclosure of controls                             | BD-004-02    |
| Brand Discovery | **DONE**      | Post-gen character capture in sidebar, real-time theme/content feedback                         | BD-004-03    |
| Distribution    | **PARTIAL**   | Share links done; homepage fix, email capture, social templates pending                         | BD-003-03    |
| Monetization    | **NEXT (P1)** | Clerk auth + Stripe billing — Free ($0) → Starter ($12/mo) → Pro ($29/mo) → Own It ($99 export) | BD-003-01    |
| R&D Benchmark   | NOT STARTED   | Curated reference sites, screenshot analysis, pipeline comparison scoring                       | BD-003-02    |
| AI Design Chat  | NOT STARTED   | Conversational AI refinement as Pro-tier killer feature                                         | BD-003-04    |

**Future:** Multi-page, Next.js export, WCAG audit, integrations, visual editor

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
- ContentText uses `dangerouslySetInnerHTML` for body (sanitized via `sanitizeHtml()` — DOMPurify on client, regex strip on server)
- **Shared spacing**: All components import from `src/components/library/spacing.ts` — `SPACING_MAP` (18 components) or `SPACING_MAP_ELEMENT` (hero/footer/form/content-text)
- **Mobile-first responsive**: All spacing/padding uses `mobile md:desktop` pattern (e.g., `mb-8 md:mb-16`, `p-5 md:p-8`)
- **Font clamping**: Large display text uses `clamp()` to prevent overflow on narrow viewports
- **Responsive behavior**: Components with viewport-dependent layout (carousel perPage, masonry columns) use `useState` + `resize` listener
- **Image optional pattern**: `hero-split` and `content-split` images are optional — render `ImagePlaceholder` (gradient/pattern/shimmer) when absent
- **Section visual extensions**: Section accepts `dividerTop`, `dividerBottom`, `pattern`, `patternOpacity` props for CSS-driven visual richness
- **Visual vocabulary**: Each business type has a coherent visual language (pattern, divider, accent shape, parallax, scroll reveal) resolved by `getVisualVocabulary()`

## Important Patterns & Notes

### Core Architecture

- **Express path**: Default 3-step flow (type → goal → name/description) with `expressMode` flag in Zustand; bridges with neutral personality `[0.5, 0.5, 0.5, 0.5, 0.5, 0.5]`, jumps Step 3 → Step 9
- **Deep path**: Full 9-step flow (Steps 1-4 setup, 5-7 brand character, 8-9 discovery + generation)
- **Bridge pattern**: Steps 1-4 use local React state, `bridgeToStore()` syncs to Zustand at Step 4→5 (deep) or Step 3→9 (express)
- **Dual-path generation**: AI-first with deterministic fallback in both `generateQuestions` and `generateSiteSpec`
- **COMPONENT_REGISTRY**: Maps componentId strings → React components; `UNWRAPPED_COMPONENTS` for nav/footer
- **AssemblyRenderer**: personalityVector → theme (+ emotional overrides) → Google Fonts → ThemeProvider → component tree
- **5-layer theme composition**: base (preset or variant) → VLM overrides → emotional overrides → primary color → font pairing
- **Immersive reveal**: 3-second full-screen preview on load, sidebar hidden, click-to-skip, then sidebar slides in
- **ConditionalLayout**: Hides platform Navbar/Footer on `/preview`, `/demo/preview`, and `/s/[shareId]` routes
- **ConvexClientProvider**: Wraps entire app in `layout.tsx` — required for `useQuery`/`useAction` hooks
- **Iframe preview**: `/demo/preview/render` in isolated iframe; `postMessage` with `ewb:` prefix

### Content & Brand Character

- **Voice-keyed content**: `getVoiceKeyedHeadline()` in `src/lib/content/voice-keyed.ts` produces different headlines/CTAs per voice mode (warm/polished/direct) — $0 cost, deterministic
- **Brand Discovery sidebar**: Post-generation character capture (emotions, voice, archetype, anti-refs) in CustomizationSidebar with real-time theme/content feedback
- **Emotional overrides**: `applyEmotionalOverrides()` adjusts spacing (±40% clamped)/transitions (±50% clamped)/radius based on goals + anti-references
- **Step 8 staleness**: `questionsInputKey` fingerprint from siteType|goal|businessName|description|emotionalGoals|voiceProfile|brandArchetype

### Share & Distribution

- **Share links**: `generateShareId()` creates cryptographic 10-char alphanumeric IDs; `sharedPreviews` Convex table stores full customization snapshot
- **Share page**: `/s/[shareId]` loads snapshot, replays 5-layer theme composition, renders with BuiltWithBadge
- **Built with EWB badge**: Themed footer badge on shared previews and free-tier exports

### Visual System

- **Visual config flow**: `VisualConfig` on `ComponentPlacement` → `buildSectionVisualProps()` → Section props
- **CSS patterns**: `generatePattern(patternId, color)` → CSS background; `getPatternSize()`/`getPatternPosition()`
- **Visual vocabulary**: `getVisualVocabulary()` → `applyArchetypeOverrides()` → `applyPersonalityOverrides()`
- **Industry visual defaults**: Convex `VISUAL_DEFAULTS` inlined in `generateSiteSpec.ts` (cannot import from `src/`)
- **CSS Effects**: `EFFECT_REGISTRY` for lookup, `buildEffectStyles()` in AssemblyRenderer, `injectKeyframes()` deduplicates

### VLM & Screenshots

- **VLM feedback loop**: Screenshot → Claude Vision 5-dimension scoring → `mapAdjustmentsToTokenOverrides()` → Partial<ThemeTokens>
- **Screenshot capture**: html2canvas dynamic import, fonts.ready + 300ms settle, 4000px height cap, scale=1

### Security & Quality

- **PostMessage origin validation**: Iframe messages use `ewb:` prefix and validate against expected origin (no wildcard `*`)
- **Security headers**: CSP, X-Frame-Options, X-Content-Type-Options via Next.js middleware
- **HTML sanitization**: `sanitizeHtml()` in `src/lib/sanitize.ts` — DOMPurify allowlist on client, regex strip on server (SSR-safe)
- **Session IDs**: 128-bit entropy via `crypto.getRandomValues`
- **AI prompt boundaries**: XML `<system>` / `<user-input>` tags in Convex AI actions prevent injection
- **SSRF protection**: Screenshot API validates localhost-only URLs
- **Error boundaries**: `error.tsx` + `loading.tsx` at root, `/demo`, and `/demo/preview` routes
- **Testing**: 989 tests across 64 files (Vitest + Playwright). See `docs/TESTING_METHODOLOGY.md`

### Platform Notes

- Convex requires `npx convex dev` to generate types — excluded from tsconfig
- Husky pre-commit hook runs lint-staged (ESLint + Prettier)
- Platform design: dark theme with amber/gold (#e8a849) + teal (#3ecfb4)
- AI uses `@anthropic-ai/sdk` — requires `ANTHROPIC_API_KEY`; both actions have deterministic fallbacks
- Demo preview at `/demo/preview?session=<sessionId>` fetches spec from Convex
- Export generates static HTML/CSS ZIP via JSZip from PreviewToolbar
- **Font loader**: 50-font memory cap prevents leaks from repeated theme switching; cleanup on unmount
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
3. `docs/ROADMAP.md` — for current priorities (Revenue Foundation parallel tracks)
4. `docs/EPICS_AND_STORIES.md` — for Output Quality Overhaul tracking (30/33 shipped)
5. `docs/TESTING_METHODOLOGY.md` — **REQUIRED before writing any tests**
6. Relevant doc files for the specific area you're working on

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server
npx convex dev      # Start Convex dev server (run in parallel)

# Build & Quality
npm run build        # Production build
npm run lint         # Lint check

# Testing (989 tests, 64 files)
npm test             # Run Vitest unit + integration tests
npm run test:watch   # Run Vitest in watch mode
npx playwright test  # Run Playwright E2E tests

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

## Testing Philosophy — Requirements-First Testing

> **Full methodology**: `docs/TESTING_METHODOLOGY.md` — Read this before writing ANY test.

### The #1 Rule: Requirements First, Code Second

**NEVER** read source code and then write tests that confirm what the code does. Instead:

1. **Identify the requirement** — from CLAUDE.md, type interfaces, product specs, or bug reports
2. **Write the assertion** — what SHOULD the answer be, based on the requirement?
3. **THEN** read the source code only to understand setup (imports, props, mocks)
4. **Ask yourself** — "Would this test catch a bug, or would it pass even if the feature were broken?"

If a test's expected value was copied from the source code's return value, it is a **tautological test** and provides zero protection. Fix it.

### Test Classification (every test must fit one)

| Category        | What it tests                                            | Minimum per file                          |
| --------------- | -------------------------------------------------------- | ----------------------------------------- |
| **Requirement** | Product/UX behavior users depend on                      | At least 1                                |
| **Contract**    | API or type interface boundary                           | At least 1                                |
| **Invariant**   | A rule that must ALWAYS hold (e.g., no hardcoded colors) | Where applicable                          |
| **Boundary**    | Edge cases, limits, error states                         | At least 1                                |
| **Regression**  | A specific bug that was fixed                            | When applicable                           |
| **Smoke**       | Basic "doesn't crash"                                    | OK to include, but NEVER sufficient alone |

A test file with ONLY smoke tests ("renders without crashing") is **incomplete**.

### Required Test Documentation

Every `describe` block must document what requirement it protects:

```typescript
/**
 * @requirements
 * - [REQ-1]: Warm voice produces conversational language (Source: VOICE_TONE_CARDS)
 * - [REQ-2]: Anti-references actively constrain output (Source: CLAUDE.md brand character)
 */
describe("warm voice CTA generation", () => { ... });
```

### Good vs Bad Test Patterns

```typescript
// ❌ BAD — Copied expected value from source code (tautological)
it("warm + contact returns 'Let's chat'", () => {
  expect(getVoiceKeyedCtaText("contact", "warm", [])).toBe("Let's chat");
});

// ✅ GOOD — Tests the REQUIREMENT that warm voice is conversational
it("warm CTAs use approachable, low-pressure language", () => {
  const cta = getVoiceKeyedCtaText("contact", "warm", []);
  expect(cta.toLowerCase()).not.toMatch(/buy|purchase|order|subscribe|now!/);
  expect(cta.length).toBeLessThan(40);
});

// ❌ BAD — Tests that React renders props (React already guarantees this)
it("displays the headline", () => {
  renderWithTheme(<ContentText headline="Hello" body="World" />);
  expect(screen.getByText("Hello")).toBeTruthy();
});

// ✅ GOOD — Tests the REQUIREMENT that headlines use semantic HTML
it("headline renders as a semantic heading element", () => {
  renderWithTheme(<ContentText headline="Hello" body="World" />);
  const heading = screen.getByText("Hello");
  expect(heading.tagName).toMatch(/^H[1-6]$/);
});
```

### Test Failure Protocol

When a test fails, follow this decision tree **IN ORDER**:

1. **Is the test correct?** Does it test a real requirement from the spec, type interface, or documented contract?
2. **If the test IS correct → fix the source code.** The test is telling you something is broken. Do NOT modify the test to match broken behavior.
3. **If the test is WRONG → fix the test, but explain why.** Add a comment explaining what was wrong with the original test.
4. **If it's ambiguous → ask.** Don't silently change either one.

### Band-Aids — NEVER DO THESE

- ❌ Changing `expect(result).toBe('Book Now')` to `expect(result).toBe('Shop Now')` because the function returns `'Shop Now'` — if the function should return `'Book Now'` for a booking site, the function is broken
- ❌ Wrapping a failing assertion in try/catch and swallowing the error
- ❌ Changing `toHaveLength(6)` to `toHaveLength(5)` without finding out WHY it's missing
- ❌ Adding `skip` or `todo` to a failing test without explanation
- ❌ Loosening assertions (e.g., `toContain('Book Now')` → `toBeTruthy()`)
- ❌ Writing `expect(result).toBe(whatTheCodeReturns)` by reading the source first

### Legitimate Test Fixes

- ✅ The test used a wrong function signature (API changed intentionally)
- ✅ The test hardcoded a value never part of the contract (exact hex when only "valid hex" matters)
- ✅ The test was testing an implementation detail, not a behavior
- ✅ The test has a typo or logic error

### Root Cause Principle

- Fix bugs at the **DEEPEST level** where the problem originates
- Component shows wrong data but data comes from a generator? Fix the generator
- Theme generates wrong colors but the issue is personality-to-hue mapping? Fix the mapping
- After fixing root cause, verify no other tests break

### Writing Process

1. **Read requirement docs** (CLAUDE.md, component spec, type interfaces) — NOT the source code
2. **Write test plan as comments** listing requirements to test
3. **Write `expect()` assertions** for each requirement BEFORE implementing test body
4. **THEN read source** only for setup (imports, props, mocks)
5. **Review**: "Would this test catch a bug, or pass even if the feature were broken?"

### Test Review Checklist

Before any test file is complete:

- [ ] Every `describe` has a `@requirements` comment documenting what it protects
- [ ] No assertion was derived by reading the source code's return value
- [ ] At least one Requirement or Invariant test (not just smoke)
- [ ] Edge cases: empty inputs, null/undefined, boundary values, max limits
- [ ] Test names describe expected BEHAVIOR, not implementation
- [ ] Tests would still be valid if implementation were completely rewritten
