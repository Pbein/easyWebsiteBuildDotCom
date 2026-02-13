"use node";

/**
 * Stock photo search module — multi-provider with fallback chain.
 * Providers: Unsplash → Pexels → Pixabay
 *
 * Runs inside Convex Node.js actions. API keys come from Convex env vars.
 */

/* ────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────── */

export interface StockPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  attribution?: {
    photographer?: string;
    source?: string;
    url?: string;
  };
}

export interface SearchOptions {
  query: string;
  count?: number;
  orientation?: "landscape" | "portrait" | "square";
  color?: string; // hex color for filtering (e.g. "#e8a849")
}

interface ProviderEnv {
  unsplash?: string;
  pexels?: string;
  pixabay?: string;
}

/* ────────────────────────────────────────────────────────────
 * Unsplash API
 * ──────────────────────────────────────────────────────────── */

async function searchUnsplash(options: SearchOptions, apiKey: string): Promise<StockPhoto[]> {
  const params = new URLSearchParams({
    query: options.query,
    per_page: String(options.count || 5),
    orientation: options.orientation || "landscape",
  });
  if (options.color) {
    // Unsplash supports named colors; extract closest match
    params.set("color", mapHexToUnsplashColor(options.color));
  }

  const res = await fetch(`https://api.unsplash.com/search/photos?${params.toString()}`, {
    headers: { Authorization: `Client-ID ${apiKey}` },
  });

  if (!res.ok) {
    throw new Error(`Unsplash API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as {
    results: Array<{
      id: string;
      description: string | null;
      alt_description: string | null;
      width: number;
      height: number;
      blur_hash: string | null;
      urls: { raw: string; full: string; regular: string; small: string; thumb: string };
      user: { name: string; links: { html: string } };
      links: { html: string };
    }>;
  };

  return data.results.map((photo) => ({
    src: `${photo.urls.raw}&w=1200&h=800&fit=crop&fm=webp&q=80`,
    alt: photo.alt_description || photo.description || options.query,
    width: 1200,
    height: 800,
    blurDataURL: photo.urls.thumb,
    attribution: {
      photographer: photo.user.name,
      source: "Unsplash",
      url: photo.links.html,
    },
  }));
}

/**
 * Unsplash color filter supports: black_and_white, black, white, yellow,
 * orange, red, purple, magenta, green, teal, blue
 */
function mapHexToUnsplashColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const hue = rgbToHue(r, g, b);
  const saturation = rgbToSaturation(r, g, b);
  const lightness = (r + g + b) / 3 / 255;

  if (saturation < 0.1) {
    if (lightness < 0.3) return "black";
    if (lightness > 0.8) return "white";
    return "black_and_white";
  }

  if (hue < 15) return "red";
  if (hue < 45) return "orange";
  if (hue < 70) return "yellow";
  if (hue < 160) return "green";
  if (hue < 200) return "teal";
  if (hue < 260) return "blue";
  if (hue < 290) return "purple";
  if (hue < 340) return "magenta";
  return "red";
}

/* ────────────────────────────────────────────────────────────
 * Pexels API
 * ──────────────────────────────────────────────────────────── */

async function searchPexels(options: SearchOptions, apiKey: string): Promise<StockPhoto[]> {
  const params = new URLSearchParams({
    query: options.query,
    per_page: String(options.count || 5),
    orientation: options.orientation || "landscape",
  });
  if (options.color) {
    // Pexels supports hex color filtering (without #)
    params.set("color", options.color.replace("#", ""));
  }

  const res = await fetch(`https://api.pexels.com/v1/search?${params.toString()}`, {
    headers: { Authorization: apiKey },
  });

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as {
    photos: Array<{
      id: number;
      alt: string | null;
      width: number;
      height: number;
      photographer: string;
      photographer_url: string;
      url: string;
      src: {
        original: string;
        large2x: string;
        large: string;
        medium: string;
        small: string;
        tiny: string;
      };
    }>;
  };

  return data.photos.map((photo) => ({
    src: photo.src.large2x,
    alt: photo.alt || options.query,
    width: 1200,
    height: 800,
    blurDataURL: photo.src.tiny,
    attribution: {
      photographer: photo.photographer,
      source: "Pexels",
      url: photo.url,
    },
  }));
}

/* ────────────────────────────────────────────────────────────
 * Pixabay API
 * ──────────────────────────────────────────────────────────── */

