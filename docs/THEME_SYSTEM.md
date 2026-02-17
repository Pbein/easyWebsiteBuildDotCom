# Theme System Specification

> **Implementation Status (as of 2026-02-16):** Fully implemented with emotional overrides, VLM feedback loop, CSS visual system integration, customization sidebar, and Brand Discovery real-time theme updates.
>
> - **87 CSS Custom Properties** across 6 categories (colors, typography, spacing, shape, shadows, animation)
> - **Token map** (`src/lib/theme/token-map.ts`) — camelCase ↔ CSS variable mapping with `tokensToCSSProperties()` and `tokensToCSSString()` converters. Accepts `Partial<ThemeTokens>`.
> - **Theme generation** (`src/lib/theme/generate-theme.ts`) — `generateThemeFromVector()` uses chroma-js for palette generation, 14 curated font pairings scored by personality fit + business type, industry color hue shifting, dark/light mode business bias
> - **Emotional overrides** (`src/lib/theme/emotional-overrides.ts`) — Adjusts spacing (±40% clamped), transitions (±50% clamped), animation intensity, radius, AND colors based on emotional goals and anti-references. All adjustments are clamped to safe ranges to prevent extreme values.
> - **Primary color derivation** (`src/lib/theme/derive-from-primary.ts`) — `deriveThemeFromPrimaryColor()` generates full palette from single hex using chroma-js
> - **Font pairings** (`src/lib/theme/font-pairings.ts`) — 14 curated pairings, 5 free (`FREE_FONT_IDS`), `getFontPairingById()` lookup
> - **ThemeProvider + useTheme** (`src/lib/theme/ThemeProvider.tsx`) — React context that injects tokens as CSS custom properties on a wrapper `<div>`, supports nested overrides
> - **7 presets built** (`src/lib/theme/presets.ts`): Luxury Dark, Modern Clean, Warm Professional, Bold Creative, Editorial, Tech Forward, Organic Natural — ALL IMPLEMENTED
> - **5-layer theme composition** in preview: base (preset or generated variant) → VLM overrides → emotional overrides (from Brand Discovery or spec) → primary color override → font pairing override
> - **Preview page** (`/preview`) — live theme switching across all 24 components with preset selector + custom personality vector sliders
> - **Customization sidebar** (Phase 6A) — 7 presets, color picker, 5/14 fonts, H1/H2 headline editing, reset to AI original
> - **Brand Discovery** (Phase 6C) — Post-generation character capture (emotions, voice, archetype, anti-refs) in sidebar with real-time theme/content feedback
> - **VLM feedback** — Claude Vision evaluates screenshots against intent, suggests `Partial<ThemeTokens>` adjustments, merged onto active theme via `useMemo` for instant re-render
> - **CSS visual system integration** (Phase 5A) — Theme colors flow into CSS patterns (`generatePattern(id, themeColor)`), section dividers (SVG fill from theme tokens), gradient utilities (`generateMeshGradient(primary, secondary, accent)`), and `ImagePlaceholder` variants. Visual vocabulary per business type resolved via `getVisualVocabulary()` with archetype and personality overrides.

## Overview

The theme system is what prevents every generated website from looking the same. It translates the brand personality captured during intake into a complete set of CSS Custom Properties (design tokens) that all components consume.

## Design Token Categories

### Color Tokens

```
--color-primary           Main brand color
--color-primary-light     Lighter shade for hover states, backgrounds
--color-primary-dark      Darker shade for active states, text
--color-secondary         Supporting brand color
--color-secondary-light
--color-accent            Highlight/attention color
--color-background        Page background
--color-surface           Card/component backgrounds
--color-surface-elevated  Elevated surfaces (modals, dropdowns)
--color-text              Primary text
--color-text-secondary    Secondary/muted text
--color-text-on-primary   Text on primary color backgrounds
--color-text-on-dark      Text on dark backgrounds
--color-border            Default border color
--color-border-light      Subtle borders
--color-success
--color-warning
--color-error
```

### Typography Tokens

```
--font-heading            Heading font family
--font-body               Body text font family
--font-accent             Special/decorative font (optional)
--font-mono               Code/technical font

--text-xs through --text-7xl    Font size scale
--leading-tight/normal/relaxed  Line height scale
--tracking-tight/normal/wide    Letter spacing scale
--weight-normal/medium/semibold/bold  Font weight scale
```

### Spacing Tokens

```
--space-section           Between major sections (4-8rem)
--space-component         Between components within a section (2-4rem)
--space-element           Between elements within a component (1-2rem)
--space-tight             Small gaps (0.5-1rem)
--container-max           Maximum content width (1024-1440px)
--container-narrow        Narrow content width (640-768px)
```

