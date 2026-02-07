# Knowledge Base — Evolving Decision Tree & Learning System

## Overview

The Knowledge Base is what makes EasyWebsiteBuild smarter over time. Every client interaction enriches the system — new decision paths get discovered, proven component configurations get cataloged, successful themes get preserved, and content patterns get templatized.

The core principle: **AI bootstraps new paths, but proven paths become deterministic.** The more the system is used, the fewer API calls it needs and the better its first-pass accuracy becomes.

## Learning Mechanisms

### 1. Intent Path Evolution

Every point in the intake flow where a user makes a choice or provides input creates an intent path entry:

```typescript
interface IntentPath {
  id: string;
  step: IntakeStep;                // Which step in the flow
  question: string;                // The question that was asked
  userInput: string;               // What the user said/selected
  inputType: "deterministic" | "ai_interpreted";
  aiInterpretation?: string;       // What the AI understood (if AI was used)
  resultingDecisions: {
    componentsSelected?: string[];
    themeAdjustments?: Partial<ThemeTokens>;
    pagesAdded?: string[];
    contentStructure?: Record<string, unknown>;
    variantsChosen?: Record<string, string>;
  };
  embedding: number[];             // Semantic embedding for similarity search
  usageCount: number;              // How many times this path has been taken
  confirmationCount: number;       // How many times users approved the result
  confirmationRate: number;        // confirmationCount / usageCount
  status: "candidate" | "proven" | "deprecated";
  createdAt: Date;
  promotedAt?: Date;
  lastUsedAt: Date;
  parentPathId?: string;           // Which previous decision led here
}
```

#### Path Lifecycle

**Birth (Candidate):**
A user provides a novel input that doesn't match any existing path. Claude API interprets it, makes decisions, and the entire interaction is stored as a `candidate` path with `usageCount: 1`.

**Growth (Tracking):**
When a new user's input is semantically similar (cosine similarity ≥ 0.92) to an existing path, instead of calling the AI again, the system uses the stored decisions and increments `usageCount`. If the user approves the resulting site, `confirmationCount` also increments.

**Promotion (Proven):**
When a candidate path reaches `usageCount ≥ 3` AND `confirmationRate ≥ 0.8`, it's promoted to `proven` status. Proven paths are served with zero AI calls — they're pure deterministic lookups.

**Deprecation:**
If a path's `confirmationRate` drops below 0.5 after 5+ uses, it's marked `deprecated`. The system will call the AI fresh for similar inputs, potentially creating a better replacement path.

### 2. Proven Recipes

A "recipe" is a specific component + variant + configuration that was approved by a user. It captures not just what component was used, but exactly how it was configured and in what context.

```typescript
interface ProvenRecipe {
  id: string;
  name: string;                     // "Luxury Spa Parallax Hero"
  componentId: string;              // "hero-parallax"
  variant: string;                  // "with-subject"
  configuration: {
    props: Record<string, unknown>;
    spacing: string;
    sectionBackground: string;
    animationSettings: Record<string, unknown>;
  };
  contentStructure: {               // Template for content shape
    headline: { pattern: string; example: string };
    subheadline: { pattern: string; example: string };
    // ... etc
  };
  context: {
    siteType: SiteType;
    industry: string;
    conversionGoal: ConversionGoal;
    personalityVector: number[];
    pagePosition: "first" | "middle" | "last";
    precedingComponent?: string;
    followingComponent?: string;
  };
  approvalCount: number;
  lastUsed: Date;
  tags: string[];
}
```

When the assembly engine needs to configure a component, it first checks for proven recipes matching the current context (site type + industry + personality). If a match exists, it uses that configuration instead of generating one from scratch.

### 3. Theme Library Growth

Every approved theme (the complete set of design tokens) gets saved:

```typescript
interface SavedTheme {
  id: string;
  name: string;                    // Auto-generated or user-named
  personalityVector: number[];     // The personality it was generated from
  tokens: ThemeTokens;             // Complete token set
  presetBase: string;              // Which preset it started from
  overrides: Partial<ThemeTokens>; // What was customized
  industry: string[];              // Industries it's been used for
  usageCount: number;
  approvalRate: number;
  screenshots: string[];           // Preview thumbnails
}
```

