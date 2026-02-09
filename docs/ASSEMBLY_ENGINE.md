# Assembly Engine Documentation

> **Implementation Status (as of Feb 2026):** Core assembly engine implemented in Phase 3, expanded in Phase 4B.
>
> **Implemented:**
>
> - `SiteIntentDocument` type system (`src/lib/assembly/spec.types.ts`) — sessionId, pages with ComponentPlacement, personality vector, metadata
> - `COMPONENT_REGISTRY` (`src/lib/assembly/component-registry.ts`) — maps 18 componentId strings to React components, `UNWRAPPED_COMPONENTS` set for nav/footer
> - `AssemblyRenderer` (`src/lib/assembly/AssemblyRenderer.tsx`) — client component that generates theme from personality vector, loads fonts, sorts components by order, applies alternating backgrounds, renders inside ThemeProvider
> - `font-loader` (`src/lib/assembly/font-loader.ts`) — runtime Google Fonts injection with deduplication
> - Theme resolution — `generateThemeFromVector()` maps personality vectors to complete token sets (fully working)
> - Component library — 18 components with manifest descriptors, personality fit ranges, and variant metadata
> - Manifest index — `getManifestById()`, `getManifestsByCategory()`, `getManifestsBySiteType()` lookup utilities
> - AI spec generation — Claude Sonnet generates complete SiteIntentDocument from intake data (`convex/ai/generateSiteSpec.ts`) with full support for all 18 components
> - Deterministic fallback — personality-driven variant selection, content generation for all 11 site types, conditional component inclusion based on site type
> - Live preview — `/demo/preview` page with responsive viewport switcher, metadata sidebar, toolbar
> - Export pipeline — `src/lib/export/` generates static HTML/CSS project, bundles as ZIP via JSZip, triggers browser download
>
> **Not yet built:** AI copy generation for refining placeholder content, full Next.js project generation, Vercel deployment pipeline, visual editor, preview approval/change request flow, preview sharing.

## Overview

The Assembly Engine is the system that takes a Site Intent Document (produced by the intake flow) and composes it into a complete, themed, deployable website using components from the library.

## Assembly Pipeline

```
Site Intent Document
       ↓
  1. Resolve Theme
       ↓
  2. Select Components
       ↓
  3. Configure Variants
       ↓
  4. Compose Layout
       ↓
  5. Generate Content
       ↓
  6. Render Preview
       ↓
  7. User Approval Loop
       ↓
  8. Export (ZIP download)
```

### Step 1: Resolve Theme

Input: `personalityVector` + optional `themeOverrides` from the spec.

Process:

1. Check if there's a proven theme that closely matches the personality vector (cosine similarity > 0.95)
2. If yes, load that theme's token set
3. If no, generate tokens from the personality vector using `generateThemeFromVector()` (chroma-js palette generation + curated font pairings)
4. Apply any explicit overrides (user-specified colors, fonts from brand guidelines)
5. Output: Complete CSS Custom Properties set (87 tokens across 6 categories)

### Step 2: Select Components

Input: `pages[]` with `components[]` from the spec.

Process:

1. For each page in the spec, iterate through its component placements
2. Look up each `componentId` in `COMPONENT_REGISTRY` to get the React component
3. Components in `UNWRAPPED_COMPONENTS` set (nav-sticky, footer-standard) render without Section wrapper
4. All other components are wrapped in Section with alternating backgrounds
5. Output: Resolved component list with imports and configurations

**Registered Components (18):**

| componentId          | React Component   | Category     |
| -------------------- | ----------------- | ------------ |
| `nav-sticky`         | NavSticky         | navigation   |
| `hero-centered`      | HeroCentered      | hero         |
| `hero-split`         | HeroSplit         | hero         |
| `content-features`   | ContentFeatures   | content      |
| `content-split`      | ContentSplit      | content      |
| `content-text`       | ContentText       | content      |
| `content-stats`      | ContentStats      | content      |
| `content-accordion`  | ContentAccordion  | content      |
| `content-timeline`   | ContentTimeline   | content      |
| `content-logos`      | ContentLogos      | content      |
| `cta-banner`         | CtaBanner         | cta          |
| `form-contact`       | FormContact       | forms        |
| `proof-testimonials` | ProofTestimonials | social-proof |
| `proof-beforeafter`  | ProofBeforeAfter  | social-proof |
| `team-grid`          | TeamGrid          | team         |
| `commerce-services`  | CommerceServices  | commerce     |
| `media-gallery`      | MediaGallery      | media        |
| `footer-standard`    | FooterStandard    | footer       |

