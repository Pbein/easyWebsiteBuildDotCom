# Boardroom Decisions Log

> Running log of all strategic decisions. Every boardroom session adds entries here.
> Decisions are reconciled against `STRATEGIC_PRINCIPLES.md` and `docs/STRATEGIC_ROADMAP.md`.
>
> Last updated: 2026-02-15 (Session 003)

---

## How to Read This Log

- **ID format**: `BD-{session#}-{sequence}` (e.g., BD-001-01 = Session 1, Decision 1)
- **Status**: ACTIVE | COMPLETED | SUPERSEDED | EVOLVED | DEFERRED | NEEDS_DATA | REJECTED
- **Principles**: Which strategic principle(s) this decision supports
- **Conflicts**: Any past decisions this modifies or replaces

---

## Session 001: Customization System Architecture (2026-02-12)

> Full transcript: `business/boardroom/sessions/2026-02-12-customization-system.md`
> Participants: All 9 personas
> Context: Post-generation preview has zero customization. Competitive gap is critical.

### BD-001-01: Ship Free-Tier Customization Panel

| Field          | Value                                                               |
| -------------- | ------------------------------------------------------------------- |
| **Status**     | COMPLETED (shipped 2026-02-14, commit 272ad6e)                      |
| **Priority**   | P1 (highest)                                                        |
| **Champion**   | CEO (Marcus Chen), unanimous consensus                              |
| **Principles** | P3 (User Owns Feeling), P4 (Zero-Marginal-Cost), P5 (Ship Simplest) |
| **Timeline**   | Weeks 1-3                                                           |
| **Conflicts**  | None — no prior customization decisions exist                       |

**Decision**: Build a customization sidebar panel on the demo preview page with:

- 7 theme preset switcher (expand existing A/B toggle)
- Primary color picker with chroma-js auto-palette derivation
- 5 of 14 font pairings (AI-selected default always free, 9 visible but soft-gated)
- H1/H2 headline editing via sidebar text fields + `ewb:update-content` PostMessage
- "Reset to AI Original" button
- 100ms debounced PostMessage for real-time iframe updates
- Zustand `useCustomizationStore` for override state

**Revenue hypothesis**: Creates gate-click data to validate tier pricing. Proves users want customization before building billing infrastructure. Drives export engagement.

**Implementation notes**:

- All controls are client-side (CSS vars, font loading, PostMessage) — zero marginal cost
- Extends existing iframe protocol (`ewb:` prefix)
- PostHog events: `customization_started`, `preset_changed`, `color_changed`, `font_changed`, `gate_clicked`

---

### BD-001-02: Shareable Preview Links + "Built with EWB" Badge

| Field          | Value                                                             |
| -------------- | ----------------------------------------------------------------- |
| **Status**     | ACTIVE                                                            |
| **Priority**   | P2                                                                |
| **Champion**   | CMO (Sierra Washington)                                           |
| **Principles** | P1 (Revenue Validates — via acquisition), P7 (Journey Is Product) |
| **Timeline**   | Weeks 3-5                                                         |
| **Conflicts**  | None                                                              |

**Decision**: Generate unique shareable URLs for customized previews. Include "Built with EasyWebsiteBuild" badge on free-tier exports and shared previews. Add Open Graph meta tags for social sharing.

**Revenue hypothesis**: Every shared preview is a free acquisition channel. Badge on free exports drives brand awareness. Requires Convex mutation for preview persistence.

---

### BD-001-03: Account Wall + Pro Gate at $19/mo and Agency at $49/mo

| Field          | Value                                                  |
| -------------- | ------------------------------------------------------ |
| **Status**     | EVOLVED → see BD-003-01                                |
| **Priority**   | P3                                                     |
| **Champion**   | Monetization (Priya Sharma) + CRO (Diego Morales)      |
| **Principles** | P1 (Revenue Validates), P4 (Zero-Marginal-Cost gating) |
| **Timeline**   | Weeks 5-8 (requires Clerk auth + Stripe billing)       |
| **Conflicts**  | None — no prior pricing decisions exist                |

