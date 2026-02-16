# Complete System Data Flow — EasyWebsiteBuild

> This document describes the FULL system architecture needed for EasyWebsiteBuild to generate truly unique, culturally-aware websites that match any client's vision. It covers what exists today, what's planned, and what's missing.

## Pipeline Overview (Complete Vision)

The system operates as a 6-phase pipeline. Each phase feeds the next.

```
┌─────────────┐    ┌─────────────┐    ┌──────────────┐    ┌──────────┐    ┌───────────┐    ┌────────┐
│  STRUCTURED  │───▶│  CHARACTER  │───▶│     AI       │───▶│ ASSEMBLY │───▶│ REFINEMENT│───▶│ EXPORT │
│    INPUT     │    │   CAPTURE   │    │  PROCESSING  │    │          │    │   LOOP    │    │        │
└─────────────┘    └─────────────┘    └──────────────┘    └──────────┘    └───────────┘    └────────┘
  Steps 1-4          Steps 5-7          Steps 8-9          Rendering       Conversational    Download
  (Deterministic)    (Reaction-Based)   (AI + Fallback)    (Automated)     (AI Chat)         or Deploy
```

### What Exists Today (as of 2026-02-16)

✅ **Dual-mode Intake**: Express path (3-step, <90s) + Deep Brand Capture (9-step, ~3min)
✅ Structured Input (Steps 1-4)
✅ Character Capture — in-flow (Steps 5-7, deep mode) + post-generation (Brand Discovery sidebar)
✅ AI Processing (Steps 8-9, deep mode) + Deterministic-only (express mode, $0 cost)
✅ Assembly (AssemblyRenderer + ThemeProvider + 5-layer theme composition)
✅ **Customization**: sidebar panel with 7 presets, color picker, 5/14 fonts, headline editing, reset
✅ **Brand Discovery**: post-generation character capture with real-time theme/content feedback
✅ **Immersive Reveal**: 3-second full-screen preview before controls appear
✅ Export (HTML/CSS ZIP, with optional "Built with EWB" badge)
✅ **Shareable Preview Links** (`/s/[shareId]`) with customization snapshot persistence
✅ VLM Design Feedback Loop (screenshot → Claude Vision evaluation → theme adjustments)
✅ Dev Tooling (DevPanel with 6 tabs, named test cases, side-by-side comparison)
✅ User Satisfaction Capture (feedback banner + pipeline session logging)
✅ CSS visual system — 14 patterns, 4 dividers, 8 CSS effects, visual vocabulary, ImagePlaceholder, parallax
✅ Stock photo integration — Multi-provider (Unsplash/Pexels/Pixabay), context-aware, 24hr caching
✅ `VisualConfig` on `ComponentPlacement` — patterns and dividers flow through the spec pipeline
✅ Section component extended with divider/pattern/overlay props

### What's Missing (Next Priorities)

🔲 **Monetization** (P1) — Clerk auth + Stripe billing ($12/$29/$99 tiers) (BD-003-01)
🔲 **Distribution** (partial) — Homepage fix, email capture, social share templates (BD-003-03)
🔲 **R&D Quality Benchmark** — 20 reference sites, Claude Vision scoring, Wix comparison (BD-003-02)
🔲 **AI Design Chat** — Conversational refinement as Pro-tier feature (BD-003-04)
🔲 AI image generation (Gemini — Phase 5C)
🔲 Advanced scroll effects (CSS scroll-timeline — Phase 5D)
🔲 Multi-page management (add/remove/reorder pages post-generation)
🔲 Component-level editing (swap, configure, reorder sections)
🔲 Deploy pipeline (Vercel API, custom domains, hosting)
🔲 WCAG contrast enforcement (chroma.contrast() validation in theme generation)
🔲 Full Next.js project export (replacing static HTML/CSS)

---

## Phase 1: Structured Input (Steps 1-4) ✅ BUILT

Purpose: Classify the project and capture broad design preferences.

