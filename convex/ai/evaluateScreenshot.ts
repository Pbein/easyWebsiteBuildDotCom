"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";

/* ────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────── */

interface DimensionScore {
  dimension: string;
  score: number;
  explanation: string;
  suggestedAdjustments: string[];
}

interface VLMEvaluationResult {
  overallScore: number;
  dimensions: DimensionScore[];
  summary: string;
  themeAdjustments: Record<string, string>;
}

/* ────────────────────────────────────────────────────────────
 * Constants
 * ──────────────────────────────────────────────────────────── */

const PERSONALITY_AXIS_LABELS = [
  "minimal_rich (0=Minimal/Spacious, 1=Rich/Dense)",
  "playful_serious (0=Playful/Casual, 1=Serious/Professional)",
  "warm_cool (0=Warm/Inviting, 1=Cool/Sleek)",
  "light_bold (0=Light/Airy, 1=Bold/Heavy)",
  "classic_modern (0=Classic/Traditional, 1=Modern/Contemporary)",
  "calm_dynamic (0=Calm/Serene, 1=Dynamic/Energetic)",
];

const SYSTEM_PROMPT = `You are an expert web design evaluator. You analyze screenshots of generated websites and score them on 5 key dimensions.

For each dimension, provide:
- A score from 1 to 10
- A brief explanation of the score
- 0-3 concrete suggested adjustments

Also provide:
- An overall score (weighted average, with visual_character and overall_cohesion weighted 1.5x)
- A 1-2 sentence summary
- A themeAdjustments object mapping valid ThemeTokens keys to suggested CSS values

Valid ThemeTokens keys for adjustments include:
- Color: colorPrimary, colorPrimaryLight, colorPrimaryDark, colorSecondary, colorSecondaryLight, colorAccent, colorBackground, colorSurface, colorSurfaceElevated, colorText, colorTextSecondary, colorTextOnPrimary, colorTextOnDark, colorBorder, colorBorderLight
- Typography: fontHeading, fontBody, fontAccent
- Spacing: spaceSection, spaceComponent, spaceElement, spaceTight
- Shape: radiusSm, radiusMd, radiusLg, radiusXl, borderWidth
- Animation: transitionFast, transitionBase, transitionSlow, animationDistance

Color values must be valid hex (e.g., "#2a4f7c"). Spacing/radius values should be CSS values (e.g., "6rem", "12px"). Font values should be quoted font family names (e.g., "'Playfair Display', serif").

Respond ONLY with a JSON object (no markdown fences, no explanation outside JSON).`;

/* ────────────────────────────────────────────────────────────
 * Build evaluation prompt
 * ──────────────────────────────────────────────────────────── */

function buildEvaluationPrompt(args: {
  siteType: string;
  businessName: string;
  conversionGoal: string;
  personalityVector: number[];
  tagline?: string;
  emotionalGoals?: string[];
  voiceProfile?: string;
  brandArchetype?: string;
  antiReferences?: string[];
}): string {
  const pvDescription = args.personalityVector
    .map((v, i) => `  ${PERSONALITY_AXIS_LABELS[i]}: ${v.toFixed(2)}`)
    .join("\n");

  let prompt = `Evaluate this website screenshot for the following business:

BUSINESS CONTEXT:
- Business Name: ${args.businessName}
- Site Type: ${args.siteType}
- Conversion Goal: ${args.conversionGoal}
${args.tagline ? `- Tagline: ${args.tagline}` : ""}

PERSONALITY VECTOR:
${pvDescription}
`;

  if (args.emotionalGoals?.length) {
    prompt += `\nEMOTIONAL GOALS: ${args.emotionalGoals.join(", ")}`;
  }
  if (args.voiceProfile) {
    prompt += `\nVOICE PROFILE: ${args.voiceProfile}`;
  }
  if (args.brandArchetype) {
    prompt += `\nBRAND ARCHETYPE: ${args.brandArchetype}`;
  }
  if (args.antiReferences?.length) {
    prompt += `\nANTI-REFERENCES (styles to AVOID): ${args.antiReferences.join(", ")}`;
  }

  prompt += `

SCORING DIMENSIONS (rate each 1-10):
1. content_relevance — Does the text content match this business type and goals? Are headlines, CTAs, and descriptions appropriate?
2. visual_character — Does the design match the personality vector and emotional goals? Is the visual mood correct?
3. color_appropriateness — Do the colors suit the industry, brand archetype, and personality? Are contrast ratios readable?
4. typography_fit — Do the fonts match the seriousness/playfulness, era (classic/modern), and voice profile?
5. overall_cohesion — Does everything work together as a unified, professional design? No jarring mismatches?

Respond with this exact JSON structure:
{
  "overallScore": <number 1-10>,
  "dimensions": [
    {
      "dimension": "<dimension_name>",
      "score": <number 1-10>,
      "explanation": "<brief explanation>",
      "suggestedAdjustments": ["<adjustment 1>", ...]
    }
  ],
  "summary": "<1-2 sentence summary>",
  "themeAdjustments": {
    "<ThemeTokens key>": "<CSS value>",
    ...
  }
}`;

  return prompt;
}

