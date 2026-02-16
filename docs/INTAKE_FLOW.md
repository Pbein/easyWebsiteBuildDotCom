# Intake Flow Design — Intent Capture System

> **Implementation Status (as of 2026-02-16):** Fully implemented in Phase 3, enhanced through Phase 6C.
>
> - **Dual-mode intake** at `/demo`:
>   - **Express Path** (default, 3 steps, <90 seconds):
>     - Step 0: Mode selector — "Express Build (60s)" vs "Deep Brand Capture (3 min)"
>     - Step 1: Site type (12 categories)
>     - Step 2: Primary goal (context-aware per site type)
>     - Step 3: Business name + description (min 10 chars)
>     - → Deterministic generation with neutral personality `[0.5, 0.5, 0.5, 0.5, 0.5, 0.5]` ($0 cost)
>   - **Deep Brand Capture** (9 steps, ~3 minutes):
>     - Steps 1-4 (Setup) — Site type → goal → description → personality A/B comparisons (local React state)
>     - Step 5 (Emotional Goals) — Select 1-2 emotional outcomes from 10 cards
>     - Step 6 (Voice & Narrative) — 3 A/B/C voice comparisons (warm/polished/direct) + 3 optional narrative prompts
>     - Step 7 (Culture & Anti-References) — 6 brand archetype cards + 10 anti-reference trade-off chips + industry-specific anti-refs
>     - Step 8 (AI Discovery) — `Step5Discovery` component calls `generateQuestions` Convex action (Claude Sonnet), 4 personalized questions, comprehensive fallback bank for 11 site types, fingerprint-based staleness detection (`questionsInputKey`), review mode
>     - Step 9 (Generation) — `Step6Loading` with animated wireframe assembly, calls `generateSiteSpec` action, auto-redirects to `/demo/preview`
> - **Express loading screen** — 4 building steps (3.2s), 4 wireframe blocks, logarithmic progress (decay 3000ms)
> - **Deep loading screen** — 11 building steps (16.4s), 7 wireframe blocks, logarithmic progress (decay 8000ms)
> - **Bridge pattern** — Steps 1-4 use local React state, `bridgeToStore()` syncs to Zustand at Step 4→5 (deep) or Step 3→9 (express) transition
> - **Brand character** — emotionalGoals, voiceProfile, brandArchetype, antiReferences, narrativePrompts stored in Zustand + Convex (all optional, backward compatible). Also available post-generation via Brand Discovery sidebar.
> - **Progress bar** — Express: single smooth bar (step/3). Deep: 3-segment bar: Setup (1-4) | Character (5-7) | Discovery (8-9)
> - **State management** — Zustand store (`useIntakeStore`) with `expressMode` flag + localStorage persistence
> - **Convex storage** — `siteSpecs` table with `saveSiteSpec` mutation and `getSiteSpec` query; `intakeResponses` table with `by_session` index
> - **Live preview** — `/demo/preview` page with 3-second immersive reveal, customization sidebar with Brand Discovery, DevPanel (Ctrl+Shift+D), toolbar with screenshot capture, VLM evaluation, share button, and export button (ZIP download)
> - **PostHog events** — `express_mode_selected`, `express_generation_started`, `express_generation_completed`, `reveal_completed`

## Overview

The intake flow is the guided discovery experience that replaces the traditional "pick a template" approach. It extracts what a client actually needs through structured questions, visual comparisons, and AI-powered conversation.

## User Experience Flow

### Step 1: Welcome & Quick Start

**Screen**: Clean welcome screen with a single question
**Question**: "What kind of website are you building?"

Options presented as visual cards with icons:

- Business Website — "Showcase your business and attract clients"
- Booking Website — "Let customers book appointments or services"
- Online Store — "Sell products directly online"
- Blog — "Share your writing and ideas"
- Portfolio — "Showcase your creative work"
- Personal Website — "Your personal corner of the internet"
- Educational — "Teach, train, or share knowledge"
- Community — "Build a membership or community space"
- Nonprofit — "Rally support for your cause"
- Event — "Promote and manage an event"
- Landing Page — "One focused page with a single goal"
- Directory — "List and organize businesses or resources"
- Something else — (Free text → AI interpretation)

### Step 2: Primary Goal

**Screen**: Based on Step 1 selection, show the most relevant goals

For Business Website:

- "Get people to contact me" → Contact/inquiry conversion
- "Get people to book a consultation" → Booking conversion
- "Showcase my services and build trust" → Information + credibility
- "Sell my products/services directly" → Commerce conversion
- "Something else" → Free text

For Portfolio:

- "Get hired / freelance work" → Professional showcase
- "Get gallery/label/publisher attention" → Industry showcase
- "Build my audience/following" → Fan engagement
- "Sell my work directly" → Commerce
- "Something else" → Free text

### Step 3: Industry & Context

**Screen**: Text input with smart suggestions

"Tell us about your business or project in a sentence or two."

Examples shown as placeholder text:

- "I'm opening a luxury med spa in Miami"
- "I'm a wedding photographer based in Portland"
- "We sell handmade ceramics online"

