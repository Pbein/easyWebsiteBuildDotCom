# EasyWebsiteBuild — User Journey Map

> **Version**: 3.0
> **Date**: 2026-02-16
> **Status**: Updated for Phase 6B/6C — express path, immersive reveal, brand discovery sidebar, shareable preview links. Every UI element, data field, validation rule, and interaction traced from source.
> **Canonical source**: `/business/USER_JOURNEY.md`
> **Maintained by**: JourneyBrain agent

---

## Journey Overview

```
ACQUIRE → LAND → INTAKE (express 3 / deep 9 steps) → GENERATE → REVEAL → CUSTOMIZE → SHARE/EXPORT → [BILLING] → [RETAIN]
                                                          ↑          ↑          ↑           ↑                ↑
                                                     2-5s express  3s immersive  Brand      Share links    Not built yet
                                                     10-20s deep   full-screen   Discovery  /s/[shareId]
```

**Current reality**: The journey now includes customization (sidebar + Brand Discovery), shareable preview links, and export. What's missing: billing (Clerk + Stripe), deployment (Vercel hosting), retention (email capture, accounts, project dashboard). The funnel is: Homepage → Demo → Express/Deep Intake → Immersive Reveal → Customize/Brand Discovery → Share or Export ZIP → Gone forever (no accounts yet).

---

## Phase 1: Acquisition

### ACQ-1: Entry Points

| Channel                 | Status     | Current State                                  |
| ----------------------- | ---------- | ---------------------------------------------- |
| Direct URL              | ACTIVE     | easywebsitebuild.com                           |
| Organic search          | NOT ACTIVE | No SEO strategy, no blog, no content marketing |
| Social media            | NOT ACTIVE | No social presence                             |
| Paid ads                | NOT ACTIVE | No ad campaigns                                |
| Referrals               | NOT ACTIVE | No referral mechanism                          |
| Product Hunt / launches | NOT ACTIVE | Not launched                                   |

**Gap**: Zero acquisition channels are active. The only way someone finds us is typing the URL directly. Even a perfect product with zero distribution is worth zero.

---

## Phase 2: Landing

### LAND-1: Homepage (/)

**Route**: `/` (`src/app/page.tsx`)
**User goal**: Understand what this product does and whether it's for them.

**Current implementation**:

- **Hero**: "Websites Built by Intelligence, Not Templates" + "EasyWebsiteBuild uses AI to understand your brand..." subheadline
- **Stats row**: "50+ Components | 10 Theme Presets | 13 Site Types" — **INFLATED** (actual: 24 components with variants, 7 presets, 13 site types). Needs correction per BD-003-03.
- **Primary CTA**: "Try the Demo" → `/demo`
- **Secondary CTA**: "Sample Site Preview" → `/preview`
- **How It Works**: 4-step visual cards:
  1. "Share Your Vision" — describe business + preferences
  2. "AI Assembles" — components selected + themes generated
  3. "Review & Refine" — preview + make adjustments
  4. "Launch" — export or deploy
- **Differentiators**: 4 cards (Not Templates, Learns & Improves, Your Brand Not Ours, AI-Powered Design)
- **Site Types**: 12 category icons in grid
- **Social Proof**: 3 testimonial cards — **FABRICATED** (Dr. Sarah Chen, Marcus Rivera, Emily Tanaka — none are real users)
- **Final CTA**: "Start Building — It's Free" → `/demo`

**Friction points**:

1. No pricing visibility. "It's Free" undermines trust for serious buyers.
2. Fabricated testimonials are a credibility risk.
3. Inflated stats ("50+ Components") will erode trust once users notice.
4. No live example of a finished site above the fold.
5. Two competing CTAs ("Sample Site Preview" vs "Try the Demo") — unclear primary action.
6. Time commitment ("~3 minutes") only appears after entering `/demo`.

**Events to track**:

- `landing.view`, `landing.cta_click` (demo|preview), `landing.scroll_depth` (25/50/75/100%), `landing.bounce`, `landing.time_on_page`

---

### LAND-2: Sample Site Preview (/preview)

**Route**: `/preview` (`src/app/preview/page.tsx`)
**User goal**: See what the product can produce.

**Current implementation**: Full component library demo with "Meridian Studio" sample content. Theme switcher with 7 presets + personality vector sliders. All 18 components rendered in sequence.

**Friction**: This is a developer showcase, not a customer demo. Business owners seeing "personality vector sliders" and "token definitions" will be confused. No CTA to transition into the demo flow ("build your own").

**Events**: `preview_page.view`, `preview_page.theme_switch`, `preview_page.time_on_page`, `preview_page.navigate_to_demo`

---

## Phase 3: Intake (9-Step Demo Flow)

**Route**: `/demo` (`src/app/demo/page.tsx`)
**State management**: Steps 1-4 use local React state (`LocalIntakeState`). At the Step 4→5 boundary, `bridgeToStore()` syncs all data to Zustand (`useIntakeStore`) for Steps 5-9. Zustand persists to `localStorage`.
**Progress UI**: Segmented progress bar with 3 groups — Setup (1-4) | Character (5-7) | Discovery (8). Step 9 hides the progress bar entirely.
**Page header**: "Build Your Website" + "Answer a few questions and watch the magic happen. Takes about 3 minutes."
**Step label display**: "Step X of 9 — [label]" shown below progress bar.
**Scroll reset**: `window.scrollTo({ top: 0, behavior: 'instant' })` fires on every step change to prevent landing mid-page on mobile.
**Transitions**: `framer-motion` AnimatePresence with horizontal slide (80px offset, 0.35s ease).

---

### INT-1: Site Type Selection (Step 1)

**Step label**: "Site Type"
**Heading**: "What kind of website are you building?"
**Subheading**: "Choose the category that best describes your project."
**UI**: 2-4 column responsive grid of 13 site type cards. Each card has: colored icon (Lucide), label, description. Selected card shows gold border + check icon.

**Exact options** (13 cards):

