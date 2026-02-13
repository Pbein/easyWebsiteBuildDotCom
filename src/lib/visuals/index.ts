/* ── CSS Patterns ─────────────────────────────────────────── */
export { CSS_PATTERNS, generatePattern, getPatternSize, getPatternPosition } from "./css-patterns";
export type { CSSPattern } from "./css-patterns";

/* ── Industry Patterns ───────────────────────────────────── */
export { INDUSTRY_PATTERNS, getIndustryPattern } from "./industry-patterns";
export type { IndustryPatternMapping } from "./industry-patterns";

/* ── Visual Vocabulary ───────────────────────────────────── */
export {
  getVisualVocabulary,
  applyArchetypeOverrides,
  applyPersonalityOverrides,
} from "./visual-vocabulary";
export type {
  VisualVocabulary,
  DividerStyle,
  AccentShape,
  ImageOverlay,
  ScrollRevealIntensity,
} from "./visual-vocabulary";

/* ── Section Dividers ────────────────────────────────────── */
export {
  SectionDivider,
  WaveDivider,
  AngleDivider,
  CurveDivider,
  ZigzagDivider,
} from "./section-dividers";
export type { DividerProps } from "./section-dividers";

/* ── Decorative Elements ─────────────────────────────────── */
export {
  BlobAccent,
  DotGrid,
  GeometricFrame,
  DiamondAccent,
  CircleAccent,
} from "./decorative-elements";

/* ── Image Placeholder ───────────────────────────────────── */
export {
  ImagePlaceholder,
  GradientPlaceholder,
  PatternPlaceholder,
  ShimmerPlaceholder,
} from "./image-placeholder";
export type { PlaceholderVariant } from "./image-placeholder";

/* ── Gradient Utilities ──────────────────────────────────── */
export {
  generateMeshGradient,
  generatePlaceholderGradient,
  generateNoiseOverlay,
} from "./gradient-utils";

/* ── Parallax Hook ───────────────────────────────────────── */
export { useParallax } from "./use-parallax";
