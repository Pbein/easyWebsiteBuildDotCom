# Component Library Specification

> **Implementation Status (as of Feb 2026):** 10 MVP components built (Phase 1 of component development complete). All are fully functional with theme token consumption, responsive design, and manifest descriptors. A live preview of all components is available at `/preview` with the "Meridian Studio" sample site.

## Overview

The component library is the core building block system for EasyWebsiteBuild. Every UI element on generated websites comes from this library. Components are self-contained, variant-aware, theme-token driven, and composable.

## Design Principles

1. **Token-driven** — Components NEVER hardcode colors, fonts, or brand-specific values. All visual properties come from CSS Custom Properties (design tokens).
2. **Variant-rich** — Each component type supports multiple visual variants that share the same data contract.
3. **Content-agnostic** — Components accept structured content via props and render it. They don't know or care about the specific business.
4. **Responsive** — All components are fully responsive across mobile, tablet, and desktop.
5. **Accessible** — WCAG 2.1 AA compliance as baseline. Semantic HTML, ARIA attributes, keyboard navigation.
6. **Performance** — Optimized for Core Web Vitals. Lazy loading, image optimization, minimal JS.

## Component File Structure

Each component follows this structure:

```
src/components/library/[category]/[component-name]/
├── index.ts                         # Public export (re-exports component + types)
├── [ComponentName].tsx              # Component implementation (all variants in one file)
├── [component-name].types.ts       # TypeScript interfaces extending BaseComponentProps
├── manifest.json                    # Manifest for assembly engine (siteTypes, personalityFit, variants, tags)
└── [component-name].tokens.ts      # Token consumption declarations (consumedTokens array)
```

**Shared files:**

- `src/components/library/base.types.ts` — `BaseComponentProps`, `ImageSource`, `LinkItem`, `CTAButton`
- `src/components/library/index.ts` — Barrel export for all components and types
- `src/components/library/manifest-index.ts` — All manifests + `getManifestById()`, `getManifestsByCategory()`, `getManifestsBySiteType()` lookup utilities

## Component Props Contract

All components extend a base interface:

```typescript
interface BaseComponentProps {
  id?: string;
  className?: string;
  theme?: Partial<ThemeTokens>; // Optional inline theme overrides
  animate?: boolean; // Enable/disable entry animations
  spacing?: "none" | "sm" | "md" | "lg" | "xl"; // Section spacing
}
```

## Component Manifest Schema

```json
{
  "id": "hero-parallax",
  "category": "hero",
  "name": "Parallax Hero",
  "description": "Full-viewport hero with parallax depth layers and optional alpha-masked foreground subject",
  "siteTypes": ["business", "booking", "portfolio", "personal"],
  "personalityFit": {
    "minimal_rich": [0.4, 1.0],
    "playful_serious": [0.3, 0.9],
    "warm_cool": [0.0, 1.0],
    "light_bold": [0.5, 1.0],
    "classic_modern": [0.4, 1.0],
    "calm_dynamic": [0.5, 1.0]
  },
  // NOTE: personalityFit values use number[] (not tuple) for JSON compatibility
  "requiredProps": [
    { "name": "headline", "type": "string", "description": "Primary headline text" },
    { "name": "backgroundImage", "type": "ImageSource", "description": "Background layer image" }
  ],
  "optionalProps": [
    { "name": "subheadline", "type": "string" },
    {
      "name": "foregroundImage",
      "type": "ImageSource",
      "description": "Alpha-masked foreground subject"
    },
    {
      "name": "midgroundElements",
      "type": "ImageSource[]",
      "description": "Mid-layer parallax elements"
    },
    { "name": "ctaText", "type": "string" },
    { "name": "ctaLink", "type": "string" },
    { "name": "overlayGradient", "type": "GradientSpec" },
    { "name": "height", "type": "'viewport' | 'large' | 'medium'" }
  ],
  "consumedTokens": [
    "color-primary",
    "color-text-on-dark",
    "font-heading",
    "font-body",
    "text-6xl",
    "text-xl",
    "radius-lg",
    "shadow-xl",
    "transition-slow",
    "animation-distance"
  ],
  "variants": [
    { "id": "default", "name": "Standard Parallax" },
    { "id": "with-subject", "name": "With Foreground Subject Mask" },
    { "id": "with-video", "name": "With Video Background Layer" },
    { "id": "with-particles", "name": "With Particle Effect Overlay" }
  ],
  "tags": ["luxury", "dramatic", "immersive", "visual-heavy"]
}
```

