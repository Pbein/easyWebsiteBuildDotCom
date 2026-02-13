# Strategic Assessment & High-Value Development Roadmap

> **Purpose:** Honest evaluation of where EasyWebsiteBuild is today, what the highest-value next moves are, and how to think about the website vs web-application spectrum.
>
> **Date:** February 2026

---

## Current State: Honest Assessment

### What We Can Deliver Today

A single-page, themed, responsive marketing website with AI-generated industry-specific content, exported as HTML/CSS/README ZIP.

### Limitation Inventory

| #   | Limitation                                                                                                                                                                                               | Impact                                                                                                                | Difficulty to Fix                   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 1   | **Single-page only** — nav links exist but all point to `#sections` on the same page                                                                                                                     | High — clients expect About, Services, Contact pages at minimum                                                       | Medium                              |
| 2   | **~~No real images~~** — ⚠️ PARTIALLY RESOLVED: CSS visual foundation (Phase 5A) provides gradient placeholders, patterns, and dividers. Stock photo integration (Phase 5B) still needed for real images | Medium — sites look intentionally designed but still lack real photography                                            | Medium (API integration)            |
| 3   | **~~No post-generation editing~~** — ⚠️ BEING ADDRESSED: Customization System (Boardroom BD-001, 4 phases). Phase 1 ships free-tier sidebar customization (presets, color, fonts, headline editing)      | High — clients always want changes                                                                                    | Medium (phased approach)            |
| 4   | ~~**Character capture not built**~~ ✅ **RESOLVED in Phase 4C** — emotional goals, voice, archetype, anti-references captured                                                                            | ~~High~~                                                                                                              | ~~Medium~~                          |
| 5   | **Export is basic HTML/CSS** — not a real Next.js project, no routing                                                                                                                                    | Medium — works for simple sites, limiting for anything more                                                           | Medium                              |
| 6   | **Forms don't submit** — contact form shows success animation but sends nothing                                                                                                                          | Medium — common expectation                                                                                           | Low                                 |
| 7   | **No booking functionality** — booking sites have no actual booking flow                                                                                                                                 | High for booking-type clients                                                                                         | Medium-High                         |
| 8   | **No e-commerce** — no cart, no checkout, no product management                                                                                                                                          | High for e-commerce clients                                                                                           | High (but solvable via integration) |
| 9   | **No CMS/blog** — content sites have no way to add posts                                                                                                                                                 | Medium — common expectation                                                                                           | Medium                              |
| 10  | **No third-party integrations** — Stripe, Calendly, Mailchimp, analytics = zero                                                                                                                          | Medium-High                                                                                                           | Varies per integration              |
| 11  | **No deployment** — users get a ZIP, must self-host                                                                                                                                                      | Medium — friction for non-technical users                                                                             | Medium (Vercel API)                 |
| 12  | **No user accounts** — can't save projects, return later, manage multiple sites                                                                                                                          | Medium — essential for a real product                                                                                 | Medium                              |
| 13  | **Component variety still limited** — 18 components covers basics but not all site types                                                                                                                 | Medium — diminishing returns per component                                                                            | Low per component                   |
| 14  | **No mobile app preview** — viewport toggle simulates but isn't a real device test                                                                                                                       | Low — nice to have                                                                                                    | Low                                 |
| 15  | **No WCAG contrast enforcement** — Theme generation can produce inaccessible color combinations (yellow CTA + white text)                                                                                | Medium — accessibility & readability                                                                                  | Low (chroma.contrast() check)       |
| 16  | **No design evaluation feedback** — No automated way to assess if generated site matches intent                                                                                                          | ~~Medium~~ ✅ **RESOLVED** — VLM Design Feedback Loop (T3-E1) evaluates screenshots against intent with Claude Vision | ~~High~~                            |

### What Competitors Do

For context on where the market is:

| Feature       | Squarespace        | Wix         | Framer        | Our Advantage                                |
| ------------- | ------------------ | ----------- | ------------- | -------------------------------------------- |
| Templates     | 100+ hand-designed | 800+        | 100+          | AI-generated from scratch — infinite variety |
| AI generation | Basic (text only)  | ADI (basic) | AI page gen   | Deep brand understanding, not just layout    |
| Customization | Drag-drop editor   | Drag-drop   | Visual editor | Conversational refinement (planned)          |
| E-commerce    | Built-in           | Built-in    | Limited       | Integration-based (planned)                  |
| Hosting       | Included           | Included    | Included      | Self-host or Vercel (planned)                |
| Pricing       | $16-65/mo          | $17-159/mo  | $5-30/mo      | One-time purchase + optional subscription    |

**Our unique angle:** Nobody else does deep brand personality capture + AI-driven assembly from components. The competitors give you templates and let you customize. We understand your brand and build from scratch. That's genuinely different — but only if the output quality is high enough to justify it.

---

## The Website ↔ Web Application Spectrum

This is the critical strategic question. Here's how to think about it:

```
STATIC                                                          DYNAMIC
MARKETING SITE          INTERACTIVE SITE         WEB APPLICATION
    │                        │                         │
    ├── Brochure             ├── Blog/CMS              ├── E-commerce
    ├── Portfolio            ├── Contact forms          ├── Booking system
    ├── Landing page         ├── Newsletter signup      ├── Membership/auth
    ├── Restaurant           ├── Reviews/testimonials   ├── User dashboards
    ├── Event page           ├── Image galleries        ├── Payment processing
    │                        ├── Search/filter          ├── Inventory management
    │                        │                          ├── Order management
    │                        │                          │
    ▼                        ▼                          ▼
  100% OUR CODE          OUR CODE + SIMPLE           OUR CODE + INTEGRATIONS
                          BACKEND (Convex)            (Stripe, Calendly, etc.)
```

### The Integration Strategy (This Is Key)

We do NOT build e-commerce, booking, payments, or CMS from scratch. We build beautiful, branded INTERFACES that connect to established services.

**Why this is the right approach:**

1. Stripe has spent billions making payments work. We can't compete with that.
2. Calendly has solved scheduling for millions. Rebuilding it is waste.
3. Our value is DESIGN + BRAND + ASSEMBLY. Theirs is FUNCTIONALITY + RELIABILITY.
4. Integration means our sites get better as the services improve, without us doing work.
5. Clients trust Stripe/Calendly/Mailchimp because they already use them.

**What we actually build:**

- The VISUAL components (booking UI, product cards, checkout form)
- The INTEGRATION layer (embed codes, API connections, webhook handlers)
- The CONFIGURATION (which Stripe products, which Calendly calendar, which Mailchimp list)
- The THEMING (the integration looks like it belongs on the site, not like a widget dropped in)

### Tier Strategy

**Tier 1: Static Sites (NOW — perfecting this)**

- ✅ CSS visual foundation (patterns, dividers, decorative elements, parallax) — Phase 5A COMPLETE
- ✅ Character capture for brand-specific output — Phase 4C COMPLETE
- Multi-page marketing sites with proper routing
- Real image handling (stock API → AI generation → user upload)
- Refinement chat for post-generation editing
- Next.js project export

**Tier 2: Dynamic Sites (NEXT — 3-6 months)**

- Working contact form submission (Convex backend)
- Blog/CMS (Convex-based simple content management)
- Newsletter signup (Mailchimp/ConvertKit integration)
- Basic analytics (Plausible or PostHog embed)
- Social media embeds (Instagram feed, X feed)

**Tier 3: Service Sites (LATER — 6-12 months)**

- Booking integration (Calendly embed or Acuity API)
- Stripe payment links for simple purchases
- Testimonial/review collection (native or third-party)
- Appointment reminders (email/SMS via Resend/Twilio)

**Tier 4: Commerce Lite (FUTURE — 12+ months)**

- Snipcart or Shopify Buy Button for product sales
- Product catalog display (our components, their backend)
- Cart + checkout (Snipcart handles this)
- Order notifications (webhook → email)
- NOT building: inventory management, shipping logistics, customer accounts, returns

**Out of Scope (Forever):**

