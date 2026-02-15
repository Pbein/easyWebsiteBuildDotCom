# Development Roadmap

## Phase 1: Platform Website & Foundation ✅ COMPLETE

**Goal**: Build easywebsitebuild.com with 3 core pages, establish project structure.

### Deliverables

- [x] Next.js 16 project with App Router, TypeScript strict, Tailwind CSS v4
- [x] Convex backend setup with initial schema (8 tables, indexes, mutations/queries)
- [x] Homepage — product landing page with 6 sections (Hero, How It Works, Differentiators, Site Types, Social Proof, CTA)
- [x] Demo page — working intake flow (4-step: site type, goals, description, personality A/B comparisons)
- [x] Docs page — full project documentation with sidebar navigation and 8 content sections
- [x] Platform layout (Navbar with scroll-aware transparency, Footer, AnimatedSection)
- [x] Responsive design across all pages
- [x] Convex schema for intake data storage (intakeResponses with saveResponse/getBySession)
- [x] Premium design system — Space Grotesk/Outfit/JetBrains Mono fonts, dark theme, amber/gold + teal accent palette
- [x] Developer tooling — Prettier, Husky pre-commit hooks, lint-staged, ESLint
- [x] Utility libraries — clsx + tailwind-merge (cn), Zustand intake store with persist, Sonner toast notifications
- [x] Full dependency suite — framer-motion, lucide-react, Radix UI primitives, react-hook-form + zod, react-markdown + shiki, chroma-js, class-variance-authority, date-fns, embla-carousel-react

---

## Phase 2: Core Component Library (MVP) ✅ COMPLETE

**Goal**: Build 10 essential components with 2-3 variants each, plus the theming token system.

### Deliverables

- [x] Theme token system — 87 CSS Custom Properties across 6 categories (colors, typography, spacing, shape, shadows, animation)
- [x] Token map — camelCase → CSS variable mapping with `tokensToCSSProperties()` and `tokensToCSSString()` converters
- [x] Theme generation from personality vector — `generateThemeFromVector()` using chroma-js for palette generation, 10 curated font pairings scored by personality fit
- [x] ThemeProvider + useTheme hook — React context that injects tokens as CSS custom properties, supports nested overrides
- [x] 3 theme presets:
  - Luxury Dark — deep navy, gold accents, Cormorant Garamond/Outfit
  - Modern Clean — white base, blue accent, Sora/DM Sans
  - Warm Professional — warm whites, terracotta/sage, Lora/Merriweather Sans
- [x] 10 core components (each with types, manifest.json, tokens, TSX, index):
  1. `nav-sticky` — transparent (solidifies on scroll), solid variants; responsive mobile menu
  2. `hero-centered` — with-bg-image (gradient overlay), gradient-bg (layered radial mesh) variants
  3. `hero-split` — image-right, image-left variants; decorative accent element behind image
  4. `content-features` — icon-cards variant; Lucide icon lookup, hover lift + shadow, staggered entry
  5. `content-split` — alternating variant; rows flip image side, per-row scroll animation
  6. `content-text` — centered variant; eyebrow, headline, body (supports HTML)
  7. `cta-banner` — full-width, contained variants; 4 background options (primary/dark/gradient/image)
  8. `form-contact` — simple variant; client-side validation, error states, success animation
  9. `proof-testimonials` — carousel variant; pagination dots, star ratings, avatar fallbacks
  10. `footer-standard` — multi-column variant; logo, tagline, link columns, SVG social icons, copyright bar
- [x] Section wrapper — universal layout component with 6 background variants, 5 spacing presets, container constraints
- [x] Component manifest system — JSON descriptors with siteTypes, personalityFit ranges, requiredProps, optionalProps, consumedTokens, variants, tags
- [x] Barrel exports — `src/components/library/index.ts` exporting all components + types
- [x] Manifest index — `src/components/library/manifest-index.ts` with `getManifestById()`, `getManifestsByCategory()`, `getManifestsBySiteType()` lookup utilities
- [x] Preview page (`/preview`) — live theme selector with 3 presets + custom personality vector sliders, complete "Meridian Studio" sample site using all 10 components
- [x] Preview page polish — ConditionalLayout hides platform Navbar/Footer on `/preview`, floating "Back to Site" exit button, collapsible ThemeSelector panel with minimize/expand toggle
- [x] Homepage CTA update — hero buttons reordered: "Sample Site Preview" (secondary, links to `/preview`) + "Try the Demo →" (primary, links to `/demo`); removed "Read the Docs" link from hero

