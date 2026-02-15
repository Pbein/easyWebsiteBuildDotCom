# Boardroom Session 003: Product Simplification — "One Screen, One Button, One Core Action"

**Date:** 2026-02-15
**Topic:** Should EasyWebsiteBuild radically simplify per Vlad Tenev's product philosophy?
**Participants:** All 10 personas (including Delight Champion)
**Facilitator:** Claude (AI)
**Requested by:** Founder
**Inspiration:** Vlad Tenev (Robinhood CEO), "This Week in Startups" interview (May 2017)

---

## Context

Robinhood CEO Vlad Tenev described how Robinhood v1 was a muddled social trading app — profiles, following, ratings, upvotes, private messaging. They scrapped it all and rebuilt around ONE action: trading stocks from your phone. At $1B+ valuation, they still didn't have a web platform.

His advice: _"Don't throw the kitchen sink into an app. Make something super simple. Get down to the essence — one screen, one button, one core action. And build from there."_

**The question:** Does EasyWebsiteBuild have a kitchen sink problem? What is our ONE core action? Should we radically simplify?

---

## Round 1 — CEO Frames the Objective

### Current State (from codebase complexity audit)

- **Homepage**: 2 competing CTAs ("Try the Demo" + "Sample Site Preview"), 3 total buttons
- **Demo flow**: 9 steps, 40-60+ total inputs, 4-5 minute median time to preview
- **Step 4 (personality)**: 6 sequential A/B slider decisions — highest cognitive load single step
- **Step 8 (discovery)**: 3-7 AI-generated questions, 3-5s generation wait
- **Preview page**: 39+ controls on desktop (toolbar + sidebar + dev panel), 23+ on mobile
- **Grand total**: 82-122+ user decisions across the full journey
- **Competitor comparison**: Wix ADI: 1-2 min to first preview. Squarespace: 2-3 min. **EWB: 4-5 min (2-3x slower)**

### Principles at Stake

- **P2** (Intelligence Is the Moat) — the 9-step intake IS our differentiator
- **P0** (People Must Love It) — 82+ decisions may not feel lovable
- **P5** (Ship the Simplest Useful Thing) — are we shipping the simplest?
- **P7** (Journey Is the Product) — but is the journey too long?

### Success Metrics

- Define our ONE core action
- Reduce time-to-wow without destroying brand intelligence
- Specific implementation plan with measurable quality gates

### Stakes

- **If we simplify too much**: We lose our competitive moat. We become "another Wix ADI" — fast but shallow.
- **If we don't simplify enough**: Nobody finishes the intake. The 4-5 minute barrier kills conversion before anyone sees the magic.

---

## Round 2 — Strategy Presentations

### 1. CEO (Marcus Chen) — Strategic Vision Architect

**Strategy:** Tenev's principle is correct in spirit but dangerously misapplied if taken literally. Robinhood's core action was simple (buy stock). Our core action is complex by nature (understand who you are, then build your website). You can't collapse that into one button without destroying the value proposition.

But the complexity audit is damning. 82-122 decisions is not "rich" — it's exhausting. The real takeaway from Robinhood isn't "have one button." It's **"have one PURPOSE, and remove everything that doesn't serve it."** Our one purpose: get to the "wow" moment as fast as possible. Everything that slows the path from "I want a website" to "wow, that looks like MY website" is suspect.

**Top 3 Actions:**

1. Define the "Fast Lane" — a 3-step express path (site type + business description + generate) that skips character capture, producing a site in 60-90 seconds
2. Make character capture OPTIONAL — move Steps 4-7 to post-generation refinement, not pre-generation gates
3. Audit every preview-page control — anything that doesn't directly serve the wow moment gets hidden behind progressive disclosure

### 2. CMO (Sierra Washington) — Growth Strategist

**Strategy:** The Robinhood lesson isn't about button counts. It's about what you LEAD with. Robinhood led with "free stock trading." That's one sentence. What's ours? Right now it's "Answer 40-60 questions and wait 4-5 minutes." That's not a pitch.