## Full Component Inventory

### Navigation Components

| ID              | Name               | Variants                            | Use Cases                 | Status   |
| --------------- | ------------------ | ----------------------------------- | ------------------------- | -------- |
| `nav-sticky`    | Sticky Navigation  | transparent, solid                  | Most site types           | ✅ Built |
| `nav-hamburger` | Hamburger Menu     | slide-left, slide-right, fullscreen | Mobile, minimal sites     |          |
| `nav-mega`      | Mega Menu          | grid, columns, featured             | Large sites, ecommerce    |          |
| `nav-centered`  | Centered Logo Nav  | with-topbar, minimal                | Luxury, boutique          |          |
| `nav-sidebar`   | Sidebar Navigation | fixed, collapsible                  | Dashboards, documentation |          |

### Hero Components

| ID               | Name                      | Variants                                      | Best For             | Status   |
| ---------------- | ------------------------- | --------------------------------------------- | -------------------- | -------- |
| `hero-centered`  | Centered Text Hero        | with-bg-image, gradient-bg                    | Universal            | ✅ Built |
| `hero-split`     | Split Hero                | image-left, image-right                       | Business, services   | ✅ Built |
| `hero-video`     | Video Background Hero     | autoplay, play-button, loop                   | Creative, events     |          |
| `hero-parallax`  | Parallax Hero             | default, with-subject, with-video             | Luxury, creative     |          |
| `hero-carousel`  | Carousel Hero             | fade, slide, with-thumbnails                  | Ecommerce, portfolio |          |
| `hero-minimal`   | Minimal Hero              | text-only, with-line, with-badge              | Minimal, editorial   |          |
| `hero-fullbleed` | Full Bleed Image Hero     | overlay-dark, overlay-light, overlay-gradient | Photography, events  |          |
| `hero-animated`  | Animated/Interactive Hero | particles, morphing, typed-text               | Tech, creative       |          |

### Content Blocks

| ID                   | Name             | Variants                            | Best For            | Status   |
| -------------------- | ---------------- | ----------------------------------- | ------------------- | -------- |
| `content-text`       | Text Block       | centered                            | Universal           | ✅ Built |
| `content-features`   | Feature Grid     | icon-cards                          | Business, SaaS      | ✅ Built |
| `content-cards`      | Card Grid        | uniform, masonry, horizontal-scroll | Universal           |          |
| `content-split`      | Split Content    | alternating                         | Services, about     | ✅ Built |
| `content-stats`      | Stats/Numbers    | inline, cards, animated-counter     | Business, nonprofit |          |
| `content-timeline`   | Timeline         | vertical, horizontal, branching     | About, history      |          |
| `content-comparison` | Comparison Table | toggle, side-by-side, stacked       | Pricing, products   |          |
| `content-logos`      | Logo Cloud       | grid, scroll, fade                  | Trust building      |          |
| `content-accordion`  | FAQ/Accordion    | single-open, multi-open, bordered   | Universal           |          |
| `content-tabs`       | Tabbed Content   | horizontal, vertical, pill-style    | Services, features  |          |

### Social Proof

| ID                   | Name               | Variants                     | Best For            | Status   |
| -------------------- | ------------------ | ---------------------------- | ------------------- | -------- |
| `proof-testimonials` | Testimonials       | carousel                     | Universal           | ✅ Built |
| `proof-reviews`      | Review Cards       | star-rating, quote, video    | Ecommerce, services |          |
| `proof-casestudies`  | Case Study Preview | card, full-width, numbered   | B2B, agencies       |          |
| `proof-beforeafter`  | Before/After       | slider, side-by-side, toggle | Med spa, renovation |          |

### Team & People

| ID               | Name           | Variants                           | Best For           | Status |
| ---------------- | -------------- | ---------------------------------- | ------------------ | ------ |
| `team-grid`      | Team Grid      | cards, minimal, hover-reveal       | Business, agencies |        |
| `team-carousel`  | Team Carousel  | cards, headshots                   | Large teams        |        |
| `team-spotlight` | Team Spotlight | founder-story, leadership, sidebar | About pages        |        |

### Media

