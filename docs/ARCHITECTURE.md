# Architecture Documentation — EasyWebsiteBuild

> **Implementation Status (as of Feb 2026):**
>
> - Layer 1 (Intent Capture): Demo intake flow built (4-step). Full AI-powered flow is Phase 3.
> - Layer 2 (Component Assembly): 10 MVP components built with manifest system, barrel exports, and manifest index. Assembly engine itself is Phase 4.
> - Layer 3 (Theming): Fully implemented — 87 tokens, 3 presets, `generateThemeFromVector()`, ThemeProvider + useTheme hook.
> - Layer 4 (Knowledge Base): Design spec only. Implementation is Phase 6.
> - Platform website: Complete (Homepage, Demo, Docs, Preview pages).

## System Overview

EasyWebsiteBuild is an AI-powered website assembly platform built on three core layers:

1. **Intent Capture Layer** — Guided discovery that extracts what a client actually needs
2. **Component Assembly Engine** — Modular building blocks + composition logic
3. **Theming & Style System** — Design tokens that make each site unique

These layers work together in a pipeline: Intent → Spec → Assembly → Preview → Delivery.

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

For a musician portfolio (portfolio + showcase + creative personality):

- "What genre of music do you create?"
- "Is the goal to attract fans, book gigs, or get label attention?"
- "Do you want to embed music players, videos, or both?"
- "Should the site feel like a polished press kit or an artistic experience?"
- "Do you have high-quality press photos?"

#### Phase D: Proposal & Preview

The system generates:

1. A **Site Intent Document** (structured JSON spec)
2. A **visual preview** rendered with actual components, placeholder content, and the generated theme
3. A **proposed sitemap** with page-by-page component breakdown

User reviews, approves, or requests modifications.

### Site Intent Document Schema

```typescript
interface SiteIntentDocument {
  // Classification
  siteType: SiteType;
  industry: string;
  conversionGoal: ConversionGoal;

  // Brand
  personalityVector: [number, number, number, number, number, number];
  colorPreferences?: string[];
  existingBrandAssets?: BrandAsset[];

  // Structure
  pages: PageSpec[];
  navigation: NavigationSpec;
  footer: FooterSpec;

  // Theme
  themeId?: string; // If matching an existing proven theme
  themeOverrides?: Partial<ThemeTokens>;

  // Content
  businessName: string;
  tagline?: string;
  services?: Service[];
  teamMembers?: TeamMember[];
  testimonials?: Testimonial[];
  contentInventory: ContentInventory;

  // Technical
  features: Feature[]; // booking, ecommerce, blog, etc.
  integrations?: Integration[];

  // Metadata
  createdAt: string;
  intakePath: string[]; // Breadcrumb of decisions made
  aiInteractions: number; // How many AI calls were needed
  confidence: number; // System confidence in the spec (0-1)
}

interface PageSpec {
  slug: string;
  title: string;
  purpose: string;
  components: ComponentPlacement[];
}

interface ComponentPlacement {
  componentId: string;
  variant: string;
  order: number;
  config: Record<string, unknown>;
  content: Record<string, unknown>;
}
```

---

## Layer 2: Component Assembly Engine

> **Status:** 10 MVP components built and working. Assembly engine itself (automated spec → site composition) is planned for Phase 4. Currently, the Preview page at `/preview` demonstrates all components assembled into a complete sample site ("Meridian Studio") with live theme switching.

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
- ✅ Section Wrapper — `section` (6 bg variants, 5 spacing presets, container constraints)
- Page Layout (overall page structure, sidebar options)

**Hero Sections** (✅ = built):

- ✅ Centered text hero — `hero-centered` (with-bg-image, gradient-bg variants)
- ✅ Split hero — `hero-split` (image-right, image-left variants; decorative accent element)
- Video background hero
- Parallax hero (layered depth with alpha-masked foreground)
- Carousel/slider hero
- Minimal hero (just headline + subheadline)
- Full-bleed image hero with overlay text
- Animated/interactive hero

**Content Blocks** (✅ = built):

