# Epics & User Stories — Output Quality Overhaul

> **Generated:** February 2026
> **Context:** Post-analysis of "LuxuryFine Mexican Restaurant" test case
> **Scope:** 6 tiers of work to fix content fidelity, visual character, feedback loops, intake, anti-references, and dev tooling

---

## Progress Tracker

> **Last updated:** 2026-02-10
> **Stories shipped:** 30/33 (91%) — 0 active remaining, 3 deferred

| Story    | Title                                       | Status     | Commit    |
| -------- | ------------------------------------------- | ---------- | --------- |
| T1-E1-S1 | AI Prompt: User's Own Words                 | ✅ Done    | `afbc34d` |
| T1-E1-S2 | AI Prompt: Business Sub-Type Vocabulary     | ✅ Done    | `afbc34d` |
| T1-E1-S3 | Business-Type-Aware Nav Labels              | ✅ Done    | `afbc34d` |
| T1-E1-S4 | Sub-Type Deterministic Content (3 types)    | ✅ Done    | `afbc34d` |
| T1-E1-S5 | Narrative Prompts in Deterministic Fallback | ✅ Done    | `afbc34d` |
| T1-E1-S6 | Business-Specific CTAs                      | ✅ Done    | `038d47f` |
| T1-E1-S7 | Business-Sub-Type Discovery Questions       | ✅ Done    | `afbc34d` |
| T1-E2-S1 | Content Validator (safety net)              | ✅ Done    | `fb1098d` |
| T1-E2-S2 | Auto-Fix Mismatches                         | ✅ Done    | —         |
| T2-E1-S1 | Business Type in Theme Generator            | ✅ Done    | `afbc34d` |
| T2-E1-S2 | Industry Color Association Hue Shifting     | ✅ Done    | `afbc34d` |
| T2-E1-S3 | Emotional Goals Influence Colors            | ✅ Done    | `afbc34d` |
| T2-E1-S4 | Dark/Light Mode Business Bias               | ✅ Done    | `038d47f` |
| T2-E2-S1 | Business-Aware Font Selection               | ✅ Done    | `038d47f` |
| T2-E2-S2 | Business-Aware Variant Selection            | ✅ Done    | `038d47f` |
| T3-E1-S1 | Screenshot Capture                          | ✅ Done    | —         |
| T3-E1-S2 | VLM Evaluation                              | ✅ Done    | —         |
| T3-E1-S3 | Feedback → Adjustments                      | ✅ Done    | —         |
| T3-E2-S1 | Quick Satisfaction Rating                   | ✅ Done    | —         |
| T3-E2-S2 | Pipeline Session Logging                    | ✅ Done    | `fb1098d` |
| T4-E1-S1 | Curate Mood Board Images                    | ⏸ Deferred | —         |
| T4-E1-S2 | Mood Board Selection Step                   | ⏸ Deferred | —         |
| T4-E2-S1 | Visual Reference URL Input                  | ⏸ Deferred | —         |
| T4-E3-S1 | A/B Theme Variant Toggle                    | ✅ Done    | —         |
| T5-E1-S1 | Anti-Reference Redesign                     | ✅ Done    | —         |
| T5-E1-S2 | Business-Specific Anti-Refs                 | ✅ Done    | —         |
| T6-E1-S1 | Dev Panel UI Shell                          | ✅ Done    | `fb1098d` |
| T6-E1-S2 | Dev Panel: Intake Tab                       | ✅ Done    | `fb1098d` |
| T6-E1-S3 | Dev Panel: Prompt & AI Response Tab         | ✅ Done    | `fb1098d` |
| T6-E1-S4 | Dev Panel: Theme Tab                        | ✅ Done    | —         |
| T6-E1-S5 | Dev Panel: Validation Tab                   | ✅ Done    | `fb1098d` |
| T6-E2-S1 | Named Test Cases                            | ✅ Done    | —         |
| T6-E2-S2 | Side-by-Side Comparison                     | ✅ Done    | —         |

### Shipping Log

- **`afbc34d`** — T1-E1 (S1-S5, S7) + T2-E1 (S1-S3): Industry-aware content, theme hues, emotional color overrides
- **`038d47f`** — T1-E1-S6 + T2-E1-S4 + T2-E2 (S1-S2): Sub-type-aware variants, CTAs, font pairings, dark mode bias
- **`fb1098d`** — T1-E2-S1 + T3-E2-S2 + T6-E1 (S1-S3, S5): Content validator, pipeline logging, dev panel with populated tabs
- **`be702c4`** — T1-E2-S2 + T4-E3-S1 + T3-E2-S1: Auto-fix, A/B theme variants, feedback banner
- **(pending)** — T3-E1 (S1-S3): Screenshot capture (html2canvas + Playwright), Claude Vision evaluation, VLM feedback → theme adjustments

---

## How to Read This Document

Each epic follows this structure:

- **Epic ID** (T1-E1 = Tier 1, Epic 1)
- **Title & Description**
- **User Stories** with acceptance criteria
- **Technical Notes** pointing to specific files and functions
- **Dependencies** (what must exist first)
- **Scope** (S = 1-2 days, M = 3-5 days, L = 1-2 weeks, XL = 2-4 weeks)
- **Cost Tier** — `hook-safe` (cheap per session) vs `full-product` (expensive AI calls)
- **Validation** — Can this be tested with the LuxuryFine Mexican Restaurant case?

---

# TIER 1: Content Fidelity (Fix what's broken)

## T1-E1: AI-First Content Generation for All User-Facing Copy

**Description:** Move ALL user-facing website text (headlines, descriptions, CTAs, FAQ, testimonials, team bios, section labels) to AI generation conditioned on the full intake context. The deterministic fallback should become a structural skeleton only — choosing WHICH components to include and in what order — while ALL copy comes from AI or, in fallback, from much more granular business-type-specific templates.

**Why this is the #1 priority:** The current deterministic fallback produces "Services & Treatments" for a fine dining restaurant. The AI prompt is better but doesn't emphasize using the user's own words. Both paths need an overhaul.

### T1-E1-S1: Restructure AI Prompt to Emphasize User's Own Words ✅

**Story:** As the AI spec generator, I should produce copy that incorporates the user's actual language from intake — their description, narrative prompts, and discovery answers — so the generated site feels like THEIR website, not a template.

**Acceptance Criteria:**

- [ ] AI prompt system message includes explicit instruction: "The user said: [their description]. Use their exact phrases where appropriate."
- [ ] Narrative prompts (come_because, frustrated_with, after_feel) are injected as PRIORITY copy source material, not just context
- [ ] Discovery question responses are passed as key phrases to weave into copy
- [ ] When the user writes "People come to us because they want fine dining from the heart of Mexico" → at least one headline/subheadline/about section echoes "fine dining from the heart of Mexico"
- [ ] AI prompt includes negative examples: "NEVER use generic phrases like 'Building something remarkable together' or 'Services & Treatments' for a restaurant"

**Technical Notes:**

- File: `convex/ai/generateSiteSpec.ts`, lines 1449-1575 (the AI prompt construction)
- The narrative prompts are already passed (lines 1436-1442) but as optional context, not priority material
- Add a `USER'S OWN WORDS` section to the system prompt with extracted key phrases
- Discovery responses (aiResponsesSummary, line 1386) are passed but buried — promote them

**Dependencies:** None — can start immediately
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (same single AI call, just better prompt)
**LuxuryFine Validation:** Yes — output should contain "fine dining", "heart of Mexico", "Chihuahuan cuisine"

---

### T1-E1-S2: Add Business Sub-Type Awareness to AI Prompt ✅

**Story:** As the AI spec generator, I should understand that "booking" covers restaurants, spas, salons, clinics, and studios — and generate content vocabulary appropriate to the specific sub-type, not generic booking language.

**Acceptance Criteria:**

- [ ] AI prompt includes instruction to infer business sub-type from description and site type
- [ ] For a restaurant: uses "Menu" not "Services", "Reservations" not "Appointments", "Chef" not "CEO", "Dishes" not "Sessions"
- [ ] For a spa: uses "Treatments", "Book Your Session", "Therapist"
- [ ] For a salon: uses "Styles", "Book Your Cut", "Stylist"
- [ ] Prompt includes a business-vocabulary mapping section for the top 15 business sub-types
- [ ] Team member roles match the actual business (Chef, Sous Chef, Sommelier for restaurant)

**Technical Notes:**

- File: `convex/ai/generateSiteSpec.ts` — add a BUSINESS VOCABULARY section to the system prompt
- The AI should be told: "Based on the description, this is a [restaurant/spa/salon/etc]. Use industry-specific vocabulary throughout."
- Add explicit vocabulary tables for: restaurant, spa, salon, gym/fitness, clinic/medical, photography studio, law firm, accounting firm, real estate, consulting, barbershop, dental, veterinary, auto repair, architecture firm