We need a zero-question demo. Let users see a beautiful website for a business like theirs BEFORE asking anything. Show the magic first, collect data second. The homepage should show a gallery of pre-generated sites — click one, explore it. THEN "Want one for YOUR business? Tell us about yourself."

The current flow is backwards: "invest first, see later." It should be "see first, invest to personalize."

**Top 3 Actions:**

1. Build an instant demo gallery — 6-8 pre-generated sites users can browse immediately (zero decisions, zero wait)
2. Reduce homepage to ONE CTA: "See it in action" (not "Try the Demo" — that implies work)
3. After gallery wow moment, offer "Build yours in 60 seconds" with just site type + business name + description

### 3. CRO (Diego Morales) — Conversion Architect

**Strategy:** The data is unambiguous. 4-5 minutes to first preview = catastrophic drop-off. Industry standard for web builder onboarding is 90 seconds or less. We're 3-4x over. The Robinhood parallel: they removed social features that felt important but weren't the CORE transaction. For us, the CORE transaction is "describe your business → see your website." Everything else — personality sliders, voice detection, archetype selection, anti-references — is social features. Important for quality, but not for the core transaction.

A staged approach: get to the wow moment in under 90 seconds with 3 inputs, then offer "Want it even more personalized?" as a post-generation refinement flow. Sunk cost of seeing your site makes you MORE likely to invest in character capture.

**Top 3 Actions:**

1. Cut critical path to 3 inputs: site type, business name, description — generate immediately
2. Move Steps 4-7 to a "Personalize" tab in the customization sidebar (post-generation)
3. A/B test: track completion rates of 3-step vs 9-step flows, measure output quality difference

### 4. Product (Amara Okafor) — Product Architect

**Strategy:** I'm the dissenter. Tenev's philosophy works for a commodity transaction (buy stock). It does NOT work for a creative, brand-aware generation process. The 9-step intake isn't complexity — it's our ENTIRE competitive moat (P2). A barbershop through Wix ADI looks like every other Wix barbershop. A barbershop through our character capture — with "The Artisan" archetype, warm voice, anti-"cheap" constraint, "trust + craftsmanship" emotional goals — looks like THAT barbershop.

If we skip to 3 inputs, we produce Wix ADI quality output. We become the thing we're competing against. The R&D benchmark (BD-003-02) should answer this empirically: run the same 20 sites through both the full 9-step and the 3-step path, score both. Let the data decide.

However, I concede that Step 4 (6 personality sliders) has UX problems. The sequential sub-step pattern is fatiguing. I'd collapse the 6 axes into a single visual "brand mood" picker.

**Top 3 Actions:**

1. Do NOT cut character capture until R&D benchmark proves it doesn't matter (UT-002-03)
2. Redesign Step 4: replace 6 sequential sliders with a single "brand mood" picker (6-8 visual cards that map to personality vectors)
3. Make the express path available but position full path as premium: "Quick Build (60s)" vs "AI Brand Capture (3 min)"

### 5. Infra (Viktor Petrov) — Technical Infrastructure Strategist

**Strategy:** The simplification question has a clear technical answer: we already have deterministic fallback. The 3-step path is literally the deterministic fallback with a UI wrapper. If we cut Steps 4-8, we're just shipping the fallback as the primary experience. The AI path becomes the refinement.

This is actually elegant. Generate immediately with deterministic defaults, let the user see something fast, then offer "Let our AI learn your brand" as an enhancement. The AI call happens in the background while the user browses their preview.

Cost implication: the 3-step path costs $0 per generation (deterministic). Character capture + AI path costs ~$0.03-0.08. If 70% of users use the fast path, our unit economics improve dramatically.

**Top 3 Actions:**

1. Ship the deterministic-fallback-as-fast-path immediately — it's already built, just needs a UI route
2. Run AI character capture as a background process: user explores preview while AI re-generates with richer inputs
3. Measure: what % of users accept the "quick" result vs invest in character capture refinement

### 6. Monetization (Priya Sharma) — Monetization Architect

**Strategy:** Tenev's simplification created massive top-of-funnel. Robinhood's free stock trades brought in millions of users; they monetized with Robinhood Gold, options, crypto. Our equivalent: the fast path brings in massive trial volume. Character capture becomes the "Gold" — a premium personalization experience.

