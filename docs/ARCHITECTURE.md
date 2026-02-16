# Architecture Documentation — EasyWebsiteBuild

> **Implementation Status (as of 2026-02-16):**
>
> - Layer 1 (Intent Capture): **Fully implemented** — Dual-mode intake: **Express path** (3-step, <90s, default) and **Deep Brand Capture** (9-step, ~3min). Express uses neutral personality + deterministic generation ($0). Deep path includes AI-powered discovery questions (Claude Sonnet) with deterministic fallback. Zustand state management with `expressMode` flag + localStorage persistence. Brand character capture (emotional goals, voice tone, brand archetype, anti-references) available both in-flow (Steps 5-7, deep mode) and post-generation (Brand Discovery sidebar).
> - Layer 2 (Component Assembly): **Fully implemented** — 24 components across 8 categories (4 refactored to shared.tsx + variants/ pattern), assembly engine with `COMPONENT_REGISTRY`, `AssemblyRenderer` (spec → live site), AI-driven + deterministic spec generation (all 24 components supported), live preview at `/demo/preview` with responsive viewport controls + 3-second immersive reveal. Export pipeline generates downloadable ZIP (HTML/CSS/README). CSS visual foundation: `VisualConfig` on `ComponentPlacement`, section dividers, CSS patterns, image placeholders, parallax scroll effects. 8 CSS effects. Stock photo integration (Unsplash/Pexels/Pixabay).
> - Layer 3 (Theming): **Fully implemented** — 87 tokens, 7 presets, `generateThemeFromVector()`, ThemeProvider + useTheme hook, dynamic Google Font loading. **5-layer theme composition**: base → VLM → emotional → color → font. Post-generation customization sidebar with Brand Discovery (real-time theme/content feedback). `deriveThemeFromPrimaryColor()` for single-hex palette derivation.
> - Layer 4 (Knowledge Base): Schema tables created (`intentPaths`, `recipes`, `components`, `themes`, `assets`). Embedding/similarity matching system not yet built.
> - Layer 5 (Distribution): **Partially implemented** — Shareable preview links (`/s/[shareId]`) with customization snapshot persistence, "Built with EWB" badge, `sharedPreviews` Convex table. Share button with Web Share API (mobile). OG meta and social templates pending.
> - Platform website: Complete (Homepage, Demo, Docs, Preview, Demo Preview, Share pages). Homepage and Docs pages converted to Server Components.

## System Overview

EasyWebsiteBuild is an AI-powered website assembly platform built on three core layers:

1. **Intent Capture Layer** — Guided discovery that extracts what a client actually needs
2. **Component Assembly Engine** — Modular building blocks + composition logic
3. **Theming & Style System** — Design tokens that make each site unique

These layers work together in a pipeline: Intent → Spec → Assembly → Preview → Export/Delivery.

---

## Layer 1: Intent Capture System

### Purpose

Replace the traditional "pick a template" approach with an intelligent conversation that captures the real requirements: business goals, brand personality, content inventory, and conversion objectives.

### The Intake Flow

#### Phase A: Quick Classification (Deterministic)

No AI calls needed. User selects from known categories:

**Site Type:**

- Business Website
- Booking/Appointment Website
- E-commerce Website
- Blog Website
- Content-driven Website
- Portfolio Website
- Personal Website
- Educational Website
- Membership/Community Website
- Nonprofit/Charity Website
- Event Website
- One-page/Landing Page Website
- Directory Website

**Primary Conversion Goal:**

- Drive inquiries/contact
- Book appointments/consultations
- Sell products directly
- Generate leads/signups
- Showcase work/portfolio
- Provide information/resources
- Build community/membership
- Accept donations
- Register for events

**Industry/Niche:**
Free-text with AI-assisted categorization. Common industries become deterministic paths over time.

#### Phase B: Brand Personality Capture (Deterministic + AI Enhancement)

Visual A/B comparisons across personality axes:

| Axis        | Left Pole             | Right Pole             |
| ----------- | --------------------- | ---------------------- |
| Density     | Minimal / Spacious    | Rich / Dense           |
| Tone        | Playful / Casual      | Serious / Professional |
| Temperature | Warm / Inviting       | Cool / Sleek           |
| Weight      | Light / Airy          | Bold / Heavy           |
| Era         | Classic / Traditional | Modern / Contemporary  |
| Energy      | Calm / Serene         | Dynamic / Energetic    |

