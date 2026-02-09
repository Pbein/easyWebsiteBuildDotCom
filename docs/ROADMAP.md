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

## Phase 5: Multi-Page Generation & Core Quality (Next — Weeks 1-4)

**Goal**: Transform single-page output into multi-page websites with real images and polished export.

> See [STRATEGIC_ROADMAP.md](./STRATEGIC_ROADMAP.md) for full prioritization rationale, competitive analysis, and the website-to-web-application spectrum strategy.

### Deliverables

- [ ] **Multi-page generation & routing** — AI spec already outputs `pages[]` array; generate separate page routes (`/about`, `/services`, `/contact`), shared nav/footer, per-page component composition
- [ ] **Descriptive image placeholders** — Replace gray placeholder divs with styled cards describing what image should go there (e.g., "Upload: A warm photo of your barbershop interior")
- [ ] **Stock photo API integration** — Unsplash/Pexels free API; AI includes image search keywords per component; fetch and display real stock photos
- [ ] **Next.js project export upgrade** — Proper App Router project with component files, routing, and `npm run dev` support (replacing static HTML/CSS export)

---

## Phase 6: Refinement Chat & Deployment (Weeks 5-8)

**Goal**: Enable post-generation editing through conversational refinement and one-click deployment.

### Deliverables

- [ ] **Refinement chat (MVP)** — Conversational interface for post-generation changes:
  - `adjust_theme` — change colors, spacing, fonts
  - `rewrite_copy` — regenerate text for a specific component
  - `add_component` — insert a new section
  - `remove_component` — delete a section
- [ ] **User image upload** — Upload own images during or after generation; store in Convex File Storage; replace stock images
- [ ] **Working contact forms** — Convex mutation stores submissions + email notification via Resend (hosted); configurable endpoint for exported sites (Formspree/Netlify Forms)
- [ ] **Vercel deployment via API** — Deploy directly from preview; user gets a live URL instantly

---

## Phase 7: User Accounts & Platform Features (Weeks 9-16)

**Goal**: Add user accounts, project management, and preview sharing to make this a real product.

### Deliverables

- [ ] User authentication (Clerk or Convex auth)
- [ ] Project dashboard — save projects, return later, manage multiple sites
- [ ] Preview sharing — shareable links for client review
- [ ] Custom domain configuration for deployed sites
- [ ] Preview approval/change request flow

---

## Phase 8: Dynamic Sites & Integrations (Months 4-8)

**Goal**: Move from static marketing sites to dynamic sites with real functionality via third-party integrations.

> Strategy: We build beautiful, branded INTERFACES. Third-party services handle FUNCTIONALITY. See [STRATEGIC_ROADMAP.md](./STRATEGIC_ROADMAP.md) § "The Integration Strategy" for rationale.

### Deliverables

- [ ] **Blog/CMS** — Convex-backed simple CMS: markdown editor, themed blog pages, title + body + date + optional cover image
- [ ] **Booking integration** — Calendly/Acuity embed styled to match site theme (`booking-embed` component with themed iframe wrapper)
- [ ] **Newsletter signup** — Mailchimp/ConvertKit integration component
- [ ] **Commerce lite** — Snipcart or Shopify Buy Button integration for product sales (our themed product cards + their checkout/payment backend)
- [ ] **Stripe Payment Links** — "Buy Now" buttons link to Stripe checkout for simple service/product purchases
- [ ] **Analytics embed** — Plausible or PostHog integration component

---

## Phase 9: Visual Editor & Subscription Model (Months 8+)

**Goal**: Enable ongoing content management for subscription clients and build long-term revenue.

### Deliverables

- [ ] Visual editor — click-to-edit text, drag-to-reorder sections, theme adjustment panel
- [ ] Change history / undo
- [ ] Subscription/payment integration (Stripe billing)
- [ ] Role-based access (owner, editor, viewer)
- [ ] Knowledge base & learning — semantic embeddings, proven recipe promotion, content pattern extraction
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
