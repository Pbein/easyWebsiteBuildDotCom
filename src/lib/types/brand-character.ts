/* ──────────────────────────────────────────────────────────
 * Brand Character Types & Display Constants
 * Captures emotional identity, voice, archetype, and
 * anti-references during the intake flow (Steps 5-7).
 * ────────────────────────────────────────────────────────── */

export type EmotionalGoal =
  | "trust"
  | "luxury"
  | "curious"
  | "calm"
  | "energized"
  | "inspired"
  | "safe"
  | "playful"
  | "authoritative"
  | "welcomed";

export type VoiceTone = "warm" | "polished" | "direct";

export type BrandArchetype = "guide" | "expert" | "creative" | "caretaker" | "rebel" | "artisan";

export type AntiReference =
  | "corporate"
  | "cheap"
  | "generic"
  | "minimalist"
  | "maximalist"
  | "traditional"
  | "trendy"
  | "playful"
  | "formal"
  | "dramatic";

/* ── Display Data ──────────────────────────────────────── */

export interface EmotionalOutcome {
  id: EmotionalGoal;
  label: string;
  description: string;
  icon: string;
  accent: string;
}

export const EMOTIONAL_OUTCOMES: EmotionalOutcome[] = [
  {
    id: "trust",
    label: "Trust",
    description: "They feel confident and reassured",
    icon: "Shield",
    accent: "#3b82f6",
  },
  {
    id: "luxury",
    label: "Luxury",
    description: "They feel like they're in good hands",
    icon: "Crown",
    accent: "#d4a853",
  },
  {
    id: "curious",
    label: "Curiosity",
    description: "They want to explore and learn more",
    icon: "Search",
    accent: "#8b5cf6",
  },
  {
    id: "calm",
    label: "Calm",
    description: "They feel at ease and relaxed",
    icon: "Leaf",
    accent: "#6aa67e",
  },
  {
    id: "energized",
    label: "Energy",
    description: "They feel motivated to act now",
    icon: "Zap",
    accent: "#f97316",
  },
  {
    id: "inspired",
    label: "Inspiration",
    description: "They feel moved and excited",
    icon: "Sparkles",
    accent: "#ec4899",
  },
  {
    id: "safe",
    label: "Safety",
    description: "They know they're in the right place",
    icon: "Lock",
    accent: "#0ea5e9",
  },
  {
    id: "playful",
    label: "Delight",
    description: "They smile — it feels fun and fresh",
    icon: "Smile",
    accent: "#f59e0b",
  },
  {
    id: "authoritative",
    label: "Authority",
    description: "They see you as the clear expert",
    icon: "Award",
    accent: "#1e293b",
  },
  {
    id: "welcomed",
    label: "Welcome",
    description: "They feel personally invited in",
    icon: "DoorOpen",
    accent: "#e8a849",
  },
];

export interface VoiceComparison {
  id: string;
  context: string;
  warm: string;
  polished: string;
  direct: string;
}

export const VOICE_COMPARISONS: VoiceComparison[] = [
  {
    id: "headline",
    context: "Welcome headline",
    warm: "Hey there! We're so glad you found us.",
    polished: "Elevating your experience at every touchpoint.",
    direct: "Better results. Less hassle. Let's go.",
  },
  {
    id: "cta",
    context: "Call-to-action button",
    warm: "Let's chat about your project",
    polished: "Reserve your consultation",
    direct: "Book now",
  },
  {
    id: "quality",
    context: "Quality description",
    warm: "We pour our heart into every detail because you deserve nothing less.",
    polished: "Meticulous craftsmanship meets refined sensibility in every deliverable.",
    direct: "No shortcuts. No filler. Just work that performs.",
  },
];

export interface BrandArchetypeData {
  id: BrandArchetype;
  label: string;
  tagline: string;
  description: string;
  example: string;
  icon: string;
  accent: string;
}

export const BRAND_ARCHETYPES: BrandArchetypeData[] = [
  {
    id: "guide",
    label: "The Guide",
    tagline: "Walk beside your customer",
    description:
      "You lead people through a process with patience and clarity. You're the trusted advisor they keep coming back to.",
    example: '"Let us show you the way to a better solution."',
    icon: "Compass",
    accent: "#3b82f6",
  },
  {
    id: "expert",
    label: "The Expert",
    tagline: "Authority through mastery",
    description:
      "You lead with knowledge and credentials. Clients choose you because you know more than anyone else in your field.",
    example: '"Backed by 15 years of research and 1,000+ case studies."',
    icon: "GraduationCap",
    accent: "#1e293b",
  },
  {
    id: "creative",
    label: "The Creative",
    tagline: "Make something nobody's seen",
    description:
      "You break conventions and surprise people. Your work is original, bold, and impossible to ignore.",
    example: '"We don\'t follow trends. We start them."',
    icon: "Palette",
    accent: "#ec4899",
  },
  {
    id: "caretaker",
    label: "The Caretaker",
    tagline: "You're in the best hands",
    description:
      "You nurture, support, and protect. Clients feel safe and looked after — like family, not transactions.",
    example: '"Your wellbeing is our top priority — always."',
    icon: "Heart",
    accent: "#ef4444",
  },
  {
    id: "rebel",
    label: "The Rebel",
    tagline: "Challenge the status quo",
    description:
      "You question norms and do things differently. Your clients are drawn to your unapologetic honesty and edge.",
    example: '"Tired of the same old? Yeah, us too."',
    icon: "Flame",
    accent: "#f97316",
  },
  {
    id: "artisan",
    label: "The Artisan",
    tagline: "Craftsmanship in every detail",
    description:
      "You take pride in quality and process. Every detail is deliberate, every choice intentional.",
    example: '"Handcrafted with care. Built to last."',
    icon: "Gem",
    accent: "#8b5cf6",
  },
];

