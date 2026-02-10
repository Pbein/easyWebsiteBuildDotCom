import { describe, it, expect } from "vitest";
import {
  getComponent,
  isRegistered,
  UNWRAPPED_COMPONENTS,
} from "@/lib/assembly/component-registry";

const ALL_COMPONENT_IDS = [
  "nav-sticky",
  "hero-centered",
  "hero-split",
  "content-features",
  "content-split",
  "content-text",
  "content-stats",
  "content-accordion",
  "content-timeline",
  "content-logos",
  "cta-banner",
  "form-contact",
  "proof-testimonials",
  "proof-beforeafter",
  "team-grid",
  "commerce-services",
  "media-gallery",
  "footer-standard",
];

describe("COMPONENT_REGISTRY", () => {
  it("registers exactly 18 components", () => {
    let count = 0;
    for (const id of ALL_COMPONENT_IDS) {
      if (isRegistered(id)) count++;
    }
    expect(count).toBe(18);
  });

  describe("getComponent", () => {
    it.each(ALL_COMPONENT_IDS)("returns a component for '%s'", (id) => {
      const component = getComponent(id);
      expect(component).toBeDefined();
      expect(typeof component).toBe("function");
    });

    it("returns undefined for unknown component IDs", () => {
      expect(getComponent("nonexistent")).toBeUndefined();
      expect(getComponent("")).toBeUndefined();
      expect(getComponent("hero")).toBeUndefined();
    });
  });

  describe("isRegistered", () => {
    it.each(ALL_COMPONENT_IDS)("returns true for '%s'", (id) => {
      expect(isRegistered(id)).toBe(true);
    });

    it("returns false for unknown IDs", () => {
      expect(isRegistered("fake-component")).toBe(false);
      expect(isRegistered("")).toBe(false);
    });
  });
});

describe("UNWRAPPED_COMPONENTS", () => {
  it("contains nav-sticky and footer-standard", () => {
    expect(UNWRAPPED_COMPONENTS.has("nav-sticky")).toBe(true);
    expect(UNWRAPPED_COMPONENTS.has("footer-standard")).toBe(true);
  });

  it("does not contain regular components", () => {
    expect(UNWRAPPED_COMPONENTS.has("hero-centered")).toBe(false);
    expect(UNWRAPPED_COMPONENTS.has("content-features")).toBe(false);
    expect(UNWRAPPED_COMPONENTS.has("cta-banner")).toBe(false);
  });

  it("has exactly 2 entries", () => {
    expect(UNWRAPPED_COMPONENTS.size).toBe(2);
  });
});