---

## Phase 3: Intent Capture, AI Integration & Assembly Engine ✅ COMPLETE

**Goal**: Complete the intake flow with AI integration, build the assembly engine, and deliver live previews.

### Deliverables

- [x] Full 6-step intake flow UI (expanded from 4-step to 6-step demo)
- [x] Brand personality visual comparison system (6-axis A/B comparisons in Step 4)
- [x] Claude API integration for deep discovery questions (`convex/ai/generateQuestions.ts`)
- [x] Claude API integration for spec generation (`convex/ai/generateSiteSpec.ts`)
- [x] Site Intent Document generation from intake data (AI-first with deterministic fallback)
- [x] Zustand intake state management with localStorage persistence (`useIntakeStore`)
- [x] Convex storage for site specs (`siteSpecs` table with `saveSiteSpec` / `getSiteSpec`)
- [x] Intent path schema (knowledge base foundation — `intentPaths`, `recipes`, `components`, `themes`, `assets` tables)
- [x] Assembly engine — `COMPONENT_REGISTRY`, `AssemblyRenderer`, `font-loader`, `SiteIntentDocument` types
- [x] Theme resolver — personality vector → token set via `generateThemeFromVector()` in renderer
- [x] Component selection and variant matching using personality-driven logic in deterministic fallback
- [x] Live preview renderer (`/demo/preview`) with responsive viewport switcher (desktop/tablet/mobile)
- [x] Preview sidebar showing spec metadata, theme colors, fonts, component list, personality visualization
- [x] Preview toolbar with viewport controls and action button placeholders
- [x] Step 5 — AI-powered discovery questionnaire with loading states and fallback question bank (11 site types)
- [x] Step 6 — Animated loading screen with 5-phase progress, auto-redirect to preview on success

---

## Phase 4A: Quality & Content Accuracy Improvements ✅ COMPLETE

**Goal**: Fix content accuracy issues and improve Step 5 Discovery UX.

### Deliverables

- [x] Fix spec generator content fields to match component type interfaces exactly
- [x] Step 5 Discovery fix — fingerprint-based staleness detection (`questionsInputKey`) replaces time-based heuristic
- [x] Review mode UI — shows previous answers when returning with same inputs, "Use these" / "Update" buttons

---

## Phase 4B: Component Library Expansion + Export Pipeline ✅ COMPLETE

**Goal**: Expand from 10 to 18 components, add 4 more theme presets, build export pipeline.

### Deliverables

- [x] 8 new components (18 total):
  - `content-stats` — inline, cards, animated-counter variants
  - `content-accordion` — single-open, multi-open, bordered variants
  - `content-timeline` — vertical, alternating variants
  - `content-logos` — grid, scroll, fade variants
  - `proof-beforeafter` — slider, side-by-side variants
  - `team-grid` — cards, minimal, hover-reveal variants
  - `commerce-services` — card-grid, list, tiered variants
  - `media-gallery` — grid, masonry, lightbox variants (filter tabs, keyboard nav)
- [x] 4 new theme presets (7 total):
  - Bold Creative — magenta/cyan, Oswald/Lato, 0px radius
  - Editorial — red/white, Libre Baskerville/Nunito Sans, 0px radius
  - Tech Forward — indigo/cyan, DM Sans/JetBrains Mono
  - Organic Natural — sage/terracotta, Crimson Pro/Work Sans, soft radius
