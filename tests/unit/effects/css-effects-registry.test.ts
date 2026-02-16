import { describe, it, expect } from "vitest";
import {
  EFFECT_REGISTRY,
  getAllEffectManifests,
  getEffect,
  isEffectRegistered,
  getEffectsByCategory,
  getEffectsByPerformance,
  getEffectsByTag,
  getAllEffectIds,
} from "@/lib/css-effects/registry";

const ALL_EFFECT_IDS = [
  "text/gradient-text",
  "hover/card-lift",
  "border-shape/glassmorphism",
  "loading/skeleton-shimmer",
  "motion/float",
  "decorative/gradient-divider",
  "background/grain-texture",
  "scroll/fade-up",
];

describe("EFFECT_REGISTRY", () => {
  it("contains exactly 8 registered effects", () => {
    expect(Object.keys(EFFECT_REGISTRY)).toHaveLength(8);
  });

  it("all expected effect IDs are registered", () => {
    for (const id of ALL_EFFECT_IDS) {
      expect(EFFECT_REGISTRY[id]).toBeDefined();
    }
  });

  it("each entry has a manifest and generate function", () => {
    for (const [id, entry] of Object.entries(EFFECT_REGISTRY)) {
      expect(entry.manifest).toBeDefined();
      expect(typeof entry.generate).toBe("function");
      expect(entry.manifest.id).toBe(id);
    }
  });

  it("each manifest has all required fields", () => {
    for (const entry of Object.values(EFFECT_REGISTRY)) {
      const m = entry.manifest;
      expect(typeof m.id).toBe("string");
      expect(typeof m.category).toBe("string");
      expect(typeof m.name).toBe("string");
      expect(typeof m.description).toBe("string");
      expect(["low", "medium", "high"]).toContain(m.performance);
      expect(typeof m.requiresJS).toBe("boolean");
      expect(Array.isArray(m.consumedTokens)).toBe(true);
      expect(Array.isArray(m.tags)).toBe(true);
      expect(m.tags.length).toBeGreaterThan(0);
    }
  });
});

describe("getEffect", () => {
  it("returns the correct entry for a known effect ID", () => {
    const entry = getEffect("text/gradient-text");
    expect(entry).toBeDefined();
    expect(entry!.manifest.name).toBe("Gradient Text");
  });

  it("returns undefined for an unknown effect ID", () => {
    const entry = getEffect("unknown/nonexistent");
    expect(entry).toBeUndefined();
  });
});

describe("isEffectRegistered", () => {
  it("returns true for all registered effect IDs", () => {
    for (const id of ALL_EFFECT_IDS) {
      expect(isEffectRegistered(id)).toBe(true);
    }
  });

  it("returns false for unknown effect IDs", () => {
    expect(isEffectRegistered("fake/effect")).toBe(false);
    expect(isEffectRegistered("")).toBe(false);
  });
});

describe("getAllEffectIds", () => {
  it("returns an array of 8 string IDs", () => {
    const ids = getAllEffectIds();
    expect(ids).toHaveLength(8);
    for (const id of ids) {
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    }
  });

  it("contains all expected effect IDs", () => {
    const ids = getAllEffectIds();
    for (const expectedId of ALL_EFFECT_IDS) {
      expect(ids).toContain(expectedId);
    }
  });
});

describe("getAllEffectManifests", () => {
  it("returns an array of 8 manifests", () => {
    const manifests = getAllEffectManifests();
    expect(manifests).toHaveLength(8);
  });

  it("each manifest has a unique ID", () => {
    const manifests = getAllEffectManifests();
    const ids = manifests.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe("getEffectsByCategory", () => {
  it("returns text effects", () => {
    const textEffects = getEffectsByCategory("text");
    expect(textEffects.length).toBeGreaterThanOrEqual(1);
    expect(textEffects[0].manifest.category).toBe("text");
  });

  it("returns hover effects", () => {
    const hoverEffects = getEffectsByCategory("hover");
    expect(hoverEffects.length).toBeGreaterThanOrEqual(1);
    expect(hoverEffects[0].manifest.category).toBe("hover");
  });

  it("returns empty array for unused category", () => {
    const results = getEffectsByCategory("3d");
    expect(results).toHaveLength(0);
  });
});

describe("getEffectsByPerformance", () => {
  it("returns all low-performance effects", () => {
    const lowEffects = getEffectsByPerformance("low");
    expect(lowEffects.length).toBeGreaterThan(0);
    for (const entry of lowEffects) {
      expect(entry.manifest.performance).toBe("low");
    }
  });

  it("medium includes both low and medium performance effects", () => {
    const medEffects = getEffectsByPerformance("medium");
    expect(medEffects.length).toBeGreaterThanOrEqual(getEffectsByPerformance("low").length);
  });

  it("high includes all effects", () => {
    const highEffects = getEffectsByPerformance("high");
    expect(highEffects.length).toBe(Object.keys(EFFECT_REGISTRY).length);
  });
});

describe("getEffectsByTag", () => {
  it("finds effects tagged with 'gradient'", () => {
    const results = getEffectsByTag("gradient");
    expect(results.length).toBeGreaterThanOrEqual(1);
    for (const entry of results) {
      expect(entry.manifest.tags).toContain("gradient");
    }
  });

  it("finds effects tagged with 'animation'", () => {
    const results = getEffectsByTag("animation");
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it("returns empty array for a tag that no effect uses", () => {
    const results = getEffectsByTag("nonexistent-tag-xyz");
    expect(results).toHaveLength(0);
  });
});
