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

export interface AutoFix {
  componentRef: string;
  field: string;
  original: string;
  replacement: string;
  rule: string;
}

export interface FixResult {
  spec: SiteIntentDocument;
  fixes: AutoFix[];
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

/* ────────────────────────────────────────────────────────────
 * Vocabulary replacement maps per sub-type
 * ──────────────────────────────────────────────────────────── */

const VOCAB_REPLACEMENTS: Record<string, Array<{ pattern: RegExp; replacement: string }>> = {
  restaurant: [
    { pattern: /\bappointment\b/gi, replacement: "reservation" },
    { pattern: /\bsession\b/gi, replacement: "dining experience" },
    { pattern: /\btreatment\b/gi, replacement: "course" },
    { pattern: /\bconsultation\b/gi, replacement: "reservation" },
    { pattern: /\btherapist\b/gi, replacement: "chef" },
    { pattern: /\besthetician\b/gi, replacement: "sommelier" },
  ],
  spa: [
    { pattern: /\breservation\b/gi, replacement: "appointment" },
    { pattern: /\btable for\b/gi, replacement: "session for" },
    { pattern: /\bfood menu\b/gi, replacement: "treatment menu" },
    { pattern: /\bentrée\b/gi, replacement: "treatment" },
    { pattern: /\bappetizer\b/gi, replacement: "add-on" },
    { pattern: /\bchef\b/gi, replacement: "therapist" },
    { pattern: /\bsous chef\b/gi, replacement: "lead therapist" },
    { pattern: /\bsommelier\b/gi, replacement: "wellness advisor" },
  ],
  photography: [
    { pattern: /\bappointment\b/gi, replacement: "session" },
    { pattern: /\btreatment\b/gi, replacement: "shoot" },
    { pattern: /\btherapist\b/gi, replacement: "photographer" },
    { pattern: /\breservation\b/gi, replacement: "booking" },
    { pattern: /\bentrée\b/gi, replacement: "package" },
    { pattern: /\besthetician\b/gi, replacement: "photo editor" },
  ],
};

/** Generic headline replacements per sub-type. */
const HEADLINE_REPLACEMENTS: Record<string, Array<{ pattern: RegExp; replacement: string }>> = {
  restaurant: [
    { pattern: /\bServices & Treatments\b/gi, replacement: "Our Menu" },
    { pattern: /\bOur Services\b/gi, replacement: "Our Menu" },
    { pattern: /\bSchedule a Consultation\b/gi, replacement: "Reserve a Table" },
    { pattern: /\bBook an Appointment\b/gi, replacement: "Reserve a Table" },
    { pattern: /\bBook Your Appointment\b/gi, replacement: "Reserve Your Table" },
  ],
  spa: [
    { pattern: /\bOur Menu\b/gi, replacement: "Our Treatments" },
    { pattern: /\bReserve a Table\b/gi, replacement: "Book a Treatment" },
  ],
  photography: [
    { pattern: /\bServices & Treatments\b/gi, replacement: "Our Work" },
    { pattern: /\bOur Services\b/gi, replacement: "Our Portfolio" },
    { pattern: /\bSchedule a Consultation\b/gi, replacement: "Book a Session" },
    { pattern: /\bBook an Appointment\b/gi, replacement: "Book a Session" },
  ],
};

/** Team role replacements per sub-type. */
const ROLE_REPLACEMENTS: Record<string, Array<{ pattern: RegExp; replacement: string }>> = {
  restaurant: [
    { pattern: /\bFounder & CEO\b/gi, replacement: "Executive Chef" },
    { pattern: /\bCEO\b/gi, replacement: "Executive Chef" },
    { pattern: /\bCreative Director\b/gi, replacement: "Sous Chef" },
    { pattern: /\bCTO\b/gi, replacement: "Head Sommelier" },
    { pattern: /\bCOO\b/gi, replacement: "Restaurant Manager" },
  ],
  spa: [
    { pattern: /\bFounder & CEO\b/gi, replacement: "Lead Therapist" },
    { pattern: /\bCEO\b/gi, replacement: "Wellness Director" },
    { pattern: /\bCreative Director\b/gi, replacement: "Senior Esthetician" },
  ],
  photography: [
    { pattern: /\bFounder & CEO\b/gi, replacement: "Lead Photographer" },
    { pattern: /\bCEO\b/gi, replacement: "Lead Photographer" },
    { pattern: /\bCreative Director\b/gi, replacement: "Studio Director" },
  ],
};

/* ────────────────────────────────────────────────────────────
 * Auto-fix function
 * ──────────────────────────────────────────────────────────── */

/** Deep-clone a spec so the original is never mutated. */
function cloneSpec(spec: SiteIntentDocument): SiteIntentDocument {
  return JSON.parse(JSON.stringify(spec)) as SiteIntentDocument;
}

/**
 * Apply a set of regex replacements to all string values in a content object.
 * Returns the number of replacements made.
 */
function applyReplacements(
  content: Record<string, unknown>,
  replacements: Array<{ pattern: RegExp; replacement: string }>,
  componentRef: string,
  fieldPrefix: string,
  fixes: AutoFix[],
  rule: string
): void {
  for (const [key, value] of Object.entries(content)) {
    if (typeof value === "string") {
      let current = value;
      for (const { pattern, replacement } of replacements) {
        const newPattern = new RegExp(pattern.source, pattern.flags);
        if (newPattern.test(current)) {
          const original = current;
          current = current.replace(pattern, replacement);
          fixes.push({
            componentRef,
            field: fieldPrefix ? `${fieldPrefix}.${key}` : key,
            original,
            replacement: current,
            rule,
          });
        }
      }
      if (current !== value) {
        content[key] = current;
      }
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] === "object" && value[i] !== null) {
          applyReplacements(
            value[i] as Record<string, unknown>,
            replacements,
            componentRef,
            `${key}[${i}]`,
            fixes,
            rule
          );
        } else if (typeof value[i] === "string") {
          let current = value[i] as string;
          for (const { pattern, replacement } of replacements) {
            const newPattern = new RegExp(pattern.source, pattern.flags);
            if (newPattern.test(current)) {
              const original = current;
              current = current.replace(pattern, replacement);
              fixes.push({
                componentRef,
                field: `${key}[${i}]`,
                original,
                replacement: current,
                rule,
              });
            }
          }
          if (current !== (value[i] as string)) {
            value[i] = current;
          }
        }
      }
    } else if (typeof value === "object" && value !== null) {
      applyReplacements(
        value as Record<string, unknown>,
        replacements,
        componentRef,
        fieldPrefix ? `${fieldPrefix}.${key}` : key,
        fixes,
        rule
      );
    }
  }
}