| ID            | Label            | Description                                 | Icon          | Accent  |
| ------------- | ---------------- | ------------------------------------------- | ------------- | ------- |
| `business`    | Business Website | Showcase your business and attract clients  | Briefcase     | #e8a849 |
| `booking`     | Booking Website  | Let customers book appointments or services | CalendarCheck | #f97316 |
| `ecommerce`   | Online Store     | Sell products directly online               | ShoppingBag   | #3ecfb4 |
| `blog`        | Blog             | Share your writing and ideas                | PenLine       | #60a5fa |
| `portfolio`   | Portfolio        | Showcase your creative work                 | Camera        | #c084fc |
| `personal`    | Personal Website | Your personal corner of the internet        | User          | #e8a849 |
| `educational` | Educational      | Teach, train, or share knowledge            | GraduationCap | #3ecfb4 |
| `community`   | Community        | Build a membership or community space       | Users         | #c084fc |
| `nonprofit`   | Nonprofit        | Rally support for your cause                | Heart         | #f97316 |
| `event`       | Event            | Promote and manage an event                 | PartyPopper   | #60a5fa |
| `landing`     | Landing Page     | One focused page with a single goal         | FileText      | #e8a849 |
| `directory`   | Directory        | List and organize businesses or resources   | LayoutList    | #3ecfb4 |
| `other`       | Something Else   | Tell us what you need                       | HelpCircle    | #9496a8 |

**Data captured**: `siteType: string` (stored in local state)
**Validation**: Must select exactly 1. Cannot proceed without selection.
**Navigation**: Back disabled (step 1). Continue enabled only when `siteType !== null`.

**Friction**:

1. 13 options may cause decision paralysis.
2. "Something Else" leads to generic goals in Step 2 — no custom input.
3. Selecting a new type resets the goal to `null`.

**Events**: `intake.step1.view`, `intake.step1.select_type`, `intake.step1.time_to_select`

---

### INT-2: Primary Goal (Step 2)

**Step label**: "Primary Goal"
**Heading**: "What's the primary goal of [site type label]?" (e.g., "business website")
**Subheading**: "This helps us optimize the layout and conversion strategy."
**UI**: 2-column grid of goal cards. Each card: label + description. Selected card shows gold border + check.

**Contextual goals per site type**:

| Site Type   | Goals (id: label)                                                                                                                                                       |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `business`  | contact: "Get people to contact me", book: "Get people to book a consultation", showcase: "Showcase services & build trust", sell: "Sell products or services directly" |
| `portfolio` | hire: "Get hired / freelance work", attention: "Get industry attention", audience: "Build my audience", sell: "Sell my work directly"                                   |
| `ecommerce` | products: "Sell physical products", digital: "Sell digital products", subscriptions: "Subscription-based sales", marketplace: "Multi-vendor marketplace"                |
| `_default`  | contact: "Drive inquiries & contact", inform: "Provide information", convert: "Generate leads & signups", sell: "Sell products or services"                             |

Site types without specific mappings (blog, booking, personal, educational, community, nonprofit, event, landing, directory, other) use `_default` goals.

**Data captured**: `goal: string` (stored in local state)
**Validation**: Must select exactly 1.
**Navigation**: Back → Step 1. Continue when `goal !== null`.

**Friction**: Low — clear options, fast selection.

**Events**: `intake.step2.view`, `intake.step2.select_goal`, `intake.step2.time_to_select`

---

### INT-3: Business Description (Step 3)

**Step label**: "Your Business"
**Heading**: "Tell us about your business or project"
**Subheading**: "We'll use this to personalize your website content."
**UI**: Centered form (max-w-2xl) with two inputs:

1. **Business Name** — text input, label "Business / Project Name", placeholder "e.g. Luxe Cuts Barbershop, Acme Design Studio", autoFocus
2. **Description** — textarea (4 rows), label "Describe what you do", character counter ("X characters" or "Min. 10 characters")
3. **Example chips** — 3 clickable pills below textarea, each pre-fills the description on click

**Placeholder pool** (1 random shown + first 3 as chips):

- "I'm opening a luxury med spa in Miami..."
- "I'm a wedding photographer based in Portland..."
- "We sell handmade ceramics online..."
- "I run a CrossFit gym in Austin..."
- "I'm a freelance graphic designer specializing in branding..."
- "We're a nonprofit helping homeless veterans..."

**Data captured**: `businessName: string`, `description: string` (both local state)
**Validation**: `businessName.trim().length > 0` AND `description.trim().length > 10`. Both must pass.
**Navigation**: Back → Step 2. Continue enabled only when validation passes.

**Friction**:

1. Blank page problem — despite chips, users may freeze.
2. No guidance on what makes a good description.
3. 10-character minimum is too low ("I sell stuff" = 12 chars, produces poor output).
4. No ideal length indicator.

**Events**: `intake.step3.view`, `intake.step3.submit`, `intake.step3.description_length`, `intake.step3.used_example_chip`, `intake.step3.time_to_complete`

---

### INT-4: Brand Personality (Step 4)

**Step label**: "Brand Personality (X/6)" where X = current completed axis count
**Heading per axis**: "[Axis Label]: Which feels more like your brand?" (e.g., "Density: Which feels more like your brand?")
**Subheading**: "Choose the style that resonates with your brand, or position the slider between them."
**UI**: Sequential A/B card comparison. Each axis shows two large cards side-by-side. Left card = left pole, right card = right pole. Each card has:

- Gradient background (unique per axis, with custom CSS gradient + border color)
- Bold label (e.g., "Minimal & Spacious")
- Description line (e.g., "Clean whitespace, breathing room, simplicity")
- Mini wireframe preview box (abstract divs simulating a website layout)

Below cards: horizontal slider (0.0-1.0, snaps to 0.1 increments) + "Confirm & Next Axis" button (ArrowRight icon).

Clicking a card sets slider to 0.2 (left) or 0.8 (right) — does NOT auto-advance. User must still click "Confirm & Next Axis" to proceed. Dragging slider allows fine-tuning between poles. Selected card gets gold border + ring highlight (< 0.4 = left highlighted, > 0.6 = right highlighted).