**Top 3 Actions:**

1. Fast path (3 steps) = free tier default. Immediate generation, immediate wow
2. Character capture = premium personalization in the post-generation sidebar. "Unlock deeper brand capture" as the upsell
3. This redefines the value ladder: Free (fast build) → Starter ($12, hosting) → Pro ($29, AI Brand Capture + AI Chat)

### 7. Competitive (James Whitfield) — Competitive Intelligence Analyst

**Strategy:** Wix ADI does 60-90 seconds to first preview. We do 4-5 minutes. That's a competitive disadvantage no amount of quality can overcome in user testing.

But here's the competitive judo move: if our fast path matches Wix ADI speed AND our character-capture refinement produces demonstrably better output, we have the best of both worlds. "As fast as Wix, but gets better the more you tell us."

**Top 3 Actions:**

1. Match Wix ADI's time-to-preview: under 90 seconds, 3 inputs max
2. Position character capture as "AI Brand Discovery" — a post-generation premium experience
3. Build competitive demo: same business, side-by-side Wix ADI vs EWB quick vs EWB full-capture

### 8. Partnerships (Elena Vasquez) — Partnerships & Integrations Lead

**Strategy:** The simplification debate is about the intake funnel, but the same kitchen-sink problem exists in the preview page. 39+ controls on desktop. A user who just wants to see their website is greeted by a dev panel, A/B variant toggles, viewport switches, personality vectors, and technical metadata.

The Robinhood principle applies here too: the preview page's core action is "fall in love with your site." Every control that isn't directly supporting that should be hidden.

**Top 3 Actions:**

1. Default to full-screen immersive preview — sidebar closed, toolbar minimal
2. Preview first action: "Love it? Make it yours" (leading to customization/conversion)
3. Progressive disclosure: dev tools, technical metadata, A/B toggle only appear on demand

### 9. UX Psych (Dr. Miriam Sato) — UX Behavioral Psychologist

**Strategy:** The Robinhood insight is about cognitive load and commitment gradients. Our users have LOW external motivation — they're exploring, curious. With low motivation, EVERY additional step compounds the drop-off rate exponentially.

The psychology is clear: show the reward first (preview), create endowment effect ("this is YOUR site"), THEN ask for investment (character data). This is how free-to-play games work — play first, invest later. Our current flow is "fill out this survey, then we'll show you the game."

However, a 3-step path that produces a generic result destroys the "this is MY website" feeling. The solution is progressive personalization: start generic, let every interaction make it MORE personalized.

**Top 3 Actions:**

1. Reverse the flow: generate first (3 inputs), personalize second (post-generation)
2. Design "progressive revelation" in the customization sidebar — each personalization choice visibly transforms the site in real-time
3. Frame character capture as "discovery" not "survey": "Let's learn more about your brand" with immediate visual feedback per answer

### 10. Delight Champion — User Delight Guardian (ELEVATED)

**Strategy:** Applying the Five Questions test to both paths:

**Current 9-step-first path:**

- Would they smile? Maybe — if they finish. But 4-5 minutes of questions before seeing anything?
- Would they screenshot it? They never get there — they drop off at Step 4.
- Would they tell a friend? "It asks a lot of questions" is not a compelling referral.

**Proposed fast-path-first:**

- Would they smile? YES — seeing a personalized site in 60 seconds is magical.
- Would they screenshot it? Highly likely — "look what this AI built for me in 60 seconds."
- Would they tell a friend? "Just type your business name and it builds a whole website."

**Verdict: The fast path is more delightful.** But with CONDITIONS (ELEVATED):

1. Fast-path output must be genuinely good — not a degraded "demo mode" experience
2. Character capture must be framed as "make it even better" not "you're missing features"
3. The transition from fast result to personalized result must be visually dramatic
4. The "wow" moment must remain sacred (P0)

**Top 3 Actions:**

1. Validate fast-path output quality via R&D benchmark (BD-003-02) — if it scores <6/10, don't ship it
2. Design "site transformation" animation: as user answers character questions in sidebar, the site visibly morphs in the iframe
3. Protect the reveal moment: full-screen immersive reveal with a brief celebration before any controls appear

