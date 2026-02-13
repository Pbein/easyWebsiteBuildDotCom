# AI Image Generation with convex-nano-banana

> **Goal:** Replace all placeholder images with AI-generated, business-specific images using Google Gemini's native image generation via the `convex-nano-banana` Convex component.
>
> **Date:** February 2026
>
> **Status:** Planning

---

## Why This Matters

Currently, every generated site uses the same handful of hardcoded Unsplash URLs or colored-div placeholders. This is limitation #2 in our [Strategic Roadmap](../docs/STRATEGIC_ROADMAP.md) and one of the highest-impact improvements we can make — sites look obviously fake without real, relevant images.

**The fix:** Generate business-specific images on-demand during site assembly using Gemini 2.5 Flash Image (Nano Banana) via a first-party Convex component. Images are stored in Convex file storage, served via Convex URLs, and cached for reuse.

---

## Technology Overview

### convex-nano-banana

- **Package:** `npm install convex-nano-banana`
- **What it does:** Text-to-image generation + image editing directly in Convex backend
- **Powered by:** Google Gemini 2.5 Flash Image (Nano Banana) / Gemini 3 Pro Image Preview (Nano Banana Pro)
- **Key features:**
  - Images auto-stored in Convex file storage (no external bucket needed)
  - Real-time reactive status tracking (`pending` → `generating` → `complete` / `failed`)
  - Generation history with timing metrics
  - Image editing from text instructions (modify previously generated images)
  - Bring-your-own Gemini API key (server-side only)
