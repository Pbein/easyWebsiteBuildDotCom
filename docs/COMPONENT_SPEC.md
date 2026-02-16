# Component Library Specification

> **Implementation Status (as of 2026-02-16):** 24 components built across 8 categories (Phase 1 MVP + Phase 4B expansion + Phase 5A visual foundation + Wave 1). All are fully functional with theme token consumption, responsive design, and manifest descriptors. A live preview of all components is available at `/preview` with the "Meridian Studio" sample site. All 24 components are registered in the assembly engine (`COMPONENT_REGISTRY`) and supported by both AI and deterministic spec generation.
>
> **Wave 1 additions (6 components):** PricingTable, ContentSteps, ContentComparison, HeroVideo, BlogPreview, ContentMap. CSS effects system with 8 effects. See CLAUDE.md for component table with all variants.
>
> **Phase 5A additions:** `hero-split` and `content-split` images are now optional — render `ImagePlaceholder` (gradient/pattern/shimmer) when absent. `section` wrapper extended with `dividerTop`, `dividerBottom`, `pattern`, `patternSize`, `patternPosition`, `patternOpacity` props for CSS-driven visual richness. `VisualConfig` on `ComponentPlacement` flows patterns and dividers through the spec pipeline.

## Overview

The component library is the core building block system for EasyWebsiteBuild. Every UI element on generated websites comes from this library. Components are self-contained, variant-aware, theme-token driven, and composable.

## Design Principles

1. **Token-driven** — Components NEVER hardcode colors, fonts, or brand-specific values. All visual properties come from CSS Custom Properties (design tokens).
2. **Variant-rich** — Each component type supports multiple visual variants that share the same data contract.
3. **Content-agnostic** — Components accept structured content via props and render it. They don't know or care about the specific business.
4. **Responsive** — All components are fully responsive across mobile, tablet, and desktop.
5. **Accessible** — WCAG 2.1 AA compliance as baseline. Semantic HTML, ARIA attributes, keyboard navigation.
6. **Performance** — Optimized for Core Web Vitals. Lazy loading, image optimization, minimal JS.
7. **Image-resilient** — Components with images (`hero-split`, `content-split`) render `ImagePlaceholder` (gradient/pattern/shimmer) when images are absent. No broken or empty image tags.
8. **Visually configurable** — Components render inside `Section` wrappers that accept CSS patterns, section dividers (wave/angle/curve/zigzag), and decorative overlays via `VisualConfig`.

## Component File Structure

Components use one of two patterns:

**Standard pattern** (14 components — single-file implementation):

```
src/components/library/[category]/[component-name]/
├── index.ts                         # Public export (re-exports component + types)
├── [ComponentName].tsx              # Component implementation (all variants in one file)
├── [component-name].types.ts       # TypeScript interfaces extending BaseComponentProps
├── manifest.json                    # Manifest for assembly engine (siteTypes, personalityFit, variants, tags)
└── [component-name].tokens.ts      # Token consumption declarations (consumedTokens array)
```

**Variant-extracted pattern** (4 components — shared base + variant subdirectory):

```
src/components/library/[category]/[component-name]/
├── index.ts                         # Public export (unchanged)
├── [ComponentName].tsx              # Thin dispatcher — imports shared + variants
├── shared.tsx                       # Shared constants, utilities, and sub-components
├── variants/
│   ├── [variant-a].tsx              # Individual variant implementation
│   ├── [variant-b].tsx
│   └── ...
├── [component-name].types.ts       # TypeScript interfaces (unchanged)
├── manifest.json                    # Manifest (unchanged)
└── [component-name].tokens.ts      # Token consumption declarations (unchanged)
```

**Components using the variant-extracted pattern:**

| Component           | Variants in `variants/`                           |
| ------------------- | ------------------------------------------------- |
| `hero-centered`     | `with-bg-image.tsx`, `gradient-bg.tsx`            |
| `commerce-services` | `card-grid.tsx`, `list.tsx`, `tiered.tsx`         |
| `team-grid`         | `cards.tsx`, `minimal.tsx`, `hover-reveal.tsx`    |
| `media-gallery`     | `grid.tsx`, `masonry.tsx`, `lightbox-overlay.tsx` |