---

## Round 3 — Adversarial Cross-Examination (8 exchanges)

### Exchange 1: Product vs CEO — Moat Destruction Risk

**Amara (Product):** "You're proposing we make our 3-step deterministic fallback the PRIMARY experience. I built the 9-step character capture because it's the ONLY thing that differentiates us from Wix ADI. Skip it and we're shipping a commodity. P2 says 'intelligence is the moat' — you're proposing we drain the moat."

**Marcus (CEO):** "The moat doesn't matter if nobody crosses the drawbridge. 4-5 minutes to first preview means most users never SEE the intelligence. A moat nobody experiences isn't a moat — it's a liability. Move the intelligence to post-generation where users actually encounter it."

**Resolution:** Character capture moves to post-generation, but remains the core differentiator. R&D benchmark (BD-003-02) must validate that fast-path quality is acceptable (>6/10) before shipping.

### Exchange 2: Product vs CRO — Data Before Cutting

**Amara (Product):** "Diego, you say 'cut to 3 inputs' based on competitor benchmarks. But we have ZERO user data. We don't know if our users drop off at Step 4 or happily complete all 9. The USER_JOURNEY.md friction ratings are theoretical."

**Diego (CRO):** "We have zero users BECAUSE the funnel is too long. You're saying 'let's measure the leak before fixing the pipe' — but the pipe is completely broken. Every SaaS benchmark says: under 2 minutes to first value. We're at 4-5. The evidence exists industry-wide."

**Resolution:** Ship both paths simultaneously. Fast path as default, full path as "deep mode." Measure which users choose which, and compare output quality. This IS the A/B test.

### Exchange 3: Monetization vs CMO — Free Moat Giveaway

**Priya (Monetization):** "Sierra, you want to give away the fast path AND the preview for free. If the fast path is good enough, why would anyone pay for character capture?"

**Sierra (CMO):** "Robinhood gave away free trades — that WAS their product. They monetized differently. Our free version creates viral sharing. Character capture isn't the gate. Hosting, AI chat, integrations, and the $99 export are the gates. The free path must be genuinely wonderful (P0 condition)."

**Resolution:** Fast path is free and ungated. Revenue gates remain at hosting ($12/mo), AI Chat ($29/mo), and export ($99). Aligns with BD-003-01.

### Exchange 4: UX Psych vs Product — Progressive vs Upfront

**Dr. Sato:** "Amara, the psychology is unequivocal. The endowment effect — 'I already have a website, let me make it better' — is stronger than commitment gradient. Post-generation capture creates creative excitement, not sunk cost obligation."

**Amara:** "But the AI generates BETTER output with character data. Post-generation refinement is a regeneration — you're showing them a mediocre site first, then saying 'want a better one?' That's showing the sausage being made."

**Dr. Sato:** "Then don't show it as regeneration. Show it as transformation. The site visibly evolves as they answer questions. Each answer changes the site in real-time. It's not 'regenerate' — it's 'personalize.'"

**Resolution:** Post-generation character capture triggers incremental theme/content updates via PostMessage, not full regeneration. Each answer visibly transforms a specific aspect of the site.

### Exchange 5: Delight Champion vs Infra — Fast Path Quality Gate

**Delight Champion:** "Viktor, you say 'ship the deterministic fallback as the fast path.' But I've seen deterministic output — it uses the same structure per business type with different words. A restaurant and a law firm get different components, but every restaurant looks the same. If the fast path triggers 'generic' (anti-reference), I'm invoking the Delight Veto."

**Viktor (Infra):** "The deterministic path already uses business-type-aware component selection, voice-keyed content, and visual vocabulary per industry. It's not one template — it's 13+ industry-aware templates. But I concede: it doesn't use personality vectors."

**Resolution:** R&D benchmark must score fast-path output quality. If average score <6/10, fast path requires default-quality improvements before launch. Delight Champion holds veto on the fast-path release.

### Exchange 6: Competitive vs Partnerships — Preview Page Complexity