- [x] All 18 components registered in assembly engine (barrel exports, manifest-index, component-registry)
- [x] AI spec generator updated with all 18 components + selection guidelines
- [x] Deterministic fallback enhanced — adds content-stats, commerce-services, team-grid, content-logos, content-accordion conditionally by site type
- [x] Helper functions: `getStatsForSiteType`, `getServicesForSiteType`, `getTeamForSiteType`, `getTrustLogos`, `getFaqForSiteType`
- [x] Preview page updated to showcase all 18 components with Meridian Studio content
- [x] Export pipeline:
  - `generate-project.ts` — SiteIntentDocument → static HTML/CSS/README files
  - `create-zip.ts` — JSZip bundling → downloadable ZIP
  - Export button wired in PreviewToolbar (demo/preview page)

---

## Phase 4C: Brand Character System ✅ COMPLETE

**Goal**: Capture emotional identity, brand voice, archetype, and anti-references to differentiate generated sites beyond structure.

### Deliverables

- [x] Brand character types (`src/lib/types/brand-character.ts`):
  - 10 emotional goals, 3 voice tones, 6 brand archetypes, 8 anti-references
  - Display data constants with icons, descriptions, and accent colors
- [x] 3 new intake steps (Steps 5-7, expanding flow from 6 to 9 steps):
  - Step 5 — Emotional Goals: grid of 10 emotion cards, select 1-2
  - Step 6 — Voice & Narrative: 3 A/B/C comparisons for voice detection, 3 optional narrative prompts
  - Step 7 — Culture & Anti-References: 6 archetype cards, 8 anti-reference toggle chips
- [x] Zustand store updated with 5 new fields + 5 new actions, persistence
- [x] Demo page rewired for 9 steps with segmented progress bar (Setup | Character | Discovery)
- [x] AI prompts enhanced with character context (generateQuestions + generateSiteSpec)
- [x] Deterministic fallback enhanced with voice-keyed headlines, CTAs, and anti-reference checks
- [x] Emotional theme overrides (`src/lib/theme/emotional-overrides.ts`):
  - Adjusts spacing, transitions, animation, radius based on emotional goals
  - Applies anti-reference constraints (cluttered → more spacing, aggressive → slower transitions)
- [x] Preview sidebar updated with Emotional Goals, Voice & Character, and Anti-References sections
- [x] SiteIntentDocument + Convex schema extended with optional character fields (backward compatible)

---

## Phase 4D: Mobile Responsiveness ✅ COMPLETE

**Goal**: Ensure all 18 library components render correctly at mobile (375px), tablet (768px), and desktop viewports.

### Deliverables

- [x] Responsive section header spacing — `mb-8 md:mb-16` and `mb-6 md:mb-12` across 10 components
- [x] Responsive card padding — `p-5 md:p-8` across 4 components (ContentFeatures, ContentStats, ProofTestimonials, CommerceServices tiered)
- [x] Font size clamping — `clamp(var(--text-2xl), 5vw, var(--text-4xl))` for ContentStats (3 variants), CommerceServices tiered price, HeroSplit subheadline
- [x] CTA button padding reduction — `px-5 py-3 md:px-7 md:py-3.5` for HeroCentered, HeroSplit; `px-5 py-3 md:px-8 md:py-4` for CtaBanner
- [x] Gap reduction on mobile — ContentSplit, HeroSplit, TeamGrid, FooterStandard, ContentTimeline, ContentStats inline
- [x] Responsive ProofTestimonials carousel — `useState` + `resize` listener: 1 card (mobile), 2 (tablet), 3 (desktop); page resets on breakpoint change
- [x] Responsive MediaGallery masonry — `useState<number>` + `resize` listener: 1 column (<640px), min(columns, 2) (640-1023px), full columns (>=1024px)
- [x] CommerceServices tiered card overflow fix — removed `scale(1.05)` transform that caused horizontal scroll
- [x] FormContact submit button responsive padding
- [x] 16 of 18 components updated (NavSticky and ContentText already mobile-friendly)

---

## Pre-Phase 5: Architecture Optimizations ✅ COMPLETE

**Goal**: Optimize Next.js app architecture for performance, reduce client JS bundle size, and improve component maintainability.

### Deliverables