**Dependencies:** None — can start in parallel with T1-E1-S1
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (same AI call, better prompt)
**LuxuryFine Validation:** Yes — should see "Reserve a Table", "View Our Menu", "Executive Chef"

---

### T1-E1-S3: Business-Type-Aware Navigation Labels ✅

**Story:** As a business owner viewing my generated website, the navigation links should use labels that match my industry, not generic defaults.

**Acceptance Criteria:**

- [ ] Restaurant: "Home | Menu | About | Reservations" (not "Home | About | Services | Contact")
- [ ] Spa/Salon: "Home | Services | About | Book Now"
- [ ] Portfolio/Photography: "Home | Portfolio | About | Contact"
- [ ] Law Firm: "Home | Practice Areas | Attorneys | Contact"
- [ ] E-commerce: "Home | Shop | About | Cart"
- [ ] This mapping exists as a deterministic lookup (not AI-generated) for reliability
- [ ] AI prompt also receives this mapping so AI-generated specs use the same labels
- [ ] Footer column titles match nav labels

**Technical Notes:**

- File: `convex/ai/generateSiteSpec.ts`, lines 679-693 (nav component in deterministic fallback)
- Currently hardcoded: `{ label: "Home" }, { label: "About" }, { label: "Services" }, { label: "Contact" }`
- Create new function: `getNavLinksForBusinessType(siteType: string, description: string): NavLink[]`
- The function should use description keywords to infer sub-type (e.g., description contains "restaurant" or "menu" or "dining" → restaurant nav)
- Also update footer columns (line 877-894) to match

**Dependencies:** None
**Scope:** S (1-2 days)
**Cost Tier:** hook-safe (deterministic)
**LuxuryFine Validation:** Yes — nav should show "Menu" and "Reservations"

---

### T1-E1-S4: Business Sub-Type Inference + Minimal Deterministic Content (Scoped Down) ✅

**Story:** As the deterministic fallback, when AI is unavailable, I should at least produce plausible content for the 3 most common sub-types — not generic spa content for a restaurant. This validates the pattern; additional sub-types are added only if the AI path proves unreliable.

> **Scope decision:** Since all user-facing copy should be AI-generated (see T1-E1-S1/S2), this story is a SAFETY NET for API failures, not the primary content path. Scoped to 3 sub-types (restaurant, spa, photography) to validate the `inferBusinessSubType()` pattern. Expand only if AI fallback rate exceeds ~5% of sessions.

**Acceptance Criteria:**

- [ ] New function: `inferBusinessSubType(siteType: string, description: string): string` — keyword matching from description
- [ ] 3 sub-types implemented: **restaurant**, **spa**, **photography** (covers the most visually distinct business types)
- [ ] Restaurant: "Our Menu" headline, menu-style service items, Chef/Sommelier team roles, "How do I make a reservation?" FAQ
- [ ] Spa: "Our Treatments" headline, treatment service items, Therapist team roles (current booking content is already close)
- [ ] Photography: "Our Work" headline, package-style services, Photographer/Editor team roles
- [ ] Unrecognized sub-types gracefully fall back to current generic content (no regression)
- [ ] `inferBusinessSubType()` is reusable by T1-E1-S3, T1-E1-S6, T2-E1-S2, and T1-E2-S1

**Technical Notes:**

- File: `convex/ai/generateSiteSpec.ts`
- `inferBusinessSubType()` uses keyword sets: restaurant = ["restaurant", "dining", "menu", "chef", "cuisine", "food", "bistro", "cafe"], spa = ["spa", "massage", "wellness", "treatment", "facial"], photography = ["photo", "photographer", "shoot", "portrait", "wedding photo"]
- Functions to update for 3 sub-types: `getServicesForSiteType()`, `getTeamForSiteType()`, `getFaqForSiteType()`, `getServicesHeadline()`, `getServicesEyebrow()`
- Future expansion: add sub-types as data (salon, barbershop, fitness, clinic, consulting) if AI fallback rate warrants it

**Dependencies:** None
**Scope:** S-M (2-3 days) — 3 sub-types, not 8+
**Cost Tier:** hook-safe (deterministic, no AI)
**LuxuryFine Validation:** Yes — deterministic output should show restaurant-appropriate content

---

### T1-E1-S5: Weave Narrative Prompts into Deterministic Fallback ✅

**Story:** As the deterministic fallback, I should use the user's narrative prompt answers (come_because, frustrated_with, after_feel) in generated copy — not ignore them entirely.

**Acceptance Criteria:**

- [ ] If `come_because` is provided, it appears in the hero subheadline or about section body
- [ ] If `frustrated_with` is provided, it informs a "We're Different" or FAQ section
- [ ] If `after_feel` is provided, it appears in testimonials or CTA subheadlines
- [ ] The user's exact words appear in quotes or paraphrased, not discarded
- [ ] When user says "People come to us because they want fine dining from the heart of Mexico" → the about body contains this phrase

**Technical Notes:**

- File: `convex/ai/generateSiteSpec.ts`, `generateDeterministicSpec()` function (line 643)
- Currently `args.narrativePrompts` is accepted but NEVER USED in the deterministic path
- The `industry.aboutBody()` function (line 109) doesn't receive narrative prompts
- Modify `aboutBody` signature to accept narrative prompts
- Add narrative-derived headline variant: if come_because exists, use it as hero subheadline instead of generic tagline

**Dependencies:** None
**Scope:** S (1-2 days)
**Cost Tier:** hook-safe (deterministic)
**LuxuryFine Validation:** Yes — "fine dining from the heart of Mexico" should appear somewhere

---

### T1-E1-S6: CTA Text Must Match Business Context ✅

**Story:** As a business owner, CTAs on my website should use language appropriate to my business — "Reserve a Table" for a restaurant, not "Schedule a Consultation."

**Acceptance Criteria:**

- [ ] `getVoiceKeyedCtaText()` accepts business sub-type as an additional parameter
- [ ] Restaurant + polished: "Reserve Your Table" (not "Schedule a Consultation")
- [ ] Restaurant + warm: "Come dine with us" (not "Let's chat")
- [ ] Restaurant + direct: "Book a table" (not "Get in touch")
- [ ] Spa + polished: "Book Your Treatment"
- [ ] Photography + polished: "Book Your Session"
- [ ] The `getCtaHeadline()` function also uses sub-type: "Reserve Your Table Tonight" instead of "Book Your Appointment Today"
- [ ] Contact form headline adapts: "Make a Reservation" for restaurants, "Book Your Appointment" for spas

**Technical Notes:**

- File: `convex/ai/generateSiteSpec.ts`
- Functions: `getVoiceKeyedCtaText()` (line 978), `getCtaHeadline()` (line 1062)
- Add sub-type parameter and sub-type-specific CTA maps
- This is a natural extension of the `inferBusinessSubType()` function from T1-E1-S4

**Dependencies:** T1-E1-S4 (needs inferBusinessSubType)
**Scope:** S (1-2 days)
**Cost Tier:** hook-safe (deterministic)
**LuxuryFine Validation:** Yes — CTAs should say "Reserve a Table" or similar

---

### T1-E1-S7: Business-Sub-Type-Aware Discovery Questions ✅

**Story:** As the discovery question generator (Step 8), I should ask questions tailored to the user's specific business sub-type — "What signature dishes define your menu?" for a restaurant, not "What services do you offer?" — so the AI spec generator receives better raw material to work with.

**Why this matters:** Discovery questions feed directly into spec generation. Better questions → better answers → better AI-generated copy. This is a small change with outsized downstream impact because it improves the INPUT to the most expensive pipeline stage.

**Acceptance Criteria:**

- [ ] AI prompt for `generateQuestions` includes inferred business sub-type context: "This is a [fine dining restaurant], not just a generic 'booking' business"
- [ ] Prompt instructs Claude to ask sub-type-specific questions: menu details for restaurants, treatment specialties for spas, portfolio style for photographers
- [ ] Restaurant example: "What signature dishes or cuisine styles define your menu?" instead of "What services do you offer?"
- [ ] Spa example: "What treatments are you most known for?" instead of "What services do you offer?"
- [ ] The deterministic fallback question bank gets 2-3 sub-type-specific questions for each of the 3 sub-types (restaurant, spa, photography) — replacing generic alternatives
- [ ] Existing fallback questions for unrecognized sub-types remain unchanged (no regression)

**Technical Notes:**

- File: `convex/ai/generateQuestions.ts`
- The AI prompt already receives description — add explicit sub-type inference: "Based on the description, this is specifically a [restaurant/spa/photography studio]. Ask questions specific to this business type."
- For the deterministic fallback `FALLBACK_QUESTIONS` map: add `booking-restaurant`, `booking-spa`, `booking-photography` keys alongside the existing `booking` key
- Use `inferBusinessSubType()` from T1-E1-S4 to select the right fallback question set
- Small change: ~50 lines of prompt enhancement + ~30 lines of fallback questions per sub-type