The main `[ComponentName].tsx` becomes a thin dispatcher (~50-70 lines) that handles common logic (section wrapper, theme injection, spacing) and delegates variant rendering to the appropriate file. The `shared.tsx` file contains constants (spacing maps, column maps), utility functions, and small shared sub-components used across variants.

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
  "description": "Full-viewport hero with parallax depth layers",
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
    { "name": "headline", "type": "string", "description": "Primary headline text" }
  ],
  "optionalProps": [{ "name": "subheadline", "type": "string" }],
  "consumedTokens": ["color-primary", "color-text-on-dark", "font-heading", "font-body"],
  "variants": [{ "id": "default", "name": "Standard Parallax" }],
  "tags": ["luxury", "dramatic", "immersive"]
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

| ID               | Name                      | Variants                                      | Best For             | Status                    |
| ---------------- | ------------------------- | --------------------------------------------- | -------------------- | ------------------------- |
| `hero-centered`  | Centered Text Hero        | with-bg-image, gradient-bg                    | Universal            | ✅ Built                  |
| `hero-split`     | Split Hero                | image-left, image-right                       | Business, services   | ✅ Built (image optional) |
| `hero-video`     | Video Background Hero     | autoplay, play-button, loop                   | Creative, events     |                           |
| `hero-parallax`  | Parallax Hero             | default, with-subject, with-video             | Luxury, creative     |                           |
| `hero-carousel`  | Carousel Hero             | fade, slide, with-thumbnails                  | Ecommerce, portfolio |                           |
| `hero-minimal`   | Minimal Hero              | text-only, with-line, with-badge              | Minimal, editorial   |                           |
| `hero-fullbleed` | Full Bleed Image Hero     | overlay-dark, overlay-light, overlay-gradient | Photography, events  |                           |
| `hero-animated`  | Animated/Interactive Hero | particles, morphing, typed-text               | Tech, creative       |                           |

### Content Blocks

| ID                   | Name             | Variants                            | Best For            | Status                    |
| -------------------- | ---------------- | ----------------------------------- | ------------------- | ------------------------- |
| `content-text`       | Text Block       | centered                            | Universal           | ✅ Built                  |
| `content-features`   | Feature Grid     | icon-cards                          | Business, SaaS      | ✅ Built                  |
| `content-split`      | Split Content    | alternating                         | Services, about     | ✅ Built (image optional) |
| `content-stats`      | Stats/Numbers    | inline, cards, animated-counter     | Business, nonprofit | ✅ Built                  |
| `content-timeline`   | Timeline         | vertical, alternating               | About, history      | ✅ Built                  |
| `content-logos`      | Logo Cloud       | grid, scroll, fade                  | Trust building      | ✅ Built                  |
| `content-accordion`  | FAQ/Accordion    | single-open, multi-open, bordered   | Universal           | ✅ Built                  |
| `content-cards`      | Card Grid        | uniform, masonry, horizontal-scroll | Universal           |                           |
| `content-comparison` | Comparison Table | toggle, side-by-side, stacked       | Pricing, products   |                           |
| `content-tabs`       | Tabbed Content   | horizontal, vertical, pill-style    | Services, features  |                           |

### Social Proof

| ID                   | Name               | Variants                   | Best For            | Status   |
| -------------------- | ------------------ | -------------------------- | ------------------- | -------- |
| `proof-testimonials` | Testimonials       | carousel                   | Universal           | ✅ Built |
| `proof-beforeafter`  | Before/After       | slider, side-by-side       | Med spa, renovation | ✅ Built |
| `proof-reviews`      | Review Cards       | star-rating, quote, video  | Ecommerce, services |          |
| `proof-casestudies`  | Case Study Preview | card, full-width, numbered | B2B, agencies       |          |

### Team & People

| ID               | Name           | Variants                           | Best For           | Status   |
| ---------------- | -------------- | ---------------------------------- | ------------------ | -------- |
| `team-grid`      | Team Grid      | cards, minimal, hover-reveal       | Business, agencies | ✅ Built |
| `team-carousel`  | Team Carousel  | cards, headshots                   | Large teams        |          |
| `team-spotlight` | Team Spotlight | founder-story, leadership, sidebar | About pages        |          |

### Media

| ID                | Name             | Variants                             | Best For            | Status   |
| ----------------- | ---------------- | ------------------------------------ | ------------------- | -------- |
| `media-gallery`   | Image Gallery    | grid, masonry, lightbox              | Portfolio, events   | ✅ Built |
| `media-video`     | Video Embed      | inline, modal, with-poster           | Universal           |          |
| `media-portfolio` | Portfolio Grid   | filterable, hover-detail, case-study | Portfolio, creative |          |
| `media-showcase`  | Showcase Section | parallax-image, reveal, zoom         | Luxury, creative    |          |

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

