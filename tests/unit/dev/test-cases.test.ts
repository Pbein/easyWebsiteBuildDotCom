import { describe, it, expect } from "vitest";
import { generateThemeFromVector } from "@/lib/theme/generate-theme";
import { applyEmotionalOverrides } from "@/lib/theme/emotional-overrides";
import type { PersonalityVector } from "@/lib/theme/theme.types";
import { INDUSTRY_ANTI_REFERENCES, ANTI_REFERENCES } from "@/lib/types/brand-character";

/**
 * Tests for T6-E2 (Named Test Cases + Side-by-Side Comparison)
 * Focus on the pure logic used by the dev pages.
 */

const BALANCED_VECTOR: PersonalityVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
const LUXURY_VECTOR: PersonalityVector = [0.8, 0.9, 0.3, 0.7, 0.2, 0.3];

describe("theme comparison logic", () => {
  it("generates different themes for different personality vectors", () => {
    const theme1 = generateThemeFromVector(BALANCED_VECTOR);
    const theme2 = generateThemeFromVector(LUXURY_VECTOR);
    // At least some tokens should differ
    const keys = Object.keys(theme1) as (keyof typeof theme1)[];
    const diffCount = keys.filter((k) => theme1[k] !== theme2[k]).length;
    expect(diffCount).toBeGreaterThan(0);
  });

  it("emotional overrides produce detectable diffs", () => {
    const base = generateThemeFromVector(BALANCED_VECTOR);
    const withOverrides = applyEmotionalOverrides(base, ["luxury", "calm"], ["corporate"]);
    const keys = Object.keys(base) as (keyof typeof base)[];
    const diffs = keys.filter((k) => base[k] !== withOverrides[k]);
    expect(diffs.length).toBeGreaterThan(3); // luxury + calm + corporate should change multiple tokens
  });

  it("identical inputs produce identical themes (deterministic)", () => {
    const theme1 = generateThemeFromVector(BALANCED_VECTOR);
    const theme2 = generateThemeFromVector(BALANCED_VECTOR);
    expect(theme1).toEqual(theme2);
  });
});

describe("content extraction logic", () => {
  it("extracts headlines and CTAs from a spec-like structure", () => {
    const spec = {
      pages: [
        {
          components: [
            {
              componentId: "hero-centered",
              variant: "gradient-bg",
              content: {
                headline: "Welcome to Our Restaurant",
                subheadline: "Fine dining since 1995",
                cta: { text: "Book a Table" },
              },
            },
            {
              componentId: "content-features",
              variant: "icon-cards",
              content: {
                headline: "What We Offer",
                body: "A unique dining experience",
              },
            },
          ],
        },
      ],
    };

    // Simulate the extraction logic from compare page
    const items: { label: string; value: string }[] = [];
    for (const page of spec.pages) {
      for (const comp of page.components) {
        const c = comp.content;
        if (typeof c.headline === "string") {
          items.push({ label: `${comp.componentId} headline`, value: c.headline });
        }
        if ("subheadline" in c && typeof c.subheadline === "string") {
          items.push({ label: `${comp.componentId} subheadline`, value: c.subheadline });
        }
        if ("body" in c && typeof c.body === "string") {
          items.push({ label: `${comp.componentId} body`, value: c.body });
        }
        if ("cta" in c && c.cta && typeof (c.cta as { text?: string }).text === "string") {
          items.push({
            label: `${comp.componentId} CTA`,
            value: (c.cta as { text: string }).text,
          });
        }
      }
    }

    expect(items).toHaveLength(5);
    expect(items[0]).toEqual({
      label: "hero-centered headline",
      value: "Welcome to Our Restaurant",
    });
    // CTA is at index 2 (hero has no body field, so order is: headline, subheadline, CTA)
    expect(items[2]).toEqual({ label: "hero-centered CTA", value: "Book a Table" });
  });
});

describe("test case intake snapshot structure", () => {
  it("intake snapshot contains required fields for spec generation", () => {
    // Simulate what gets saved from a pipeline log
    const intakeSnapshot = {
      siteType: "restaurant",
      goal: "leads",
      businessName: "LuxuryFine",
      description: "Upscale Mexican dining experience in downtown",
      personality: [0.8, 0.9, 0.3, 0.7, 0.2, 0.3],
      emotionalGoals: ["luxury", "welcomed"],
      voiceProfile: "polished",
      brandArchetype: "artisan",
      antiReferences: ["fast-food", "cheap"],
    };

    expect(intakeSnapshot.siteType).toBe("restaurant");
    expect(intakeSnapshot.personality).toHaveLength(6);
    expect(intakeSnapshot.emotionalGoals).toContain("luxury");
    expect(intakeSnapshot.antiReferences).toContain("fast-food");
  });

  it("industry anti-references for restaurant are valid", () => {
    const restaurantRefs = INDUSTRY_ANTI_REFERENCES.restaurant;
    expect(restaurantRefs).toBeDefined();
    expect(restaurantRefs.length).toBeGreaterThanOrEqual(2);

    // None should overlap with general anti-refs
    const generalIds = new Set(ANTI_REFERENCES.map((r) => r.id));
    for (const ref of restaurantRefs) {
      expect(generalIds.has(ref.id)).toBe(false);
    }
  });
});

describe("component stack comparison", () => {
  it("detects differences in component ordering", () => {
    const left = [
      { componentId: "nav-sticky", variant: "solid" },
      { componentId: "hero-centered", variant: "gradient-bg" },
      { componentId: "content-features", variant: "icon-cards" },
    ];
    const right = [
      { componentId: "nav-sticky", variant: "solid" },
      { componentId: "hero-split", variant: "image-right" },
      { componentId: "content-features", variant: "icon-cards" },
    ];

    const diffs = left
      .map((l, i) => ({
        index: i,
        same: l.componentId === right[i]?.componentId && l.variant === right[i]?.variant,
      }))
      .filter((d) => !d.same);

    expect(diffs).toHaveLength(1);
    expect(diffs[0].index).toBe(1); // hero changed
  });

  it("handles different-length stacks", () => {
    const left = [
      { componentId: "nav-sticky", variant: "solid" },
      { componentId: "hero-centered", variant: "gradient-bg" },
    ];
    const right = [
      { componentId: "nav-sticky", variant: "solid" },
      { componentId: "hero-centered", variant: "gradient-bg" },
      { componentId: "content-features", variant: "icon-cards" },
      { componentId: "cta-banner", variant: "full-width" },
    ];

    expect(right.length).toBeGreaterThan(left.length);
    // Max length determines full comparison
    expect(Math.max(left.length, right.length)).toBe(4);
  });
});