- **Docs:** [convex.dev/components/nano-banana](https://www.convex.dev/components/nano-banana)
- **GitHub:** [github.com/dperussina/convex-nano-banana](https://github.com/dperussina/convex-nano-banana)

### Supported Models

| Model                        | Speed            | Max Resolution          | Cost   | Use Case                                   |
| ---------------------------- | ---------------- | ----------------------- | ------ | ------------------------------------------ |
| `gemini-2.5-flash-image`     | Fast (~3-8s)     | 1024px                  | Lower  | Default — hero images, section backgrounds |
| `gemini-3-pro-image-preview` | Slower (~10-20s) | Up to 4096px (1K/2K/4K) | Higher | Premium — portfolio shots, product photos  |

### Aspect Ratios

`1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`

---

## Current State Analysis

### How Images Work Today

| Component                  | Current Behavior                                                     | Image Type                          |
| -------------------------- | -------------------------------------------------------------------- | ----------------------------------- |
| `hero-split`               | Single hardcoded Unsplash URL                                        | `ImageSource` (required)            |
| `hero-centered` (bg-image) | Single hardcoded Unsplash URL                                        | `ImageSource` as `backgroundImage`  |
| `content-split`            | Same hardcoded Unsplash URL per section                              | `ImageSource` per section           |
| `team-grid`                | No images — falls back to `AvatarFallback` (initials on colored div) | `ImageSource` (optional per member) |
| `media-gallery`            | No real images — placeholder data                                    | `GalleryImage[]`                    |
| `proof-beforeafter`        | Text-based comparisons only                                          | N/A                                 |
| `content-logos`            | No logo images — text placeholders                                   | `LogoItem[]`                        |

### Existing Image Type (`base.types.ts:23-29`)

```typescript
export interface ImageSource {
  src: string; // URL — currently Unsplash or empty
  alt: string; // Alt text
  width?: number; // Defined but never populated
  height?: number; // Defined but never populated
  blurDataURL?: string; // Defined but never populated
}
```

### Key Gaps

1. Same Unsplash image reused across ALL generated sites
2. No images at all for team members, gallery, logos
3. `blurDataURL` never populated (no progressive loading)
4. `width`/`height` never set (causes layout shift)
5. MediaGallery uses plain `<img>` instead of Next.js `Image`

---

## Integration Architecture

### High-Level Flow

```
Site Spec Generated (Step 9)
         │
         ▼
┌─────────────────────┐
│  Image Planner       │ ← Analyzes spec, determines what images are needed
│  (Convex action)     │   per component (count, aspect ratio, prompt)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Batch Generator     │ ← Calls nanoBanana.generate() for each image
│  (Convex action)     │   in parallel (up to concurrency limit)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Convex File Storage │ ← Images auto-stored by nano-banana component
│  (built-in)          │   Returns generation IDs for reactive tracking
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Spec Enricher       │ ← Patches spec with real image URLs once
│  (Convex mutation)   │   all generations complete
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  AssemblyRenderer    │ ← Renders site with real images
│  (existing)          │   No changes needed — already uses ImageSource.src
└─────────────────────┘
```

### Reactive Loading UX

While images generate, the preview shows a loading state:

```
┌──────────────────────────────┐
│  Preview rendering...        │
│                              │
│  ┌────────┐  ┌────────┐     │
│  │ ░░░░░░ │  │ ████   │     │  ░ = generating (shimmer animation)
│  │ ░░░░░░ │  │ ████   │     │  █ = complete (real image)
│  └────────┘  └────────┘     │
│                              │
│  Images: 4/7 generated       │
└──────────────────────────────┘
```

Components render immediately with shimmer placeholders. As each image completes (tracked reactively via `nanoBanana.get()`), it swaps in without full page re-render.

---

## Implementation Plan

### Phase 1: Infrastructure Setup

#### 1.1 Install & Configure convex-nano-banana

```bash
npm install convex-nano-banana
```

Create `convex/convex.config.ts` (does not exist yet):

```typescript
import { defineApp } from "convex/server";
import nanoBanana from "convex-nano-banana/convex.config";

const app = defineApp();
app.use(nanoBanana);
export default app;
```

Set the Gemini API key as a Convex environment variable:

```bash
npx convex env set GEMINI_API_KEY <your-gemini-api-key>
```

#### 1.2 Create Image Generation Backend (`convex/images.ts`)

```typescript
import { v } from "convex/values";
import { action, query, mutation, internalAction } from "./_generated/server";
import { components } from "./_generated/api";
import { NanoBanana } from "convex-nano-banana";

const nanoBanana = new NanoBanana(components.nanoBanana, {
  // Key loaded from Convex env var, NOT passed from client
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
});

// Generate a single image
export const generateImage = action({
  args: {
    sessionId: v.string(),
    prompt: v.string(),
    aspectRatio: v.optional(v.string()),
    model: v.optional(v.string()),
    componentId: v.string(), // Which component this image is for
    placementIndex: v.number(), // Position within the component
  },
  handler: async (ctx, args) => {
    const generationId = await nanoBanana.generate(ctx, {
      userId: args.sessionId, // Use sessionId as userId for grouping
      prompt: args.prompt,
      aspectRatio: args.aspectRatio as any,
      model: args.model,
    });
    return generationId;
  },
});

// Get generation status (reactive — updates automatically)
export const getGeneration = query({
  args: { generationId: v.string() },
  handler: async (ctx, args) => {
    return await nanoBanana.get(ctx, args);
  },
});

// List all generations for a session
export const listSessionGenerations = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await nanoBanana.list(ctx, { userId: args.sessionId });
  },
});

// Clean up generations when session expires
export const deleteSessionImages = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await nanoBanana.deleteAllForUser(ctx, { userId: args.sessionId });
  },
});
```

#### 1.3 Extend Schema — Image Generation Tracking

Add to `convex/schema.ts`:

```typescript
imageGenerations: defineTable({
  sessionId: v.string(),
  generationId: v.string(),    // From nano-banana
  componentId: v.string(),     // e.g. "hero-split"
  placementIndex: v.number(),  // e.g. 0 for hero image, 1 for second section
  prompt: v.string(),          // The generation prompt used
  aspectRatio: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("generating"),
    v.literal("complete"),
    v.literal("failed")
  ),
  imageUrl: v.optional(v.string()),  // Convex file URL once complete
  createdAt: v.float64(),
})
  .index("by_session", ["sessionId"])
  .index("by_session_component", ["sessionId", "componentId"]),
```

---

### Phase 2: Image Planning Engine

#### 2.1 Image Requirement Analyzer (`src/lib/images/plan-images.ts`)

This module analyzes a `SiteIntentDocument` and produces a list of images that need to be generated, with appropriate prompts and aspect ratios.

```typescript
export interface ImageRequirement {
  componentId: string;
  placementIndex: number;
  prompt: string;
  aspectRatio: "1:1" | "3:2" | "16:9" | "4:3" | "2:3";
  priority: "critical" | "important" | "nice-to-have";
  model: "gemini-2.5-flash-image" | "gemini-3-pro-image-preview";
}

export function planImages(spec: SiteIntentDocument): ImageRequirement[] {
  // Walk the spec's component placements
  // For each component that uses images, generate a contextual prompt
  // Priority: hero images first, then content sections, then gallery/team
}
```

#### Component → Image Mapping

| Component            | Images Needed       | Aspect Ratio   | Priority     | Prompt Strategy                                  |
| -------------------- | ------------------- | -------------- | ------------ | ------------------------------------------------ |
| `hero-split`         | 1                   | `3:2`          | critical     | Business type + mood + industry keywords         |
| `hero-centered` (bg) | 1                   | `16:9`         | critical     | Wide atmospheric shot matching brand personality |
| `content-split`      | 1 per section (2-4) | `3:2`          | important    | Section headline + business context              |
| `team-grid`          | 1 per member (3-6)  | `1:1`          | nice-to-have | Professional headshot style, diverse             |
| `media-gallery`      | 4-8                 | `4:3` or `3:2` | nice-to-have | Industry-specific portfolio/showcase             |
| `content-logos`      | N/A                 | N/A            | skip         | Logos are better as SVG/text — skip AI gen       |

#### 2.2 Prompt Engineering Strategy

Prompts need to produce images that look like real website photography, not "AI art":

```typescript
function buildImagePrompt(
  businessName: string,
  businessType: string,
  industry: string,
  componentContext: string, // e.g. "hero image for a restaurant website"
  emotionalGoals: string[], // e.g. ["trust", "excitement"]
  antiReferences: string[], // e.g. ["no-clipart", "no-stock-photo-feel"]
  voiceProfile: string | undefined
): string {
  // Combine business context with visual direction
  // Anti-references inform negative prompts
  // Emotional goals inform mood/lighting/composition
  // Voice profile influences style (warm → soft lighting, direct → bold composition)
}
```

**Example prompt for a yoga studio hero:**

```
Professional website photography for a yoga studio called "Serene Flow".
A bright, airy yoga studio interior with natural light streaming through large
windows. A person practicing yoga in a peaceful pose. Warm, calming atmosphere.
Clean, modern space with wood floors and plants.
Style: editorial website photography, high quality, natural lighting.
Do NOT include: text, logos, watermarks, clip art, cartoon style, overly staged poses.
```

**Example prompt for a restaurant hero:**

```
Professional website photography for an Italian restaurant called "Bella Cucina".
An inviting restaurant interior with warm ambient lighting, rustic wooden tables,
and a welcoming atmosphere. Fresh ingredients and elegant plating visible.
Style: editorial food and hospitality photography, warm tones, shallow depth of field.
Do NOT include: text, logos, watermarks, clip art, people's faces.
```

---

### Phase 3: Generation Orchestration

#### 3.1 Batch Generation Action (`convex/ai/generateImages.ts`)

```typescript
export const generateImagesForSpec = action({
  args: {
    sessionId: v.string(),
    specId: v.id("siteSpecs"),
  },
  handler: async (ctx, args) => {
    // 1. Fetch the spec
    const spec = await ctx.runQuery(api.siteSpecs.getSiteSpec, {
      sessionId: args.sessionId,
    });

    // 2. Plan image requirements
    const requirements = planImages(spec);

    // 3. Generate all images (parallel, respecting rate limits)
    const generations = await Promise.allSettled(
      requirements.map((req) =>
        ctx.runAction(api.images.generateImage, {
          sessionId: args.sessionId,
          prompt: req.prompt,
          aspectRatio: req.aspectRatio,
          model: req.model,
          componentId: req.componentId,
          placementIndex: req.placementIndex,
        })
      )
    );

    // 4. Track generation IDs for reactive status
    // Save to imageGenerations table
    return {
      total: requirements.length,
      started: generations.filter((g) => g.status === "fulfilled").length,
      generationIds: generations
        .filter((g): g is PromiseFulfilledResult<string> => g.status === "fulfilled")
        .map((g) => g.value),
    };
  },
});
```

#### 3.2 Priority-Based Generation Order

Not all images are equally important. Generate in this order:

1. **Critical (blocking preview):** Hero images — generate first, preview waits for these
2. **Important (visible above fold):** First content-split section, first CTA background
3. **Nice-to-have (below fold):** Team photos, gallery images, remaining content sections

This allows the preview to render the hero immediately while lower-priority images stream in reactively.

---

### Phase 4: Preview Integration

#### 4.1 Reactive Image Loading in AssemblyRenderer

The `AssemblyRenderer` already renders components from a spec. We need to add:

1. **Image generation trigger** — Kick off `generateImagesForSpec` when preview loads
2. **Reactive image tracking** — Subscribe to generation status per image
3. **Progressive image swap** — Replace placeholder shimmer with real image as each completes

```typescript
// In demo/preview/page.tsx — new hook
function useImageGenerations(sessionId: string, generationIds: string[]) {
  // Subscribe to each generation's reactive status
  // Return a map of componentId → imageUrl (or null if still generating)
  // AssemblyRenderer merges these into the spec's ImageSource fields
}
```

#### 4.2 Shimmer Placeholder Component

New shared component for use across all library components while images generate:

```typescript
// src/components/library/shared/ImagePlaceholder.tsx
export function ImagePlaceholder({
  aspectRatio = "3:2",
  status = "generating",
}: {
  aspectRatio?: string;
  status?: "pending" | "generating" | "complete" | "failed";
}) {
  return (
    <div className="relative overflow-hidden bg-gray-200 animate-pulse"
         style={{ aspectRatio }}>
      {status === "generating" && <ShimmerOverlay />}
      {status === "failed" && <FailedPlaceholder />}
    </div>
  );
}
```

#### 4.3 Component-Level Changes

Each image-consuming component needs a small update to handle `generating` state:

- **If `image.src` starts with `convex://generating:`** → show shimmer placeholder
- **If `image.src` is a valid Convex URL** → render normally with Next.js Image
- **If `image.src` is empty/undefined** → fall back to current behavior (Unsplash or initials)

**Alternative (cleaner) approach:** Extend `ImageSource` with an optional status field:

```typescript
export interface ImageSource {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  generationId?: string; // NEW — nano-banana generation ID
  generationStatus?: "pending" | "generating" | "complete" | "failed"; // NEW
}
```

---

### Phase 5: Spec Enrichment

#### 5.1 Image URL Patching

Once all images are generated, patch the spec with real URLs:

```typescript
// convex/ai/enrichSpec.ts
export const enrichSpecWithImages = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Fetch all completed generations for this session
    // 2. Fetch the current spec
    // 3. Walk the spec's component placements
    // 4. Replace ImageSource.src with Convex file URLs
    // 5. Save the enriched spec
  },
});
```

This ensures the spec saved in Convex has real image URLs, so re-opening a session later shows real images without regenerating.

#### 5.2 Export Pipeline Update

The export pipeline (`src/lib/export/generate-project.ts`) currently embeds image URLs directly in HTML. With Convex-hosted images:

- **Option A: Embed as remote URLs** — Convex file URLs in the exported HTML (requires internet)
- **Option B: Download & bundle** — Fetch images, include as files in the ZIP (offline-capable, larger ZIP)
- **Recommended: Option B** — Download images and include in `images/` folder in the ZIP, rewrite `src` attributes to relative paths

---

### Phase 6: Image Editing & Refinement (Future)

Once base generation works, `convex-nano-banana` also supports image editing:

```typescript
// Edit an existing generated image
const editedId = await nanoBanana.edit(ctx, {
  userId: sessionId,
  prompt: "Make the lighting warmer and add more plants in the background",
  inputImages: [{ base64: existingImageBase64, mimeType: "image/png" }],
  GEMINI_API_KEY: apiKey,
});

// Or edit directly from a previously stored image
const editedId = await nanoBanana.editFromStorage(ctx, {
  userId: sessionId,
  prompt: "Change the color scheme to cooler tones",
  inputStorageIds: [previousStorageId],
  GEMINI_API_KEY: apiKey,
});
```

This enables a future "refine images" feature in the preview toolbar — users could click an image and type natural language edits.

---

## File Changes Summary

### New Files

| File                                                 | Purpose                                             |
| ---------------------------------------------------- | --------------------------------------------------- |
| `convex/convex.config.ts`                            | Convex app config — registers nano-banana component |
| `convex/images.ts`                                   | Image generation actions, queries, mutations        |
| `convex/ai/generateImages.ts`                        | Batch image generation orchestrator                 |
| `src/lib/images/plan-images.ts`                      | Spec → image requirements analyzer                  |
| `src/lib/images/prompt-builder.ts`                   | Business context → image prompt generator           |
| `src/lib/images/index.ts`                            | Barrel export                                       |
| `src/components/library/shared/ImagePlaceholder.tsx` | Shimmer placeholder during generation               |

### Modified Files

| File                                         | Change                                                                       |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| `convex/schema.ts`                           | Add `imageGenerations` table                                                 |
| `src/components/library/base.types.ts`       | Add `generationId?` and `generationStatus?` to `ImageSource`                 |
| `src/app/demo/preview/page.tsx`              | Trigger image generation, reactive tracking, progressive loading             |
| `src/lib/assembly/AssemblyRenderer.tsx`      | Pass image generation state to components                                    |
| `src/lib/export/generate-project.ts`         | Download and bundle images in ZIP                                            |
| `convex/ai/generateSiteSpec.ts`              | Output image prompt hints per component (instead of hardcoded Unsplash URLs) |
| `src/lib/assembly/deterministic-fallback.ts` | Replace hardcoded Unsplash with image prompt metadata                        |

### Components That Need Image Loading State

| Component                      | Change Needed                                                         |
| ------------------------------ | --------------------------------------------------------------------- |
| `hero-split`                   | Handle shimmer → real image transition                                |
| `hero-centered` (bg variant)   | Handle shimmer → real background transition                           |
| `content-split`                | Handle shimmer → real image per section                               |
| `team-grid` (cards variant)    | Handle shimmer → real headshot, keep AvatarFallback as final fallback |
| `media-gallery` (all variants) | Handle shimmer → real images, migrate to Next.js Image                |

---

## API Key & Cost Considerations

### Gemini API Key

- Stored as Convex environment variable: `GEMINI_API_KEY`
- Never exposed to the client
- Passed server-side by the `NanoBanana` constructor
- For multi-tenant (future): could store per-user keys in Convex and pass per-request

### Cost Estimates Per Site Generation

| Scenario                                       | Images | Model | Est. Cost   |
| ---------------------------------------------- | ------ | ----- | ----------- |
| Minimal site (hero + 2 content sections)       | 3      | Flash | ~$0.01-0.03 |
| Standard site (hero + content + team)          | 8-10   | Flash | ~$0.03-0.08 |
| Premium site (hero + content + team + gallery) | 15-20  | Flash | ~$0.06-0.15 |
| Premium with Pro model                         | 15-20  | Pro   | ~$0.15-0.40 |

At Flash pricing, image generation is extremely affordable — even 20 images per site is under $0.15.

### Rate Limiting

- Gemini API has per-minute rate limits
- `Promise.allSettled` in the batch generator handles partial failures gracefully
- Consider a concurrency limit of 5-8 parallel generations per session
- Failed generations can be retried individually without regenerating the whole batch

---

## Implementation Order & Dependencies

```
Phase 1: Infrastructure (1.1 → 1.2 → 1.3)
    │
    ▼
Phase 2: Image Planning (2.1 → 2.2)
    │
    ▼
Phase 3: Generation Orchestration (3.1 → 3.2)
    │
    ▼
Phase 4: Preview Integration (4.1 → 4.2 → 4.3)
    │
    ▼
Phase 5: Spec Enrichment (5.1 → 5.2)
    │
    ▼
Phase 6: Image Editing (future — after refinement chat MVP)
```

### Estimated Scope

- **Phase 1-2:** ~1 day (setup + planning engine)
- **Phase 3:** ~1 day (orchestration + parallel generation)
- **Phase 4:** ~2 days (preview integration + shimmer states + component updates)
- **Phase 5:** ~1 day (spec patching + export update)
- **Phase 6:** Future work (ties into refinement chat feature)

---

## Open Questions

1. **Team headshots:** Should we generate AI headshots for fictional team members? This could look uncanny — consider keeping AvatarFallback (initials) as default, with AI headshots as an opt-in premium feature.

2. **Gallery images:** For portfolio/gallery sites, how many images is the right balance between quality and generation time? (Recommendation: 6-8 with lazy generation for below-fold items.)

3. **Logo generation:** `content-logos` currently shows partner/client logos. AI-generated logos would be low quality. Better to keep as text placeholders or use simple geometric marks. Skip for now.

4. **Image caching:** Should we cache images by prompt hash across sessions? A yoga studio hero prompt might produce a reusable image. This would reduce costs but could make sites feel samey. (Recommendation: No caching initially — each site gets unique images.)

5. **Model selection:** Default to Flash for speed + cost, but offer Pro as a toggle in the preview toolbar for users who want higher quality? (Recommendation: Yes — add a "HD Images" toggle.)

---

## Sources

- [Nano Banana Convex Component](https://www.convex.dev/components/nano-banana)
- [convex-nano-banana GitHub](https://github.com/dperussina/convex-nano-banana)
- [Nano Banana (Gemini Image Generation)](https://ai.google.dev/gemini-api/docs/image-generation)
- [Nano Banana Pro (Gemini 3 Pro Image)](https://blog.google/innovation-and-ai/products/nano-banana-pro/)
- [Convex File Storage — Storing Generated Files](https://docs.convex.dev/file-storage/store-files)
- [AI Image Generation Guide 2026](https://medium.com/@davidlfliang/guide-api-image-generation-2026-nano-banana-imagen-flux-gpt-image-0bff59e9d163)