### Shape Tokens

```
--radius-sm/md/lg/xl/full     Border radius scale
--border-width                Default border width
```

### Shadow Tokens

```
--shadow-sm/md/lg/xl          Shadow scale
--shadow-color                Shadow color (for colored shadows)
```

### Animation Tokens

```
--transition-fast/base/slow   Transition duration
--ease-default                Default easing function
--animation-distance          How far elements move in animations
--animation-scale             Scale factor for zoom animations
```

## Personality Vector → Theme Mapping

The 6-axis personality vector [minimal_rich, playful_serious, warm_cool, light_bold, classic_modern, calm_dynamic] maps to tokens:

### Axis 1: Minimal (0) ↔ Rich (1)

- **0.0-0.3**: Large spacing, no shadows, no borders, monochrome palette, thin borders
- **0.4-0.6**: Moderate spacing, subtle shadows, accent color, standard borders
- **0.7-1.0**: Compact spacing, layered shadows, multiple accent colors, decorative borders, background textures

### Axis 2: Playful (0) ↔ Serious (1)

- **0.0-0.3**: Rounded fonts (rounded sans-serif), high saturation, large radius, bouncy easing
- **0.4-0.6**: Clean sans-serif, moderate saturation, medium radius
- **0.7-1.0**: Serif or geometric sans, desaturated tones, small or no radius, subtle easing

### Axis 3: Warm (0) ↔ Cool (1)

- **0.0-0.3**: Warm neutrals (cream, tan, warm gray), warm hue rotation, earth tones
- **0.4-0.6**: Neutral gray palette, balanced hues
- **0.7-1.0**: Cool neutrals (blue-gray, slate), cool hue rotation, steel/ice tones

### Axis 4: Light (0) ↔ Bold (1)

- **0.0-0.3**: Thin font weights, high whitespace ratio, subtle contrast, light backgrounds
- **0.4-0.6**: Medium weights, balanced contrast, standard backgrounds
- **0.7-1.0**: Heavy weights, high contrast, dark backgrounds possible, strong visual weight

### Axis 5: Classic (0) ↔ Modern (1)

- **0.0-0.3**: Serif heading fonts, ornamental details, traditional proportions, warm palettes
- **0.4-0.6**: Transitional serif or clean sans, balanced approach
- **0.7-1.0**: Geometric sans-serif, minimal ornamentation, contemporary proportions, monospace accents

### Axis 6: Calm (0) ↔ Dynamic (1)

- **0.0-0.3**: Slow transitions, minimal animation, static layouts, subtle hover effects
- **0.4-0.6**: Standard transitions, entry animations, smooth scrolling
- **0.7-1.0**: Fast transitions, scroll-triggered animations, parallax effects, interactive elements

## Curated Font Pairings

### Serious + Classic (Luxury)

- Cormorant Garamond / Outfit
- Playfair Display / Source Sans 3
- Libre Baskerville / Nunito Sans

### Serious + Modern (Corporate)

- Sora / DM Sans
- General Sans / Cabinet Grotesk
- Manrope / Karla

### Playful + Modern (Creative)

- Clash Display / Satoshi
- Cabinet Grotesk / General Sans
- Space Grotesk / Outfit (use sparingly)

### Classic + Warm (Traditional)

- Lora / Merriweather Sans
- Crimson Pro / Open Sans
- Spectral / Work Sans

### Bold + Dynamic (Impact)

- Bebas Neue / Barlow
- Oswald / Lato
- Anton / Nunito

### Minimal + Cool (Tech)

- JetBrains Mono (accents) / Inter (body exception for tech)
- IBM Plex Mono / IBM Plex Sans
- Fira Code (accents) / DM Sans

## Theme Presets

### Preset: Luxury Dark ✅ Implemented

```
personality: [0.6, 0.9, 0.3, 0.8, 0.3, 0.5]
colors: deep navy, gold accents, cream text, rich shadows
fonts: Cormorant Garamond / Outfit
radius: small (2-4px)
spacing: generous
animations: slow, elegant
```

### Preset: Luxury Light (Not yet implemented — candidate for future)

```
personality: [0.5, 0.8, 0.2, 0.5, 0.3, 0.4]
colors: ivory/cream base, muted gold, charcoal text, soft shadows
fonts: Playfair Display / Source Sans 3
radius: none to small
spacing: very generous
animations: subtle
```

### Preset: Modern Clean ✅ Implemented