**Decision**: Require account creation (Clerk) to export or save. Tier structure:

- **Free Demo** (no account): 7 presets, primary color, 5 fonts, H1/H2 editing, watermarked export
- **Free Account** ($0): Same + persistence, 3 sites/mo
- **Pro** ($19/mo): All 14 fonts, full color control (18 tokens), 8 CSS effects, 14 patterns, 4 dividers, component variant switching, body text editing, clean export, 5 AI regen credits/mo
- **Agency** ($49/mo): Everything + white-label, unlimited AI regen, custom domain

**Revenue hypothesis**: $19/mo undercuts Squarespace ($16-65) and Wix ($17-159) while offering AI differentiation. Conservative projection: $1,500-2,000 MRR at Phase 3 maturity.

**Open questions** (NEEDS_DATA):

- Exact free font count: CMO wanted 7, Monetization wanted 3, compromised at 5. Validate with user data from Phase 1 gate-click analytics.
- Preset gating: All 7 free (CMO position) vs 3 free (Monetization position). Currently decided as all 7 free. Revisit if conversion data suggests otherwise.

---

### BD-001-04: Guided Customization as Competitive Positioning

| Field          | Value                                                           |
| -------------- | --------------------------------------------------------------- |
| **Status**     | EVOLVED → see BD-004-03 (character capture now post-generation) |
| **Priority**   | Strategic direction (not a shipping item)                       |
| **Champion**   | Product (Amara Okafor) + Competitive (James Whitfield)          |
| **Principles** | P2 (Intelligence Is Moat), P3 (User Owns Feeling)               |
| **Timeline**   | Ongoing — influences all customization UI decisions             |
| **Conflicts**  | None                                                            |

**Decision**: Brand our customization as "Guided Design" — every option is curated for the user's brand character. Show "Recommended for your brand" badges. Personality sliders (Phase 4 feature) let users explore design intent, not raw tokens. This is our differentiator vs Wix/Framer raw editors.

**Implementation notes**:

- Phase 1: AI-selected defaults clearly labeled, soft-gated options show personality fit
- Phase 2 (Pro): Personality slider panel using existing `generateThemeFromVector()` architecture
- Never expose raw 87-token control — always mediated through brand-coherent groupings

---

### BD-001-05: Advanced Customization (Phase 4, Weeks 8-12)

| Field          | Value                                             |
| -------------- | ------------------------------------------------- |
| **Status**     | DEFERRED                                          |
| **Priority**   | P4 (after revenue infrastructure)                 |
| **Champion**   | Product (Amara Okafor)                            |
| **Principles** | P2 (Intelligence Is Moat), P3 (User Owns Feeling) |
| **Timeline**   | Weeks 8-12                                        |
| **Trigger**    | Phase 3 (accounts + billing) is operational       |
| **Conflicts**  | None                                              |

**Decision**: Build component variant switching UI, personality slider panel (Pro), section reorder via drag, component add/remove, CSS effect selector per component, pattern/divider customization, clean export for Pro+.

---

## Strategic Decision: User Delight Champion Establishment (2026-02-14)

> Context: Founder recognition that user delight is the foundational precondition for all business outcomes. Like game design — if the game isn't fun, nothing else matters.

### BD-002-01: Establish P0 "People Must Love It" as Foundational Principle

| Field          | Value                                                                        |
| -------------- | ---------------------------------------------------------------------------- |
| **Status**     | ACTIVE                                                                       |
| **Priority**   | P0 (highest — foundational)                                                  |
| **Champion**   | Founder directive                                                            |
| **Principles** | Creates P0, which underpins P1-P8                                            |
| **Conflicts**  | None — P0 does not replace P1, it establishes the precondition P1 depends on |

**Decision**: Add Strategic Principle P0: "People Must Love It" as the foundation all other principles rest on. Revenue (P1) only flows when the product creates genuine delight. The Delight Champion holds elevated authority to challenge any decision that degrades user experience.

**Rationale**: The game design principle — a game can have perfect monetization, marketing, and infrastructure, but if it isn't fun, nobody plays. The user's joy is the highest purpose. If not for the users, who are we helping?

