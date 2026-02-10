/**
 * Content validator for SiteIntentDocument specs.
 *
 * Pure function with zero external dependencies — importable from both
 * client code and Convex actions (via inline copy).
 */

import type { SiteIntentDocument } from "./spec.types";

/* ────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────── */

export interface ValidationWarning {
  severity: "error" | "warning";
  componentRef?: string;
  field?: string;
  message: string;
  suggestion?: string;
}

export interface ValidationResult {
  warnings: ValidationWarning[];
  subType: string;
}

/* ────────────────────────────────────────────────────────────
 * Sub-type keyword sets (mirrors generateSiteSpec.ts)
 * ──────────────────────────────────────────────────────────── */

const SUB_TYPE_KEYWORDS: Record<string, string[]> = {
  restaurant: [
    "restaurant",
    "dining",
    "menu",
    "chef",
    "cuisine",
    "food",
    "bistro",
    "cafe",
    "eatery",
    "kitchen",
    "grill",
    "diner",
    "steakhouse",
    "sushi",
    "pizzeria",
    "trattoria",
    "brasserie",
    "gastropub",
    "fine dining",
    "brunch",
    "catering",
    "taqueria",
    "bakery",
    "patisserie",
  ],
  spa: [
    "spa",
    "massage",
    "wellness",
    "treatment",
    "facial",
    "skincare",
    "relaxation",
    "aromatherapy",
    "body wrap",
    "hot stone",
    "reflexology",
    "detox",
    "sauna",
    "steam room",
    "hydrotherapy",
    "day spa",
    "med spa",
  ],
  photography: [
    "photo",
    "photographer",
    "photography",
    "shoot",
    "portrait",
    "wedding photo",
    "headshot",
    "studio photo",
    "editorial photo",
    "newborn photo",
    "family photo",
    "event photo",
    "commercial photo",
  ],
};

function inferSubType(siteType: string, description: string): string {
  const lower = description.toLowerCase();
  for (const [subType, keywords] of Object.entries(SUB_TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return subType;
    }
  }
  return siteType;
}

/* ────────────────────────────────────────────────────────────
 * Vocabulary blacklists — terms that should NOT appear for a given sub-type
 * ──────────────────────────────────────────────────────────── */

const VOCAB_BLACKLIST: Record<string, string[]> = {
  restaurant: [
    "appointment",
    "session",
    "treatment",
    "ceo",
    "creative director",
    "consultation",
    "therapist",
    "esthetician",
  ],
  spa: [
    "reservation",
    "table for",
    "food menu",
    "entrée",
    "appetizer",
    "chef",
    "sous chef",
    "sommelier",
  ],
  photography: [
    "appointment",
    "treatment",
    "therapist",
    "reservation",
    "table",
    "entrée",
    "esthetician",
  ],
};

/* ────────────────────────────────────────────────────────────
 * Vocabulary whitelists — at least ONE term should appear for a given sub-type
 * ──────────────────────────────────────────────────────────── */

const VOCAB_WHITELIST: Record<string, string[]> = {
  restaurant: [
    "menu",
    "dine",
    "dining",
    "table",
    "reservation",
    "chef",
    "cuisine",
    "dish",
    "course",
    "plate",
    "kitchen",
    "flavor",
    "taste",
    "entrée",
    "appetizer",
    "dessert",
  ],
  spa: [
    "treatment",
    "wellness",
    "relax",
    "rejuvenate",
    "massage",
    "facial",
    "therapy",
    "sanctuary",
    "soothe",
    "calm",
    "skin",
    "body",
  ],
  photography: [
    "photo",
    "portrait",
    "shoot",
    "session",
    "capture",
    "lens",
    "frame",
    "gallery",
    "portfolio",
    "image",
    "moment",
  ],
};

/* ────────────────────────────────────────────────────────────
 * Generic placeholder phrases that should be flagged
 * ──────────────────────────────────────────────────────────── */

const GENERIC_PHRASES: Array<{ phrase: string; notForSubTypes?: string[] }> = [
  { phrase: "building something remarkable together" },
  { phrase: "services & treatments", notForSubTypes: ["spa"] },
  { phrase: "schedule a consultation", notForSubTypes: ["business"] },
  { phrase: "welcome to our" },
  { phrase: "lorem ipsum" },
  { phrase: "your trusted partner" },
  { phrase: "we are committed to excellence" },
];

/* ────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────── */