```
Step 1: Site Type ──────────┐
  13 categories              │
  Deterministic              │
                             │
Step 2: Conversion Goal ────┤  Local React State
  9 goal types               │
  Contextual to Step 1       │
                             │
Step 3: Business Identity ──┤
  businessName (required)    │
  description (free text)    │
                             │
Step 4: Personality ────────┘
  6-axis slider comparisons
  Output: [float x 6]
         │
         ▼ bridgeToStore()
  ┌──────────────────┐
  │   Zustand Store   │◄── localStorage persistence
  │   (ewb-intake)    │    questionsInputKey fingerprint
  └──────────────────┘
```

**What this captures:** WHAT they're building and BROAD aesthetic direction.
**What this misses:** WHY it should feel a certain way, HOW it should sound, WHAT it should NOT be.

---

## Phase 2: Character Capture (Steps 5-7) ✅ COMPLETE (Phase 4C)

Purpose: Extract the emotional, vocal, and cultural identity that makes the site unique.

```
Step 5: Emotional First Impression
  "What should visitors FEEL in the first 5 seconds?"
  ├── Select 1-2 primary emotions (from 10 options)
  ├── Optionally 1 secondary emotion
  └── Output: emotionalGoals { primary: string[], secondary?: string }

Step 6: Brand Voice & Copy DNA
  ├── 6A: Voice Tone (3 A/B/C copy comparisons)
  │   └── Output: voiceProfile { tone: "warm" | "polished" | "direct" }
  └── 6B: Narrative Prompts (optional fill-in-the-blank)
      ├── "People choose us because ___"
      ├── "They're frustrated with ___"
      ├── "After working with us, they feel ___"
      └── Output: narrativePrompts { whyChooseUs?, painPoint?, afterFeeling? }

Step 7: Visual Culture & Anti-References
  ├── 7A: Brand Archetype (select 1 of 6)
  │   guide | expert | creative | caretaker | rebel | artisan
  │   └── Output: brandArchetype: string
  └── 7B: Anti-References (select any from 8 options)
      corporate | cheap | clinical | salesy | generic | cluttered | boring | childish
      └── Output: antiReferences: string[]
```

**What this captures:** The SOUL of the brand — emotional target, voice, identity, boundaries.
**Data size:** Small (5 fields) but enormously impactful on output quality.

### Future Enhancement: Visual Mood Board (Phase 5+)

Between Steps 7 and 8, a future step would show curated mood boards — sets of 3-5 images representing distinct aesthetic directions. The user reacts (yes / almost / not at all) and the system narrows the visual direction.

This could pull from:

- Curated reference website screenshots (categorized by industry + style)
- Cross-domain references (architecture, fashion, interior design)
- Color palette presentations
- Typography specimens in context

This is the highest-impact future feature for visual accuracy but requires a curated image library to work well.

---

## Phase 3: AI Processing (Steps 8-9) ✅ BUILT (enhanced with character context)

Purpose: Generate targeted questions and a complete site specification.