**Dependencies:** T1-E1-S4 (needs inferBusinessSubType — though the AI prompt change can be done independently by passing description context)
**Scope:** S (1-2 days)
**Cost Tier:** hook-safe (same AI call for questions, just better prompt)
**LuxuryFine Validation:** Yes — discovery step should ask about cuisine, menu, dining experience instead of generic service questions

---

## T1-E2: Content Validation Layer

**Description:** Add a lightweight validation pass that catches obvious content mismatches before the spec reaches the renderer — a safety net for both AI and deterministic paths.

> **Maintenance warning:** This validator requires keyword blacklists/whitelists per business sub-type. Every new sub-type needs lists updated. As the AI path improves, the validator catches fewer issues but still needs maintenance. This should be treated as a SAFETY NET, not the primary quality mechanism. Keep the rule set deliberately small and high-confidence — catch "appointment" on a restaurant, not subtle tone mismatches. If the AI path achieves >95% content accuracy, consider deprecating the auto-fix (T1-E2-S2) and keeping only the diagnostic warnings for dev tooling.

### T1-E2-S1: Build Content Validator Function ✅

**Story:** As the spec generation pipeline, after producing a SiteIntentDocument, I should run a validation pass that flags obvious content/business-type mismatches.

**Acceptance Criteria:**

- [ ] New function: `validateSpecContent(spec: SiteIntentDocument, intakeData: IntakeContext): ValidationResult`
- [ ] Checks for generic placeholder text ("Building something remarkable together", "Services & Treatments" for non-spa businesses)
- [ ] Checks that business name appears in nav logoText, footer logoText, and at least one headline
- [ ] Checks that CTA text doesn't contain inappropriate vocabulary (e.g., "appointment" for restaurant, "menu" for law firm)
- [ ] Returns array of warnings with severity (error vs warning) and component reference
- [ ] Validation runs on both AI and deterministic spec output
- [ ] Does NOT block generation — just logs warnings for dev tooling (Tier 6)

**Technical Notes:**

- New file: `convex/ai/validate-spec.ts` or `src/lib/assembly/validate-spec.ts`
- Build keyword blacklists per business sub-type: restaurant should NOT contain ["appointment", "session", "treatment", "CEO", "Creative Director"]
- Build keyword whitelists: restaurant SHOULD contain at least one of ["menu", "dine", "table", "reservation", "chef", "cuisine"]
- Log warnings to console for now; Tier 6 will surface them in dev panel

**Dependencies:** T1-E1-S4 (needs inferBusinessSubType for vocabulary lists)
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (deterministic, no AI)
**LuxuryFine Validation:** Yes — should flag "Services & Treatments" and "Founder & CEO" as mismatches

---

### T1-E2-S2: Auto-Fix Common Content Mismatches

**Story:** As the content validator, when I detect high-confidence mismatches (e.g., "appointment" vocabulary on a restaurant site), I should auto-correct them using the business sub-type vocabulary mapping.

**Acceptance Criteria:**

- [ ] Validator can apply auto-fixes for vocabulary swaps: "appointment" → "reservation" for restaurants
- [ ] Auto-fix replaces generic section headlines: "Services & Treatments" → "Our Menu" for restaurants
- [ ] Auto-fix replaces team roles: "Founder & CEO" → "Executive Chef" for restaurants (when role is generic)
- [ ] Auto-fixes are opt-in (function returns both original and corrected spec)
- [ ] A log of applied auto-fixes is included in the validation result

**Dependencies:** T1-E2-S1
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (deterministic)
**LuxuryFine Validation:** Yes — should auto-correct "Services & Treatments" → "Our Menu"

---

# TIER 2: Visual Character Accuracy

## T2-E1: Business-Type-Aware Theme Generation

**Description:** The current `generateThemeFromVector()` maps personality to colors with zero business-type awareness. A "warm + serious + classic" restaurant gets the same palette as a "warm + serious + classic" law firm. This epic adds business-type conditioning to theme generation.

### T2-E1-S1: Add Business Type + Emotional Goals to Theme Generator Signature ✅

**Story:** As the theme generation system, I should accept business type and emotional goals as inputs alongside the personality vector, so I can produce color palettes that are contextually appropriate.

**Acceptance Criteria:**

- [ ] `generateThemeFromVector()` accepts new optional params: `businessType?: string`, `emotionalGoals?: string[]`, `description?: string`
- [ ] When no business type is provided, behavior is identical to current (backward compatible)
- [ ] New type: `ThemeGenerationContext` with all optional fields
- [ ] `AssemblyRenderer` passes business type and emotional goals to the theme generator
- [ ] All existing call sites still work without changes

**Technical Notes:**

- File: `src/lib/theme/generate-theme.ts`
- Current signature: `generateThemeFromVector(pv: PersonalityVector, options?: GenerateThemeOptions)`
- Expand `GenerateThemeOptions` to include `businessType`, `emotionalGoals`, `description`
- File: `src/lib/assembly/AssemblyRenderer.tsx` — currently calls `generateThemeFromVector(spec.personalityVector)` — add context
- File: `src/lib/export/generate-project.ts`, line 25 — also needs updating

**Dependencies:** None
**Scope:** S (1-2 days)
**Cost Tier:** hook-safe (deterministic)
**LuxuryFine Validation:** Yes — should see different output when business type is "restaurant"

---

### T2-E1-S2: Industry Color Association Hue Shifting ✅

**Story:** As the theme generator, when I know the business type is "restaurant" and the emotional goal is "luxury," I should bias the seed hue toward warm, appetizing tones (terracotta, burgundy, deep gold) instead of using only the warm/cool personality axis.

**Acceptance Criteria:**

- [ ] New function: `getIndustryHueBias(businessType: string, emotionalGoals: string[], description: string): { hueRange: [number, number], saturationBoost: number, notes: string }`
- [ ] Restaurant/food: hue biased toward 0-40 (red-orange-gold) or 350-360 (deep red)
- [ ] Restaurant + luxury: deeper, richer saturation; gold/burgundy emphasis
- [ ] Tech/SaaS: hue biased toward 200-260 (blue-indigo)
- [ ] Wellness/spa: hue biased toward 120-170 (green-teal)
- [ ] Law/finance: hue biased toward 210-240 (navy-blue) or 40-50 (gold)
- [ ] Creative/design: wider hue range, higher saturation
- [ ] The bias is a NUDGE, not an override — personality vector still has influence
- [ ] Description keywords further refine: "Mexican" + restaurant → warmer earth tones than "Japanese" + restaurant

**Technical Notes:**

- File: `src/lib/theme/generate-theme.ts`, `generatePalette()` function (line 134)
- Currently: `const hue = seedHue ?? lerp(30, 220, warmCool);` — this is the problem line
- New approach: compute `industryBias`, then blend: `hue = seedHue ?? lerp(industryBias.hueRange[0], industryBias.hueRange[1], warmCool)`
- Keep the warmCool axis as a MODIFIER within the industry-appropriate range
- For "LuxuryFine Mexican Restaurant" with warm temp: hue should land around 15-35 (terracotta/deep gold), not 120+ (green) or 220+ (blue)

**Dependencies:** T2-E1-S1 (needs business type in signature)
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (deterministic)
**LuxuryFine Validation:** Yes — palette should shift from acid-yellow-on-charcoal to warm terracotta/gold/burgundy

---

### T2-E1-S3: Emotional Goals Influence Color Palette ✅

**Story:** As the emotional override system, I should adjust the actual color palette (not just spacing and transitions) based on emotional goals.

**Acceptance Criteria:**

- [ ] "Luxury" emotional goal: deepens primary color, increases contrast between bg and surface, gold/amber accent bias
- [ ] "Calm" emotional goal: reduces saturation by 10-15%, shifts toward muted tones
- [ ] "Energized" emotional goal: increases saturation by 10%, brighter accents
- [ ] "Playful" emotional goal: brighter, more saturated palette, wider hue contrast between primary/secondary
- [ ] "Authoritative" emotional goal: deeper, darker primary; navy/charcoal bias; higher contrast
- [ ] "Trust" emotional goal: shifts toward blue tones (blue = trust in color psychology)
- [ ] "Welcomed" emotional goal: warmer neutrals (cream/warm white backgrounds instead of cool white)
- [ ] Color adjustments use chroma-js for perceptually uniform manipulation

**Technical Notes:**

- File: `src/lib/theme/emotional-overrides.ts`
- Currently this file ONLY adjusts spacing, transitions, radius, and animation — never colors
- Need to import chroma-js and add color manipulation
- For luxury: `tokens.colorPrimary = chroma(tokens.colorPrimary).darken(0.3).saturate(0.2).hex()`
- For calm: `tokens.colorPrimary = chroma(tokens.colorPrimary).desaturate(0.2).hex()`
- Be careful with contrast ratios — after adjusting, verify WCAG AA compliance for text-on-primary