- Full e-commerce platforms (that's Shopify)
- Custom web applications (that's a dev agency)
- User authentication systems (that's Auth0/Clerk)
- Database-heavy applications (that's custom development)

### VLM Design Feedback Loop ✅ IMPLEMENTED

The VLM (Vision Language Model) Design Feedback Loop is operational and closes the generate → evaluate → adjust cycle:

**Current State (On-Demand, Per-Session):**

- Screenshot via html2canvas → Claude Vision evaluates 5 dimensions (1-10 each)
- `mapAdjustmentsToTokenOverrides()` → `Partial<ThemeTokens>` merged onto active theme
- Instant re-render without spec regeneration, ~$0.03/evaluation
- Results persisted in Convex `vlmEvaluations` table

**Evolution Roadmap:**

| Phase                 | Capability                                                                                                                                                       | Status             |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 1. Manual Per-Session | Screenshot → Evaluate → Apply adjustments (DevPanel)                                                                                                             | ✅ Done            |
| 2. Pattern Mining     | Aggregate VLM scores across sessions → identify systematic weaknesses (e.g., "restaurants always score low on color") → feed back into theme generation defaults | Planned (Phase 5+) |
| 3. Auto-Evaluation    | Auto-capture screenshot after generation → auto-evaluate → auto-fix if score < threshold → present improved version to user                                      | Planned (Phase 6)  |
| 4. Predictive Quality | Use accumulated evaluation data to pre-adjust theme generation parameters before rendering — skip the evaluate step entirely for high-confidence patterns        | Future             |

**Key Insight:** The VLM feedback loop becomes exponentially more valuable as it accumulates data. Each evaluation teaches the system what "good" looks like for a specific business type + personality + character combination.

---

## High-Value Development Priority (Ranked by Impact × Feasibility)

### 🔴 CRITICAL — Do These First (Current → Next 2 Months)

#### 0. Post-Generation Customization System ← NEW (Boardroom BD-001)

**Impact: 10/10 | Effort: Medium (phased)**

> Decision source: `business/boardroom/sessions/2026-02-12-customization-system.md`
> Decisions: BD-001-01 through BD-001-05

The #1 competitive gap. Every competitor offers post-generation customization; we have zero. This is the conversion mechanism that turns free demo users into paying customers.

**Phase 1 — Free Customization MVP (Weeks 1-3):**

- Customization sidebar panel (right side, collapsible)
- 7 theme preset switcher (expand existing A/B toggle)
- Primary color picker with chroma-js auto-palette derivation
- 5 of 14 font pairings (AI-selected default always free, 9 soft-gated)
- H1/H2 headline editing via sidebar + `ewb:update-content` PostMessage
- "Reset to AI Original" button
- 100ms debounced PostMessage for real-time iframe updates
- Zustand `useCustomizationStore` for override state
- All zero-marginal-cost (client-side CSS only)

**Phase 2 — Sharing + Engagement (Weeks 3-5):**

- Shareable preview links (Convex persistence)
- "Built with EasyWebsiteBuild" badge on free exports/shares
- Open Graph meta tags for social sharing
- Time-based engagement nudge

**Phase 3 — Accounts + Revenue (Weeks 5-8, requires Clerk):**

- Clerk authentication + account wall at export/save
- Stripe billing: Pro ($19/mo), Agency ($49/mo)
- Pro unlocks: all 14 fonts, full color (18 tokens), 8 CSS effects, 14 patterns, 4 dividers, component variants, body text editing, clean export
- Usage-based AI regeneration credits (5/mo Pro, unlimited Agency)

**Phase 4 — Advanced Customization (Weeks 8-12):**

- Component variant switching UI
- Personality slider panel (Pro — leverages `generateThemeFromVector()`)
- Section reorder, component add/remove
- CSS effect selector per component
- Clean export for Pro+

**Competitive positioning:** "Guided Design" — every customization option curated for the user's brand. Not raw control like Wix/Framer, but brand-coherent options filtered through the character system.

#### 1. Multi-Page Generation & Routing

**Impact: 9/10 | Effort: Medium**

This is the single highest-impact improvement. Every real website has multiple pages. A barbershop needs Home + Services + About + Contact at minimum.

**What to build:**

- AI spec generation already outputs `pages[]` array — the data is there
- Generate separate page routes (not just anchor-link sections)
- Nav links point to real pages (`/about`, `/services`, `/contact`)
- Each page has its own component composition
- Shared nav + footer across all pages
- Export generates proper routing (Next.js App Router pages)

**The AI prompt already has this capability** — it just needs the instructions to use it. Currently the prompt tends to put everything on one page because the examples show that pattern.

#### 2. ~~Character Capture System (Phase 4C)~~ ✅ COMPLETE

**Impact: 8/10 | Effort: Medium**

Emotional goals, brand voice, archetype, anti-references. Implemented in Phase 4C — 3 new intake steps (Steps 5-7), emotional theme overrides, voice-keyed content, anti-reference constraints.

#### 3. Refinement Chat (MVP)

**Impact: 9/10 | Effort: Medium-High**

Even a simple version — "make it darker," "change the headline," "add a team section" — would transform the user experience. Start with these patch types:

- `adjust_theme` (change colors, spacing, fonts)
- `rewrite_copy` (regenerate text for a specific component)
- `add_component` (insert a new section)
- `remove_component` (delete a section)

This doesn't need to be perfect. It needs to work for the 80% case.

#### 4. Real Image Handling

**Impact: 8/10 | Effort: Medium**

Sites with placeholder divs will never impress. Three approaches (do all three, progressively):

**Phase A: Descriptive Placeholders** — Instead of gray divs, show styled cards that describe what image should go there: "Upload: A warm photo of your barbershop interior" with the alt text visible. This costs nothing and makes the preview much more useful.

**Phase B: Stock Photo API** — Integrate Unsplash or Pexels free API. When generating the spec, include image search keywords per component (e.g., "luxury barbershop interior", "barber cutting hair"). Fetch and display real stock photos. The user can swap them later.

**Phase C: User Upload** — Let users upload their own images during or after generation. Store in Convex File Storage. Replace stock images with real ones.

#### 5. WCAG Contrast Enforcement

**Impact: 7/10 | Effort: Low**

The theme generation layer can produce inaccessible color combinations (e.g., yellow CTA background with white text). Fix at the source:

**What to build:**

- Add `chroma.contrast(bg, text)` validation after theme generation
- Enforce minimum 4.5:1 contrast for body text, 3:1 for large text (WCAG AA)
- Auto-adjust: if CTA background + text contrast < 3:1, darken the text or lighten the background
- Apply to: `colorTextOnPrimary` vs `colorPrimary`, `colorTextOnDark` vs dark backgrounds, CTA text vs CTA background
- Run as a post-processing step in `generateThemeFromVector()` before returning tokens

This prevents accessibility issues at the theme layer rather than relying on VLM evaluation to catch them after rendering.

### 🟡 HIGH VALUE — Do These Next (2-4 Months)

#### 5. Next.js Project Export (Upgrade from HTML/CSS)

**Impact: 7/10 | Effort: Medium**

The current HTML/CSS export works but isn't a real project. A proper Next.js export with App Router, component files, proper routing, and `npm run dev` support would be dramatically more valuable — especially for the one-time purchase model.

#### 6. Working Contact Forms

**Impact: 7/10 | Effort: Low**

This is surprisingly easy and high-impact. When someone fills out the contact form on a generated site:

- For hosted/subscription sites: Convex mutation stores the submission + sends email notification via Resend
- For exported sites: Form action points to a configurable endpoint (Formspree, Netlify Forms, or a simple Convex HTTP endpoint)

#### 7. Vercel Deployment

**Impact: 7/10 | Effort: Medium**

Instead of exporting a ZIP, deploy directly to Vercel via their API. The user gets a live URL instantly. This is the subscription model enabler.

#### 8. User Accounts & Project Dashboard

**Impact: 6/10 | Effort: Medium**

Users need to save projects, return later, manage multiple sites. Use Clerk or Convex auth. Dashboard shows all projects with preview thumbnails, edit/export/deploy actions.

### 🟢 VALUABLE — Do When Ready (4-8 Months)

#### 9. Blog/CMS System

**Impact: 6/10 | Effort: Medium-High**

A simple Convex-backed CMS: create posts with a markdown editor, posts appear on the blog page with the site's theme. No complex permissions, no categories/tags initially. Just title + body + date + optional cover image.

#### 10. Booking Integration

**Impact: 7/10 for booking sites | Effort: Medium**

Two approaches:

- **Simple:** Embed Calendly/Acuity widget styled to match the site theme. We build a `booking-embed` component that takes a Calendly URL and renders it in an iframe with themed wrapper.
- **Premium:** Build our own booking UI (calendar, time slots, provider selection) with Convex backend. More work but more control over the experience.

Start with the simple approach. It can work in the demo (show the UI) and in production (real bookings).

#### 11. Commerce Lite (Snipcart)

**Impact: 7/10 for e-commerce sites | Effort: Medium**

Snipcart is a JavaScript library that adds cart + checkout to any website. You add `data-item-*` attributes to HTML elements and Snipcart handles the rest — cart, checkout, Stripe payments, webhooks.

**What we'd build:**

- `commerce-product-card` component that includes Snipcart data attributes
- `commerce-cart` component (Snipcart provides this, we theme it)
- Configuration step in intake: "Connect your Stripe account" or "Set up Snipcart"
- Products defined in the spec, rendered as themed cards with buy buttons

**What Snipcart handles:**

- Shopping cart state
- Checkout flow
- Payment processing (via their Stripe integration)
- Order notifications
- Customer management

This gives us "e-commerce" without building any e-commerce backend.

### 🔵 FUTURE — Strategic Bets (8+ Months)

#### 12. Visual Editor (for subscription sites)

Click-to-edit text, drag-to-reorder sections, theme adjustment panel. This is what makes the subscription model sticky — clients can make small changes without regenerating.

#### 13. Knowledge Base & Learning

Semantic embeddings, proven recipe promotion, content pattern extraction. Makes the system smarter over time. High effort, high long-term value.

#### 14. White-Label / Agency Mode

Let web agencies use EasyWebsiteBuild under their own brand. They do the client intake, the system generates the site, they deliver it. Multiplies revenue without multiplying users.

#### 15. Template Marketplace

Let designers create and sell component sets, theme presets, and page templates. Creates an ecosystem and expands variety without internal development.

---

## The E-Commerce Question — Detailed Thinking

You asked specifically about this. Here's the nuanced answer:

### What "E-Commerce Site" Actually Means

Most small businesses asking for an "e-commerce site" actually need one of these:

**A. "I sell 5-20 products online"** — A product catalog page with buy buttons. Snipcart or Shopify Buy Button handles this perfectly. We build the themed product cards, they handle the checkout. ~80% of "e-commerce" requests.

**B. "I have a full store with hundreds of products"** — This is Shopify. We shouldn't compete here. We could potentially generate a Shopify theme based on our intake process, but that's a separate product.

**C. "I sell services/courses/memberships"** — This is Stripe Checkout + a simple product catalog. We can handle this with themed pricing pages + Stripe Payment Links.

**D. "I need a custom marketplace"** — Out of scope forever.

### Our E-Commerce Strategy

```
Phase 1 (Now):        commerce-services component shows services + pricing (display only)
Phase 2 (6 months):   Stripe Payment Links — each service/product links to a Stripe checkout
Phase 3 (9 months):   Snipcart integration — full cart + checkout on the site
Phase 4 (12 months):  Convex-backed product catalog with admin panel

Each phase builds on the previous. The components stay the same — only the backend connection changes.
```

### What This Looks Like to the User

**Today:**
User: "I want an e-commerce site"
System: Generates a product showcase page with cards showing products, prices, descriptions. Buttons say "Buy Now" but don't work.

**Phase 2:**
Same as above, but "Buy Now" links to a Stripe Payment Link checkout. The client sets up products in Stripe, we embed the links. Real purchases work.

**Phase 3:**
Full in-site shopping experience. Add to cart, view cart, checkout — all on the site, all themed. Snipcart handles the backend.

**The key realization:** At every phase, the VISUAL experience is our responsibility (and what we're good at). The TRANSACTIONAL infrastructure is someone else's (and what they're good at). We never need to build payment processing, inventory management, or order fulfillment.

---

## Recommended Development Sequence

```
DONE (Phases 4A-4D + 5A):
  ✅ Quality fixes (4A)
  ✅ Component expansion — 18 components (4B)
  ✅ Basic export (4B)
  ✅ Character capture (4C)
  ✅ Mobile responsiveness (4D)
  ✅ CSS visual foundation — patterns, dividers, placeholders, parallax (5A)

NEXT (Weeks 1-4):
  🔴 Stock photo API integration (5B)
  🔴 Multi-page generation & routing
  🔴 AI image generation (5C)

THEN (Weeks 5-8):
  🔴 Refinement chat (MVP)
  🟡 Next.js project export upgrade
  🟡 WCAG contrast enforcement

AFTER (Weeks 9-16):
  🟡 Working contact forms
  🟡 Vercel deployment
  🟡 Clerk authentication + admin dashboard

LATER (Months 4-8):
  🟢 Booking integration (Calendly embed)
  🟢 Blog/CMS
  🟢 Commerce lite (Snipcart or Stripe Payment Links)

FUTURE (Months 8+):
  🔵 Visual editor
  🔵 Knowledge base
  🔵 White-label mode
```

Each step makes the product more complete and more sellable. The first 8 weeks alone would take you from "demo that generates a single page" to "tool that generates multi-page, image-rich, character-specific websites that can be refined through conversation and deployed to Vercel."

---

## Visual Character Strategy (Phase 5+)

The biggest gap between "generated" and "crafted" websites is visual character — real images, textures, patterns, custom graphics, and the design details that make each site unique.

### The Visual Character Gap

**What we have now:** Flat themed sections with placeholder images. Theme tokens control colors, fonts, spacing — but every site still feels like the same template with different paint.

**What makes a site feel unique:**

1. **Real, contextual images** — Not stock photos, but images that feel like they belong to THIS business
2. **Section dividers & textures** — SVG wave separators, grain overlays, subtle patterns that break visual monotony
3. **Custom graphics & illustrations** — Hero illustrations, icon sets, decorative elements that match the brand character
4. **Background treatments** — Gradient meshes, image overlays, blur effects, parallax layers
5. **Micro-interactions** — Cursor effects, scroll-triggered reveals, hover states that feel intentional

### Visual Character Roadmap

| Priority  | Feature                   | Approach                                                             | Phase |
| --------- | ------------------------- | -------------------------------------------------------------------- | ----- |
| ✅ Done   | Section dividers          | SVG wave/angle/curve/zigzag separators, personality-driven selection | 5A ✅ |
| ✅ Done   | Background patterns       | 14 CSS patterns mapped to 25+ business sub-types, theme-colored      | 5A ✅ |
| ✅ Done   | Image placeholders        | ImagePlaceholder component (gradient/pattern/shimmer variants)       | 5A ✅ |
| ✅ Done   | Visual vocabulary system  | Per-business visual language (divider, accent, overlay, parallax)    | 5A ✅ |
| ✅ Done   | Parallax scroll effects   | useParallax hook (framer-motion), reduced-motion + mobile aware      | 5A ✅ |
| 🔴 High   | Stock photo integration   | Unsplash/Pexels/Pixabay API with keyword builder + color filtering   | 5B    |
| 🔴 High   | WCAG contrast enforcement | chroma.contrast() validation in theme generation                     | 5E    |
| 🟡 Medium | AI image generation       | convex-nano-banana (Gemini) for custom imagery                       | 5C    |
| 🟡 Medium | Advanced scroll effects   | CSS scroll-timeline, depth scrolling, scale transforms               | 5D    |
| 🟢 Low    | Custom icon sets          | Industry-specific icon libraries matching brand character            | 7     |
| 🟢 Low    | Animated backgrounds      | Gradient mesh animations, particle effects                           | 7     |
| 🔵 Future | User image upload         | Drag-and-drop image replacement in preview with Convex File Storage  | 6-7   |
| 🔵 Future | Brand asset extraction    | Upload logo → extract colors, fonts, style signals automatically     | 8+    |

### How VLM Feedback Improves Future Designs

The VLM evaluation loop creates a flywheel:

1. **Generate** → Site with current best-guess theme + content
2. **Evaluate** → Claude Vision scores 5 dimensions, suggests adjustments
3. **Adjust** → Apply `Partial<ThemeTokens>` overrides, instant re-render
4. **Learn** → Aggregate scores reveal patterns ("restaurants with luxury + warm consistently score low on color → adjust industry hue bias")
5. **Improve** → Feed patterns back into `generateThemeFromVector()` defaults, reducing need for VLM corrections over time

This is the same flywheel that made recommendation systems powerful — each interaction makes the next generation better.

---

## Authentication & Admin Dashboard (Clerk)

### Overview

Clerk authentication enables admin-only features, data visibility, and protected routes without building auth from scratch.

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLERK AUTH                         │
│                                                      │
│  Public Routes (no auth required):                   │
│    /            Homepage                             │
│    /demo        Intake flow                          │
│    /demo/preview Generated site preview              │
│    /preview     Component library demo               │
│                                                      │
│  Admin Routes (Clerk admin role required):            │
│    /docs        Full project documentation           │
│    /admin       Admin dashboard                      │
│    /admin/sessions  Session browser & pipeline logs   │
│    /admin/evaluations  VLM evaluation history        │
│    /admin/test-cases  Backtesting infrastructure     │
│    /admin/feedback  User satisfaction ratings        │
│    /dev/*       Dev tools (existing, move behind auth)│
│                                                      │
│  Auth Flow:                                          │
│    ClerkProvider wraps app in layout.tsx              │
│    Middleware protects /admin/* and /docs routes      │
│    Admin role checked via Clerk metadata              │
└─────────────────────────────────────────────────────┘
```

### Admin Dashboard Features

| Feature          | Data Source                  | Purpose                                                                  |
| ---------------- | ---------------------------- | ------------------------------------------------------------------------ |
| Session Browser  | `siteSpecs` + `pipelineLogs` | Browse all generation sessions, see intake data, spec output, AI prompts |
| Pipeline Trace   | `pipelineLogs`               | Full prompt → response → validation → timing for each generation         |
| VLM Evaluations  | `vlmEvaluations`             | Score history, dimension breakdowns, applied adjustments                 |
| Feedback Summary | `feedback`                   | Satisfaction ratings with dimension breakdowns                           |
| Test Cases       | `testCases`                  | Named test cases with run history                                        |
| System Health    | Aggregated queries           | Generation success rate, avg scores, API usage, error rates              |

### Implementation Plan

1. **Install Clerk** — `npm install @clerk/nextjs`, configure environment variables
2. **ClerkProvider** — Wrap app in `layout.tsx` (alongside ConvexClientProvider)
3. **Middleware** — Protect `/admin/*` and `/docs` routes with `clerkMiddleware()`
4. **Admin role** — Set admin metadata in Clerk dashboard (not self-service)
5. **Admin layout** — Shared sidebar navigation for admin pages
6. **Session browser** — Query `siteSpecs` + `pipelineLogs`, display in searchable table
7. **Pipeline viewer** — Detailed view of a single generation session
8. **Replace /docs redirect** — Check Clerk auth instead of unconditional redirect
9. **Move /dev/\* behind auth** — Existing dev tools become admin-only

### Integration with Convex

Clerk + Convex integration uses Clerk's JWT tokens verified by Convex:

- Convex `auth.config.ts` configured with Clerk issuer URL
- Protected Convex functions use `ctx.auth.getUserIdentity()` to verify admin role
- Public functions (getSiteSpec, saveSiteSpec) remain unauthenticated for the demo flow

---

## One More Thing: The "Fun" Factor

You mentioned wanting the process to be interactive and fun. Right now it's functional but feels like a form. Here are specific things that make it feel more like a creative collaboration:

1. **Micro-animations between steps** — The transition from one intake step to the next should feel like progress, not like clicking "Next" on a form. A brief visual transformation, a personality visualization growing, something that rewards completion.

2. **Real-time preview hints** — As the user adjusts personality sliders, show a tiny preview thumbnail updating in real-time. "See what's happening" as they make choices.

3. **The refinement chat IS the fun part** — When someone types "make it more moody" and the preview darkens in real-time, that's magical. That's the moment where the product feels like a creative partner, not a form processor.

4. **Progress celebration** — When the site generates, don't just show it. Build anticipation (the loading animation already does this). Then reveal it with a satisfying transition. The moment of "oh wow, that's my website" is the emotional peak of the experience.

5. **Shareable preview links** — Let users share their generated preview with a link. "Check out the website I just created!" This is free marketing AND makes the user feel proud of the output.