---

### BD-002-02: Create User Delight Champion Boardroom Persona with Elevated Authority

| Field          | Value                                     |
| -------------- | ----------------------------------------- |
| **Status**     | ACTIVE                                    |
| **Priority**   | Structural (affects all future decisions) |
| **Champion**   | Founder directive                         |
| **Principles** | P0 (People Must Love It)                  |
| **Conflicts**  | None — adds to existing 9-persona system  |

**Decision**: Add a 10th boardroom persona — the User Delight Champion — with elevated authority under P0. This persona:

- Can challenge any decision that degrades user experience (the "Delight Veto")
- Uses the Five Questions test (smile? screenshot? friend? trust? would WE love this?)
- Operates from `.agents/agents/boardroom-delight.md` with philosophy in `USER_DELIGHT_MANIFESTO.md`
- Is included in ALL boardroom debates, not just UX-specific ones
- Has 5 new tensions (16-20) in the Tension Map, all marked ELEVATED

**Implementation**: Agent file created, manifesto written, Strategic Principles updated, Tension Map expanded from 15 to 20, all index files updated.

---

### BD-002-03: Establish User Delight Manifesto as Governing Document

| Field          | Value                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------- |
| **Status**     | ACTIVE                                                                                              |
| **Priority**   | Strategic direction (permanent)                                                                     |
| **Champion**   | Founder directive                                                                                   |
| **Principles** | P0 (People Must Love It)                                                                            |
| **Conflicts**  | Evolves AP1 ("Build It and They Will Come") — we still need revenue hypotheses, but joy comes first |

**Decision**: The User Delight Manifesto (`.agents/agents/USER_DELIGHT_MANIFESTO.md`) establishes:

- Seven Principles of Delight (D1-D7): Joy Before Revenue, The Reveal Is Sacred, Respect Is Foundation, Personality Is the Product, Polish Is Not Optional, Delight Scales, We Build for People
- Delight Checklist: 8-point test before any feature ships (smile, screenshot, friend, trust, polish, personality, worse, pride)
- Stage-by-stage emotional targets from homepage through export
- The game design analogy as the founding philosophy

---

## Session 002: R&D Training System & Pricing/Monetization (2026-02-14)

> Full transcript: `business/boardroom/sessions/2026-02-14-rd-training-and-pricing.md`
> Participants: All 10 personas (including Delight Champion)
> Context: Phase 6A free customization just shipped. Zero revenue, zero users. Two topics: R&D quality benchmarking and pricing model.

### BD-003-01: Revised Pricing Tiers — Starter $12/mo + Pro $29/mo + $99 Export

| Field          | Value                                                                     |
| -------------- | ------------------------------------------------------------------------- |
| **Status**     | ACTIVE                                                                    |
| **Priority**   | P1 (highest — revenue foundation)                                         |
| **Champion**   | Monetization (Priya Sharma), endorsed by CRO + CEO                        |
| **Principles** | P0 (People Must Love It), P1 (Revenue Validates), P4 (Zero-Marginal-Cost) |
| **Timeline**   | Weeks 1-3                                                                 |
| **Conflicts**  | EVOLVES BD-001-03 (prices lowered, AI Chat added, $99 export new)         |

**Decision**: Revised tier structure (evolves BD-001-03):

- **Free Demo** ($0, no account): Full intake → generate → preview → customize (7 presets, color, 5 fonts, headlines). Export with "Built with EWB" footer badge. This is the hook.
- **Starter** ($12/mo): Live site with real URL (Vercel hosting). Clean export (no badge). Working contact form. 1 free AI Design Chat message. Email support.
- **Pro** ($29/mo): All 14 fonts, full color control, CSS effects. Unlimited AI Design Chat. Booking/payment integrations. Custom domain. Priority support.
- **Own It** ($99 one-time): Full project export. Zero lock-in. Deployment guide. All dependencies. Available to any tier.

**Why this evolves BD-001-03:**