/** Recursively collect all string values from a component content object. */
function collectStrings(obj: unknown): string[] {
  if (typeof obj === "string") return [obj];
  if (Array.isArray(obj)) return obj.flatMap(collectStrings);
  if (obj && typeof obj === "object") {
    return Object.values(obj as Record<string, unknown>).flatMap(collectStrings);
  }
  return [];
}

/* ────────────────────────────────────────────────────────────
 * Main validator
 * ──────────────────────────────────────────────────────────── */

export function validateSpecContent(
  spec: SiteIntentDocument,
  context: { description: string; siteType: string }
): ValidationResult {
  const warnings: ValidationWarning[] = [];
  const subType = inferSubType(context.siteType, context.description);

  // Collect all string content from every component
  const allComponentStrings: string[] = [];
  for (const page of spec.pages) {
    for (const comp of page.components) {
      allComponentStrings.push(...collectStrings(comp.content));
    }
  }
  const joinedContent = allComponentStrings.join(" ").toLowerCase();

  // ── Rule 1: Generic placeholder detection ──────────────────
  for (const { phrase, notForSubTypes } of GENERIC_PHRASES) {
    if (notForSubTypes?.includes(subType)) continue;
    if (joinedContent.includes(phrase.toLowerCase())) {
      warnings.push({
        severity: "warning",
        message: `Generic placeholder detected: "${phrase}"`,
        suggestion: `Replace with content specific to ${spec.businessName} / ${subType}`,
      });
    }
  }

  // ── Rule 2: Business name presence ─────────────────────────
  const nameLower = spec.businessName.toLowerCase();
  let foundNameInNavOrFooter = false;
  for (const page of spec.pages) {
    for (const comp of page.components) {
      if (comp.componentId === "nav-sticky" || comp.componentId === "footer-standard") {
        const logoText = (comp.content as Record<string, unknown>)?.logoText;
        if (typeof logoText === "string" && logoText.toLowerCase().includes(nameLower)) {
          foundNameInNavOrFooter = true;
        }
      }
    }
  }
  if (!foundNameInNavOrFooter) {
    warnings.push({
      severity: "error",
      field: "logoText",
      message: `Business name "${spec.businessName}" not found in nav or footer logoText`,
      suggestion: `Set logoText to "${spec.businessName}" in nav-sticky and footer-standard`,
    });
  }

  // ── Rule 3: Vocabulary blacklist per sub-type ──────────────
  const blacklist = VOCAB_BLACKLIST[subType];
  if (blacklist) {
    for (const term of blacklist) {
      if (joinedContent.includes(term.toLowerCase())) {
        // Find which component contains it
        let componentRef: string | undefined;
        for (const page of spec.pages) {
          for (const comp of page.components) {
            const compStrings = collectStrings(comp.content).join(" ").toLowerCase();
            if (compStrings.includes(term.toLowerCase())) {
              componentRef = `${comp.componentId}[${comp.order}]`;
              break;
            }
          }
          if (componentRef) break;
        }
        warnings.push({
          severity: "warning",
          componentRef,
          message: `"${term}" is inappropriate vocabulary for a ${subType} site`,
          suggestion: `Replace with ${subType}-specific terminology`,
        });
      }
    }
  }

  // ── Rule 4: Vocabulary whitelist per sub-type ──────────────
  const whitelist = VOCAB_WHITELIST[subType];
  if (whitelist) {
    const hasAny = whitelist.some((term) => joinedContent.includes(term.toLowerCase()));
    if (!hasAny) {
      warnings.push({
        severity: "warning",
        message: `No ${subType}-specific vocabulary found in content (expected at least one of: ${whitelist.slice(0, 5).join(", ")}, ...)`,
        suggestion: `Add industry-specific language for ${subType}`,
      });
    }
  }

  // ── Rule 5: Content field type checks ──────────────────────
  for (const page of spec.pages) {
    for (const comp of page.components) {
      if (comp.componentId === "content-stats") {
        const stats = (comp.content as Record<string, unknown>)?.stats;
        if (Array.isArray(stats)) {
          for (const stat of stats as Array<Record<string, unknown>>) {
            if (typeof stat.value === "string") {
              warnings.push({
                severity: "error",
                componentRef: `content-stats[${comp.order}]`,
                field: "stats[].value",
                message: `content-stats value should be a number, got string: "${stat.value}"`,
                suggestion: "Convert value to a numeric type",
              });
            }
          }
        }
      }
    }
  }

  return { warnings, subType };
}
