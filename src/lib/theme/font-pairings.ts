import type { PersonalityVector } from "./theme.types";

/* ────────────────────────────────────────────────────────────
 * Font pairing definitions + selection logic.
 * Extracted from generate-theme.ts for reuse by the
 * customization sidebar and theme derivation utilities.
 * ──────────────────────────────────────────────────────────── */

export interface FontPairing {
  id: string;
  displayName: string;
  heading: string;
  body: string;
  accent: string;
  seriousness: [number, number]; // range of axis-1 values
  era: [number, number]; // range of axis-4 (classic_modern)
  businessTypes?: string[]; // business types this pairing suits well
}

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: "luxury-serif",
    displayName: "Luxury Serif",
    heading: "'Cormorant Garamond', serif",
    body: "'Outfit', sans-serif",
    accent: "'Cormorant Garamond', serif",
    seriousness: [0.7, 1.0],
    era: [0.0, 0.4],
    businessTypes: ["restaurant", "spa"],
  },
  {
    id: "editorial-serif",
    displayName: "Editorial Serif",
    heading: "'Playfair Display', serif",
    body: "'Source Sans 3', sans-serif",
    accent: "'Playfair Display', serif",
    seriousness: [0.6, 1.0],
    era: [0.0, 0.5],
    businessTypes: ["restaurant", "photography"],
  },
  {
    id: "classic-serif",
    displayName: "Classic Serif",
    heading: "'Libre Baskerville', serif",
    body: "'Nunito Sans', sans-serif",
    accent: "'Libre Baskerville', serif",
    seriousness: [0.5, 1.0],
    era: [0.0, 0.4],
  },
  {
    id: "corporate-sans",
    displayName: "Corporate Sans",
    heading: "'Sora', sans-serif",
    body: "'DM Sans', sans-serif",
    accent: "'Sora', sans-serif",
    seriousness: [0.5, 1.0],
    era: [0.6, 1.0],
    businessTypes: ["business", "ecommerce"],
  },
  {
    id: "clean-sans",
    displayName: "Clean Sans",
    heading: "'Manrope', sans-serif",
    body: "'Karla', sans-serif",
    accent: "'Manrope', sans-serif",
    seriousness: [0.4, 0.8],
    era: [0.5, 1.0],
  },
  {
    id: "creative-display",
    displayName: "Creative Display",
    heading: "'Space Grotesk', sans-serif",
    body: "'Outfit', sans-serif",
    accent: "'Space Grotesk', sans-serif",
    seriousness: [0.0, 0.5],
    era: [0.6, 1.0],
  },
  {
    id: "warm-traditional",
    displayName: "Warm Traditional",
    heading: "'Lora', serif",
    body: "'Merriweather Sans', sans-serif",
    accent: "'Lora', serif",
    seriousness: [0.3, 0.7],
    era: [0.0, 0.5],
    businessTypes: ["nonprofit", "educational"],
  },
  {
    id: "warm-classic",
    displayName: "Warm Classic",
    heading: "'Crimson Pro', serif",
    body: "'Work Sans', sans-serif",
    accent: "'Crimson Pro', serif",
    seriousness: [0.3, 0.7],
    era: [0.0, 0.5],
    businessTypes: ["spa"],
  },
  {
    id: "bold-impact",
    displayName: "Bold Impact",
    heading: "'Oswald', sans-serif",
    body: "'Lato', sans-serif",
    accent: "'Oswald', sans-serif",
    seriousness: [0.0, 0.5],
    era: [0.4, 0.9],
    businessTypes: ["event"],
  },
  {
    id: "tech-mono",
    displayName: "Tech Mono",
    heading: "'JetBrains Mono', monospace",
    body: "'DM Sans', sans-serif",
    accent: "'JetBrains Mono', monospace",
    seriousness: [0.5, 1.0],
    era: [0.8, 1.0],
  },
  {
    id: "hospitality-serif",
    displayName: "Hospitality Serif",
    heading: "'DM Serif Display', serif",
    body: "'Jost', sans-serif",
    accent: "'DM Serif Display', serif",
    seriousness: [0.5, 0.9],
    era: [0.2, 0.6],
    businessTypes: ["restaurant", "booking", "event"],
  },
  {
    id: "wellness-organic",
    displayName: "Wellness Organic",
    heading: "'Fraunces', serif",
    body: "'Atkinson Hyperlegible', sans-serif",
    accent: "'Fraunces', serif",
    seriousness: [0.3, 0.7],
    era: [0.2, 0.6],
    businessTypes: ["spa", "nonprofit"],
  },
  {
    id: "creative-agency",
    displayName: "Creative Agency",
    heading: "'Clash Display', sans-serif",
    body: "'Satoshi', sans-serif",
    accent: "'Clash Display', sans-serif",
    seriousness: [0.0, 0.5],
    era: [0.7, 1.0],
    businessTypes: ["portfolio", "photography"],
  },
  {
    id: "boutique-fashion",
    displayName: "Boutique Fashion",
    heading: "'Bodoni Moda', serif",
    body: "'Figtree', sans-serif",
    accent: "'Bodoni Moda', serif",
    seriousness: [0.6, 1.0],
    era: [0.1, 0.5],
    businessTypes: ["ecommerce", "portfolio"],
  },
];

/* ────────────────────────────────────────────────────────────
 * Free tier: 5 pairings available to all users.
 * AI-selected default is always free + 4 curated picks.
 * ──────────────────────────────────────────────────────────── */

export const FREE_FONT_IDS: Set<string> = new Set([
  "corporate-sans",
  "clean-sans",
  "warm-traditional",
  "creative-display",
  "classic-serif",
]);

/* ────────────────────────────────────────────────────────────
 * Lookup utilities
 * ──────────────────────────────────────────────────────────── */

export function getFontPairingById(id: string): FontPairing | undefined {
  return FONT_PAIRINGS.find((fp) => fp.id === id);
}

/** Pick the best font pairing for the given personality + optional business type. */
export function selectFontPairing(pv: PersonalityVector, businessType?: string): FontPairing {
  const seriousness = pv[1];
  const era = pv[4];

  let best = FONT_PAIRINGS[0];
  let bestScore = -Infinity;

  for (const pairing of FONT_PAIRINGS) {
    const sMid = (pairing.seriousness[0] + pairing.seriousness[1]) / 2;
    const eMid = (pairing.era[0] + pairing.era[1]) / 2;

    const sInRange = seriousness >= pairing.seriousness[0] && seriousness <= pairing.seriousness[1];
    const eInRange = era >= pairing.era[0] && era <= pairing.era[1];

    let score =
      (sInRange ? 2 : 0) + (eInRange ? 2 : 0) - Math.abs(seriousness - sMid) - Math.abs(era - eMid);

    if (businessType && pairing.businessTypes?.includes(businessType)) {
      score += 1.5;
    }

    if (score > bestScore) {
      bestScore = score;
      best = pairing;
    }
  }

  return best;
}