- Lower prices ($12 vs $19, $29 vs $49) — founder's "not strangling" principle
- AI Design Chat as the killer premium differentiator (not just more CSS options)
- $99 export as new anti-lock-in tier ("Build with AI, own forever")
- Dropped "Agency" tier for now — revisit when scale demands it
- Framing: "Go Live" (gain frame), not "Upgrade" (loss frame)

**Revenue hypothesis**: $12/mo at 96% gross margin. $99 export is pure profit. AI Chat creates natural paywall between CSS customization and conversational redesign. Anti-lock-in $99 export builds trust and differentiates from Squarespace/Wix/base44.

**Delight Champion conditions (ELEVATED):**

- Free tier remains complete — nothing removed. Ever.
- Reveal moment never paywalled
- First AI Chat message is free (taste the magic)
- No flow-interrupting upgrade modals
- Badge must be tasteful and themed, not embarrassing

---

### BD-003-02: Lightweight Quality Benchmark (R&D v1)

| Field          | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| **Status**     | ACTIVE                                                             |
| **Priority**   | P2                                                                 |
| **Champion**   | Product (Amara Okafor), endorsed by Delight Champion + Competitive |
| **Principles** | P2 (Intelligence Is Moat), P5 (Ship Simplest)                      |
| **Timeline**   | Weeks 2-4                                                          |
| **Conflicts**  | None — no prior R&D decisions                                      |

**Decision**: Build a lightweight quality benchmarking system:

- Curate 20 reference websites (2 per top 10 business types) with metadata (business type, emotional tone, design quality, key patterns)
- Build dev-only benchmarking page (`/dev/benchmark`)
- For each reference: reverse-engineer basic intake inputs manually, run our pipeline, screenshot output, compare against reference using Claude Vision
- Score 6 dimensions: 5 VLM dimensions + emotional resonance
- Track scores over time in Convex
- Include Wix ADI comparison for 5 representative sites
- Monthly benchmark runs (not weekly) — ~$6-10/run

**Revenue hypothesis**: Quality measurement enables quality improvement, which enables pricing justification. "Our AI-generated restaurant sites score 8.5/10 vs Wix ADI's 5.2/10" is both a product metric and a marketing asset.

**Scope constraint (CEO compromise)**: Start with 20 sites in 3 days, not 100 in 3 weeks. Get a number first. If the number reveals actionable gaps, expand. If quality is already high, focus on sales.

---

### BD-003-03: Distribution Foundation — Shares, Homepage Fix, Email Capture

| Field          | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| **Status**     | ACTIVE                                                             |
| **Priority**   | P3 (parallel with P1)                                              |
| **Champion**   | CMO (Sierra Washington), endorsed by CRO + UX Psych                |
| **Principles** | P0 (People Must Love It), P1 (Revenue Validates — via acquisition) |
| **Timeline**   | Weeks 3-5                                                          |
| **Conflicts**  | None — complements BD-001-02 (Shareable Preview Links)             |

**Decision**: Build distribution foundation in parallel with monetization:

- Fix homepage: replace fabricated testimonials with real generated examples, correct stats to "24 Components | 7 Presets | 13 Site Types"
- Build shareable preview links (Phase 6B): Convex `sharedPreviews` table, unique slug, OG meta tags
- "Built with EWB" footer badge on shared previews and free exports
- Email capture during loading screen: AFTER wireframe animation completes (~7.5s), BEFORE final polish messages. Framed as value exchange ("Where should we send your editable link?"), with skip option
- PostHog analytics events for full funnel tracking

**Revenue hypothesis**: Every shared preview is a free acquisition channel at $0 CAC. Email capture enables re-engagement. Homepage fix builds trust for conversion.

---

### BD-003-04: AI Design Chat as Premium Differentiator

| Field          | Value                                             |
| -------------- | ------------------------------------------------- |
| **Status**     | ACTIVE                                            |
| **Priority**   | P4 (after monetization infrastructure)            |
| **Champion**   | Monetization (Priya) + Product (Amara)            |
| **Principles** | P2 (Intelligence Is Moat), P3 (User Owns Feeling) |
| **Timeline**   | Weeks 5-6                                         |
| **Trigger**    | Stripe Checkout and Vercel deployment operational |
| **Conflicts**  | None — no prior chat decisions                    |