Each axis is presented as a visual comparison showing two rendered website sections that represent each pole. User picks a point on the spectrum (not just binary). The result is a 6-dimensional personality vector like `[0.2, 0.8, 0.3, 0.6, 0.9, 0.4]`.

If user selects "neither" or "something else," Claude API interprets their description and maps it to the vector space, creating a new reference point.

#### Phase C: Deep Discovery (AI-Powered Conversation)

Based on Phase A + B outputs, Claude generates contextual follow-up questions. Examples:

For a luxury med spa (business + booking + luxury personality):

- "What specific services do you offer? (facials, injectables, body treatments, etc.)"
- "Do you want clients to book directly online or contact you first?"
- "What sets your spa apart from competitors?"
- "Do you have professional photography, or will we source imagery?"
- "Describe the feeling someone should have when they visit your site."
- "Do you have brand colors, a logo, or any existing brand materials?"

**Staleness Detection:** When a user re-enters Step 8 (Discovery), the system computes a `questionsInputKey` fingerprint from `siteType|goal|businessName|description|emotionalGoals|voiceProfile|brandArchetype`. If the fingerprint matches stored questions, a review mode is shown instead of regenerating. If the fingerprint changed (different inputs), old Q&A is cleared and fresh questions are generated.

#### Phase D: Proposal & Preview

The system generates:

1. A **Site Intent Document** (structured JSON spec)
2. A **visual preview** rendered with actual components, placeholder content, and the generated theme
3. A **proposed sitemap** with page-by-page component breakdown

User reviews, approves, or requests modifications.

### Site Intent Document Schema

```typescript
interface SiteIntentDocument {
  sessionId: string;
  siteType: string;
  conversionGoal: string;
  personalityVector: [number, number, number, number, number, number];
  businessName: string;
  tagline: string;
  pages: PageSpec[];
  metadata: {
    generatedAt: number;
    method: "ai" | "deterministic";
  };
}

interface PageSpec {
  slug: string;
  title: string;
  purpose: string;
  components: ComponentPlacement[];
}

interface VisualConfig {
  pattern?: string; // CSS background value for decorative pattern
  dividerBottom?: "wave" | "angle" | "curve" | "zigzag" | "none";
  parallaxEnabled?: boolean;
  scrollRevealIntensity?: "none" | "subtle" | "moderate" | "dramatic";
}

interface ComponentPlacement {
  componentId: string;
  variant: string;
  order: number;
  config: Record<string, unknown>;
  content: Record<string, unknown>;
  visualConfig?: VisualConfig; // CSS patterns, dividers, scroll effects (Phase 5A)
}
```

---

## Layer 2: Component Assembly Engine

> **Status:** Fully implemented. 18 components built across 8 categories. Assembly engine operational — `AssemblyRenderer` reads a `SiteIntentDocument`, generates a theme from the personality vector, and composes components into a live site via `COMPONENT_REGISTRY`. AI-powered spec generation (Claude Sonnet) with deterministic fallback supports all 18 components. Live preview at `/demo/preview` with responsive viewport controls, metadata sidebar, and toolbar. Export pipeline generates downloadable ZIP files. Component library preview at `/preview` demonstrates all 18 components with live theme switching.

### Component Library Architecture

Every component in the library follows a strict contract:

```typescript
interface ComponentManifest {
  // Identity
  id: string; // e.g., "hero-parallax"
  category: ComponentCategory; // "hero", "content", "navigation", etc.
  name: string; // Human-readable name
  description: string;

  // Classification
  siteTypes: SiteType[]; // Which site types commonly use this
  personalityFit: {
    // Which personality ranges this suits
    [axis: string]: number[]; // [min, max] range — uses number[] for JSON compatibility
  };

  // Data Contract
  requiredProps: PropSpec[];
  optionalProps: PropSpec[];

  // Theming
  consumedTokens: string[]; // Which design tokens this component uses

  // Variants
  variants: VariantSpec[];

  // Metadata
  usageCount: number;
  averageApprovalRate: number;
  tags: string[];
}
```

### Component Categories