- ✅ Text block — `content-text` (centered variant; eyebrow, headline, body with HTML support)
- ✅ Feature grid — `content-features` (icon-cards variant; Lucide icon lookup, hover + stagger)
- Card grid (image + content cards)
- ✅ Split content — `content-split` (alternating variant; rows flip image side, scroll animation)
- Stats/numbers section
- Timeline/process steps
- Comparison table
- Logo cloud/trust badges

**Social Proof** (✅ = built):

- ✅ Testimonial carousel — `proof-testimonials` (carousel variant; pagination, star ratings, avatar fallbacks)
- Testimonial grid
- Review cards with ratings
- Case study preview
- Client logo wall
- Before/after showcase

**Team & People:**

- Team grid (photo + name + role)
- Team carousel
- Individual team member spotlight
- About section with founder story

**Media:**

- Image gallery (grid, masonry, lightbox)
- Video embed section
- Before/after slider
- Portfolio grid with filtering
- Image with parallax effect
- Image with alpha mask / subject extraction

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
- FAQ/Accordion
- Tabs
- Modal/Lightbox

**Commerce:**

- Product card grid
- Product detail section
- Service menu with pricing
- Pricing table/comparison
- Shopping cart
- Checkout flow

**Navigation:**

- Breadcrumbs
- Sidebar navigation
- Pagination
- Table of contents
- Back to top button

### Component Variant System

Each component type has multiple variants that share the same data contract but render differently. Example for Hero:

```
hero/
├── HeroCentered.tsx        # Text centered on background
├── HeroSplit.tsx           # Image one side, text the other
├── HeroVideo.tsx           # Video background
├── HeroParallax.tsx        # Parallax depth layers
├── HeroCarousel.tsx        # Sliding images with text
├── HeroMinimal.tsx         # Just headline, minimal styling
├── HeroFullBleed.tsx       # Full image with overlay
├── HeroAnimated.tsx        # Interactive/animated elements
├── hero.types.ts           # Shared TypeScript interfaces
├── hero.manifest.json      # Component manifest for assembly engine
└── hero.stories.tsx        # Visual documentation / preview
```

### Assembly Protocol

The assembly engine follows this process:

1. **Read Site Intent Document** — Parse the structured spec
2. **Resolve Theme** — Either load a proven theme or generate tokens from personality vector
3. **Select Components** — For each page, match component IDs to library entries
4. **Configure Variants** — Based on personality fit and content availability
5. **Compose Layout** — Arrange components in order with section wrappers
6. **Populate Content** — Insert real or AI-generated content into component props
7. **Render Preview** — Generate a live, interactive preview
8. **Export** — On approval, generate a deployable Next.js project

---

## Layer 3: Theming & Style System

> **Status:** Fully implemented. 87 CSS Custom Properties across 6 categories. `generateThemeFromVector()` maps personality vectors to tokens using chroma-js for palette generation and 10 curated font pairings. ThemeProvider + useTheme hook inject tokens as CSS custom properties. 3 presets built (Luxury Dark, Modern Clean, Warm Professional). Preview page at `/preview` allows live theme switching across all components.

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

### Theme Presets

Curated starting points that can be adjusted (✅ = implemented):

- ✅ **Luxury Dark** — Deep navy, gold accents, Cormorant Garamond/Outfit, generous space
- **Luxury Light** — Cream/ivory base, elegant serif, subtle shadows, muted metallics
- ✅ **Modern Clean** — White base, blue accent, Sora/DM Sans, crisp edges
- **Bold Creative** — Vibrant colors, display fonts, dynamic animations, asymmetric layouts
- ✅ **Warm Professional** — Warm whites, terracotta/sage accents, Lora/Merriweather Sans
- **Editorial** — High contrast, strong typography hierarchy, magazine-like grid
- **Tech Forward** — Dark mode, monospace accents, gradient meshes, glass effects
- **Organic Natural** — Greens/browns, handwritten accents, soft shapes, texture
- **Playful Bright** — Primary colors, bouncy animations, large rounded elements
- **Minimalist Zen** — Near-monochrome, extreme whitespace, delicate typography

---

## Layer 4: Evolving Knowledge Base

