import { describe, it, expect } from "vitest";

/**
 * Tests for the VLM evaluation response parsing logic.
 * This mirrors the parseEvaluationResponse function from
 * convex/ai/evaluateScreenshot.ts (which can't be imported directly).
 */

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

function parseEvaluationResponse(raw: string): VLMEvaluationResult {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```$/m, "")
    .trim();

  const parsed = JSON.parse(cleaned) as VLMEvaluationResult;

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

const VALID_RESPONSE = JSON.stringify({
  overallScore: 7.4,
  dimensions: [
    {
      dimension: "content_relevance",
      score: 8,
      explanation: "Good match",
      suggestedAdjustments: [],
    },
    {
      dimension: "visual_character",
      score: 7,
      explanation: "Decent",
      suggestedAdjustments: ["Increase contrast"],
    },
    { dimension: "color_appropriateness", score: 6, explanation: "Ok", suggestedAdjustments: [] },
    { dimension: "typography_fit", score: 8, explanation: "Great fonts", suggestedAdjustments: [] },
    { dimension: "overall_cohesion", score: 8, explanation: "Cohesive", suggestedAdjustments: [] },
  ],
  summary: "Strong design overall with room for color improvement.",
  themeAdjustments: { colorPrimary: "#2a4f7c", radiusMd: "12px" },
});

describe("parseEvaluationResponse", () => {
  it("parses valid JSON response", () => {
    const result = parseEvaluationResponse(VALID_RESPONSE);
    expect(result.overallScore).toBe(7.4);
    expect(result.dimensions).toHaveLength(5);
    expect(result.summary).toContain("Strong design");
    expect(result.themeAdjustments.colorPrimary).toBe("#2a4f7c");
  });

  it("strips markdown code fences", () => {
    const wrapped = "```json\n" + VALID_RESPONSE + "\n```";
    const result = parseEvaluationResponse(wrapped);
    expect(result.overallScore).toBe(7.4);
    expect(result.dimensions).toHaveLength(5);
  });

  it("strips markdown code fences without json specifier", () => {
    const wrapped = "```\n" + VALID_RESPONSE + "\n```";
    const result = parseEvaluationResponse(wrapped);
    expect(result.overallScore).toBe(7.4);
  });

  it("throws on invalid overallScore (too high)", () => {
    const bad = JSON.stringify({ ...JSON.parse(VALID_RESPONSE), overallScore: 11 });
    expect(() => parseEvaluationResponse(bad)).toThrow("Invalid overallScore");
  });

  it("throws on invalid overallScore (too low)", () => {
    const bad = JSON.stringify({ ...JSON.parse(VALID_RESPONSE), overallScore: 0 });
    expect(() => parseEvaluationResponse(bad)).toThrow("Invalid overallScore");
  });

  it("throws on invalid overallScore (not a number)", () => {
    const bad = JSON.stringify({ ...JSON.parse(VALID_RESPONSE), overallScore: "high" });
    expect(() => parseEvaluationResponse(bad)).toThrow("Invalid overallScore");
  });

  it("throws when dimensions array is wrong length", () => {
    const parsed = JSON.parse(VALID_RESPONSE);
    parsed.dimensions = parsed.dimensions.slice(0, 3);
    expect(() => parseEvaluationResponse(JSON.stringify(parsed))).toThrow("Expected 5 dimensions");
  });

  it("throws when a dimension score is out of range", () => {
    const parsed = JSON.parse(VALID_RESPONSE);
    parsed.dimensions[0].score = 0;
    expect(() => parseEvaluationResponse(JSON.stringify(parsed))).toThrow("Invalid score");
  });

  it("throws when a dimension score is not a number", () => {
    const parsed = JSON.parse(VALID_RESPONSE);
    parsed.dimensions[2].score = "good";
    expect(() => parseEvaluationResponse(JSON.stringify(parsed))).toThrow("Invalid score");
  });

  it("defaults themeAdjustments to empty object if null", () => {
    const parsed = JSON.parse(VALID_RESPONSE);
    parsed.themeAdjustments = null;
    const result = parseEvaluationResponse(JSON.stringify(parsed));
    expect(result.themeAdjustments).toEqual({});
  });

  it("throws on invalid JSON", () => {
    expect(() => parseEvaluationResponse("not json at all")).toThrow();
  });

  it("throws on missing summary", () => {
    const parsed = JSON.parse(VALID_RESPONSE);
    delete parsed.summary;
    expect(() => parseEvaluationResponse(JSON.stringify(parsed))).toThrow("Missing summary");
  });

  it("preserves suggested adjustments arrays", () => {
    const result = parseEvaluationResponse(VALID_RESPONSE);
    const visualChar = result.dimensions.find((d) => d.dimension === "visual_character");
    expect(visualChar?.suggestedAdjustments).toEqual(["Increase contrast"]);
  });

  it("handles response with empty themeAdjustments", () => {
    const parsed = JSON.parse(VALID_RESPONSE);
    parsed.themeAdjustments = {};
    const result = parseEvaluationResponse(JSON.stringify(parsed));
    expect(Object.keys(result.themeAdjustments)).toHaveLength(0);
  });
});

describe("fallback evaluation", () => {
  function buildFallbackEvaluation(): VLMEvaluationResult {
    return {
      overallScore: 5,
      dimensions: [
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
      ],
      summary: "Evaluation skipped — no ANTHROPIC_API_KEY configured.",
      themeAdjustments: {},
    };
  }

  it("returns 5/10 for all dimensions in fallback mode", () => {
    const fallback = buildFallbackEvaluation();
    expect(fallback.overallScore).toBe(5);
    for (const d of fallback.dimensions) {
      expect(d.score).toBe(5);
    }
  });

  it("has exactly 5 dimensions in fallback", () => {
    const fallback = buildFallbackEvaluation();
    expect(fallback.dimensions).toHaveLength(5);
  });

  it("has no theme adjustments in fallback", () => {
    const fallback = buildFallbackEvaluation();
    expect(Object.keys(fallback.themeAdjustments)).toHaveLength(0);
  });

  it("indicates API key issue in explanations", () => {
    const fallback = buildFallbackEvaluation();
    for (const d of fallback.dimensions) {
      expect(d.explanation).toContain("no API key");
    }
  });

  it("has empty suggestedAdjustments in fallback", () => {
    const fallback = buildFallbackEvaluation();
    for (const d of fallback.dimensions) {
      expect(d.suggestedAdjustments).toHaveLength(0);
    }
  });
});