**Completion state**: After all 6 axes confirmed, shows summary view: checkmark icon + "Brand Personality Captured" heading + "We've mapped your brand across 6 personality dimensions. Click 'Continue to Discovery' to proceed." + 2x3 grid of mini visualizations (each axis name + progress bar + left/right labels). The parent page's Continue button becomes active.

**6 personality axes** (in sequential order):

| #   | Axis ID       | Left Pole (0.0)                                                            | Right Pole (1.0)                                                          |
| --- | ------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | `density`     | Minimal & Spacious — "Clean whitespace, breathing room, simplicity"        | Rich & Layered — "Textured backgrounds, multiple layers, visual richness" |
| 2   | `tone`        | Playful & Casual — "Rounded shapes, vibrant colors, friendly feel"         | Serious & Professional — "Sharp lines, muted palette, refined elegance"   |
| 3   | `temperature` | Warm & Inviting — "Earth tones, cream backgrounds, organic shapes"         | Cool & Sleek — "Blue-gray palette, crisp whites, geometric forms"         |
| 4   | `weight`      | Light & Airy — "Thin fonts, subtle colors, delicate elements"              | Bold & Heavy — "Thick fonts, strong contrast, visual impact"              |
| 5   | `era`         | Classic & Traditional — "Serif fonts, ornamental details, timeless layout" | Modern & Contemporary — "Sans-serif, minimalist, cutting-edge design"     |
| 6   | `energy`      | Calm & Serene — "Static elements, gentle transitions, peaceful"            | Dynamic & Energetic — "Motion, scroll effects, interactive elements"      |

**Data captured**: `personality: number[6]` — each value 0.0-1.0, default all 0.5
**Validation**: All 6 axes must be confirmed (personalityStep >= 6). Continue button reads "Continue" and navigates to Step 5.
**Bridge**: At Step 4→5 transition, `bridgeToStore()` syncs all local state (siteType, goal, businessName, description, personality) to Zustand store.

**Friction**:

1. 6 sequential decisions is fatiguing. Sub-progress "Brand Personality (2/6)" helps but the step feels long.
2. Abstract card previews don't clearly show the difference between poles.
3. No skip or "I don't know" option — every axis must be set.
4. Card click (snaps to 0.2/0.8) vs slider drag — dual interaction is unclear.

**Events**: `intake.step4.view`, `intake.step4.axis_set` (per axis with value), `intake.step4.axis_method` (card_click|slider_drag), `intake.step4.total_time`, `intake.step4.back_pressed`

---

### INT-5: Emotional Goals (Step 5)

**Step label**: "First Impression"
**Component**: `Step5Emotion` (`src/components/platform/intake/Step5Emotion.tsx`)
**Heading**: "How should visitors FEEL in the first 5 seconds?"
**Subheading**: "Pick 1-2 emotional reactions you want from every visitor. This shapes everything from colors to copy."
**State source**: Zustand store (post-bridge)
**UI**: Grid of 10 emotion cards. Each card: Lucide icon (colored with accent), bold label, italic description. Max 2 selections — selecting a 3rd is blocked (remaining cards show disabled state). Staggered entry animation (each card delays 30ms × index).
**Navigation**: Own Back/Continue buttons. Continue requires at least 1 selection.

**Exact emotion options** (10 cards, from `EMOTIONAL_OUTCOMES`):

| ID              | Label       | Description                            | Icon     | Accent  |
| --------------- | ----------- | -------------------------------------- | -------- | ------- |
| `trust`         | Trust       | "They feel confident and reassured"    | Shield   | #3b82f6 |
| `luxury`        | Luxury      | "They feel like they're in good hands" | Crown    | #d4a853 |
| `curious`       | Curiosity   | "They want to explore and learn more"  | Search   | #8b5cf6 |
| `calm`          | Calm        | "They feel at ease and relaxed"        | Leaf     | #6aa67e |
| `energized`     | Energy      | "They feel motivated to act now"       | Zap      | #f97316 |
| `inspired`      | Inspiration | "They feel moved and excited"          | Sparkles | #ec4899 |
| `safe`          | Safety      | "They know they're in the right place" | Lock     | #0ea5e9 |
| `playful`       | Delight     | "They smile — it feels fun and fresh"  | Smile    | #f59e0b |
| `authoritative` | Authority   | "They see you as the clear expert"     | Award    | #1e293b |
| `welcomed`      | Welcome     | "They feel personally invited in"      | DoorOpen | #e8a849 |

**Data captured**: `emotionalGoals: EmotionalGoal[]` (1-2 items) → Zustand store `setEmotionalGoals()`
**Validation**: At least 1 selected. Maximum 2 enforced by UI (cards become unclickable at limit).

**Friction**: Low. Engaging step with clear visual design. 2-max limit is well-communicated via disabled state.

**Events**: `intake.step5.view`, `intake.step5.select_goals`, `intake.step5.goal_count`, `intake.step5.goals_selected`

---

### INT-6: Voice & Narrative (Step 6)

**Step label**: "Brand Voice"
**Component**: `Step6Voice` (`src/components/platform/intake/Step6Voice.tsx`)
**Heading**: "What does your brand sound like?"
**Subheading**: "For each scenario, pick the version that sounds most like you."
**UI**: Two sections:

**Section 1 — Voice Detection (3 A/B/C comparisons)**:
Each comparison shows a context label + 3 copy samples labeled A, B, C representing warm/polished/direct. User picks their preferred option per comparison. Dominant voice auto-calculated from picks (whichever tone gets 2+ of 3). Selected voice shown as a badge: "Your voice: [warm/polished/direct]".

**Exact voice comparisons** (from `VOICE_COMPARISONS`):

| #   | Context               | Warm (A)                                                                | Polished (B)                                                               | Direct (C)                                          |
| --- | --------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------- |
| 1   | Welcome headline      | "Hey there! We're so glad you found us."                                | "Elevating your experience at every touchpoint."                           | "Better results. Less hassle. Let's go."            |
| 2   | Call-to-action button | "Let's chat about your project"                                         | "Reserve your consultation"                                                | "Book now"                                          |
| 3   | Quality description   | "We pour our heart into every detail because you deserve nothing less." | "Meticulous craftsmanship meets refined sensibility in every deliverable." | "No shortcuts. No filler. Just work that performs." |

