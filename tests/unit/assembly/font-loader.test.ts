import { describe, it, expect, beforeEach } from "vitest";
import { loadGoogleFonts } from "@/lib/assembly/font-loader";

describe("loadGoogleFonts", () => {
  beforeEach(() => {
    // Clear the DOM
    document.head.innerHTML = "";
  });

  it("appends a link element to document head", () => {
    loadGoogleFonts("'Cormorant Garamond', serif", "'Outfit', sans-serif");
    const links = document.head.querySelectorAll("link[rel='stylesheet']");
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("generates correct Google Fonts URL", () => {
    loadGoogleFonts("'TestFont', serif", "'AnotherFont', sans-serif");
    const link = document.head.querySelector("link[rel='stylesheet']") as HTMLLinkElement;
    expect(link?.href).toContain("fonts.googleapis.com");
    expect(link?.href).toContain("TestFont");
    expect(link?.href).toContain("AnotherFont");
  });

  it("deduplicates identical font requests", () => {
    // Note: deduplication uses module-level Set, so fonts loaded in other tests persist.
    // We use unique font names to test this behavior.
    loadGoogleFonts("'UniqueTestA', serif", "'UniqueTestB', sans-serif");
    const linksBefore = document.head.querySelectorAll("link[rel='stylesheet']").length;
    loadGoogleFonts("'UniqueTestA', serif", "'UniqueTestB', sans-serif");
    const linksAfter = document.head.querySelectorAll("link[rel='stylesheet']").length;
    expect(linksAfter).toBe(linksBefore);
  });

  it("handles same heading and body font", () => {
    loadGoogleFonts("'DuplicateFont', serif", "'DuplicateFont', serif");
    const link = document.head.querySelector(
      "link[rel='stylesheet']:last-child"
    ) as HTMLLinkElement;
    if (link) {
      // Should only have one family parameter even though same font was passed twice
      const matches = link.href.match(/family=/g);
      expect(matches?.length).toBe(1);
    }
  });
});