**Dependencies:** None (can work with current emotional-overrides.ts)
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (deterministic, uses chroma-js already in deps)
**LuxuryFine Validation:** Yes — luxury + inspiration should produce richer, deeper colors

---

### T2-E1-S4: Dark/Light Mode Decision Informed by Business Type ✅

**Story:** As the theme generator, my dark/light mode decision should consider business type alongside the lightBold axis — a fine dining restaurant with "luxury" goals should lean dark even at moderate lightBold values.

**Acceptance Criteria:**

- [ ] Fine dining restaurant + luxury: dark mode threshold lowered (isDark at lightBold >= 0.45 instead of 0.6)
- [ ] Tech/SaaS: slightly more likely to be dark (lightBold >= 0.55)
- [ ] Wellness/organic: bias toward light mode (lightBold >= 0.7)
- [ ] Law/finance: bias toward light mode with dark accents
- [ ] Business type adjusts the isDark threshold by ±0.1, emotional goals by ±0.05
- [ ] The personality vector still has primary control — business type is a modifier

**Technical Notes:**

- File: `src/lib/theme/generate-theme.ts`, line 164: `const isDark = lightBold >= 0.6;`
- Add function: `getDarkModeThreshold(businessType?: string, emotionalGoals?: string[]): number`
- Base threshold stays at 0.6, adjusted by business type and emotional goals

**Dependencies:** T2-E1-S1
**Scope:** S (1-2 days)
**Cost Tier:** hook-safe (deterministic)
**LuxuryFine Validation:** Yes — with luxury + warm, the restaurant should get a dark, warm palette (not acid green on black)

---

## T2-E2: Expanded Font Pairing & Variant Selection

### T2-E2-S1: Business-Type-Aware Font Pairing Selection ✅

**Story:** As the font pairing selector, I should consider business type alongside personality axes when choosing fonts — a luxury restaurant should get an elegant serif, while a tech startup should get a clean sans-serif.

**Acceptance Criteria:**

- [ ] `selectFontPairing()` accepts optional `businessType` parameter
- [ ] Restaurant/food + luxury: strong preference for elegant serifs (Cormorant Garamond, Playfair Display)
- [ ] Tech/SaaS: strong preference for geometric sans (Sora, DM Sans, Space Grotesk)
- [ ] Law/finance: strong preference for authoritative serifs (Libre Baskerville) or clean sans (Manrope)
- [ ] Business type adds a scoring bonus (not override) to relevant pairings
- [ ] At least 4 new font pairings added for underserved categories:
  - Hospitality/dining: `"'DM Serif Display', serif"` / `"'Jost', sans-serif"`
  - Wellness/organic: `"'Fraunces', serif"` / `"'Atkinson Hyperlegible', sans-serif"`
  - Creative agency: `"'Clash Display', sans-serif"` / `"'Satoshi', sans-serif"`
  - Boutique/fashion: `"'Bodoni Moda', serif"` / `"'Figtree', sans-serif"`

**Technical Notes:**

- File: `src/lib/theme/generate-theme.ts`, `selectFontPairing()` (line 105) and `FONT_PAIRINGS` array (line 10)
- Add `businessTypes?: string[]` field to each font pairing entry
- Add business-type match bonus to the scoring function
- Google Fonts availability must be verified for new pairings

**Dependencies:** T2-E1-S1
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (deterministic)
**LuxuryFine Validation:** Yes — Cormorant Garamond was actually a good pick; the test validates other business types

---

### T2-E2-S2: Component Variant Selection Informed by Business Type + Character ✅

**Story:** As the deterministic spec generator, my choice of component VARIANTS should consider the business type and brand character — a luxury restaurant should get the "tiered" commerce-services variant (for prix fixe menus), while a casual restaurant should get "card-grid."

**Acceptance Criteria:**

- [ ] Variant selection considers business sub-type, not just personality vector values
- [ ] Luxury + restaurant: hero-centered/gradient-bg (not hero-split), tiered services, cards team grid
- [ ] Photography: hero-split, masonry gallery, minimal team grid
- [ ] Corporate/business: hero-centered, card-grid services, cards team grid
- [ ] Each component's variant selection has a clear decision tree documented as code comments
- [ ] At least 6 component variant selection rules change based on business sub-type

**Technical Notes:**

- File: `convex/ai/generateSiteSpec.ts`, `generateDeterministicSpec()` function
- Currently variant selection uses only personality axis thresholds (e.g., line 668: `personality[0] < 0.5`)
- Add business sub-type as a modifier: `const heroVariant = (isLuxuryRestaurant) ? "gradient-bg" : isMinimal ? "gradient-bg" : "with-bg-image"`
- Component manifests already have `personalityFit` — consider adding `businessTypeFit` to manifests too

**Dependencies:** T1-E1-S4 (needs inferBusinessSubType)
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (deterministic)
**LuxuryFine Validation:** Yes — luxury restaurant should get luxury-appropriate variants

---

# TIER 3: Design Feedback Loop

## T3-E1: Single-Pass VLM Evaluation

**Description:** After generating a site, take a screenshot and evaluate it against the intake intent using Claude Vision. This produces a structured quality score that can eventually drive automated adjustments.

### T3-E1-S1: Screenshot Capture Infrastructure

**Story:** As the preview system, I should be able to capture a screenshot of the generated site preview for use in quality evaluation.

**Status:** ✅ SHIPPED

**Acceptance Criteria:**

- [x] New utility function: `capturePreviewScreenshot(element: HTMLElement): Promise<ScreenshotResult>` using html2canvas (client) + Playwright (server)
- [x] Can capture full-page screenshot at 1280px viewport width (Playwright route supports desktop/tablet/mobile viewports)
- [x] Client capture capped at 4000px height to keep base64 manageable for VLM
- [x] Screenshot is returned as a base64-encoded image (`ScreenshotResult.base64`)
- [x] Hybrid approach: html2canvas for quick client-side capture, Playwright API route for high-quality server-side
- [x] Screenshot capture is triggered by a Camera button in the preview toolbar

**Implementation:**

- `src/lib/screenshot/types.ts` — `ScreenshotResult` type (base64, width, height, captureMethod, capturedAt)
- `src/lib/screenshot/capture-client.ts` — `capturePreviewScreenshot()` using dynamic `html2canvas` import, waits for `document.fonts.ready` + 300ms settle
- `src/app/api/screenshot/route.ts` — Playwright server-side capture, localhost-only security check, viewport selection
- `PreviewToolbar.tsx` — Camera button with `isCapturing` loading state
- `demo/preview/page.tsx` — `previewRef` on DOM container, `handleScreenshot` callback, `lastScreenshot` state

**Dependencies:** None
**Scope:** M (delivered in 1 session)
**Cost Tier:** hook-safe (html2canvas is free; Playwright is dev-only)
**LuxuryFine Validation:** Yes — produces a screenshot for VLM evaluation

---

### T3-E1-S2: VLM Evaluation Prompt & Scoring

**Story:** As the quality evaluation system, I should send a screenshot + intake context to Claude Vision and receive a structured quality assessment.

**Status:** ✅ SHIPPED

**Acceptance Criteria:**

- [x] New Convex action: `evaluateScreenshot` sends screenshot base64 + full business context to Claude Vision
- [x] Claude Vision evaluates on 5 dimensions (1-10 scale each):
  1. **Content Relevance** — Does the text match the business type?
  2. **Visual Character** — Does the design match the emotional goals and personality?
  3. **Color Appropriateness** — Are colors suitable for the industry and brand archetype?
  4. **Typography Fit** — Do fonts match the personality axes and voice profile?
  5. **Overall Cohesion** — Does everything work together as a unified design?
- [x] Response includes per-dimension scores, textual explanations, and suggested adjustments
- [x] Response includes `themeAdjustments` as a `Record<string, string>` mapping ThemeTokens keys to CSS values
- [x] Response is JSON-parseable (markdown fence stripping + validation)
- [x] Deterministic fallback: all dimensions scored 5/10 with "no API key" explanation when `ANTHROPIC_API_KEY` is not set
- [x] Results persisted in Convex `vlmEvaluations` table (sessionId indexed)
- [x] DevPanel VLM tab shows score bars (green 7+, yellow 4-6, red 1-3), explanations, and suggestions

**Implementation:**

