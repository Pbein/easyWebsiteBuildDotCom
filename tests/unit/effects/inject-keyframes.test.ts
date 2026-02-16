import { describe, it, expect, beforeEach } from "vitest";
import {
  injectKeyframes,
  isKeyframeInjected,
  clearInjectedKeyframes,
} from "@/lib/css-effects/inject-keyframes";

describe("injectKeyframes", () => {
  beforeEach(() => {
    clearInjectedKeyframes();
  });

  it("injects keyframe CSS into a style element in document head", () => {
    const css = "@keyframes test-anim { 0% { opacity: 0; } 100% { opacity: 1; } }";
    injectKeyframes("test-anim", css);

    const styleEl = document.getElementById("ewb-css-effects-keyframes");
    expect(styleEl).toBeTruthy();
    expect(styleEl!.textContent).toContain("test-anim");
    expect(styleEl!.textContent).toContain(css);
  });

  it("deduplicates repeated injection of the same keyframe name", () => {
    const css =
      "@keyframes dupe-test { 0% { transform: scale(1); } 100% { transform: scale(2); } }";
    injectKeyframes("dupe-test", css);
    injectKeyframes("dupe-test", css);

    const styleEl = document.getElementById("ewb-css-effects-keyframes");
    // The CSS should appear only once
    const content = styleEl!.textContent!;
    const occurrences = content.split("dupe-test").length - 1;
    // The @keyframes line contains the name once per injection
    expect(occurrences).toBe(1);
  });

  it("tracks injected keyframes via isKeyframeInjected", () => {
    expect(isKeyframeInjected("track-test")).toBe(false);

    injectKeyframes("track-test", "@keyframes track-test { 0% { opacity: 0; } }");

    expect(isKeyframeInjected("track-test")).toBe(true);
  });

  it("clearInjectedKeyframes resets the tracking set and style content", () => {
    injectKeyframes("clear-test", "@keyframes clear-test { 0% { opacity: 0; } }");
    expect(isKeyframeInjected("clear-test")).toBe(true);

    clearInjectedKeyframes();

    expect(isKeyframeInjected("clear-test")).toBe(false);
    const styleEl = document.getElementById("ewb-css-effects-keyframes");
    // After clearing, style content should be empty
    if (styleEl) {
      expect(styleEl.textContent).toBe("");
    }
  });

  it("sets data-ewb attribute on the style element", () => {
    injectKeyframes("attr-test", "@keyframes attr-test { 0% { opacity: 0; } }");

    const styleEl = document.getElementById("ewb-css-effects-keyframes");
    expect(styleEl!.getAttribute("data-ewb")).toBe("css-effects");
  });
});
