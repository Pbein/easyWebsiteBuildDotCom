import { describe, it, expect } from "vitest";
import { generateProject } from "@/lib/export/generate-project";
import { createMinimalSpec } from "../helpers/fixtures";

describe("Export Pipeline", () => {
  describe("generateProject", () => {
    it("returns ExportResult with 3 files", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      expect(result.files).toHaveLength(3);
      expect(result.businessName).toBe("TestBiz Co");
    });

    it("generates index.html with correct structure", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const html = result.files.find((f) => f.path === "index.html");
      expect(html).toBeDefined();
      expect(html!.content).toContain("<!DOCTYPE html>");
      expect(html!.content).toContain("<title>TestBiz Co</title>");
      expect(html!.content).toContain("fonts.googleapis.com");
      expect(html!.content).toContain("styles.css");
    });

    it("generates styles.css with theme variables", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const css = result.files.find((f) => f.path === "styles.css");
      expect(css).toBeDefined();
      expect(css!.content).toContain(":root {");
      expect(css!.content).toContain("--color-primary:");
      expect(css!.content).toContain("--font-heading:");
      expect(css!.content).toContain("--font-body:");
    });

    it("generates README.md", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const readme = result.files.find((f) => f.path === "README.md");
      expect(readme).toBeDefined();
      expect(readme!.content).toContain("TestBiz Co");
      expect(readme!.content).toContain("EasyWebsiteBuild");
    });

    it("HTML includes business name in nav", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const html = result.files.find((f) => f.path === "index.html")!;
      expect(html.content).toContain("TestBiz Co");
    });

    it("HTML includes hero section", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const html = result.files.find((f) => f.path === "index.html")!;
      expect(html.content).toContain("hero");
      expect(html.content).toContain("Welcome to TestBiz Co");
    });

    it("CSS includes responsive media query", () => {
      const spec = createMinimalSpec();
      const result = generateProject(spec);
      const css = result.files.find((f) => f.path === "styles.css")!;
      expect(css.content).toContain("@media");
      expect(css.content).toContain("768px");
    });

    it("escapes HTML entities in business name", () => {
      const spec = createMinimalSpec({ businessName: "Test & <Script>" });
      const result = generateProject(spec);
      const html = result.files.find((f) => f.path === "index.html")!;
      expect(html.content).toContain("Test &amp; &lt;Script&gt;");
      expect(html.content).not.toContain("<Script>");
    });

    it("handles spec with many components", () => {
      const spec = createMinimalSpec();
      // Add more components to the page
      spec.pages[0].components.push(
        {
          componentId: "content-stats",
          variant: "cards",
          order: 10,
          content: { headline: "Stats", stats: [{ value: "100", label: "Users" }] },
        },
        {
          componentId: "content-accordion",
          variant: "single-open",
          order: 11,
          content: { headline: "FAQ", items: [{ question: "Q?", answer: "A." }] },
        }
      );
      const result = generateProject(spec);
      const html = result.files.find((f) => f.path === "index.html")!;
      expect(html.content).toContain("Stats");
      expect(html.content).toContain("FAQ");
    });
  });
});
