# Assembly Engine Documentation

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
  8. Build & Deploy / Export
```

### Step 1: Resolve Theme

Input: `personalityVector` + optional `themeOverrides` from the spec.

Process:
1. Check if there's a proven theme that closely matches the personality vector (cosine similarity > 0.95)
2. If yes, load that theme's token set
3. If no, generate tokens from the personality vector using the mapping rules in THEME_SYSTEM.md
4. Apply any explicit overrides (user-specified colors, fonts from brand guidelines)
5. Output: Complete CSS Custom Properties set

### Step 2: Select Components

Input: `pages[]` with `components[]` from the spec.

Process:
1. For each page in the spec, iterate through its component placements
2. Look up each `componentId` in the component library manifest index
3. Verify the component exists and has the specified variant
4. Check personality fit — is this component appropriate for the personality vector?
5. If a component doesn't fit, suggest alternatives ranked by personality match
6. Output: Resolved component list with imports and configurations

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
1. Wrap each component in a Section container with appropriate spacing
2. Apply section-level theming (alternating backgrounds, accent sections)
3. Insert navigation at top, footer at bottom
4. Handle responsive layout (component stacking order on mobile)
5. Output: Complete page layouts as component trees

### Step 5: Generate Content

Input: Content from intake + business description + AI generation.

Process:
1. Place user-provided content directly (images, text, service lists)
2. For missing content, use Claude to generate:
   - Headlines and subheadlines matching brand voice
   - Service/feature descriptions
   - Call-to-action text
   - Meta descriptions and page titles
3. Select placeholder images from asset library (tagged by industry + mood)
4. Output: Content-populated component trees

### Step 6: Render Preview

Input: Complete page layouts with content.

Process:
1. Generate a live, interactive preview using the actual React components
2. Apply the resolved theme tokens as CSS custom properties
3. Load fonts, apply animations
4. Make the preview navigable (click between pages)
5. Show alongside a sidebar with:
   - Sitemap overview
   - Theme details (palette, fonts)
   - Component breakdown per page
   - Edit controls

### Step 7: User Approval Loop

The user reviews the preview and can:

**Approve** → Proceed to build/deploy

**Request theme changes:**
- "Make it darker" → Adjust background/surface tokens, increase contrast
- "Warmer colors" → Shift warm_cool axis, regenerate palette
- "Different fonts" → Present 3 alternative pairings from the curated list

**Request component changes:**
- "Use a different hero" → Show alternative hero variants with preview
- "Add a team section" → Insert team component at suggested position
- "Remove the testimonials" → Remove component, close gap
- "Move the CTA above the footer" → Reorder component placement

**Request content changes:**
- "Change the headline" → Direct text editing
- "Use a different image" → Image selector from library or upload
- "Rewrite the about section" → AI regeneration with adjustment prompt

Each change is applied in real-time to the preview. The system stores change patterns for improving future first-pass accuracy.

### Step 8: Build & Deploy

**For subscription (hosted) sites:**
1. Generate the Next.js project in a build directory
2. Install component library as dependency
3. Write page files with component compositions
4. Write theme token CSS file
5. Configure Convex for any dynamic features (forms, booking)
6. Deploy to Vercel via API
7. Set up custom domain if provided

**For one-time purchase (exported) sites:**
1. Same generation as above
2. Bundle all component source code (no external dependency)
3. Include README with setup/deployment instructions
4. Package as downloadable ZIP
5. Include Convex setup guide for dynamic features

## Site Intent Document → Page Composition Example

### Input Spec (med spa example):
```json
{
  "siteType": "business",
  "conversionGoal": "booking",
  "personalityVector": [0.6, 0.9, 0.3, 0.7, 0.4, 0.6],
  "pages": [
    {
      "slug": "/",
      "title": "Home",
      "components": [
        { "componentId": "nav-centered", "variant": "transparent" },
        { "componentId": "hero-parallax", "variant": "with-subject" },
        { "componentId": "content-features", "variant": "icon-cards" },
        { "componentId": "commerce-services", "variant": "card-grid" },
        { "componentId": "proof-beforeafter", "variant": "slider" },
        { "componentId": "proof-testimonials", "variant": "carousel" },
        { "componentId": "cta-banner", "variant": "full-width" },
        { "componentId": "footer-standard", "variant": "multi-column" }
      ]
    },
    {
      "slug": "/services",
      "title": "Services",
      "components": [
        { "componentId": "hero-minimal", "variant": "with-badge" },
        { "componentId": "commerce-services", "variant": "list" },
        { "componentId": "cta-banner", "variant": "contained" },
        { "componentId": "footer-standard", "variant": "multi-column" }
      ]
    }
  ]
}
```

### Generated Output (Home Page):
```tsx
// Generated: app/page.tsx
import { NavCentered } from '@/components/library/navigation/nav-centered';
import { HeroParallax } from '@/components/library/hero/hero-parallax';
import { ContentFeatures } from '@/components/library/content/content-features';
import { CommerceServices } from '@/components/library/commerce/commerce-services';
import { ProofBeforeAfter } from '@/components/library/social-proof/proof-beforeafter';
import { ProofTestimonials } from '@/components/library/social-proof/proof-testimonials';
import { CtaBanner } from '@/components/library/cta/cta-banner';
import { FooterStandard } from '@/components/library/footer/footer-standard';
import { Section } from '@/components/library/layout/section';

export default function HomePage() {
  return (
    <>
      <NavCentered variant="transparent" {...navContent} />
      <HeroParallax variant="with-subject" {...heroContent} />
      <Section spacing="lg">
        <ContentFeatures variant="icon-cards" {...featuresContent} />
      </Section>
      <Section spacing="lg" background="surface">
        <CommerceServices variant="card-grid" {...servicesContent} />
      </Section>
      <Section spacing="lg">
        <ProofBeforeAfter variant="slider" {...beforeAfterContent} />
      </Section>
      <Section spacing="lg" background="surface">
        <ProofTestimonials variant="carousel" {...testimonialsContent} />
      </Section>
      <CtaBanner variant="full-width" {...ctaContent} />
      <FooterStandard variant="multi-column" {...footerContent} />
    </>
  );
}
```

## Future: Visual Editor Integration

For subscription sites, the visual editor would allow:
1. Direct text editing (click to edit any text)
2. Image swapping (click any image to replace)
3. Component reordering (drag to rearrange sections)
4. Component visibility toggle (show/hide sections)
5. Theme adjustments (color picker, font selector)
6. Adding new sections from the component library

All edits would be stored as overrides on top of the base spec, allowing the system to regenerate the site while preserving custom changes.