/* ────────────────────────────────────────────────────────────
 * Parse + validate Claude response
 * ──────────────────────────────────────────────────────────── */

function parseEvaluationResponse(raw: string): VLMEvaluationResult {
  // Strip markdown fences if present
  const cleaned = raw
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```$/m, "")
    .trim();

  const parsed = JSON.parse(cleaned) as VLMEvaluationResult;

  // Validate structure
  if (
    typeof parsed.overallScore !== "number" ||
    parsed.overallScore < 1 ||
    parsed.overallScore > 10
  ) {
    throw new Error("Invalid overallScore");
  }
  if (!Array.isArray(parsed.dimensions) || parsed.dimensions.length !== 5) {
    throw new Error("Expected 5 dimensions");
  }
  for (const d of parsed.dimensions) {
    if (typeof d.score !== "number" || d.score < 1 || d.score > 10) {
      throw new Error(`Invalid score for dimension ${d.dimension}`);
    }
  }
  if (typeof parsed.summary !== "string") {
    throw new Error("Missing summary");
  }
  if (typeof parsed.themeAdjustments !== "object" || parsed.themeAdjustments === null) {
    parsed.themeAdjustments = {};
  }

  return parsed;
}

/* ────────────────────────────────────────────────────────────
 * Deterministic fallback (no API key)
 * ──────────────────────────────────────────────────────────── */

function buildFallbackEvaluation(): VLMEvaluationResult {
  const dimensions: DimensionScore[] = [
    {
      dimension: "content_relevance",
      score: 5,
      explanation: "Evaluation skipped (no API key). Unable to assess content relevance.",
      suggestedAdjustments: [],
    },
    {
      dimension: "visual_character",
      score: 5,
      explanation: "Evaluation skipped (no API key). Unable to assess visual character.",
      suggestedAdjustments: [],
    },
    {
      dimension: "color_appropriateness",
      score: 5,
      explanation: "Evaluation skipped (no API key). Unable to assess color appropriateness.",
      suggestedAdjustments: [],
    },
    {
      dimension: "typography_fit",
      score: 5,
      explanation: "Evaluation skipped (no API key). Unable to assess typography fit.",
      suggestedAdjustments: [],
    },
    {
      dimension: "overall_cohesion",
      score: 5,
      explanation: "Evaluation skipped (no API key). Unable to assess overall cohesion.",
      suggestedAdjustments: [],
    },
  ];

  return {
    overallScore: 5,
    dimensions,
    summary:
      "Evaluation skipped — no ANTHROPIC_API_KEY configured. Set the environment variable to enable VLM design evaluation.",
    themeAdjustments: {},
  };
}

/* ────────────────────────────────────────────────────────────
 * Exported Convex action
 * ──────────────────────────────────────────────────────────── */

export const evaluateScreenshot = action({
  args: {
    sessionId: v.string(),
    screenshotBase64: v.string(),
    siteType: v.string(),
    businessName: v.string(),
    conversionGoal: v.string(),
    personalityVector: v.array(v.float64()),
    tagline: v.optional(v.string()),
    emotionalGoals: v.optional(v.array(v.string())),
    voiceProfile: v.optional(v.string()),
    brandArchetype: v.optional(v.string()),
    antiReferences: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args): Promise<VLMEvaluationResult> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    let result: VLMEvaluationResult;

    if (!apiKey) {
      // Deterministic fallback
      result = buildFallbackEvaluation();
    } else {
      const client = new Anthropic({ apiKey });

      const evaluationPrompt = buildEvaluationPrompt({
        siteType: args.siteType,
        businessName: args.businessName,
        conversionGoal: args.conversionGoal,
        personalityVector: args.personalityVector,
        tagline: args.tagline,
        emotionalGoals: args.emotionalGoals,
        voiceProfile: args.voiceProfile,
        brandArchetype: args.brandArchetype,
        antiReferences: args.antiReferences,
      });

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/png",
                  data: args.screenshotBase64,
                },
              },
              {
                type: "text",
                text: evaluationPrompt,
              },
            ],
          },
        ],
      });

      const rawText = response.content[0].type === "text" ? response.content[0].text : "";

      try {
        result = parseEvaluationResponse(rawText);
      } catch {
        // If parsing fails, fall back
        console.error("Failed to parse VLM response, using fallback");
        result = buildFallbackEvaluation();
        result.summary = `Parse error — raw response could not be parsed as valid evaluation JSON. Fallback scores applied.`;
      }
    }

    // Persist the evaluation
    await ctx.runMutation(internal.vlmEvaluations.saveEvaluationInternal, {
      sessionId: args.sessionId,
      overallScore: result.overallScore,
      dimensions: result.dimensions,
      summary: result.summary,
      themeAdjustments: result.themeAdjustments,
      evaluatedAt: Date.now(),
    });

    return result;
  },
});