**Section 2 — Narrative Prompts (3 optional fill-in-the-blank)**:
Section heading: "Tell your story (optional)"
Section subheading: "These become raw material for your website copy."

- "People usually come to us because \_\_\_" (key: `come_because`)
- "They're usually frustrated with \_\_\_" (key: `frustrated_with`)
- "After working with us, they feel \_\_\_" (key: `after_feel`)
  Each is a text input with placeholder "Type your answer..."

**Data captured**:

- `voiceProfile: VoiceTone` (warm|polished|direct) — auto-derived from picks
- `narrativePrompts: { come_because?: string, frustrated_with?: string, after_feel?: string }` — all optional

**Validation**: Voice profile required (all 3 comparisons must be answered). Narrative prompts are optional.
**Navigation**: Own Back/Continue buttons. Continue requires voice profile.

**Friction**:

1. A/B/C comparisons require careful reading (3 text samples per comparison).
2. Narrative prompts are optional but high-value — most users skip them.
3. No preview of how voice choice affects final output.

**Events**: `intake.step6.view`, `intake.step6.select_voice`, `intake.step6.narratives_filled` (count of 3), `intake.step6.time_to_complete`

---

### INT-7: Culture & Anti-References (Step 7)

**Step label**: "Visual Culture"
**Component**: `Step7Culture` (`src/components/platform/intake/Step7Culture.tsx`)
**Heading**: "What role does your brand play?"
**Subheading**: "Pick the character that best fits how you want clients to see you."
**UI**: Two sections:

**Section 1 — Brand Archetype (select 1 of 6 cards)**:
Each card: Lucide icon (from `ARCHETYPE_ICON_MAP`), label, tagline, description, example quote, accent color.

**Exact archetypes** (from `BRAND_ARCHETYPES`):

| ID          | Label         | Tagline                         | Description                                                      | Example                                                   | Icon          | Accent  |
| ----------- | ------------- | ------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- | ------------- | ------- |
| `guide`     | The Guide     | "Walk beside your customer"     | "You lead people through a process with patience and clarity..." | "Let us show you the way to a better solution."           | Compass       | #3b82f6 |
| `expert`    | The Expert    | "Authority through mastery"     | "You lead with knowledge and credentials..."                     | "Backed by 15 years of research and 1,000+ case studies." | GraduationCap | #1e293b |
| `creative`  | The Creative  | "Make something nobody's seen"  | "You break conventions and surprise people..."                   | "We don't follow trends. We start them."                  | Palette       | #ec4899 |
| `caretaker` | The Caretaker | "You're in the best hands"      | "You nurture, support, and protect..."                           | "Your wellbeing is our top priority — always."            | Heart         | #ef4444 |
| `rebel`     | The Rebel     | "Challenge the status quo"      | "You question norms and do things differently..."                | "Tired of the same old? Yeah, us too."                    | Flame         | #f97316 |
| `artisan`   | The Artisan   | "Craftsmanship in every detail" | "You take pride in quality and process..."                       | "Handcrafted with care. Built to last."                   | Gem           | #8b5cf6 |

**Section 2 — Anti-References (toggle chips)**:
Section heading: "What should your site NEVER feel like?"
Section subheading: "Select any that apply. These act as constraints — we'll actively avoid them."
Two groups displayed:

**General anti-references** (10 options, from `ANTI_REFERENCES`):

| ID            | Label       | Description                                         |
| ------------- | ----------- | --------------------------------------------------- |
| `corporate`   | Corporate   | "Stiff, suit-and-tie, forgettable"                  |
| `cheap`       | Cheap       | "Discount-bin, bargain-basement feel"               |
| `generic`     | Generic     | "Template-y, could be any business"                 |
| `minimalist`  | Minimalist  | "We want richness and detail, not sparse and empty" |
| `maximalist`  | Maximalist  | "We want clean and focused, not overwhelming"       |
| `traditional` | Traditional | "We're forward-looking, not heritage-bound"         |
| `trendy`      | Trendy      | "We want timeless, not chasing the latest fad"      |
| `playful`     | Playful     | "We're serious about what we do, not lighthearted"  |
| `formal`      | Formal      | "We're approachable, not stiff and ceremonial"      |
| `dramatic`    | Dramatic    | "We're grounded and steady, not over-the-top"       |

**Industry-specific anti-references** (shown below general refs, introduced with "For your industry specifically:", amber/gold styling — from `INDUSTRY_ANTI_REFERENCES`):

| Site Type     | Industry Options                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `restaurant`  | Fast Food ("We're not a drive-through chain"), Cafeteria ("We're not institutional dining"), Chain Restaurant ("We're not a franchise operation")      |
| `booking`     | Budget Salon ("We're not a walk-in discount shop"), Medical Clinic ("We're not cold and clinical"), Call Center ("We're not impersonal phone booking") |
| `spa`         | Budget Nail Salon ("We're not a strip-mall quick-fix"), Medical Clinic ("We're not sterile and clinical")                                              |
| `photography` | Stock Photo Agency ("We're not faceless bulk content"), Snapshot Studio ("We're not a mall portrait kiosk")                                            |
| `ecommerce`   | Flea Market ("We're not a bargain-bin bazaar"), Mega Retailer ("We're not an Amazon clone"), Dropship Store ("We're not a faceless reseller")          |
| `portfolio`   | Stock Agency ("We're not generic clip art"), Student Project ("We're not a homework assignment")                                                       |
| `blog`        | Content Farm ("We're not clickbait SEO filler"), News Wire ("We're not a dry newsfeed")                                                                |
| `nonprofit`   | Government Agency ("We're not bureaucratic and stiff"), Guilt Trip ("We inspire action, not guilt")                                                    |
| `educational` | Textbook ("We're not dry and academic"), Children's Site ("We're not juvenile or cartoonish")                                                          |
| `event`       | Ticket Booth ("We're not just a transaction point"), Paper Flyer ("We're not a stapled bulletin board posting")                                        |