```
Step 8: AI Discovery Questions
  ┌─────────────────────────────────────────────────┐
  │ Input to Claude:                                 │
  │  • siteType, conversionGoal                     │
  │  • businessName, description                     │
  │  • personalityVector interpretation              │
  │  • emotionalGoals ← NEW from Phase 2            │
  │  • voiceProfile ← NEW                           │
  │  • brandArchetype ← NEW                         │
  │  • antiReferences ← NEW                         │
  │  • narrativePrompts ← NEW                       │
  ├─────────────────────────────────────────────────┤
  │ Output: 4 targeted questions                     │
  │  • Specific to industry + character              │
  │  • Focus on content material + differentiators   │
  │  • Avoid re-asking what we already know          │
  ├─────────────────────────────────────────────────┤
  │ Fallback: Question bank (11 site types)          │
  └─────────────────────────────────────────────────┘
         │
    User answers → aiResponses[]
         │
         ▼
Step 9: Site Spec Generation
  ┌─────────────────────────────────────────────────┐
  │ Input to Claude:                                 │
  │  • ALL intake data from Steps 1-8                │
  │  • Available components (18) + variants          │
  │  • Emotional → design constraint mapping         │
  │  • Voice → copy style rules                      │
  │  • Archetype → content positioning rules         │
  │  • Anti-references → elimination constraints     │
  │  • Narrative prompts → raw copy material          │
  ├─────────────────────────────────────────────────┤
  │ Output: SiteIntentDocument                       │
  │  • pages[] with component selections             │
  │  • All content/copy generated                    │
  │  • Voice-appropriate, emotion-targeted            │
  │  • Industry-specific, name-accurate               │
  ├─────────────────────────────────────────────────┤
  │ Fallback: Deterministic with voice-keyed content │
  └─────────────────────────────────────────────────┘
         │
         ▼
  ┌────────────────────────┐
  │ Convex DB: siteSpecs   │
  └────────────────────────┘
```

### SiteIntentDocument Schema (Complete)

```typescript
interface SiteIntentDocument {
  // Identity
  sessionId: string;
  businessName: string;
  tagline?: string;

  // Classification
  siteType: string;
  conversionGoal: string;
  industry?: string;

  // Design
  personalityVector: number[]; // [6 floats]

  // Character (NEW — from Phase 2)
  emotionalGoals?: { primary: string[]; secondary?: string };
  voiceProfile?: { tone: "warm" | "polished" | "direct" };
  brandArchetype?: string;
  antiReferences?: string[];
  narrativePrompts?: { whyChooseUs?: string; painPoint?: string; afterFeeling?: string };

  // Structure
  pages: PageSpec[];

  // Metadata
  metadata: {
    method: "ai" | "deterministic";
    totalPages: number;
    totalComponents: number;
    aiInteractions: number;
    confidence: number;
    createdAt: number;
  };
}

interface PageSpec {
  slug: string;
  title: string;
  purpose: string;
  components: ComponentPlacement[];
}

interface VisualConfig {
  pattern?: string; // CSS background value
  dividerBottom?: "wave" | "angle" | "curve" | "zigzag" | "none";
  parallaxEnabled?: boolean;
  scrollRevealIntensity?: "none" | "subtle" | "moderate" | "dramatic";
}

interface ComponentPlacement {
  componentId: string;
  variant: string;
  order: number;
  content: Record<string, any>; // Component-specific content
  visualConfig?: VisualConfig; // CSS patterns, dividers, scroll effects (Phase 5A)
}
```

---

## Phase 4: Assembly ✅ BUILT (enhanced with emotional overrides + VLM feedback loop + CSS visual system)

Purpose: Render the spec as a live, interactive website preview.