async function searchPixabay(options: SearchOptions, apiKey: string): Promise<StockPhoto[]> {
  const orientationMap: Record<string, string> = {
    landscape: "horizontal",
    portrait: "vertical",
    square: "all",
  };

  const params = new URLSearchParams({
    key: apiKey,
    q: options.query,
    per_page: String(options.count || 5),
    orientation: orientationMap[options.orientation || "landscape"] || "horizontal",
    image_type: "photo",
    safesearch: "true",
  });
  if (options.color) {
    // Pixabay supports named colors
    params.set("colors", mapHexToPixabayColor(options.color));
  }

  const res = await fetch(`https://pixabay.com/api/?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Pixabay API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as {
    hits: Array<{
      id: number;
      tags: string;
      webformatURL: string;
      largeImageURL: string;
      imageWidth: number;
      imageHeight: number;
      previewURL: string;
      pageURL: string;
      user: string;
    }>;
  };

  return data.hits.map((hit) => ({
    src: hit.largeImageURL,
    alt: hit.tags || options.query,
    width: hit.imageWidth,
    height: hit.imageHeight,
    blurDataURL: hit.previewURL,
    attribution: {
      photographer: hit.user,
      source: "Pixabay",
      url: hit.pageURL,
    },
  }));
}

/**
 * Pixabay supports: grayscale, transparent, red, orange, yellow, green,
 * turquoise, blue, lilac, pink, white, gray, black, brown
 */
function mapHexToPixabayColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const hue = rgbToHue(r, g, b);
  const saturation = rgbToSaturation(r, g, b);
  const lightness = (r + g + b) / 3 / 255;

  if (saturation < 0.1) {
    if (lightness < 0.2) return "black";
    if (lightness < 0.5) return "gray";
    if (lightness > 0.85) return "white";
    return "gray";
  }

  if (hue < 15) return "red";
  if (hue < 40) return "orange";
  if (hue < 70) return "yellow";
  if (hue < 165) return "green";
  if (hue < 200) return "turquoise";
  if (hue < 260) return "blue";
  if (hue < 300) return "lilac";
  if (hue < 345) return "pink";
  return "red";
}

/* ────────────────────────────────────────────────────────────
 * Color utilities (inlined — Convex cannot import from src/)
 * ──────────────────────────────────────────────────────────── */

function rgbToHue(r: number, g: number, b: number): number {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  if (delta === 0) return 0;

  let hue = 0;
  if (max === rn) hue = ((gn - bn) / delta) % 6;
  else if (max === gn) hue = (bn - rn) / delta + 2;
  else hue = (rn - gn) / delta + 4;

  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;
  return hue;
}

function rgbToSaturation(r: number, g: number, b: number): number {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  if (max === 0) return 0;
  return (max - min) / max;
}

/* ────────────────────────────────────────────────────────────
 * Multi-provider search with fallback chain
 * ──────────────────────────────────────────────────────────── */

export async function searchStockPhotos(
  options: SearchOptions,
  env: ProviderEnv
): Promise<StockPhoto[]> {
  const providers: Array<{
    name: string;
    key: string | undefined;
    fn: (opts: SearchOptions, key: string) => Promise<StockPhoto[]>;
  }> = [
    { name: "Unsplash", key: env.unsplash, fn: searchUnsplash },
    { name: "Pexels", key: env.pexels, fn: searchPexels },
    { name: "Pixabay", key: env.pixabay, fn: searchPixabay },
  ];

  for (const provider of providers) {
    if (!provider.key) continue;
    try {
      const results = await provider.fn(options, provider.key);
      if (results.length > 0) {
        return results;
      }
      // Empty results — try next provider
    } catch (err) {
      console.warn(
        `[imageSearch] ${provider.name} failed:`,
        err instanceof Error ? err.message : err
      );
      // Continue to next provider
    }
  }

  // All providers failed or no keys configured — return empty
  return [];
}

/* ────────────────────────────────────────────────────────────
 * Context-aware keyword builder
 * ──────────────────────────────────────────────────────────── */

interface KeywordContext {
  componentType: string; // e.g. "hero-split", "team-grid", "content-split"
  businessType: string; // siteType from intake
  subType: string; // inferred sub-type (e.g. "restaurant", "spa")
  businessName: string;
  description: string;
  emotionalGoals?: string[];
  sectionContext?: string; // e.g. section headline or purpose
}

/** Industry-specific subject keywords for enhanced search relevance */
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  restaurant: [
    "restaurant interior",
    "dining table setup",
    "gourmet food plating",
    "chef kitchen",
    "warm ambient restaurant",
  ],
  bakery: [
    "artisan bakery",
    "fresh bread sourdough",
    "pastry display case",
    "rustic bakery interior",
    "baking kitchen warm",
  ],
  spa: [
    "spa wellness interior",
    "massage therapy room",
    "serene relaxation space",
    "luxury spa treatment",
    "natural wellness zen",
  ],
  photography: [
    "photography studio",
    "professional camera lens",
    "portrait session natural light",
    "creative photography workspace",
    "photo editing studio",
  ],
  fitness: [
    "modern gym equipment",
    "fitness training floor",
    "athletic workout space",
    "personal training session",
    "gym interior professional",
  ],
  gym: [
    "modern gym floor",
    "weight training equipment",
    "fitness center interior",
    "athletic training space",
    "crossfit workout gym",
  ],
  tech: [
    "modern tech office",
    "startup workspace",
    "team collaboration technology",
    "sleek office interior",
    "software development workspace",
  ],
  startup: [
    "startup office modern",
    "tech team collaboration",
    "innovation workspace",
    "modern office meeting",
    "creative tech workspace",
  ],
  business: [
    "professional office",
    "corporate workspace modern",
    "business meeting room",
    "professional team office",
    "modern business interior",
  ],
  portfolio: [
    "creative workspace",
    "design studio",
    "artist workspace",
    "creative professional desk",
    "modern design office",
  ],
  creative: [
    "creative studio space",
    "artist workshop colorful",
    "design studio modern",
    "creative professional workspace",
    "art studio inspiration",
  ],
  ecommerce: [
    "product display modern",
    "online shopping lifestyle",
    "product photography setup",
    "retail merchandise display",
    "ecommerce product styling",
  ],
  educational: [
    "modern classroom learning",
    "education workshop",
    "training seminar professional",
    "student learning space",
    "educational institution campus",
  ],
  nonprofit: [
    "community volunteer work",
    "nonprofit team helping",
    "charitable organization people",
    "community impact positive",
    "social good teamwork",
  ],
  event: [
    "event venue decorated",
    "conference event setup",
    "celebration party venue",
    "corporate event space",
    "event planning decorations",
  ],
  landing: [
    "modern product showcase",
    "professional business scene",
    "lifestyle product context",
    "clean modern workspace",
    "professional lifestyle",
  ],
  personal: [
    "professional headshot",
    "personal brand lifestyle",
    "freelancer workspace modern",
    "independent professional",
    "personal office creative",
  ],
  booking: [
    "appointment scheduling",
    "professional consultation room",
    "modern service reception",
    "booking service interior",
    "client consultation space",
  ],
};

/** Mood qualifiers from emotional goals */
const MOOD_QUALIFIERS: Record<string, string> = {
  welcoming: "warm inviting friendly atmosphere",
  luxury: "luxury premium elegant refined",
  trust: "professional reliable trustworthy",
  excitement: "dynamic vibrant energetic bold",
  calm: "serene peaceful tranquil soothing",
  innovation: "modern innovative cutting-edge futuristic",
  nostalgia: "vintage classic timeless traditional",
  empowerment: "strong confident powerful bold",
  community: "together community gathering people",
  curiosity: "creative discovery exploration interesting",
};

/** Composition qualifiers based on component type */
const COMPOSITION_QUALIFIERS: Record<string, string> = {
  "hero-split": "wide shot editorial professional",
  "hero-centered": "atmospheric wide panoramic background",
  "content-split": "detail shot editorial professional",
  "team-grid": "professional headshot portrait natural",
  "media-gallery": "editorial portfolio curated",
  "proof-beforeafter": "comparison transformation result",
  "commerce-services": "professional service product",
  "content-timeline": "professional business milestone",
};

export function buildSearchKeywords(context: KeywordContext): string {
  const parts: string[] = [];

  // 1. Industry-specific subject keywords
  const industryKeys =
    INDUSTRY_KEYWORDS[context.subType] ||
    INDUSTRY_KEYWORDS[context.businessType] ||
    INDUSTRY_KEYWORDS.business;
  // Pick the most relevant industry keyword (first one is best general match)
  parts.push(industryKeys[0]);

  // 2. Component-specific composition
  const composition = COMPOSITION_QUALIFIERS[context.componentType];
  if (composition) {
    parts.push(composition);
  }

  // 3. Mood from emotional goals
  if (context.emotionalGoals?.length) {
    const moodParts = context.emotionalGoals
      .slice(0, 2)
      .map((goal) => MOOD_QUALIFIERS[goal])
      .filter(Boolean);
    if (moodParts.length > 0) {
      parts.push(moodParts[0]);
    }
  }

  // 4. Section context (e.g. headline keywords)
  if (context.sectionContext) {
    // Extract meaningful words from section context, skip common words
    const skipWords = new Set([
      "the",
      "a",
      "an",
      "is",
      "are",
      "our",
      "your",
      "we",
      "us",
      "and",
      "or",
      "for",
      "to",
      "of",
      "in",
      "on",
      "at",
      "by",
      "with",
      "from",
      "why",
      "how",
      "what",
      "choose",
      "meet",
    ]);
    const contextWords = context.sectionContext
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !skipWords.has(w))
      .slice(0, 3);
    if (contextWords.length > 0) {
      parts.push(contextWords.join(" "));
    }
  }

  // Join and truncate to reasonable length for API queries
  return parts.join(" ").slice(0, 200).trim();
}

/* ────────────────────────────────────────────────────────────
 * Team photo search (separate — needs portrait orientation)
 * ──────────────────────────────────────────────────────────── */

/** Build search query for team member headshots */
export function buildTeamPhotoKeywords(role: string, subType: string): string {
  const roleKeywords: Record<string, string> = {
    // Restaurant
    "executive chef": "professional chef kitchen portrait",
    "sous chef": "chef kitchen portrait professional",
    "head sommelier": "sommelier wine professional portrait",
    "restaurant manager": "restaurant manager professional portrait",
    "pastry chef": "pastry chef kitchen portrait professional",
    // Spa
    "lead therapist": "massage therapist professional portrait wellness",
    esthetician: "skincare professional portrait wellness",
    "wellness director": "wellness professional portrait spa",
    // Photography
    "lead photographer": "photographer professional portrait creative",
    "second shooter": "photographer assistant creative portrait",
    "photo editor": "creative professional portrait editing",
    // General
    founder: "professional business portrait headshot",
    ceo: "executive professional portrait headshot",
    "creative director": "creative professional portrait modern",
    "marketing director": "marketing professional portrait modern",
    "lead developer": "tech professional portrait modern",
    designer: "creative designer professional portrait",
  };

  const roleLower = role.toLowerCase();
  for (const [key, query] of Object.entries(roleKeywords)) {
    if (roleLower.includes(key)) return query;
  }

  // Fallback: generic professional headshot with industry context
  const industryContext: Record<string, string> = {
    restaurant: "hospitality",
    spa: "wellness",
    photography: "creative",
    fitness: "athletic",
    tech: "technology",
    startup: "technology",
  };
  const industry = industryContext[subType] || "business";
  return `professional ${industry} headshot portrait`;
}

/* ────────────────────────────────────────────────────────────
 * Gallery image search (separate — needs varied queries)
 * ──────────────────────────────────────────────────────────── */

/** Build multiple search queries for gallery images (variety) */
export function buildGalleryKeywords(subType: string, description: string): string[] {
  const galleryQueries: Record<string, string[]> = {
    restaurant: [
      "gourmet food plating elegant",
      "restaurant interior ambiance dining",
      "chef preparing dish kitchen",
      "cocktail bar drinks presentation",
    ],
    bakery: [
      "artisan bread sourdough rustic",
      "decorated cakes pastry display",
      "bakery interior warm inviting",
      "fresh baked goods close-up",
    ],
    spa: [
      "spa treatment room serene",
      "wellness products arrangement natural",
      "relaxation pool zen garden",
      "massage therapy hands professional",
    ],
    photography: [
      "professional portrait session natural",
      "wedding photography couple romantic",
      "product photography studio setup",
      "landscape photography scenic dramatic",
    ],
    fitness: [
      "gym workout training intense",
      "group fitness class energy",
      "personal training session professional",
      "modern gym equipment facility",
    ],
    creative: [
      "design studio creative workspace",
      "artwork portfolio display gallery",
      "creative process design detail",
      "modern art installation color",
    ],
  };

  return (
    galleryQueries[subType] || [
      `${subType || "professional"} business interior`,
      `${subType || "professional"} service detail`,
      `${subType || "professional"} team working`,
      `professional business ${description.split(" ").slice(0, 3).join(" ")}`,
    ]
  );
}

/* ────────────────────────────────────────────────────────────
 * Cache key generation
 * ──────────────────────────────────────────────────────────── */

/** Simple hash for cache key from query + orientation + color */
export function generateCacheKey(options: SearchOptions): string {
  const raw = `${options.query}|${options.orientation || "landscape"}|${options.color || ""}`;
  // Simple djb2 hash
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash * 33) ^ raw.charCodeAt(i);
  }
  return `img_${(hash >>> 0).toString(36)}`;
}