| ID                  | Name           | Variants                  | Best For          | Status   |
| ------------------- | -------------- | ------------------------- | ----------------- | -------- |
| `commerce-services` | Service Menu   | card-grid, list, tiered   | Services, booking | ✅ Built |
| `commerce-products` | Product Grid   | cards, list, featured     | Ecommerce         |          |
| `commerce-detail`   | Product Detail | gallery, split, tabbed    | Ecommerce         |          |
| `commerce-pricing`  | Pricing Table  | columns, toggle, featured | SaaS, services    |          |

### Footer Components

| ID                | Name            | Variants                      | Best For         | Status   |
| ----------------- | --------------- | ----------------------------- | ---------------- | -------- |
| `footer-standard` | Standard Footer | multi-column                  | Universal        | ✅ Built |
| `footer-minimal`  | Minimal Footer  | centered, with-links          | Minimal sites    |          |
| `footer-cta`      | CTA Footer      | with-newsletter, with-contact | Conversion focus |          |
| `footer-mega`     | Mega Footer     | with-sitemap, with-blog       | Large sites      |          |

---

## Built Components — Detailed Reference

### Phase 1 (MVP) — 10 Core Components + Section Wrapper

1. **`nav-sticky`** — transparent (solidifies on scroll) + solid variants; responsive mobile menu with hamburger toggle
2. **`hero-centered`** — with-bg-image (gradient overlay) + gradient-bg (layered radial mesh) variants
3. **`hero-split`** — image-right + image-left variants; decorative accent element behind image; **image optional** — renders `ImagePlaceholder` (gradient/pattern/shimmer) when no image provided
4. **`content-features`** — icon-cards variant; Lucide icon lookup via `* as LucideIcons`, hover lift + shadow, staggered entry animation
5. **`content-split`** — alternating variant; rows flip image side, per-row scroll animation; **image optional per section** — renders `ImagePlaceholder` when image is absent
6. **`content-text`** — centered variant; eyebrow, headline, body (supports HTML via `dangerouslySetInnerHTML`)
7. **`cta-banner`** — full-width + contained variants; 4 background options (primary/dark/gradient/image)
8. **`form-contact`** — simple variant; client-side validation, error states, success animation
9. **`proof-testimonials`** — carousel variant; pagination dots, star ratings, avatar fallbacks
10. **`footer-standard`** — multi-column variant; logo, tagline, link columns, SVG social icons, copyright bar
11. **`section`** — universal layout wrapper with 6 bg variants, 5 spacing presets, container constraints; **Phase 5A extensions:** `dividerTop`/`dividerBottom` (wave/angle/curve/zigzag SVG), `pattern` (CSS background), `patternSize`, `patternPosition`, `patternOpacity` props for CSS-driven visual richness

### Phase 4B — 8 Additional Components

12. **`content-stats`** — inline, cards, animated-counter variants; `StatItem.value` is `number` type, auto-formats with suffix/prefix
13. **`content-accordion`** — single-open, multi-open, bordered variants; keyboard accessible, smooth height transitions
14. **`content-timeline`** — vertical, alternating variants; `TimelineItem.date` field (not `year`), connecting lines, scroll-triggered entry
15. **`content-logos`** — grid, scroll, fade variants; accepts logo names with auto-generated placeholder icons, `headline` field (no `subheadline`)
16. **`proof-beforeafter`** — slider (interactive drag) + side-by-side variants; `comparisons` array (not `items`), keyboard accessible (arrow keys), touch support
17. **`team-grid`** — cards, minimal, hover-reveal variants; `TeamMember.image` field (not `avatar`), `members` array
18. **`commerce-services`** — card-grid, list, tiered variants; `ServiceItem.name` field (not `title`), `services` array
19. **`media-gallery`** — grid, masonry, lightbox variants; filter tabs by category, keyboard navigation for lightbox, `GalleryImage` with src/alt/caption/category

### Critical Type Interface Notes

When generating content for components (in AI spec generation or deterministic fallback), field names MUST match exactly:

| Component           | Correct Field      | Wrong Field        |
| ------------------- | ------------------ | ------------------ |
| `content-stats`     | `value: number`    | `value: string`    |
| `commerce-services` | `name`             | `title`            |
| `team-grid`         | `image`            | `avatar`           |
| `content-timeline`  | `date`             | `year`             |
| `proof-beforeafter` | `comparisons`      | `items`            |
| `content-logos`     | `headline`         | (no `subheadline`) |
| `content-stats`     | `value` (number)   | `value` (string)   |
| `content-split`     | `image` (OPTIONAL) | (required)         |
| `hero-split`        | `image` (OPTIONAL) | (required)         |

### Visual Config Interface (Phase 5A)

Components can receive visual configuration through the `VisualConfig` type on `ComponentPlacement`:

```typescript
interface VisualConfig {
  pattern?: string; // CSS background value for decorative pattern
  dividerBottom?: "wave" | "angle" | "curve" | "zigzag" | "none";
  parallaxEnabled?: boolean;
  scrollRevealIntensity?: "none" | "subtle" | "moderate" | "dramatic";
}
```

The `AssemblyRenderer` resolves `VisualConfig` into Section props using theme colors:

- Pattern ID → `generatePattern(id, themeColor)` → CSS background value
- Divider style → SVG `SectionDivider` component at section edges
- Pattern opacity defaults to 0.06

### ImagePlaceholder Component (Phase 5A)

When `hero-split` or `content-split` images are absent, `ImagePlaceholder` renders instead:

| Variant    | Behavior                                      |
| ---------- | --------------------------------------------- |
| `gradient` | Gradient base + SVG noise overlay             |
| `pattern`  | Gradient + CSS pattern from industry defaults |
| `shimmer`  | Gradient + animate-pulse loading shimmer      |

All variants are theme-token-aware, deriving colors from the active palette.

---

## Future: Complex Interactive Components

These components require deeper integration work beyond simple assembly rendering. They involve multi-step flows, third-party services, and state management that goes beyond the current static-preview model.

### Booking Flows

**`form-booking`** — Multi-step booking wizard

- **Step 1:** Service selection (from a configurable service menu)
- **Step 2:** Date/time picker (calendar integration)
- **Step 3:** Client information form
- **Step 4:** Confirmation + optional payment
- **Variants:** `calendar`, `time-slots`, `multi-step`
- **Considerations:** Requires a backend booking API or third-party integration (Calendly, Acuity, Cal.com). In assembly preview, renders a static mockup of the booking flow. When deployed, connects to the configured booking provider.

### E-commerce Flows

**Product Detail with Variant Selector**

- Image gallery with zoom/lightbox
- Size/color/option variant selector with dynamic pricing
- Add-to-cart with quantity controls
- Related products carousel

**Cart Sidebar**

- Slide-in cart with item list, quantity adjustment, and subtotal
- Promo code input
- Proceed to checkout CTA

**Checkout Multi-Step**

- Step 1: Shipping information
- Step 2: Payment (Stripe Elements integration)
- Step 3: Order review + confirmation
- **Considerations:** Requires Stripe or equivalent payment processor. Cart state management via Zustand or React context. Inventory tracking via Convex.

### Demo/Live Modes

Components that behave differently in assembly preview vs. deployed sites:

| Component        | Demo Mode (Preview)                       | Live Mode (Deployed)                       |
| ---------------- | ----------------------------------------- | ------------------------------------------ |
| `form-contact`   | Shows form, logs submission to console    | Sends email via API route or Convex action |
| `form-booking`   | Shows static calendar mockup              | Connects to Calendly/Cal.com API           |
| `commerce-*`     | Shows product cards with placeholder data | Connects to Stripe/Shopify                 |
| `cta-newsletter` | Shows email input, no-op on submit        | Connects to Mailchimp/ConvertKit           |

Implementation: Components accept a `mode: "demo" | "live"` prop. The assembly renderer passes `mode="demo"`. Deployed sites pass `mode="live"` with the necessary API configuration.

### Third-Party Integration Strategy

Rather than hardcoding specific services, the platform should support a **provider abstraction layer**:

```typescript
interface IntegrationProvider {
  id: string; // e.g., "calendly", "stripe", "mailchimp"
  category: string; // e.g., "booking", "payment", "email"
  configSchema: object; // JSON Schema for required config (API keys, IDs)
  component: React.ComponentType; // Wrapper component that handles the integration
}
```

This allows:

- Swapping providers without changing component code (e.g., Calendly → Cal.com)
- Storing integration config in Convex per-site
- Rendering appropriate setup prompts during site deployment
- Graceful degradation when no provider is configured (show placeholder with setup CTA)
