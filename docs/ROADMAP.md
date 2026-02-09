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

## Phase 5: Visual Editor, Multi-Page Support & Deployment Pipeline (Next)

**Goal**: Enable visual editing, multi-page site generation, and deployment options.

### Deliverables

- [ ] Visual editor — inline text editing, image replacement, component reordering
- [ ] Multi-page site support — multiple pages per spec, page navigation
- [ ] Full Next.js project generation (beyond static HTML export)
- [ ] Vercel deployment via API (hosted sites)
- [ ] Custom domain configuration
- [ ] Preview approval/change request flow
- [ ] Preview sharing (shareable link for client review)
- [ ] AI copy generation for refining placeholder content

---

## Phase 6: Knowledge Base & Learning

**Goal**: Implement the evolving decision tree and recipe system.

### Deliverables

- [ ] Semantic embedding generation for intent paths
- [ ] Convex vector search for similarity matching
- [ ] Path lifecycle management (candidate → proven → deprecated)
- [ ] Proven recipe storage and retrieval
- [ ] Theme library with search/browse
- [ ] Content pattern extraction and storage
- [ ] Page composition template storage
- [ ] Analytics dashboard (deterministic hit rate, approval rates)

---

## Phase 7: Visual Editor & Subscription Features

**Goal**: Enable ongoing content management for subscription clients.

### Deliverables

- [ ] Advanced visual editor (drag-and-drop, component insertion)
- [ ] Theme adjustment panel (color picker, font selector)
- [ ] Change history / undo
- [ ] User authentication and project dashboard
- [ ] Subscription/payment integration (Stripe)
- [ ] Role-based access (owner, editor, viewer)

---

## Phase 8: Commerce & Advanced Features

**Goal**: Support e-commerce, booking, and membership sites.

### Deliverables

- [ ] E-commerce components (product grid, cart, checkout)
- [ ] Payment integration (Stripe)
- [ ] Booking/calendar components
- [ ] Membership/gating components
- [ ] Blog/CMS components
- [ ] SEO optimization tools
- [ ] Analytics integration
- [ ] Form submission handling and notifications

---

## Phase 9: Scale & Optimize

**Goal**: Prepare for public launch and growth.

### Deliverables

- [ ] Performance optimization (Core Web Vitals targets)
- [ ] Load testing and scaling
- [ ] API rate limiting and caching
- [ ] Multi-tenant architecture refinement
- [ ] Marketing site expansion
- [ ] Onboarding flow optimization
- [ ] Support documentation
- [ ] Public launch at easywebsitebuild.com