| ID                | Name             | Variants                             | Best For            | Status |
| ----------------- | ---------------- | ------------------------------------ | ------------------- | ------ |
| `media-gallery`   | Image Gallery    | grid, masonry, lightbox              | Portfolio, events   |        |
| `media-video`     | Video Embed      | inline, modal, with-poster           | Universal           |        |
| `media-portfolio` | Portfolio Grid   | filterable, hover-detail, case-study | Portfolio, creative |        |
| `media-showcase`  | Showcase Section | parallax-image, reveal, zoom         | Luxury, creative    |        |

### CTA (Call to Action)

| ID               | Name              | Variants                     | Best For         | Status   |
| ---------------- | ----------------- | ---------------------------- | ---------------- | -------- |
| `cta-banner`     | CTA Banner        | full-width, contained        | Universal        | ✅ Built |
| `cta-card`       | CTA Card          | centered, with-image, split  | Universal        |          |
| `cta-floating`   | Floating CTA      | bottom-bar, corner, slide-in | Conversion focus |          |
| `cta-newsletter` | Newsletter Signup | inline, popup, footer        | Content, blogs   |          |

### Forms & Interactive

| ID               | Name           | Variants                         | Best For           | Status   |
| ---------------- | -------------- | -------------------------------- | ------------------ | -------- |
| `form-contact`   | Contact Form   | simple                           | Business, services | ✅ Built |
| `form-booking`   | Booking Widget | calendar, time-slots, multi-step | Booking sites      |          |
| `form-search`    | Search Bar     | header, full-page, with-filters  | Directory, blog    |          |
| `form-subscribe` | Subscribe Form | inline, banner, modal            | Content, community |          |

### Commerce

| ID                  | Name           | Variants                  | Best For          | Status |
| ------------------- | -------------- | ------------------------- | ----------------- | ------ |
| `commerce-products` | Product Grid   | cards, list, featured     | Ecommerce         |        |
| `commerce-detail`   | Product Detail | gallery, split, tabbed    | Ecommerce         |        |
| `commerce-services` | Service Menu   | card-grid, list, tiered   | Services, booking |        |
| `commerce-pricing`  | Pricing Table  | columns, toggle, featured | SaaS, services    |        |

### Footer Components

| ID                | Name            | Variants                      | Best For         | Status   |
| ----------------- | --------------- | ----------------------------- | ---------------- | -------- |
| `footer-standard` | Standard Footer | multi-column                  | Universal        | ✅ Built |
| `footer-minimal`  | Minimal Footer  | centered, with-links          | Minimal sites    |          |
| `footer-cta`      | CTA Footer      | with-newsletter, with-contact | Conversion focus |          |
| `footer-mega`     | Mega Footer     | with-sitemap, with-blog       | Large sites      |          |

---

## Component Development Priority

### Phase 1 (MVP) ✅ COMPLETE

All 10 core components built with full theme token consumption, responsive design, and manifest descriptors:

1. ✅ `nav-sticky` — transparent + solid variants; responsive mobile menu
2. ✅ `hero-centered` — with-bg-image + gradient-bg variants
3. ✅ `hero-split` — image-right + image-left variants; decorative accent element
4. ✅ `content-features` — icon-cards variant; Lucide icon lookup, hover lift + shadow
5. ✅ `content-split` — alternating variant; rows flip image side, scroll animation
6. ✅ `content-text` — centered variant; eyebrow, headline, body (supports HTML)
7. ✅ `cta-banner` — full-width + contained variants; 4 bg options
8. ✅ `form-contact` — simple variant; client-side validation, error states, success animation
9. ✅ `footer-standard` — multi-column variant; SVG social icons, copyright bar
10. ✅ `proof-testimonials` — carousel variant; pagination dots, star ratings, avatar fallbacks

Also built: `section` wrapper (6 bg variants, 5 spacing presets, container constraints)

### Phase 2 (Expand Visual Range) — Next

- `hero-parallax` (all variants including subject mask)
- `hero-video` (autoplay, play-button)
- `nav-centered` (with-topbar, minimal)
- `nav-hamburger` (fullscreen, slide)
- `media-gallery` (grid, masonry, lightbox)
- `team-grid` (cards, hover-reveal)
- `commerce-services` (card-grid, list, tiered)
- `commerce-pricing` (columns, toggle)
- `content-stats` (animated-counter, cards)
- `proof-beforeafter` (slider, side-by-side)
- `content-accordion` (FAQ)
- `content-timeline` (vertical)

### Phase 3 (Full Coverage)

- All remaining components from the inventory tables above
- Commerce components (product grid, detail, cart, checkout)
- Community/membership components
- Blog/content components
