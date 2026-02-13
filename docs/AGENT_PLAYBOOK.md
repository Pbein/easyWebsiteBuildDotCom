# Agent Playbook — Adding Components & CSS Effects

> The canonical step-by-step guide for adding new library components or CSS effects to EasyWebsiteBuild.

## Prerequisites

Before starting, read and understand:

1. **`CLAUDE.md`** — project instructions, tech stack, architecture
2. **`src/components/library/base.types.ts`** — `BaseComponentProps`, `ImageSource`, `LinkItem`, `CTAButton`
3. **A reference component** at your complexity level:
   - Simple: `content-text` (1 variant, text-only)
   - Medium: `content-features` (icon-cards, Lucide lookup)
   - Complex: `commerce-services` (3 variants, tiered pricing)

---

## Part 1: Adding a Library Component (15-Point Checklist)

### Files to CREATE (5–6 files)

#### 1. Types — `src/components/library/{category}/{id}/{id}.types.ts`

```typescript
import type { BaseComponentProps, ImageSource, CTAButton } from "../../base.types";

/** Individual item type (if applicable). */
export interface PlanItem {
  name: string;
  description: string;
  price?: string;
  features?: string[];
  featured?: boolean;
  cta?: CTAButton;
}

/** Component props — MUST extend BaseComponentProps. */
export interface PricingTableProps extends BaseComponentProps {
  headline?: string;
  subheadline?: string;
  plans: PlanItem[];
  variant?: "simple" | "featured" | "comparison";
}
```

**Rules:**

- Always extend `BaseComponentProps`
- Use `ImageSource` for any image field
- Use `CTAButton` for CTA buttons
- Critical field naming — see the table below

#### 2. Manifest — `src/components/library/{category}/{id}/{id}.manifest.json`

```json
{
  "id": "pricing-table",
  "category": "commerce",
  "name": "Pricing Table",
  "description": "Display pricing plans with feature comparison...",
  "siteTypes": ["business", "ecommerce", "booking"],
  "personalityFit": {
    "minimal_rich": [0.0, 1.0],
    "playful_serious": [0.3, 1.0],
    "warm_cool": [0.0, 1.0],
    "light_bold": [0.0, 1.0],
    "classic_modern": [0.0, 1.0],
    "calm_dynamic": [0.0, 1.0]
  },
  "requiredProps": [
    { "name": "plans", "type": "PlanItem[]", "description": "Array of pricing plans" }
  ],
  "optionalProps": [
    { "name": "headline", "type": "string" },
    { "name": "subheadline", "type": "string" },
    { "name": "variant", "type": "string", "description": "simple | featured | comparison" }
  ],
  "consumedTokens": [
    "color-primary",
    "color-primary-light",
    "color-primary-dark",
    "color-background",
    "color-surface",
    "color-surface-elevated",
    "color-text",
    "color-text-secondary",
    "color-text-on-primary",
    "color-border",
    "color-border-light",
    "font-heading",
    "font-body",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-3xl",
    "leading-tight",
    "leading-normal",
    "leading-relaxed",
    "weight-medium",
    "weight-semibold",
    "weight-bold",
    "radius-md",
    "radius-lg",
    "radius-xl",
    "shadow-sm",
    "shadow-md",
    "shadow-lg",
    "transition-base",
    "transition-fast",
    "ease-default",
    "container-max",
    "space-section",
    "space-component",
    "space-element"
  ],
  "variants": [
    { "id": "simple", "name": "Simple", "description": "Clean pricing cards" },
    { "id": "featured", "name": "Featured", "description": "One plan highlighted" },
    {
      "id": "comparison",
      "name": "Comparison",
      "description": "Side-by-side feature comparison table"
    }
  ],
  "tags": ["pricing", "plans", "commerce", "SaaS"]
}
```

**Rules:**

- `personalityFit` values are `number[]` (not tuples) for JSON compatibility
- `siteTypes` must match the 7 site types: business, booking, portfolio, personal, ecommerce, blog, nonprofit
- `consumedTokens` — list every CSS custom property the component uses (without `--` prefix)

