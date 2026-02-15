# Boardroom Session 002: Design Quality R&D System & Pricing/Monetization Strategy

**Date:** 2026-02-14
**Topics:** (1) Design Quality R&D — Training & Benchmarking System, (2) Pricing Model, Monetization & Premium Value Strategy
**Participants:** All 10 personas (including Delight Champion)
**Facilitator:** Claude (AI)
**Requested by:** Founder

---

## Context

Two strategic topics submitted by the founder:

**Topic 1: Design Quality R&D**
Build a system to practice and improve design output quality by: curating real websites, screenshotting and extracting understanding, reverse-engineering into intake fields, running through generation pipeline, and comparing output against references. Pure R&D with no direct revenue — but essential for making the output genuinely good. The founder also notes the intake flow could be improved through this feedback loop.

**Topic 2: Pricing & Monetization**
Current state: Free users go through intake → demo-preview → free customization (Phase 6A just shipped). Now need to convert. Ideas on the table:

- Base paid plan: monthly subscription including hosting, affordable (not $75/mo)
- AI Design Chat (Premium): after free customization, unlock AI-powered redesign with full prompts
- Migration/Export ($99 one-time): full site export, zero lock-in, explicitly anti-lock-in
- Higher tiers: more API calls + non-AI value adds
- Philosophy: "Other companies make websites.. we make 'your' website"

---

## Round 1 — CEO Frames the Objective

### Current State (from codebase)

- **Phase:** 6A just shipped (free customization MVP). Phases 1–5B + Quality Overhaul complete.
- **Components:** 24 library components with multiple variants each
- **Presets:** 7 theme presets
- **Intake steps:** 9 (Setup 1-4, Character 5-7, Discovery 8, Generation 9)
- **Font pairings:** 14 total, 5 free
- **Theme tokens:** 87 CSS custom properties across 6 categories
- **CSS effects:** 8 effects, 14 patterns, 4 dividers
- **Key infrastructure:** Convex, Claude SDK, iframe PostMessage preview, Zustand, ZIP export, VLM feedback loop, customization store
- **Revenue:** $0. Zero users. Zero market validation.
- **Acquisition channels:** Zero active

### Success Metrics

- **Topic 1:** Can we measure and systematically improve output quality? Can we identify where the intake flow loses signal?
- **Topic 2:** Do we have a pricing model that feels accessible, creates real value at each tier, and doesn't feel like "strangling" users?

### Constraints

- Solo developer (P4: Zero-Marginal-Cost First)
- Zero revenue, zero users (Hormozi: "Revenue is the only validation that matters")
- AI API costs ~$0.03-0.10 per generation
- No accounts, no auth, no billing infrastructure yet
- Export is basic HTML/CSS ZIP

### Stakes

- **If R&D is wrong:** Waste engineering time on premature optimization, or ship without knowing if output is good enough to charge for.
- **If pricing is wrong:** Leave money on the table, scare users away, or build billing for a model that doesn't convert.

---

## Round 2 — Strategy Presentations

### 1. CEO (Marcus Chen) — Strategic Vision Architect

**Strategy:** Topics are deeply connected. R&D is how we earn the right to charge. But Hormozi analysis says revenue validation first. Proposes "quality sprint": lightweight benchmarking tool (not full training system) for quality score, then simplest possible monetization. R&D compounds in background while pricing ships in weeks.

**Top 3 Actions:**

1. Build "Reference Gallery" benchmarking tool — 20 real websites, score output gap
2. Ship simplest paid tier — $12-15/mo hosting with real URL
3. Gate AI Design Chat behind paid tier

### 2. CMO (Sierra Washington) — Growth Strategist

**Strategy:** Pricing is premature without users. Zero acquisition channels active. Lead with generous free tier creating shareable moments. R&D system should be customer-facing (show "sites like yours" during intake). Anti-lock-in $99 export is a trust signal marketing message.

**Top 3 Actions:**

1. Fix homepage — replace fabricated testimonials, correct stats
2. Build share mechanism (Phase 6B) — shareable preview links
3. Position $99 export as marketing headline

### 3. CRO (Diego Morales) — Conversion Architect

**Strategy:** Two gaping holes: no email capture, no value gate. $12-15/mo for hosting is a no-brainer. Conversion moment should come AFTER customization (IKEA effect + psychological ownership), not before.

**Top 3 Actions:**