```
/demo/preview?session=<sessionId>
         │
         ├── getSiteSpec(sessionId) → Fetch from Convex
         │
         ├── AssemblyRenderer
         │   ├── generateThemeFromVector(personalityVector)
         │   │         │
         │   │         ▼
         │   │   applyEmotionalOverrides(theme, emotionalGoals, antiReferences)
         │   │         │
         │   │         ▼
         │   │   Final ThemeTokens (87 CSS Custom Properties)
         │   │
         │   ├── font-loader → Dynamic Google Fonts <link> injection
         │   │
         │   ├── COMPONENT_REGISTRY
         │   │   Maps componentId → React component
         │   │   18 components registered
         │   │   Handles unknown IDs gracefully (skip + warn)
         │   │
         │   ├── Sort components by order
         │   ├── Resolve visualConfig → Section props (Phase 5A)
         │   │   ├── generatePattern(patternId, themeColor) → CSS background
         │   │   ├── dividerBottom → SectionDivider SVG component
         │   │   └── patternOpacity, patternSize, patternPosition
         │   ├── Wrap content components in <Section> (alternating backgrounds + visual config)
         │   ├── Render ImagePlaceholder for missing images (hero-split, content-split)
         │   ├── Skip Section wrapper for nav-sticky + footer-standard
         │   │
         │   └── <ThemeProvider tokens={finalTheme}>
         │         <NavSticky ... />
         │         <Section dividerBottom="wave" pattern={css}><HeroCentered ... /></Section>
         │         <Section background="surface"><ContentFeatures ... /></Section>
         │         ...
         │         <FooterStandard ... />
         │       </ThemeProvider>
         │
         ├── PreviewToolbar
         │   ├── Business name display
         │   ├── Page tabs (if multi-page)
         │   ├── Viewport: Desktop | Tablet | Mobile
         │   ├── Edit Theme (future)
         │   ├── Export → triggers download
         │   └── Refinement Chat toggle ← NEW (Phase 5)
         │
         └── PreviewSidebar
             ├── Business info (name, tagline, type, goal)
             ├── Pages list (clickable navigation)
             ├── Theme (color swatches, font names)
             ├── Components list (id + variant)
             ├── Personality visualization (6 axis bars)
             ├── Emotional goals (emoji + labels) ← NEW
             ├── Voice tone ← NEW
             ├── Archetype ← NEW
             └── Anti-references ← NEW
```

---

## Phase 5: Refinement Loop 🔲 NOT YET BUILT

Purpose: Let the user adjust the generated site through natural language conversation.

This is the feature you described: a chat interface where the user can type things like:

- "Make it more brown and earthy"
- "I want the site to feel darker and more moody"
- "Add a booking page"
- "The hero section needs to be more dramatic"
- "Can we add a team section with our 3 barbers?"
- "Remove the testimonials"
- "The copy is too formal, make it more casual"

### Architecture

```
┌──────────────────────────────────────────────────────┐
│                 REFINEMENT CHAT                       │
│                                                      │
│  User types: "Make it darker and more luxury"         │
│         │                                            │
│         ▼                                            │
│  ┌───────────────────────────────────────────┐       │
│  │ Claude API (Convex Action)                 │       │
│  │                                           │       │
│  │ System prompt:                            │       │
│  │  "You are a website design assistant.     │       │
│  │   The user has a generated website.       │       │
│  │   Given their request, determine what     │       │
│  │   changes to make to the site spec.       │       │
│  │                                           │       │
│  │   You can:                                │       │
│  │   1. ADJUST THEME — modify personality    │       │
│  │      vector axes or override tokens       │       │
│  │   2. ADD COMPONENT — insert a new         │       │
│  │      component at a specified position    │       │
│  │   3. REMOVE COMPONENT — remove by ID      │       │
│  │   4. SWAP COMPONENT — replace one         │       │
│  │      component with another               │       │
│  │   5. REWRITE COPY — regenerate text       │       │
│  │      content for specific components      │       │
│  │   6. ADD PAGE — create a new page         │       │
│  │   7. REORDER — move components            │       │
│  │                                           │       │
│  │   Return a JSON patch describing the      │       │
│  │   changes to apply to the spec."          │       │
│  └───────────────────┬───────────────────────┘       │
│                      │                               │
│                      ▼                               │
│  ┌───────────────────────────────────────────┐       │
│  │ Spec Patch                                │       │
│  │                                           │       │
│  │ { action: "adjust_theme",                 │       │
│  │   changes: {                              │       │
│  │     personalityVector: [0.6,0.9,0.3,      │       │
│  │       0.9,0.4,0.5],  // bold axis bumped  │       │
│  │     tokenOverrides: {                     │       │
│  │       colorBackground: "#0a0a0a",         │       │
│  │       colorSurface: "#1a1a1a"             │       │
│  │     }                                     │       │
│  │   }                                       │       │
│  │ }                                         │       │
│  │                                           │       │
│  │ { action: "add_component",                │       │
│  │   page: "/",                              │       │
│  │   component: {                            │       │
│  │     componentId: "team-grid",             │       │
│  │     variant: "cards",                     │       │
│  │     order: 5,                             │       │
│  │     content: { ... }                      │       │
│  │   }                                       │       │
│  │ }                                         │       │
│  └───────────────────┬───────────────────────┘       │
│                      │                               │
│                      ▼                               │
│  Apply patch to SiteIntentDocument in memory         │
│  Re-render AssemblyRenderer with updated spec        │
│  Show change description in chat: "Done! I made      │
│  the background darker and increased the contrast."  │
│                                                      │
│  Save updated spec to Convex (new version)           │
│  Maintain change history for undo                    │
└──────────────────────────────────────────────────────┘
```