> **Status:** Design spec only — not yet implemented. Planned for Phase 6. The Convex schema includes placeholder tables for `intentPaths` and `recipes`, but the embedding/similarity matching system has not been built.

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

- **intakeResponses** — Individual answers from the intake flow (✅ implemented with `saveResponse` mutation and `getBySession` query)
- **projects** — Client website projects
- **siteSpecs** — Generated Site Intent Documents
- **intentPaths** — The evolving decision tree
- **components** — Component library registry
- **themes** — Theme presets and custom themes
- **assets** — File references and metadata
- **recipes** — Proven component configurations
- **users** — Platform users (clients)
- **subscriptions** — Payment/plan information

---

## API Integration

### Claude SDK Usage

Claude is called for:

1. **Deep Discovery Questions** — Generating contextual follow-up questions based on intake progress
2. **Intent Interpretation** — When user gives a novel response that doesn't match known paths
3. **Copy Generation** — Website copy based on business info and brand personality
4. **Component Selection** — When the optimal component arrangement isn't deterministic
5. **Theme Fine-tuning** — Adjusting theme tokens based on nuanced brand descriptions

### Optimization Strategy

- Cache AI responses keyed by semantic similarity of input
- Batch related questions to minimize API calls
- Use structured output (JSON mode) for spec generation
- Maintain conversation context within a session to avoid redundant questions
- Graduate AI-dependent paths to deterministic as confidence grows

---

## Deployment Architecture

### Platform (easywebsitebuild.com)

- Next.js on Vercel
- Convex cloud for database + real-time
- Claude API for AI features

### Generated Sites (Subscription Model)

- Each site is a separate Next.js deployment
- Shared component library via npm package
- Individual Convex projects for sites needing dynamic features
- Or static export for simple sites

### Generated Sites (One-Time Purchase)

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
│   ├── COMPONENT_SPEC.md
│   ├── INTAKE_FLOW.md
│   ├── KNOWLEDGE_BASE.md
│   ├── ROADMAP.md
│   └── THEME_SYSTEM.md
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Root layout (ConditionalLayout for route-aware Navbar/Footer)
│   │   ├── page.tsx                       # Homepage
│   │   ├── globals.css                    # Global styles, CSS variables
│   │   ├── demo/page.tsx                  # Demo intake flow (4-step)
│   │   ├── docs/page.tsx                  # Documentation page
│   │   └── preview/page.tsx               # Live component preview with theme switching
│   ├── components/
│   │   ├── platform/                      # Platform UI (the builder app itself)
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AnimatedSection.tsx
│   │   │   └── ConditionalLayout.tsx      # Route-aware Navbar/Footer visibility
│   │   └── library/                       # Website component library (used in generated sites)
│   │       ├── base.types.ts              # BaseComponentProps, ImageSource, LinkItem, CTAButton
│   │       ├── index.ts                   # Barrel exports for all components
│   │       ├── manifest-index.ts          # Manifest lookup/filter utilities
│   │       ├── navigation/nav-sticky/     # NavSticky component
│   │       ├── hero/hero-centered/        # HeroCentered component
│   │       ├── hero/hero-split/           # HeroSplit component
│   │       ├── content/content-features/  # ContentFeatures component
│   │       ├── content/content-split/     # ContentSplit component
│   │       ├── content/content-text/      # ContentText component
│   │       ├── cta/cta-banner/            # CtaBanner component
│   │       ├── forms/form-contact/        # FormContact component
│   │       ├── social-proof/proof-testimonials/  # ProofTestimonials component
│   │       ├── footer/footer-standard/    # FooterStandard component
│   │       └── layout/section/            # Section wrapper component
│   └── lib/
│       └── theme/
│           ├── theme.types.ts             # ThemeTokens, PersonalityVector, ThemePreset
│           ├── token-map.ts               # Token name ↔ CSS variable mapping
│           ├── generate-theme.ts          # Personality vector → ThemeTokens
│           ├── presets.ts                 # 3 curated presets (Luxury Dark, Modern Clean, Warm Professional)
│           ├── ThemeProvider.tsx           # React context provider + useTheme hook
│           └── index.ts                   # Barrel export
└── convex/
    └── schema.ts                          # Database schema (8 tables)
```