The AI extracts: industry, location, scale, target audience, competitive positioning.

### Step 4: Brand Personality

**Screen**: Series of visual A/B comparisons (6 rounds)

Each round shows two rendered website sections side by side, representing opposite poles of a personality axis. User clicks the one that feels more like their brand, or adjusts a slider between them.

**Round 1: Density**
Left: A spacious, minimal hero section with lots of whitespace
Right: A rich, layered hero with background textures, multiple elements

**Round 2: Tone**
Left: A playful, colorful section with rounded elements and casual copy
Right: A serious, refined section with sharp lines and professional copy

**Round 3: Temperature**
Left: A warm section with earth tones, cream backgrounds, organic shapes
Right: A cool section with blue-gray tones, crisp whites, geometric shapes

**Round 4: Weight**
Left: A light, airy section with thin fonts and subtle colors
Right: A bold, heavy section with thick fonts and strong contrast

**Round 5: Era**
Left: A classic section with serif fonts, traditional layout, timeless feel
Right: A modern section with sans-serif, contemporary layout, cutting-edge feel

**Round 6: Energy**
Left: A calm, serene section with no animation, static elements
Right: A dynamic section with motion, scroll effects, interactive elements

Each choice maps to a value on the 0-1 axis. Clicking "left" = 0.1-0.3, "slightly left" = 0.3-0.4, "center" = 0.5, etc.

**Bridge Pattern:** At the Step 4→5 transition, `bridgeToStore()` syncs all local React state (siteType, goal, businessName, description, personalityVector) into the Zustand store, which persists to localStorage.

### Step 5: Deep Discovery (AI-Powered)

**Screen**: Chat-like interface with AI-generated questions

Based on all previous answers, Claude generates 4 targeted questions. These are presented one at a time in a conversational format.

Example for luxury med spa (business + booking + luxury personality):

Question 1: "What specific services does your med spa offer? (This helps us build your services section)"
→ User types: "Botox, dermal fillers, chemical peels, facials, body sculpting, IV therapy"

Question 2: "How should clients book — directly online with a calendar, or contact you first for a consultation?"
→ User selects: "Contact first for consultation" or "Book directly online"

Question 3: "What makes your med spa different from competitors? What's your unique selling point?"
→ User types: "Board-certified physicians only, private luxury suites, personalized treatment plans"

Question 4: "Do you have professional brand photography, or will you need us to source imagery?"
→ User selects: "I have photos" / "I need sourced imagery" / "Mix of both"

#### Staleness Detection & Review Mode

Step 5 uses a fingerprint-based system to handle returning users:

**`questionsInputKey`** — A fingerprint string computed from `${siteType}|${goal}|${businessName}|${description.slice(0,100)}`. This is stored in the Zustand store when questions are generated.

**On mount logic:**

```
1. Compute currentKey from current intake data
2. Compare with stored questionsInputKey

If keys match AND all questions answered:
  → Show REVIEW MODE (read-only answers with "Use these" / "Update" buttons)

If keys match AND partially answered:
  → Resume from where user left off

If keys DON'T match OR no questions exist:
  → Clear old Q&A, generate fresh questions
  → Store new questionsInputKey after generation
```

**Review mode UI:**

- All 4 Q&A pairs displayed in a summary list
- "These answers look good" button → proceeds to Step 6
- "Update my answers" button → clears responses, resets to question 1

### Step 6: Preview & Proposal

**Screen**: Full rendered preview of the proposed website

The system generates:

1. A visual preview using real components with placeholder/AI-generated content
2. A proposed sitemap sidebar showing all pages
3. Theme details (color palette, font pairing, style notes)
4. Component breakdown per page

User can:

- Approve and export (ZIP download)
- Request changes ("make it darker", "use a different hero style", "add a team section")
- Go back and adjust personality or answers
- Start over

## Technical Implementation

### Intake State Management

```typescript
interface IntakeState {
  // Step tracking
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  completedSteps: number[];

  // Step 1: Site Type
  siteType: string | null;

  // Step 2: Primary Goal
  conversionGoal: string | null;

  // Step 3: Industry & Context
  businessName: string;
  businessDescription: string;

  // Step 4: Brand Personality
  personalityVector: [number, number, number, number, number, number];

  // Step 5: Deep Discovery
  aiQuestions: AIQuestion[];
  aiResponses: Record<string, string>; // questionId → response
  questionsInputKey: string | null; // Fingerprint for staleness detection

  // Step 6: Generation
  sessionId: string | null;
  specId: string | null;

  // Actions
  setSiteType: (type: string) => void;
  setGoal: (goal: string) => void;
  setBusinessName: (name: string) => void;
  setBusinessDescription: (desc: string) => void;
  setPersonalityVector: (vector: [number, number, number, number, number, number]) => void;
  setAiQuestions: (questions: AIQuestion[]) => void;
  setAiResponse: (questionId: string, response: string) => void;
  setSessionId: (id: string) => void;
  setSpecId: (id: string) => void;
  reset: () => void;
}

interface AIQuestion {
  id: string;
  question: string;
  type: "text" | "select";
  options?: string[];
}
```