### Refinement Chat — Spec Patch Types

```typescript
type SpecPatch =
  | {
      action: "adjust_theme";
      changes: { personalityVector?: number[]; tokenOverrides?: Partial<ThemeTokens> };
    }
  | { action: "add_component"; page: string; component: ComponentPlacement }
  | { action: "remove_component"; page: string; componentOrder: number }
  | {
      action: "swap_component";
      page: string;
      componentOrder: number;
      newComponent: ComponentPlacement;
    }
  | { action: "rewrite_copy"; page: string; componentOrder: number; content: Record<string, any> }
  | { action: "add_page"; page: PageSpec }
  | { action: "remove_page"; slug: string }
  | { action: "reorder_components"; page: string; newOrder: number[] }
  | { action: "adjust_voice"; newTone: "warm" | "polished" | "direct" }
  | { action: "regenerate_all_copy" };

interface RefinementMessage {
  role: "user" | "assistant";
  content: string;
  patches?: SpecPatch[]; // Patches applied (for history/undo)
  timestamp: number;
}
```

### Key Design Decisions for Refinement

1. **Patches, not regeneration.** Each user request produces a PATCH to the existing spec, not a full regeneration. This is faster, preserves approved content, and allows undo.

2. **Optimistic preview.** Apply the patch immediately to the in-memory spec and re-render. If the user doesn't like it, undo is instant.

3. **Change history.** Every patch is stored. The user can undo any change. The full history informs future generation quality (knowledge base).

4. **Scoped changes.** "Make it darker" only affects theme tokens, not content. "Add a team section" only inserts a component, doesn't change existing ones. The AI must understand scope.

5. **Natural language to structured action.** The AI's job is to translate "make it feel more luxury" into specific token adjustments (more whitespace, slower animations, muted palette) — not to regenerate the entire site.

---

## Phase 6: Export ✅ BUILT (Basic)

```
Current: HTML + CSS + README → ZIP download
Future:
  ├── Next.js project export (full React components) ← Phase 6 roadmap
  ├── Vercel deployment via API ← Phase 6 roadmap
  ├── Custom domain configuration ← Phase 6 roadmap
  └── Subscription hosting with visual editor ← Phase 7 roadmap
```

---

## Data Storage Summary

| Store              | Technology                     | What It Holds                                    | Persistence                               |
| ------------------ | ------------------------------ | ------------------------------------------------ | ----------------------------------------- |
| Intake State       | Zustand + localStorage         | Steps 1-7 responses, session ID, AI Q&A          | Browser session (cleared on "Start Over") |
| Site Specs         | Convex (siteSpecs table)       | Generated SiteIntentDocuments                    | Permanent (keyed by sessionId)            |
| Intake Responses   | Convex (intakeResponses)       | Individual step responses                        | Permanent (keyed by sessionId)            |
| Refinement History | Convex (future)                | Chat messages + spec patches                     | Permanent (keyed by specId)               |
| Knowledge Base     | Convex (future)                | Intent paths, proven recipes, content patterns   | Permanent, evolving                       |
| Component Library  | Code (src/components/library/) | 18 React components + manifests                  | Bundled in app                            |
| Theme System       | Code (src/lib/theme/)          | Generation function, 7 presets, 87 tokens        | Bundled in app                            |
| Visual System      | Code (src/lib/visuals/)        | 14 CSS patterns, 4 dividers, visual vocabulary   | Bundled in app                            |
| VLM Evaluations    | Convex (vlmEvaluations)        | 5-dimension scores, theme adjustments            | Permanent (keyed by sessionId)            |
| Pipeline Logs      | Convex (pipelineLogs)          | Full generation trace (prompt, response, timing) | Permanent (keyed by sessionId)            |
| Feedback           | Convex (feedback)              | Satisfaction ratings with dimension breakdowns   | Permanent (keyed by sessionId)            |
| Test Cases         | Convex (testCases)             | Named intake snapshots for regression testing    | Permanent                                 |
| Asset Library      | Convex File Storage (future)   | Images, icons, generated assets                  | Permanent                                 |

