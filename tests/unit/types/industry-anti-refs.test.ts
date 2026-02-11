import { describe, it, expect } from "vitest";
import { INDUSTRY_ANTI_REFERENCES, ANTI_REFERENCES } from "@/lib/types/brand-character";

describe("INDUSTRY_ANTI_REFERENCES", () => {
  it("provides entries for known business site types", () => {
    const expectedTypes = [
      "restaurant",
      "booking",
      "spa",
      "photography",
      "ecommerce",
      "portfolio",
      "blog",
      "nonprofit",
      "educational",
      "event",
    ];
    for (const type of expectedTypes) {
      expect(INDUSTRY_ANTI_REFERENCES[type]).toBeDefined();
      expect(INDUSTRY_ANTI_REFERENCES[type].length).toBeGreaterThanOrEqual(2);
    }
  });

  it("each entry has id, label, and description", () => {
    for (const [, refs] of Object.entries(INDUSTRY_ANTI_REFERENCES)) {
      for (const ref of refs) {
        expect(ref.id).toBeTruthy();
        expect(ref.label).toBeTruthy();
        expect(ref.description).toBeTruthy();
      }
    }
  });

  it("industry ref IDs do not overlap with general anti-reference IDs", () => {
    const generalIds = new Set(ANTI_REFERENCES.map((r) => r.id));
    for (const [, refs] of Object.entries(INDUSTRY_ANTI_REFERENCES)) {
      for (const ref of refs) {
        expect(generalIds.has(ref.id)).toBe(false);
      }
    }
  });

  it("industry ref IDs are unique within each category", () => {
    for (const [, refs] of Object.entries(INDUSTRY_ANTI_REFERENCES)) {
      const ids = refs.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("each category has 2-3 entries (not overwhelming)", () => {
    for (const [, refs] of Object.entries(INDUSTRY_ANTI_REFERENCES)) {
      expect(refs.length).toBeGreaterThanOrEqual(2);
      expect(refs.length).toBeLessThanOrEqual(3);
    }
  });

  it("restaurant has fast-food, cafeteria, and chain-restaurant", () => {
    const ids = INDUSTRY_ANTI_REFERENCES.restaurant.map((r) => r.id);
    expect(ids).toContain("fast-food");
    expect(ids).toContain("cafeteria");
    expect(ids).toContain("chain-restaurant");
  });

  it("spa has budget-salon and medical-clinic", () => {
    const ids = INDUSTRY_ANTI_REFERENCES.spa.map((r) => r.id);
    expect(ids).toContain("budget-salon");
    expect(ids).toContain("medical-clinic");
  });

  it("photography has stock-agency and snapshot-studio", () => {
    const ids = INDUSTRY_ANTI_REFERENCES.photography.map((r) => r.id);
    expect(ids).toContain("stock-agency");
    expect(ids).toContain("snapshot-studio");
  });
});