Site types `personal`, `community`, `landing`, `directory` show general refs only.

**Data captured**:

- `brandArchetype: BrandArchetype` (1 selection)
- `antiReferences: (AntiReference | string)[]` (0+ selections, mix of general + industry)

**Validation**: Archetype required. Anti-references optional.
**Navigation**: Own Back/Continue buttons. Continue requires archetype.

**Friction**: Low. Both interactions are clear and fast. Anti-references genuinely change output.

**Events**: `intake.step7.view`, `intake.step7.select_archetype`, `intake.step7.anti_refs_count`, `intake.step7.anti_refs_selected`

---

### INT-8: AI Discovery (Step 8)

**Step label**: "Discovery"
**Component**: `Step5Discovery` (`src/components/platform/intake/Step5Discovery.tsx`)
**Heading**: "A Few More Details"
**Subheading**: "Help us fine-tune your website with these quick questions."
**Summary card**: Above heading, shows compact row: site type icon + label | goal icon + label | description preview (truncated to 40 chars). Provides context reminder of what user entered.
**Loading state**: Animated spinning Sparkles icon + "Our AI is crafting personalized questions for you..."
**Review mode**: When returning with unchanged inputs, shows all previous Q&A pairs as read-only cards + "These answers look good" (primary CTA → proceed) + "Update my answers" (secondary → re-enter answers).
**UI**: Sequential question display. Questions appear one at a time with text input or select dropdown.

**Question generation**:

- **AI path**: Calls `convex/ai/generateQuestions` (Claude Sonnet 4) with all intake data. System prompt includes business context + brand character context (emotional goals, voice profile, archetype, anti-references, narrative prompts). Generates 4 industry-specific questions.
- **Deterministic fallback**: If no API key or API fails, uses `FALLBACK_QUESTIONS` lookup. Key order: inferred sub-type → siteType → `_default`. 15 site-type-specific question banks + 1 default.
- **Sub-type inference**: `inferBusinessSubType()` scans description for keywords to detect restaurant/spa/photography sub-types.
- **Cost**: ~$0.01-0.02 per AI question generation call.

**Staleness detection**: `computeInputKey()` creates a fingerprint from `siteType|goal|businessName|description|emotionalGoals|voiceProfile|brandArchetype`. If inputs haven't changed since last generation, shows review mode with existing answers instead of regenerating.

**Question types**:

- `text` — open-ended text input
- `select` — dropdown with 3-4 predefined options

Each question bank has 4 questions (q1-q4) with a mix of text and select types.

**Fallback question banks exist for**: restaurant, spa, photography, business, portfolio, ecommerce, blog, booking, personal, educational, community, nonprofit, event, landing, \_default (15 + 1).

**Data captured**: `aiResponses: Record<string, string>` — 4 question-answer pairs stored in Zustand
**Validation**: All 4 questions must be answered.
**Navigation**: Back button below step content → Step 7. Submit button on final question → Step 9.

**Friction**:

1. AI question generation adds 3-5s wait (spinner shown).
2. 4 mandatory text answers is heavy — no skip for irrelevant questions.
3. Single question at a time — can't scan all questions first.
4. Review mode UX requires understanding staleness concept.

**Events**: `intake.step8.view`, `intake.step8.questions_method` (ai|deterministic), `intake.step8.question_load_time_ms`, `intake.step8.answer_length`, `intake.step8.total_time`, `intake.step8.review_mode_used`

---

### INT-9: Generation / Loading (Step 9)

**Step label**: "Generating" (hidden from progress bar — progress bar not shown on step 9)
**Component**: `Step6Loading` (`src/components/platform/intake/Step6Loading.tsx`)
**Heading**: "Building your site"
**Subheading**: "for [businessName]" (business name highlighted in accent color)
**Error heading**: "Generation Failed" with "Try Again" and "Start Over" buttons
**UI**: Two-panel layout (side-by-side on desktop, stacked on mobile):

- **Left panel (or top on mobile)**: Fake browser chrome wireframe with animated block assembly. Shows section counter: "X / 7 sections placed"
- **Right panel (or bottom)**: Heading + business name + animated status text (cycles through 11 messages) + progress bar

**Wireframe animation** (7 blocks appear sequentially):

1. Navigation bar (0.3s delay)
2. Hero section (1.2s)
3. Features grid (2.5s)
4. Content block (3.8s)
5. Testimonials row (5.0s)
6. CTA banner (6.3s)
7. Footer (7.5s)

**Loading messages** (11 time-based steps):

| #   | Message                              | Appears at |
| --- | ------------------------------------ | ---------- |
| 1   | "Reading your brand story..."        | 0s         |
| 2   | "Mapping your personality vector..." | 1.8s       |
| 3   | "Choosing your color palette..."     | 3.6s       |
| 4   | "Setting typography pairings..."     | 5.2s       |
| 5   | "Selecting hero layout..."           | 6.8s       |
| 6   | "Building content sections..."       | 8.4s       |
| 7   | "Adding social proof..."             | 10s        |
| 8   | "Composing call-to-action..."        | 11.6s      |
| 9   | "Assembling footer..."               | 13.2s      |
| 10  | "Applying final polish..."           | 14.8s      |
| 11  | "Almost there..."                    | 16.4s      |

**Progress bar**: Logarithmic formula: `Math.min(95, (1 - Math.exp(-elapsedMs / 8000)) * 100)`. Caps at 95% — jumps to 100% when generation actually completes. **This is fake progress — time-based, not event-based.**

**Generation**:

- **AI path**: Calls `convex/ai/generateSiteSpec` (Claude Sonnet 4) with all intake data + discovery answers + brand character data. Generates full `SiteIntentDocument` with tagline, component selections, content, theme personality.
- **Deterministic fallback**: If no API key or failure, uses rules-based component selection. Business-type-aware content. Voice-keyed headlines/CTAs. Anti-reference constraints.
- **Content validation**: Inline validator checks for vocabulary blacklist violations (wrong-industry terms), whitelist presence, field name accuracy. Auto-fix system corrects common issues.
- **Duration**: ~10-20 seconds (AI) or ~2-5 seconds (deterministic).
- **Cost**: ~$0.03-0.08 per AI spec generation call.

