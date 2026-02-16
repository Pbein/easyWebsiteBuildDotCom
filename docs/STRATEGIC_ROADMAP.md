# Strategic Assessment & High-Value Development Roadmap

> **Purpose:** Honest evaluation of where EasyWebsiteBuild is today, what the highest-value next moves are, and how to think about the website vs web-application spectrum.
>
> **Date:** February 2026
> **Last updated:** 2026-02-16 (aligned with Boardroom Sessions 001-003, Phase 6B/6C shipped)

---

## Current State: Honest Assessment

### What We Can Deliver Today

A single-page, themed, responsive marketing website with AI-generated industry-specific content, 24 components, 7 theme presets, stock photos, CSS visual effects, and real-time customization (presets, color, fonts, headlines, brand character). Two intake modes: Express (3-step, <90s) and Deep Brand Capture (9-step, ~3min). Post-generation Brand Discovery sidebar with real-time theme/content feedback. Shareable preview links. Exported as HTML/CSS/README ZIP.

### Limitation Inventory

| #   | Limitation                                                                                                                                                                                                                                              | Impact                                                                                                                | Difficulty to Fix                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 1   | **Single-page only** — nav links exist but all point to `#sections` on the same page                                                                                                                                                                    | High — clients expect About, Services, Contact pages at minimum                                                       | Medium                              |
| 2   | **~~No real images~~** ✅ **RESOLVED** — Phase 5A CSS visual foundation (placeholders, patterns, dividers) + Phase 5B stock photo integration (Unsplash/Pexels/Pixabay with context-aware keyword builder, color filtering, 24hr caching)               | ~~Medium~~                                                                                                            | ~~Medium~~                          |
| 3   | **~~No post-generation editing~~** ✅ **RESOLVED** — Phase 6A customization sidebar + Phase 6C Brand Discovery sidebar shipped (7 presets, color picker, 5/14 fonts, headline editing, emotion/voice/archetype/anti-ref with real-time feedback, reset) | ~~High~~                                                                                                              | ~~Medium~~                          |
| 4   | ~~**Character capture not built**~~ ✅ **RESOLVED in Phase 4C** — emotional goals, voice, archetype, anti-references captured                                                                                                                           | ~~High~~                                                                                                              | ~~Medium~~                          |
| 5   | **Export is basic HTML/CSS** — not a real Next.js project, no routing                                                                                                                                                                                   | Medium — works for simple sites, limiting for anything more                                                           | Medium                              |
| 6   | **Forms don't submit** — contact form shows success animation but sends nothing                                                                                                                                                                         | Medium — common expectation                                                                                           | Low                                 |
| 7   | **No booking functionality** — booking sites have no actual booking flow                                                                                                                                                                                | High for booking-type clients                                                                                         | Medium-High                         |
| 8   | **No e-commerce** — no cart, no checkout, no product management                                                                                                                                                                                         | High for e-commerce clients                                                                                           | High (but solvable via integration) |
| 9   | **No CMS/blog** — content sites have no way to add posts                                                                                                                                                                                                | Medium — common expectation                                                                                           | Medium                              |
| 10  | **No third-party integrations** — Stripe, Calendly, Mailchimp, analytics = zero                                                                                                                                                                         | Medium-High                                                                                                           | Varies per integration              |
| 11  | **No deployment** — users get a ZIP, must self-host                                                                                                                                                                                                     | Medium — friction for non-technical users                                                                             | Medium (Vercel API)                 |
| 12  | **No user accounts** — can't save projects, return later, manage multiple sites                                                                                                                                                                         | Medium — essential for a real product                                                                                 | Medium                              |
| 13  | **Component variety limited** — 24 components covers most cases but not all site types                                                                                                                                                                  | Low — diminishing returns per component                                                                               | Low per component                   |
| 14  | **No mobile app preview** — viewport toggle simulates but isn't a real device test                                                                                                                                                                      | Low — nice to have                                                                                                    | Low                                 |
| 15  | **No WCAG contrast enforcement** — Theme generation can produce inaccessible color combinations (yellow CTA + white text)                                                                                                                               | Medium — accessibility & readability                                                                                  | Low (chroma.contrast() check)       |
| 16  | **No design evaluation feedback** — No automated way to assess if generated site matches intent                                                                                                                                                         | ~~Medium~~ ✅ **RESOLVED** — VLM Design Feedback Loop (T3-E1) evaluates screenshots against intent with Claude Vision | ~~High~~                            |

### What Competitors Do

For context on where the market is:

| Feature         | Squarespace        | Wix         | Framer        | EasyWebsiteBuild                                     |
| --------------- | ------------------ | ----------- | ------------- | ---------------------------------------------------- |
| Templates       | 100+ hand-designed | 800+        | 100+          | AI-generated from scratch — infinite variety         |
| AI generation   | Basic (text only)  | ADI (basic) | AI page gen   | Express (<90s) + Deep brand capture (9-step)         |
| Customization   | Drag-drop editor   | Drag-drop   | Visual editor | Guided sidebar + Brand Discovery + AI Chat (planned) |
| Export/own      | No                 | No          | Limited       | **Yes ($99, zero lock-in)**                          |
| Lock-in         | High               | High        | Medium        | **Zero** (anti-lock-in as brand identity)            |
| Hosting         | Included           | Included    | Included      | Vercel ($12/mo Starter)                              |
| Pricing         | $16-65/mo          | $17-159/mo  | $5-30/mo      | **$12-29/mo** (BD-003-01)                            |
| Time to preview | 2-3 min            | 1-2 min     | 1-2 min       | **<90 sec** ✅ shipped (BD-004-01 express path)      |

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

### Pricing & Tier Strategy (Boardroom BD-003-01)

> Decision source: `business/boardroom/sessions/2026-02-14-rd-training-and-pricing.md`
> Feature plan: `docs-specific-feature-plans/PRICING_MONETIZATION_STRATEGY.md`

**Philosophy:** "Other companies make websites. We make YOUR website." The personalization IS the product. Anti-lock-in is our brand identity.

| Tier          | Price        | What You Get                                                                                                                  | Unit Economics                        |
| ------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| **Free Demo** | $0           | Express path (60s) or full intake → generate → preview → customize (7 presets, color, 5 fonts, headlines). Export with badge. | ~$0.05/gen (AI) or $0 (deterministic) |
| **Starter**   | $12/mo       | Live site (Vercel), clean export (no badge), working contact form, 1 AI Chat message                                          | ~$0.50/mo → 96% margin                |
| **Pro**       | $29/mo       | All 14 fonts, full color control, CSS effects, unlimited AI Chat, booking/payment integrations, custom domain                 | ~$1-2/mo → 93% margin                 |
| **Own It**    | $99 one-time | Full project export, zero lock-in, deployment guide. Available to any tier.                                                   | $0 → 100% margin                      |

**Break-even:** ~4 Starter users OR 2 Pro users.

### Product Tier Strategy (Technical)

**Tier 1: Static Sites (NOW — shipping)**

- ✅ CSS visual foundation — Phase 5A COMPLETE
- ✅ Character capture — Phase 4C COMPLETE
- ✅ Stock photos — Phase 5B COMPLETE
- ✅ Real-time customization — Phase 6A COMPLETE
- 🔴 Express path (<90 sec to preview) — BD-004-01
- 🔴 Monetization infrastructure (Stripe + Clerk) — BD-003-01
- 🔴 Vercel deployment — BD-003-01
- 🟡 Multi-page generation with routing
- 🟡 Next.js project export upgrade

**Tier 2: Dynamic Sites (NEXT — 3-6 months)**

- Working contact forms (Formspree for Starter, Convex for hosted)
- AI Design Chat (Pro feature) — BD-003-04
- Post-generation Brand Discovery — BD-004-03
- Newsletter signup (Mailchimp/ConvertKit integration)

**Tier 3: Service Sites (LATER — 6-12 months)**

- Booking integration (Calendly embed, Pro tier)
- Stripe Payment Links for purchases (Pro tier)
- Blog/CMS (Convex-backed simple CMS)

**Tier 4: Commerce Lite (FUTURE — 12+ months)**

- Snipcart or Shopify Buy Button
- Product catalog display
- NOT building: inventory, shipping, customer accounts, returns

**Out of Scope (Forever):**

