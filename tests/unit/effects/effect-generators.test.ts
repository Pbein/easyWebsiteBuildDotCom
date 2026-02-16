import { describe, it, expect } from "vitest";
import { gradientText } from "@/lib/css-effects/text/gradient-text";
import { cardLift } from "@/lib/css-effects/hover/card-lift";
import { glassmorphism } from "@/lib/css-effects/border-shape/glassmorphism";
import { skeletonShimmer } from "@/lib/css-effects/loading/skeleton-shimmer";
import { float } from "@/lib/css-effects/motion/float";
import { gradientDivider } from "@/lib/css-effects/decorative/gradient-divider";
import { grainTexture } from "@/lib/css-effects/background/grain-texture";
import { fadeUp } from "@/lib/css-effects/scroll/fade-up";

describe("gradientText", () => {
  it("returns a style object with gradient background when called with defaults", () => {
    const result = gradientText();
    expect(result.style).toBeDefined();
    expect(result.style.background).toContain("linear-gradient");
    expect(result.style.WebkitBackgroundClip).toBe("text");
    expect(result.style.WebkitTextFillColor).toBe("transparent");
  });

  it("uses custom colors when provided", () => {
    const result = gradientText({
      colorPrimary: "#ff0000",
      colorAccent: "#00ff00",
    });
    expect(result.style.background).toContain("#ff0000");
    expect(result.style.background).toContain("#00ff00");
  });

  it("returns fallback color style when reducedMotion is true", () => {
    const result = gradientText({ reducedMotion: true });
    expect(result.style.color).toBeDefined();
    expect(result.style.background).toBeUndefined();
  });

  it("returns fallback color style when intensity is 0", () => {
    const result = gradientText({ intensity: 0 });
    expect(result.style.color).toBeDefined();
    expect(result.style.background).toBeUndefined();
  });
});

describe("cardLift", () => {
  it("returns style with transition and hoverStyle with transform", () => {
    const result = cardLift();
    expect(result.style).toBeDefined();
    expect(result.style.transition).toContain("transform");
    expect(result.hoverStyle).toBeDefined();
    expect(result.hoverStyle.transform).toContain("translateY");
    expect(result.hoverStyle.boxShadow).toBeDefined();
  });

  it("scales translateY with intensity", () => {
    const normal = cardLift({ intensity: 1 });
    const intense = cardLift({ intensity: 2 });
    // Higher intensity = more negative translateY (e.g., -4px vs -8px)
    const normalMatch = (normal.hoverStyle.transform as string).match(/-?\d+/);
    const intenseMatch = (intense.hoverStyle.transform as string).match(/-?\d+/);
    expect(normalMatch).toBeTruthy();
    expect(intenseMatch).toBeTruthy();
    const normalY = Number(normalMatch![0]);
    const intenseY = Number(intenseMatch![0]);
    expect(intenseY).toBeLessThan(normalY);
  });

  it("returns minimal styles when reducedMotion is true", () => {
    const result = cardLift({ reducedMotion: true });
    expect(result.style).toEqual({});
    expect(result.hoverStyle.boxShadow).toBeDefined();
    expect(result.hoverStyle.transform).toBeUndefined();
  });
});

describe("glassmorphism", () => {
  it("returns style with backdrop-filter blur", () => {
    const result = glassmorphism();
    expect(result.style).toBeDefined();
    expect(result.style.backdropFilter).toContain("blur");
    expect(result.style.WebkitBackdropFilter).toContain("blur");
    expect(result.style.border).toBeDefined();
    expect(result.style.borderRadius).toBeDefined();
  });

  it("scales blur amount with intensity", () => {
    const low = glassmorphism({ intensity: 0.5 });
    const high = glassmorphism({ intensity: 2 });
    // Extract blur values
    const lowBlur = parseInt((low.style.backdropFilter as string).match(/\d+/)![0]);
    const highBlur = parseInt((high.style.backdropFilter as string).match(/\d+/)![0]);
    expect(highBlur).toBeGreaterThan(lowBlur);
  });

  it("returns simple background when intensity is 0", () => {
    const result = glassmorphism({ intensity: 0 });
    expect(result.style.background).toBe("var(--color-surface)");
    expect(result.style.backdropFilter).toBeUndefined();
  });
});

describe("skeletonShimmer", () => {
  it("returns animation style with keyframes", () => {
    const result = skeletonShimmer();
    expect(result.style).toBeDefined();
    expect(result.style.animation).toContain("ewb-skeleton-shimmer");
    expect(result.keyframes).toBeDefined();
    expect(result.keyframeName).toBe("ewb-skeleton-shimmer");
  });

  it("returns static background when reducedMotion is true", () => {
    const result = skeletonShimmer({ reducedMotion: true });
    expect(result.style.animation).toBeUndefined();
    expect(result.keyframes).toBeUndefined();
  });

  it("uses faster speed at high intensity", () => {
    const normal = skeletonShimmer({ intensity: 1 });
    const fast = skeletonShimmer({ intensity: 2 });
    expect(normal.style.animation).toContain("1.8s");
    expect(fast.style.animation).toContain("1.2s");
  });
});

