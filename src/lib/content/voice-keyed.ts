/* ──────────────────────────────────────────────────────────
 * Voice-Keyed Content
 *
 * Pure template lookups that return voice-appropriate headlines
 * and CTA text. Extracted from convex/ai/generateSiteSpec.ts
 * for client-side use in the Brand Discovery sidebar.
 *
 * Zero AI dependency — 100% deterministic.
 * ────────────────────────────────────────────────────────── */

export type VoiceTone = "warm" | "polished" | "direct";

/**
 * Returns a voice-keyed hero headline for the given business.
 * Falls back through subType → siteType → "business" default.
 */
export function getVoiceKeyedHeadline(
  businessName: string,
  siteType: string,
  voiceTone: VoiceTone,
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

  const voiceMap = headlinesByVoice[voiceTone] || headlinesByVoice.polished;
  return (subType && voiceMap[subType]) || voiceMap[siteType] || voiceMap.business;
}

/**
 * Returns a voice-keyed CTA headline/button text.
 * Falls back through subType → goal → default.
 */
export function getVoiceKeyedCtaText(
  goal: string,
  voiceTone: VoiceTone,
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