This creates a searchable library of proven themes. Over time, the system can say "here are 5 themes that worked great for luxury service businesses" instead of generating from scratch.

### 4. Content Pattern Templates

When AI generates copy that users approve, the patterns get extracted and stored:

```typescript
interface ContentPattern {
  id: string;
  componentId: string;             // Which component this is for
  field: string;                   // "headline", "subheadline", "cta_text"
  pattern: string;                 // "[Aspirational Verb] Your [Outcome]"
  examples: string[];              // ["Discover Your Radiance", "Unlock Your Potential"]
  context: {
    siteType: SiteType;
    industry: string;
    conversionGoal: ConversionGoal;
    personalityTone: number;       // playful_serious axis value
  };
  approvalRate: number;
  usageCount: number;
}
```

Example patterns for a luxury med spa:
- Hero headline: "[Discover/Experience/Embrace] [Aspirational Noun] at [Business Name]"
- Service card title: "[Treatment Name]: [Benefit-Focused Subtitle]"
- CTA: "[Action Verb] Your [Outcome] Today" → "Begin Your Transformation Today"

### 5. Page Composition Templates

Full page recipes — the exact sequence of components that works for a specific page type:

```typescript
interface PageTemplate {
  id: string;
  name: string;                    // "Luxury Service Homepage v3"
  pageType: string;                // "homepage", "services", "about", "contact"
  siteType: SiteType;
  industry: string[];
  componentSequence: {
    componentId: string;
    variant: string;
    sectionConfig: {
      spacing: string;
      background: string;
    };
  }[];
  personalityRange: {
    [axis: string]: [number, number];
  };
  approvalCount: number;
  usageCount: number;
}
```

## Similarity Matching

### Embedding Strategy

For semantic similarity matching, the system uses text embeddings to compare user inputs against stored paths. Implementation options:

1. **Claude Embeddings** — Use the Anthropic embeddings API to generate vectors
2. **Convex Vector Search** — Convex supports vector search natively, which pairs well with the rest of the stack

### Matching Algorithm

```
1. User provides input at a decision point
2. Generate embedding of user input
3. Search stored paths for that step with cosine similarity ≥ 0.92
4. If match found AND status == "proven":
   → Use stored decisions, no AI call
5. If match found AND status == "candidate":
   → Use stored decisions, track for promotion
6. If no match found:
   → Call Claude API to interpret
   → Store result as new candidate path
```

### Similarity Thresholds

| Threshold | Action |
|-----------|--------|
| ≥ 0.97 | Exact match — use directly |
| 0.92 - 0.97 | Strong match — use with confidence |
| 0.85 - 0.92 | Partial match — use as starting point, AI refines |
| < 0.85 | No match — full AI interpretation |

## Feedback Loop Integration

### Explicit Feedback
- User approves/rejects preview → updates confirmation rates
- User requests specific changes → stored as improvement signals
- User rates final site satisfaction → overall quality score

### Implicit Feedback
- Time spent on each intake step → identifies confusing questions
- Number of change requests → measures first-pass accuracy
- Which components get removed most often → identifies poor matches
- Which themes get most modifications → identifies generation gaps

## Data Hygiene

### Deduplication
Similar paths (similarity > 0.97) get merged, combining their usage counts and confirmation rates.

### Pruning
- Candidate paths with 0 usage for 90+ days get archived
- Deprecated paths get archived after 30 days
- Asset entries with 0 usage for 180+ days get flagged for review

### Privacy
- User-specific content (business names, descriptions) is stripped before storing patterns
- Only structural patterns and design decisions are preserved
- User data is kept in project records, not in the knowledge base

## Metrics & Monitoring

Key metrics to track:
- **Deterministic hit rate**: % of decisions served without AI calls (target: increases over time)
- **First-pass approval rate**: % of previews approved without changes (target: > 70%)
- **Average AI calls per project**: Should decrease as the knowledge base grows
- **Path promotion rate**: How many candidates become proven per month
- **Content pattern reuse rate**: How often patterns are used vs generated fresh