1. Add email capture during loading screen (after wireframe animation completes)
2. Build "Put This Online" CTA — replace Export as primary action with "$12/mo Go Live"
3. Gate AI Design Chat at the natural paywall moment

### 4. Product (Amara Okafor) — Product Architect

**Strategy:** R&D training system is the most strategically important investment. Our moat is "we understand your brand better than anyone" — if output doesn't look professional vs real websites, that's academic. Proposes 3-phase: Reference Library, Reverse Engineering Pipeline, Quality Gap Analysis.

**Top 3 Actions:**

1. Build Reference Library — 50-100 curated sites with metadata
2. Build reverse-engineering extractor using Claude Vision
3. Build comparison scorer — run pipeline, screenshot, score against reference

### 5. Infra (Viktor Petrov) — Technical Infrastructure Strategist

**Strategy:** Unit economics first. Hosting cost: ~$0.20-0.40/site via Vercel. At $12/mo, gross margin ~96%. AI Design Chat at 5 turns/mo: $0.50-1.50, margin stays >85%. R&D benchmarking: 200 API calls × ~$0.04 = ~$8/run — manageable if monthly, not weekly.

**Top 3 Actions:**

1. Build Vercel deployment pipeline (hosting capability)
2. Set up Stripe Checkout (one product, one price, one webhook)
3. For R&D: batch processing, cache results, use cheapest Claude model for routine comparisons

### 6. Monetization (Priya Sharma) — Monetization Architect

**Strategy:** Revised tier proposal: Free Demo ($0) → Starter ($12/mo, hosting + clean export + 1 AI chat) → Pro ($29/mo, all customization + unlimited AI chat + integrations) → Export ($99 one-time, zero lock-in). Key changes from BD-001-03: lower prices ($12 vs $19, $29 vs $49), AI Design Chat as killer differentiator, $99 export as new tier.

**Top 3 Actions:**

1. Ship Stripe Checkout for $12/mo Starter
2. Build $99 export as upsell — "Own this forever"
3. Build AI Design Chat as Pro differentiator

### 7. Competitive (James Whitfield) — Competitive Intelligence Analyst

**Strategy:** Anti-lock-in is massive differentiator. Squarespace: cancel = site disappears. Wix: can't export. base44: lock-in complaints. We should LEAD with "you own your website." R&D benchmark against Wix ADI would be marketing gold if we win.

**Top 3 Actions:**

1. Benchmark against Wix ADI — same site on both platforms, Claude Vision scoring
2. Ship $99 export before anyone else
3. Price below Squarespace/Wix entry point ($12 vs $16-17)

### 8. Partnerships (Elena Vasquez) — Partnerships & Integrations Lead

**Strategy:** Integrations are the non-AI premium value. Free = beautiful but static. Paid = actually does things (forms submit, bookings work, payments process). Integration isn't commoditized when presented through our design system with brand-coherent styling.

**Top 3 Actions:**

1. Ship working contact forms immediately (Formspree, free tier)
2. Build Calendly embed as Pro feature
3. Bundle integrations as tier differentiators

### 9. UX Psych (Dr. Miriam Sato) — UX Behavioral Psychologist

**Strategy:** Conversion moment must feel like a gift, not a gate. "Go Live for $12/mo" (gain frame) vs "Pay to unlock" (loss frame). The $12/mo triggers gain seeking; $75/mo triggers loss aversion. R&D should score emotional resonance, not just visual similarity.

**Top 3 Actions:**

1. Frame pricing as "going live" not "unlocking"
2. Add emotional resonance scoring to R&D benchmark
3. Build the "anti-strangling" experience — always feel in control

### 10. Delight Champion — User Delight Guardian (ELEVATED AUTHORITY)

**Strategy:** Applied Five Questions test. R&D creates delight indirectly (better output = more "wow"). Pricing must preserve delight — free tier must remain lovable, reveal moment never paywalled. Issued Delight Veto concerns: no preset gating, no flow-interrupting upgrade modals, first AI Chat message must be free.

**Top 3 Actions:**

1. Protect the free experience — nothing gets removed. Ever. (ELEVATED)
2. Make first AI Chat message free — taste the magic, then pay
3. Add "Delight Score" to R&D benchmark — "Would someone screenshot this?"

---

## Round 3 — Adversarial Cross-Examination (8 exchanges)

### Exchange 1: CMO vs Monetization — Generosity vs Revenue