**Structural** (✅ = built):

- ✅ Header/Navigation — `nav-sticky` (transparent, solid variants; responsive mobile menu)
- ✅ Footer — `footer-standard` (multi-column variant; social icons, copyright bar)
- ✅ Section Wrapper — `section` (6 bg variants, 5 spacing presets, container constraints, divider/pattern props)

**Hero Sections** (✅ = built):

- ✅ Centered text hero — `hero-centered` (with-bg-image, gradient-bg variants)
- ✅ Split hero — `hero-split` (image-right, image-left variants; image optional with CSS gradient fallback)
- Video background hero
- Parallax hero (layered depth with alpha-masked foreground)
- Carousel/slider hero
- Minimal hero (just headline + subheadline)
- Full-bleed image hero with overlay text
- Animated/interactive hero

**Content Blocks** (✅ = built):

- ✅ Text block — `content-text` (centered variant; eyebrow, headline, body with HTML support)
- ✅ Feature grid — `content-features` (icon-cards variant; Lucide icon lookup, hover + stagger)
- ✅ Split content — `content-split` (alternating variant; rows flip image side, image optional with CSS gradient fallback)
- ✅ Stats/numbers — `content-stats` (inline, cards, animated-counter variants)
- ✅ Timeline/process steps — `content-timeline` (vertical, alternating variants)
- ✅ Logo cloud/trust badges — `content-logos` (grid, scroll, fade variants)
- ✅ FAQ/Accordion — `content-accordion` (single-open, multi-open, bordered variants)
- Comparison table
- Card grid (image + content cards)

**Social Proof** (✅ = built):

- ✅ Testimonial carousel — `proof-testimonials` (carousel variant; pagination, star ratings, avatar fallbacks)
- ✅ Before/after showcase — `proof-beforeafter` (slider, side-by-side variants; interactive drag slider with keyboard nav)
- Testimonial grid
- Review cards with ratings
- Case study preview
- Client logo wall

**Team & People** (✅ = built):

- ✅ Team grid — `team-grid` (cards, minimal, hover-reveal variants)
- Team carousel
- Individual team member spotlight
- About section with founder story

**Media** (✅ = built):

- ✅ Image gallery — `media-gallery` (grid, masonry, lightbox variants; filter tabs, keyboard navigation)
- Video embed section
- Portfolio grid with filtering
- Image with parallax effect

**Call to Action** (✅ = built):

- ✅ CTA banner — `cta-banner` (full-width, contained variants; 4 bg options: primary/dark/gradient/image)
- CTA card (contained)
- Floating CTA
- Exit-intent popup
- Newsletter signup section

**Forms & Interactive** (✅ = built):

- ✅ Contact form — `form-contact` (simple variant; client-side validation, error states, success animation)
- Booking/appointment widget
- Newsletter signup
- Search

**Commerce** (✅ = built):

- ✅ Service menu — `commerce-services` (card-grid, list, tiered variants)
- Product card grid
- Product detail section
- Pricing table/comparison

### Assembly Protocol

The assembly engine follows this process:

1. **Read Site Intent Document** — Parse the structured spec
2. **Resolve Theme** — Either load a proven theme or generate tokens from personality vector; apply emotional overrides if character data present
3. **Select Components** — For each page, match component IDs to library entries via `COMPONENT_REGISTRY`
4. **Configure Variants** — Based on personality fit and content availability
5. **Resolve Visual Config** — For each component, resolve `visualConfig` into CSS patterns (via `generatePattern()`), section dividers, and parallax settings using theme colors
6. **Compose Layout** — Arrange components in order with section wrappers, alternating backgrounds, dividers, and pattern overlays
7. **Populate Content** — Insert real or AI-generated content into component props; render `ImagePlaceholder` for missing images
8. **Render Preview** — Generate a live, interactive preview via `AssemblyRenderer`
9. **Export** — On approval, generate a downloadable ZIP with static HTML/CSS via export pipeline

### Export Pipeline

The export pipeline converts a `SiteIntentDocument` into a downloadable static website:

1. **`generateProject(spec)`** — Converts spec into `ExportResult` with `index.html`, `styles.css`, and `README.md`
2. **`createProjectZip(result)`** — Bundles files into a ZIP using JSZip
3. **`downloadBlob(blob, filename)`** — Triggers browser download

