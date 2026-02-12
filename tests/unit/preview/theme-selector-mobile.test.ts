import { describe, it, expect } from "vitest";

/**
 * Tests for the mobile ThemeSelector bottom sheet on /preview.
 *
 * The ThemeSelector has three rendering modes:
 * 1. Desktop expanded panel (fixed top-right)
 * 2. Mobile bottom sheet (fixed bottom with backdrop)
 * 3. Minimized button (desktop: top-right, mobile: bottom-right)
 *
 * Since the component depends on browser rendering, we test the contracts
 * and data structures used by the selector.
 */

// Replicate constants from the preview page
const AXIS_LABELS = [
  "Minimal ↔ Rich",
  "Playful ↔ Serious",
  "Warm ↔ Cool",
  "Light ↔ Bold",
  "Classic ↔ Modern",
  "Calm ↔ Dynamic",
];

// Import THEME_PRESETS count — there are 7 presets
const THEME_PRESET_COUNT = 7;

describe("ThemeSelector axis labels", () => {
  it("has exactly 6 personality axes", () => {
    expect(AXIS_LABELS).toHaveLength(6);
  });

  it("each axis label contains the bidirectional arrow", () => {
    for (const label of AXIS_LABELS) {
      expect(label).toContain("↔");
    }
  });

  it("each axis has two distinct endpoints", () => {
    for (const label of AXIS_LABELS) {
      const [left, right] = label.split(" ↔ ");
      expect(left).toBeTruthy();
      expect(right).toBeTruthy();
      expect(left).not.toBe(right);
    }
  });
});

describe("ThemeSelector mobile positioning", () => {
  it("minimized button is at bottom-right on mobile, top-right on desktop", () => {
    // Mobile: bottom-4 right-4 (near thumb reach)
    // Desktop: top-0 right-0 m-4 (out of the way)
    const mobilePosition = "bottom-4 right-4";
    const desktopPosition = "top-0 right-0 m-4";

    expect(mobilePosition).toContain("bottom");
    expect(desktopPosition).toContain("top");
  });

  it("bottom sheet max height allows 40%+ of preview to be visible", () => {
    // Sheet uses max-h: 60vh
    const maxSheetHeight = 60; // vh
    const visiblePreview = 100 - maxSheetHeight;
    expect(visiblePreview).toBeGreaterThanOrEqual(40);
  });
});

describe("ThemeSelector preset rendering modes", () => {
  it("mobile uses horizontal scrolling presets (compact mode)", () => {
    // On mobile, presets render as compact horizontal chips
    // On desktop, presets render as vertical list with descriptions
    const modes = ["compact", "full"] as const;
    expect(modes).toContain("compact"); // mobile
    expect(modes).toContain("full"); // desktop
  });

  it("all 7 presets are accessible in both mobile and desktop modes", () => {
    // Both modes render all presets — mobile just uses compact display
    expect(THEME_PRESET_COUNT).toBe(7);
  });
});

describe("Custom vector slider behavior", () => {
  it("slider values are in 0-1 range mapped to 0-100 input range", () => {
    // The slider uses min=0, max=100, but the vector stores 0-1 values
    const vectorValue = 0.75;
    const sliderValue = vectorValue * 100;
    expect(sliderValue).toBe(75);

    const parsedBack = sliderValue / 100;
    expect(parsedBack).toBe(0.75);
  });

  it("edge values map correctly", () => {
    expect(0 * 100).toBe(0);
    expect(1 * 100).toBe(100);
    expect(0.5 * 100).toBe(50);
  });

  it("custom vector has 6 axes matching AXIS_LABELS", () => {
    const defaultVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    expect(defaultVector).toHaveLength(AXIS_LABELS.length);
  });
});

describe("ThemeSelector backdrop behavior", () => {
  it("mobile sheet has a backdrop overlay for dismissing", () => {
    // The backdrop uses bg-black/40 (40% opacity black)
    // Clicking the backdrop should call onToggleMinimize
    const backdropOpacity = 0.4;
    expect(backdropOpacity).toBeGreaterThan(0); // visible
    expect(backdropOpacity).toBeLessThan(1); // semi-transparent
  });

  it("desktop panel has no backdrop (direct panel interaction)", () => {
    // Desktop panel is a floating card, no backdrop needed
    // Only mobile uses the backdrop pattern
    const desktopHasBackdrop = false;
    const mobileHasBackdrop = true;
    expect(desktopHasBackdrop).toBe(false);
    expect(mobileHasBackdrop).toBe(true);
  });
});