- [x] **Homepage RSC Conversion** — `src/app/page.tsx` converted from `"use client"` to Server Component
  - Created `src/components/platform/MotionFade.tsx` client component for framer-motion entrance animations
  - 5 `motion.*` elements in HeroSection replaced with `<MotionFade>` wrappers
  - AnimatedSection/StaggerContainer/StaggerItem already client components — work across RSC boundary
- [x] **Docs Page RSC Conversion** — `src/app/docs/page.tsx` converted from `"use client"` to Server Component
  - Created `src/components/platform/docs/DocsShell.tsx` client component with interactive shell logic
  - DocsShell receives pre-rendered section content as `Record<string, React.ReactNode>` props
  - ~2400 lines of static content now server-rendered, only interactive shell hydrated on client
- [x] **Component Variant Extraction** — 4 library components refactored from monolithic files to shared.tsx + variants/ pattern
  - `hero-centered`: shared.tsx + variants/with-bg-image.tsx, variants/gradient-bg.tsx
  - `commerce-services`: shared.tsx + variants/card-grid.tsx, variants/list.tsx, variants/tiered.tsx
  - `team-grid`: shared.tsx + variants/cards.tsx, variants/minimal.tsx, variants/hover-reveal.tsx
  - `media-gallery`: shared.tsx + variants/grid.tsx, variants/masonry.tsx, variants/lightbox-overlay.tsx
  - Main component files reduced to thin dispatchers (~50-70 lines each)

---

## Output Quality Overhaul (Cross-cutting) ✅ 91% COMPLETE (30/33 shipped, 3 deferred)

**Goal**: Fix content fidelity, visual character accuracy, and developer tooling across the assembly pipeline. Tracked in [EPICS_AND_STORIES.md](./EPICS_AND_STORIES.md).

### Shipped (30/33 stories — 91%)

- [x] **Tier 1: Content Fidelity** (9/9) — COMPLETE
  - AI prompt restructured to emphasize user's own words and business sub-type vocabulary
  - Business-type-aware nav labels, CTAs, discovery questions, and deterministic content (3 sub-types)
  - Narrative prompts woven into deterministic fallback
  - Content validator + auto-fix pipeline (vocab swaps, headline replacements, role corrections)
- [x] **Tier 2: Visual Character** (6/6) — COMPLETE
  - Business type + emotional goals in theme generator
  - Industry color hue shifting, dark/light mode business bias
  - Business-aware font pairing selection and variant selection
- [x] **Tier 3 partial**: Pipeline session logging, quick satisfaction rating (feedback banner)
- [x] **Tier 4: Intake Upgrades** (1/1 active) — COMPLETE (3 deferred)
  - A/B theme variant toggle in preview
- [x] **Tier 5: Anti-References** (2/2) — COMPLETE
  - Anti-reference redesign: 10 genuine aesthetic trade-offs (replaced generic negatives)
  - Business-specific anti-refs: 10 industry maps (restaurant, spa, photography, ecommerce, etc.) with targeted theme overrides
- [x] **Tier 6: Dev Tooling** (7/7) — COMPLETE
  - Dev panel with populated Intake, Prompt/AI Response, Validation, and Theme tabs
  - Named test cases: save intake snapshots from Dev Panel, re-run spec generation, view results
  - Side-by-side comparison: theme diff, content diff, component stack diff between sessions
- [x] **Tier 3 complete**: Screenshot capture (html2canvas + Playwright), Claude Vision 5-dimension evaluation, VLM feedback → theme adjustments pipeline (45 new tests)
- [x] **Testing**: 331 tests across 20 test files (validate-spec, emotional-overrides, fix-spec, theme-variants, feedback-banner, industry-anti-refs, dev-test-cases + 13 existing suites)

### Remaining (3 deferred)

- [ ] _Deferred_: Mood board curation (T4-E1-S1/S2), Visual reference URL input (T4-E2-S1)

### VLM Design Feedback Loop ✅ COMPLETE (T3-E1)

The design feedback loop closes the generate → evaluate → adjust → re-render cycle:

- **Screenshot capture** — html2canvas (client, quick) + Playwright (server, high-quality)
- **Claude Vision evaluation** — 5 dimensions scored 1-10 (content relevance, visual character, color appropriateness, typography fit, overall cohesion)
- **Adjustment mapping** — `mapAdjustmentsToTokenOverrides()` validates VLM suggestions against ThemeTokens keys, filters invalid entries, returns `Partial<ThemeTokens>`
- **Instant re-render** — Overrides merged onto active theme via `useMemo`, no spec regeneration needed
- **On-demand only** — Triggered via DevPanel VLM tab, ~$0.03/evaluation
- **Persisted** — Results stored in Convex `vlmEvaluations` table by session

---

## Phase 5A: CSS Visual Foundation ✅ COMPLETE

**Goal**: Make every generated site look intentionally designed with CSS-only visuals — patterns, dividers, decorative elements, and scroll effects — eliminating broken/empty images.

### Deliverables

- [x] **New `src/lib/visuals/` directory** with 9 modules for CSS-driven visual design
- [x] **14 CSS patterns** (pinstripe, herringbone, waves, dots, grid, zigzag, seigaiha, topography, etc.) mapped to 25+ business sub-types via `industry-patterns.ts`
- [x] **4 section divider components** (wave, angle, curve, zigzag) as SVG, absolutely positioned at section edges
- [x] **5 decorative accent elements** (blob, dot-grid, geometric-frame, diamond, circle)
- [x] **ImagePlaceholder component** with 3 variants (gradient, pattern, shimmer) — no more broken/empty images
- [x] **Visual vocabulary system** — each business type gets a coherent visual language (divider style, accent shape, image overlay, parallax, scroll reveal intensity) with archetype and personality overrides
- [x] **`hero-split` and `content-split` images made optional** — CSS gradient fallback renders when no image provided
- [x] **Section component extended** with `dividerTop`, `dividerBottom`, `pattern`, `patternSize`, `patternPosition`, `patternOpacity` props
- [x] **`VisualConfig` type** added to `ComponentPlacement` — patterns and dividers flow through the spec
- [x] **AssemblyRenderer** resolves `visualConfig` into Section props (pattern CSS, dividers) using theme colors
- [x] **Parallax hook** (`useParallax`) using `useSyncExternalStore` + framer-motion `useScroll` — respects `prefers-reduced-motion`, disables on mobile
- [x] **Deterministic fallback updated** — removed hardcoded Unsplash URL, added visual config per component, added `content-split` sections, skips `media-gallery`/`proof-beforeafter` (require real images)
- [x] **AI prompt updated** — images optional, `visualConfig` field documented, image-heavy components excluded until stock photos available

---

## Recent UI Enhancements (Feb 2026)

Polishing improvements shipped alongside Phase 5A:

- [x] **Iframe-based viewport switcher** — Preview renders in isolated iframe at `/demo/preview/render`, parent-iframe communication via `ewb:` prefixed PostMessage protocol (set-theme, set-page, request-screenshot), true responsive preview without page reload
- [x] **Animated wireframe assembly loading** — Step 9 loading screen shows animated wireframe blocks assembling into place sequentially (replaces cycling progress bar)
- [x] **Mobile UX overhaul** — Bottom sheet modals for sidebar (max 65vh), scroll position reset on tab change, tab-based mobile interface, `useIsMobile()` hook with debounced detection (`src/lib/hooks/use-is-mobile.ts`)

---

## Phase 5B: Stock Photo Integration ✅ COMPLETE

**Goal**: Layer real images on top of the CSS visual foundation.

### Deliverables

- [x] **Stock photo API integration** — Multi-provider search (Unsplash/Pexels/Pixabay), context-aware keyword builder, 24hr image caching, color-filtered search, automatic enrichment of hero-split/hero-centered/content-split/team-grid/media-gallery

---

## Component Wave 1 ✅ COMPLETE

**Goal**: Expand component library and add CSS effects system.

### Deliverables

- [x] 6 new components (24 total): PricingTable, ContentSteps, ContentComparison, HeroVideo, BlogPreview, ContentMap
- [x] CSS effects system — 8 effects, 14 patterns, 4 dividers per section

---

## Phase 6A: Free Customization MVP ✅ COMPLETE

