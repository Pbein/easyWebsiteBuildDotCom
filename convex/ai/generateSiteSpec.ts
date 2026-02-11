"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";

interface ComponentPlacement {
  componentId: string;
  variant: string;
  order: number;
  content: Record<string, unknown>;
}

interface PageSpec {
  slug: string;
  title: string;
  purpose: string;
  components: ComponentPlacement[];
}

interface SiteIntentDocument {
  sessionId: string;
  siteType: string;
  conversionGoal: string;
  personalityVector: number[];
  businessName: string;
  tagline: string;
  pages: PageSpec[];
  metadata: {
    generatedAt: number;
    method: "ai" | "deterministic";
  };
  emotionalGoals?: string[];
  voiceProfile?: string;
  brandArchetype?: string;
  antiReferences?: string[];
  narrativePrompts?: Record<string, string>;
}

/* ────────────────────────────────────────────────────────────
 * Business sub-type inference from description keywords
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

/**
 * Infer a specific business sub-type from the site type and description.
 * Returns a granular sub-type (e.g. "restaurant", "spa", "photography")
 * or falls back to the original siteType if no match.
 */
function inferBusinessSubType(siteType: string, description: string): string {
  const lower = description.toLowerCase();

  for (const [subType, keywords] of Object.entries(SUB_TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return subType;
      }
    }
  }

  return siteType;
}

/* ────────────────────────────────────────────────────────────
 * Inline content validator (mirrors src/lib/assembly/validate-spec.ts)
 * Inlined here because Convex actions cannot import from src/.
 * ──────────────────────────────────────────────────────────── */

interface ValidationWarning {
  severity: "error" | "warning";
  componentRef?: string;
  field?: string;
  message: string;
  suggestion?: string;
}

interface ValidationResult {
  warnings: ValidationWarning[];
  subType: string;
}

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

const GENERIC_PHRASES: Array<{ phrase: string; notForSubTypes?: string[] }> = [
  { phrase: "building something remarkable together" },
  { phrase: "services & treatments", notForSubTypes: ["spa"] },
  { phrase: "schedule a consultation", notForSubTypes: ["business"] },
  { phrase: "welcome to our" },
  { phrase: "lorem ipsum" },
  { phrase: "your trusted partner" },
  { phrase: "we are committed to excellence" },
];

function collectStrings(obj: unknown): string[] {
  if (typeof obj === "string") return [obj];
  if (Array.isArray(obj)) return obj.flatMap(collectStrings);
  if (obj && typeof obj === "object") {
    return Object.values(obj as Record<string, unknown>).flatMap(collectStrings);
  }
  return [];
}

