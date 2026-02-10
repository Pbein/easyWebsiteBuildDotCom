"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";

interface AIQuestion {
  id: string;
  question: string;
  type: "text" | "select";
  options?: string[];
}

/* ── Lightweight sub-type inference (mirrors generateSiteSpec.ts) ── */

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

function inferBusinessSubType(siteType: string, description: string): string {
  const lower = description.toLowerCase();
  for (const [subType, keywords] of Object.entries(SUB_TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return subType;
    }
  }
  return siteType;
}

const FALLBACK_QUESTIONS: Record<string, AIQuestion[]> = {
  restaurant: [
    {
      id: "q1",
      question: "What type of cuisine do you serve, and what signature dishes should we highlight?",
      type: "text",
    },
    {
      id: "q2",
      question: "What kind of dining experience do you offer?",
      type: "select",
      options: ["Fine dining", "Casual dining", "Fast-casual", "Café/bistro"],
    },
    {
      id: "q3",
      question: "What makes your restaurant different from others in the area?",
      type: "text",
    },
    {
      id: "q4",
      question:
        "Do you offer any special experiences (tasting menus, private dining, chef's table)?",
      type: "select",
      options: ["Yes, multiple options", "One or two specials", "Not yet, but interested", "No"],
    },
  ],
  spa: [
    {
      id: "q1",
      question: "What are your most popular treatments, and what should we feature prominently?",
      type: "text",
    },
    {
      id: "q2",
      question: "What type of spa experience do you provide?",
      type: "select",
      options: [
        "Day spa (relaxation)",
        "Med spa (clinical)",
        "Wellness center (holistic)",
        "Resort spa",
      ],
    },
    {
      id: "q3",
      question: "What sets your spa apart — specific techniques, products, or philosophy?",
      type: "text",
    },
    {
      id: "q4",
      question: "Do you offer packages or memberships?",
      type: "select",
      options: ["Yes, both", "Packages only", "Memberships only", "Individual treatments only"],
    },
  ],
  photography: [
    {
      id: "q1",
      question:
        "What types of photography do you specialize in (weddings, portraits, commercial, etc.)?",
      type: "text",
    },
    {
      id: "q2",
      question: "How would you describe your photography style?",
      type: "select",
      options: ["Light & airy", "Moody & dramatic", "Documentary/candid", "Classic & timeless"],
    },
    {
      id: "q3",
      question: "What do clients most often say they love about working with you?",
      type: "text",
    },
    {
      id: "q4",
      question: "What's most important to showcase on your website?",
      type: "select",
      options: [
        "Portfolio gallery",
        "Pricing & packages",
        "Behind-the-scenes process",
        "Client testimonials",
      ],
    },
  ],
  business: [
    { id: "q1", question: "What industry or niche does your business operate in?", type: "text" },
    { id: "q2", question: "Who is your ideal customer?", type: "text" },
    { id: "q3", question: "What sets you apart from competitors?", type: "text" },
    {
      id: "q4",
      question: "Do you have any existing branding (logo, colors, tagline)?",
      type: "select",
      options: ["Yes, full branding", "Just a logo", "No, starting fresh"],
    },
  ],
  portfolio: [
    { id: "q1", question: "What type of creative work do you do?", type: "text" },
    {
      id: "q2",
      question: "How many projects do you want to showcase initially?",
      type: "select",
      options: ["3-5 highlights", "6-10 projects", "10+ full catalog"],
    },
    {
      id: "q3",
      question: "Who are you trying to impress (clients, agencies, galleries)?",
      type: "text",
    },
    {
      id: "q4",
      question: "Do you want a blog or journal section alongside your portfolio?",
      type: "select",
      options: ["Yes", "Maybe later", "No"],
    },
  ],
  ecommerce: [
    { id: "q1", question: "What products or services are you selling?", type: "text" },
    {
      id: "q2",
      question: "How many products will you launch with?",
      type: "select",
      options: ["1-10", "11-50", "50+"],
    },
    { id: "q3", question: "Who is your target buyer?", type: "text" },
    {
      id: "q4",
      question: "Do you need subscription or recurring billing?",
      type: "select",
      options: ["Yes", "No", "Not sure yet"],
    },
  ],
  blog: [
    { id: "q1", question: "What topics will you write about?", type: "text" },
    {
      id: "q2",
      question: "How often do you plan to publish?",
      type: "select",
      options: ["Daily", "Weekly", "A few times a month", "Whenever inspiration strikes"],
    },
    {
      id: "q3",
      question: "Do you want to monetize your blog?",
      type: "select",
      options: ["Yes, with ads/sponsors", "Yes, with a newsletter", "No, it's a passion project"],
    },
    { id: "q4", question: "What tone should your blog have?", type: "text" },
  ],
  booking: [
    { id: "q1", question: "What type of appointments or services do clients book?", type: "text" },
    {
      id: "q2",
      question: "How many service providers or staff members do you have?",
      type: "select",
      options: ["Just me", "2-5", "6+"],
    },
    {
      id: "q3",
      question: "Do you need payment collection at booking time?",
      type: "select",
      options: ["Yes, full payment", "Yes, deposit only", "No, pay at appointment"],
    },
    { id: "q4", question: "What's the typical duration of your services?", type: "text" },
  ],
  personal: [
    { id: "q1", question: "What's the main purpose of your personal website?", type: "text" },
    {
      id: "q2",
      question: "What sections are most important to you?",
      type: "select",
      options: ["About me + Resume", "Projects + Work", "Blog + Writing", "All of the above"],
    },
    { id: "q3", question: "What impression do you want visitors to have?", type: "text" },
    {
      id: "q4",
      question: "Will you link to social media profiles?",
      type: "select",
      options: ["Yes, prominently", "Yes, in the footer", "No"],
    },
  ],
  educational: [
    { id: "q1", question: "What subject or skill are you teaching?", type: "text" },
    {
      id: "q2",
      question: "What format will your content take?",
      type: "select",
      options: ["Written courses", "Video lessons", "Live workshops", "Mixed formats"],
    },
    {
      id: "q3",
      question: "Is it free or paid content?",
      type: "select",
      options: ["Free", "Paid", "Freemium (some free, some paid)"],
    },
    { id: "q4", question: "Who is your target learner?", type: "text" },
  ],
  community: [
    { id: "q1", question: "What brings your community together?", type: "text" },
    {
      id: "q2",
      question: "Will there be a membership or subscription?",
      type: "select",
      options: ["Yes, paid membership", "Free to join", "Tiered (free + premium)"],
    },
    {
      id: "q3",
      question: "What features matter most to your community?",
      type: "select",
      options: ["Discussion forums", "Events calendar", "Resource library", "Member directory"],
    },
    { id: "q4", question: "How large is your current community?", type: "text" },
  ],
  nonprofit: [
    { id: "q1", question: "What cause or mission does your nonprofit serve?", type: "text" },
    {
      id: "q2",
      question: "Do you need an online donation system?",
      type: "select",
      options: [
        "Yes, one-time and recurring",
        "Yes, one-time only",
        "No, we use external platforms",
      ],
    },
    {
      id: "q3",
      question: "What's most important to communicate to visitors?",
      type: "select",
      options: [
        "Our impact/results",
        "How to get involved",
        "Our story and team",
        "Upcoming events",
      ],
    },
    {
      id: "q4",
      question: "Do you need a volunteer sign-up or event registration system?",
      type: "select",
      options: ["Yes", "No", "Maybe later"],
    },
  ],
  event: [
    { id: "q1", question: "What type of event are you promoting?", type: "text" },
    {
      id: "q2",
      question: "Is it a one-time event or recurring?",
      type: "select",
      options: ["One-time", "Recurring (weekly/monthly)", "Annual"],
    },
    {
      id: "q3",
      question: "Do you need ticket sales or registration?",
      type: "select",
      options: ["Yes, paid tickets", "Yes, free registration", "No, just information"],
    },
    { id: "q4", question: "What's the expected audience size?", type: "text" },
  ],
  landing: [
    {
      id: "q1",
      question: "What single action do you want visitors to take?",
      type: "select",
      options: ["Sign up / Subscribe", "Buy a product", "Book a call", "Download something"],
    },
    { id: "q2", question: "What product, service, or offer is this page for?", type: "text" },
    {
      id: "q3",
      question: "Do you have testimonials or social proof to include?",
      type: "select",
      options: ["Yes, plenty", "A few", "Not yet"],
    },
    { id: "q4", question: "What's your unique value proposition in one sentence?", type: "text" },
  ],
  _default: [
    { id: "q1", question: "What's the primary purpose of your website?", type: "text" },
    { id: "q2", question: "Who is your target audience?", type: "text" },
    {
      id: "q3",
      question: "What's the most important thing visitors should do on your site?",
      type: "select",
      options: ["Contact you", "Buy something", "Learn more", "Sign up"],
    },
    {
      id: "q4",
      question: "Do you have existing branding to work with?",
      type: "select",
      options: ["Yes, full branding", "Just a logo", "Starting fresh"],
    },
  ],
};