#### 3. Component — `src/components/library/{category}/{id}/{PascalName}.tsx`

```typescript
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { tokensToCSSProperties } from "@/lib/theme";
import type { PricingTableProps } from "./{id}.types";

export function PricingTable({
  headline,
  subheadline,
  plans,
  variant = "simple",
  theme,
  animate = true,
  className = "",
}: PricingTableProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const themeStyle = theme ? tokensToCSSProperties(theme) : {};

  return (
    <div ref={ref} className={`w-full ${className}`} style={themeStyle}>
      {/* Header */}
      {headline && (
        <div className="text-center mb-8 md:mb-16">
          <h2
            className="font-bold mb-3 md:mb-4"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-3xl)",
              lineHeight: "var(--leading-tight)",
              color: "var(--color-text)",
            }}
          >
            {headline}
          </h2>
          {subheadline && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-lg)",
                color: "var(--color-text-secondary)",
              }}
            >
              {subheadline}
            </p>
          )}
        </div>
      )}

      {/* Content — render based on variant */}
      {/* ... variant-specific rendering ... */}
    </div>
  );
}
```

**Critical rules:**

- `"use client"` directive at top
- `useRef` + `useInView` from framer-motion for entry animations
- `tokensToCSSProperties(theme)` for inline theme overrides
- ALL colors via CSS custom properties: `var(--color-*)` — **NEVER** hardcoded hex/rgb
- Mobile-first responsive: `mb-8 md:mb-16`, `p-5 md:p-8`, `gap-4 md:gap-8`
- Font size clamping for large display text: `clamp(var(--text-2xl), 5vw, var(--text-4xl))`
- CTA buttons: `px-5 py-3 md:px-7 md:py-3.5`

#### 4. Tokens — `src/components/library/{category}/{id}/{id}.tokens.ts`

```typescript
export const PRICING_TABLE_TOKENS = [
  "--color-primary",
  "--color-primary-light",
  "--color-primary-dark",
  "--color-background",
  "--color-surface",
  "--color-surface-elevated",
  "--color-text",
  "--color-text-secondary",
  "--color-text-on-primary",
  "--color-border",
  "--color-border-light",
  "--font-heading",
  "--font-body",
  "--text-sm",
  "--text-base",
  "--text-lg",
  "--text-xl",
  "--text-2xl",
  "--text-3xl",
  "--leading-tight",
  "--leading-normal",
  "--leading-relaxed",
  "--weight-medium",
  "--weight-semibold",
  "--weight-bold",
  "--radius-md",
  "--radius-lg",
  "--radius-xl",
  "--shadow-sm",
  "--shadow-md",
  "--shadow-lg",
  "--transition-base",
  "--transition-fast",
  "--ease-default",
  "--container-max",
  "--space-section",
  "--space-component",
  "--space-element",
] as const;
```

#### 5. Barrel — `src/components/library/{category}/{id}/index.ts`

```typescript
export { PricingTable } from "./PricingTable";
export type { PricingTableProps, PlanItem } from "./pricing-table.types";
export { PRICING_TABLE_TOKENS } from "./pricing-table.tokens";
```

#### 6. (Optional) Variant files

For components with 3+ complex variants, split into:

- `shared.tsx` — common sub-components
- `variants/SimpleVariant.tsx`
- `variants/FeaturedVariant.tsx`
- `variants/ComparisonVariant.tsx`

### Files to MODIFY (6 files)

#### 7. Library barrel — `src/components/library/index.ts`

Add export lines:

```typescript
/* ── Commerce (continued) ────────────────────────────────────── */
export { PricingTable } from "./commerce/pricing-table";
export type { PricingTableProps, PlanItem } from "./commerce/pricing-table";
```

#### 8. Manifest index — `src/components/library/manifest-index.ts`

```typescript
import pricingTableManifest from "./commerce/pricing-table/pricing-table.manifest.json";

// Add to COMPONENT_MANIFESTS array:
export const COMPONENT_MANIFESTS: ComponentManifest[] = [
  // ... existing manifests ...
  pricingTableManifest,
] as ComponentManifest[];
```