**On success**: Saves spec to Convex via `saveSiteSpec` mutation, then auto-navigates to `/demo/preview?session=<sessionId>`.
**On failure**: Shows "Generation Failed" with "Try Again" and "Start Over" buttons.
**Pipeline logging**: Every generation saves a pipeline log (method, timing, intake data, spec snapshot, validation results, raw AI prompt/response) to Convex `pipelineLogs` table.

**Friction**:

1. 10-20 seconds of dead waiting time. Wireframe animation engaging for ~7s, then idle.
2. No data collection during wait (wasted opportunity — see Loading Screen Recommendations).
3. Progress bar is fake and can stall at ~88% for 10+ seconds.
4. No cancel button once generation starts.
5. No email capture before showing results.

**Events**: `intake.step9.view`, `intake.step9.generation_method` (ai|deterministic), `intake.step9.generation_duration_ms`, `intake.step9.generation_success`, `intake.step9.generation_error`, `intake.step9.error_action` (retry|start_over)

---

## Phase 4: Preview

### PREV-1: First Render / "Wow Moment"

**Route**: `/demo/preview?session=<sessionId>` (`src/app/demo/preview/page.tsx`)
**User goal**: See their assembled website and evaluate quality.
**Spec loading**: `useQuery(api.siteSpecs.getSiteSpec, { sessionId })` — real-time Convex subscription.
**Platform chrome**: Hidden via `ConditionalLayout` (no platform Navbar/Footer).

#### Desktop Layout

**Toolbar** (`PreviewToolbar`):

- Left: Business name + "Preview" badge
- Center: Viewport toggle — Desktop (Monitor) | Tablet (Tablet) | Mobile (Smartphone)
- Right: A/B variant switch (Shuffle icon + A/B buttons) | Screenshot (Camera) | Export (Download)

**Sidebar** (`PreviewSidebar`, 320px wide, collapsible):

- Header: Business name, tagline, site type badge, conversion goal badge, close button
- **Pages section**: Page list with active page highlight (currently single-page only)
- **Theme section**: 5 color swatches (Primary, Secondary, Accent, Background, Text) + heading/body font names
- **Components section**: Sorted list showing componentId + variant per placement
- **Personality section**: 6 axes with gradient progress bars + left/right labels
  - Density (Minimal ↔ Rich), Tone (Playful ↔ Serious), Temp (Warm ↔ Cool), Weight (Light ↔ Bold), Era (Classic ↔ Modern), Energy (Calm ↔ Dynamic)
- **Emotional Goals** (if present): Capitalized goal chips in amber
- **Voice & Character** (if present): Voice badge (teal) + Archetype badge (purple) + narrative prompt quotes
- **Anti-References** (if present): "NOT: [ref]" chips in red
- **Actions**: "Start Over" button → resets Zustand store → `/demo`

**Site render**: `<iframe>` embedding `AssemblyRenderer`. Viewport widths: desktop=100%, tablet=768px, mobile=375px. Centered with transition animation.

**Theme generation**:

- Base: `generateThemeFromVector(personalityVector, { businessType: siteType })`
- Emotional overrides: `applyEmotionalOverrides(baseTheme, emotionalGoals, antiReferences)`
- A/B variants: `generateThemeVariants()` produces two variations
- VLM overrides: Merged in via `useMemo` when VLM evaluation suggests changes

#### Mobile Layout

**Toolbar** (`MobileToolbar`): Slim bar with truncated business name + "Preview" badge + Screenshot button
**Tab bar** (`MobileTabBar`): 4 tabs — Preview (Eye) | Info (Info) | Theme (Palette) | Actions (MoreHorizontal)
**Bottom sheets** (`MobileBottomSheet`): Tabs other than Preview open as bottom sheets (max 65vh, rounded top corners, drag handle, close button)

- **Info sheet**: Business info, pages, component list, personality bars, emotional goals, voice/archetype, anti-references
- **Theme sheet**: Color swatches, font names, personality bars, A/B variant toggle
- **Actions sheet**: Viewport toggle, Screenshot, Export, Start Over

**Feedback Banner** (`FeedbackBanner`):

- Appears after 3-second delay (if no prior feedback for this session)
- Header: "How does this look?"
- 3 rating buttons: "Love it" (Heart, rose), "It's OK" (Meh, amber), "Not right" (ThumbsDown, red)
- If "It's OK" or "Not right": Follow-up appears — "What feels off?" + 6 dimension chips (Colors, Layout, Content, Fonts, Overall vibe, Images) + optional textarea
- Submit: "Send Feedback" button → saves to Convex `feedback` table (rating, dimensions, freeText, sessionId)
- Confirmation: "Thanks for your feedback!" green message
- Dismissible via X button

**Dev Panel** (`DevPanel`, Ctrl+Shift+D or `?dev=true`):

- Collapsed header bar: "Dev Panel" + method badge (AI|Deterministic) + warning count + processing time
- Save Test Case button → names and saves current intake+spec to Convex `testCases` table
- 6 tabs:
  1. **Pipeline**: Method, processing time, generation timestamp, sub-type, warning count
  2. **Intake**: All intake data key-value pairs
  3. **Theme**: Personality vector bars, dark/light mode decision, font pairing, 18 color token swatches, emotional override diffs
  4. **Validation**: Sub-type, error/warning counts, auto-fixes applied, individual warning cards with severity + component ref + suggestion
  5. **Raw**: Full AI prompt sent + raw AI response text
  6. **VLM**: Screenshot required → Evaluate Design button (~$0.03/eval) → 5 dimension scores with bars (Content Relevance, Visual Character, Color Appropriateness, Typography Fit, Overall Cohesion) + summary + Apply Adjustments button for suggested theme changes

**Visual System (Phase 5A)**:

- CSS patterns render as subtle background textures per business type (e.g., herringbone for bakery, seigaiha for Japanese restaurant)
- Section dividers (wave, angle, curve, zigzag) create visual flow between sections
- ImagePlaceholder (gradient/pattern/shimmer) renders where images would be — intentional design, not broken images
- Visual vocabulary resolved per business type with archetype and personality overrides