> Decision source: `business/boardroom/sessions/2026-02-12-customization-system.md` (BD-001-01)

**Goal**: Transform read-only preview into interactive customization experience.

### Deliverables

- [x] Customization sidebar (replaces PreviewSidebar) with 5 controls
- [x] Theme preset switcher — 7 presets, single-click apply
- [x] Primary color picker — hex input + visual picker, chroma-js auto-palette derivation
- [x] Font pairing selector — 5 free / 9 locked with lock icons + upgrade nudge
- [x] H1/H2 headline editor — live preview via `ewb:update-content` PostMessage
- [x] Reset to AI Original — clears all customizations
- [x] `useCustomizationStore` — Zustand with localStorage persistence
- [x] `deriveThemeFromPrimaryColor()` — full palette from single hex
- [x] `font-pairings.ts` — extracted from generate-theme.ts with FREE_FONT_IDS
- [x] 4-layer theme priority: base variant → preset → VLM → color/font overrides

---

# CURRENT PRIORITIES — Revenue Foundation

> **Strategy shift**: Boardroom Sessions 002-003 (Feb 2026) replaced the old sequential Phase 6-9 plan with a parallel-track approach focused on reaching first revenue as fast as possible. "Revenue is the only validation that matters" (P1).
>
> Decision sources:
>
> - `business/boardroom/sessions/2026-02-14-rd-training-and-pricing.md` (BD-003-01 through BD-003-04)
> - `business/boardroom/sessions/2026-02-15-product-simplification.md` (BD-004-01 through BD-004-03)
> - `docs-specific-feature-plans/PRICING_MONETIZATION_STRATEGY.md`
>
> **Our ONE core action**: "Describe your business → see your website." (BD-004-01, unanimous)

---

## Track 1: Express Path — "60-Second Website" (Weeks 1-2)

> BD-004-01 | Priority: P1 (highest) | Removes #1 conversion barrier

**Goal**: Reduce time-to-preview from 4-5 minutes to under 90 seconds. Match Wix ADI speed.

**Why**: Codebase complexity audit found 82-122+ user decisions, 4-5 min median time. Competitors do 60-90 seconds. The 9-step intake IS our moat, but nobody experiences the moat because they drop off before the preview.

### Deliverables

- [ ] **2-step express intake flow** (default experience):
  - Step 1: Site type selection (existing Step 1)
  - Step 2: Business name + description (existing Step 3, combined into one screen)
  - Generate immediately using deterministic path ($0 cost, 2-5 seconds)
- [ ] **Mode toggle**: "Quick Build (60s)" vs "Deep Brand Capture (3 min)" at start of intake
- [ ] **Shortened loading screen** for deterministic generation (2-5 seconds vs 10-20)
- [ ] **Express-mode store support** in `useIntakeStore` — skip Steps 4-8

**Quality gate**: Delight Champion veto if R&D benchmark (BD-003-02) scores fast-path output <6/10 average.

**Files**: `src/app/demo/page.tsx`, `src/lib/stores/intake-store.ts`, `convex/ai/generateSiteSpec.ts`

---

## Track 2: Immersive Preview Reveal (Weeks 2-3)

> BD-004-02 | Priority: P2

**Goal**: Make the first preview experience emotionally impactful, not overwhelming.

**Why**: Preview page currently shows 39+ controls on desktop. The "wow" moment is buried under toolbar buttons and sidebar metadata. Robinhood principle: show the portfolio value in big numbers first, order book later.

### Deliverables

- [ ] **Full-screen immersive preview** on load — sidebar hidden, toolbar minimal
- [ ] **3-5 second celebration moment** — subtle animation + "Your website is ready" overlay before controls appear
- [ ] **Sidebar slides in** after celebration with "Customize" label
- [ ] **Progressive disclosure** — dev panel hidden by default (Ctrl+Shift+D only), A/B toggle moved to sidebar
- [ ] **Mobile**: same pattern — full-screen → bottom sheet CTA after delay

