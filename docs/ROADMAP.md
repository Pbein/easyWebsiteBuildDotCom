# Development Roadmap

## Phase 1: Platform Website & Foundation (Current)
**Goal**: Build easywebsitebuild.com with 3 core pages, establish project structure.

### Deliverables
- [ ] Next.js project with App Router, TypeScript, Tailwind CSS
- [ ] Convex backend setup with initial schema
- [ ] Homepage — product landing page with compelling design
- [ ] Demo page — working intake flow (Steps 1-4 minimum)
- [ ] Docs page — full project documentation in a navigable format
- [ ] Platform layout (nav, footer, shared components)
- [ ] Responsive design across all pages
- [ ] Basic Convex schema for intake data storage

### Design Direction
The platform itself should be premium and distinctive — it's selling a website builder, so it needs to look better than most websites. Think Vercel/Linear/Stripe level of craft.

---

## Phase 2: Core Component Library (MVP)
**Goal**: Build 10 essential components with 2-3 variants each, plus the theming token system.

### Deliverables
- [ ] Theme token system (CSS Custom Properties + Tailwind integration)
- [ ] Theme generation from personality vector
- [ ] 3 theme presets (Luxury, Modern Clean, Warm Professional)
- [ ] 10 core components:
  1. `nav-sticky` (transparent, solid)
  2. `hero-centered` (with-bg-image, gradient-bg)
  3. `hero-split` (image-right, image-left)
  4. `content-features` (icon-cards)
  5. `content-split` (alternating)
  6. `content-text` (centered)
  7. `cta-banner` (full-width, contained)
  8. `form-contact` (simple)
  9. `proof-testimonials` (carousel)
  10. `footer-standard` (multi-column)
- [ ] Component manifest system (JSON descriptors)
- [ ] Section wrapper with spacing/background control

---

## Phase 3: Intent Capture System
**Goal**: Complete the intake flow with AI integration.

### Deliverables
- [ ] Full 6-step intake flow UI
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
- [ ] Theme resolver (personality vector → token set)
- [ ] Component selection and variant matching
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
- [ ] 5+ additional theme presets

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
