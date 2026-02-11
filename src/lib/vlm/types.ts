export interface DimensionScore {
  /** e.g. "content_relevance", "visual_character", etc. */
  dimension: string;
  /** 1-10 score */
  score: number;
  explanation: string;
  suggestedAdjustments: string[];
}

export interface VLMEvaluation {
  sessionId: string;
  /** 1-10 weighted average across all dimensions */
  overallScore: number;
  dimensions: DimensionScore[];
  summary: string;
  /** Map of ThemeTokens key → suggested CSS value */
  themeAdjustments: Record<string, string>;
  evaluatedAt: number;
}