**Decision**: Build conversational AI refinement as the Pro-tier premium feature:

- Natural language commands: "make the hero darker," "add a team section," "rewrite the about text"
- Patch types: adjust_theme, rewrite_copy, add_component, remove_component
- Uses existing Claude SDK infrastructure
- 1 free message for all users (Delight Champion condition), unlimited for Pro ($29/mo)
- This is the transition from "CSS customization" (free) to "AI design partner" (paid)

**Competitive positioning**: Free users get knobs and presets. Paid users get a creative partner that understands their brand. Nobody else offers this at this price point.

---

## Session 003: Product Simplification — "One Screen, One Button, One Core Action" (2026-02-15)

> Full transcript: `business/boardroom/sessions/2026-02-15-product-simplification.md`
> Participants: All 10 personas (including Delight Champion)
> Context: Founder presented Vlad Tenev's (Robinhood CEO) product philosophy: "Get down to the essence — one screen, one button, one core action." Codebase complexity audit revealed 82-122+ user decisions, 4-5 min median time to preview (2-3x slower than competitors).

### BD-004-01: Ship Express Path ("60-Second Website")

| Field          | Value                                                                              |
| -------------- | ---------------------------------------------------------------------------------- |
| **Status**     | ACTIVE                                                                             |
| **Priority**   | P1 (highest — removes primary conversion barrier)                                  |
| **Champion**   | CEO (Marcus), endorsed by CRO, CMO, Infra, Competitive, UX Psych, Delight Champion |
| **Principles** | P0 (People Must Love It), P5 (Ship Simplest), P4 (Zero-Marginal-Cost)              |
| **Timeline**   | Weeks 1-2                                                                          |
| **Conflicts**  | RESTRUCTURES intake flow; does NOT remove character capture (P2 preserved)         |

**Decision**: Build a 2-step express intake path as the DEFAULT experience:

- Step 1: Site type selection (existing Step 1)
- Step 2: Business name + description (existing Step 3, combined)
- Generate immediately using deterministic path ($0 cost, 2-5 seconds)
- Target: under 90 seconds from first click to preview
- Full 9-step path remains available as "Deep Brand Capture" mode toggle

**Our ONE core action**: "Describe your business → see your website."

**Quality gate**: Delight Champion holds veto power. If R&D benchmark (BD-003-02) scores fast-path output <6/10 average, express path requires quality improvements before launch.

**Revenue hypothesis**: Matching competitor speed (Wix ADI 60-90s) removes the #1 barrier to conversion. More users reaching preview = more conversions. Deterministic generation costs $0 = infinite margin on free tier.

---

### BD-004-02: Immersive Preview Reveal + Progressive Disclosure

| Field          | Value                                             |
| -------------- | ------------------------------------------------- |
| **Status**     | ACTIVE                                            |
| **Priority**   | P2                                                |
| **Champion**   | Partnerships (Elena) + Delight Champion           |
| **Principles** | P0 (People Must Love It), P7 (Journey Is Product) |
| **Timeline**   | Weeks 2-3                                         |
| **Conflicts**  | None — enhances existing preview page             |

**Decision**: Restructure the preview page for emotional impact:

- Full-screen immersive site preview on load (sidebar hidden, toolbar minimal)
- 3-5 second celebration moment before any controls appear
- Sidebar slides in after celebration with "Customize" label
- Dev panel hidden by default (Ctrl+Shift+D only)
- A/B variant toggle moved into sidebar, not toolbar
- Mobile: same pattern — full-screen → bottom sheet CTA after delay

**Revenue hypothesis**: Extended engagement time on preview page increases emotional attachment (IKEA effect), leading to higher customization engagement and conversion.

---

### BD-004-03: Post-Generation Character Capture (Brand Discovery)