### Decision Tree Storage (Convex)

```typescript
// convex/schema.ts
intakePaths: defineTable({
  step: v.string(),
  question: v.string(),
  inputType: v.union(v.literal("deterministic"), v.literal("ai_generated")),
  userInput: v.string(),
  interpretation: v.string(),
  resultingDecisions: v.object({
    componentsSelected: v.optional(v.array(v.string())),
    themeAdjustments: v.optional(v.object({})),
    pagesAdded: v.optional(v.array(v.string())),
    contentStructure: v.optional(v.object({})),
  }),
  embedding: v.optional(v.array(v.float64())),
  usageCount: v.number(),
  confirmationRate: v.number(),
  status: v.union(v.literal("candidate"), v.literal("proven"), v.literal("deprecated")),
});
```

### AI Integration Points

**Step 5 — Question Generation (`convex/ai/generateQuestions.ts`):**

```
System: You are a web design consultant. Based on the client profile,
generate exactly 4 targeted discovery questions that will help build
their ideal website. Mix of text input and select questions.

Client Profile:
- Site Type: {siteType}
- Goal: {conversionGoal}
- Business: {businessDescription}
- Business Name: {businessName}
- Brand Personality: {personalityVector interpretation}

Return questions as JSON array with id, question, type, options, purpose.
```

**Fallback:** Comprehensive question bank with curated questions for 11 site types (business, booking, ecommerce, blog, portfolio, personal, educational, community, nonprofit, event, landing).

**Step 6 — Spec Generation (`convex/ai/generateSiteSpec.ts`):**

```
System: Based on the complete intake data, generate a SiteIntentDocument.
Select from 18 available components with appropriate variants and
content that matches each component's type interface exactly.

Available Components (18):
- nav-sticky, hero-centered, hero-split, content-features, content-split,
  content-text, content-stats, content-accordion, content-timeline,
  content-logos, cta-banner, form-contact, footer-standard,
  proof-testimonials, proof-beforeafter, team-grid, commerce-services,
  media-gallery

Component Selection Guidelines:
- Every page MUST have nav-sticky and footer-standard
- Homepage SHOULD have a hero component
- Use content-stats for businesses with impressive numbers
- Use commerce-services for service-based businesses
- Use team-grid when team presence matters
- Use content-accordion for FAQ sections
- Use content-logos for trust/credibility building

Return a complete SiteIntentDocument as JSON.
```

**Fallback:** Deterministic spec generation with personality-driven variant selection, site-type-based component selection, and content generation using helper functions (`getStatsForSiteType`, `getServicesForSiteType`, `getTeamForSiteType`, `getTrustLogos`, `getFaqForSiteType`).

## Data Flow Diagram

```
User Input (Steps 1-4)
    │
    ├── siteType, conversionGoal (Step 1-2)
    ├── businessName, businessDescription (Step 3)
    └── personalityVector [6 floats] (Step 4)
          │
          ▼
    bridgeToStore() ──→ Zustand Store (localStorage)
          │
          ▼
    Step 5: generateQuestions (Convex Action)
          │
          ├── AI Path: Claude Sonnet generates 4 questions
          └── Fallback: Question bank by site type
                │
                ▼
          User answers 4 questions
                │
                ▼
    Step 6: generateSiteSpec (Convex Action)
          │
          ├── AI Path: Claude Sonnet generates full spec
          └── Fallback: Deterministic component selection + content
                │
                ▼
          SiteIntentDocument (JSON)
                │
                ├── saveSiteSpec() → Convex DB (siteSpecs table)
                │
                ▼
          /demo/preview?session=<sessionId>
                │
                ├── getSiteSpec() → Fetch from Convex
                ├── AssemblyRenderer → Live preview
                └── Export → ZIP download (HTML/CSS/README)
```

## Progressive Disclosure

The flow should feel light and fast. Principles:

- One question per screen (mobile-first)
- Visual choices over text whenever possible
- Progress indicator showing completion percentage
- Ability to go back to any step
- Estimated time: "This takes about 3 minutes"
- No required account creation until they want to save/build

## Edge Cases

**User selects "Something else" at any step:**

- Show text input
- AI interprets and maps to closest known category
- Store as candidate path for future promotion

**User has strong existing brand:**

- Option to upload brand guidelines, logo, colors
- System extracts tokens from uploaded assets
- Personality assessment adjusts to complement existing brand

**User is unsure about answers:**

- Provide "I'm not sure" option on personality questions (maps to 0.5 center)
- AI can suggest based on industry norms: "Most luxury service businesses prefer..."

**User returns to Step 5 with same inputs:**

- Review mode shows previous answers
- User can confirm or re-answer

**User returns to Step 5 with different inputs:**

- Old questions/answers are cleared
- Fresh questions generated for new context

**User wants to skip ahead:**

- Allow skipping to preview with defaults filled in
- Skipped questions use industry-standard defaults
- Note which defaults were used so they can refine later