The exported HTML includes:

- Full CSS with theme variables and responsive design
- Component-specific styles for all 18 component types
- Google Fonts loading via `<link>` tags
- Semantic HTML structure matching the component tree
- XSS-safe content rendering via `escapeHtml()`

---

## Layer 3: Theming & Style System

> **Status:** Fully implemented. 87 CSS Custom Properties across 6 categories. `generateThemeFromVector()` maps personality vectors to tokens using chroma-js for palette generation and 10 curated font pairings. ThemeProvider + useTheme hook inject tokens as CSS custom properties. 7 presets built. Preview page at `/preview` allows live theme switching across all 18 components.

### Design Token Architecture

Every generated website consumes a theme defined as CSS Custom Properties:

```css
:root {
  /* Color Palette */
  --color-primary: #1a365d;
  --color-primary-light: #2a4a7f;
  --color-primary-dark: #0f2440;
  --color-secondary: #d4a574;
  --color-secondary-light: #e8c9a0;
  --color-accent: #c8a96e;
  --color-background: #faf8f5;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-text-on-primary: #ffffff;
  --color-text-on-dark: #f5f5f5;
  --color-border: #e5e2dd;
  --color-success: #059669;
  --color-warning: #d97706;
  --color-error: #dc2626;

  /* Typography */
  --font-heading: "Cormorant Garamond", serif;
  --font-body: "Outfit", sans-serif;
  --font-accent: "Cormorant Garamond", serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;
  --text-7xl: 4.5rem;

  /* Spacing */
  --space-section: 6rem;
  --space-component: 3rem;
  --space-element: 1.5rem;
  --space-tight: 0.75rem;
  --container-max: 1280px;
  --container-narrow: 768px;

  /* Shape */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.12);

  /* Animation */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
  --animation-distance: 20px;
  --animation-scale: 0.95;
}
```

### Theme Generation from Personality Vector

The 6-dimensional personality vector maps to theme tokens through a generation function:

| Personality Axis  | Token Effects                                                                |
| ----------------- | ---------------------------------------------------------------------------- |
| Minimal ↔ Rich    | Spacing scale, shadow depth, border usage, background complexity             |
| Playful ↔ Serious | Font pairing (rounded sans ↔ classic serif), color saturation, radius values |
| Warm ↔ Cool       | Hue rotation of palette, warm neutrals ↔ cool grays                          |
| Light ↔ Bold      | Font weights, contrast ratios, shadow intensity, text sizes                  |
| Classic ↔ Modern  | Serif vs sans-serif, ornamental details, spacing proportions                 |
| Calm ↔ Dynamic    | Animation speed/distance, transition types, interactive effects              |

### Theme Presets (7 total)

Curated starting points that can be adjusted:

- ✅ **Luxury Dark** — Deep navy, gold accents, Cormorant Garamond/Outfit, generous space
- ✅ **Modern Clean** — White base, blue accent, Sora/DM Sans, crisp edges
- ✅ **Warm Professional** — Warm whites, terracotta/sage accents, Lora/Merriweather Sans
- ✅ **Bold Creative** — Vibrant magenta/cyan, Oswald/Lato, 0px radius, high contrast
- ✅ **Editorial** — Red/white, Libre Baskerville/Nunito Sans, 0px radius, magazine-like grid
- ✅ **Tech Forward** — Indigo/cyan, DM Sans/JetBrains Mono, dark mode, glass effects
- ✅ **Organic Natural** — Sage/terracotta, Crimson Pro/Work Sans, soft rounded shapes

---

## Layer 3.5: Design Feedback Loop (VLM Evaluation)

> **Status:** Implemented (T3-E1). Screenshot capture, Claude Vision evaluation, and feedback-to-theme-adjustment pipeline are fully wired. On-demand via DevPanel.

### Overview

The Design Feedback Loop closes the generate → evaluate → adjust → re-render cycle. After assembling a site, developers can capture a screenshot, send it to Claude Vision for quality scoring, and apply suggested theme adjustments — all without regenerating the spec.

### Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Preview Page    │────▶│  Screenshot      │────▶│  Claude Vision   │
│  (AssemblyRender │     │  (html2canvas or  │     │  (Convex action)  │
│   + ThemeProvider│     │   Playwright)     │     │  5-dimension      │
│   + vlmOverrides)│     └──────────────────┘     │  scoring          │
│                  │◀────────────────────────────│  + themeAdjustments│
│  Re-renders with │     mapAdjustmentsTo         └──────────────────┘
│  merged overrides│     TokenOverrides()                │
└─────────────────┘                                     ▼
                                                  ┌──────────────────┐
                                                  │  Convex DB       │
                                                  │  vlmEvaluations  │
                                                  └──────────────────┘
```

### Screenshot Capture (Hybrid)

Two capture methods for different use cases:

- **Client-side** (`src/lib/screenshot/capture-client.ts`): Uses `html2canvas` for quick DOM-to-PNG capture. Waits for fonts + 300ms settle. Capped at 4000px height. Used for VLM evaluation input.
- **Server-side** (`src/app/api/screenshot/route.ts`): Uses Playwright for pixel-perfect full-page capture. Restricted to localhost URLs. Supports viewport selection (desktop/tablet/mobile).

### VLM Evaluation (5 Dimensions)

The Claude Vision action (`convex/ai/evaluateScreenshot.ts`) scores screenshots on 5 dimensions (1-10 each):

1. **Content Relevance** — Text matches business type and goals
2. **Visual Character** — Design matches personality vector and emotional goals
3. **Color Appropriateness** — Colors suit industry and brand archetype
4. **Typography Fit** — Fonts match personality axes and voice profile
5. **Overall Cohesion** — Unified professional design

Includes deterministic fallback (all 5/10 scores) when no API key is configured.

### Adjustment Mapping

`mapAdjustmentsToTokenOverrides()` (`src/lib/vlm/map-adjustments.ts`) filters VLM-suggested adjustments:

- Validates keys against the 66 ThemeTokens keys
- Validates hex format for color tokens
- Returns `Partial<ThemeTokens>` merged onto the active theme variant

### Integration Points

- **PreviewToolbar**: Screenshot button triggers `capturePreviewScreenshot()`
- **DevPanel VLM tab**: Evaluate button, score visualization, Apply Adjustments button
- **Preview page**: `vlmOverrides` state merged into `activeTheme` via `useMemo`
- **Convex**: `vlmEvaluations` table persists results by session

---

## Layer 4: Evolving Knowledge Base

> **Status:** Schema tables created in Convex (`intentPaths`, `recipes`, `components`, `themes`, `assets`) with indexes. The tables are ready for data but the embedding/similarity matching system, path lifecycle management, and analytics dashboard have not been built. Planned for Phase 5.

### Intent Path Learning

Every path through the intake flow is stored:

```typescript
interface IntentPath {
  id: string;
  question: string;
  userInput: string;
  interpretation: string; // What the system understood
  resultingAction: string; // What component/theme/page decision was made
  embedding: number[]; // Semantic embedding for similarity matching
  usageCount: number;
  confirmationRate: number; // How often users approved the resulting decision
  status: "candidate" | "proven" | "deprecated";
  createdAt: string;
  promotedAt?: string; // When it graduated from candidate to proven
}
```

### Promotion Logic

1. New user input with no close match → Claude API interprets → stored as `candidate`
2. Similar input matched (cosine similarity > 0.92) → increment usage count
3. Usage count ≥ 3 AND confirmation rate ≥ 0.8 → promote to `proven`
4. Proven paths are served deterministically (no API call)
5. Paths with confirmation rate < 0.5 after 5+ uses → `deprecated`

### Asset Library

Every generated asset is cataloged:

```typescript
interface AssetEntry {
  id: string;
  type: "image" | "icon" | "illustration" | "pattern" | "animation";
  tags: string[]; // ["luxury", "spa", "dark", "gold"]
  industry: string[];
  personalityFit: number[]; // Personality vector this was created for
  usageCount: number;
  projects: string[]; // Which projects used this
  fileRef: string; // Convex file storage reference
  metadata: {
    width?: number;
    height?: number;
    format: string;
    dominantColors: string[];
  };
}
```

### Proven Recipes

Complete component configurations that were approved:

```typescript
interface ProvenRecipe {
  id: string;
  name: string; // "Luxury Spa Homepage Hero"
  componentId: string; // "hero-parallax"
  variant: string;
  config: Record<string, unknown>;
  contentStructure: Record<string, unknown>;
  themeContext: string; // Which theme preset family
  siteType: SiteType;
  industry: string;
  approvalCount: number;
  lastUsed: string;
}
```

---

## Database Schema (Convex)

> **Note:** Convex requires `npx convex dev` to generate types. The `convex/` directory is excluded from tsconfig to avoid build errors when types haven't been generated.

### Core Tables

- **projects** — Client website projects (✅ schema defined)
- **users** — Platform users (✅ schema defined)
- **siteSpecs** — Generated Site Intent Documents (✅ fully implemented — `saveSiteSpec`, `saveSiteSpecInternal`, `getSiteSpec` with `by_session` index; now includes `visualConfig` per component)
- **intakeResponses** — Individual intake flow responses (✅ schema defined with `by_session` index)
- **pipelineLogs** — Full generation pipeline traces (✅ fully implemented — prompt, AI response, timing, validation results)
- **vlmEvaluations** — VLM design evaluation results (✅ fully implemented — 5-dimension scores, theme adjustments, by session)
- **feedback** — User satisfaction ratings (✅ fully implemented — rating, dimension chips, free text)
- **testCases** — Named test case snapshots (✅ fully implemented — intake snapshot, spec snapshot, run history)
- **intentPaths** — The evolving decision tree (✅ schema defined with `by_step` index — lifecycle management not yet built)
- **components** — Component library registry (✅ schema defined with `by_category` index)
- **themes** — Theme presets and custom themes (✅ schema defined)
- **assets** — File references and metadata (✅ schema defined)
- **recipes** — Proven component configurations (✅ schema defined with `by_component` index)

---

## API Integration

### Claude SDK Usage

Claude is called for:

1. **Deep Discovery Questions** — Generating contextual follow-up questions based on intake progress
2. **Site Spec Generation** — Producing a full `SiteIntentDocument` with page structure, component selection, variant configuration, and content for all 18 components
3. **Intent Interpretation** — When user gives a novel response that doesn't match known paths
4. **Copy Generation** — Website copy based on business info and brand personality (planned)
5. **Theme Fine-tuning** — Adjusting theme tokens based on nuanced brand descriptions (planned)

### Optimization Strategy

- Cache AI responses keyed by semantic similarity of input
- Batch related questions to minimize API calls
- Use structured output (JSON mode) for spec generation
- Maintain conversation context within a session to avoid redundant questions
- Graduate AI-dependent paths to deterministic as confidence grows
- Fingerprint-based staleness detection for question caching

---

## Deployment Architecture

### Platform (easywebsitebuild.com)

- Next.js on Vercel
- Convex cloud for database + real-time
- Claude API for AI features

### Generated Sites (Export — Currently Implemented)

- Export as static HTML/CSS project (ZIP download)
- Includes `index.html`, `styles.css`, `README.md`
- Full theme with CSS Custom Properties
- Responsive design built-in
- Google Fonts loading
- No dependency on EasyWebsiteBuild platform

### Generated Sites (Subscription Model — Future)

- Each site is a separate Next.js deployment
- Shared component library via npm package
- Individual Convex projects for sites needing dynamic features
- Vercel deployment via API

### Generated Sites (One-Time Purchase — Future)

- Export as standalone Next.js project
- All components bundled in
- No dependency on EasyWebsiteBuild platform
- Includes documentation for ongoing maintenance

---

## Current Project Structure

```
easywebsitebuild/
├── CLAUDE.md                              # Project instructions
├── docs/                                  # Specification & documentation
│   ├── ARCHITECTURE.md                    # This file
│   ├── ASSEMBLY_ENGINE.md
│   ├── BRAND_CHARACTER_SYSTEM.md          # Brand character design philosophy
│   ├── COMPLETE_DATA_FLOW.md              # End-to-end system data flow
│   ├── COMPONENT_SPEC.md
│   ├── EPICS_AND_STORIES.md               # Output Quality Overhaul tracking
│   ├── INTAKE_FLOW.md
│   ├── KNOWLEDGE_BASE.md
│   ├── ROADMAP.md
│   ├── STRATEGIC_ROADMAP.md               # Strategic priorities + competitive analysis
│   └── THEME_SYSTEM.md
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Root layout (ConvexClientProvider → ConditionalLayout)
│   │   ├── page.tsx                       # Homepage
│   │   ├── globals.css                    # Global styles, CSS variables
│   │   ├── demo/
│   │   │   ├── page.tsx                   # Demo intake flow (9-step)
│   │   │   └── preview/
│   │   │       ├── page.tsx               # Assembled site preview with viewport controls
│   │   │       └── render/page.tsx        # Iframe render target (PostMessage protocol)
│   │   ├── docs/page.tsx                  # Documentation page (redirects to /, future Clerk admin)
│   │   ├── api/screenshot/route.ts        # Playwright server-side screenshot API
│   │   ├── dev/
│   │   │   ├── test-cases/page.tsx        # Dev-only: named test case management
│   │   │   └── compare/page.tsx           # Dev-only: side-by-side session comparison
│   │   └── preview/page.tsx               # Live component library preview with theme switching
│   ├── components/
│   │   ├── platform/                      # Platform UI (the builder app itself)
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AnimatedSection.tsx
│   │   │   ├── MotionFade.tsx             # Client component for framer-motion entrance animations
│   │   │   ├── ConditionalLayout.tsx      # Route-aware Navbar/Footer visibility
│   │   │   ├── ConvexClientProvider.tsx    # Convex React provider (wraps app)
│   │   │   ├── docs/
│   │   │   │   └── DocsShell.tsx          # Client component for docs interactive shell
│   │   │   ├── preview/                   # Preview UI components
│   │   │   │   ├── PreviewSidebar.tsx     # Spec metadata sidebar
│   │   │   │   ├── PreviewToolbar.tsx     # Viewport controls toolbar
│   │   │   │   ├── DevPanel.tsx           # Developer diagnostic panel (6 tabs)
│   │   │   │   └── FeedbackBanner.tsx     # Quick satisfaction rating banner
│   │   │   ├── intake/                    # Intake flow step components
│   │   │   │   ├── Step5Emotion.tsx       # Emotional goals selection (Step 5)
│   │   │   │   ├── Step6Voice.tsx         # Voice & narrative (Step 6)
│   │   │   │   ├── Step7Culture.tsx       # Brand archetype & anti-references (Step 7)
│   │   │   │   ├── Step5Discovery.tsx     # AI-powered discovery questionnaire (Step 8)
│   │   │   │   ├── Step6Loading.tsx       # Animated generation loading screen (Step 9)
│   │   │   │   └── index.ts
│   │   └── library/                       # Website component library (18 components)
│   │       ├── base.types.ts              # BaseComponentProps, ImageSource, LinkItem, CTAButton
│   │       ├── index.ts                   # Barrel exports for all components
│   │       ├── manifest-index.ts          # Manifest lookup/filter utilities
│   │       ├── navigation/nav-sticky/     # NavSticky component
│   │       ├── hero/hero-centered/        # HeroCentered (variant-extracted)
│   │       │   ├── shared.tsx             # Shared constants + CTAButtonEl
│   │       │   └── variants/              # with-bg-image.tsx, gradient-bg.tsx
│   │       ├── hero/hero-split/           # HeroSplit component
│   │       ├── content/content-features/  # ContentFeatures component
│   │       ├── content/content-split/     # ContentSplit component
│   │       ├── content/content-text/      # ContentText component
│   │       ├── content/content-stats/     # ContentStats component
│   │       ├── content/content-accordion/ # ContentAccordion component
│   │       ├── content/content-timeline/  # ContentTimeline component
│   │       ├── content/content-logos/     # ContentLogos component
│   │       ├── cta/cta-banner/            # CtaBanner component
│   │       ├── forms/form-contact/        # FormContact component
│   │       ├── social-proof/proof-testimonials/  # ProofTestimonials component
│   │       ├── social-proof/proof-beforeafter/   # ProofBeforeAfter component
│   │       ├── team/team-grid/            # TeamGrid (variant-extracted)
│   │       │   ├── shared.tsx             # Shared utilities + SocialIcon + AvatarFallback
│   │       │   └── variants/              # cards.tsx, minimal.tsx, hover-reveal.tsx
│   │       ├── commerce/commerce-services/ # CommerceServices (variant-extracted)
│   │       │   ├── shared.tsx             # Shared constants + getIcon + SectionHeader
│   │       │   └── variants/              # card-grid.tsx, list.tsx, tiered.tsx
│   │       ├── media/media-gallery/       # MediaGallery (variant-extracted)
│   │       │   ├── shared.tsx             # Shared constants + SectionHeader + FilterTabs
│   │       │   └── variants/              # grid.tsx, masonry.tsx, lightbox-overlay.tsx
│   │       ├── footer/footer-standard/    # FooterStandard component
│   │       └── layout/section/            # Section wrapper component
│   └── lib/
│       ├── assembly/                      # Assembly engine
│       │   ├── spec.types.ts              # SiteIntentDocument, PageSpec, ComponentPlacement
│       │   ├── component-registry.ts      # componentId → React component mapping
│       │   ├── font-loader.ts             # Runtime Google Fonts loader with deduplication
│       │   ├── AssemblyRenderer.tsx        # Spec → live site renderer
│       │   └── index.ts                   # Barrel export
│       ├── export/                        # Export pipeline
│       │   ├── generate-project.ts        # SiteIntentDocument → static HTML/CSS files
│       │   ├── create-zip.ts              # JSZip bundling + browser download
│       │   └── index.ts                   # Barrel export
│       ├── visuals/                       # CSS visual system (Phase 5A)
│       │   ├── css-patterns.ts            # 14 CSS background patterns + generation
│       │   ├── industry-patterns.ts       # Business sub-type → pattern mapping (25+)
│       │   ├── visual-vocabulary.ts       # Full visual language per business type
│       │   ├── section-dividers.tsx       # Wave, angle, curve, zigzag SVG components
│       │   ├── decorative-elements.tsx    # Blob, dot-grid, geometric-frame, diamond, circle
│       │   ├── image-placeholder.tsx      # Gradient/pattern/shimmer placeholder variants
│       │   ├── gradient-utils.ts          # Mesh gradient + placeholder gradient generation
│       │   ├── use-parallax.ts            # Parallax hook (framer-motion + useSyncExternalStore)
│       │   └── index.ts                   # Barrel export
│       ├── screenshot/                    # Screenshot capture
│       │   ├── types.ts                   # ScreenshotResult type
│       │   ├── capture-client.ts          # html2canvas DOM-to-base64
│       │   └── index.ts                   # Barrel export
│       ├── vlm/                           # VLM evaluation utilities
│       │   ├── types.ts                   # DimensionScore, VLMEvaluation
│       │   ├── map-adjustments.ts         # VLM feedback → Partial<ThemeTokens>
│       │   └── index.ts                   # Barrel export
│       ├── hooks/
│       │   └── use-is-mobile.ts           # Debounced mobile viewport detection hook
│       ├── stores/
│       │   └── intake-store.ts            # Zustand store with localStorage persistence (9-step flow)
│       ├── types/
│       │   └── brand-character.ts         # Brand character types + display constants
│       └── theme/
│           ├── theme.types.ts             # ThemeTokens, PersonalityVector, ThemePreset
│           ├── token-map.ts               # Token name ↔ CSS variable mapping
│           ├── generate-theme.ts          # Personality vector → ThemeTokens
│           ├── emotional-overrides.ts      # Emotion/anti-reference → token adjustments
│           ├── presets.ts                 # 7 curated presets
│           ├── ThemeProvider.tsx           # React context provider + useTheme hook
│           └── index.ts                   # Barrel export
└── convex/
    ├── schema.ts                          # Database schema (9 tables)
    ├── siteSpecs.ts                       # Site spec CRUD (saveSiteSpec, getSiteSpec)
    ├── vlmEvaluations.ts                  # VLM evaluation save/query
    ├── pipelineLogs.ts                    # Pipeline session logging
    ├── feedback.ts                        # User satisfaction ratings
    ├── testCases.ts                       # Named test case CRUD
    └── ai/                                # AI integration actions
        ├── generateQuestions.ts            # Claude-powered discovery questions
        └── generateSiteSpec.ts            # Claude-powered site spec generation
```
