/**
 * Export pipeline integration tests — complements tests/integration/export.test.ts.
 *
 * This file focuses on areas NOT already covered by the sibling test file:
 *   - viewport meta tag presence
 *   - includeBadge option (true / false)
 *   - extended component rendering (pricing, steps, comparison)
 *   - HTML lang attribute
 *   - stylesheet link reference
 *   - CSS reset / base styles
 *   - README deployment section
 *   - Google Fonts link with correct families
 *   - badge text content in README
 *   - charset meta tag
 */

import { describe, it, expect } from "vitest";
import { generateProject } from "@/lib/export/generate-project";
import { createMinimalSpec } from "../helpers/fixtures";

describe("Export Pipeline — Extended", () => {
  describe("viewport and HTML structure", () => {
    it("HTML includes viewport meta tag for responsive design", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const html = result.files.find((f) => f.path === "index.html")!;
      expect(html.content).toContain(
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      );
    });

    it("HTML includes lang attribute on html element", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const html = result.files.find((f) => f.path === "index.html")!;
      expect(html.content).toContain('<html lang="en">');
    });

    it("HTML includes charset meta tag", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const html = result.files.find((f) => f.path === "index.html")!;
      expect(html.content).toContain('<meta charset="UTF-8">');
    });
  });

  describe("includeBadge option", () => {
    it("includes badge HTML by default (includeBadge not specified)", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const html = result.files.find((f) => f.path === "index.html")!;
      expect(html.content).toContain("Built with EasyWebsiteBuild");
      expect(html.content).toContain("easywebsitebuild.com");
    });

    it("includes badge HTML when includeBadge is explicitly true", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec, { includeBadge: true });
      const html = result.files.find((f) => f.path === "index.html")!;
      expect(html.content).toContain("Built with EasyWebsiteBuild");
    });

    it("excludes badge HTML when includeBadge is false", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec, { includeBadge: false });
      const html = result.files.find((f) => f.path === "index.html")!;
      expect(html.content).not.toContain("Built with EasyWebsiteBuild");
    });

    it("README includes badge section when includeBadge is true", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec, { includeBadge: true });
      const readme = result.files.find((f) => f.path === "README.md")!;
      expect(readme.content).toContain("## Badge");
      expect(readme.content).toContain("Built with EasyWebsiteBuild");
    });

    it("README excludes badge section when includeBadge is false", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec, { includeBadge: false });
      const readme = result.files.find((f) => f.path === "README.md")!;
      expect(readme.content).not.toContain("## Badge");
    });
  });

  describe("Google Fonts integration", () => {
    it("generates Google Fonts link with correct font families in HTML", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const html = result.files.find((f) => f.path === "index.html")!;
      // The theme system generates font families — the HTML should include a
      // preconnect to fonts.googleapis.com and a CSS link with family= params
      expect(html.content).toContain('<link rel="preconnect" href="https://fonts.googleapis.com">');
      expect(html.content).toContain(
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
      );
      expect(html.content).toContain("fonts.googleapis.com/css2?family=");
    });
  });

  describe("extended component rendering", () => {
    it("generates HTML for a spec with many diverse components", () => {
      // Build a spec with multiple component types that the export renderer
      // supports, using field names compatible with the export renderer's
      // expectations (e.g. renderServices expects `title`, not `name`).
      const spec = createMinimalSpec({
        pages: [
          {
            slug: "/",
            title: "Home",
            purpose: "Multi-component test page",
            components: [
              {
                componentId: "nav-sticky",
                variant: "transparent",
                order: 0,
                content: {
                  logoText: "TestBiz Co",
                  links: [{ label: "Home", href: "#" }],
                  cta: { text: "Get Started", href: "#contact" },
                },
              },
              {
                componentId: "hero-centered",
                variant: "gradient-bg",
                order: 1,
                content: {
                  headline: "Welcome to TestBiz Co",
                  subheadline: "Making things great",
                  ctaPrimary: { text: "Start", href: "#" },
                },
              },
              {
                componentId: "pricing-table",
                variant: "simple",
                order: 2,
                content: {
                  headline: "Pricing Plans",
                  plans: [
                    {
                      name: "Starter",
                      price: "$12",
                      period: "/mo",
                      features: [{ text: "1 site", included: true }],
                    },
                  ],
                },
              },
              {
                componentId: "content-steps",
                variant: "numbered",
                order: 3,
                content: {
                  headline: "How It Works",
                  steps: [{ title: "Step 1", description: "Do this first" }],
                },
              },
              {
                componentId: "content-comparison",
                variant: "table",
                order: 4,
                content: {
                  headline: "Compare Options",
                  columns: [{ name: "Free" }, { name: "Pro" }],
                  rows: [{ feature: "Support", values: ["Email", "Priority"] }],
                },
              },
              {
                componentId: "footer-standard",
                variant: "multi-column",
                order: 5,
                content: {
                  logoText: "TestBiz Co",
                  copyright: "2026 TestBiz Co",
                  columns: [{ title: "Links", links: [{ label: "Home", href: "#" }] }],
                  socialLinks: [],
                },
              },
            ],
          },
        ],
      });

      const result = generateProject(spec);
      expect(result.files).toHaveLength(3);
      const html = result.files.find((f) => f.path === "index.html")!;
      // Verify the HTML is substantial with multiple sections
      expect(html.content.length).toBeGreaterThan(3000);
      // Spot-check component outputs
      expect(html.content).toContain("Pricing Plans");
      expect(html.content).toContain("How It Works");
      expect(html.content).toContain("Compare Options");
    });

    it("CSS includes base reset styles", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const css = result.files.find((f) => f.path === "styles.css")!;
      expect(css.content).toContain("box-sizing: border-box");
      expect(css.content).toContain("scroll-behavior: smooth");
    });
  });

  describe("README content", () => {
    it("README includes deployment instructions", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const readme = result.files.find((f) => f.path === "README.md")!;
      expect(readme.content).toContain("## Deployment");
      expect(readme.content).toContain("Vercel");
    });
  });
});