#### 9. Component registry — `src/lib/assembly/component-registry.ts`

```typescript
import { PricingTable } from "@/components/library";

const COMPONENT_REGISTRY: Record<string, ComponentType<any>> = {
  // ... existing entries ...
  "pricing-table": PricingTable,
};
```

#### 10. AI spec generator — `convex/ai/generateSiteSpec.ts` (TWO places)

**Place 1: AI prompt component definitions** (~line 2961 area)
Add a component definition block in the prompt string.

**Place 2: Deterministic fallback** (~line 1386 area)
Add conditional placement logic:

```typescript
if (["ecommerce", "booking", "business"].includes(siteType)) {
  components.push({
    componentId: "pricing-table",
    variant: "featured",
    order: nextOrder++,
    content: {
      /* sample content */
    },
  });
}
```

#### 11. Export pipeline — `src/lib/export/generate-project.ts`

Add a render function in the switch case for the new component.

#### 12. Preview page — `src/app/preview/page.tsx`

Add demo content and render the component with sample data.

### Tests to UPDATE (2+ files)

#### 13. Registry test — `tests/unit/assembly/component-registry.test.ts`

Update the component count and add the new ID to the list.

#### 14. Manifest test — `tests/unit/assembly/manifest-index.test.ts`

Update the manifest count.

#### 15. New component tests

Create `tests/unit/components/{id}.test.tsx`:

- Renders with required props
- Each variant renders correctly
- Uses CSS custom properties (no hardcoded hex)
- ARIA attributes present
- Mobile spacing pattern (search for `md:`)

---

## Part 2: Adding a CSS Effect (9-Step Checklist)

### 1. Create effect file — `src/lib/css-effects/{category}/{effect-name}.ts`

```typescript
import type { CSSEffectResult, EffectConfig, EffectManifest } from "../types";

export const MY_EFFECT_MANIFEST: EffectManifest = {
  id: "{category}/{effect-name}",
  category: "{category}",
  name: "My Effect",
  description: "...",
  performance: "low", // low | medium | high
  requiresJS: false,
  consumedTokens: ["--color-primary"],
  tags: ["..."],
};

export function myEffect(config?: EffectConfig): CSSEffectResult {
  const primary = config?.colorPrimary ?? "var(--color-primary)";

  if (config?.reducedMotion || config?.intensity === 0) {
    return { style: {} }; // graceful degradation
  }

  return {
    style: {
      /* CSSProperties */
    },
    // For animated effects:
    keyframes: `@keyframes ewb-my-effect { ... }`,
    keyframeName: "ewb-my-effect",
  };
}
```

### 2. Create category barrel — `src/lib/css-effects/{category}/index.ts`

### 3. Register in `src/lib/css-effects/registry.ts`

### 4. Export from `src/lib/css-effects/index.ts`

### 5. Write tests — `tests/unit/css-effects/{effect-name}.test.ts`

Required test cases:

1. Returns valid CSSProperties with expected keys
2. Uses CSS custom properties by default (contains `var(--color-`)
3. Uses provided colors when config supplies them
4. Reduced motion returns empty/minimal style
5. Keyframe generation produces valid `@keyframes` string (if animated)
6. Intensity scaling respects multiplier

### 6. (Optional) Wire into AssemblyRenderer

If the effect should be auto-applied by the spec, add it to the `effects` array in `VisualConfig`.

### 7. (Optional) Add to deterministic fallback

In `convex/ai/generateSiteSpec.ts`, map site types to default effects.

### 8. (Optional) Add to AI prompt

Document the effect in the AI prompt section of generateSiteSpec.

### 9. Verify

```bash
npm run build   # zero errors
npm run lint    # clean
npm run test    # all pass
```

---

## Content Field Naming Rules (Critical!)