export const generateQuestions = action({
  args: {
    siteType: v.string(),
    goal: v.string(),
    description: v.string(),
    personality: v.array(v.float64()),
    businessName: v.string(),
    emotionalGoals: v.optional(v.array(v.string())),
    voiceProfile: v.optional(v.string()),
    brandArchetype: v.optional(v.string()),
    antiReferences: v.optional(v.array(v.string())),
    narrativePrompts: v.optional(v.any()),
  },
  handler: async (_ctx, args): Promise<AIQuestion[]> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Infer sub-type for industry-specific questions
    const subType = inferBusinessSubType(args.siteType, args.description);

    if (!apiKey) {
      return (
        FALLBACK_QUESTIONS[subType] ||
        FALLBACK_QUESTIONS[subType] ||
        FALLBACK_QUESTIONS[args.siteType] ||
        FALLBACK_QUESTIONS._default
      );
    }

    try {
      const client = new Anthropic({ apiKey });

      const subTypeLabel = subType !== args.siteType ? ` (specifically a ${subType})` : "";
      const businessContext = args.businessName
        ? `You are discovering details for "${args.businessName}", a ${args.siteType}${subTypeLabel} website. Their description: "${args.description}".`
        : `You are discovering details for a ${args.siteType}${subTypeLabel} website. Their description: "${args.description}".`;

      // Build character context section
      const characterLines: string[] = [];
      if (args.emotionalGoals?.length) {
        characterLines.push(
          `Emotional goals: ${args.emotionalGoals.join(", ")}. Ask questions that dig deeper into their emotional vision — what does "${args.emotionalGoals[0]}" look like specifically for their audience?`
        );
      }
      if (args.voiceProfile) {
        characterLines.push(
          `Voice profile: ${args.voiceProfile}. Match your question phrasing to their ${args.voiceProfile} voice preference.`
        );
      }
      if (args.brandArchetype) {
        characterLines.push(
          `Brand archetype: ${args.brandArchetype}. Focus on what makes this archetype's content unique for their business.`
        );
      }
      if (args.antiReferences?.length) {
        characterLines.push(
          `Anti-references (what they DON'T want): ${args.antiReferences.join(", ")}. Avoid asking about approaches they've already rejected.`
        );
      }
      const narrativePrompts = args.narrativePrompts as Record<string, string> | undefined;
      if (narrativePrompts && Object.values(narrativePrompts).some((v) => v)) {
        characterLines.push(
          `They've shared these narrative prompts — build on the story they've started telling:`
        );
        if (narrativePrompts.come_because)
          characterLines.push(
            `  - People come to them because: "${narrativePrompts.come_because}"`
          );
        if (narrativePrompts.frustrated_with)
          characterLines.push(
            `  - Customers are frustrated with: "${narrativePrompts.frustrated_with}"`
          );
        if (narrativePrompts.after_feel)
          characterLines.push(
            `  - After working together, clients feel: "${narrativePrompts.after_feel}"`
          );
      }
      const characterContext =
        characterLines.length > 0
          ? `\n\nBRAND CHARACTER CONTEXT:\n${characterLines.join("\n")}`
          : "";

      const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `You are an expert web design consultant conducting a discovery session. ${businessContext}${characterContext}

Generate exactly 4 targeted follow-up questions to gather the specific details needed to build their website.

Return a JSON array of questions. Each question has:
- "id": "q1" through "q4"
- "question": The question text
- "type": Either "text" for open-ended or "select" for multiple choice
- "options": Array of 3-4 option strings (only if type is "select")

Guidelines:
- Ask questions specific to their industry and business type. Reference their business by name when relevant.
- NEVER ask generic questions like "What's your business name?" or "What type of website do you want?" — we already know these.
- If this is a specific sub-type (restaurant, spa, photography), ask industry-specific questions: e.g. cuisine type and signature dishes for restaurants, treatment specialties for spas, photography style and session types for photographers.
- Focus on: content specifics (what services/products to highlight), visual preferences, target audience details, and differentiators
- Mix text and select types (at least 1 of each)
- Keep questions concise and clear

Return ONLY the JSON array, no markdown fencing or explanation.`,
        messages: [
          {
            role: "user",
            content: `Business Name: ${args.businessName || "Not provided"}
Site Type: ${args.siteType}
Goal: ${args.goal}
Description: ${args.description}
Personality Vector: [${args.personality.join(", ")}] (axes: minimal_rich, playful_serious, warm_cool, light_bold, classic_modern, calm_dynamic)
${args.emotionalGoals?.length ? `Emotional Goals: ${args.emotionalGoals.join(", ")}` : ""}
${args.voiceProfile ? `Voice: ${args.voiceProfile}` : ""}
${args.brandArchetype ? `Archetype: ${args.brandArchetype}` : ""}
${args.antiReferences?.length ? `Anti-references: ${args.antiReferences.join(", ")}` : ""}

Generate 4 discovery questions for this client.`,
          },
        ],
      });

      const textBlock = message.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        return (
          FALLBACK_QUESTIONS[subType] ||
          FALLBACK_QUESTIONS[args.siteType] ||
          FALLBACK_QUESTIONS._default
        );
      }

      let raw = textBlock.text.trim();
      // Strip markdown code fencing if present
      if (raw.startsWith("```")) {
        raw = raw.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
      }

      const parsed = JSON.parse(raw) as AIQuestion[];
      if (Array.isArray(parsed) && parsed.length >= 2) {
        return parsed;
      }

      return (
        FALLBACK_QUESTIONS[subType] ||
        FALLBACK_QUESTIONS[args.siteType] ||
        FALLBACK_QUESTIONS._default
      );
    } catch (error) {
      console.error("Failed to generate AI questions:", error);
      return (
        FALLBACK_QUESTIONS[subType] ||
        FALLBACK_QUESTIONS[args.siteType] ||
        FALLBACK_QUESTIONS._default
      );
    }
  },
});