**Files**: `src/app/demo/preview/page.tsx`, `src/components/platform/preview/PreviewToolbar.tsx`, `src/components/platform/preview/CustomizationSidebar.tsx`

---

## Track 3: Monetization Infrastructure (Weeks 1-3)

> BD-003-01 | Priority: P1 | Revenue foundation

**Goal**: Let people pay us. Ship the simplest possible billing.

**Tier structure** (boardroom consensus):

| Tier          | Price        | Core Value                                                                                                    |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| **Free Demo** | $0           | Full intake → generate → preview → customize. Export with "Built with EWB" badge                              |
| **Starter**   | $12/mo       | Live site (Vercel hosting), clean export (no badge), working contact form, 1 AI Chat message                  |
| **Pro**       | $29/mo       | All 14 fonts, full color control, CSS effects, unlimited AI Chat, booking/payment integrations, custom domain |
| **Own It**    | $99 one-time | Full project export, zero lock-in, deployment guide                                                           |

### Deliverables

- [ ] **Stripe Checkout** — one product ($12/mo Starter), webhook listener
- [ ] **Clerk Auth** — minimal email login (no social yet), gate at "Go Live" and "$99 Export"
- [ ] **"Make It Yours" modal** — three-option conversion UI: "Go Live" ($12/mo), "Download" ($99), "Free Preview" (with badge)
- [ ] **Vercel deployment pipeline** — deploy from export pipeline, user gets live URL
- [ ] **Subscription status hook** — `useSubscription()` checks active subscription via Clerk metadata

**Files**: `src/app/api/stripe/webhook/route.ts`, `src/app/layout.tsx` (ClerkProvider), `src/components/platform/preview/MakeItYoursModal.tsx`, `src/app/api/deploy/route.ts`

**Feature plan**: `docs-specific-feature-plans/PRICING_MONETIZATION_STRATEGY.md`

---

## Track 4: Distribution Foundation (Weeks 3-5)

> BD-003-03 | Priority: P3 (parallel with monetization)

**Goal**: Get users to the product and give them reasons to share.

### Deliverables

- [ ] **Fix homepage** — replace fabricated testimonials with real generated examples; correct stats to "24 Components | 7 Presets | 13 Site Types"; single primary CTA
- [ ] **Email capture during loading screen** — AFTER wireframe animation (~7.5s), BEFORE final polish; "Where should we send your editable link?"; skip option
- [ ] **Shareable preview links** (Phase 6B foundation already committed):
  - [x] Convex `sharedPreviews` table + mutations
  - [x] OG image generation API route (`/api/og`)
  - [x] Share page route (`/s/[shareId]`)
  - [x] "Built with EWB" footer badge component
  - [ ] Share button in PreviewToolbar with copy-to-clipboard
  - [ ] Twitter/LinkedIn share templates
- [ ] **PostHog analytics events** — full funnel tracking throughout

---

## Track 5: R&D Quality Benchmark (Weeks 2-4)

> BD-003-02 | Priority: P2 | Quality validation

**Goal**: Quantify output quality. Know if we're good enough to charge money.

### Deliverables

- [ ] **20 reference websites** curated (2 per top 10 business types) with metadata
- [ ] **Benchmark runner** — load reference, run pipeline with synthetic intake, screenshot output (Playwright)
- [ ] **Claude Vision scoring** — 6 dimensions (visual quality, color, typography, layout, content, emotional resonance)
- [ ] **Dev benchmark page** (`/dev/benchmark`) — scores, trends, competitive comparison
- [ ] **Wix ADI comparison** — same 5 sites on both platforms, scored identically
- [ ] **Fast-path quality validation** — score express path output (BD-004-01 quality gate)

**Feature plan**: `docs-specific-feature-plans/DESIGN_QUALITY_RD_BENCHMARK.md`

---

## Post-Revenue: Premium Features (Weeks 5-8)

> These ship AFTER monetization infrastructure is operational.

### Post-Generation Brand Discovery (BD-004-03, Weeks 5-7)

**Goal**: Move character capture from pre-generation intake to post-generation customization sidebar.