| Component           | Field         | Correct            | Wrong                           |
| ------------------- | ------------- | ------------------ | ------------------------------- |
| `commerce-services` | Item name     | `name`             | ~~title~~                       |
| `team-grid`         | Member photo  | `image`            | ~~avatar~~                      |
| `content-timeline`  | Date field    | `date`             | ~~year~~                        |
| `proof-beforeafter` | Items array   | `comparisons`      | ~~items~~                       |
| `content-stats`     | Stat value    | `value` (number)   | ~~value~~ (string)              |
| `content-split`     | Rows array    | `sections`         | ~~rows~~                        |
| `content-split`     | Section image | `image` (optional) | ~~required~~                    |
| `hero-split`        | Hero image    | `image` (optional) | ~~required~~                    |
| `content-logos`     | Header        | `headline`         | ~~subheadline~~ (doesn't exist) |
| `pricing-table`     | Plan name     | `name`             | ~~title~~                       |
| `content-steps`     | Step items    | `steps`            | ~~items~~                       |
| `blog-preview`      | Post items    | `posts`            | ~~articles~~                    |

---

## Testing Requirements

### Component Tests

```typescript
import { render, screen } from "@testing-library/react";
import { PricingTable } from "@/components/library";

describe("PricingTable", () => {
  const defaultProps = {
    plans: [
      { name: "Basic", price: "$9/mo", features: ["Feature 1"] },
      { name: "Pro", price: "$29/mo", features: ["Feature 1", "Feature 2"], featured: true },
    ],
  };

  it("renders with required props", () => {
    render(<PricingTable {...defaultProps} />);
    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it("renders headline when provided", () => {
    render(<PricingTable {...defaultProps} headline="Our Plans" />);
    expect(screen.getByText("Our Plans")).toBeInTheDocument();
  });

  it("uses CSS custom properties for colors", () => {
    const { container } = render(<PricingTable {...defaultProps} />);
    const html = container.innerHTML;
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}/);  // no hardcoded hex
  });

  it("uses mobile-first responsive spacing", () => {
    const { container } = render(<PricingTable {...defaultProps} />);
    const html = container.innerHTML;
    // Components should have responsive classes
    expect(container.querySelector("[class*='md:']")).toBeTruthy();
  });
});
```

### CSS Effect Tests

```typescript
import { gradientText } from "@/lib/css-effects";

describe("gradientText", () => {
  it("returns valid CSSProperties", () => {
    const result = gradientText();
    expect(result.style).toBeDefined();
    expect(result.style.background).toBeDefined();
  });

  it("uses CSS custom properties by default", () => {
    const result = gradientText();
    expect(JSON.stringify(result.style)).toContain("var(--color-primary)");
  });

  it("uses provided colors", () => {
    const result = gradientText({ colorPrimary: "#ff0000" });
    expect(JSON.stringify(result.style)).toContain("#ff0000");
  });

  it("returns minimal style for reduced motion", () => {
    const result = gradientText({ reducedMotion: true });
    expect(result.style.background).toBeUndefined();
  });
});
```

---

## Verification Protocol

After every change:

1. `npm run build` — zero errors
2. `npm run lint` — zero warnings
3. `npm run test` — all pass
4. Manual check: preview page renders the component with all 7 theme presets
5. Manual check: responsive at 375px, 768px, 1024px, 1440px

---

## Reference Components

| Complexity     | Component            | Path                                                      | Key Features                                    |
| -------------- | -------------------- | --------------------------------------------------------- | ----------------------------------------------- |
| Simple         | `content-text`       | `src/components/library/content/content-text/`            | 1 variant, text-only, `dangerouslySetInnerHTML` |
| Medium         | `content-features`   | `src/components/library/content/content-features/`        | Lucide icon lookup, grid layout                 |
| Complex        | `commerce-services`  | `src/components/library/commerce/commerce-services/`      | 3 variants, tiered pricing, featured flag       |
| Responsive     | `proof-testimonials` | `src/components/library/social-proof/proof-testimonials/` | useState + resize for perPage                   |
| Image-optional | `hero-split`         | `src/components/library/hero/hero-split/`                 | ImagePlaceholder fallback                       |