**James (Competitive):** "Elena says hide the preview controls. But Wix and Squarespace show their editor immediately after generation. Users expect to DO things. A full-screen read-only preview feels like a demo, not a product."

**Elena (Partnerships):** "The first 10 seconds are about emotion, not action. Robinhood doesn't show you the order book on first launch — they show your portfolio value in big numbers. Our equivalent: show the site in full glory, 3-second pause, THEN slide in the customization sidebar."

**Resolution:** 3-5 second immersive reveal before controls appear. Sidebar slides in with subtle animation after the user has absorbed the site.

### Exchange 7: CEO vs Monetization — Express Path Pricing Implications

**Marcus (CEO):** "Priya, you want to make character capture a Pro feature. But BD-003-01 already decided: free tier gets full customization. Moving character capture to Pro changes the free tier contract."

**Priya (Monetization):** "Character capture in the sidebar is free. The AI-powered regeneration that APPLIES character data requires 1 credit. Free users get 1. Pro users get unlimited. This aligns with BD-003-01's '1 free AI Chat message' principle. Character capture was never in the free tier spec — it was in the intake flow."

**Resolution:** Character capture UI is free. AI-powered refinement from character data uses the same credit system as AI Design Chat (1 free, unlimited Pro).

### Exchange 8: Delight Champion vs CRO — Journey Remains the Product

**Delight Champion:** "Diego, you optimize for speed. I optimize for love. P7 says 'the journey is the product.' If we cut the journey to 60 seconds, do people still LOVE it?"

**Diego (CRO):** "The journey starts at the wow moment, not at the survey. After the fast path, the customization sidebar IS the journey — preset switching, color picking, font changing, headline editing, character capture. That's richer and more interactive than 9 form pages."

**Resolution:** Convergence. The journey is preserved but restructured: fast generation creates the hook, post-generation customization IS the journey. The IKEA effect is stronger when decorating a house that already exists than filling out a mortgage application.

---

## Round 4 — Decision Output

### Our ONE Core Action

**"Describe your business → see your website."**

Everything else — personality capture, voice detection, archetype selection, anti-references, discovery questions — amplifies this core action but should not gate it. The fastest path from "I want a website" to "wow, that's MY website" is the product. Everything else is the journey that makes it YOURS.

### Top 3 Priorities

#### Priority 1: Ship Express Path ("60-Second Website")

- **Champion**: CEO (Marcus), endorsed by CRO, CMO, Infra, Competitive, UX Psych, Delight Champion
- **Opponent**: Product (Amara) — wants data first
- **Resolution**: Ship express path in parallel with R&D benchmark. Quality gate: Delight Champion veto if fast-path output scores <6/10 on R&D benchmark. Both paths available.
- **Delight Approval**: Fast path is more delightful per Five Questions test (ELEVATED)
- **Implementation**:
  - New "Express" intake flow: Step 1 (site type) → Step 2 (business name + description, combined) → Generate (deterministic path, $0 cost)
  - Keep full 9-step path available as "Deep Brand Capture" mode (toggle at start)
  - Time target: under 90 seconds from first click to preview
  - Loading screen shortened (deterministic = 2-5 seconds)
- **Files to modify**:
  - `src/app/demo/page.tsx` — add express/deep mode toggle, 2-step express flow
  - `convex/ai/generateSiteSpec.ts` — ensure deterministic path produces quality output with minimal inputs
  - `src/lib/stores/intake-store.ts` — support express mode (skip Steps 4-8)
- **KPI**: Time-to-preview <90 seconds; completion rate >80% (vs current estimated 40-60%)
- **Timeline**: Week 1-2

#### Priority 2: Immersive Preview Reveal + Progressive Disclosure