export interface AntiReferenceData {
  id: AntiReference | string;
  label: string;
  description: string;
}

/* ── Industry-Specific Anti-References ──────────────────── */

export interface IndustryAntiRefData {
  id: string;
  label: string;
  description: string;
}

/**
 * Business-type-specific anti-references shown alongside general ones.
 * Keys are siteType ids or inferred sub-types from the intake flow.
 * Each entry provides 2-3 industry-specific options.
 */
export const INDUSTRY_ANTI_REFERENCES: Record<string, IndustryAntiRefData[]> = {
  restaurant: [
    { id: "fast-food", label: "Fast Food", description: "We're not a drive-through chain" },
    { id: "cafeteria", label: "Cafeteria", description: "We're not institutional dining" },
    {
      id: "chain-restaurant",
      label: "Chain Restaurant",
      description: "We're not a franchise operation",
    },
  ],
  booking: [
    { id: "budget-salon", label: "Budget Salon", description: "We're not a walk-in discount shop" },
    { id: "medical-clinic", label: "Medical Clinic", description: "We're not cold and clinical" },
    { id: "call-center", label: "Call Center", description: "We're not impersonal phone booking" },
  ],
  spa: [
    {
      id: "budget-salon",
      label: "Budget Nail Salon",
      description: "We're not a strip-mall quick-fix",
    },
    {
      id: "medical-clinic",
      label: "Medical Clinic",
      description: "We're not sterile and clinical",
    },
  ],
  photography: [
    {
      id: "stock-agency",
      label: "Stock Photo Agency",
      description: "We're not faceless bulk content",
    },
    {
      id: "snapshot-studio",
      label: "Snapshot Studio",
      description: "We're not a mall portrait kiosk",
    },
  ],
  ecommerce: [
    { id: "flea-market", label: "Flea Market", description: "We're not a bargain-bin bazaar" },
    { id: "mega-retailer", label: "Mega Retailer", description: "We're not an Amazon clone" },
    { id: "dropship", label: "Dropship Store", description: "We're not a faceless reseller" },
  ],
  portfolio: [
    { id: "stock-agency", label: "Stock Agency", description: "We're not generic clip art" },
    {
      id: "student-project",
      label: "Student Project",
      description: "We're not a homework assignment",
    },
  ],
  blog: [
    { id: "content-farm", label: "Content Farm", description: "We're not clickbait SEO filler" },
    { id: "news-wire", label: "News Wire", description: "We're not a dry newsfeed" },
  ],
  nonprofit: [
    {
      id: "government-agency",
      label: "Government Agency",
      description: "We're not bureaucratic and stiff",
    },
    { id: "charity-guilt", label: "Guilt Trip", description: "We inspire action, not guilt" },
  ],
  educational: [
    { id: "textbook", label: "Textbook", description: "We're not dry and academic" },
    {
      id: "children-site",
      label: "Children's Site",
      description: "We're not juvenile or cartoonish",
    },
  ],
  event: [
    {
      id: "ticket-booth",
      label: "Ticket Booth",
      description: "We're not just a transaction point",
    },
    {
      id: "flyer",
      label: "Paper Flyer",
      description: "We're not a stapled bulletin board posting",
    },
  ],
  // 'personal', 'community', 'landing', 'directory' fall through — general refs only
};

export const ANTI_REFERENCES: AntiReferenceData[] = [
  // Universal negatives (nobody wants these)
  { id: "corporate", label: "Corporate", description: "Stiff, suit-and-tie, forgettable" },
  { id: "cheap", label: "Cheap", description: "Discount-bin, bargain-basement feel" },
  { id: "generic", label: "Generic", description: "Template-y, could be any business" },
  // Genuine aesthetic trade-offs (valid for some, wrong for others)
  {
    id: "minimalist",
    label: "Minimalist",
    description: "We want richness and detail, not sparse and empty",
  },
  {
    id: "maximalist",
    label: "Maximalist",
    description: "We want clean and focused, not overwhelming",
  },
  {
    id: "traditional",
    label: "Traditional",
    description: "We're forward-looking, not heritage-bound",
  },
  { id: "trendy", label: "Trendy", description: "We want timeless, not chasing the latest fad" },
  {
    id: "playful",
    label: "Playful",
    description: "We're serious about what we do, not lighthearted",
  },
  { id: "formal", label: "Formal", description: "We're approachable, not stiff and ceremonial" },
  { id: "dramatic", label: "Dramatic", description: "We're grounded and steady, not over-the-top" },
];