**Friction**:

1. No guided reveal or "ta-da" moment — lands directly on full chrome.
2. Sidebar uses developer language (Component Stack, Personality Vector).
3. No clear primary next-action CTA.
4. ~~Placeholder images (gray divs) make the site look incomplete~~ — RESOLVED by Phase 5A ImagePlaceholder system (gradient/pattern/shimmer variants).
5. Single page only — nav links scroll to `#sections`.
6. No share link for feedback from others.
7. No real photography yet — CSS placeholders are intentional but stock photos would improve perceived quality (Phase 5B).

**Events**: `preview.view`, `preview.viewport_change`, `preview.variant_switch` (A|B), `preview.sidebar_toggle`, `preview.screenshot_taken`, `preview.time_on_page`, `preview.scroll_depth`, `preview.feedback_shown`, `preview.feedback_submitted`, `preview.feedback_rating`, `preview.feedback_dismissed`

---

### PREV-2: Theme Variant Toggle

**User goal**: Compare two AI-generated theme variations.
**UI**: A/B toggle in toolbar (desktop) or Theme bottom sheet (mobile). Toggle button group with Shuffle icon.
**Implementation**: `generateThemeVariants()` produces two variations from personality vector. Active variant state tracked in preview page.

**Friction**: Works well. No explanation of what differs between A and B.

**Events**: `preview.variant_switch`, `preview.variant_final`

---

### PREV-3: VLM Evaluation (Dev Tool)

**User goal**: Get AI-powered design quality assessment.
**Access**: Dev Panel → VLM tab
**Flow**: Take screenshot (toolbar Camera button → html2canvas capture) → Click "Evaluate Design" → Claude Vision analyzes screenshot against intake context → Returns 5-dimension scores (0-10) + summary + suggested theme adjustments → Optional "Apply Adjustments" button → Theme overrides applied instantly via `mapAdjustmentsToTokenOverrides()`.
**Storage**: Results saved to Convex `vlmEvaluations` table with sessionId index.
**Cost**: ~$0.03 per evaluation.
**Fallback**: If AI unavailable, returns 5/10 for all dimensions.

---

## Phase 5: Export

### EXP-1: ZIP Download

**User goal**: Get their website files to own and deploy.
**Trigger**: Export button in toolbar (desktop) or Actions bottom sheet (mobile).
**Flow**: `generateProject(spec)` → `ExportResult` → `createProjectZip(result)` → `downloadBlob(blob, filename)`.
**Filename**: `{business-name-slugified}-website.zip`

**Output files** (3 files):

1. **`index.html`** — Semantic HTML with Google Fonts link, all component sections rendered as static markup. Supported: nav-sticky, hero-centered, hero-split, content-features, content-text, content-stats, proof-testimonials, cta-banner, form-contact, footer-standard, commerce-services, team-grid, content-accordion, content-logos. Unsupported components get HTML comments.
2. **`styles.css`** — CSS Custom Properties from theme tokens (:root vars) + reset + base styles + layout classes (container, section, section--alt) + component-specific styles (nav, hero, features-grid, testimonial-card, cta-banner, footer, form) + responsive media query (@media max-width 768px).
3. **`README.md`** — Getting started guide, file list, customization instructions (edit CSS vars), deployment links (Vercel, Netlify, GitHub Pages).

**Friction**:

1. "Export as ZIP" is developer language for business owners.
2. No deployment assistance after download.
3. No email capture before/after export — we lose the user forever.
4. Static HTML only — not a real Next.js project with routing.
5. Contact forms don't actually submit — success animation only.
6. Some components not supported in export: content-split, content-timeline, proof-beforeafter, media-gallery (render as HTML comments).
7. No watermark or trial limitation — full product for free.

**Events**: `export.initiated`, `export.completed`, `export.file_size_kb`, `export.component_count`

---

## Phase 6: Edit [FUTURE — NOT BUILT]

### EDIT-1: Refinement Chat

**Status**: Not built. Planned for Phase 5+.
**Concept**: Conversational interface for post-generation changes: adjust_theme, rewrite_copy, add_component, remove_component.

---

## Phase 7: Publish [FUTURE — NOT BUILT]

### PUB-1: One-Click Deployment (Vercel)

**Status**: Not built.

### PUB-2: Custom Domain

**Status**: Not built.

---

## Phase 8: Billing [FUTURE — NOT BUILT]

### BILL-1: Pricing Exposure

**Status**: No pricing anywhere on the site.

### BILL-2: Payment Collection

**Status**: Not built. Strategy: $997 one-time, with upsell tiers (see `business/HORMOZI_ANALYSIS.md`).

---

## Phase 9: Retention [FUTURE — NOT BUILT]

### RET-1: Re-engagement

**Status**: No email collection, no accounts, no notifications.

### RET-2: Referral Program

**Status**: Not built.

---

## Data Flow Summary

```
Local State (Steps 1-4)
  ├─ siteType, goal, businessName, description, personality[6]
  └─ bridgeToStore() at Step 4→5 boundary
      └─ Zustand Store (Steps 5-9)
          ├─ localStorage key: "ewb-intake"
          ├─ sessionId format: "session_{timestamp}_{random7chars}"
          │
          ├─ PERSISTED fields (survive page refresh):
          │   siteType, goal, businessName, description, personality[6],
          │   personalityStep, emotionalGoals[], voiceProfile, narrativePrompts{},
          │   brandArchetype, antiReferences[], currentStep, sessionId,
          │   aiQuestions[], aiResponses{}, questionsGeneratedAt, questionsInputKey
          │
          ├─ TRANSIENT fields (lost on refresh):
          │   specId, showSummary, direction
          │
          └─ Flows to Convex Backend
              ├─ siteSpecs table — full SiteIntentDocument (sessionId indexed)
              ├─ pipelineLogs table — generation metadata + raw AI data (sessionId indexed)
              ├─ vlmEvaluations table — VLM scores + adjustments (sessionId indexed)
              ├─ feedback table — user satisfaction ratings (sessionId indexed)
              └─ testCases table — named test case snapshots (name indexed)
```