- **Champion**: Partnerships (Elena) + Delight Champion, endorsed by UX Psych
- **Opponent**: Competitive (James) — wants controls visible faster
- **Resolution**: 3-5 second immersive reveal, then sidebar slides in. Controls progressively disclosed.
- **Delight Approval**: The reveal moment is sacred (P0 condition)
- **Implementation**:
  - Full-screen site preview on load (sidebar hidden, toolbar minimal)
  - 3-5 second celebration moment: subtle confetti/sparkle + "Your website is ready" overlay
  - Sidebar slides in after celebration with "Customize" label
  - Dev panel hidden by default (Ctrl+Shift+D only)
  - A/B variant toggle moved into sidebar, not toolbar
  - Mobile: same pattern — full-screen preview → bottom sheet CTA after 3 seconds
- **Files to modify**:
  - `src/app/demo/preview/page.tsx` — add reveal animation, delayed sidebar, simplified toolbar
  - `src/components/platform/preview/PreviewToolbar.tsx` — minimize to essentials
  - `src/components/platform/preview/CustomizationSidebar.tsx` — add reveal animation
- **KPI**: Time-on-preview-page >60 seconds (engagement); screenshot rate >5%
- **Timeline**: Week 2-3 (after express path ships)

#### Priority 3: Post-Generation Character Capture (Progressive Personalization)

- **Champion**: Product (Amara) + UX Psych (Dr. Sato)
- **Opponent**: None (consensus on concept)
- **Resolution**: Character capture moves to customization sidebar as "Brand Discovery" section. Each answer triggers visible site transformation.
- **Delight Approval**: "Make it even better" framing, not "you're missing features"
- **Implementation**:
  - New sidebar section: "Discover Your Brand" — emotional goals, voice detection, archetype picker
  - Each selection triggers PostMessage theme/content update to iframe
  - Emotional goals → color palette shift (visible immediately)
  - Voice selection → headline/CTA rewrite (visible immediately)
  - Archetype → layout/component adjustments (visible with transition)
  - Progressive UI: sections unlock as user engages (emotional goals first, then voice, then archetype)
  - Uses same credit system as AI Design Chat (1 free refinement, unlimited Pro)
- **Files to create/modify**:
  - New: `src/components/platform/preview/BrandDiscovery.tsx` — character capture in sidebar
  - `src/app/demo/preview/page.tsx` — integrate Brand Discovery, wire PostMessage updates
  - `src/app/demo/preview/render/page.tsx` — handle incremental theme/content updates
  - `convex/ai/generateSiteSpec.ts` — support partial regeneration from character data
- **KPI**: % of users who engage with Brand Discovery; quality score difference (fast vs personalized)
- **Timeline**: Week 3-5

### Risk Table

| Risk                                                 | Raised By        | Severity | Mitigation                                                         |
| ---------------------------------------------------- | ---------------- | -------- | ------------------------------------------------------------------ |
| Fast-path output too generic                         | Product          | High     | R&D benchmark quality gate; Delight Champion veto at <6/10         |
| Express path kills character capture engagement      | Monetization     | Medium   | Position as premium depth; visible quality difference incentivizes |
| Users never personalize (fast path is "good enough") | Product          | Medium   | Measure engagement; make transformation visually dramatic          |
| Two paths = maintenance burden                       | Infra            | Low      | Express is subset of full path, not a fork — same codebase         |
| Competitor benchmark shows we're still slower        | Competitive      | Medium   | Deterministic path should be <5 seconds; if not, optimize          |
| Brand Discovery sidebar too complex                  | UX Psych         | Medium   | Progressive disclosure; unlock sections sequentially               |
| Reveal animation feels gimmicky                      | Delight Champion | Low      | Subtle, brief (3 seconds), skippable on click                      |

### Consensus Points

1. **Our ONE core action**: "Describe your business → see your website" (unanimous)
2. **Speed must match competitors**: Under 90 seconds to first preview (unanimous)
3. **Character capture remains our moat**: But moves to post-generation, not pre-generation (8/10, Product dissents pending data)
4. **The preview reveal is sacred**: Full-screen immersive first, controls second (unanimous)
5. **Quality gate required**: Fast-path output must score >6/10 on R&D benchmark before launch (unanimous)
6. **Both paths coexist**: Express (default) and Deep (optional), not one replacing the other (unanimous)
7. **Progressive personalization**: Character capture as "enrichment" not "requirement" (unanimous)
8. **Journey restructured, not eliminated**: P7 preserved — the journey IS the customization experience (unanimous)