**Sierra:** "Who clicks the $12/mo button with zero users? We're building a cash register in an empty store."
**Priya:** "Stripe Checkout is a 2-day build — ship in parallel with distribution, not after. The worst case is going viral with no monetization."
**Resolution:** Ship monetization AND distribution in parallel.

### Exchange 2: Product vs CEO — Depth vs Breadth

**Amara:** "Half-building R&D gives half-answers. A spa and tech startup get the same structure with different words."
**Marcus:** "Start with 20 sites in 3 days, not 100 sites in 3 weeks. Get a number. If bad, THEN build the full system."
**Resolution:** Lightweight first (20 sites), expand based on results.

### Exchange 3: CRO vs Delight Champion — Free Wow vs Paid Gate

**Diego:** "Free tier gives away EVERYTHING. Where's the value gap?"
**Delight Champion:** "The gap isn't removing from free — it's ADDING to paid. Live site, AI chat, working forms, integrations."
**Resolution:** Value gap through addition, not subtraction.

### Exchange 4: Infra vs Product — Rich Prompts vs Costs

**Viktor:** "R&D system costs more per month ($6-10) than serving 500 users."
**Amara:** "Run monthly, not weekly. $6-10/mo is less than Netflix. Would you rather spend 40 hours fixing wrong issues or $10 finding right ones?"
**Resolution:** Monthly benchmarks, not weekly. Acceptable cost.

### Exchange 5: Competitive vs Partnerships — Integration vs AI Moat

**James:** "Squarespace has 100+ integrations, Wix has 300+. We can't win an integration race."
**Elena:** "I'm proposing THREE. And our integration looks brand-coherent through our design system — theirs looks like a dropped-in widget."
**Resolution:** Three quality integrations (form, booking, payment) > hundreds of generic ones.

### Exchange 6: UX Psych vs CRO — Emotion vs Conversion

**Dr. Sato:** "Email capture during loading screen breaks the emotional arc at peak anticipation."
**Diego:** "After wireframe completes (7.5s mark), natural pause. Framed as value exchange, not extraction."
**Resolution:** Email capture AFTER wireframe animation, BEFORE final polish.

### Exchange 7: Delight Champion vs Monetization — Badge Quality

**Delight Champion:** "If the watermark makes the site look unprofessional, I'm invoking the Delight Veto."
**Priya:** "The 'Built with EWB' footer badge IS the watermark. Small, themed, tasteful. We WANT it to look good — every free site is a billboard."
**Resolution:** Convergence — small themed footer badge that users don't mind having.

### Exchange 8: CEO vs UX Psych — Ship Fast vs Journey Quality

**Marcus:** "Your actions are principles, not features. Give me ONE buildable thing that ships this week."
**Dr. Sato:** "Change Export button to 'Make It Yours' modal with three options: Go Live ($12/mo), Download ($99), Free preview (with badge). Three lines of copy, ships in a day."
**Resolution:** Concrete, shippable conversion modal.

---

## Round 4 — Decision Output

### Top 3 Priorities

#### Priority 1: Ship Monetization Foundation

- **Champion:** Monetization (Priya), endorsed by CRO (Diego), CEO (Marcus)
- **Resolution:** Ship monetization AND distribution in parallel
- **Delight Approval:** Free tier remains lovable, "Go Live" framing, first AI Chat free
- **Implementation:** Stripe Checkout ($12/mo), "Make It Yours" modal, Vercel deployment, Clerk auth (minimal), "Built with EWB" footer badge
- **KPI:** First paid conversion within 30 days
- **Timeline:** Weeks 1-3

#### Priority 2: Build Lightweight Quality Benchmark (R&D v1)

- **Champion:** Product (Amara), endorsed by Delight Champion, Competitive (James)
- **Resolution:** Start with 20 sites (not 100), Claude Vision scoring, expand if gaps found
- **Implementation:** 20 reference sites, `/dev/benchmark` page, pipeline run + screenshot + score, 6 dimensions (5 VLM + emotional resonance), Wix ADI comparison for 5 sites
- **KPI:** Average quality score >7/10; identify top 3 gaps
- **Timeline:** Weeks 2-4

#### Priority 3: Distribution Foundation

- **Champion:** CMO (Sierra), endorsed by CRO (Diego), UX Psych (Dr. Sato)
- **Implementation:** Fix homepage, shareable preview links (Phase 6B), email capture in loading screen, PostHog analytics
- **KPI:** 10% share rate; 20% email capture rate
- **Timeline:** Weeks 3-5