describe("float", () => {
  it("returns animation with keyframes for default config", () => {
    const result = float();
    expect(result.style).toBeDefined();
    expect(result.style.animation).toContain("ewb-float");
    expect(result.keyframes).toBeDefined();
    expect(result.keyframeName).toBe("ewb-float");
  });

  it("returns empty style when reducedMotion is true", () => {
    const result = float({ reducedMotion: true });
    expect(result.style).toEqual({});
    expect(result.keyframes).toBeUndefined();
  });

  it("uses emphasized keyframes at intensity >= 2", () => {
    const result = float({ intensity: 2 });
    expect(result.style.animation).toContain("ewb-float-emphasized");
    expect(result.keyframeName).toBe("ewb-float-emphasized");
    expect(result.keyframes).toContain("-14px"); // emphasized uses 14px
  });

  it("uses standard keyframes at intensity 1", () => {
    const result = float({ intensity: 1 });
    expect(result.keyframeName).toBe("ewb-float");
    expect(result.keyframes).toContain("-8px"); // standard uses 8px
  });
});

describe("gradientDivider", () => {
  it("returns gradient background style", () => {
    const result = gradientDivider();
    expect(result.style).toBeDefined();
    expect(result.style.background).toContain("linear-gradient");
    expect(result.style.border).toBe("none");
    expect(result.style.borderRadius).toBe("9999px");
  });

  it("uses custom colors when provided", () => {
    const result = gradientDivider({
      colorPrimary: "#aaa",
      colorAccent: "#bbb",
    });
    expect(result.style.background).toContain("#aaa");
    expect(result.style.background).toContain("#bbb");
  });

  it("returns simple border when intensity is 0", () => {
    const result = gradientDivider({ intensity: 0 });
    expect(result.style.height).toBe("1px");
    expect(result.style.background).toBe("var(--color-border-light)");
  });

  it("scales height with intensity", () => {
    const low = gradientDivider({ intensity: 1 });
    const high = gradientDivider({ intensity: 3 });
    const lowHeight = parseInt(low.style.height as string);
    const highHeight = parseInt(high.style.height as string);
    expect(highHeight).toBeGreaterThan(lowHeight);
  });
});

describe("grainTexture", () => {
  it("returns style with position relative", () => {
    const result = grainTexture();
    expect(result.style).toBeDefined();
    expect(result.style.position).toBe("relative");
  });

  it("includes grain comment in keyframes field", () => {
    const result = grainTexture();
    expect(result.keyframes).toBeDefined();
    expect(result.keyframes).toContain("Grain texture");
  });

  it("returns empty style when intensity is 0", () => {
    const result = grainTexture({ intensity: 0 });
    expect(result.style).toEqual({});
    expect(result.keyframes).toBeUndefined();
  });
});

describe("fadeUp", () => {
  it("returns initial style with opacity 0 and translateY", () => {
    const result = fadeUp();
    expect(result.style).toBeDefined();
    expect(result.style.opacity).toBe(0);
    expect(result.style.transform).toContain("translateY");
    expect(result.style.transition).toBeDefined();
  });

  it("returns animated style with opacity 1 and translateY(0)", () => {
    const result = fadeUp();
    expect(result.animatedStyle).toBeDefined();
    expect(result.animatedStyle.opacity).toBe(1);
    expect(result.animatedStyle.transform).toBe("translateY(0)");
  });

  it("returns visible state immediately when reducedMotion is true", () => {
    const result = fadeUp({ reducedMotion: true });
    expect(result.style.opacity).toBe(1);
    expect(result.animatedStyle.opacity).toBe(1);
    expect(result.style.transform).toBeUndefined();
  });

  it("scales translateY distance with intensity", () => {
    const normal = fadeUp({ intensity: 1 });
    const intense = fadeUp({ intensity: 2 });
    const normalY = parseInt((normal.style.transform as string).match(/\d+/)![0]);
    const intenseY = parseInt((intense.style.transform as string).match(/\d+/)![0]);
    expect(intenseY).toBeGreaterThan(normalY);
  });

  it("uses longer duration at high intensity", () => {
    const normal = fadeUp({ intensity: 1 });
    const intense = fadeUp({ intensity: 2 });
    expect(normal.style.transition).toContain("0.6s");
    expect(intense.style.transition).toContain("0.8s");
  });
});