/**
 * Auto-fix common content mismatches in a SiteIntentDocument.
 *
 * Returns both the corrected spec and a log of all fixes applied.
 * The original spec is never mutated.
 */
export function fixSpecContent(
  spec: SiteIntentDocument,
  context: { description: string; siteType: string }
): FixResult {
  const fixed = cloneSpec(spec);
  const fixes: AutoFix[] = [];
  const subType = inferSubType(context.siteType, context.description);

  const vocabReplacements = VOCAB_REPLACEMENTS[subType];
  const headlineReplacements = HEADLINE_REPLACEMENTS[subType];
  const roleReplacements = ROLE_REPLACEMENTS[subType];

  for (const page of fixed.pages) {
    for (const comp of page.components) {
      const ref = `${comp.componentId}[${comp.order}]`;
      const content = comp.content as Record<string, unknown>;

      // Fix 1: Business name in logoText
      if (comp.componentId === "nav-sticky" || comp.componentId === "footer-standard") {
        const logoText = content.logoText;
        if (
          typeof logoText === "string" &&
          !logoText.toLowerCase().includes(fixed.businessName.toLowerCase())
        ) {
          fixes.push({
            componentRef: ref,
            field: "logoText",
            original: logoText,
            replacement: fixed.businessName,
            rule: "business-name",
          });
          content.logoText = fixed.businessName;
        }
      }

      // Fix 2: Headline replacements (generic → sub-type-specific)
      if (headlineReplacements) {
        applyReplacements(content, headlineReplacements, ref, "", fixes, "headline-swap");
      }

      // Fix 3: Team role replacements
      if (roleReplacements && comp.componentId === "team-grid") {
        const members = content.members;
        if (Array.isArray(members)) {
          for (let i = 0; i < members.length; i++) {
            const member = members[i] as Record<string, unknown>;
            if (typeof member.role === "string") {
              let role = member.role;
              for (const { pattern, replacement } of roleReplacements) {
                const newPattern = new RegExp(pattern.source, pattern.flags);
                if (newPattern.test(role)) {
                  const original = role;
                  role = role.replace(pattern, replacement);
                  fixes.push({
                    componentRef: ref,
                    field: `members[${i}].role`,
                    original,
                    replacement: role,
                    rule: "role-swap",
                  });
                }
              }
              if (role !== member.role) {
                member.role = role;
              }
            }
          }
        }
      }

      // Fix 4: General vocabulary replacements
      if (vocabReplacements) {
        applyReplacements(content, vocabReplacements, ref, "", fixes, "vocab-swap");
      }

      // Fix 5: content-stats string → number conversion
      if (comp.componentId === "content-stats") {
        const stats = content.stats;
        if (Array.isArray(stats)) {
          for (let i = 0; i < stats.length; i++) {
            const stat = stats[i] as Record<string, unknown>;
            if (typeof stat.value === "string") {
              const numVal = parseFloat(stat.value);
              if (!isNaN(numVal)) {
                fixes.push({
                  componentRef: ref,
                  field: `stats[${i}].value`,
                  original: stat.value,
                  replacement: String(numVal),
                  rule: "type-coerce",
                });
                stat.value = numVal;
              }
            }
          }
        }
      }
    }
  }

  return { spec: fixed, fixes, subType };
}