- `convex/ai/evaluateScreenshot.ts` — Convex action using `@anthropic-ai/sdk` with Claude Sonnet vision, multimodal message (image + text prompt), structured JSON response
- `convex/vlmEvaluations.ts` — `saveEvaluationInternal` (internalMutation) + `getLatestEvaluation` (query by sessionId)
- `convex/schema.ts` — `vlmEvaluations` table with `by_session` index
- `src/lib/vlm/types.ts` — `DimensionScore`, `VLMEvaluation` types
- `DevPanel.tsx` — VLM tab with Evaluate button, loading state, 5-dimension score visualization, summary, cost note (~$0.03/eval)

**Evaluation prompt includes:**

- Full business context (siteType, businessName, conversionGoal, tagline)
- Personality vector with labeled axes (minimal_rich, playful_serious, warm_cool, light_bold, classic_modern, calm_dynamic)
- Emotional goals, voice profile, brand archetype, anti-references
- Explicit instruction to return `themeAdjustments` as valid ThemeTokens keys with CSS values

**Dependencies:** T3-E1-S1 (screenshot capture)
**Scope:** L (delivered in 1 session)
**Cost Tier:** full-product (~$0.03 per evaluation, on-demand only)
**LuxuryFine Validation:** Yes — scores reveal content/color mismatches with actionable adjustments

---

### T3-E1-S3: Route VLM Feedback to Parameter Adjustments

**Story:** As the feedback routing system, when VLM evaluation identifies specific issues (e.g., "colors too cold for a warm restaurant"), I should map those to concrete parameter adjustments that can be applied.

**Status:** ✅ SHIPPED

**Acceptance Criteria:**

- [x] New function: `mapAdjustmentsToTokenOverrides(rawAdjustments): Partial<ThemeTokens>` — safety filter for VLM suggestions
- [x] Validates keys against all 66 ThemeTokens keys (rejects unknown keys silently)
- [x] Validates hex format for color tokens (`/^#[0-9a-fA-F]{3,8}$/`), passes non-color tokens as-is
- [x] Adjustments are expressed as `Partial<ThemeTokens>` overrides
- [x] System applies adjustments and re-renders without full regeneration (merged into `activeTheme` via `useMemo`)
- [x] "Apply Adjustments" button in DevPanel VLM tab triggers `onApplyAdjustments` callback
- [x] `vlmOverrides` state merges onto active variant theme — instant re-render

**Implementation:**

- `src/lib/vlm/map-adjustments.ts` — `mapAdjustmentsToTokenOverrides()` validates against `VALID_TOKEN_KEYS` set, hex-checks color tokens, returns filtered `Partial<ThemeTokens>`
- `src/lib/vlm/index.ts` — Barrel export for `mapAdjustmentsToTokenOverrides` + types
- `demo/preview/page.tsx` — `vlmOverrides` state, `handleApplyAdjustments` callback using `mapAdjustmentsToTokenOverrides`, `activeTheme` memo merges `{ ...base, ...vlmOverrides }`
- `DevPanel.tsx` — "Apply Adjustments" button (teal, only visible when themeAdjustments has entries), adjustment key/value display with color swatches

**Tests:** 45 tests across 4 files:

- `tests/unit/vlm/map-adjustments.test.ts` — 18 tests (key validation, hex validation, mixed valid/invalid, all 66 keys)
- `tests/unit/vlm/vlm-types.test.ts` — 5 tests (type construction, timestamps)
- `tests/unit/vlm/evaluation-parsing.test.ts` — 19 tests (JSON parsing, fence stripping, validation errors, fallback)
- `tests/unit/screenshot/screenshot-types.test.ts` — 3 tests (client/server capture methods)

**Dependencies:** T3-E1-S2
**Scope:** L (delivered in 1 session)
**Cost Tier:** hook-safe (deterministic mapping, no API calls)
**LuxuryFine Validation:** Yes — VLM suggests color/font adjustments, Apply button fixes them instantly

---

## T3-E2: User Satisfaction Capture

### T3-E2-S1: Quick Satisfaction Rating at Preview

**Story:** As a user viewing my generated site preview, I should be able to give a quick satisfaction rating so the system can learn which outputs work well.

**Acceptance Criteria:**

- [ ] After generation, a non-intrusive prompt appears: "How does this look?" with 3 options: Love it / It's OK / Not right
- [ ] If "Not right" is selected, show 3 follow-up chips: "Wrong colors", "Wrong tone/text", "Missing something", "Other"
- [ ] Rating + optional dimension feedback is saved to Convex
- [ ] Rating is associated with the sessionId and specId
- [ ] Does NOT interrupt the user flow — appears as a floating toast or banner, dismissible

**Technical Notes:**

- New Convex table: `feedback` with fields: sessionId, specId, rating, dimensions, freeText, createdAt
- UI component: `FeedbackBanner.tsx` in `src/components/platform/preview/`
- Appears on `/demo/preview` page after spec loads (with 2-3 second delay)
- Data feeds into Tier 6 dev tooling and eventually into the knowledge base

**Dependencies:** None
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (one Convex mutation)
**LuxuryFine Validation:** Partially — validates the UI, manual data collection

---

### T3-E2-S2: Pipeline Session Logging ✅

**Story:** As the system, I should log the complete pipeline trace for every generation session so developers can diagnose issues and the feedback loop has data to work with.

**Acceptance Criteria:**

- [ ] New Convex table: `pipelineLogs` with fields: sessionId, intakeData (full snapshot), promptSent, rawAiResponse, specGenerated, themeTokens, emotionalOverridesApplied, method ("ai"|"deterministic"), durationMs, createdAt
- [ ] Every `generateSiteSpec` call writes a pipeline log entry
- [ ] Log includes the FULL intake context (not just IDs)
- [ ] Log includes the exact prompt sent to Claude (for prompt engineering iteration)
- [ ] Log includes timing data for each pipeline stage
- [ ] Logs are queryable by sessionId

**Technical Notes:**

- New file: `convex/pipelineLogs.ts` with savePipelineLog mutation + getPipelineLog query
- Update `convex/schema.ts` to add `pipelineLogs` table
- Update `convex/ai/generateSiteSpec.ts` to write logs at the end of both AI and deterministic paths
- Store the raw AI response text before parsing (for debugging)

**Dependencies:** None
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (Convex storage only)
**LuxuryFine Validation:** Yes — can inspect the full pipeline trace for the test case

---

# TIER 4: Intake Flow Improvements

## T4-E1: Visual Mood Board Selection

**Description:** Add a visual A/B mood selection step during intake where users choose between curated aesthetic directions for their business type. This replaces the need for photo uploads (too much friction) while giving the system strong visual direction signals.

> **Status: DEFERRED — Premium Feature Candidate.** T4-E1-S1 (image curation) is the most labor-intensive story in this document for a Tier 4 item. Curating 3 mood board pairs x 6 business types = 36 high-quality images requiring sourcing, licensing verification, optimization, and metadata tagging. This is better suited as a premium feature or a dedicated design sprint, not a developer task. The mood board STEP (T4-E1-S2) has real UX value, but without the curated images it has nothing to show. Revisit after Tiers 1-2 stabilize output quality — if the AI+theme fixes make output consistently good, mood boards become a "nice polish" rather than a "necessary signal."

### T4-E1-S1: Curate Mood Board Image Pairs by Business Type _(DEFERRED)_

**Story:** As the intake system, I need a library of curated mood board images organized by business type and aesthetic direction, so I can present meaningful visual choices to users.

**Acceptance Criteria:**

- [ ] At least 3 mood board pairs per business type for the top 6 site types (business, portfolio, ecommerce, booking, blog, personal)
- [ ] Each pair represents a genuine aesthetic trade-off (e.g., "warm & rustic" vs "clean & modern" for restaurants)
- [ ] Images are lightweight, pre-optimized (max 200KB each), stored in `/public/moods/` or Convex file storage
- [ ] Each image has metadata: `{ businessType, aestheticDirection, colorPalette, mood, description }`
- [ ] Images are sourced from open-license collections (Unsplash, Pexels) — NOT AI-generated

**Technical Notes:**

- New directory: `public/moods/` with subdirectories per site type
- New data file: `src/lib/types/mood-boards.ts` with typed mood board catalog
- Each mood pair should represent a real aesthetic choice that maps to different theme generation parameters
- Example for restaurant: "Rustic Farmhouse" (warm, natural, serif) vs "Modern Fine Dining" (dark, gold, editorial serif)
- Budget consideration: these are static assets, no per-session cost
- **Alternative approach:** Instead of curated photos, consider using CSS gradient/color cards with typography samples as mood swatches — purely generated, zero curation labor. This would be a different story.

**Dependencies:** None
**Scope:** L (1-2 weeks including image curation) — primarily design/curation labor, not engineering
**Cost Tier:** hook-safe (static assets, zero per-session cost)
**LuxuryFine Validation:** Not directly — but the curated restaurant mood boards should include a "luxury fine dining" option

---

### T4-E1-S2: Build Mood Board Selection Step (Intake Step 4.5)

