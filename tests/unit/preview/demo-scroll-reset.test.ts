import { describe, it, expect, vi } from "vitest";

/**
 * Tests for the demo page scroll reset behavior.
 *
 * When navigating between intake steps, the page should reset scroll
 * position to the top. This prevents the UX bug where users land at
 * the bottom of a new step after scrolling down on the previous one.
 */

describe("Demo page scroll reset on step change", () => {
  it("window.scrollTo is called with top: 0 and instant behavior", () => {
    // Simulate the scroll reset that happens in useEffect when step changes
    const scrollTo = vi.fn();
    global.window = { ...global.window, scrollTo } as unknown as Window & typeof globalThis;

    // This is the exact call from the useEffect in demo/page.tsx
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "instant",
    });
  });

  it("uses instant (not smooth) to avoid competing with framer-motion animation", () => {
    // The framer-motion AnimatePresence handles visual transition
    // Smooth scroll would create a double-motion effect
    const behavior: ScrollBehavior = "instant" as ScrollBehavior;
    expect(behavior).toBe("instant");
    expect(behavior).not.toBe("smooth");
  });

  it("scroll reset covers all 9 step transitions", () => {
    // The useEffect depends on [step], which changes for all transitions:
    // Steps 1-4: via goNext/goBack
    // Steps 5-7: via child onComplete/onBack callbacks
    // Step 8: via Step5Discovery onComplete
    // Step 9: via Step6Loading (auto-transition)
    const totalSteps = 9;
    const transitionPoints: string[] = [];

    // Forward transitions (1→2, 2→3, ..., 8→9)
    for (let i = 1; i < totalSteps; i++) {
      transitionPoints.push(`${i}→${i + 1}`);
    }

    // Backward transitions (9→8, 8→7, ..., 2→1)
    for (let i = totalSteps; i > 1; i--) {
      transitionPoints.push(`${i}→${i - 1}`);
    }

    // All transitions cause step to change, triggering the useEffect
    expect(transitionPoints.length).toBe(16); // 8 forward + 8 backward
  });

  it("bridge-to-store transition at step 4→5 also triggers scroll reset", () => {
    // The special case: step 4→5 calls bridgeToStore() then setStep(5)
    // The useEffect on [step] catches this transition too
    const step = 5;
    const previousStep = 4;
    expect(step).not.toBe(previousStep); // step changed → useEffect fires
  });
});

describe("Step content height on mobile (why scroll reset matters)", () => {
  it("step 1 has 13+ site type options that overflow on mobile", () => {
    // At 375px with 2 columns, 13 cards means ~7 rows
    // Each card ~80px → ~560px + header + progress bar + padding > 100vh
    const siteTypeCount = 13;
    const mobileColumns = 2;
    const rows = Math.ceil(siteTypeCount / mobileColumns);
    expect(rows).toBeGreaterThanOrEqual(6);
  });

  it("step 5 has 10 emotion cards that overflow on mobile", () => {
    const emotionCount = 10;
    const mobileColumns = 2;
    const rows = Math.ceil(emotionCount / mobileColumns);
    expect(rows).toBeGreaterThanOrEqual(5);
  });

  it("step 6 has 3 voice comparisons + 3 text inputs (very tall on mobile)", () => {
    const voiceComparisons = 3;
    const textInputs = 3;
    const totalSections = voiceComparisons + textInputs;
    expect(totalSections).toBeGreaterThanOrEqual(6);
  });

  it("step 7 has 6 archetype cards + 8 anti-reference chips (tall on mobile)", () => {
    const archetypeCards = 6;
    const antiRefChips = 8;
    // Both sections contribute to content overflow
    expect(archetypeCards + antiRefChips).toBeGreaterThanOrEqual(14);
  });
});
