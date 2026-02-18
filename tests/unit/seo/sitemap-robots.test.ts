/**
 * Tests for SEO configuration: sitemap.ts and robots.ts
 *
 * Since these are simple Next.js metadata functions, we can import
 * and test them directly.
 */

import { describe, it, expect } from "vitest";

// Import the functions directly since they're pure functions
import sitemap from "../../../src/app/sitemap";
import robots from "../../../src/app/robots";

/**
 * @requirements
 * - [REQ-1]: Sitemap includes all public-facing routes (Source: SEO best practices)
 * - [REQ-2]: Sitemap URLs use the production domain (Source: deployment target easywebsitebuild.com)
 * - [REQ-3]: Robots.txt allows crawling of public pages (Source: SEO requirement)
 * - [REQ-4]: Robots.txt disallows crawling of API routes, dev tools, and iframe render routes (Source: security + SEO hygiene)
 * - [REQ-5]: Robots.txt references the sitemap URL (Source: SEO best practices)
 */
describe("sitemap.ts", () => {
  const entries = sitemap();

  describe("route coverage (Requirement REQ-1)", () => {
    it("includes the homepage", () => {
      const urls = entries.map((e) => e.url);
      expect(urls).toContain("https://easywebsitebuild.com");
    });

    it("includes the demo page", () => {
      const urls = entries.map((e) => e.url);
      expect(urls).toContain("https://easywebsitebuild.com/demo");
    });

    it("includes the preview page", () => {
      const urls = entries.map((e) => e.url);
      expect(urls).toContain("https://easywebsitebuild.com/preview");
    });

    it("includes the dashboard page", () => {
      const urls = entries.map((e) => e.url);
      expect(urls).toContain("https://easywebsitebuild.com/dashboard");
    });

    it("does not include internal/api routes", () => {
      const urls = entries.map((e) => e.url);
      const apiRoutes = urls.filter((u) => u.includes("/api/"));
      expect(apiRoutes).toHaveLength(0);
    });

    it("does not include dev routes", () => {
      const urls = entries.map((e) => e.url);
      const devRoutes = urls.filter((u) => u.includes("/dev/"));
      expect(devRoutes).toHaveLength(0);
    });
  });

  describe("production domain (Requirement REQ-2)", () => {
    it("all URLs use https://easywebsitebuild.com", () => {
      for (const entry of entries) {
        expect(entry.url).toMatch(/^https:\/\/easywebsitebuild\.com/);
      }
    });

    it("no URLs use localhost or staging domains", () => {
      for (const entry of entries) {
        expect(entry.url).not.toContain("localhost");
        expect(entry.url).not.toContain("vercel.app");
      }
    });
  });

  describe("sitemap entry structure (Contract)", () => {
    it("every entry has a url field", () => {
      for (const entry of entries) {
        expect(entry.url).toBeTruthy();
        expect(typeof entry.url).toBe("string");
      }
    });

    it("every entry has a lastModified date", () => {
      for (const entry of entries) {
        expect(entry.lastModified).toBeDefined();
        expect(entry.lastModified).toBeInstanceOf(Date);
      }
    });

    it("homepage has the highest priority (1.0)", () => {
      const homepage = entries.find((e) => e.url === "https://easywebsitebuild.com");
      expect(homepage?.priority).toBe(1);
    });

    it("priorities are between 0 and 1", () => {
      for (const entry of entries) {
        if (entry.priority !== undefined) {
          expect(entry.priority).toBeGreaterThanOrEqual(0);
          expect(entry.priority).toBeLessThanOrEqual(1);
        }
      }
    });
  });
});

describe("robots.ts", () => {
  const config = robots();

  describe("public access (Requirement REQ-3)", () => {
    it("allows crawling of the root path", () => {
      expect(config.rules).toBeDefined();
      const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
      const mainRule = rules[0];
      expect(mainRule.allow).toBe("/");
    });

    it("applies to all user agents", () => {
      const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
      const mainRule = rules[0];
      expect(mainRule.userAgent).toBe("*");
    });
  });

  describe("disallowed paths (Requirement REQ-4)", () => {
    it("disallows /api/ routes", () => {
      const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
      const mainRule = rules[0];
      const disallowed = Array.isArray(mainRule.disallow) ? mainRule.disallow : [mainRule.disallow];
      expect(disallowed).toContain("/api/");
    });

    it("disallows /dev/ routes", () => {
      const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
      const mainRule = rules[0];
      const disallowed = Array.isArray(mainRule.disallow) ? mainRule.disallow : [mainRule.disallow];
      expect(disallowed).toContain("/dev/");
    });

    it("disallows the iframe render route", () => {
      const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
      const mainRule = rules[0];
      const disallowed = Array.isArray(mainRule.disallow) ? mainRule.disallow : [mainRule.disallow];
      expect(disallowed).toContain("/demo/preview/render");
    });
  });

  describe("sitemap reference (Requirement REQ-5)", () => {
    it("includes sitemap URL pointing to production domain", () => {
      expect(config.sitemap).toBe("https://easywebsitebuild.com/sitemap.xml");
    });
  });
});
