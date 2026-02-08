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

## Phase 3: Intent Capture System (Next)

**Goal**: Complete the intake flow with AI integration.

### Deliverables

- [ ] Full 6-step intake flow UI (expand current 4-step demo)
- [ ] Brand personality visual comparison system
- [ ] Claude API integration for deep discovery questions
- [ ] Claude API integration for spec generation
- [ ] Site Intent Document generation from intake data
- [ ] Convex storage for intake responses
- [ ] Intent path storage (knowledge base foundation)

---

## Phase 4: Assembly Engine & Preview

**Goal**: Turn Site Intent Documents into live website previews.

### Deliverables

- [ ] Assembly engine that reads a spec and composes components
- [ ] Theme resolver (personality vector → token set) — foundation already built
- [ ] Component selection and variant matching using manifest personalityFit ranges
- [ ] Live preview renderer
- [ ] Preview approval/change request flow
- [ ] AI copy generation for placeholder content
- [ ] Preview sharing (shareable link for client review)

---

## Phase 5: Expand Component Library

**Goal**: Full component coverage for all 13 site types.

### Deliverables

- [ ] `hero-parallax` (all variants including subject mask)
- [ ] `hero-video` (autoplay, play-button)
- [ ] `nav-centered` (with-topbar, minimal)
- [ ] `nav-hamburger` (fullscreen, slide)
- [ ] `media-gallery` (grid, masonry, lightbox)
- [ ] `team-grid` (cards, hover-reveal)
- [ ] `commerce-services` (card-grid, list, tiered)
- [ ] `commerce-pricing` (columns, toggle)
- [ ] `content-stats` (animated-counter, cards)
- [ ] `proof-beforeafter` (slider, side-by-side)
- [ ] `content-accordion` (FAQ)
- [ ] `content-timeline` (vertical)
- [ ] All remaining component categories
- [ ] 5+ additional theme presets (Bold Creative, Editorial, Tech Forward, etc.)

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

## Phase 7: Build & Deploy Pipeline

**Goal**: Generate deployable websites from approved specs.

### Deliverables

- [ ] Next.js project generator
- [ ] Component bundling for generated sites
- [ ] Theme token file generation
- [ ] Vercel deployment via API (hosted sites)
- [ ] ZIP export with documentation (one-time purchase)
- [ ] Custom domain configuration
- [ ] Convex setup for dynamic features (forms, booking)

---

## Phase 8: Visual Editor & Subscription Features

**Goal**: Enable ongoing content management for subscription clients.

### Deliverables

- [ ] Inline text editing
- [ ] Image replacement interface
- [ ] Component reordering (drag and drop)
- [ ] Component visibility toggle
- [ ] Theme adjustment panel (colors, fonts)
- [ ] Change history / undo
- [ ] User authentication and project dashboard
- [ ] Subscription/payment integration (Stripe)
- [ ] Role-based access (owner, editor, viewer)

---

## Phase 9: Commerce & Advanced Features

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

## Phase 10: Scale & Optimize

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
