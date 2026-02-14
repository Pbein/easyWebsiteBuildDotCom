# Boardroom Decisions Log

> Running log of all strategic decisions. Every boardroom session adds entries here.
> Decisions are reconciled against `STRATEGIC_PRINCIPLES.md` and `docs/STRATEGIC_ROADMAP.md`.
>
> Last updated: 2026-02-14

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
| **Status**     | ACTIVE                                                              |
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
| **Status**     | ACTIVE                                                 |
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

| Field          | Value                                                  |
| -------------- | ------------------------------------------------------ |
| **Status**     | ACTIVE                                                 |
| **Priority**   | Strategic direction (not a shipping item)              |
| **Champion**   | Product (Amara Okafor) + Competitive (James Whitfield) |
| **Principles** | P2 (Intelligence Is Moat), P3 (User Owns Feeling)      |
| **Timeline**   | Ongoing — influences all customization UI decisions    |
| **Conflicts**  | None                                                   |

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

## Unresolved Tensions

| ID        | Tension                           | Parties                                              | Status                                                             | Trigger to Revisit                    |
| --------- | --------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------- |
| UT-001-01 | How many presets should be free?  | CMO (all 7) vs Monetization (3)                      | Decided: all 7 free. NEEDS_DATA from Phase 1 to validate           | Phase 1 gate-click analytics          |
| UT-001-02 | Inline editing vs sidebar editing | Competitive (inline) vs Product (iframe prevents it) | Decided: sidebar for now. Inline deferred to Phase 9 visual editor | When iframe architecture is revisited |
| UT-001-03 | Number of free font pairings      | CMO (5-7) vs Monetization (3)                        | Compromised at 5. NEEDS_DATA                                       | Phase 1 font gate-click rate          |
| UT-001-04 | When to require account creation  | CMO (delay) vs Monetization (gate at export)         | Decided: gate at export/save                                       | Phase 1 export rate data              |
