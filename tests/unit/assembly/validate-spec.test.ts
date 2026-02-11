import { describe, it, expect } from "vitest";
import { validateSpecContent } from "@/lib/assembly/validate-spec";
import type { ValidationResult } from "@/lib/assembly/validate-spec";
import { createMinimalSpec } from "../../helpers/fixtures";
import type { SiteIntentDocument } from "@/lib/assembly/spec.types";

/* ────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────── */

/** Create a restaurant-style spec with industry-appropriate content. */
function createRestaurantSpec(overrides: Partial<SiteIntentDocument> = {}): SiteIntentDocument {
  return createMinimalSpec({
    businessName: "LuxuryFine",
    pages: [
      {
        slug: "/",
        title: "Home",
        purpose: "Landing page",
        components: [
          {
            componentId: "nav-sticky",
            variant: "transparent",
            order: 0,
            content: {
              logoText: "LuxuryFine",
              links: [{ label: "Menu", href: "#menu" }],
              cta: { text: "Reserve a Table", href: "#reserve" },
            },
          },
          {
            componentId: "hero-centered",
            variant: "gradient-bg",
            order: 1,
            content: {
              headline: "Fine Dining from the Heart of Mexico",
              subheadline: "Exquisite cuisine in an elegant setting",
              ctaPrimary: { text: "View Our Menu", href: "#menu" },
            },
          },
          {
            componentId: "content-text",
            variant: "centered",
            order: 2,
            content: {
              eyebrow: "Our Story",
              headline: "A Culinary Journey",
              body: "<p>Every dish tells a story of tradition and innovation.</p>",
            },
          },
          {
            componentId: "footer-standard",
            variant: "multi-column",
            order: 3,
            content: {
              logoText: "LuxuryFine",
              copyright: "\u00a9 2026 LuxuryFine",
              columns: [],
              socialLinks: [],
            },
          },
        ],
      },
    ],
    ...overrides,
  });
}

/** Create a spec that deliberately has content mismatches for a restaurant. */
function createMismatchedRestaurantSpec(): SiteIntentDocument {
  return createMinimalSpec({
    businessName: "LuxuryFine",
    pages: [
      {
        slug: "/",
        title: "Home",
        purpose: "Landing page",
        components: [
          {
            componentId: "nav-sticky",
            variant: "transparent",
            order: 0,
            content: {
              logoText: "Generic Brand",
              links: [{ label: "Services", href: "#" }],
              cta: { text: "Schedule a Consultation", href: "#" },
            },
          },
          {
            componentId: "hero-centered",
            variant: "gradient-bg",
            order: 1,
            content: {
              headline: "Building something remarkable together",
              subheadline: "Your trusted partner in excellence",
              ctaPrimary: { text: "Book an Appointment", href: "#" },
            },
          },
          {
            componentId: "team-grid",
            variant: "cards",
            order: 2,
            content: {
              headline: "Our Team",
              members: [
                { name: "Jane", role: "CEO", image: "https://example.com/jane.jpg" },
                { name: "Bob", role: "Creative Director", image: "https://example.com/bob.jpg" },
              ],
            },
          },
          {
            componentId: "footer-standard",
            variant: "multi-column",
            order: 3,
            content: {
              logoText: "Generic Brand",
              copyright: "\u00a9 2026",
              columns: [],
              socialLinks: [],
            },
          },
        ],
      },
    ],
  });
}

/* ────────────────────────────────────────────────────────────
 * Tests
 * ──────────────────────────────────────────────────────────── */

