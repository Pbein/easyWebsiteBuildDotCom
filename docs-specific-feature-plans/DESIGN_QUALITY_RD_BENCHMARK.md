# Design Quality R&D — Training & Benchmarking System

> **Status:** Planned (BD-003-02)
> **Decision source:** `business/boardroom/sessions/2026-02-14-rd-training-and-pricing.md`
> **Priority:** P2 (after monetization foundation)
> **Timeline:** Weeks 2-4
> **Last updated:** 2026-02-14

---

## Purpose

Build a systematic quality benchmarking tool that:

1. Compares our AI-generated output against real-world professional websites
2. Quantifies quality gaps across multiple dimensions
3. Identifies exactly WHERE we fall short (color? typography? layout? content?)
4. Tracks quality improvements over time
5. Benchmarks against competitors (Wix ADI)
6. Informs intake flow improvements

This is R&D — no direct revenue — but it's the quality engine that earns the right to charge money.

---

## Architecture

```
Reference Library (20 curated sites)
  ↓
Reverse-engineer intake inputs (manual for v1)
  ↓
Run our generation pipeline (Convex generateSiteSpec)
  ↓
Screenshot output (Playwright)
  ↓
Claude Vision: score output vs reference (6 dimensions)
  ↓
Store results in Convex (benchmarkResults table)
  ↓
/dev/benchmark page: view scores, track trends, identify gaps
```

---

## Phase 1: Reference Library (v1 — 20 sites)

### Curation Criteria

Select 2 exemplary websites per top 10 business types:

| Business Type | Count | Selection Criteria                               |
| ------------- | ----- | ------------------------------------------------ |
| Restaurant    | 2     | One upscale, one casual — must look professional |
| Spa/Wellness  | 2     | Luxury positioning, strong visual identity       |
| Portfolio     | 2     | Creative professional, strong visual impact      |
| Business/Corp | 2     | Professional services, trust-building design     |
| E-commerce    | 2     | Clean product showcase, brand-forward            |
| Booking       | 2     | Service business with clear booking CTA          |
| Blog          | 2     | Content-focused, strong typography               |
| Personal      | 2     | Personal brand, unique personality               |
| Nonprofit     | 2     | Mission-driven, emotional appeal                 |
| Event         | 2     | Time-sensitive, excitement-building              |

### Reference Site Metadata

```typescript
interface ReferenceSite {
  id: string;
  url: string;
  businessType: string;
  name: string;
  description: string;
  screenshotUrl: string; // Stored in Convex File Storage
  emotionalTone: string[]; // e.g., ["luxury", "calm"]
  designQuality: number; // Manual 1-10 rating
  keyPatterns: string[]; // e.g., ["dark theme", "serif typography", "full-bleed hero"]
  syntheticIntake: SyntheticIntake; // Reverse-engineered intake inputs
}

interface SyntheticIntake {
  siteType: string;
  goal: string;
  businessName: string;
  description: string;
  personality: number[]; // 6 axes estimated from visual analysis
  emotionalGoals: string[];
  voiceProfile: string;
  brandArchetype: string;
  antiReferences: string[];
}
```

### Storage

For v1, store as a JSON file: `src/lib/benchmark/reference-sites.json`
When we have more data, migrate to Convex `referenceSites` table.

---

## Phase 2: Benchmark Runner

### Process

1. Load reference site from library
2. Use synthetic intake inputs to call `generateSiteSpec` (deterministic fallback for consistency)
3. Render output in headless browser (Playwright)
4. Screenshot at 1440px width
5. Send both screenshots (reference + output) to Claude Vision for comparative scoring

### Scoring Dimensions (6 total)

Extends the existing VLM 5-dimension system with emotional resonance:

| #   | Dimension             | Description                                | Scoring Rubric                                               |
| --- | --------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| 1   | Visual Quality        | Overall polish, spacing, alignment         | 1-10: Does it look professionally designed?                  |
| 2   | Color Appropriateness | Palette fits business type/emotional tone  | 1-10: Would this palette work for this industry?             |
| 3   | Typography Fit        | Font choices match brand personality       | 1-10: Do the fonts feel right for this business?             |
| 4   | Layout Coherence      | Component selection, order, spacing        | 1-10: Does the page flow logically?                          |
| 5   | Content Relevance     | Headlines, CTAs, descriptions match intent | 1-10: Does the copy feel written for THIS business?          |
| 6   | Emotional Resonance   | Does the site evoke the target emotion?    | 1-10: If the user wanted "luxury," does this FEEL luxurious? |

### Claude Vision Prompt (for comparative scoring)