### Unresolved Tensions

| ID        | Tension                                      | Parties                                                    | Status                                                          | Trigger to Revisit                           |
| --------- | -------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------- |
| UT-003-01 | Character capture as free vs Pro feature     | Monetization (Pro) vs CMO (free)                           | Decided: UI free, AI refinement uses credit system. NEEDS_DATA  | Post-launch engagement data                  |
| UT-003-02 | Demo gallery on homepage vs direct fast path | CMO (gallery first) vs CEO (fast path first)               | Decided: fast path first. Gallery deferred. NEEDS_DATA          | After fast path ships, measure conversion    |
| UT-003-03 | Optimal express-path input count             | CRO (2 fields) vs Product (3 fields: type + name + desc)   | Decided: 3 fields. NEEDS_DATA                                   | A/B test completion rate                     |
| UT-003-04 | Personality slider redesign vs removal       | Product (redesign as mood picker) vs CRO (remove entirely) | Decided: available in Deep mode and Brand Discovery. NEEDS_DATA | R&D benchmark: quality with vs without       |
| UT-002-03 | Should intake be shortened?                  | CRO (yes) vs Product (prove it first)                      | EVOLVING — this session's express path IS the shortened intake  | R&D quality benchmark results (fast vs full) |

### Implementation Sequence

| Week | Focus                       | Actions                                                                                             |
| ---- | --------------------------- | --------------------------------------------------------------------------------------------------- |
| 1    | Express Path Foundation     | Build 2-step express intake flow; wire to deterministic generation; skip Steps 4-8                  |
| 1-2  | Express Path Polish         | Loading screen for deterministic (2-5s); auto-redirect to preview; mode toggle (express/deep)       |
| 2    | Preview Reveal              | Full-screen immersive reveal; delayed sidebar; minimal toolbar; celebration moment                  |
| 2-3  | Quality Gate                | Run R&D benchmark on fast-path output (20 sites); score against references; Delight Champion review |
| 3-4  | Brand Discovery Sidebar     | Emotional goals, voice detection, archetype in sidebar; PostMessage live updates                    |
| 4-5  | Progressive Personalization | Each Brand Discovery answer triggers visible site transformation; incremental regeneration          |
| 5-6  | A/B Measurement             | Track express vs deep engagement; quality score comparison; conversion rate comparison              |

### Relationship to Existing Decisions

| Decision                         | Impact                                                                             |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| BD-001-01 (Customization Panel)  | COMPLETED — express path doesn't change this                                       |
| BD-001-04 (Guided Customization) | EVOLVES — Brand Discovery is the guided customization, now post-generation         |
| BD-003-01 (Pricing Tiers)        | COMPATIBLE — free tier gains express path; Pro gains deeper AI Brand Capture       |
| BD-003-02 (R&D Benchmark)        | CRITICAL — must validate fast-path quality before launch                           |
| BD-003-03 (Distribution)         | AMPLIFIED — express path makes sharing easier (60-second demo = better viral loop) |
| BD-003-04 (AI Design Chat)       | COMPATIBLE — Brand Discovery uses same credit system                               |

### Strategic Principle Reconciliation

| Principle                       | Alignment                                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| P0 (People Must Love It)        | EXPRESS PATH more delightful per Five Questions test (Delight Champion ELEVATED approval) |
| P1 (Revenue Validates)          | Express path → more top-of-funnel → more potential conversions                            |
| P2 (Intelligence Is Moat)       | Preserved — character capture moves to post-generation, not removed                       |
| P3 (User Owns Feeling)          | Strengthened — users customize something that exists, not imagine something hypothetical  |
| P4 (Zero-Marginal-Cost)         | Improved — deterministic fast path costs $0 per generation                                |
| P5 (Ship Simplest)              | ALIGNED — express path is simpler                                                         |
| P6 (Integration Over Invention) | No impact                                                                                 |
| P7 (Journey Is Product)         | RESTRUCTURED — journey is now post-generation customization, not pre-generation survey    |
| P8 (Past Decisions Respected)   | Reconciliation documented above                                                           |