**Story:** As a user going through the intake flow, after describing my business I should see 2-3 visual mood board pairs and pick which aesthetic direction feels more like my brand. This feels like a fun magazine-style quiz, not a form.

**Acceptance Criteria:**

- [ ] New intake step between current Step 4 (personality) and Step 5 (emotional goals)
- [ ] Shows 2-3 image pairs relevant to the user's selected site type
- [ ] Each pair is presented side-by-side with a short label ("Warm & Rustic" vs "Sleek & Modern")
- [ ] User taps/clicks their preferred option for each pair
- [ ] Selections map to personality vector adjustments (e.g., "Warm & Rustic" → warmCool -= 0.15, classic_modern -= 0.1)
- [ ] Selections also influence theme seed hue range
- [ ] Feels like the existing A/B comparison in Step 6 (Voice) — consistent UX pattern
- [ ] Step can be skipped ("I'm not sure" / "Skip this") without blocking progress
- [ ] Total intake flow stays feeling like a quiz, not a survey

**Technical Notes:**

- New component: `src/components/platform/intake/StepMoodBoard.tsx`
- Update `intake-store.ts` to add `moodSelections: Record<string, string>` field
- Update step numbering (this shifts Steps 5-9 → Steps 6-10, OR insert between 4-5 as Step 4.5 and renumber)
- IMPORTANT: Consider whether to renumber all steps or use fractional indexing — renumbering is cleaner but touches more code
- The mood selection → personality adjustment mapping should be deterministic and documented

**Dependencies:** T4-E1-S1 (needs curated images)
**Scope:** L (1-2 weeks)
**Cost Tier:** hook-safe (no AI, static images)
**LuxuryFine Validation:** Partially — can validate that selecting a luxury mood board changes theme output

---

## T4-E2: Optional Visual Reference Input

### T4-E2-S1: "Show Us a Site You Love" Optional URL Input

**Story:** As a user during intake, I should optionally be able to paste a URL of a website I admire, which the system uses as a visual reference to inform theme generation.

**Acceptance Criteria:**

- [ ] Optional field in the mood board step or a separate mini-step: "Want to show us a site you love?" with a URL input
- [ ] Pasting a URL triggers a screenshot capture (using the same infrastructure as T3-E1-S1)
- [ ] Screenshot is analyzed by Claude Vision to extract: dominant colors, typography style, spacing density, overall mood
- [ ] Extracted features map to personality vector adjustments and seed hue preferences
- [ ] This is clearly OPTIONAL — the step works perfectly without it
- [ ] If the user provides a URL, show a small thumbnail of the captured screenshot as confirmation
- [ ] Rate-limit: max 1 URL per session to control API costs

**Technical Notes:**

- Reuses screenshot capture from T3-E1-S1
- New VLM prompt: "Analyze this website screenshot and extract: dominant hue (0-360), saturation level (low/medium/high), is it dark mode, spacing density (minimal/moderate/rich), typography era (classic/modern), overall mood (professional/playful/luxurious/casual/bold)"
- Map extracted features to personality vector deltas
- Store the reference URL and extracted features in the intake store

**Dependencies:** T3-E1-S1 (screenshot capture), T4-E1-S2 (mood board step for placement)
**Scope:** L (1-2 weeks)
**Cost Tier:** full-product (AI vision call per URL submission)
**LuxuryFine Validation:** Yes — pasting a luxury restaurant URL should influence the output palette

---

## T4-E3: A/B Variant Presentation at Preview

### T4-E3-S1: Generate Two Theme Variations for User Choice

**Story:** As a user viewing my generated site, I should be able to toggle between 2 theme variations (different color palettes/fonts generated from the same personality vector with different seeds) and pick the one I prefer.

**Acceptance Criteria:**

- [ ] After generation, produce 2 theme variants: one with the default seed, one with a shifted seed (±30-60 hue degrees, or light/dark mode flip)
- [ ] Preview toolbar shows "Variant A" / "Variant B" toggle
- [ ] Switching variants re-renders the preview with the alternate theme tokens (no re-generation of content)
- [ ] User's selected variant becomes the "final" theme for export
- [ ] Variant generation is deterministic (no additional AI calls)
- [ ] If the user hasn't given strong signals (all personality at 0.5), the two variants should be MORE different; if signals are strong, variants should be subtle variations

**Technical Notes:**

- File: `src/lib/assembly/AssemblyRenderer.tsx` — needs to support variant switching
- Generate two ThemeTokens objects from the same personality vector: one default, one with `options.seedHue` shifted
- Store both variants in state; toggle swaps the ThemeProvider tokens
- File: `src/components/platform/preview/PreviewToolbar.tsx` — add variant toggle UI

**Dependencies:** None (independent of other tiers)
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (deterministic theme generation, no additional AI)
**LuxuryFine Validation:** Yes — one variant might nail the warm palette even if the other doesn't

---

# TIER 5: Anti-Reference & Constraint Refinement

## T5-E1: Meaningful Anti-Reference Redesign

**Description:** Replace some negative-quality anti-references (nobody wants "cheap" or "boring") with genuine aesthetic trade-offs that produce meaningful differentiation in the output.

### T5-E1-S1: Replace Negative Anti-References with Aesthetic Trade-Offs

**Story:** As a user selecting anti-references, I should be choosing between legitimate aesthetic directions that aren't right for my brand — not just listing bad qualities nobody wants.

**Acceptance Criteria:**

- [ ] Replace current 8 anti-references with a mix of ~10 that include genuine trade-offs:
  - **Keep as negatives** (universally unwanted): Corporate, Cheap, Generic
  - **Replace with trade-offs** (valid for some businesses, wrong for others):
    - "Minimalist" — right for some, wrong if you want rich/detailed
    - "Maximalist" — right for some, wrong if you want clean/simple
    - "Traditional" — right for heritage brands, wrong for innovators
    - "Trendy" — right for fashion, wrong for timeless brands
    - "Playful" — right for kids/casual, wrong for serious/luxury
    - "Formal" — right for law firms, wrong for casual brands
    - "Dramatic" — right for creative agencies, wrong for trust-based businesses
- [ ] Each anti-reference has a clear, visible effect on the output (not just spacing tweaks)
- [ ] Anti-reference descriptions on the selection chips explain the trade-off: "Minimalist — We don't want sparse and empty; we want richness and detail"
- [ ] Updated `emotional-overrides.ts` handles new anti-references with meaningful adjustments

**Technical Notes:**

- File: `src/lib/types/brand-character.ts` — update ANTI_REFERENCES constant
- File: `src/lib/theme/emotional-overrides.ts` — add cases for new anti-references
- File: `src/components/platform/intake/Step7Culture.tsx` — update UI chips
- The current anti-refs that have NO theme effect (corporate, generic, salesy, clinical) need either theme overrides added or should be replaced
- Trade-off anti-refs should produce VISIBLE differences: "anti-minimalist" → increase border width, add shadows, richer surfaces; "anti-formal" → rounder radius, warmer colors, relaxed spacing

**Dependencies:** None
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (deterministic UI + theme changes)
**LuxuryFine Validation:** Partially — the restaurant test case selected all current anti-refs, which is itself a signal that the options aren't good trade-offs

---

### T5-E1-S2: Business-Type-Specific Anti-Reference Suggestions

**Story:** As a user on the anti-reference step, I should see suggestions that are relevant to my business type — a restaurant should see "Fast Food" and "Cafeteria" as anti-references, not just generic negative qualities.

**Acceptance Criteria:**

- [ ] Anti-reference step shows 2-3 business-type-specific suggestions alongside the general options
- [ ] Restaurant: "Fast Food", "Cafeteria", "Chain Restaurant"
- [ ] Law Firm: "Ambulance Chaser", "Strip Mall Lawyer"
- [ ] Spa: "Budget Nail Salon", "Medical Clinic"
- [ ] Photography: "Stock Photo Agency", "Snapshot Studio"
- [ ] These industry-specific anti-refs produce targeted theme adjustments
- [ ] Max total selections stays at 3-4 (not overwhelming)

**Technical Notes:**

- File: `src/lib/types/brand-character.ts` — add `INDUSTRY_ANTI_REFERENCES` map
- File: `src/components/platform/intake/Step7Culture.tsx` — conditionally show industry-specific chips
- File: `src/lib/theme/emotional-overrides.ts` — add industry-specific override rules
- Requires access to siteType from the intake store (already available)

**Dependencies:** T5-E1-S1 (anti-reference redesign)
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (deterministic)
**LuxuryFine Validation:** Yes — "Fast Food" and "Chain Restaurant" anti-refs would inform the luxury direction

---

# TIER 6: Developer Tooling & Backtesting

## T6-E1: Dev Panel on Preview Page

**Description:** Add a collapsible developer panel to the preview page that exposes the full pipeline trace for the current generation, enabling rapid diagnosis of output quality issues.