```
You are evaluating an AI-generated website against a real professional reference.

REFERENCE SITE: [screenshot]
- Business type: {type}
- Intended emotional tone: {emotions}
- Design quality (human-rated): {rating}/10

AI-GENERATED SITE: [screenshot]
- Generated for the same business type with intake: {intake summary}

Score the AI-generated site on 6 dimensions (1-10 each):
1. Visual Quality: Overall polish compared to the reference
2. Color Appropriateness: How well the palette fits this business type
3. Typography Fit: How well fonts match the personality
4. Layout Coherence: Does the page structure make sense?
5. Content Relevance: Does copy feel written for this business?
6. Emotional Resonance: Does it evoke the target emotions?

For each dimension, provide:
- Score (1-10)
- One sentence explaining the gap between reference and generated
- One specific actionable improvement suggestion

Overall assessment: Would a business owner choose the AI version if it were free vs paying $3,000+ for the reference quality? (yes/maybe/no)
```

### Cost Estimate

- 2 Claude Vision calls per site (reference analysis + comparison): ~$0.06-0.10
- 20 sites: ~$1.20-2.00 per full run
- Monthly runs: ~$1.20-2.00/month
- Wix ADI comparison (5 sites, additional calls): ~$0.50
- **Total: ~$2-3/month** (well within budget)

---

## Phase 3: Competitor Benchmark

### Wix ADI Comparison

For 5 representative business types:

1. Create the same site on Wix ADI with equivalent inputs
2. Screenshot the Wix ADI output
3. Score both (ours vs Wix) on the same 6 dimensions
4. Track competitive gap over time

### Output

A competitive scorecard:

```
| Business Type | EWB Score | Wix ADI Score | Gap    |
|--------------|-----------|---------------|--------|
| Restaurant   | 7.2       | 5.8           | +1.4   |
| Portfolio    | 6.5       | 6.2           | +0.3   |
| Business     | 7.8       | 6.5           | +1.3   |
| E-commerce   | 5.9       | 6.1           | -0.2   |
| Spa          | 8.1       | 5.5           | +2.6   |
```

If we win: marketing asset.
If we lose: we know exactly what to fix.

---

## Phase 4: Intake Flow Improvement (Future)

### Using Benchmark Data to Improve Intake

The R&D system reveals WHERE quality drops:

- If typography scores are consistently low → the intake personality axes may not capture typography preference well enough
- If color scores vary by business type → the industry color hue shifting in `generateThemeFromVector()` needs tuning
- If content relevance is low → the intake description step doesn't capture enough information
- If emotional resonance is low → the emotional goals (Step 5) may need more nuanced options

### Shortened Intake Experiment (UT-002-03)

Run the benchmark twice:

1. Full 9-step intake with all fields
2. Shortened 5-step intake (skip character capture)

Compare quality scores. If the difference is <0.5 points, the intake could be shortened for faster conversion. If the difference is >1.5 points, the character capture is essential.

---

## Implementation Plan

### Files to Create

| File                                     | Purpose                                                    |
| ---------------------------------------- | ---------------------------------------------------------- |
| `src/lib/benchmark/reference-sites.json` | 20 curated reference sites with metadata                   |
| `src/lib/benchmark/types.ts`             | ReferenceSite, SyntheticIntake, BenchmarkResult interfaces |
| `src/lib/benchmark/runner.ts`            | Benchmark execution logic                                  |
| `src/lib/benchmark/scorer.ts`            | Claude Vision scoring prompts and parsing                  |
| `src/app/dev/benchmark/page.tsx`         | Dev-only benchmark dashboard                               |
| `convex/benchmarks.ts`                   | Benchmark results storage (when ready)                     |

### Files to Modify

| File               | Change                                                  |
| ------------------ | ------------------------------------------------------- |
| `convex/schema.ts` | Add `benchmarkResults` table (when migrating from JSON) |

### Dev Page Features (`/dev/benchmark`)

- Reference site gallery with screenshots
- "Run Benchmark" button (runs all 20 sites, shows progress)
- Score dashboard: 6-dimension scores per site, averages, trends
- Competitive comparison tab (Wix ADI scores)
- Quality gap analysis: top 3 weakest dimensions across all sites
- Per-business-type breakdown
- Historical trend chart (scores over time)

---

## Success Criteria

- Average quality score >7/10 across all 20 reference sites
- Competitive advantage: EWB score > Wix ADI score on 4/5 business types
- Identify top 3 actionable quality gaps with specific file/function to fix
- Benchmark run completes in <5 minutes
- Results persist and trend over time

---

## Relationship to Other Decisions

- **BD-003-01 (Pricing):** Quality benchmark validates that our output justifies paid tiers
- **BD-001-04 (Guided Customization):** R&D data informs which customization options matter most
- **VLM Feedback Loop:** Shares scoring dimensions, extends with emotional resonance
- **UT-002-03 (Intake Length):** Benchmark tests whether shortened intake reduces quality