### Step 3: Configure Variants

Input: Resolved components + personality vector + content availability.

Process:

1. For each component, select the optimal variant based on:
   - Personality vector fit (from manifest's `personalityFit` ranges)
   - Available content (don't use image variants if no images provided)
   - Page position (hero components differ from mid-page components)
   - Proven recipe availability (has this exact config worked before?)
2. Apply variant-specific configuration
3. Output: Fully configured component instances

### Step 4: Compose Layout

Input: Configured components in page order.

Process:

1. Sort components by `order` field
2. Wrap non-unwrapped components in Section containers with alternating backgrounds
3. Apply section-level spacing based on component `spacing` prop
4. Insert navigation at top, footer at bottom (unwrapped components)
5. Handle responsive layout (component stacking order on mobile)
6. Output: Complete page layouts as component trees

### Step 5: Generate Content

Input: Content from intake + business description + AI/deterministic generation.

Process:

1. Place user-provided content directly (business name, tagline, services, descriptions)
2. For deterministic fallback, generate content based on site type:
   - Stats: revenue/clients/projects/years based on industry (`getStatsForSiteType()`)
   - Services: industry-specific service lists (`getServicesForSiteType()`)
   - Team members: role-appropriate team (`getTeamForSiteType()`)
   - Trust logos: industry partner/client names (`getTrustLogos()`)
   - FAQ items: common questions by site type (`getFaqForSiteType()`)
3. For AI generation, Claude produces all content fields matching exact component type interfaces
4. Select placeholder images from asset library (tagged by industry + mood)
5. Output: Content-populated component trees

### Step 6: Render Preview

Input: Complete page layouts with content.

Process:

1. `AssemblyRenderer` generates theme tokens from personality vector via `generateThemeFromVector()`
2. `font-loader` injects Google Fonts `<link>` tags with deduplication
3. ThemeProvider wraps the entire render tree, injecting CSS Custom Properties
4. Components are sorted by order, wrapped in Section containers with alternating backgrounds
5. Preview is rendered in an iframe-like container with viewport controls (desktop/tablet/mobile)
6. Sidebar shows spec metadata: business info, theme colors, fonts, component list, personality visualization

### Step 7: User Approval Loop

The user reviews the preview and can:

**Approve** → Proceed to export

**Request theme changes:**

- "Make it darker" → Adjust background/surface tokens, increase contrast
- "Warmer colors" → Shift warm_cool axis, regenerate palette
- "Different fonts" → Present alternative pairings from the curated list

**Request component changes:**

- "Use a different hero" → Show alternative hero variants with preview
- "Add a team section" → Insert team component at suggested position
- "Remove the testimonials" → Remove component, close gap
- "Move the CTA above the footer" → Reorder component placement

### Step 8: Export

The export pipeline converts the approved spec into a downloadable static website:

**Pipeline:**

```
SiteIntentDocument
       ↓
  generateProject(spec)     → ExportResult { files[], businessName }
       ↓
  createProjectZip(result)  → Blob (ZIP file via JSZip)
       ↓
  downloadBlob(blob, name)  → Browser download trigger
```

**`generateProject(spec)`** produces:

| File         | Contents                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| `index.html` | Full HTML with semantic structure for all components, Google Fonts `<link>`, inline CSS reference               |
| `styles.css` | Complete CSS with theme variables, responsive breakpoints, component-specific styles for all 18 component types |
| `README.md`  | Setup instructions, customization guide, component documentation                                                |

**HTML Generation:**

- Each component type has a dedicated HTML renderer
- Content is XSS-safe via `escapeHtml()` function
- Google Fonts are loaded from theme font variables
- Responsive meta viewport tag included
- Semantic HTML5 structure (nav, main, section, footer)

**CSS Generation:**

- CSS Custom Properties for all theme tokens
- Component-specific styles (hero, features, stats, testimonials, etc.)
- Mobile-first responsive breakpoints
- Animation and transition styles

**Supported component renderers:**
nav-sticky, hero-centered, hero-split, content-features, content-text, content-stats, content-split, proof-testimonials, proof-beforeafter, cta-banner, form-contact, footer-standard, commerce-services, team-grid, content-accordion, content-logos, content-timeline, media-gallery

## Site Intent Document → Page Composition Example

### Input Spec (med spa example):

```json
{
  "sessionId": "abc123",
  "siteType": "business",
  "conversionGoal": "booking",
  "personalityVector": [0.6, 0.9, 0.3, 0.7, 0.4, 0.6],
  "businessName": "Radiance Med Spa",
  "tagline": "Where Science Meets Beauty",
  "pages": [
    {
      "slug": "/",
      "title": "Home",
      "purpose": "Main landing page showcasing services and building trust",
      "components": [
        {
          "componentId": "nav-sticky",
          "variant": "transparent",
          "order": 0,
          "config": {},
          "content": {}
        },
        {
          "componentId": "hero-split",
          "variant": "image-right",
          "order": 1,
          "config": {},
          "content": {}
        },
        {
          "componentId": "content-features",
          "variant": "icon-cards",
          "order": 2,
          "config": {},
          "content": {}
        },
        {
          "componentId": "commerce-services",
          "variant": "card-grid",
          "order": 3,
          "config": {},
          "content": {}
        },
        {
          "componentId": "content-stats",
          "variant": "cards",
          "order": 4,
          "config": {},
          "content": {}
        },
        {
          "componentId": "proof-testimonials",
          "variant": "carousel",
          "order": 5,
          "config": {},
          "content": {}
        },
        { "componentId": "team-grid", "variant": "cards", "order": 6, "config": {}, "content": {} },
        {
          "componentId": "cta-banner",
          "variant": "full-width",
          "order": 7,
          "config": {},
          "content": {}
        },
        {
          "componentId": "form-contact",
          "variant": "simple",
          "order": 8,
          "config": {},
          "content": {}
        },
        {
          "componentId": "footer-standard",
          "variant": "multi-column",
          "order": 9,
          "config": {},
          "content": {}
        }
      ]
    }
  ]
}
```

### Generated Output (Home Page):

```tsx
// Rendered by AssemblyRenderer
<ThemeProvider theme={generatedTheme}>
  <NavSticky variant="transparent" {...navContent} />
  <Section spacing="lg" background="default">
    <HeroSplit variant="image-right" {...heroContent} />
  </Section>
  <Section spacing="lg" background="surface">
    <ContentFeatures variant="icon-cards" {...featuresContent} />
  </Section>
  <Section spacing="lg" background="default">
    <CommerceServices variant="card-grid" {...servicesContent} />
  </Section>
  <Section spacing="md" background="surface">
    <ContentStats variant="cards" {...statsContent} />
  </Section>
  <Section spacing="lg" background="default">
    <ProofTestimonials variant="carousel" {...testimonialsContent} />
  </Section>
  <Section spacing="lg" background="surface">
    <TeamGrid variant="cards" {...teamContent} />
  </Section>
  <CtaBanner variant="full-width" {...ctaContent} />
  <Section spacing="lg" background="default">
    <FormContact variant="simple" {...contactContent} />
  </Section>
  <FooterStandard variant="multi-column" {...footerContent} />
</ThemeProvider>
```

## Deterministic Fallback — Component Selection by Site Type

When AI generation fails or is unavailable, the deterministic fallback selects components based on site type. In addition to the core components (nav, hero, features, split content, text, testimonials, CTA, contact form, footer), the following are added conditionally:

| Site Type   | Additional Components                                                    |
| ----------- | ------------------------------------------------------------------------ |
| business    | content-stats, team-grid, content-logos                                  |
| booking     | content-stats, commerce-services, content-accordion (FAQ), content-logos |
| ecommerce   | content-stats, commerce-services, content-accordion (FAQ), content-logos |
| educational | content-stats, content-accordion (FAQ), content-logos                    |
| nonprofit   | content-stats, content-accordion (FAQ)                                   |
| personal    | team-grid                                                                |
| event       | content-accordion (FAQ)                                                  |

Helper functions generate site-type-specific content:

- `getStatsForSiteType(siteType, businessName)` — Industry-relevant stats with number values
- `getServicesForSiteType(siteType, businessName)` — Service/product listings
- `getTeamForSiteType(siteType, businessName)` — Team member profiles
- `getTrustLogos(siteType)` — Industry partner/client names
- `getFaqForSiteType(siteType)` — Common questions and answers

## Future: Visual Editor Integration

For subscription sites, the visual editor would allow:

1. Direct text editing (click to edit any text)
2. Image replacement interface
3. Component reordering (drag and drop)
4. Component visibility toggle (show/hide sections)
5. Theme adjustment panel (color picker, font selector)
6. Adding new sections from the component library

All edits would be stored as overrides on top of the base spec, allowing the system to regenerate the site while preserving custom changes.