function validateSpecContent(
  spec: SiteIntentDocument,
  context: { description: string; siteType: string }
): ValidationResult {
  const warnings: ValidationWarning[] = [];
  const subType = inferBusinessSubType(context.siteType, context.description);

  const allComponentStrings: string[] = [];
  for (const page of spec.pages) {
    for (const comp of page.components) {
      allComponentStrings.push(...collectStrings(comp.content));
    }
  }
  const joinedContent = allComponentStrings.join(" ").toLowerCase();

  // Rule 1: Generic placeholder detection
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

  // Rule 2: Business name presence in nav/footer
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

  // Rule 3: Vocabulary blacklist per sub-type
  const blacklist = VOCAB_BLACKLIST[subType];
  if (blacklist) {
    for (const term of blacklist) {
      if (joinedContent.includes(term.toLowerCase())) {
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

  // Rule 4: Vocabulary whitelist per sub-type
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

  // Rule 5: Content field type checks (content-stats values)
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
 * Auto-fix replacement maps (inlined copy of validate-spec.ts fixSpecContent)
 * ──────────────────────────────────────────────────────────── */

interface AutoFix {
  componentRef: string;
  field: string;
  original: string;
  replacement: string;
  rule: string;
}

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
        const p = new RegExp(pattern.source, pattern.flags);
        if (p.test(current)) {
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
      if (current !== value) content[key] = current;
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
            const p = new RegExp(pattern.source, pattern.flags);
            if (p.test(current)) {
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
          if (current !== (value[i] as string)) value[i] = current;
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

function fixSpecContent(
  spec: SiteIntentDocument,
  context: { description: string; siteType: string }
): { spec: SiteIntentDocument; fixes: AutoFix[]; subType: string } {
  const fixed = JSON.parse(JSON.stringify(spec)) as SiteIntentDocument;
  const fixes: AutoFix[] = [];
  const subType = inferBusinessSubType(context.siteType, context.description);
  const vocabReps = VOCAB_REPLACEMENTS[subType];
  const headlineReps = HEADLINE_REPLACEMENTS[subType];
  const roleReps = ROLE_REPLACEMENTS[subType];

  for (const page of fixed.pages) {
    for (const comp of page.components) {
      const ref = `${comp.componentId}[${comp.order}]`;
      const content = comp.content as Record<string, unknown>;

      // Fix business name in logoText
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
      // Headline replacements
      if (headlineReps) applyReplacements(content, headlineReps, ref, "", fixes, "headline-swap");
      // Team role replacements
      if (roleReps && comp.componentId === "team-grid") {
        const members = content.members;
        if (Array.isArray(members)) {
          for (let i = 0; i < members.length; i++) {
            const member = members[i] as Record<string, unknown>;
            if (typeof member.role === "string") {
              let role = member.role;
              for (const { pattern, replacement } of roleReps) {
                const p = new RegExp(pattern.source, pattern.flags);
                if (p.test(role)) {
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
              if (role !== member.role) member.role = role;
            }
          }
        }
      }
      // Vocabulary replacements
      if (vocabReps) applyReplacements(content, vocabReps, ref, "", fixes, "vocab-swap");
      // content-stats type coercion
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

/* ────────────────────────────────────────────────────────────
 * Industry-specific content for deterministic fallback
 * ──────────────────────────────────────────────────────────── */

interface IndustryContent {
  taglines: Record<string, string>;
  headline: (businessName: string) => string;
  features: Array<{ icon: string; title: string; description: string }>;
  testimonials: Array<{ quote: string; name: string; role: string; rating: number }>;
  aboutBody: (businessName: string, description: string) => string;
}

const INDUSTRY_CONTENT: Record<string, IndustryContent> = {
  business: {
    taglines: {
      contact: "Professional solutions tailored to your needs",
      book: "Book your consultation today",
      showcase: "Excellence in every detail",
      sell: "Quality products and services you can trust",
    },
    headline: (name) => `${name} — Where Results Meet Excellence`,
    features: [
      {
        icon: "Target",
        title: "Strategic Approach",
        description:
          "We start with your goals and work backwards to create a tailored strategy that delivers measurable results.",
      },
      {
        icon: "Zap",
        title: "Fast Delivery",
        description: "Quick turnaround without compromising on quality or attention to detail.",
      },
      {
        icon: "Shield",
        title: "Proven Results",
        description:
          "Track record of delivering measurable outcomes for our clients across every project.",
      },
      {
        icon: "HeadphonesIcon",
        title: "Dedicated Support",
        description: "Responsive, personalized support from real people whenever you need it.",
      },
    ],
    testimonials: [
      {
        quote:
          "They transformed our online presence completely. We saw a 40% increase in inquiries within the first month — couldn't believe the difference.",
        name: "Sarah Chen",
        role: "CEO, TechVenture",
        rating: 5,
      },
      {
        quote:
          "Professional, responsive, and incredibly talented. They understood our vision immediately and delivered beyond what we expected.",
        name: "Marcus Johnson",
        role: "Founder, GreenLeaf Co",
        rating: 5,
      },
      {
        quote:
          "Working with them was a game-changer. Our conversion rates doubled and the design still feels fresh a year later.",
        name: "Elena Rodriguez",
        role: "Director, Bright Ideas Agency",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} is committed to delivering exceptional results that exceed expectations. Our approach combines deep industry expertise with a genuine understanding of what our clients need to succeed.</p>`,
  },
  portfolio: {
    taglines: {
      hire: "Creative work that speaks for itself",
      attention: "Pushing boundaries, creating impact",
      audience: "Stories worth sharing",
      sell: "Unique creations, exceptional quality",
    },
    headline: (name) => `${name} — Creative Work That Moves People`,
    features: [
      {
        icon: "Palette",
        title: "Creative Direction",
        description:
          "Thoughtful design choices that elevate every project and leave a lasting impression.",
      },
      {
        icon: "Eye",
        title: "Attention to Detail",
        description: "Every pixel considered, every element purposeful — nothing is accidental.",
      },
      {
        icon: "Lightbulb",
        title: "Fresh Perspectives",
        description: "Innovative approaches that stand out from the crowd and capture attention.",
      },
      {
        icon: "Award",
        title: "Award-Winning",
        description: "Recognized for excellence in design, execution, and creative innovation.",
      },
    ],
    testimonials: [
      {
        quote:
          "An exceptional creative talent. Their work elevated our entire brand identity and every marketing touchpoint.",
        name: "David Park",
        role: "Creative Director, Nova Studio",
        rating: 5,
      },
      {
        quote:
          "Stunning work with incredible attention to detail. Every project exceeded what we thought was possible.",
        name: "Amara Williams",
        role: "Marketing Lead, Pulse Agency",
        rating: 5,
      },
      {
        quote:
          "True artistry combined with professional reliability. A rare combination in the creative world.",
        name: "James Mitchell",
        role: "CEO, Vanguard Media",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} brings a distinctive creative vision to every project — blending artistic craft with strategic thinking to produce work that resonates.</p>`,
  },
  ecommerce: {
    taglines: {
      products: "Shop our curated collection",
      digital: "Digital products that deliver real value",
      subscriptions: "Subscribe to something special",
      marketplace: "Your one-stop marketplace",
    },
    headline: (name) => `${name} — Discover Something You'll Love`,
    features: [
      {
        icon: "Package",
        title: "Quality Products",
        description:
          "Carefully curated selection of premium products that meet our exacting standards.",
      },
      {
        icon: "Truck",
        title: "Fast Shipping",
        description:
          "Quick and reliable delivery to your doorstep, with tracking every step of the way.",
      },
      {
        icon: "RotateCcw",
        title: "Easy Returns",
        description:
          "Hassle-free returns within 30 days. No questions asked, no hoops to jump through.",
      },
      {
        icon: "ShieldCheck",
        title: "Secure Checkout",
        description:
          "Your data is protected with industry-standard encryption and secure payment processing.",
      },
    ],
    testimonials: [
      {
        quote:
          "The quality exceeded my expectations. Packaging was beautiful and delivery was faster than promised. Already ordered again.",
        name: "Rachel Kim",
        role: "Verified Buyer",
        rating: 5,
      },
      {
        quote:
          "Best online shopping experience I've had. The product descriptions were accurate and customer service was incredibly helpful.",
        name: "Tom Bradley",
        role: "Repeat Customer",
        rating: 5,
      },
      {
        quote:
          "Found exactly what I was looking for. The curated selection made it easy to choose — no endless scrolling through junk.",
        name: "Maya Patel",
        role: "Verified Buyer",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} is dedicated to bringing you products that combine quality, value, and style. Every item in our collection is hand-selected to meet our exacting standards.</p>`,
  },
  booking: {
    taglines: {
      contact: "Your appointment is a click away",
      book: "Book your next appointment in seconds",
      showcase: "Premium services, effortless booking",
      sell: "Transform your experience today",
    },
    headline: (name) => `${name} — Book Your Experience Today`,
    features: [
      {
        icon: "Calendar",
        title: "Easy Online Scheduling",
        description:
          "Book your preferred time slot in seconds. No phone calls, no waiting on hold.",
      },
      {
        icon: "Star",
        title: "Premium Service",
        description:
          "Every visit is tailored to your preferences by experienced professionals who care.",
      },
      {
        icon: "Clock",
        title: "Flexible Hours",
        description:
          "Early morning, evening, and weekend appointments available to fit your schedule.",
      },
      {
        icon: "Heart",
        title: "Client Satisfaction",
        description:
          "Thousands of happy clients trust us with their regular appointments and special occasions.",
      },
    ],
    testimonials: [
      {
        quote:
          "The online booking is so convenient — I can see exactly what's available and pick a time that works. No more phone tag.",
        name: "Jessica Tran",
        role: "Regular Client",
        rating: 5,
      },
      {
        quote:
          "Best experience I've had. The staff remembers my preferences and the results are always exactly what I wanted.",
        name: "Andre Foster",
        role: "Monthly Client",
        rating: 5,
      },
      {
        quote:
          "I've been coming here for two years and have never been disappointed. The consistency and attention to detail is unmatched.",
        name: "Lauren McBride",
        role: "Loyal Customer",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>At ${name}, we believe great service starts with a great experience. From easy online booking to personalized attention during every visit, we're dedicated to exceeding your expectations.</p>`,
  },
  blog: {
    taglines: {
      contact: "Stories, insights, and ideas worth reading",
      inform: "Perspectives that make you think",
      convert: "Join a community of curious minds",
      sell: "Knowledge that empowers",
    },
    headline: (name) => `${name} — Fresh Perspectives, Bold Ideas`,
    features: [
      {
        icon: "BookOpen",
        title: "In-Depth Articles",
        description: "Well-researched, thoughtfully written pieces that go beyond the surface.",
      },
      {
        icon: "TrendingUp",
        title: "Trending Topics",
        description: "Stay ahead with coverage of the latest developments and emerging trends.",
      },
      {
        icon: "MessageCircle",
        title: "Active Community",
        description: "Join conversations with readers who share your curiosity and passion.",
      },
      {
        icon: "Mail",
        title: "Newsletter",
        description:
          "Get our best content delivered straight to your inbox — no spam, just substance.",
      },
    ],
    testimonials: [
      {
        quote:
          "One of the few blogs I actually look forward to reading. The writing is sharp, the insights are original, and every post teaches me something new.",
        name: "Chris Nakamura",
        role: "Subscriber",
        rating: 5,
      },
      {
        quote:
          "Finally a blog that respects its readers' time. Every article is well-researched and gets straight to the point.",
        name: "Priya Sharma",
        role: "Regular Reader",
        rating: 5,
      },
      {
        quote:
          "I've shared more articles from this blog than any other. The content is genuinely useful and always well-written.",
        name: "Daniel Okafor",
        role: "Newsletter Subscriber",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} is a space for thoughtful exploration and honest perspectives. We write about the things that matter — with depth, clarity, and a commitment to substance over clickbait.</p>`,
  },
  personal: {
    taglines: {
      contact: "Let's connect and create something great",
      inform: "My journey, my perspective",
      hire: "Available for projects and collaborations",
      convert: "Join me on this journey",
    },
    headline: (name) => `Hi, I'm ${name}`,
    features: [
      {
        icon: "Briefcase",
        title: "Experience",
        description: "Years of hands-on experience across diverse projects and challenges.",
      },
      {
        icon: "Lightbulb",
        title: "Creative Problem Solving",
        description: "Turning complex challenges into elegant, effective solutions.",
      },
      {
        icon: "Users",
        title: "Collaboration",
        description:
          "Working closely with teams and clients to achieve exceptional results together.",
      },
      {
        icon: "TrendingUp",
        title: "Continuous Growth",
        description: "Always learning, always improving — staying sharp in a fast-moving field.",
      },
    ],
    testimonials: [
      {
        quote:
          "Incredibly talented and a pleasure to work with. They brought fresh ideas to the table and delivered on every promise.",
        name: "Morgan Ellis",
        role: "Project Collaborator",
        rating: 5,
      },
      {
        quote:
          "Professional, creative, and reliable. Exactly the kind of person you want on your team or leading your project.",
        name: "Sam Whitfield",
        role: "Former Client",
        rating: 5,
      },
      {
        quote:
          "Exceeded our expectations in every way. Their work ethic and attention to quality set them apart.",
        name: "Nina Vasquez",
        role: "Team Lead, Apex Digital",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} brings passion and precision to every project. Whether collaborating with teams or working independently, the focus is always on delivering work that makes a real impact.</p>`,
  },
  educational: {
    taglines: {
      contact: "Learn from the best, at your own pace",
      inform: "Knowledge that transforms",
      convert: "Start your learning journey today",
      sell: "Invest in your future",
    },
    headline: (name) => `${name} — Learn Skills That Matter`,
    features: [
      {
        icon: "GraduationCap",
        title: "Expert-Led Content",
        description:
          "Courses and materials designed by industry professionals with real-world experience.",
      },
      {
        icon: "BookOpen",
        title: "Structured Curriculum",
        description:
          "Clear learning paths that take you from beginner to proficient, step by step.",
      },
      {
        icon: "Users",
        title: "Community Support",
        description: "Learn alongside peers, ask questions, and get feedback from instructors.",
      },
      {
        icon: "Award",
        title: "Recognized Credentials",
        description:
          "Earn certificates and credentials that demonstrate your expertise to employers.",
      },
    ],
    testimonials: [
      {
        quote:
          "The course structure is excellent — clear, practical, and immediately applicable to my work. Best educational investment I've made.",
        name: "Kevin Park",
        role: "Career Changer",
        rating: 5,
      },
      {
        quote:
          "The instructors genuinely care about student success. I got personalized feedback that accelerated my learning dramatically.",
        name: "Lisa Johannsen",
        role: "Graduate",
        rating: 5,
      },
      {
        quote:
          "Went from complete beginner to landing a job in my new field. The curriculum is that good.",
        name: "Raj Mehta",
        role: "Alumni",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} is dedicated to making high-quality education accessible and practical. Our programs are designed to equip you with skills that translate directly to real-world success.</p>`,
  },
  nonprofit: {
    taglines: {
      contact: "Join us in making a difference",
      inform: "See the impact we're making together",
      convert: "Every contribution counts",
      sell: "Support a cause that matters",
    },
    headline: (name) => `${name} — Together, We Make a Difference`,
    features: [
      {
        icon: "Heart",
        title: "Impact Tracking",
        description:
          "See exactly how every dollar and volunteer hour translates into real-world change.",
      },
      {
        icon: "Users",
        title: "Volunteer Management",
        description:
          "Easy sign-up and coordination for volunteers who want to make a hands-on difference.",
      },
      {
        icon: "CreditCard",
        title: "Donation Processing",
        description: "Secure one-time and recurring donations that go directly toward our mission.",
      },
      {
        icon: "Globe",
        title: "Community Outreach",
        description:
          "Programs and events that bring people together and amplify our collective impact.",
      },
    ],
    testimonials: [
      {
        quote:
          "Volunteering here has been one of the most rewarding experiences of my life. The organization is transparent, effective, and genuinely passionate.",
        name: "Angela Torres",
        role: "Volunteer Coordinator",
        rating: 5,
      },
      {
        quote:
          "I've donated to many nonprofits over the years, but few show the tangible results and transparency that this organization does.",
        name: "Robert Chen",
        role: "Monthly Donor",
        rating: 5,
      },
      {
        quote:
          "They turned our small community grant into a program that now serves hundreds of families. Incredible impact with limited resources.",
        name: "Patricia Owens",
        role: "Community Partner",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} believes in the power of collective action. Every donation, every volunteer hour, and every shared story brings us closer to a world where our mission is realized.</p>`,
  },
  event: {
    taglines: {
      contact: "Don't miss out — secure your spot",
      inform: "Everything you need to know about the event",
      convert: "Register now before spots fill up",
      sell: "Get your tickets today",
    },
    headline: (name) => `${name} — An Experience You Won't Forget`,
    features: [
      {
        icon: "Calendar",
        title: "Event Schedule",
        description:
          "Full agenda with speakers, sessions, and activities so you can plan your experience.",
      },
      {
        icon: "MapPin",
        title: "Venue & Logistics",
        description:
          "Directions, parking, accommodations, and everything you need to get there stress-free.",
      },
      {
        icon: "Users",
        title: "Networking",
        description: "Connect with like-minded attendees, speakers, and industry leaders.",
      },
      {
        icon: "Sparkles",
        title: "Exclusive Perks",
        description:
          "VIP access, early-bird pricing, and special bonuses for registered attendees.",
      },
    ],
    testimonials: [
      {
        quote:
          "Best event I attended all year. The organization was flawless, the speakers were inspiring, and the networking opportunities were incredible.",
        name: "Jason Wright",
        role: "Attendee",
        rating: 5,
      },
      {
        quote:
          "From registration to the final session, everything was seamless. Already looking forward to next year.",
        name: "Sophia Lin",
        role: "VIP Ticket Holder",
        rating: 5,
      },
      {
        quote:
          "The caliber of speakers and the energy of the crowd made this a truly unforgettable experience. Worth every penny.",
        name: "Michael Osei",
        role: "Repeat Attendee",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} brings together passionate people for an experience that inspires, connects, and energizes. Whether you're a first-timer or a returning attendee, there's something extraordinary waiting for you.</p>`,
  },
  landing: {
    taglines: {
      contact: "Take the first step today",
      inform: "Everything you need, one page",
      convert: "Join thousands who already have",
      sell: "Limited time — act now",
    },
    headline: (name) => `${name} — The Smarter Way Forward`,
    features: [
      {
        icon: "Zap",
        title: "Quick Results",
        description: "See real results faster than you thought possible with our proven approach.",
      },
      {
        icon: "Shield",
        title: "Risk-Free",
        description: "Try it with confidence. Our guarantee means you have nothing to lose.",
      },
      {
        icon: "TrendingUp",
        title: "Proven Track Record",
        description:
          "Thousands of satisfied customers can't be wrong. See the numbers for yourself.",
      },
      {
        icon: "CheckCircle",
        title: "Simple Process",
        description: "No complicated setup. Get started in minutes and see results right away.",
      },
    ],
    testimonials: [
      {
        quote:
          "Signed up on a whim and it turned out to be one of the best decisions I've made this year. The results were immediate and measurable.",
        name: "Alex Rivera",
        role: "Early Adopter",
        rating: 5,
      },
      {
        quote:
          "I was skeptical at first, but the results spoke for themselves. Wish I'd started sooner.",
        name: "Jasmine Powell",
        role: "Customer",
        rating: 5,
      },
      {
        quote:
          "Simple to get started, powerful results. Exactly what was promised — no fluff, no hidden catches.",
        name: "Derek Huang",
        role: "Verified User",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} was built to solve a real problem with a straightforward solution. No gimmicks, no unnecessary complexity — just results.</p>`,
  },

  /* ── Sub-type overrides (restaurant, spa, photography) ── */

  restaurant: {
    taglines: {
      contact: "Reserve your table tonight",
      book: "Make a reservation",
      showcase: "A culinary experience like no other",
      sell: "Savor every moment",
    },
    headline: (name) => `${name} — Where Every Dish Tells a Story`,
    features: [
      {
        icon: "ChefHat",
        title: "Chef-Crafted Menu",
        description:
          "Every dish is thoughtfully composed by our culinary team using the finest seasonal ingredients.",
      },
      {
        icon: "Wine",
        title: "Curated Pairings",
        description:
          "Our sommelier selects wines and cocktails that elevate each course into a complete experience.",
      },
      {
        icon: "Flame",
        title: "From Scratch, Daily",
        description:
          "Sauces, breads, and pastas made fresh in-house every morning. You can taste the difference.",
      },
      {
        icon: "Sparkles",
        title: "Unforgettable Ambiance",
        description:
          "Warm lighting, curated music, and thoughtful design create the perfect atmosphere for any occasion.",
      },
    ],
    testimonials: [
      {
        quote:
          "The mole negro was transcendent — layers of flavor I've never experienced anywhere else. This is destination dining.",
        name: "Sofia Marquez",
        role: "Food Critic, City Eats",
        rating: 5,
      },
      {
        quote:
          "We celebrated our anniversary here and every detail was perfect. The tasting menu was a journey from start to finish.",
        name: "James & Patricia Wells",
        role: "Anniversary Dinner",
        rating: 5,
      },
      {
        quote:
          "I've traveled the world for food and this place competes with the best. The passion in every plate is undeniable.",
        name: "Carlos Ibarra",
        role: "Regular Guest",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>At ${name}, dining is more than a meal — it's an experience crafted with intention, seasonality, and deep respect for culinary tradition. Every plate reflects our commitment to excellence.</p>`,
  },
  spa: {
    taglines: {
      contact: "Begin your wellness journey",
      book: "Book your escape today",
      showcase: "Restore, rejuvenate, reconnect",
      sell: "The renewal you deserve",
    },
    headline: (name) => `${name} — A Sanctuary for Mind and Body`,
    features: [
      {
        icon: "Leaf",
        title: "Holistic Approach",
        description:
          "Treatments designed to restore balance to your entire being — body, mind, and spirit.",
      },
      {
        icon: "Droplets",
        title: "Premium Products",
        description:
          "We use only organic, sustainably sourced products that nourish your skin and respect the environment.",
      },
      {
        icon: "Heart",
        title: "Expert Therapists",
        description:
          "Our licensed therapists bring years of specialized training and genuine care to every session.",
      },
      {
        icon: "Sparkles",
        title: "Serene Environment",
        description:
          "Purpose-built treatment rooms, aromatherapy, and ambient soundscapes create your perfect escape.",
      },
    ],
    testimonials: [
      {
        quote:
          "I walked in carrying the stress of a month and walked out feeling like a completely different person. The deep tissue massage was exactly what I needed.",
        name: "Amanda Chen",
        role: "Monthly Member",
        rating: 5,
      },
      {
        quote:
          "The attention to detail here is extraordinary — from the herbal tea on arrival to the personalized treatment plan. True luxury.",
        name: "David Okafor",
        role: "First-Time Guest",
        rating: 5,
      },
      {
        quote:
          "I've tried spas all over the city and nothing compares. The therapists actually listen and customize every session.",
        name: "Rachel Kim",
        role: "Regular Client",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} is a sanctuary where expert care meets intentional design. Every detail — from the products we use to the atmosphere we create — is chosen to help you find stillness, renewal, and balance.</p>`,
  },
  photography: {
    taglines: {
      contact: "Let's capture your story",
      hire: "Book your session today",
      showcase: "Moments preserved, stories told",
      attention: "Images that move people",
    },
    headline: (name) => `${name} — Capturing Moments That Matter`,
    features: [
      {
        icon: "Camera",
        title: "Artistic Vision",
        description:
          "Every shoot is guided by a distinctive creative eye that finds beauty in authentic moments.",
      },
      {
        icon: "Sun",
        title: "Natural Light Mastery",
        description:
          "Expert use of natural and ambient light creates images that feel alive, warm, and timeless.",
      },
      {
        icon: "Image",
        title: "Professional Editing",
        description:
          "Meticulous post-production ensures every image meets gallery-quality standards while staying true to the moment.",
      },
      {
        icon: "Clock",
        title: "Fast Turnaround",
        description:
          "Preview gallery within 48 hours, fully edited collection delivered in two weeks or less.",
      },
    ],
    testimonials: [
      {
        quote:
          "They captured our wedding in a way that makes us relive every emotion. These aren't just photos — they're heirlooms.",
        name: "Maria & Tom Ashford",
        role: "Wedding Clients",
        rating: 5,
      },
      {
        quote:
          "My headshots completely transformed my professional brand. I've gotten more inquiries in two months than the previous year.",
        name: "Darnell Brooks",
        role: "Executive Portrait",
        rating: 5,
      },
      {
        quote:
          "The family session was so relaxed and natural. The kids were laughing the whole time and the photos show genuine joy — not forced smiles.",
        name: "Lin Nakamura",
        role: "Family Session",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} believes that photography is the art of seeing what others overlook. Every session is a collaboration — blending your story with a creative vision that produces images you'll treasure for a lifetime.</p>`,
  },
};

/* ────────────────────────────────────────────────────────────
 * Deterministic fallback spec generator
 * ──────────────────────────────────────────────────────────── */

function generateDeterministicSpec(args: {
  sessionId: string;
  siteType: string;
  goal: string;
  businessName: string;
  description: string;
  personality: number[];
  aiResponses: Record<string, string>;
  emotionalGoals?: string[];
  voiceProfile?: string;
  brandArchetype?: string;
  antiReferences?: string[];
  narrativePrompts?: Record<string, string>;
}): SiteIntentDocument {
  const { sessionId, siteType, goal, description, personality } = args;
  const voiceTone = (args.voiceProfile || "polished") as "warm" | "polished" | "direct";
  const antiRefs = args.antiReferences || [];
  const emotionalGoals = args.emotionalGoals || [];
  const narrativeData = args.narrativePrompts || {};

  // Use explicitly provided business name, fall back to extraction from description
  const businessName = args.businessName || extractBusinessName(description);

  // Infer sub-type for industry-specific content (e.g. "booking" → "restaurant")
  const subType = inferBusinessSubType(siteType, description);
  const industry =
    INDUSTRY_CONTENT[subType] || INDUSTRY_CONTENT[siteType] || INDUSTRY_CONTENT.business;
  const tagline = industry.taglines[goal] || "Building something remarkable together";

  // Determine hero variant based on personality + sub-type
  const isMinimal = personality[0] < 0.5;
  const isLuxury = emotionalGoals.includes("luxury");

  // Sub-type-aware hero selection:
  // Luxury restaurants → gradient-bg hero-centered (dramatic, no split)
  // Photography → hero-split (showcase imagery)
  // Spa → hero-centered with background image (serene full-width)
  const heroVariant =
    (isLuxury && subType === "restaurant") || subType === "spa"
      ? "gradient-bg"
      : isMinimal
        ? "gradient-bg"
        : "with-bg-image";
  const heroComponent =
    subType === "photography"
      ? "hero-split"
      : isLuxury && subType === "restaurant"
        ? "hero-centered"
        : personality[2] < 0.5
          ? "hero-centered"
          : "hero-split";
  const heroSplitVariant = personality[4] > 0.5 ? "image-right" : "image-left";

  const components: ComponentPlacement[] = [];
  let order = 0;

  // Voice-keyed CTA text with sub-type awareness
  const ctaText = getVoiceKeyedCtaText(goal, voiceTone, antiRefs, subType);

  // Sub-type-aware nav links
  const navLinks = getNavLinksForSubType(subType, siteType);

  // Nav
  components.push({
    componentId: "nav-sticky",
    variant: "transparent",
    order: order++,
    content: {
      logoText: businessName,
      links: navLinks,
      cta: { text: ctaText, href: "#contact" },
    },
  });

  // Hero — voice-keyed headline with sub-type awareness
  const headline = getVoiceKeyedHeadline(businessName, siteType, voiceTone, subType);
  if (heroComponent === "hero-centered") {
    components.push({
      componentId: "hero-centered",
      variant: heroVariant,
      order: order++,
      content: {
        headline,
        subheadline: tagline,
        ctaPrimary: { text: ctaText, href: "#contact" },
        ctaSecondary: { text: "Learn More", href: "#about" },
      },
    });
  } else {
    components.push({
      componentId: "hero-split",
      variant: heroSplitVariant,
      order: order++,
      content: {
        headline,
        subheadline: description.slice(0, 200),
        ctaPrimary: { text: ctaText, href: "#contact" },
        ctaSecondary: { text: "Learn More", href: "#about" },
        image: {
          src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
          alt: businessName,
        },
      },
    });
  }

  // About section — weave in narrative prompts if available (S5)
  const aboutBody = buildAboutBody(businessName, description, narrativeData, industry);
  const aboutEyebrow =
    subType === "restaurant"
      ? "Our Story"
      : subType === "photography"
        ? "The Photographer"
        : siteType === "personal"
          ? "About Me"
          : "About Us";

  components.push({
    componentId: "content-text",
    variant: "centered",
    order: order++,
    content: {
      id: "about",
      eyebrow: aboutEyebrow,
      headline: `Why Choose ${businessName}`,
      body: aboutBody,
    },
  });

  components.push({
    componentId: "content-features",
    variant: "icon-cards",
    order: order++,
    content: {
      id: "services",
      subheadline: getServicesEyebrow(subType, siteType),
      headline: getServicesHeadline(subType, siteType),
      features: industry.features,
    },
  });

  // Stats section for business, booking, ecommerce, educational, nonprofit
  if (["business", "booking", "ecommerce", "educational", "nonprofit"].includes(siteType)) {
    components.push({
      componentId: "content-stats",
      variant: isLuxury || personality[3] > 0.6 ? "animated-counter" : "cards",
      order: order++,
      content: {
        headline: "By the Numbers",
        stats: getStatsForSiteType(subType, siteType),
      },
    });
  }

  // Services section for booking and business with service offerings
  if (["booking", "ecommerce"].includes(siteType)) {
    const servicesHeadlines: Record<string, { headline: string; subheadline: string }> = {
      restaurant: { headline: "Our Menu", subheadline: "Signature dishes crafted with passion" },
      spa: { headline: "Our Treatments", subheadline: "Personalized wellness experiences" },
      photography: {
        headline: "Packages & Sessions",
        subheadline: "Find the perfect package for your vision",
      },
    };
    const sh = servicesHeadlines[subType] || {
      headline: siteType === "booking" ? "Our Services" : "What We Offer",
      subheadline:
        siteType === "booking" ? "Choose the perfect service for you" : "Explore our offerings",
    };
    // Sub-type-aware service variant: tiered for luxury restaurant (prix fixe menus),
    // list for spa (treatment menu), card-grid otherwise
    const serviceVariant =
      isLuxury && subType === "restaurant"
        ? "tiered"
        : subType === "spa"
          ? "list"
          : personality[3] > 0.5
            ? "card-grid"
            : "list";
    components.push({
      componentId: "commerce-services",
      variant: serviceVariant,
      order: order++,
      content: {
        headline: sh.headline,
        subheadline: sh.subheadline,
        services: getServicesForSiteType(subType, siteType),
      },
    });
  }

  // Team section for business, booking, portfolio
  if (["business", "booking", "personal"].includes(siteType)) {
    const teamHeadlines: Record<string, { headline: string; subheadline: string }> = {
      restaurant: {
        headline: "Our Culinary Team",
        subheadline: `The talent behind ${businessName}`,
      },
      spa: { headline: "Our Wellness Experts", subheadline: "Dedicated professionals who care" },
      photography: { headline: "The Creative Team", subheadline: "The artists behind the lens" },
    };
    const th = teamHeadlines[subType] || {
      headline: siteType === "personal" ? "Collaborators" : "Meet the Team",
      subheadline:
        siteType === "personal"
          ? "People I love working with"
          : `The people behind ${businessName}`,
    };
    // Sub-type-aware team variant: hover-reveal for photography, cards for restaurant/luxury, minimal for clean
    const teamVariant =
      subType === "photography"
        ? "hover-reveal"
        : isLuxury || subType === "restaurant"
          ? "cards"
          : personality[0] > 0.5
            ? "cards"
            : "minimal";
    components.push({
      componentId: "team-grid",
      variant: teamVariant,
      order: order++,
      content: {
        headline: th.headline,
        subheadline: th.subheadline,
        members: getTeamForSiteType(subType, siteType),
      },
    });
  }

  // Logos section for business, ecommerce, educational
  if (["business", "ecommerce", "educational", "landing"].includes(siteType)) {
    components.push({
      componentId: "content-logos",
      variant: personality[4] > 0.5 ? "scroll" : "grid",
      order: order++,
      content: {
        headline: siteType === "educational" ? "Recognized By" : "Trusted By",
        logos: getTrustLogos(siteType),
      },
    });
  }

  // Gallery for visual businesses (photography, restaurant)
  if (subType === "photography") {
    // Serious/polished photographers get lightbox; creative/casual get masonry
    const galleryVariant = personality[1] > 0.6 ? "lightbox" : "masonry";
    components.push({
      componentId: "media-gallery",
      variant: galleryVariant,
      order: order++,
      content: {
        headline: "Selected Work",
        subheadline: "A glimpse into our recent sessions",
        images: [
          { src: "", alt: "Portrait session in natural light", category: "Portraits" },
          { src: "", alt: "Wedding ceremony candid moment", category: "Weddings" },
          { src: "", alt: "Corporate headshot with studio lighting", category: "Commercial" },
          { src: "", alt: "Family laughing together outdoors", category: "Families" },
          { src: "", alt: "Editorial fashion photograph", category: "Editorial" },
          { src: "", alt: "Couple during golden hour engagement shoot", category: "Weddings" },
        ],
        columns: 3,
        showCaptions: true,
        enableFilter: true,
      },
    });
  }

  // Social proof — sub-type-aware eyebrow
  const testimonialEyebrows: Record<string, string> = {
    restaurant: "Guest Reviews",
    spa: "Client Experiences",
    photography: "Client Love",
  };
  components.push({
    componentId: "proof-testimonials",
    variant: "carousel",
    order: order++,
    content: {
      eyebrow: testimonialEyebrows[subType] || "Testimonials",
      headline:
        subType === "restaurant"
          ? "What Our Guests Say"
          : subType === "spa"
            ? "What Our Clients Experience"
            : "What Our Clients Say",
      testimonials: industry.testimonials,
    },
  });

  // FAQ accordion for booking, ecommerce, educational, event
  if (["booking", "ecommerce", "educational", "event", "nonprofit"].includes(siteType)) {
    components.push({
      componentId: "content-accordion",
      variant: isLuxury ? "bordered" : "single-open",
      order: order++,
      content: {
        headline: "Frequently Asked Questions",
        subheadline: "Everything you need to know",
        items: getFaqForSiteType(subType, siteType, businessName),
      },
    });
  }

  // CTA — weave in narrative frustrated_with if available (S5)
  const ctaSubheadline = narrativeData.frustrated_with
    ? `Tired of ${narrativeData.frustrated_with
        .toLowerCase()
        .replace(/^i'?m\s+/i, "")
        .replace(/^they'?re\s+/i, "")}? We do things differently.`
    : "Take the next step and see what we can do for you.";
  components.push({
    componentId: "cta-banner",
    variant:
      isLuxury || subType === "restaurant"
        ? "full-width"
        : subType === "spa"
          ? "contained"
          : personality[3] > 0.5
            ? "full-width"
            : "contained",
    order: order++,
    content: {
      headline: getCtaHeadline(goal, subType),
      subheadline: ctaSubheadline,
      ctaPrimary: { text: ctaText, href: "#contact" },
      backgroundVariant: "primary",
    },
  });

  // Contact form (if goal involves contact/booking)
  if (["contact", "book", "convert", "hire"].includes(goal)) {
    components.push({
      componentId: "form-contact",
      variant: "simple",
      order: order++,
      content: {
        id: "contact",
        headline: getContactFormHeadline(subType),
        subheadline: getContactFormSubheadline(subType, businessName),
        fields: [
          { name: "name", label: "Your Name", type: "text", required: true },
          { name: "email", label: "Email Address", type: "email", required: true },
          { name: "message", label: "Message", type: "textarea", required: true },
        ],
        submitText: "Send Message",
      },
    });
  }

  // Footer — uses same sub-type-aware nav links
  components.push({
    componentId: "footer-standard",
    variant: "multi-column",
    order: order++,
    content: {
      logoText: businessName,
      tagline,
      columns: [
        {
          title: "Quick Links",
          links: navLinks,
        },
        {
          title: "Contact",
          links: [
            { label: "hello@example.com", href: "mailto:hello@example.com" },
            { label: "(555) 123-4567", href: "tel:+15551234567" },
          ],
        },
      ],
      socialLinks: [
        { platform: "twitter", url: "#" },
        { platform: "instagram", url: "#" },
        { platform: "linkedin", url: "#" },
      ],
      copyright: `${new Date().getFullYear()} ${businessName}. All rights reserved.`,
    },
  });

  return {
    sessionId,
    siteType,
    conversionGoal: goal,
    personalityVector: personality,
    businessName,
    tagline,
    pages: [
      {
        slug: "/",
        title: "Home",
        purpose: "Primary landing page",
        components,
      },
    ],
    metadata: {
      generatedAt: Date.now(),
      method: "deterministic",
    },
    emotionalGoals: args.emotionalGoals,
    voiceProfile: args.voiceProfile,
    brandArchetype: args.brandArchetype,
    antiReferences: args.antiReferences,
    narrativePrompts: args.narrativePrompts,
  };
}

function getNavLinksForSubType(
  subType: string,
  siteType: string
): Array<{ label: string; href: string }> {
  const navMap: Record<string, Array<{ label: string; href: string }>> = {
    restaurant: [
      { label: "Home", href: "#" },
      { label: "Our Story", href: "#about" },
      { label: "Menu", href: "#services" },
      { label: "Reservations", href: "#contact" },
    ],
    spa: [
      { label: "Home", href: "#" },
      { label: "About", href: "#about" },
      { label: "Treatments", href: "#services" },
      { label: "Book Now", href: "#contact" },
    ],
    photography: [
      { label: "Home", href: "#" },
      { label: "About", href: "#about" },
      { label: "Portfolio", href: "#services" },
      { label: "Book a Session", href: "#contact" },
    ],
    portfolio: [
      { label: "Home", href: "#" },
      { label: "About", href: "#about" },
      { label: "Work", href: "#services" },
      { label: "Contact", href: "#contact" },
    ],
    ecommerce: [
      { label: "Home", href: "#" },
      { label: "About", href: "#about" },
      { label: "Products", href: "#services" },
      { label: "Contact", href: "#contact" },
    ],
    blog: [
      { label: "Home", href: "#" },
      { label: "About", href: "#about" },
      { label: "Articles", href: "#services" },
      { label: "Subscribe", href: "#contact" },
    ],
    nonprofit: [
      { label: "Home", href: "#" },
      { label: "Our Mission", href: "#about" },
      { label: "Programs", href: "#services" },
      { label: "Donate", href: "#contact" },
    ],
    event: [
      { label: "Home", href: "#" },
      { label: "About", href: "#about" },
      { label: "Schedule", href: "#services" },
      { label: "Register", href: "#contact" },
    ],
    educational: [
      { label: "Home", href: "#" },
      { label: "About", href: "#about" },
      { label: "Courses", href: "#services" },
      { label: "Enroll", href: "#contact" },
    ],
  };

  return (
    navMap[subType] ||
    navMap[siteType] || [
      { label: "Home", href: "#" },
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Contact", href: "#contact" },
    ]
  );
}

function buildAboutBody(
  businessName: string,
  description: string,
  narrativeData: Record<string, string>,
  industry: IndustryContent
): string {
  const parts: string[] = [];

  // User's description is always the foundation
  parts.push(`<p>${description}</p>`);

  // Weave in narrative prompts if available (S5)
  if (narrativeData.come_because) {
    parts.push(`<p>${narrativeData.come_because}</p>`);
  }
  if (narrativeData.after_feel) {
    parts.push(
      `<p>When you leave ${businessName}, you should feel ${narrativeData.after_feel.toLowerCase()}.</p>`
    );
  }

  // Fall back to industry boilerplate only if no narrative prompts
  if (!narrativeData.come_because && !narrativeData.after_feel) {
    const boilerplate = industry.aboutBody(businessName, "");
    // Strip the empty <p></p> that would come from empty description
    const cleaned = boilerplate.replace(/<p>\s*<\/p>/g, "");
    if (cleaned.trim()) parts.push(cleaned);
  }

  return parts.join("");
}

function getVoiceKeyedHeadline(
  businessName: string,
  siteType: string,
  voiceTone: "warm" | "polished" | "direct",
  subType?: string
): string {
  const headlinesByVoice: Record<string, Record<string, string>> = {
    warm: {
      restaurant: `Welcome to ${businessName} — pull up a chair, stay a while`,
      spa: `${businessName} — your escape is waiting`,
      photography: `${businessName} — let's capture something beautiful`,
      business: `Hey, welcome to ${businessName} — we're glad you're here`,
      portfolio: `${businessName} — Let's create something beautiful together`,
      ecommerce: `${businessName} — Find something you'll love`,
      booking: `${businessName} — Your next great experience starts here`,
      blog: `${businessName} — Pull up a chair, let's talk`,
      personal: `Hey, I'm ${businessName} — nice to meet you`,
      educational: `${businessName} — Learn at your own pace, your own way`,
      nonprofit: `${businessName} — Together, we're making it happen`,
      event: `${businessName} — Come be part of something special`,
      landing: `${businessName} — We think you'll love this`,
    },
    polished: {
      restaurant: `${businessName} — A Culinary Experience Beyond Compare`,
      spa: `${businessName} — Where Wellness Becomes an Art`,
      photography: `${businessName} — Timeless Images, Artfully Captured`,
      business: `${businessName} — Where Excellence Meets Precision`,
      portfolio: `${businessName} — Refined Creative Vision`,
      ecommerce: `${businessName} — A Curated Collection Awaits`,
      booking: `${businessName} — Reserve Your Premium Experience`,
      blog: `${businessName} — Perspectives Worth Your Attention`,
      personal: `${businessName} — Crafting Impact Through Expertise`,
      educational: `${businessName} — Elevating Skills, Transforming Careers`,
      nonprofit: `${businessName} — Measurable Impact, Meaningful Change`,
      event: `${businessName} — An Experience Designed to Inspire`,
      landing: `${businessName} — The Intelligent Choice`,
    },
    direct: {
      restaurant: `${businessName}. Exceptional food. No compromise.`,
      spa: `${businessName}. Real relaxation. Real results.`,
      photography: `${businessName}. Your story. Beautifully told.`,
      business: `${businessName}. Better results, less hassle.`,
      portfolio: `${businessName}. Work that speaks for itself.`,
      ecommerce: `${businessName}. Quality products. Fair prices. Done.`,
      booking: `${businessName}. Book it. Show up. Love it.`,
      blog: `${businessName}. No fluff. Just substance.`,
      personal: `I'm ${businessName}. Let's get to work.`,
      educational: `${businessName}. Learn what matters. Skip what doesn't.`,
      nonprofit: `${businessName}. Real impact. Real numbers.`,
      event: `${businessName}. Show up. Be changed.`,
      landing: `${businessName}. See why thousands switched.`,
    },
  };

  // Try sub-type first, then site type, then default
  const voiceMap = headlinesByVoice[voiceTone] || headlinesByVoice.polished;
  return (subType && voiceMap[subType]) || voiceMap[siteType] || voiceMap.business;
}

function getVoiceKeyedCtaText(
  goal: string,
  voiceTone: "warm" | "polished" | "direct",
  antiRefs: string[],
  subType?: string
): string {
  const isSalesy = antiRefs.includes("salesy");

  // Sub-type-specific CTA overrides (highest priority)
  const subTypeCtas: Record<string, Record<string, Record<string, string>>> = {
    restaurant: {
      warm: { book: "Come dine with us", contact: "Say hello" },
      polished: { book: "Reserve Your Table", contact: "Make a Reservation" },
      direct: { book: "Book a table", contact: "Reserve now" },
    },
    spa: {
      warm: { book: "Treat yourself", contact: "Start your journey" },
      polished: { book: "Book Your Treatment", contact: "Schedule Your Session" },
      direct: { book: "Book a session", contact: "Book now" },
    },
    photography: {
      warm: { book: "Let's capture your story", contact: "Let's talk about your shoot" },
      polished: { book: "Book Your Session", contact: "Schedule a Consultation" },
      direct: { book: "Book a shoot", contact: "Get in touch" },
    },
  };

  // Check sub-type-specific CTA first
  if (subType && subTypeCtas[subType]?.[voiceTone]?.[goal]) {
    return subTypeCtas[subType][voiceTone][goal];
  }

  const ctasByVoice: Record<string, Record<string, string>> = {
    warm: {
      contact: "Let's chat",
      book: isSalesy ? "See what's available" : "Book your spot",
      showcase: "Take a look around",
      sell: isSalesy ? "Browse the collection" : "Shop now",
      hire: "Let's work together",
      attention: "See the work",
      audience: "Come along",
      convert: "Join us",
    },
    polished: {
      contact: "Schedule a Consultation",
      book: "Reserve Your Experience",
      showcase: "Explore Our Portfolio",
      sell: "Shop the Collection",
      hire: "Discuss Your Project",
      attention: "View Selected Works",
      audience: "Subscribe",
      convert: "Get Started",
    },
    direct: {
      contact: "Get in touch",
      book: "Book now",
      showcase: "See the work",
      sell: "Shop now",
      hire: "Hire me",
      attention: "See portfolio",
      audience: "Follow",
      convert: "Sign up",
    },
  };

  return ctasByVoice[voiceTone]?.[goal] || ctasByVoice.polished.contact || "Get Started";
}

function extractBusinessName(description: string): string {
  // Try to extract a proper name from the description
  const patterns = [
    /(?:called|named)\s+["']?([A-Z][A-Za-z\s&']+?)["']?(?:\.|,|\s+(?:is|and|that|which|in))/,
    /(?:my|our)\s+(?:company|business|brand|studio|agency|shop|store)\s+["']?([A-Z][A-Za-z\s&']+?)["']?/i,
    /^I(?:'m| am)\s+(?:a\s+)?([A-Z][A-Za-z\s]+?)(?:\s+(?:based|in|from|who|that|and))/,
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  // Fallback: extract first capitalized phrase or use generic
  const words = description.split(/\s+/).slice(0, 3);
  if (words.length > 0 && /^[A-Z]/.test(words[0])) {
    return words.slice(0, 2).join(" ");
  }
  return "My Business";
}

function getServicesEyebrow(subType: string, siteType: string): string {
  const map: Record<string, string> = {
    restaurant: "The Experience",
    spa: "Our Treatments",
    photography: "Our Craft",
    business: "Our Services",
    portfolio: "What I Do",
    ecommerce: "Why Choose Us",
    booking: "Our Services",
  };
  return map[subType] || map[siteType] || "What We Offer";
}

function getServicesHeadline(subType: string, siteType: string): string {
  const map: Record<string, string> = {
    restaurant: "A Menu Crafted with Passion",
    spa: "Treatments Tailored to You",
    photography: "Services for Every Occasion",
    business: "Services That Drive Results",
    portfolio: "Areas of Expertise",
    ecommerce: "The Difference We Make",
    booking: "What We Offer",
  };
  return map[subType] || map[siteType] || "What Makes Us Different";
}

function getCtaHeadline(goal: string, subType?: string): string {
  // Sub-type-specific CTA headlines (highest priority)
  const subTypeHeadlines: Record<string, Record<string, string>> = {
    restaurant: {
      book: "Reserve Your Table Tonight",
      contact: "We'd Love to Host You",
    },
    spa: {
      book: "Book Your Treatment Today",
      contact: "Begin Your Wellness Journey",
    },
    photography: {
      book: "Book Your Session",
      contact: "Let's Plan Your Shoot",
    },
  };

  if (subType && subTypeHeadlines[subType]?.[goal]) {
    return subTypeHeadlines[subType][goal];
  }

  const headlines: Record<string, string> = {
    contact: "Ready to Start Your Project?",
    book: "Book Your Appointment Today",
    showcase: "Let's Work Together",
    sell: "Start Shopping Today",
    hire: "Let's Create Something Amazing",
    convert: "Join Thousands of Happy Customers",
  };
  return headlines[goal] || "Ready to Get Started?";
}

function getContactFormHeadline(subType: string): string {
  const map: Record<string, string> = {
    restaurant: "Make a Reservation",
    spa: "Book Your Appointment",
    photography: "Let's Plan Your Session",
  };
  return map[subType] || "Get in Touch";
}

function getContactFormSubheadline(subType: string, businessName: string): string {
  const map: Record<string, string> = {
    restaurant: `Reserve your table at ${businessName}. We look forward to welcoming you.`,
    spa: `Schedule your next treatment at ${businessName}. Your wellness journey starts here.`,
    photography: `Tell us about your vision and we'll craft the perfect session for you.`,
  };
  return (
    map[subType] ||
    `Ready to get started? Drop us a message and we'll get back to you within 24 hours.`
  );
}

function getStatsForSiteType(
  subType: string,
  siteType: string
): Array<{ value: number; label: string; suffix?: string }> {
  const statsMap: Record<string, Array<{ value: number; label: string; suffix?: string }>> = {
    restaurant: [
      { value: 50000, label: "Guests Served", suffix: "+" },
      { value: 15, label: "Years of Tradition", suffix: "+" },
      { value: 98, label: "Guest Satisfaction", suffix: "%" },
      { value: 24, label: "Signature Dishes" },
    ],
    spa: [
      { value: 20000, label: "Treatments Given", suffix: "+" },
      { value: 99, label: "Client Satisfaction", suffix: "%" },
      { value: 12, label: "Licensed Therapists" },
      { value: 10, label: "Years of Wellness", suffix: "+" },
    ],
    photography: [
      { value: 2000, label: "Sessions Completed", suffix: "+" },
      { value: 500, label: "Happy Clients", suffix: "+" },
      { value: 8, label: "Years of Experience", suffix: "+" },
      { value: 15, label: "Awards Won" },
    ],
    business: [
      { value: 500, label: "Clients Served", suffix: "+" },
      { value: 98, label: "Satisfaction Rate", suffix: "%" },
      { value: 12, label: "Years of Experience", suffix: "+" },
      { value: 50, label: "Team Members" },
    ],
    booking: [
      { value: 10000, label: "Appointments Booked", suffix: "+" },
      { value: 49, label: "Average Rating" },
      { value: 8, label: "Years in Business", suffix: "+" },
      { value: 99, label: "Return Clients", suffix: "%" },
    ],
    ecommerce: [
      { value: 25000, label: "Happy Customers", suffix: "+" },
      { value: 48, label: "Average Review" },
      { value: 48, label: "Hour Shipping", suffix: "h" },
      { value: 30, label: "Day Returns" },
    ],
    educational: [
      { value: 5000, label: "Students Enrolled", suffix: "+" },
      { value: 95, label: "Completion Rate", suffix: "%" },
      { value: 200, label: "Courses Available", suffix: "+" },
      { value: 49, label: "Student Rating" },
    ],
    nonprofit: [
      { value: 100000, label: "Lives Impacted", suffix: "+" },
      { value: 15, label: "Years of Service" },
      { value: 92, label: "Funds to Mission", suffix: "%" },
      { value: 2500, label: "Volunteers", suffix: "+" },
    ],
  };
  return statsMap[subType] || statsMap[siteType] || statsMap.business;
}

function getServicesForSiteType(
  subType: string,
  siteType: string
): Array<{ name: string; description: string; price?: string; icon?: string; featured?: boolean }> {
  if (subType === "restaurant") {
    return [
      {
        name: "Tasting Menu",
        description:
          "A seven-course journey through our chef's seasonal inspirations, paired with hand-selected wines.",
        price: "$125/person",
        icon: "Sparkles",
        featured: true,
      },
      {
        name: "Chef's Table",
        description:
          "An intimate dining experience in our kitchen with a custom menu and direct access to the culinary team.",
        price: "$185/person",
        icon: "ChefHat",
      },
      {
        name: "Private Dining",
        description:
          "Exclusive use of our private dining room for groups of 8-20, with a curated menu tailored to your occasion.",
        price: "From $95/person",
        icon: "Users",
      },
      {
        name: "Weekend Brunch",
        description:
          "A leisurely three-course brunch featuring seasonal dishes, fresh pastries, and bottomless mimosas.",
        price: "$55/person",
        icon: "Sun",
      },
    ];
  }
  if (subType === "spa") {
    return [
      {
        name: "Signature Massage",
        description:
          "Our signature full-body massage combining Swedish and deep tissue techniques for total relaxation.",
        price: "$120",
        icon: "Heart",
        featured: true,
      },
      {
        name: "Deep Tissue Therapy",
        description:
          "Targeted pressure therapy to release chronic tension and restore mobility in problem areas.",
        price: "$140",
        icon: "Zap",
      },
      {
        name: "Hot Stone Ritual",
        description:
          "Heated basalt stones melt tension while essential oils soothe the senses in this luxurious treatment.",
        price: "$155",
        icon: "Flame",
      },
      {
        name: "Facial Rejuvenation",
        description:
          "A customized facial using organic products to cleanse, exfoliate, and restore your natural glow.",
        price: "$95",
        icon: "Sparkles",
      },
    ];
  }
  if (subType === "photography") {
    return [
      {
        name: "Portrait Session",
        description:
          "A one-hour session in studio or on location, with 15 professionally edited images delivered digitally.",
        price: "$350",
        icon: "Camera",
      },
      {
        name: "Wedding Package",
        description:
          "Full-day coverage from preparation to reception, with a second photographer and 400+ edited images.",
        price: "From $3,500",
        icon: "Heart",
        featured: true,
      },
      {
        name: "Commercial Shoot",
        description:
          "Half or full-day product and brand photography with art direction and usage licensing included.",
        price: "From $1,200",
        icon: "Briefcase",
      },
      {
        name: "Family Session",
        description:
          "A relaxed 90-minute session at your favorite outdoor location, with 25 edited images.",
        price: "$450",
        icon: "Users",
      },
    ];
  }
  if (siteType === "booking") {
    return [
      {
        name: "Standard Session",
        description: "Our most popular option — perfect for regular appointments.",
        price: "$45",
        icon: "Clock",
      },
      {
        name: "Premium Experience",
        description: "Extended session with premium products and extra attention to detail.",
        price: "$75",
        icon: "Star",
        featured: true,
      },
      {
        name: "Express Service",
        description: "Quick and efficient for busy schedules. In and out in 30 minutes.",
        price: "$30",
        icon: "Zap",
      },
      {
        name: "VIP Package",
        description: "The ultimate experience with complimentary extras and priority scheduling.",
        price: "$120",
        icon: "Award",
      },
    ];
  }
  return [
    {
      name: "Starter Plan",
      description: "Everything you need to get started with core features included.",
      price: "$29/mo",
      icon: "Package",
    },
    {
      name: "Professional",
      description: "Advanced features for growing businesses and teams.",
      price: "$79/mo",
      icon: "Briefcase",
      featured: true,
    },
    {
      name: "Enterprise",
      description: "Custom solutions with dedicated support and premium features.",
      price: "Custom",
      icon: "Shield",
    },
  ];
}

function getTeamForSiteType(
  subType: string,
  siteType: string
): Array<{ name: string; role: string; bio?: string }> {
  if (subType === "restaurant") {
    return [
      {
        name: "Marco Reyes",
        role: "Executive Chef",
        bio: "Trained in Mexico City and Lyon, bringing 20 years of culinary mastery to every dish.",
      },
      {
        name: "Isabella Torres",
        role: "Sous Chef",
        bio: "Specializing in seasonal ingredients and innovative flavor combinations.",
      },
      {
        name: "David Hernandez",
        role: "Sommelier",
        bio: "Curating wine pairings that elevate every course into a complete experience.",
      },
      {
        name: "Ana Gutierrez",
        role: "Restaurant Manager",
        bio: "Ensuring every guest feels welcomed, valued, and delighted from the moment they arrive.",
      },
    ];
  }
  if (subType === "spa") {
    return [
      {
        name: "Elena Vasquez",
        role: "Lead Massage Therapist",
        bio: "Licensed in five modalities with a healing touch perfected over 15 years.",
      },
      {
        name: "Dr. Sarah Lin",
        role: "Wellness Director",
        bio: "Integrative health specialist designing personalized treatment protocols.",
      },
      {
        name: "Maya Johnson",
        role: "Esthetician",
        bio: "Expert in organic skincare and anti-aging treatments with a loyal client following.",
      },
      {
        name: "Jordan Okafor",
        role: "Holistic Practitioner",
        bio: "Combining ancient wisdom with modern techniques for whole-body wellness.",
      },
    ];
  }
  if (subType === "photography") {
    return [
      {
        name: "Alex Rivera",
        role: "Lead Photographer",
        bio: "An award-winning eye for light, composition, and authentic human moments.",
      },
      {
        name: "Sam Nguyen",
        role: "Second Shooter",
        bio: "Capturing candid moments and alternative angles that tell the complete story.",
      },
      {
        name: "Jordan Park",
        role: "Photo Editor",
        bio: "Meticulous post-production that brings every image to its full potential.",
      },
    ];
  }
  if (siteType === "personal") {
    return [
      {
        name: "Jordan Rivera",
        role: "Design Partner",
        bio: "Bringing visual concepts to life with precision and creativity.",
      },
      {
        name: "Alex Kim",
        role: "Strategy Advisor",
        bio: "Helping shape brand direction and growth strategy.",
      },
      {
        name: "Sam Chen",
        role: "Development Lead",
        bio: "Turning ideas into functional, beautiful digital products.",
      },
    ];
  }
  return [
    {
      name: "Alex Morgan",
      role: "Founder & CEO",
      bio: "Leading the vision with over a decade of industry experience.",
    },
    {
      name: "Jordan Lee",
      role: "Creative Director",
      bio: "Crafting memorable brand experiences that resonate with audiences.",
    },
    {
      name: "Taylor Brooks",
      role: "Head of Operations",
      bio: "Ensuring seamless delivery and exceptional client satisfaction.",
    },
    {
      name: "Casey Rivera",
      role: "Lead Strategist",
      bio: "Turning data into actionable insights that drive real results.",
    },
  ];
}

function getTrustLogos(siteType: string): Array<{ name: string }> {
  if (siteType === "educational") {
    return [
      { name: "Stanford University" },
      { name: "MIT" },
      { name: "Google" },
      { name: "Microsoft" },
      { name: "Coursera" },
      { name: "edX" },
    ];
  }
  return [
    { name: "Forbes" },
    { name: "TechCrunch" },
    { name: "Product Hunt" },
    { name: "Y Combinator" },
    { name: "Bloomberg" },
    { name: "Wired" },
  ];
}

function getFaqForSiteType(
  subType: string,
  siteType: string,
  businessName: string
): Array<{ question: string; answer: string }> {
  const faqMap: Record<string, Array<{ question: string; answer: string }>> = {
    restaurant: [
      {
        question: "Do I need a reservation?",
        answer: `<p>Reservations are strongly recommended, especially for weekend evenings. Walk-ins are welcome but subject to availability. You can reserve online or call us directly.</p>`,
      },
      {
        question: "Do you accommodate dietary restrictions?",
        answer: `<p>Absolutely. Our kitchen is experienced with vegetarian, vegan, gluten-free, and allergen-sensitive preparations. Please mention any dietary needs when booking and your server will guide you through the menu.</p>`,
      },
      {
        question: "Is there a dress code?",
        answer: `<p>We encourage smart casual attire. While we want you to feel comfortable, we ask that guests avoid athletic wear and flip-flops to preserve the ambiance for everyone.</p>`,
      },
      {
        question: "Can you host private events?",
        answer: `<p>Yes! ${businessName} offers private dining for groups of 8-40 guests. We create custom menus for weddings, corporate events, birthdays, and special celebrations. Contact us for details.</p>`,
      },
    ],
    spa: [
      {
        question: "What should I expect during my first visit?",
        answer: `<p>Arrive 15 minutes early to complete a brief wellness questionnaire. You'll receive a robe, slippers, and a tour of our facilities. Your therapist will discuss your needs before the treatment begins.</p>`,
      },
      {
        question: "What is your cancellation policy?",
        answer: `<p>We require 24 hours notice for cancellations or rescheduling. Late cancellations or no-shows may be charged 50% of the treatment price.</p>`,
      },
      {
        question: "Are there health conditions that prevent treatment?",
        answer: `<p>Certain conditions may require a doctor's note or modified treatment. Please inform us of any health conditions, allergies, or medications when booking so we can ensure your safety and comfort.</p>`,
      },
      {
        question: "Do you offer gift cards?",
        answer: `<p>Yes! ${businessName} gift cards are available in any amount and make a thoughtful gift. They can be used for any treatment or product and never expire.</p>`,
      },
    ],
    photography: [
      {
        question: "How far in advance should I book?",
        answer: `<p>For weddings, we recommend 6-12 months in advance. Portrait and family sessions can usually be booked 2-4 weeks out. Contact us for current availability.</p>`,
      },
      {
        question: "How long until I receive my photos?",
        answer: `<p>A preview gallery of 20-30 images is delivered within 48 hours. Your full edited collection is typically ready within 2-3 weeks, depending on the session type.</p>`,
      },
      {
        question: "Do you provide prints and albums?",
        answer: `<p>Yes! We offer museum-quality prints, custom-designed albums, and canvas wraps. These can be ordered through your private online gallery after delivery.</p>`,
      },
      {
        question: "Can I use the photos on social media?",
        answer: `<p>Absolutely. All personal session packages include a social media usage license. Commercial usage licensing is included in commercial packages or available as an add-on.</p>`,
      },
    ],
    booking: [
      {
        question: "How do I book an appointment?",
        answer: `<p>You can book online through our website 24/7, or call us during business hours. We recommend booking at least 48 hours in advance for your preferred time slot.</p>`,
      },
      {
        question: "What is your cancellation policy?",
        answer: `<p>We understand plans change. Please give us at least 24 hours notice for cancellations. Late cancellations may incur a fee of 50% of the service price.</p>`,
      },
      {
        question: "Do you offer gift cards?",
        answer: `<p>Yes! ${businessName} gift cards are available in any denomination and make the perfect gift for any occasion. They can be purchased in-store or online.</p>`,
      },
      {
        question: "What forms of payment do you accept?",
        answer: `<p>We accept all major credit cards, debit cards, Apple Pay, and Google Pay. Cash is also welcome.</p>`,
      },
    ],
    ecommerce: [
      {
        question: "What is your shipping policy?",
        answer: `<p>We offer free shipping on orders over $50. Standard shipping (3-5 business days) is $5.99, and express shipping (1-2 business days) is $12.99.</p>`,
      },
      {
        question: "How do I return an item?",
        answer: `<p>Returns are accepted within 30 days of delivery. Items must be in original condition with tags attached. We provide a prepaid return label for your convenience.</p>`,
      },
      {
        question: "Do you ship internationally?",
        answer: `<p>Yes, ${businessName} ships to over 50 countries worldwide. International shipping rates and delivery times vary by destination.</p>`,
      },
      {
        question: "How can I track my order?",
        answer: `<p>Once your order ships, you'll receive an email with a tracking number. You can also check your order status in your account dashboard.</p>`,
      },
    ],
    educational: [
      {
        question: "Are the courses self-paced?",
        answer: `<p>Most of our courses are self-paced, allowing you to learn on your own schedule. Some live cohort courses have set schedules for interactive sessions.</p>`,
      },
      {
        question: "Do I get a certificate upon completion?",
        answer: `<p>Yes! All ${businessName} courses include a verified certificate upon successful completion that you can add to your resume or LinkedIn profile.</p>`,
      },
      {
        question: "What if I'm not satisfied with a course?",
        answer: `<p>We offer a 30-day money-back guarantee on all courses. If you're not satisfied, contact our support team for a full refund.</p>`,
      },
      {
        question: "Can I access courses on mobile devices?",
        answer: `<p>Absolutely. Our platform is fully responsive and works on smartphones, tablets, and desktops. We also offer a dedicated mobile app.</p>`,
      },
    ],
    event: [
      {
        question: "What's included in my ticket?",
        answer: `<p>Your ticket includes full access to all sessions, keynotes, and networking events. VIP tickets also include exclusive workshops, priority seating, and a swag bag.</p>`,
      },
      {
        question: "Is there a group discount?",
        answer: `<p>Yes! Groups of 5 or more receive a 15% discount, and groups of 10+ receive 25% off. Contact us for custom group pricing.</p>`,
      },
      {
        question: "What is the refund policy?",
        answer: `<p>Full refunds are available up to 30 days before the event. After that, tickets can be transferred to another attendee at no charge.</p>`,
      },
      {
        question: "Will sessions be recorded?",
        answer: `<p>Yes, all main stage sessions will be recorded and made available to ticket holders within 48 hours of the event.</p>`,
      },
    ],
    nonprofit: [
      {
        question: "How are donations used?",
        answer: `<p>92% of all donations go directly to our programs and mission. We publish detailed annual reports showing exactly how every dollar is spent.</p>`,
      },
      {
        question: "Is my donation tax-deductible?",
        answer: `<p>Yes, ${businessName} is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the fullest extent allowed by law.</p>`,
      },
      {
        question: "How can I volunteer?",
        answer: `<p>We'd love to have you! Visit our volunteer page to see current opportunities, or contact us directly to discuss how your skills can make a difference.</p>`,
      },
      {
        question: "Can I set up a recurring donation?",
        answer: `<p>Absolutely. Monthly recurring donations help us plan ahead and maximize impact. You can set up recurring giving through our secure online portal.</p>`,
      },
    ],
  };
  return faqMap[subType] || faqMap[siteType] || faqMap.booking;
}

/* ────────────────────────────────────────────────────────────
 * Main action
 * ──────────────────────────────────────────────────────────── */

export const generateSiteSpec = action({
  args: {
    sessionId: v.string(),
    siteType: v.string(),
    goal: v.string(),
    businessName: v.string(),
    description: v.string(),
    personality: v.array(v.float64()),
    aiResponses: v.any(),
    emotionalGoals: v.optional(v.array(v.string())),
    voiceProfile: v.optional(v.string()),
    brandArchetype: v.optional(v.string()),
    antiReferences: v.optional(v.array(v.string())),
    narrativePrompts: v.optional(v.any()),
  },
  handler: async (ctx, args): Promise<SiteIntentDocument> => {
    const startTime = Date.now();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    const intakeSnapshot = {
      siteType: args.siteType,
      goal: args.goal,
      businessName: args.businessName,
      description: args.description,
      personality: args.personality,
      emotionalGoals: args.emotionalGoals,
      voiceProfile: args.voiceProfile,
      brandArchetype: args.brandArchetype,
      antiReferences: args.antiReferences,
      narrativePrompts: args.narrativePrompts,
    };

    const characterArgs = {
      emotionalGoals: args.emotionalGoals,
      voiceProfile: args.voiceProfile,
      brandArchetype: args.brandArchetype,
      antiReferences: args.antiReferences,
      narrativePrompts: args.narrativePrompts as Record<string, string> | undefined,
    };

    if (!apiKey) {
      const spec = generateDeterministicSpec({ ...args, ...characterArgs });
      await ctx.runMutation(internal.siteSpecs.saveSiteSpecInternal, {
        sessionId: spec.sessionId,
        siteType: spec.siteType,
        conversionGoal: spec.conversionGoal,
        personalityVector: spec.personalityVector,
        businessName: spec.businessName,
        tagline: spec.tagline,
        pages: spec.pages,
        metadata: spec.metadata,
        emotionalGoals: spec.emotionalGoals,
        voiceProfile: spec.voiceProfile,
        brandArchetype: spec.brandArchetype,
        antiReferences: spec.antiReferences,
        narrativePrompts: spec.narrativePrompts,
      });

      const validationResult = validateSpecContent(spec, {
        description: args.description,
        siteType: args.siteType,
      });
      if (validationResult.warnings.length > 0) {
        console.warn(
          `[Spec Validation] ${validationResult.warnings.length} issues:`,
          validationResult.warnings.map((w) => w.message)
        );
      }

      const fixResult = fixSpecContent(spec, {
        description: args.description,
        siteType: args.siteType,
      });
      if (fixResult.fixes.length > 0) {
        console.log(
          `[Auto-Fix] Applied ${fixResult.fixes.length} fixes:`,
          fixResult.fixes.map((f) => `${f.rule}: ${f.original} → ${f.replacement}`)
        );
      }
      const finalSpec = fixResult.fixes.length > 0 ? fixResult.spec : spec;

      try {
        await ctx.runMutation(internal.pipelineLogs.savePipelineLogInternal, {
          sessionId: args.sessionId,
          method: "deterministic",
          intakeData: intakeSnapshot,
          specSnapshot: finalSpec,
          validationResult: { ...validationResult, autoFixes: fixResult.fixes },
          processingTimeMs: Date.now() - startTime,
          createdAt: Date.now(),
        });
      } catch (logErr) {
        console.error("Pipeline log save failed:", logErr);
      }

      return finalSpec;
    }

    try {
      const client = new Anthropic({ apiKey });

      // Infer business sub-type for AI context
      const aiSubType = inferBusinessSubType(args.siteType, args.description);

      const aiResponsesSummary = Object.entries(args.aiResponses as Record<string, string>)
        .map(([key, val]) => `${key}: ${val}`)
        .join("\n");

      // Build character context for AI prompt
      const characterPromptLines: string[] = [];

      // S1: Business sub-type awareness — highest priority context
      if (aiSubType !== args.siteType) {
        characterPromptLines.push(
          `BUSINESS SUB-TYPE: This is specifically a ${aiSubType.toUpperCase()}. Use ${aiSubType}-specific vocabulary throughout all content. Nav labels, section headings, CTAs, testimonials, team roles — everything must feel native to the ${aiSubType} industry.`
        );
      }

      // S5: User's own words — priority copy material
      const narrativeData = args.narrativePrompts as Record<string, string> | undefined;
      if (narrativeData && Object.values(narrativeData).some((v) => v)) {
        characterPromptLines.push(
          "USER'S OWN WORDS (highest priority — use these as the foundation for all copy):"
        );
        if (narrativeData.come_because)
          characterPromptLines.push(
            `  - Why people come: "${narrativeData.come_because}" → Use this insight in the hero subheadline or about section headline.`
          );
        if (narrativeData.frustrated_with)
          characterPromptLines.push(
            `  - What customers are frustrated with: "${narrativeData.frustrated_with}" → Address this pain point in features or the CTA section.`
          );
        if (narrativeData.after_feel)
          characterPromptLines.push(
            `  - How customers feel after: "${narrativeData.after_feel}" → Use this emotion in testimonials and the closing CTA.`
          );
      }

      if (args.emotionalGoals?.length) {
        characterPromptLines.push(
          `EMOTIONAL GOALS: ${args.emotionalGoals.join(", ")}. The design should evoke these emotions through color, spacing, typography, and copy tone.`
        );
      }
      if (args.voiceProfile) {
        const voiceRules: Record<string, string> = {
          warm: "Use conversational, friendly language. Contractions OK. Address visitors directly. Headlines should feel like a friend talking.",
          polished:
            "Use refined, elegant language. No contractions. Headlines should feel curated and intentional. Professional but not stiff.",
          direct:
            "Use short, punchy language. No fluff. Headlines should be statements, not questions. Every word must earn its place.",
        };
        characterPromptLines.push(
          `VOICE PROFILE: ${args.voiceProfile}. ${voiceRules[args.voiceProfile] || ""}`
        );
      }
      if (args.brandArchetype) {
        const archetypeRules: Record<string, string> = {
          guide:
            "Position the brand as a trusted advisor who walks alongside the customer. Use language of guidance, clarity, and support.",
          expert:
            "Position the brand as the authority. Lead with credentials, data, and proof. Confident but not arrogant.",
          creative:
            "Position the brand as an innovator. Use bold, unexpected language. Break conventions in copy structure.",
          caretaker:
            "Position the brand as nurturing and protective. Use language of care, safety, and personal attention.",
          rebel:
            "Position the brand as a challenger. Use language that questions norms. Conversational, edgy, unapologetic.",
          artisan:
            "Position the brand as a craftsperson. Emphasize process, quality, and intentionality. Every detail matters.",
        };
        characterPromptLines.push(
          `BRAND ARCHETYPE: ${args.brandArchetype}. ${archetypeRules[args.brandArchetype] || ""}`
        );
      }
      if (args.antiReferences?.length) {
        characterPromptLines.push(
          `ANTI-REFERENCES (MUST AVOID): ${args.antiReferences.join(", ")}. The site must NEVER feel like any of these. This constrains design choices, copy tone, and component selection.`
        );
      }

      // S2: Business vocabulary tables for sub-types
      const vocabTables: Record<string, string> = {
        restaurant: `RESTAURANT VOCABULARY (use these terms, not generic business terms):
  - Nav: "Menu" not "Services", "Reservations" not "Contact", "Our Story" not "About Us"
  - Sections: "The Experience" not "Our Services", "From Our Kitchen" not "What We Offer"
  - CTAs: "Reserve a Table" / "View the Menu" / "Make a Reservation" — NEVER "Schedule a Consultation" or "Book an Appointment"
  - Team: "Executive Chef" / "Sous Chef" / "Sommelier" / "Restaurant Manager" — NEVER "CEO" or "Founder"
  - Testimonials: "Guest" not "Client", "dining experience" not "service", "dish/course" not "product"`,
        spa: `SPA & WELLNESS VOCABULARY (use these terms, not generic business terms):
  - Nav: "Treatments" not "Services", "Book Now" not "Contact"
  - Sections: "Our Treatments" not "Services & Treatments", "The Sanctuary" not "Our Space"
  - CTAs: "Book Your Treatment" / "Begin Your Journey" — NEVER "Schedule a Consultation"
  - Team: "Lead Therapist" / "Esthetician" / "Wellness Director" — NEVER "CEO" or "Strategist"
  - Testimonials: "Client" not "Customer", "treatment/session" not "appointment", "renewal" not "result"`,
        photography: `PHOTOGRAPHY VOCABULARY (use these terms, not generic business terms):
  - Nav: "Portfolio" not "Services", "Book a Session" not "Contact"
  - Sections: "Our Work" not "What We Offer", "The Process" not "How It Works"
  - CTAs: "Book Your Session" / "View the Portfolio" / "Let's Create Together" — NEVER "Schedule a Consultation"
  - Team: "Lead Photographer" / "Second Shooter" / "Photo Editor" — NEVER "CEO" or "Operations Manager"
  - Testimonials: "Session/shoot" not "appointment", "images/photos" not "deliverables"`,
      };

      if (vocabTables[aiSubType]) {
        characterPromptLines.push(vocabTables[aiSubType]);
      }

      const characterSection =
        characterPromptLines.length > 0
          ? `\n\nBRAND CHARACTER CONTEXT:\n${characterPromptLines.join("\n")}\n\nCOPY QUALITY RULES:\n- No generic filler text. Every headline must be specific to this business.\n- Headlines must be evocative, not merely descriptive. "Premium Grooming, Downtown Austin" not "Welcome to Our Barbershop".\n- Match the voice profile EXACTLY in every piece of copy.\n- If the user's own words are provided, they are the HIGHEST PRIORITY source material. Paraphrase and elevate them — do not ignore them.\n- Anti-references are hard constraints — if "salesy" is listed, never use aggressive CTAs or urgency language.\n\nNEGATIVE EXAMPLES (NEVER generate content like this):\n- NEVER use "Services & Treatments" for a restaurant — use "Our Menu" or "The Dining Experience"\n- NEVER use "Schedule a Consultation" for a restaurant — use "Reserve a Table" or "Make a Reservation"\n- NEVER use "Founder & CEO" for a restaurant team — use "Executive Chef" or "Restaurant Manager"\n- NEVER use "Appointments Booked" as a stat for a restaurant — use "Guests Served" or "Dishes Crafted"\n- NEVER use generic nav labels like "Services" when the business type has a specific term (Menu, Treatments, Portfolio, Courses)\n- NEVER use "Welcome to [Business Name]" as a headline — it says nothing about the business`
          : "";

      const userPrompt = `Business Name: ${args.businessName}
Site Type: ${args.siteType}${aiSubType !== args.siteType ? `\nInferred Business Sub-Type: ${aiSubType} (USE ${aiSubType.toUpperCase()}-SPECIFIC VOCABULARY THROUGHOUT)` : ""}
Goal: ${args.goal}
Description: ${args.description}
Personality Vector: [${args.personality.join(", ")}]
(axes: minimal_rich, playful_serious, warm_cool, light_bold, classic_modern, calm_dynamic)
${args.emotionalGoals?.length ? `Emotional Goals: ${args.emotionalGoals.join(", ")}` : ""}
${args.voiceProfile ? `Voice: ${args.voiceProfile}` : ""}
${args.brandArchetype ? `Archetype: ${args.brandArchetype}` : ""}
${args.antiReferences?.length ? `Anti-references: ${args.antiReferences.join(", ")}` : ""}

Discovery Responses:
${aiResponsesSummary}

Generate the SiteIntentDocument for ${args.businessName}. Remember: all content must be specific to a ${aiSubType} business — use industry-appropriate terminology for nav labels, section headings, team roles, testimonials, and CTAs.`;

      const systemPrompt = `You are a website assembly AI. The business is called "${args.businessName}". Use this name consistently in all content (nav logoText, footer logoText, headlines, etc.).${characterSection}

Given client intake data, generate a SiteIntentDocument — a JSON spec that determines exactly which components and content make up their website.

Available components (use these exact component IDs):

NAVIGATION & FOOTER:
- "nav-sticky" — variants: "transparent", "solid"
  Content: { logoText: string, links: { label, href }[], cta: { text, href } }
- "footer-standard" — variant: "multi-column"
  Content: { logoText, tagline, columns: { title, links: { label, href }[] }[], socialLinks: { platform, url }[], copyright }

HERO SECTIONS (pick ONE per page):
- "hero-centered" — variants: "with-bg-image", "gradient-bg"
  Content: { headline, subheadline, ctaPrimary: { text, href }, ctaSecondary: { text, href } }
- "hero-split" — variants: "image-right", "image-left"
  Content: { headline, subheadline, ctaPrimary: { text, href }, ctaSecondary: { text, href }, image: { src, alt } }

CONTENT SECTIONS:
- "content-features" — variant: "icon-cards"
  Content: { subheadline, headline, features: { icon, title, description }[] }
- "content-split" — variant: "alternating"
  Content: { headline, rows: { headline, body, image: { src, alt } }[] }
- "content-text" — variant: "centered"
  Content: { id?, eyebrow, headline, body (HTML string) }
- "content-stats" — variants: "inline", "cards", "animated-counter"
  Content: { headline?, subheadline?, stats: { value: string, label: string, prefix?, suffix? }[] }
- "content-accordion" — variants: "single-open", "multi-open", "bordered"
  Content: { headline?, subheadline?, items: { question: string, answer: string (HTML) }[] }
- "content-timeline" — variants: "vertical", "alternating"
  Content: { headline?, subheadline?, items: { date?: string, title: string, description: string }[] }
- "content-logos" — variants: "grid", "scroll", "fade"
  Content: { headline?, subheadline?, logos: { name: string, src?: string, href?: string }[] }

COMMERCE & SERVICES:
- "commerce-services" — variants: "card-grid", "list", "tiered"
  Content: { headline?, subheadline?, services: { name, description, price?, duration?, icon?: string, featured?: boolean, ctaText?, ctaLink? }[] }

TEAM:
- "team-grid" — variants: "cards", "minimal", "hover-reveal"
  Content: { headline?, subheadline?, members: { name, role, bio?, image?: { src, alt }, socials?: { platform, url }[] }[] }

SOCIAL PROOF:
- "proof-testimonials" — variant: "carousel"
  Content: { eyebrow, headline, testimonials: { quote, name, role, rating }[] }
- "proof-beforeafter" — variants: "slider", "side-by-side"
  Content: { headline?, subheadline?, comparisons: { beforeImage: { src, alt }, afterImage: { src, alt }, beforeLabel?, afterLabel?, caption? }[] }

MEDIA:
- "media-gallery" — variants: "grid", "masonry", "lightbox"
  Content: { headline?, subheadline?, images: { src, alt, caption?, category? }[], columns?: 2|3|4, showCaptions?: boolean, enableFilter?: boolean }

CTA & FORMS:
- "cta-banner" — variants: "full-width", "contained"
  Content: { headline, subheadline, ctaPrimary: { text, href }, backgroundVariant: "primary"|"secondary"|"accent"|"dark" }
- "form-contact" — variant: "simple"
  Content: { id?, headline, subheadline, fields: { name, label, type, required }[], submitText }

COMPONENT SELECTION GUIDELINES:
- Use "commerce-services" for businesses with distinct service/product offerings (booking, business, ecommerce)
- Use "content-stats" when the business has impressive numbers to showcase (years in business, clients served, etc.)
- Use "team-grid" for businesses where the team matters (agencies, consulting, salons, studios)
- Use "content-accordion" for FAQ sections or detailed info that benefits from expandability
- Use "content-logos" when a business has notable clients, partners, or brands they work with
- Use "content-timeline" for businesses with a compelling history or process steps
- Use "media-gallery" for visual businesses (photography, real estate, restaurants, design)
- Use "proof-beforeafter" for transformative services (beauty, renovation, fitness, design)
- A typical site uses 8-12 components. Don't force every component — pick what fits the business.

For Lucide icons in content-features & commerce-services, use PascalCase: Target, Zap, Shield, Star, Users, Heart, TrendingUp, Eye, Package, Truck, RotateCcw, ShieldCheck, Palette, Lightbulb, Award, HeadphonesIcon, Globe, Clock, CheckCircle, Sparkles, BookOpen, GraduationCap, MessageCircle, Mail, Phone, MapPin, Scissors, Calendar, CreditCard, Briefcase, Camera

Every page MUST start with nav-sticky (order: 0) and end with footer-standard (last order).

CRITICAL content rules:
- Use "${args.businessName}" as the business name everywhere — NEVER invent a different name.
- Headlines MUST be compelling and specific to ${args.businessName}, NOT generic like "Welcome to [name]". Example: "Premium Grooming, Downtown Austin" instead of "Welcome to Luxe Cuts".
- Content MUST be specific to their industry. No generic filler.
- Feature descriptions should reference the actual services/products of this business.
- Testimonials must feel real — use industry-appropriate job titles and specific outcomes (e.g., "Finally found a barber who understands thick hair" not "Great service!").
- Body text: 2-3 sentences, professional, no lorem ipsum.
- socialLinks[].url should be "#" (placeholder).

Return ONLY a JSON object with this structure:
{
  "businessName": string,
  "tagline": string,
  "pages": [
    {
      "slug": "/",
      "title": "Home",
      "purpose": string,
      "components": [
        {
          "componentId": string,
          "variant": string,
          "order": number (starting at 0),
          "content": { ...component-specific props }
        }
      ]
    }
  ]
}

No markdown fencing. No explanation. Just the JSON.`;

      const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      const textBlock = message.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text response from AI");
      }

      const rawAiResponse = textBlock.text.trim();
      let raw = rawAiResponse;
      if (raw.startsWith("```")) {
        raw = raw.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
      }

      const parsed = JSON.parse(raw) as {
        businessName: string;
        tagline: string;
        pages: PageSpec[];
      };

      const spec: SiteIntentDocument = {
        sessionId: args.sessionId,
        siteType: args.siteType,
        conversionGoal: args.goal,
        personalityVector: args.personality,
        businessName: args.businessName || parsed.businessName,
        tagline: parsed.tagline,
        pages: parsed.pages,
        metadata: {
          generatedAt: Date.now(),
          method: "ai",
        },
        emotionalGoals: args.emotionalGoals,
        voiceProfile: args.voiceProfile,
        brandArchetype: args.brandArchetype,
        antiReferences: args.antiReferences,
        narrativePrompts: characterArgs.narrativePrompts,
      };

      await ctx.runMutation(internal.siteSpecs.saveSiteSpecInternal, {
        sessionId: spec.sessionId,
        siteType: spec.siteType,
        conversionGoal: spec.conversionGoal,
        personalityVector: spec.personalityVector,
        businessName: spec.businessName,
        tagline: spec.tagline,
        pages: spec.pages,
        metadata: spec.metadata,
        emotionalGoals: spec.emotionalGoals,
        voiceProfile: spec.voiceProfile,
        brandArchetype: spec.brandArchetype,
        antiReferences: spec.antiReferences,
        narrativePrompts: spec.narrativePrompts,
      });

      const validationResult = validateSpecContent(spec, {
        description: args.description,
        siteType: args.siteType,
      });
      if (validationResult.warnings.length > 0) {
        console.warn(
          `[Spec Validation] ${validationResult.warnings.length} issues:`,
          validationResult.warnings.map((w) => w.message)
        );
      }

      const fixResult = fixSpecContent(spec, {
        description: args.description,
        siteType: args.siteType,
      });
      if (fixResult.fixes.length > 0) {
        console.log(
          `[Auto-Fix] Applied ${fixResult.fixes.length} fixes:`,
          fixResult.fixes.map((f) => `${f.rule}: ${f.original} → ${f.replacement}`)
        );
      }
      const finalSpec = fixResult.fixes.length > 0 ? fixResult.spec : spec;

      try {
        await ctx.runMutation(internal.pipelineLogs.savePipelineLogInternal, {
          sessionId: args.sessionId,
          method: "ai",
          intakeData: intakeSnapshot,
          promptSent: `[SYSTEM]\n${systemPrompt}\n\n[USER]\n${userPrompt}`,
          rawAiResponse,
          specSnapshot: finalSpec,
          validationResult: { ...validationResult, autoFixes: fixResult.fixes },
          processingTimeMs: Date.now() - startTime,
          createdAt: Date.now(),
        });
      } catch (logErr) {
        console.error("Pipeline log save failed:", logErr);
      }

      return finalSpec;
    } catch (error) {
      console.error("Failed to generate AI spec, falling back to deterministic:", error);
      const spec = generateDeterministicSpec({ ...args, ...characterArgs });
      await ctx.runMutation(internal.siteSpecs.saveSiteSpecInternal, {
        sessionId: spec.sessionId,
        siteType: spec.siteType,
        conversionGoal: spec.conversionGoal,
        personalityVector: spec.personalityVector,
        businessName: spec.businessName,
        tagline: spec.tagline,
        pages: spec.pages,
        metadata: spec.metadata,
        emotionalGoals: spec.emotionalGoals,
        voiceProfile: spec.voiceProfile,
        brandArchetype: spec.brandArchetype,
        antiReferences: spec.antiReferences,
        narrativePrompts: spec.narrativePrompts,
      });

      const validationResult = validateSpecContent(spec, {
        description: args.description,
        siteType: args.siteType,
      });
      if (validationResult.warnings.length > 0) {
        console.warn(
          `[Spec Validation] ${validationResult.warnings.length} issues:`,
          validationResult.warnings.map((w) => w.message)
        );
      }

      const fixResult = fixSpecContent(spec, {
        description: args.description,
        siteType: args.siteType,
      });
      if (fixResult.fixes.length > 0) {
        console.log(
          `[Auto-Fix] Applied ${fixResult.fixes.length} fixes:`,
          fixResult.fixes.map((f) => `${f.rule}: ${f.original} → ${f.replacement}`)
        );
      }
      const finalSpec = fixResult.fixes.length > 0 ? fixResult.spec : spec;

      try {
        await ctx.runMutation(internal.pipelineLogs.savePipelineLogInternal, {
          sessionId: args.sessionId,
          method: "deterministic",
          intakeData: intakeSnapshot,
          specSnapshot: finalSpec,
          validationResult: { ...validationResult, autoFixes: fixResult.fixes },
          processingTimeMs: Date.now() - startTime,
          createdAt: Date.now(),
        });
      } catch (logErr) {
        console.error("Pipeline log save failed:", logErr);
      }

      return finalSpec;
    }
  },
});
