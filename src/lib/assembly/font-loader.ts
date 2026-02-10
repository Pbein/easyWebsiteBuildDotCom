const loadedFonts = new Set<string>();

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

  const families = fonts
    .map((name) => {
      loadedFonts.add(name);
      return `family=${name.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800`;
    })
    .join("&");

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  document.head.appendChild(link);
}