---

## Missing Pieces for Full Vision

### 1. Image Strategy System

**Phase 5A (DONE):** CSS visual foundation provides intentional image substitutes:

- `ImagePlaceholder` component renders gradient/pattern/shimmer variants where images would go
- `hero-split` and `content-split` images made optional — CSS gradient fallback
- `media-gallery` and `proof-beforeafter` skipped in deterministic fallback (require real images)
- No broken/empty image tags in generated sites

**Phase 5B (NEXT):** Stock photo API integration:

- Multi-provider search (Unsplash/Pexels/Pixabay) with keyword builder
- Context-aware keyword enhancement using business type + emotional goals + component type
- Image caching via Convex `imageCache` table (24hr TTL)
- Color-filtered search using theme primary hue

**Phase 5C (PLANNED):** AI image generation:

- convex-nano-banana (Gemini) for custom imagery
- Priority queue: hero first, below-fold last
- Reactive loading in preview page (shimmer → real image swap)

**Future:** User upload — Convex File Storage, drag-and-drop replacement in preview

### 2. Multi-Page Management

Currently: Spec can define multiple pages but the UI is single-page focused.
Needed:

- Page navigation in preview
- Add/remove pages through refinement chat
- Page templates (About, Services, Contact, Blog, Gallery) with appropriate default component compositions
- Cross-page navigation consistency (nav links match actual pages)

### 3. Real Image Handling in Components

**Phase 5A (DONE):** Components handle missing images gracefully:

- `hero-split` and `content-split` `image` field is optional — renders `ImagePlaceholder` when absent
- `ImageSource` type extended with `attribution` field (photographer, source, URL) for stock photos
- `ImageSource` type supports `blurDataURL` for blur-up loading

**Phase 5B (NEXT):**

- Next.js Image component integration for stock photos (already used, needs `remotePatterns` config)
- `blurDataURL` populated from stock API thumbnails
- Lazy loading for below-fold images, priority loading for hero

### 4. Form Submission Backend

Currently: FormContact is visual only (shows success animation on submit).
Needed:

- Convex mutation to store form submissions
- Email notification to site owner
- Spam prevention (honeypot, rate limiting)
- Webhook support for third-party integrations

### 5. Analytics & Knowledge Base (Phase 5 Roadmap)

Currently: Specs are stored but not analyzed.
Needed:

- Track which components get removed most often (poor matches)
- Track which themes get modified most (generation gaps)
- Semantic embedding for intent path similarity matching
- Proven recipe promotion logic
- Content pattern extraction from approved copy

---

## Complete Data Flow Diagram (Full Vision)