**Reset**: `reset()` regenerates sessionId and returns all fields to initial values. Triggered by "Start Over" button in preview sidebar.

---

## Critical Funnel Metrics (to implement)

| Step Transition   | Metric                           | Target | Signal                        |
| ----------------- | -------------------------------- | ------ | ----------------------------- |
| LAND-1 → INT-1    | Homepage → Demo start            | >30%   | Value prop clarity            |
| INT-1 → INT-4     | Setup completion (steps 1-4)     | >80%   | Steps are frictionless        |
| INT-4 → INT-7     | Character completion (steps 5-7) | >70%   | Character capture is engaging |
| INT-7 → INT-9     | Discovery → Generation           | >85%   | Commitment to see results     |
| INT-9 success     | Generation success rate          | >95%   | Technical reliability         |
| PREV-1 view       | Preview load rate                | >98%   | No broken redirects           |
| PREV-1 → EXP-1    | Preview → Export rate            | >15%   | Output quality sufficient     |
| PREV-1 → feedback | Satisfaction rating avg          | >7/10  | Product-market fit signal     |

---

## Drop-Off Risk Map

| Step   | Risk      | Drop-Off Cause                            | Severity | Mitigation                                     |
| ------ | --------- | ----------------------------------------- | -------- | ---------------------------------------------- |
| LAND-1 | HIGH      | Unclear what the product actually does    | Critical | Show a real finished site above the fold       |
| INT-3  | MEDIUM    | Don't know what to write in description   | Moderate | AI-assisted description helper, better prompts |
| INT-4  | HIGH      | 6 personality axes = fatigue              | High     | Reduce to 3-4, add "Quick mode"                |
| INT-6  | MEDIUM    | A/B/C comparisons require careful reading | Moderate | Simplify to 2 options, add preview             |
| INT-8  | MEDIUM    | AI wait + 4 mandatory questions           | Moderate | Allow skipping, instant cache                  |
| INT-9  | LOW       | Loading wait, nothing to do               | Low      | Data collection during wait                    |
| PREV-1 | HIGH      | Output not good enough, placeholders      | Critical | Real images, multi-page, guided reveal         |
| EXP-1  | VERY HIGH | User has no reason to come back           | Critical | Email capture, deployment, accounts            |

---

## Loading Screen Recommendations (INT-9)

The ~10-20 second generation wait is currently dead time. Here's how to make it productive:

### Stage 1 (0-4s): Micro-intake — Logo & Contact

**Show**: "While we build, want to add your logo?" + file upload area. Below: "Add your phone & address to auto-fill your contact section."
**Capture**: Logo file (→ Convex File Storage), phone, address.
**Output improvement**: Logo colors extracted for theme accent validation. Contact info populates contact component and footer.
**UI**: Small card below wireframe, "Optional — skip anytime."
**Events**: `loading.logo_uploaded`, `loading.contact_filled`

### Stage 2 (4-8s): Social proof preview

**Show**: "Here's what we built for a similar [siteType]:" + thumbnail of a real completed site.
**Capture**: None. Builds trust and sets quality expectations.
**UI**: Fade-in card with thumbnail + business name + "Built in 12 minutes" tagline.
**Events**: `loading.example_shown`, `loading.example_clicked`

### Stage 3 (8-14s): Email capture

**Show**: "Almost done! Where should we send your editable link?"
**Capture**: Email address — CRITICAL for retention and billing.
**UI**: Single email input + "Send me my site" button. "No thanks, just show me" skip.
**Events**: `loading.email_submitted`, `loading.email_skipped`

### Stage 4 (14s+): Archetype-keyed reassurance

**Show**: Rotating messages tied to brand archetype:

- The Guide: "Mapping your customer's path through every section..."
- The Expert: "Calibrating credibility signals and trust indicators..."
- The Creative: "Infusing creative energy into every section..."
- The Caretaker: "Making sure your site feels warm and welcoming..."
- The Rebel: "Sharpening your edge and stripping away the ordinary..."
- The Artisan: "Perfecting every detail, one section at a time..."
  **Capture**: None — anxiety reduction during long waits.
  **Events**: `loading.reassurance_shown`

---

## Immediate Action Items (Priority Order)

| #   | Action                                                                                                          | Step   | Impact          | Effort |
| --- | --------------------------------------------------------------------------------------------------------------- | ------ | --------------- | ------ |
| 1   | Fix inflated stats and fabricated testimonials on homepage                                                      | LAND-1 | Trust           | Low    |
| 2   | Add email capture during generation loading screen                                                              | INT-9  | Retention       | Low    |
| 3   | Add basic analytics (Plausible/PostHog)                                                                         | ALL    | Data            | Low    |
| 4   | Reduce personality axes from 6 to 4 (or add Quick mode)                                                         | INT-4  | Completion rate | Medium |
| 5   | Add guided "reveal moment" before showing full preview UI                                                       | PREV-1 | Wow factor      | Medium |
| 6   | Replace "Export ZIP" as primary CTA with "Put This Online"                                                      | EXP-1  | Conversion      | Medium |
| 7   | Add "Share Preview" link generation                                                                             | PREV-1 | Virality        | Medium |
| 8   | Collect logo + contact info during loading screen                                                               | INT-9  | Output quality  | Medium |
| 9   | Add remaining components to export pipeline (content-split, content-timeline, proof-beforeafter, media-gallery) | EXP-1  | Completeness    | Medium |
| 10  | Translate sidebar language from dev-speak to business-speak                                                     | PREV-1 | UX clarity      | Low    |

---

## Changelog

- **v2.0** (2026-02-12): Complete granular rewrite from full source code analysis. Added: exact option labels, exact validation rules, exact UI copy, exact data constants, exact component behavior, data flow summary, export file details, VLM evaluation flow, mobile-specific UI, feedback banner mechanics, dev panel tabs, fallback question bank coverage, sub-type inference, industry anti-reference mappings.
- **v1.0** (2026-02-12): Initial mapping from codebase analysis.