- Full e-commerce platforms (Shopify's territory)
- Custom web applications (dev agency work)
- Database-heavy applications (custom development)
- Custom marketplaces

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

## High-Value Development Priority

> Restructured per Boardroom Sessions 001-003. Replaces old numbered priority list.
> Full decision trail: `business/boardroom/DECISIONS_LOG.md`

### 🔴 CRITICAL — Revenue Foundation (Now → 6 Weeks)

All tracks run in parallel. The goal: first paying customer within 30 days.

#### Express Path (BD-004-01) — "60-Second Website"

**Impact: 10/10 | Effort: Low (deterministic path already exists)**

The #1 conversion barrier is time-to-preview (4-5 min vs competitors' 60-90s). Express path: site type + business name + description → deterministic generation → preview in <90 seconds. Full 9-step "Deep Brand Capture" remains as optional toggle. $0 cost per generation.

#### Monetization Infrastructure (BD-003-01) — Stripe + Clerk + Vercel

**Impact: 10/10 | Effort: Medium**

Stripe Checkout ($12/mo Starter), Clerk auth (minimal email login), "Make It Yours" three-option modal, Vercel deployment pipeline for live URLs. This is the cash register. Without it, nothing else matters.

#### Immersive Preview Reveal (BD-004-02)

**Impact: 8/10 | Effort: Low**

Full-screen site preview on load, 3-5 second celebration, sidebar slides in after. The "wow" moment must be sacred (P0). Progressive disclosure hides complexity.

#### R&D Quality Benchmark (BD-003-02)

**Impact: 7/10 | Effort: Medium**

20 reference sites, Claude Vision scoring on 6 dimensions, Wix ADI comparison. Validates that output quality justifies charging money. Quality gate for express path: Delight Champion veto if score <6/10.

Feature plan: `docs-specific-feature-plans/DESIGN_QUALITY_RD_BENCHMARK.md`

#### Distribution Foundation (BD-003-03)

**Impact: 7/10 | Effort: Medium**

Fix homepage (real examples, correct stats, single CTA). Email capture during loading screen. Shareable preview links (foundation already committed). PostHog analytics for full funnel tracking.

### 🟡 HIGH VALUE — Premium Features (Weeks 5-8)

Ship after monetization infrastructure is operational.

#### Post-Generation Brand Discovery (BD-004-03)

**Impact: 8/10 | Effort: Medium**

Character capture (emotional goals, voice, archetype) moves from pre-generation intake to post-generation sidebar. Each answer triggers visible site transformation in real-time. This is our moat — repositioned for better UX.

#### AI Design Chat (BD-003-04)

**Impact: 9/10 | Effort: Medium-High**

Conversational refinement as Pro-tier killer feature. Patch types: adjust_theme, rewrite_copy, add_component, remove_component. 1 free message for all users, unlimited Pro. "Your AI design partner" — no competitor offers this at $29/mo.

#### $99 Export (BD-003-01)

**Impact: 6/10 | Effort: Low**

Enhanced project export with all dependencies and deployment guide. Zero lock-in positioning: "Build with AI, own forever." 100% margin.

### 🟢 VALUABLE — Product Enrichment (Months 3-6)

#### Multi-Page Generation & Routing

**Impact: 9/10 | Effort: Medium**

AI spec already outputs `pages[]` array. Generate separate routes (`/about`, `/services`, `/contact`), shared nav/footer. Every real website needs multiple pages.

#### Next.js Project Export

**Impact: 7/10 | Effort: Medium**

Upgrade from HTML/CSS to proper App Router project with routing and `npm run dev` support. More valuable for $99 export tier.

#### WCAG Contrast Enforcement

**Impact: 7/10 | Effort: Low**

`chroma.contrast()` validation in theme generation. Prevent inaccessible color combinations at the source.

#### Working Contact Forms

**Impact: 7/10 | Effort: Low**

Formspree for Starter tier, Convex backend for hosted sites.

### 🔵 FUTURE — Platform Maturity (Months 6+)

- Project dashboard — save/return/manage multiple sites
- Booking integration (Calendly embed, Pro tier)
- Commerce (Stripe Payment Links, Pro tier)
- Blog/CMS (Convex-backed)
- Custom domains (Pro tier)
- Visual editor — click-to-edit, drag-to-reorder
- AI image generation (Gemini)
- Knowledge base & learning system
- White-label / agency mode
- Template marketplace

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

> Updated 2026-02-15 to reflect Boardroom Sessions 001-003. The old sequential Phase 6-9 plan has been replaced by a parallel-track approach focused on reaching first revenue.
>
> **Our ONE core action** (BD-004-01): "Describe your business → see your website."

```
DONE (Phases 1-5B + Quality + Wave 1 + 6A):
  ✅ Platform website + foundation (Phase 1)
  ✅ Component library — 24 components, 7 presets (Phases 2, 4B, Wave 1)
  ✅ 9-step intake, AI generation, assembly engine (Phase 3)
  ✅ Quality fixes + content accuracy (Phase 4A)
  ✅ Character capture — emotional goals, voice, archetype (Phase 4C)
  ✅ Mobile responsiveness (Phase 4D)
  ✅ Output Quality Overhaul — 30/33 stories (Cross-cutting)
  ✅ CSS visual foundation — 14 patterns, 4 dividers, parallax (Phase 5A)
  ✅ CSS effects system — 8 effects (Wave 1)
  ✅ Stock photo integration — Unsplash/Pexels/Pixabay (Phase 5B)
  ✅ UI enhancements — iframe preview, wireframe loading, mobile sheets
  ✅ Free customization MVP — presets, color, fonts, headlines, reset (Phase 6A)

CRITICAL PATH — Revenue Foundation (Weeks 1-6, parallel tracks):
  🔴 Express path — 2-step intake, <90 sec to preview (BD-004-01)
  🔴 Immersive preview reveal — full-screen wow, progressive disclosure (BD-004-02)
  🔴 Stripe Checkout ($12/mo) + Clerk auth + "Make It Yours" modal (BD-003-01)
  🔴 Vercel deployment pipeline — live URL for Starter tier (BD-003-01)
  🔴 R&D quality benchmark — 20 sites, Claude Vision scoring (BD-003-02)
  🔴 Distribution — fix homepage, email capture, shareable links (BD-003-03)

PREMIUM FEATURES (Weeks 5-8, after monetization ships):
  🟡 Post-generation Brand Discovery — character capture in sidebar (BD-004-03)
  🟡 AI Design Chat — conversational refinement, Pro feature (BD-003-04)
  🟡 $99 enhanced export — one-time purchase, zero lock-in (BD-003-01)

PRODUCT ENRICHMENT (Months 3-6):
  🟡 Multi-page generation & routing
  🟡 Next.js project export upgrade
  🟡 WCAG contrast enforcement
  🟡 Working contact forms (Formspree)

PLATFORM MATURITY (Months 6-12):
  🟢 Project dashboard — save/return/manage multiple sites
  🟢 Booking integration (Calendly embed, Pro)
  🟢 Commerce (Stripe Payment Links, Pro)
  🟢 Blog/CMS (Convex-backed)
  🟢 Custom domains (Pro)

FUTURE (Year 2+):
  🔵 Visual editor
  🔵 AI image generation
  🔵 Knowledge base & learning
  🔵 White-label / agency mode
  🔵 Template marketplace
```

**Critical insight (Boardroom Session 003):** The 9-step intake is our competitive moat, but nobody experiences it because 4-5 minutes kills conversion. The express path gets users to "wow" in 60 seconds; character capture moves to post-generation where users WANT to invest because they're enriching something that already exists.

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
| ✅ Done   | Stock photo integration   | Unsplash/Pexels/Pixabay API with keyword builder + color filtering   | 5B ✅ |
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

## Authentication & Billing (Clerk + Stripe)

> Part of BD-003-01 monetization infrastructure. Clerk is dual-purpose: user auth for billing AND admin access for dev tools.

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLERK AUTH                         │
│                                                      │
│  Public Routes (no auth required):                   │
│    /              Homepage                           │
│    /demo          Intake flow (express + deep)       │
│    /demo/preview  Generated site preview + customize │
│    /preview       Component library demo             │
│    /s/[shareId]   Shared preview pages               │
│                                                      │
│  Auth Gate (at conversion, not before):               │
│    "Go Live" ($12/mo) → Clerk login → Stripe        │
│    "$99 Export"  → Clerk login → Stripe one-time     │
│    Save/persist → Clerk login (free account)         │
│                                                      │
│  Admin Routes (Clerk admin role):                     │
│    /docs, /admin/*, /dev/*                           │
│                                                      │
│  Auth Flow:                                          │
│    ClerkProvider wraps app in layout.tsx              │
│    Middleware protects /admin/* and /docs routes      │
│    Subscription status via Clerk metadata            │
└─────────────────────────────────────────────────────┘
```

### Billing Flow (BD-003-01)

1. User completes intake → preview → customization (all free, no auth)
2. "Make It Yours" modal offers: Go Live ($12/mo) | Download ($99) | Free Preview (with badge)
3. "Go Live" or "Download" → Clerk signup/login → Stripe Checkout → redirect back
4. Subscription status stored in Clerk metadata, checked via `useSubscription()` hook
5. Vercel deployment triggered for Starter/Pro subscribers

### Delight Champion Conditions (ELEVATED, BD-003-01)

- Auth gate appears AFTER customization, never before reveal
- Free tier remains complete — nothing removed, ever
- "Go Live" framing (gain frame), not "Upgrade" (loss frame)
- No flow-interrupting modals or popups
- Cancel/downgrade must be trivially easy

---

## The "Delight" Factor (P0: People Must Love It)

> The game design principle: if the game isn't fun, nobody plays. If nobody plays, nothing else matters.

What makes users LOVE the experience:

1. ✅ **Micro-animations between steps** — framer-motion transitions with horizontal slide, staggered card entry in emotion/archetype steps. SHIPPED.

2. **Real-time preview transformation** — As users answer Brand Discovery questions (BD-004-03), the site visibly transforms. Each answer changes colors, copy, or layout in real-time. The cause-and-effect is the magic. PLANNED.

3. **AI Design Chat as creative partner** — "Make it more moody" → preview darkens. "Add a team section" → section appears. This is the moment the product feels alive. PLANNED (BD-003-04).

4. **Immersive reveal** — Full-screen site preview with celebration moment before controls appear (BD-004-02). The "wow" moment is sacred. PLANNED.

5. ✅ **Shareable preview links** — "Check out the website I just created!" Free marketing + user pride. Foundation SHIPPED, integration PLANNED.

6. **60-second website** — "Just type your business name and it builds a whole website." Word-of-mouth gold (BD-004-01). PLANNED.