```
┌──────────────────────────────────────────────────────────────────────┐
│                        STRUCTURED INPUT (Steps 1-4)                  │
│                                                                      │
│  Site Type → Goal → Business Name + Description → Personality Vector │
│                              │                                       │
│                    bridgeToStore() → Zustand (localStorage)          │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      CHARACTER CAPTURE (Steps 5-7)                   │
│                                                                      │
│  Emotional Goals → Voice Profile → Narrative Prompts                 │
│  Brand Archetype → Anti-References                                   │
│  [Future: Visual Mood Board reactions]                                │
│                              │                                       │
│                    All stored in Zustand                              │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       AI PROCESSING (Steps 8-9)                      │
│                                                                      │
│  generateQuestions (Claude) ──→ 4 targeted questions                 │
│       │                        ├── Informed by character data        │
│       │                        └── Fallback: question bank           │
│       ▼                                                              │
│  User answers (aiResponses)                                          │
│       │                                                              │
│  generateSiteSpec (Claude) ──→ SiteIntentDocument                    │
│       │                        ├── Component selection               │
│       │                        ├── Voice-matched copy                │
│       │                        ├── Emotion-targeted content          │
│       │                        └── Fallback: deterministic + voice   │
│       │                                                              │
│       ▼                                                              │
│  Convex DB: siteSpecs                                                │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          ASSEMBLY                                    │
│                                                                      │
│  personalityVector ──→ generateThemeFromVector() ──→ 87 base tokens  │
│  emotionalGoals ─────→ applyEmotionalOverrides() ──→ final tokens    │
│                                                                      │
│  font-loader ──→ Google Fonts injection                              │
│  COMPONENT_REGISTRY ──→ componentId → React component                │
│  Section wrappers ──→ alternating backgrounds                        │
│  ThemeProvider ──→ CSS Custom Properties on render tree               │
│                                                                      │
│  Output: Live interactive preview at /demo/preview                   │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      REFINEMENT LOOP (Chat)                          │
│                                                                      │
│  User: "Make it darker and add a team section"                       │
│       │                                                              │
│       ▼                                                              │
│  Claude: Interpret → Generate SpecPatch[]                            │
│       │   ├── adjust_theme { colorBackground: "#0a0a0a" }           │
│       │   └── add_component { team-grid, cards, order: 5 }          │
│       │                                                              │
│       ▼                                                              │
│  Apply patches → Re-render preview (instant)                         │
│  Store patches → Change history (undoable)                           │
│  Update spec → Convex (new version)                                  │
│                                                                      │
│  User: "That's perfect!" → Approve                                   │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                           EXPORT                                     │
│                                                                      │
│  Option A: Download (One-Time)                                       │
│    generateProject(spec) → HTML + CSS + README → ZIP                 │
│    [Future: Full Next.js project export]                             │
│                                                                      │
│  Option B: Deploy (Subscription)                                     │
│    [Future: Vercel API deployment]                                   │
│    [Future: Custom domain setup]                                     │
│    [Future: Visual editor for ongoing changes]                       │
│                                                                      │
│  Knowledge Base Feedback:                                            │
│    Approved spec → proven recipe candidates                          │
│    Refinement patches → improvement signals                          │
│    Component removals → poor match indicators                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Analogy: How This Compares to Image Generation

You mentioned the comparison to ChatGPT image generation — "oil painting of a dog" vs "8-bit cat." Here's how the parallel maps:

| Image Gen Concept           | EasyWebsiteBuild Equivalent                          |
| --------------------------- | ---------------------------------------------------- |
| Art style ("oil painting")  | Personality vector + emotional goals + archetype     |
| Subject ("dog")             | Site type + business description + services          |
| Mood ("serene sunset")      | Emotional goals + voice tone                         |
| Negative prompt ("no text") | Anti-references ("not corporate", "not salesy")      |
| Aspect ratio                | Page structure (single page vs multi-page)           |
| Model fine-tuning           | Knowledge base (proven recipes get better over time) |
| Inpainting (edit region)    | Refinement chat (patch specific components)          |
| img2img (reference image)   | Visual mood board (future: react to reference sites) |
| Upscaling                   | Export quality (HTML/CSS → Next.js → deployed site)  |

The key insight: image generators work because they capture BOTH structure (composition, subject) AND style (medium, mood, cultural reference) as separate controllable dimensions. Your builder needs to do the same — structure (components, layout) is separate from character (emotion, voice, culture).
