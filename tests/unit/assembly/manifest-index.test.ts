import { describe, it, expect } from "vitest";
import {
  COMPONENT_MANIFESTS,
  getManifestById,
  getManifestsByCategory,
  getManifestsBySiteType,
} from "@/components/library/manifest-index";

describe("COMPONENT_MANIFESTS", () => {
  it("contains 25 manifests (24 components + section)", () => {
    expect(COMPONENT_MANIFESTS.length).toBe(25);
  });

  it("each manifest has required fields", () => {
    for (const manifest of COMPONENT_MANIFESTS) {
      expect(manifest.id).toBeTruthy();
      expect(manifest.category).toBeTruthy();
      expect(manifest.name).toBeTruthy();
      expect(manifest.description).toBeTruthy();
      expect(Array.isArray(manifest.siteTypes)).toBe(true);
      expect(Array.isArray(manifest.requiredProps)).toBe(true);
      expect(Array.isArray(manifest.optionalProps)).toBe(true);
      expect(Array.isArray(manifest.consumedTokens)).toBe(true);
      expect(Array.isArray(manifest.variants)).toBe(true);
      expect(Array.isArray(manifest.tags)).toBe(true);
    }
  });

  it("each manifest has unique id", () => {
    const ids = COMPONENT_MANIFESTS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each manifest has at least one variant", () => {
    for (const manifest of COMPONENT_MANIFESTS) {
      expect(manifest.variants.length).toBeGreaterThan(0);
    }
  });
});

describe("getManifestById", () => {
  it("finds manifest by ID", () => {
    const nav = getManifestById("nav-sticky");
    expect(nav).toBeDefined();
    expect(nav?.id).toBe("nav-sticky");
  });

  it("returns undefined for unknown ID", () => {
    expect(getManifestById("fake")).toBeUndefined();
  });

  it("finds all 24 component manifests", () => {
    const componentIds = [
      "nav-sticky",
      "hero-centered",
      "hero-split",
      "hero-video",
      "content-features",
      "content-split",
      "content-text",
      "content-stats",
      "content-accordion",
      "content-timeline",
      "content-logos",
      "content-steps",
      "content-comparison",
      "content-map",
      "blog-preview",
      "cta-banner",
      "form-contact",
      "proof-testimonials",
      "proof-beforeafter",
      "team-grid",
      "commerce-services",
      "pricing-table",
      "media-gallery",
      "footer-standard",
    ];
    for (const id of componentIds) {
      expect(getManifestById(id)).toBeDefined();
    }
  });
});

describe("getManifestsByCategory", () => {
  it("returns hero manifests", () => {
    const heroes = getManifestsByCategory("hero");
    expect(heroes.length).toBeGreaterThanOrEqual(2);
    expect(heroes.every((m) => m.category === "hero")).toBe(true);
  });

  it("returns content manifests", () => {
    const content = getManifestsByCategory("content");
    expect(content.length).toBeGreaterThanOrEqual(5);
  });

  it("returns empty array for unknown category", () => {
    expect(getManifestsByCategory("nonexistent")).toHaveLength(0);
  });
});

describe("getManifestsBySiteType", () => {
  it("returns manifests for business site type", () => {
    const manifests = getManifestsBySiteType("business");
    expect(manifests.length).toBeGreaterThan(0);
  });

  it("returns manifests for portfolio site type", () => {
    const manifests = getManifestsBySiteType("portfolio");
    expect(manifests.length).toBeGreaterThan(0);
  });

  it("returns empty for unknown site type", () => {
    expect(getManifestsBySiteType("nonexistent")).toHaveLength(0);
  });
});