describe("validateSpecContent", () => {
  describe("sub-type inference", () => {
    it("infers 'restaurant' sub-type from description keywords", () => {
      const spec = createRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining Mexican restaurant in downtown",
        siteType: "booking",
      });
      expect(result.subType).toBe("restaurant");
    });

    it("infers 'spa' sub-type from spa-related keywords", () => {
      const spec = createMinimalSpec();
      const result = validateSpecContent(spec, {
        description: "Luxury day spa offering massage and facial treatments",
        siteType: "booking",
      });
      expect(result.subType).toBe("spa");
    });

    it("infers 'photography' sub-type from photography keywords", () => {
      const spec = createMinimalSpec();
      const result = validateSpecContent(spec, {
        description: "Professional wedding photographer and portrait studio",
        siteType: "portfolio",
      });
      expect(result.subType).toBe("photography");
    });

    it("falls back to siteType when no sub-type keywords match", () => {
      const spec = createMinimalSpec();
      const result = validateSpecContent(spec, {
        description: "We build custom furniture",
        siteType: "business",
      });
      expect(result.subType).toBe("business");
    });
  });

  describe("Rule 1: Generic placeholder detection", () => {
    it("flags 'building something remarkable together'", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const generic = result.warnings.find((w) =>
        w.message.toLowerCase().includes("building something remarkable")
      );
      expect(generic).toBeDefined();
      expect(generic!.severity).toBe("warning");
    });

    it("flags 'your trusted partner'", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const generic = result.warnings.find((w) =>
        w.message.toLowerCase().includes("your trusted partner")
      );
      expect(generic).toBeDefined();
    });

    it("does not flag 'services & treatments' for spa sub-type", () => {
      const spec = createMinimalSpec({
        pages: [
          {
            slug: "/",
            title: "Home",
            purpose: "Landing",
            components: [
              {
                componentId: "nav-sticky",
                variant: "transparent",
                order: 0,
                content: { logoText: "TestBiz Co", links: [], cta: { text: "Book", href: "#" } },
              },
              {
                componentId: "content-text",
                variant: "centered",
                order: 1,
                content: {
                  headline: "Services & Treatments",
                  body: "<p>Relaxation awaits.</p>",
                },
              },
              {
                componentId: "footer-standard",
                variant: "multi-column",
                order: 2,
                content: { logoText: "TestBiz Co", copyright: "", columns: [], socialLinks: [] },
              },
            ],
          },
        ],
      });
      const result = validateSpecContent(spec, {
        description: "Luxury spa and wellness center",
        siteType: "booking",
      });
      const spaExempt = result.warnings.find((w) =>
        w.message.toLowerCase().includes("services & treatments")
      );
      expect(spaExempt).toBeUndefined();
    });

    it("produces no generic warnings for well-written restaurant content", () => {
      const spec = createRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const genericWarnings = result.warnings.filter((w) =>
        w.message.toLowerCase().includes("generic placeholder")
      );
      expect(genericWarnings).toHaveLength(0);
    });
  });

  describe("Rule 2: Business name presence", () => {
    it("passes when business name appears in nav and footer logoText", () => {
      const spec = createRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const nameWarning = result.warnings.find((w) => w.field === "logoText");
      expect(nameWarning).toBeUndefined();
    });

    it("errors when business name is missing from nav/footer logoText", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const nameWarning = result.warnings.find((w) => w.field === "logoText");
      expect(nameWarning).toBeDefined();
      expect(nameWarning!.severity).toBe("error");
      expect(nameWarning!.message).toContain("LuxuryFine");
    });

    it("is case-insensitive for business name matching", () => {
      const spec = createMinimalSpec({
        businessName: "luxuryfine",
        pages: [
          {
            slug: "/",
            title: "Home",
            purpose: "Landing",
            components: [
              {
                componentId: "nav-sticky",
                variant: "transparent",
                order: 0,
                content: { logoText: "LUXURYFINE", links: [], cta: { text: "Go", href: "#" } },
              },
              {
                componentId: "footer-standard",
                variant: "multi-column",
                order: 1,
                content: { logoText: "LuxuryFine", copyright: "", columns: [], socialLinks: [] },
              },
            ],
          },
        ],
      });
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const nameWarning = result.warnings.find((w) => w.field === "logoText");
      expect(nameWarning).toBeUndefined();
    });
  });

  describe("Rule 3: Vocabulary blacklist", () => {
    it("flags 'appointment' in restaurant content", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const appointmentWarning = result.warnings.find((w) =>
        w.message.toLowerCase().includes('"appointment"')
      );
      expect(appointmentWarning).toBeDefined();
      expect(appointmentWarning!.severity).toBe("warning");
    });

    it("flags 'creative director' in restaurant content", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const cdWarning = result.warnings.find((w) =>
        w.message.toLowerCase().includes('"creative director"')
      );
      expect(cdWarning).toBeDefined();
    });

    it("flags 'ceo' in restaurant content", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const ceoWarning = result.warnings.find((w) => w.message.toLowerCase().includes('"ceo"'));
      expect(ceoWarning).toBeDefined();
    });

    it("does not flag spa vocabulary on a spa site", () => {
      const spec = createMinimalSpec({
        pages: [
          {
            slug: "/",
            title: "Home",
            purpose: "Landing",
            components: [
              {
                componentId: "nav-sticky",
                variant: "transparent",
                order: 0,
                content: { logoText: "TestBiz Co", links: [], cta: { text: "Go", href: "#" } },
              },
              {
                componentId: "content-text",
                variant: "centered",
                order: 1,
                content: {
                  headline: "Our Treatments",
                  body: "<p>Book your treatment session with our expert therapist.</p>",
                },
              },
              {
                componentId: "footer-standard",
                variant: "multi-column",
                order: 2,
                content: { logoText: "TestBiz Co", copyright: "", columns: [], socialLinks: [] },
              },
            ],
          },
        ],
      });
      const result = validateSpecContent(spec, {
        description: "Luxury spa and wellness center",
        siteType: "booking",
      });
      const blacklistWarnings = result.warnings.filter((w) =>
        w.message.includes("inappropriate vocabulary")
      );
      expect(blacklistWarnings).toHaveLength(0);
    });

    it("includes componentRef in blacklist warnings", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const blacklistWarnings = result.warnings.filter((w) =>
        w.message.includes("inappropriate vocabulary")
      );
      const withRef = blacklistWarnings.filter((w) => w.componentRef);
      expect(withRef.length).toBeGreaterThan(0);
    });
  });

  describe("Rule 4: Vocabulary whitelist", () => {
    it("warns when restaurant content has no industry-specific terms", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const whitelistWarning = result.warnings.find((w) =>
        w.message.includes("No restaurant-specific vocabulary")
      );
      expect(whitelistWarning).toBeDefined();
      expect(whitelistWarning!.severity).toBe("warning");
    });

    it("passes when restaurant content includes industry terms", () => {
      const spec = createRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const whitelistWarning = result.warnings.find((w) =>
        w.message.includes("No restaurant-specific vocabulary")
      );
      expect(whitelistWarning).toBeUndefined();
    });

    it("passes for photography content with portfolio vocabulary", () => {
      const spec = createMinimalSpec({
        pages: [
          {
            slug: "/",
            title: "Home",
            purpose: "Landing",
            components: [
              {
                componentId: "nav-sticky",
                variant: "transparent",
                order: 0,
                content: { logoText: "TestBiz Co", links: [], cta: { text: "Go", href: "#" } },
              },
              {
                componentId: "content-text",
                variant: "centered",
                order: 1,
                content: {
                  headline: "Our Portfolio",
                  body: "<p>Capturing your special moments with a creative lens.</p>",
                },
              },
              {
                componentId: "footer-standard",
                variant: "multi-column",
                order: 2,
                content: { logoText: "TestBiz Co", copyright: "", columns: [], socialLinks: [] },
              },
            ],
          },
        ],
      });
      const result = validateSpecContent(spec, {
        description: "Professional wedding photographer",
        siteType: "portfolio",
      });
      const whitelistWarning = result.warnings.find((w) =>
        w.message.includes("No photography-specific vocabulary")
      );
      expect(whitelistWarning).toBeUndefined();
    });
  });

  describe("Rule 5: Content field type checks", () => {
    it("errors when content-stats value is a string instead of number", () => {
      const spec = createMinimalSpec({
        pages: [
          {
            slug: "/",
            title: "Home",
            purpose: "Landing",
            components: [
              {
                componentId: "nav-sticky",
                variant: "transparent",
                order: 0,
                content: { logoText: "TestBiz Co", links: [], cta: { text: "Go", href: "#" } },
              },
              {
                componentId: "content-stats",
                variant: "cards",
                order: 1,
                content: {
                  headline: "Stats",
                  stats: [
                    { value: "500", label: "Customers", suffix: "+" },
                    { value: 100, label: "Projects", suffix: "" },
                  ],
                },
              },
              {
                componentId: "footer-standard",
                variant: "multi-column",
                order: 2,
                content: { logoText: "TestBiz Co", copyright: "", columns: [], socialLinks: [] },
              },
            ],
          },
        ],
      });
      const result = validateSpecContent(spec, {
        description: "General business",
        siteType: "business",
      });
      const typeWarning = result.warnings.find(
        (w) => w.field === "stats[].value" && w.severity === "error"
      );
      expect(typeWarning).toBeDefined();
      expect(typeWarning!.message).toContain("500");
    });

    it("passes when content-stats values are all numbers", () => {
      const spec = createMinimalSpec({
        pages: [
          {
            slug: "/",
            title: "Home",
            purpose: "Landing",
            components: [
              {
                componentId: "nav-sticky",
                variant: "transparent",
                order: 0,
                content: { logoText: "TestBiz Co", links: [], cta: { text: "Go", href: "#" } },
              },
              {
                componentId: "content-stats",
                variant: "cards",
                order: 1,
                content: {
                  headline: "Stats",
                  stats: [
                    { value: 500, label: "Customers", suffix: "+" },
                    { value: 100, label: "Projects", suffix: "" },
                  ],
                },
              },
              {
                componentId: "footer-standard",
                variant: "multi-column",
                order: 2,
                content: { logoText: "TestBiz Co", copyright: "", columns: [], socialLinks: [] },
              },
            ],
          },
        ],
      });
      const result = validateSpecContent(spec, {
        description: "General business",
        siteType: "business",
      });
      const typeWarning = result.warnings.find((w) => w.field === "stats[].value");
      expect(typeWarning).toBeUndefined();
    });
  });

  describe("return value structure", () => {
    it("returns a ValidationResult with warnings array and subType", () => {
      const spec = createMinimalSpec();
      const result: ValidationResult = validateSpecContent(spec, {
        description: "A small business",
        siteType: "business",
      });
      expect(result).toHaveProperty("warnings");
      expect(result).toHaveProperty("subType");
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(typeof result.subType).toBe("string");
    });

    it("each warning has required severity and message fields", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      for (const warning of result.warnings) {
        expect(["error", "warning"]).toContain(warning.severity);
        expect(typeof warning.message).toBe("string");
        expect(warning.message.length).toBeGreaterThan(0);
      }
    });
  });

  describe("clean spec produces minimal warnings", () => {
    it("well-formed business spec with matching content has zero warnings", () => {
      const spec = createMinimalSpec();
      const result = validateSpecContent(spec, {
        description: "Professional consulting services for small businesses",
        siteType: "business",
      });
      // Business type has no blacklist/whitelist, name is in nav/footer, no generic phrases
      expect(result.warnings).toHaveLength(0);
    });

    it("well-formed restaurant spec with industry vocabulary has zero warnings", () => {
      const spec = createRestaurantSpec();
      const result = validateSpecContent(spec, {
        description: "Fine dining Mexican restaurant",
        siteType: "booking",
      });
      expect(result.warnings).toHaveLength(0);
    });
  });
});