### T6-E1-S1: Build Dev Panel UI Shell ✅

**Story:** As a developer, I should be able to toggle a dev panel on the preview page that shows diagnostic information about the current generation — behind a dev-only flag so users never see it.

**Acceptance Criteria:**

- [ ] New component: `DevPanel.tsx` in `src/components/platform/preview/`
- [ ] Panel is a collapsible sidebar or bottom drawer on the preview page
- [ ] Only visible when `?dev=true` query param is present OR `localStorage.getItem('ewb-dev') === 'true'`
- [ ] Panel has tabbed sections: "Intake", "Prompt", "AI Response", "Theme", "Validation"
- [ ] Panel is scrollable and doesn't interfere with the main preview viewport
- [ ] Panel can be toggled open/closed with a keyboard shortcut (Ctrl+Shift+D)

**Technical Notes:**

- File: `src/app/demo/preview/page.tsx` — add DevPanel conditionally
- The dev flag check should happen client-side (useSearchParams + localStorage)
- Panel should use the same design language as PreviewSidebar (dark theme, monospace for data)
- Tab content will be populated by subsequent stories

**Dependencies:** None
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe (UI only)
**LuxuryFine Validation:** Yes — provides the diagnostic view for the test case

---

### T6-E1-S2: Populate Dev Panel — Intake Tab ✅

**Story:** As a developer using the dev panel, the "Intake" tab should show all user inputs verbatim, so I can see exactly what the user provided.

**Acceptance Criteria:**