### Risk Table

| Risk                               | Raised By          | Severity | Mitigation                                             |
| ---------------------------------- | ------------------ | -------- | ------------------------------------------------------ |
| Zero users = zero conversions      | CMO                | High     | Ship distribution in parallel with monetization        |
| R&D costs exceed value pre-revenue | Infra              | Medium   | 20 sites monthly, use Haiku for routine comparisons    |
| Output quality not good enough     | Product            | High     | Benchmark quantifies before scaling sales              |
| Aggressive gating kills journey    | UX Psych / Delight | High     | "Go Live" framing, free tier complete, first chat free |
| $12/mo too low to sustain          | Infra              | Low      | 96% margin; scale risk only at 500+ users              |
| $99 export cannibalizes monthly    | Monetization       | Medium   | Different value props; most users want both            |
| Wix ADI comparison shows we lose   | Competitive        | Medium   | Better to know and fix than to assume                  |

### Consensus Points

1. Free experience must remain genuinely wonderful (P0)
2. $12/mo is the right entry point
3. $99 export is a strategic asset, not revenue leak
4. AI Design Chat is the killer premium feature
5. R&D benchmarking necessary but start lightweight
6. Reveal moment never paywalled
7. Email capture critical but timing matters
8. "Other companies make websites.. we make 'your' website" is the brand

### Unresolved Tensions

| ID        | Tension                     | Parties                                             | Status                                           | Trigger                                  |
| --------- | --------------------------- | --------------------------------------------------- | ------------------------------------------------ | ---------------------------------------- |
| UT-002-01 | Free AI Chat messages count | Delight (1 free) vs Monetization (0)                | Decided: 1 free. NEEDS_DATA                      | First 50 user conversion data            |
| UT-002-02 | Auto-run R&D benchmark?     | Product (auto) vs Infra (manual)                    | Decided: manual. Revisit with CI/CD              | Automated deployment pipeline            |
| UT-002-03 | Should intake be shortened? | CRO (5-6 steps) vs Product (9 steps)                | NEEDS_DATA                                       | R&D benchmark: shortened vs full quality |
| UT-002-04 | Free vs Pro integrations    | Partnerships (forms free) vs Monetization (all Pro) | Decided: forms free, booking/payment Pro         | Tier conversion data                     |
| UT-002-05 | Next.js vs HTML/CSS export? | Competitive (Next.js) vs Infra (more work)          | Decided: HTML/CSS first, Next.js upgrade planned | Vercel deployment pipeline               |

### Pricing Model (Boardroom Consensus)

| Tier          | Price        | What You Get                                                                              | Philosophy                    |
| ------------- | ------------ | ----------------------------------------------------------------------------------------- | ----------------------------- |
| **Free Demo** | $0           | Full intake → generate → preview → customize. Export with badge.                          | "Fall in love first."         |
| **Starter**   | $12/mo       | Live site (Vercel), clean export, working form, 1 AI Chat message.                        | "Less than Netflix."          |
| **Pro**       | $29/mo       | All fonts/colors/effects, unlimited AI Chat, booking/payment integrations, custom domain. | "Your AI design partner."     |
| **Own It**    | $99 one-time | Full project export, zero lock-in, deployment guide.                                      | "Build with AI, own forever." |

**Relationship to BD-001-03:** EVOLVES — prices lowered ($12/$29 vs $19/$49), AI Chat added as differentiator, $99 export as new tier, anti-lock-in as brand positioning.

### Implementation Sequence

| Week | Focus             | Actions                                                      |
| ---- | ----------------- | ------------------------------------------------------------ |
| 1    | Monetization      | Stripe Checkout ($12/mo), "Make It Yours" modal, Clerk auth  |
| 2    | Hosting + R&D     | Vercel deployment, curate 20 reference sites, benchmark page |
| 2-3  | Quality baseline  | Run benchmark, score output, identify top 3 gaps             |
| 3    | Distribution      | Fix homepage, email capture in loading screen                |
| 3-4  | Sharing           | Shareable preview links, OG meta, badge                      |
| 4-5  | Export upgrade    | $99 export flow, improved export                             |
| 5-6  | AI Design Chat    | Conversational refinement behind Pro gate                    |
| 6+   | Quality iteration | Fix top 3 gaps, re-score, iterate                            |
