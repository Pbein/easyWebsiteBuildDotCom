import { describe, it, expect } from "vitest";
import { fixSpecContent } from "@/lib/assembly/validate-spec";
import type { FixResult } from "@/lib/assembly/validate-spec";
import { createMinimalSpec } from "../../helpers/fixtures";
import type { SiteIntentDocument } from "@/lib/assembly/spec.types";

/* ────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────── */

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
              headline: "Services & Treatments",
              subheadline: "Book an Appointment today",
              ctaPrimary: { text: "Book Your Appointment", href: "#" },
            },
          },
          {
            componentId: "team-grid",
            variant: "cards",
            order: 2,
            content: {
              headline: "Our Team",
              members: [
                { name: "Jane", role: "Founder & CEO", image: "https://example.com/jane.jpg" },
                { name: "Bob", role: "Creative Director", image: "https://example.com/bob.jpg" },
                { name: "Chef Maria", role: "Head Chef", image: "https://example.com/maria.jpg" },
              ],
            },
          },
          {
            componentId: "content-stats",
            variant: "cards",
            order: 3,
            content: {
              headline: "By the Numbers",
              stats: [
                { value: "500", label: "Guests", suffix: "+" },
                { value: 100, label: "Dishes", suffix: "" },
              ],
            },
          },
          {
            componentId: "footer-standard",
            variant: "multi-column",
            order: 4,
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

describe("fixSpecContent", () => {
  describe("immutability", () => {
    it("does not mutate the original spec", () => {
      const original = createMismatchedRestaurantSpec();
      const navLogoTextBefore = (original.pages[0].components[0].content as Record<string, unknown>)
        .logoText;
      fixSpecContent(original, {
        description: "Fine dining Mexican restaurant",
        siteType: "booking",
      });
      const navLogoTextAfter = (original.pages[0].components[0].content as Record<string, unknown>)
        .logoText;
      expect(navLogoTextAfter).toBe(navLogoTextBefore);
    });

    it("returns a new spec object", () => {
      const original = createMismatchedRestaurantSpec();
      const result = fixSpecContent(original, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      expect(result.spec).not.toBe(original);
    });
  });

  describe("return structure", () => {
    it("returns spec, fixes array, and subType", () => {
      const spec = createMismatchedRestaurantSpec();
      const result: FixResult = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      expect(result).toHaveProperty("spec");
      expect(result).toHaveProperty("fixes");
      expect(result).toHaveProperty("subType");
      expect(Array.isArray(result.fixes)).toBe(true);
      expect(result.subType).toBe("restaurant");
    });

    it("each fix has required fields", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      for (const fix of result.fixes) {
        expect(typeof fix.componentRef).toBe("string");
        expect(typeof fix.field).toBe("string");
        expect(typeof fix.original).toBe("string");
        expect(typeof fix.replacement).toBe("string");
        expect(typeof fix.rule).toBe("string");
      }
    });
  });

  describe("Fix 1: Business name in logoText", () => {
    it("replaces nav logoText with business name", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const navContent = result.spec.pages[0].components[0].content as Record<string, unknown>;
      expect(navContent.logoText).toBe("LuxuryFine");
    });

    it("replaces footer logoText with business name", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const footerContent = result.spec.pages[0].components[4].content as Record<string, unknown>;
      expect(footerContent.logoText).toBe("LuxuryFine");
    });

    it("logs the business-name fix", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const nameFixesNav = result.fixes.filter(
        (f) => f.rule === "business-name" && f.componentRef.startsWith("nav-sticky")
      );
      expect(nameFixesNav.length).toBe(1);
      expect(nameFixesNav[0].original).toBe("Generic Brand");
      expect(nameFixesNav[0].replacement).toBe("LuxuryFine");
    });

    it("does not fix logoText when business name already present", () => {
      const spec = createMinimalSpec({ businessName: "TestBiz Co" });
      const result = fixSpecContent(spec, {
        description: "General business",
        siteType: "business",
      });
      const nameFixes = result.fixes.filter((f) => f.rule === "business-name");
      expect(nameFixes).toHaveLength(0);
    });
  });

  describe("Fix 2: Headline replacements", () => {
    it("replaces 'Services & Treatments' with 'Our Menu' for restaurant", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const heroContent = result.spec.pages[0].components[1].content as Record<string, unknown>;
      expect(heroContent.headline).toBe("Our Menu");
    });

    it("replaces 'Book an Appointment' with 'Reserve a Table' for restaurant", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const heroContent = result.spec.pages[0].components[1].content as Record<string, unknown>;
      expect(heroContent.subheadline).toBe("Reserve a Table today");
    });

    it("replaces 'Book Your Appointment' with 'Reserve Your Table' for restaurant CTA", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const heroContent = result.spec.pages[0].components[1].content as Record<string, unknown>;
      const cta = heroContent.ctaPrimary as Record<string, unknown>;
      expect(cta.text).toBe("Reserve Your Table");
    });

    it("logs headline-swap fixes", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const headlineFixes = result.fixes.filter((f) => f.rule === "headline-swap");
      expect(headlineFixes.length).toBeGreaterThan(0);
    });
  });

  describe("Fix 3: Team role replacements", () => {
    it("replaces 'Founder & CEO' with 'Executive Chef' for restaurant", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const teamContent = result.spec.pages[0].components[2].content as Record<string, unknown>;
      const members = teamContent.members as Array<Record<string, unknown>>;
      expect(members[0].role).toBe("Executive Chef");
    });

    it("replaces 'Creative Director' with 'Sous Chef' for restaurant", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const teamContent = result.spec.pages[0].components[2].content as Record<string, unknown>;
      const members = teamContent.members as Array<Record<string, unknown>>;
      expect(members[1].role).toBe("Sous Chef");
    });

    it("does not replace roles that already fit the sub-type", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const teamContent = result.spec.pages[0].components[2].content as Record<string, unknown>;
      const members = teamContent.members as Array<Record<string, unknown>>;
      expect(members[2].role).toBe("Head Chef"); // Already correct
    });

    it("logs role-swap fixes", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const roleFixes = result.fixes.filter((f) => f.rule === "role-swap");
      expect(roleFixes.length).toBeGreaterThanOrEqual(2); // CEO + Creative Director
    });
  });

  describe("Fix 4: Vocabulary replacements", () => {
    it("replaces 'consultation' with 'reservation' in restaurant nav CTA", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const navContent = result.spec.pages[0].components[0].content as Record<string, unknown>;
      const cta = navContent.cta as Record<string, unknown>;
      // The headline-swap for "Schedule a Consultation" → "Reserve a Table" fires first
      // But after that, "consultation" would also be caught by vocab-swap if still present
      expect((cta.text as string).toLowerCase()).not.toContain("consultation");
    });
  });

  describe("Fix 5: content-stats type coercion", () => {
    it("converts string stat values to numbers", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const statsContent = result.spec.pages[0].components[3].content as Record<string, unknown>;
      const stats = statsContent.stats as Array<Record<string, unknown>>;
      expect(typeof stats[0].value).toBe("number");
      expect(stats[0].value).toBe(500);
    });

    it("leaves valid number values unchanged", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const statsContent = result.spec.pages[0].components[3].content as Record<string, unknown>;
      const stats = statsContent.stats as Array<Record<string, unknown>>;
      expect(stats[1].value).toBe(100);
    });

    it("logs type-coerce fixes", () => {
      const spec = createMismatchedRestaurantSpec();
      const result = fixSpecContent(spec, {
        description: "Fine dining restaurant",
        siteType: "booking",
      });
      const typeFixes = result.fixes.filter((f) => f.rule === "type-coerce");
      expect(typeFixes).toHaveLength(1);
      expect(typeFixes[0].original).toBe("500");
    });
  });

  describe("no fixes needed", () => {
    it("returns empty fixes array for a clean spec", () => {
      const spec = createMinimalSpec();
      const result = fixSpecContent(spec, {
        description: "Professional consulting firm",
        siteType: "business",
      });
      expect(result.fixes).toHaveLength(0);
    });

    it("returns the spec unchanged when no fixes are needed", () => {
      const spec = createMinimalSpec();
      const result = fixSpecContent(spec, {
        description: "Professional consulting firm",
        siteType: "business",
      });
      expect(result.spec.pages[0].components).toEqual(spec.pages[0].components);
    });
  });

  describe("sub-type-specific replacements", () => {
    it("uses spa vocabulary replacements for spa description", () => {
      const spec = createMinimalSpec({
        businessName: "Zen Spa",
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
                content: { logoText: "Zen Spa", links: [], cta: { text: "Reserve", href: "#" } },
              },
              {
                componentId: "content-text",
                variant: "centered",
                order: 1,
                content: {
                  headline: "Our Menu",
                  body: "<p>Experience chef-crafted relaxation treatments.</p>",
                },
              },
              {
                componentId: "footer-standard",
                variant: "multi-column",
                order: 2,
                content: { logoText: "Zen Spa", copyright: "", columns: [], socialLinks: [] },
              },
            ],
          },
        ],
      });
      const result = fixSpecContent(spec, {
        description: "Luxury day spa and wellness center",
        siteType: "booking",
      });
      expect(result.subType).toBe("spa");
      const textContent = result.spec.pages[0].components[1].content as Record<string, unknown>;
      expect(textContent.headline).toBe("Our Treatments");
      expect((textContent.body as string).toLowerCase()).toContain("therapist");
    });

    it("uses photography vocabulary replacements for photography description", () => {
      const spec = createMinimalSpec({
        businessName: "Snap Studio",
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
                content: {
                  logoText: "Snap Studio",
                  links: [],
                  cta: { text: "Book an Appointment", href: "#" },
                },
              },
              {
                componentId: "footer-standard",
                variant: "multi-column",
                order: 1,
                content: { logoText: "Snap Studio", copyright: "", columns: [], socialLinks: [] },
              },
            ],
          },
        ],
      });
      const result = fixSpecContent(spec, {
        description: "Professional wedding photographer",
        siteType: "portfolio",
      });
      expect(result.subType).toBe("photography");
      const navContent = result.spec.pages[0].components[0].content as Record<string, unknown>;
      const cta = navContent.cta as Record<string, unknown>;
      expect(cta.text).toBe("Book a Session");
    });
  });
});
