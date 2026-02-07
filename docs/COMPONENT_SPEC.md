# Component Library Specification

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
components/library/[category]/[component-name]/
├── index.ts                    # Public export
├── [ComponentName].tsx         # Default/primary variant
├── [ComponentName][Variant].tsx # Additional variants
├── [component-name].types.ts   # TypeScript interfaces
├── [component-name].manifest.json  # Manifest for assembly engine
└── [component-name].tokens.ts  # Token consumption declarations
```

## Component Props Contract

All components extend a base interface:

```typescript
interface BaseComponentProps {
  id?: string;
  className?: string;
  theme?: Partial<ThemeTokens>;  // Optional inline theme overrides
  animate?: boolean;             // Enable/disable entry animations
  spacing?: "none" | "sm" | "md" | "lg" | "xl";  // Section spacing
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
  "requiredProps": [
    { "name": "headline", "type": "string", "description": "Primary headline text" },
    { "name": "backgroundImage", "type": "ImageSource", "description": "Background layer image" }
  ],
  "optionalProps": [
    { "name": "subheadline", "type": "string" },
    { "name": "foregroundImage", "type": "ImageSource", "description": "Alpha-masked foreground subject" },
    { "name": "midgroundElements", "type": "ImageSource[]", "description": "Mid-layer parallax elements" },
    { "name": "ctaText", "type": "string" },
    { "name": "ctaLink", "type": "string" },
    { "name": "overlayGradient", "type": "GradientSpec" },
    { "name": "height", "type": "'viewport' | 'large' | 'medium'" }
  ],
  "consumedTokens": [
    "color-primary", "color-text-on-dark", "font-heading", "font-body",
    "text-6xl", "text-xl", "radius-lg", "shadow-xl",
    "transition-slow", "animation-distance"
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

| ID | Name | Variants | Use Cases |
|----|------|----------|-----------|
| `nav-sticky` | Sticky Navigation | transparent, solid, blur-bg | Most site types |
| `nav-hamburger` | Hamburger Menu | slide-left, slide-right, fullscreen | Mobile, minimal sites |
| `nav-mega` | Mega Menu | grid, columns, featured | Large sites, ecommerce |
| `nav-centered` | Centered Logo Nav | with-topbar, minimal | Luxury, boutique |
| `nav-sidebar` | Sidebar Navigation | fixed, collapsible | Dashboards, documentation |

### Hero Components

| ID | Name | Variants | Best For |
|----|------|----------|----------|
| `hero-centered` | Centered Text Hero | with-bg-image, gradient-bg, solid-bg | Universal |
| `hero-split` | Split Hero | image-left, image-right, overlap | Business, services |
| `hero-video` | Video Background Hero | autoplay, play-button, loop | Creative, events |
| `hero-parallax` | Parallax Hero | default, with-subject, with-video | Luxury, creative |
| `hero-carousel` | Carousel Hero | fade, slide, with-thumbnails | Ecommerce, portfolio |
| `hero-minimal` | Minimal Hero | text-only, with-line, with-badge | Minimal, editorial |
| `hero-fullbleed` | Full Bleed Image Hero | overlay-dark, overlay-light, overlay-gradient | Photography, events |
| `hero-animated` | Animated/Interactive Hero | particles, morphing, typed-text | Tech, creative |

### Content Blocks

| ID | Name | Variants | Best For |
|----|------|----------|----------|
| `content-text` | Text Block | centered, left-aligned, with-sidebar | Universal |
| `content-features` | Feature Grid | icon-cards, image-cards, list | Business, SaaS |
| `content-cards` | Card Grid | uniform, masonry, horizontal-scroll | Universal |
| `content-split` | Split Content | image-left, image-right, alternating | Services, about |
| `content-stats` | Stats/Numbers | inline, cards, animated-counter | Business, nonprofit |
| `content-timeline` | Timeline | vertical, horizontal, branching | About, history |
| `content-comparison` | Comparison Table | toggle, side-by-side, stacked | Pricing, products |
| `content-logos` | Logo Cloud | grid, scroll, fade | Trust building |
| `content-accordion` | FAQ/Accordion | single-open, multi-open, bordered | Universal |
| `content-tabs` | Tabbed Content | horizontal, vertical, pill-style | Services, features |

### Social Proof

| ID | Name | Variants | Best For |
|----|------|----------|----------|
| `proof-testimonials` | Testimonials | carousel, grid, featured-single | Universal |
| `proof-reviews` | Review Cards | star-rating, quote, video | Ecommerce, services |
| `proof-casestudies` | Case Study Preview | card, full-width, numbered | B2B, agencies |
| `proof-beforeafter` | Before/After | slider, side-by-side, toggle | Med spa, renovation |

### Team & People

| ID | Name | Variants | Best For |
|----|------|----------|----------|
| `team-grid` | Team Grid | cards, minimal, hover-reveal | Business, agencies |
| `team-carousel` | Team Carousel | cards, headshots | Large teams |
| `team-spotlight` | Team Spotlight | founder-story, leadership, sidebar | About pages |

### Media

| ID | Name | Variants | Best For |
|----|------|----------|----------|
| `media-gallery` | Image Gallery | grid, masonry, lightbox | Portfolio, events |
| `media-video` | Video Embed | inline, modal, with-poster | Universal |
| `media-portfolio` | Portfolio Grid | filterable, hover-detail, case-study | Portfolio, creative |
| `media-showcase` | Showcase Section | parallax-image, reveal, zoom | Luxury, creative |

### CTA (Call to Action)

| ID | Name | Variants | Best For |
|----|------|----------|----------|
| `cta-banner` | CTA Banner | full-width, contained, gradient | Universal |
| `cta-card` | CTA Card | centered, with-image, split | Universal |
| `cta-floating` | Floating CTA | bottom-bar, corner, slide-in | Conversion focus |
| `cta-newsletter` | Newsletter Signup | inline, popup, footer | Content, blogs |

### Forms & Interactive

| ID | Name | Variants | Best For |
|----|------|----------|----------|
| `form-contact` | Contact Form | simple, with-map, split | Business, services |
| `form-booking` | Booking Widget | calendar, time-slots, multi-step | Booking sites |
| `form-search` | Search Bar | header, full-page, with-filters | Directory, blog |
| `form-subscribe` | Subscribe Form | inline, banner, modal | Content, community |

### Commerce

| ID | Name | Variants | Best For |
|----|------|----------|----------|
| `commerce-products` | Product Grid | cards, list, featured | Ecommerce |
| `commerce-detail` | Product Detail | gallery, split, tabbed | Ecommerce |
| `commerce-services` | Service Menu | card-grid, list, tiered | Services, booking |
| `commerce-pricing` | Pricing Table | columns, toggle, featured | SaaS, services |

### Footer Components

| ID | Name | Variants | Best For |
|----|------|----------|----------|
| `footer-standard` | Standard Footer | multi-column, two-column | Universal |
| `footer-minimal` | Minimal Footer | centered, with-links | Minimal sites |
| `footer-cta` | CTA Footer | with-newsletter, with-contact | Conversion focus |
| `footer-mega` | Mega Footer | with-sitemap, with-blog | Large sites |

---

## Component Development Priority

### Phase 1 (MVP — Build First)
1. `nav-sticky` (transparent + solid variants)
2. `hero-centered` (with-bg-image variant)
3. `hero-split` (image-right variant)
4. `content-features` (icon-cards variant)
5. `content-split` (alternating variant)
6. `cta-banner` (full-width variant)
7. `form-contact` (simple variant)
8. `footer-standard` (multi-column variant)
9. `proof-testimonials` (carousel variant)
10. `content-text` (centered variant)

### Phase 2 (Expand Visual Range)
- `hero-parallax` (all variants)
- `hero-video`
- `nav-centered`
- `media-gallery`
- `team-grid`
- `commerce-services`
- `content-stats`
- `proof-beforeafter`

### Phase 3 (Full Coverage)
- All remaining components
- Commerce components
- Community/membership components
- Blog/content components
