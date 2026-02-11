import { describe, it, expect } from "vitest";
import type { DimensionScore, VLMEvaluation } from "@/lib/vlm/types";

describe("VLM types", () => {
  describe("DimensionScore", () => {
    it("can construct a valid dimension score", () => {
      const score: DimensionScore = {
        dimension: "content_relevance",
        score: 8,
        explanation: "Content is well-matched to the business type",
        suggestedAdjustments: ["Consider a stronger CTA headline"],
      };

      expect(score.dimension).toBe("content_relevance");
      expect(score.score).toBeGreaterThanOrEqual(1);
      expect(score.score).toBeLessThanOrEqual(10);
      expect(score.explanation).toBeTruthy();
      expect(score.suggestedAdjustments).toHaveLength(1);
    });

    it("allows empty suggestedAdjustments array", () => {
      const score: DimensionScore = {
        dimension: "visual_character",
        score: 10,
        explanation: "Perfect match",
        suggestedAdjustments: [],
      };

      expect(score.suggestedAdjustments).toHaveLength(0);
    });
  });

  describe("VLMEvaluation", () => {
    it("can construct a full evaluation with all 5 dimensions", () => {
      const dimensions: DimensionScore[] = [
        {
          dimension: "content_relevance",
          score: 7,
          explanation: "Good content match",
          suggestedAdjustments: [],
        },
        {
          dimension: "visual_character",
          score: 8,
          explanation: "Strong visual identity",
          suggestedAdjustments: [],
        },
        {
          dimension: "color_appropriateness",
          score: 6,
          explanation: "Colors are acceptable",
          suggestedAdjustments: ["Try warmer tones"],
        },
        {
          dimension: "typography_fit",
          score: 9,
          explanation: "Excellent font choices",
          suggestedAdjustments: [],
        },
        {
          dimension: "overall_cohesion",
          score: 8,
          explanation: "Design is cohesive",
          suggestedAdjustments: [],
        },
      ];

      const evaluation: VLMEvaluation = {
        sessionId: "test_session_123",
        overallScore: 7.6,
        dimensions,
        summary: "Overall strong design with minor color improvements suggested.",
        themeAdjustments: { colorPrimary: "#2a4f7c" },
        evaluatedAt: Date.now(),
      };

      expect(evaluation.dimensions).toHaveLength(5);
      expect(evaluation.overallScore).toBeGreaterThanOrEqual(1);
      expect(evaluation.overallScore).toBeLessThanOrEqual(10);
      expect(evaluation.summary).toBeTruthy();
      expect(evaluation.themeAdjustments).toHaveProperty("colorPrimary");
    });

    it("allows empty themeAdjustments", () => {
      const evaluation: VLMEvaluation = {
        sessionId: "test_session_456",
        overallScore: 9.0,
        dimensions: [],
        summary: "Excellent design",
        themeAdjustments: {},
        evaluatedAt: Date.now(),
      };

      expect(Object.keys(evaluation.themeAdjustments)).toHaveLength(0);
    });

    it("tracks evaluation timestamp", () => {
      const before = Date.now();
      const evaluation: VLMEvaluation = {
        sessionId: "test",
        overallScore: 5,
        dimensions: [],
        summary: "Test",
        themeAdjustments: {},
        evaluatedAt: Date.now(),
      };
      const after = Date.now();

      expect(evaluation.evaluatedAt).toBeGreaterThanOrEqual(before);
      expect(evaluation.evaluatedAt).toBeLessThanOrEqual(after);
    });
  });
});