- [ ] **"Discover Your Brand" sidebar section** — emotional goals, voice detection, archetype picker
- [ ] **Progressive personalization** — each selection triggers PostMessage theme/content update to iframe
  - Emotional goals → color palette shift (visible immediately)
  - Voice selection → headline/CTA rewrite (visible immediately)
  - Archetype → layout/component adjustments (visible with transition)
- [ ] **Credit system** — AI-powered refinement uses 1 credit (free users get 1, Pro unlimited)

**Files**: New `BrandDiscovery.tsx`, modified `preview/page.tsx`, `render/page.tsx`, `generateSiteSpec.ts`

### AI Design Chat (BD-003-04, Weeks 6-8)

**Goal**: Conversational AI refinement as the Pro-tier killer feature.

- [ ] **Chat UI** — sidebar panel or bottom sheet
- [ ] **Claude integration** — patch types: `adjust_theme`, `rewrite_copy`, `add_component`, `remove_component`
- [ ] **Usage tracking** — 1 free message / unlimited Pro
- [ ] **PostHog events** — `chat_started`, `chat_message`, `chat_upgrade_prompted`

### $99 Enhanced Export (Weeks 6-7)

- [ ] **Stripe one-time payment** — $99 product, separate webhook
- [ ] **Enhanced export** — improved HTML/CSS output, all dependencies, deployment guide
- [ ] **Post-payment download flow** — confirmation page with ZIP download

---

## Future: Product Enrichment (Months 3-6)

> Lower priority. Interleave as capacity allows after revenue is flowing.

### Phase 5C-D: Advanced Visuals

- [ ] **AI image generation** (5C) — Gemini via Convex, priority queue, reactive loading
- [ ] **Advanced scroll effects** (5D) — CSS scroll-timeline, depth scrolling, scale transforms

### Multi-Page & Export Upgrade

- [ ] **Multi-page generation** — AI spec already outputs `pages[]`; generate `/about`, `/services`, `/contact` with shared nav/footer
- [ ] **Next.js project export** — proper App Router project replacing static HTML/CSS
- [ ] **WCAG contrast enforcement** — `chroma.contrast()` validation at theme generation layer

### User Image Upload

- [ ] Upload own images during or after generation; store in Convex File Storage; replace stock images

### Working Contact Forms

- [ ] Formspree integration for Starter tier; configurable endpoint for exported sites

---

## Future: Platform Maturity (Months 6-12)

### Accounts & Project Management

- [ ] Project dashboard — save projects, return later, manage multiple sites
- [ ] Custom domain configuration for deployed sites (Pro tier)

### Integrations (P6: Integration Over Invention)

> We build beautiful, branded INTERFACES. Third-party services handle FUNCTIONALITY.

- [ ] **Booking** — Calendly/Acuity embed styled to match site theme (Pro tier)
- [ ] **Commerce** — Stripe Payment Links for simple purchases (Pro tier)
- [ ] **Newsletter** — Mailchimp/ConvertKit integration component
- [ ] **Blog/CMS** — Convex-backed simple CMS (future tier)

### Advanced Customization

- [ ] Component variant switching per section
- [ ] Personality sliders (regenerate theme on change)
- [ ] Section reorder (arrow buttons, drag-drop deferred)
- [ ] Component add/remove from modal picker
- [ ] CSS effect selector per section
- [ ] Pattern/divider customizer per section

---

## Future: Scale & Maturation (Year 2+)

- [ ] Visual editor — click-to-edit text, drag-to-reorder sections
- [ ] Change history / undo
- [ ] Role-based access (owner, editor, viewer)
- [ ] Knowledge base & learning — semantic embeddings, proven recipe promotion
- [ ] White-label / agency mode
- [ ] Template marketplace

---

## Out of Scope (Permanently)

These are better served by dedicated platforms. See [STRATEGIC_ROADMAP.md](./STRATEGIC_ROADMAP.md) § "The E-Commerce Question" for detailed reasoning.

- Full e-commerce platforms (Shopify's territory)
- Custom web applications (dev agency work)
- User authentication systems (Auth0/Clerk as integration, not custom-built)
- Database-heavy applications (custom development)
- Custom marketplaces
