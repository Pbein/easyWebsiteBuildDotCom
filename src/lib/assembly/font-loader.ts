const loadedFonts = new Set<string>();

/** Cap to prevent unbounded memory growth across many theme switches */
const MAX_LOADED_FONTS = 50;

/**
 * Extract the font name from a CSS font-family string.
 * e.g. "'Cormorant Garamond', serif" → "Cormorant Garamond"
 */
function extractFontName(fontFamily: string): string | null {
  const match = fontFamily.match(/^['"]?([^'"]+?)['"]?(?:\s*,|$)/);
  return match?.[1]?.trim() || null;
}

/**
 * Dynamically load Google Fonts by injecting a <link> element.
 * Deduplicates — won't reload fonts that have already been loaded.
 * Caps total loaded fonts to prevent unbounded memory growth.
 */
export function loadGoogleFonts(headingFont: string, bodyFont: string): void {
  const fonts = [
    ...new Set(
      [headingFont, bodyFont]
        .map(extractFontName)
        .filter((name): name is string => name !== null && !loadedFonts.has(name))
    ),
  ];

  if (fonts.length === 0) return;

  // If we've hit the cap, evict oldest entries and their <link> elements
  if (loadedFonts.size + fonts.length > MAX_LOADED_FONTS) {
    const toEvict = loadedFonts.size + fonts.length - MAX_LOADED_FONTS;
    const entries = Array.from(loadedFonts);
    for (let i = 0; i < toEvict && i < entries.length; i++) {
      const name = entries[i];
      loadedFonts.delete(name);
      // Remove the corresponding <link> element
      const encoded = name.replace(/\s+/g, "+");
      const existing = document.querySelector(`link[href*="family=${encoded}"]`);
      if (existing) existing.remove();
    }
  }

  const families = fonts
    .map((name) => {
      loadedFonts.add(name);
      return `family=${name.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800`;
    })
    .join("&");

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;

  // Handle load errors gracefully — remove failed link to allow retry
  link.onerror = () => {
    for (const name of fonts) {
      loadedFonts.delete(name);
    }
    link.remove();
  };

  document.head.appendChild(link);
}