```
personality: [0.2, 0.6, 0.6, 0.5, 0.9, 0.4]
colors: white base, single accent color, near-black text
fonts: Sora / DM Sans
radius: medium (6-8px)
spacing: generous
animations: smooth, functional
```

### Preset: Bold Creative ✅ Implemented

```
personality: [0.7, 0.3, 0.4, 0.9, 0.8, 0.9]
colors: vibrant primaries, high contrast, unexpected combinations
fonts: Clash Display / Satoshi
radius: mixed (sharp + rounded)
spacing: dynamic (varies by section)
animations: energetic, scroll-triggered
```

### Preset: Warm Professional ✅ Implemented

```
personality: [0.4, 0.5, 0.2, 0.5, 0.5, 0.4]
colors: warm whites, terracotta/sage accents, brown-black text
fonts: Lora / Merriweather Sans
radius: medium-large (8-12px)
spacing: comfortable
animations: gentle
```

### Preset: Editorial ✅ Implemented

```
personality: [0.5, 0.7, 0.5, 0.7, 0.7, 0.3]
colors: high contrast, black/white with single bold accent
fonts: Libre Baskerville / Nunito Sans
radius: none
spacing: structured (grid-based)
animations: minimal, typography-focused
```

### Preset: Tech Forward ✅ Implemented

```
personality: [0.4, 0.7, 0.8, 0.6, 1.0, 0.7]
colors: dark backgrounds, gradient accents, neon highlights
fonts: JetBrains Mono (accents) / DM Sans
radius: medium (6-8px)
spacing: moderate
animations: smooth, with glow effects
```

## Theme Application

Components consume tokens via CSS custom properties:

```tsx
// Component uses tokens — never hardcoded values
<h1
  style={{
    fontFamily: "var(--font-heading)",
    fontSize: "var(--text-5xl)",
    color: "var(--color-text)",
    letterSpacing: "var(--tracking-tight)",
  }}
>
  {headline}
</h1>
```

Or via Tailwind with custom properties:

```tsx
<h1 className="font-[family-name:var(--font-heading)] text-[length:var(--text-5xl)] text-[color:var(--color-text)]">
  {headline}
</h1>
```

The preferred approach is extending Tailwind config to map tokens:

```js
// tailwind.config.ts (for generated sites)
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
      // ... etc
    },
    fontFamily: {
      heading: 'var(--font-heading)',
      body: 'var(--font-body)',
    }
  }
}
```

This way components use normal Tailwind classes (`text-primary`, `font-heading`) but the actual values come from the theme tokens.

## CSS Visual System Integration (Phase 5A)

Theme colors are the source of truth for the entire CSS visual system (`src/lib/visuals/`). All visual elements derive their colors from the active theme:

### Pattern Color Resolution

```
pattern ID (e.g., "herringbone")
  ↓
generatePattern(id, theme.colorPrimary)  →  CSS background value
  ↓
Section pattern overlay (absolute positioned, pointer-events-none)
```

14 CSS-only patterns are available: pinstripe, diagonal-stripes, dots, grid, herringbone, cross-hatch, zigzag, waves, concentric-circles, seigaiha, topography, diamonds, circuit-dots, polka-dots.

### Section Dividers

SVG dividers (wave, angle, curve, zigzag) render at section edges using `fillColor` derived from the adjacent section's background color:

```tsx
<SectionDivider style="wave" position="bottom" fillColor={nextSectionBg} />
```

### Gradient Utilities

- `generateMeshGradient(primary, secondary, accent, angle)` — Layered radial + linear gradients from theme colors
- `generatePlaceholderGradient(primary, secondary, variant)` — Soft/bold/diagonal gradients for `ImagePlaceholder`
- `generateNoiseOverlay(opacity)` — SVG feTurbulence noise for subtle texture

### Visual Vocabulary

Each business type gets a coherent visual language resolved by `getVisualVocabulary(subType, siteType)`:

```typescript
interface VisualVocabulary {
  sectionDivider: "wave" | "angle" | "curve" | "zigzag" | "none";
  accentShape: "circle" | "rectangle" | "organic" | "diamond" | "none";
  imageOverlay: "none" | "gradient" | "vignette" | "duotone";
  decorativeOpacity: number;
  preferredImageAspect: "landscape" | "portrait" | "square";
  enableParallax: boolean;
  scrollRevealIntensity: "none" | "subtle" | "moderate" | "dramatic";
}
```

Visual vocabulary is further refined by:

- `applyArchetypeOverrides(vocab, archetype)` — 6 archetypes (guide, creative, rebel, artisan, caretaker, expert)
- `applyPersonalityOverrides(vocab, personalityVector)` — adjusts based on personality axes