- [ ] Shows: siteType, goal, businessName, description (full text)
- [ ] Shows: personality vector with axis labels and values
- [ ] Shows: emotional goals, voice profile, brand archetype, anti-references
- [ ] Shows: narrative prompts (come_because, frustrated_with, after_feel) — each with the user's exact text
- [ ] Shows: AI-generated discovery questions and user's verbatim responses
- [ ] Shows: inferred business sub-type (from T1-E1-S4's inferBusinessSubType)
- [ ] All text is copyable (for bug reports)

**Technical Notes:**

- Data source: Zustand intake store (already has all this data)
- OR: load from Convex pipeline log (from T3-E2-S2) for shareable diagnostics
- Format: JSON tree view with collapsible sections, or key-value table

**Dependencies:** T6-E1-S1 (dev panel shell)
**Scope:** S (1-2 days)
**Cost Tier:** hook-safe
**LuxuryFine Validation:** Yes — shows the full Mexican restaurant intake data

---

### T6-E1-S3: Populate Dev Panel — Prompt & AI Response Tab ✅

**Story:** As a developer, I should see the exact prompt sent to Claude and the raw AI response, so I can iterate on prompt engineering.

**Acceptance Criteria:**

- [ ] "Prompt" section shows the full system message and user message sent to Claude
- [ ] "AI Response" section shows the raw text response before JSON parsing
- [ ] If deterministic fallback was used, show "DETERMINISTIC FALLBACK" badge with reason
- [ ] Shows timestamp and duration of the AI call
- [ ] Prompt text is syntax-highlighted (or at least formatted with clear section breaks)
- [ ] Copy button for the full prompt (for testing in Claude.ai or API playground)

**Technical Notes:**

- Data source: Convex pipeline log (T3-E2-S2)
- The prompt is currently constructed inline in generateSiteSpec.ts — may need to extract it into a separate function that also returns the prompt string for logging
- If pipeline logging isn't built yet, can fall back to showing the TEMPLATE of the prompt with intake data filled in

**Dependencies:** T6-E1-S1 (dev panel shell), T3-E2-S2 (pipeline logging) — soft dependency
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe
**LuxuryFine Validation:** Yes — can inspect the prompt and see if it emphasized restaurant vocabulary

---

### T6-E1-S4: Populate Dev Panel — Theme Tab

**Story:** As a developer, I should see the complete theme generation trace: input personality vector, which preset was closest, which font pairing was selected, industry hue bias applied, emotional overrides applied, and the full final token dump.

**Acceptance Criteria:**

- [ ] Shows: personality vector → selected font pairing (with score breakdown)
- [ ] Shows: seed hue calculation (base hue, industry bias, final hue)
- [ ] Shows: dark/light mode decision (threshold, business type modifier, final decision)
- [ ] Shows: all 87 theme tokens in a color-coded table (color tokens show swatches)
- [ ] Shows: emotional overrides that were applied (before/after values for changed tokens)
- [ ] Shows: anti-reference overrides applied
- [ ] Each changed token shows a diff: `spaceSection: 5.52rem → 6.35rem (+15%, luxury override)`

**Technical Notes:**

- This requires the theme generation pipeline to return metadata about its decisions, not just the final tokens
- Modify `generateThemeFromVector()` to optionally return a `ThemeGenerationTrace` alongside tokens
- `ThemeGenerationTrace`: { fontPairingId, fontPairingScore, seedHue, industryHueBias, isDark, darkModeThreshold, baseTokens, emotionalOverrides, antiReferenceOverrides, finalTokens }
- This trace is what makes the theme system debuggable

**Dependencies:** T6-E1-S1 (dev panel shell), T2-E1-S1 (business type in theme generator)
**Scope:** M (3-5 days)
**Cost Tier:** hook-safe
**LuxuryFine Validation:** Yes — reveals why the Mexican restaurant got acid green

---

### T6-E1-S5: Populate Dev Panel — Validation Tab ✅

**Story:** As a developer, I should see the content validation results (warnings and auto-fixes) for the current spec.

**Acceptance Criteria:**

- [ ] Shows all validation warnings from T1-E2-S1's validateSpecContent()
- [ ] Each warning shows: severity (error/warning), component reference, specific issue, suggested fix
- [ ] If auto-fixes were applied (T1-E2-S2), shows before/after for each fix
- [ ] Summary line: "3 errors, 5 warnings, 2 auto-fixed"
- [ ] Clicking a warning scrolls the preview to the affected component (if possible)

**Dependencies:** T6-E1-S1 (dev panel shell), T1-E2-S1 (content validator)
**Scope:** S (1-2 days)
**Cost Tier:** hook-safe
**LuxuryFine Validation:** Yes — should show "Services & Treatments" flagged as mismatch

---

## T6-E2: Backtesting Infrastructure

### T6-E2-S1: Save Named Test Cases from Intake Sessions

**Story:** As a developer, I should be able to save a specific intake session (like "LuxuryFine Mexican Restaurant") as a named test case that can be re-run on demand.

**Acceptance Criteria:**

- [ ] New Convex table: `testCases` with fields: name, intakeSnapshot (full intake state), expectedBehaviors (optional checklist), createdAt, lastRunAt
- [ ] Button in dev panel: "Save as Test Case" — prompts for a name, saves the full intake state
- [ ] Test cases are listed in a dev-only page: `/dev/test-cases`
- [ ] Each test case shows: name, business type, date saved, last run date
- [ ] "Run" button re-triggers spec generation with the saved intake data and shows the new output alongside the original
- [ ] First test case: "LuxuryFine Mexican Restaurant" with the exact intake data from the analysis

**Technical Notes:**

- New file: `convex/testCases.ts` with CRUD operations
- New dev page: `src/app/dev/test-cases/page.tsx` — behind dev flag
- "Run" action: calls `generateSiteSpec` with saved intake data, renders both outputs
- Consider: should test cases include the personality vector too? YES — the full intake state

**Dependencies:** T3-E2-S2 (pipeline logging for complete intake snapshots)
**Scope:** L (1-2 weeks)
**Cost Tier:** full-product (re-running AI generation has API cost)
**LuxuryFine Validation:** Yes — this IS the test case infrastructure

---

### T6-E2-S2: Side-by-Side Output Comparison for Backtesting

**Story:** As a developer iterating on prompts or theme logic, I should be able to compare the output of two different runs (before/after a change) side-by-side.

**Acceptance Criteria:**

- [ ] Dev page at `/dev/compare` shows two preview panes side by side
- [ ] Left pane: "Before" (saved spec from a test case run)
- [ ] Right pane: "After" (freshly generated spec with same intake data)
- [ ] Visual diff highlighting: tokens that changed are color-coded
- [ ] Content diff: side-by-side text comparison of headlines, CTAs, section titles
- [ ] Theme diff: color swatches showing before/after for all color tokens
- [ ] This enables rapid iteration: change a prompt or theme function → re-run test case → compare

**Technical Notes:**

- Requires saving test case run results (spec + theme tokens) to Convex
- Comparison UI: two AssemblyRenderer instances in iframes or side-by-side divs
- Text diff can use a simple string comparison library
- Color diff is visual: two color swatches per token

**Dependencies:** T6-E2-S1 (test case infrastructure)
**Scope:** L (1-2 weeks)
**Cost Tier:** full-product (each comparison run costs one AI call)
**LuxuryFine Validation:** Yes — the canonical use case

---

# Implementation Sequencing

## Phase A: Immediate Wins (Week 1-2) — Can Start in Parallel

These stories have ZERO dependencies and can all begin simultaneously:

| Story ID | Title                                       | Scope | Files Changed                                               |
| -------- | ------------------------------------------- | ----- | ----------------------------------------------------------- |
| T1-E1-S1 | AI Prompt: User's Own Words                 | M     | `convex/ai/generateSiteSpec.ts`                             |
| T1-E1-S2 | AI Prompt: Business Sub-Type Vocabulary     | M     | `convex/ai/generateSiteSpec.ts`                             |
| T1-E1-S3 | Business-Type-Aware Nav Labels              | S     | `convex/ai/generateSiteSpec.ts`                             |
| T1-E1-S5 | Narrative Prompts in Deterministic Fallback | S     | `convex/ai/generateSiteSpec.ts`                             |
| T1-E1-S7 | Business-Sub-Type Discovery Questions       | S     | `convex/ai/generateQuestions.ts`                            |
| T2-E1-S1 | Business Type in Theme Generator Signature  | S     | `src/lib/theme/generate-theme.ts`, `AssemblyRenderer.tsx`   |
| T2-E1-S3 | Emotional Goals Influence Colors            | M     | `src/lib/theme/emotional-overrides.ts`                      |
| T3-E2-S1 | Quick Satisfaction Rating                   | M     | New: `FeedbackBanner.tsx`, `convex/feedback.ts`             |
| T3-E2-S2 | Pipeline Session Logging                    | M     | New: `convex/pipelineLogs.ts`, update `generateSiteSpec.ts` |
| T6-E1-S1 | Dev Panel UI Shell                          | M     | New: `DevPanel.tsx`, update `demo/preview/page.tsx`         |

**Note:** T1-E1-S1, T1-E1-S2, T1-E1-S3, and T1-E1-S5 all modify `generateSiteSpec.ts` — assign to one developer or merge carefully. T1-E1-S7 modifies `generateQuestions.ts` (separate file, can be parallel).

## Phase B: Core Content & Visual Fix (Week 2-4)

Sequential dependencies from Phase A:

| Story ID | Title                                         | Scope | Depends On                  |
| -------- | --------------------------------------------- | ----- | --------------------------- |
| T1-E1-S4 | Sub-Type Deterministic Content (3 types)      | S-M   | None (but informs T1-E1-S6) |
| T1-E1-S6 | Business-Specific CTAs                        | S     | T1-E1-S4                    |
| T1-E2-S1 | Content Validator (safety net)                | M     | T1-E1-S4                    |
| T1-E2-S2 | Auto-Fix Mismatches (deprioritize if AI >95%) | M     | T1-E2-S1                    |
| T2-E1-S2 | Industry Color Association                    | M     | T2-E1-S1                    |
| T2-E1-S4 | Dark/Light Mode Business Bias                 | S     | T2-E1-S1                    |
| T2-E2-S1 | Business-Aware Font Selection                 | M     | T2-E1-S1                    |
| T2-E2-S2 | Business-Aware Variant Selection              | M     | T1-E1-S4                    |
| T6-E1-S2 | Dev Panel: Intake Tab                         | S     | T6-E1-S1                    |
| T6-E1-S3 | Dev Panel: Prompt Tab                         | M     | T6-E1-S1, T3-E2-S2          |
| T6-E1-S4 | Dev Panel: Theme Tab                          | M     | T6-E1-S1, T2-E1-S1          |
| T6-E1-S5 | Dev Panel: Validation Tab                     | S     | T6-E1-S1, T1-E2-S1          |

## Phase C: Feedback & Evaluation (Week 4-6)

| Story ID | Title                   | Scope | Depends On |
| -------- | ----------------------- | ----- | ---------- |
| T3-E1-S1 | Screenshot Capture      | M     | None       |
| T3-E1-S2 | VLM Evaluation          | L     | T3-E1-S1   |
| T3-E1-S3 | Feedback → Adjustments  | L     | T3-E1-S2   |
| T6-E2-S1 | Named Test Cases        | L     | T3-E2-S2   |
| T6-E2-S2 | Side-by-Side Comparison | L     | T6-E2-S1   |

## Phase D: Anti-References & A/B Variants (Week 5-8)

These can run in parallel with Phase C:

| Story ID | Title                       | Scope | Depends On |
| -------- | --------------------------- | ----- | ---------- |
| T4-E3-S1 | A/B Theme Variant Toggle    | M     | None       |
| T5-E1-S1 | Anti-Reference Redesign     | M     | None       |
| T5-E1-S2 | Business-Specific Anti-Refs | M     | T5-E1-S1   |

## Phase E: Deferred / Premium (Revisit after Tiers 1-2 stabilize)

| Story ID | Title                      | Scope | Notes                                                           |
| -------- | -------------------------- | ----- | --------------------------------------------------------------- |
| T4-E1-S1 | Curate Mood Board Images   | L     | **DEFERRED** — design/curation labor, premium feature candidate |
| T4-E1-S2 | Mood Board Selection Step  | L     | Blocked by T4-E1-S1                                             |
| T4-E2-S1 | Visual Reference URL Input | L     | Blocked by T3-E1-S1 + T4-E1-S2                                  |

---

# Summary Metrics

| Tier                        | Epics  | Stories | Done   | Remaining                 | Notes                                                            |
| --------------------------- | ------ | ------- | ------ | ------------------------- | ---------------------------------------------------------------- |
| Tier 1: Content Fidelity    | 2      | 9       | 9/9    | 0                         | **COMPLETE** — validator + auto-fix shipped                      |
| Tier 2: Visual Character    | 2      | 6       | 6/6    | 0                         | **COMPLETE**                                                     |
| Tier 3: Feedback Loop       | 2      | 5       | 2/5    | 3                         | Pipeline logging + satisfaction done; screenshot + VLM remaining |
| Tier 4: Intake Improvements | 3      | 4       | 1/1    | 0                         | **COMPLETE** (active scope) — T4-E1 deferred                     |
| Tier 5: Anti-References     | 1      | 2       | 0/2    | 2                         | No changes                                                       |
| Tier 6: Dev Tooling         | 2      | 7       | 4/7    | 3                         | Dev panel shell + 3 tabs done; Theme tab + backtesting remaining |
| **TOTAL**                   | **12** | **33**  | **22** | **8 active + 3 deferred** | 67% complete                                                     |

**Critical path to "LuxuryFine fixed":** T1-E1-S1 + T1-E1-S2 + T1-E1-S3 + T1-E1-S7 + T2-E1-S1 + T2-E1-S2 + T2-E1-S3 = **COMPLETE** — all critical path stories are shipped.

---

# Decision Log

| Decision                                                           | Rationale                                                                                                                                                                                           |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AI-first for all copy, deterministic for structure                 | The deterministic fallback will never be good enough for nuanced business-specific copy. Better to invest in making the AI path robust and use deterministic only as a safety net for API failures. |
| Deterministic sub-types scoped to 3 (restaurant, spa, photography) | This is a safety net, not the primary path. 3 sub-types validates the pattern; expand only if AI fallback rate exceeds ~5%.                                                                         |
| Business sub-type inference from description keywords              | Adding a "business sub-type" dropdown to intake would add friction. Better to infer from the description the user already wrote.                                                                    |
| Industry hue bias as NUDGE, not override                           | The personality vector should still have primary influence — business type shifts the range, not the absolute value.                                                                                |
| Emotional overrides should affect colors                           | Current overrides only adjust spacing/animation — users expect "luxury" to change the color palette, not just add 15% more whitespace.                                                              |
| Content validator as safety net, not primary quality mechanism     | Maintenance burden grows with each sub-type. Keep rule set small and high-confidence. Deprecate auto-fix if AI accuracy exceeds 95%.                                                                |
| Anti-references need genuine trade-offs                            | All 8 current anti-refs are things nobody wants. The fix: mix universally-unwanted qualities with legitimate aesthetic choices.                                                                     |
| Dev tooling in Tier 6, not after all other tiers                   | Dev tooling accelerates debugging ALL the other tiers. Building it early (Phase A/B) means faster iteration on everything else.                                                                     |
| Pipeline logging as hook-safe                                      | Storing the full prompt + response costs ~$0.001 in Convex storage. The diagnostic value far exceeds the cost.                                                                                      |
| Mood boards deferred as premium feature                            | L-scoped image curation is design labor, not engineering. Revisit after Tiers 1-2 stabilize — if output is consistently good, mood boards become polish, not necessity.                             |
| Discovery questions need sub-type awareness                        | Better questions → better user answers → better AI-generated copy. Small prompt change with outsized downstream impact on content quality.                                                          |