| Field          | Value                                                                            |
| -------------- | -------------------------------------------------------------------------------- |
| **Status**     | ACTIVE                                                                           |
| **Priority**   | P3                                                                               |
| **Champion**   | Product (Amara) + UX Psych (Dr. Sato)                                            |
| **Principles** | P2 (Intelligence Is Moat), P3 (User Owns Feeling), P7 (Journey Is Product)       |
| **Timeline**   | Weeks 3-5                                                                        |
| **Conflicts**  | EVOLVES BD-001-04 (Guided Customization) — character capture now post-generation |

**Decision**: Move character capture (emotional goals, voice detection, archetype) from pre-generation intake to post-generation customization sidebar as "Brand Discovery":

- New "Discover Your Brand" section in customization sidebar
- Each selection triggers PostMessage theme/content update to iframe (visible transformation)
- Emotional goals → color palette shift; Voice → headline/CTA rewrite; Archetype → layout adjustment
- Progressive UI: sections unlock as user engages
- AI-powered refinement uses credit system (1 free, unlimited Pro) — aligns with BD-003-01/BD-003-04

**Revenue hypothesis**: Post-generation character capture creates stronger endowment effect (user is enriching THEIR site, not filling out a survey). Visible transformation per answer drives engagement. Credit system creates natural Pro upsell.

---

## Unresolved Tensions

| ID        | Tension                           | Parties                                              | Status                                                                      | Trigger to Revisit                        |
| --------- | --------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------- |
| UT-001-01 | How many presets should be free?  | CMO (all 7) vs Monetization (3)                      | Decided: all 7 free. NEEDS_DATA from Phase 1 to validate                    | Phase 1 gate-click analytics              |
| UT-001-02 | Inline editing vs sidebar editing | Competitive (inline) vs Product (iframe prevents it) | Decided: sidebar for now. Inline deferred to Phase 9 visual editor          | When iframe architecture is revisited     |
| UT-001-03 | Number of free font pairings      | CMO (5-7) vs Monetization (3)                        | Compromised at 5. NEEDS_DATA                                                | Phase 1 font gate-click rate              |
| UT-001-04 | When to require account creation  | CMO (delay) vs Monetization (gate at export)         | Decided: gate at export/save (BD-003-01: gate at "Go Live" or "$99 Export") | Phase 1 export rate data                  |
| UT-002-01 | Free AI Chat messages count       | Delight Champion (1 free) vs Monetization (0 free)   | Decided: 1 free message. NEEDS_DATA                                         | First 50 user conversion data             |
| UT-002-02 | Auto-run R&D benchmark?           | Product (auto on pipeline change) vs Infra (manual)  | Decided: manual for now                                                     | When automated deployment pipeline exists |
| UT-002-03 | Should intake be shortened?       | CRO (5-6 steps) vs Product (9 steps = quality)       | EVOLVING — Session 003 express path IS the shortened intake. NEEDS_DATA     | R&D quality benchmark: fast vs full       |
| UT-002-04 | Free vs Pro integrations          | Partnerships (forms free) vs Monetization (all Pro)  | Decided: contact forms free, booking/payment Pro                            | Post-launch tier conversion data          |
| UT-002-05 | Next.js vs HTML/CSS export?       | Competitive (Next.js) vs Infra (more work)           | Decided: HTML/CSS first, Next.js upgrade planned                            | After Vercel deployment pipeline          |
| UT-003-01 | Character capture free vs Pro     | Monetization (Pro) vs CMO (free UI)                  | Decided: UI free, AI refinement uses credit system. NEEDS_DATA              | Post-launch engagement data               |
| UT-003-02 | Demo gallery vs direct fast path  | CMO (gallery first) vs CEO (fast path first)         | Decided: fast path first. Gallery deferred. NEEDS_DATA                      | After fast path ships, measure conversion |
| UT-003-03 | Express path input count          | CRO (2 fields) vs Product (3 fields)                 | Decided: 3 fields (type + name + desc). NEEDS_DATA                          | A/B test completion rates                 |
| UT-003-04 | Personality slider redesign       | Product (mood picker) vs CRO (remove entirely)       | Decided: available in Deep mode + Brand Discovery. NEEDS_DATA               | R&D benchmark: quality with vs without    |
