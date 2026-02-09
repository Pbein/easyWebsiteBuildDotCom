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

const FALLBACK_QUESTIONS: Record<string, AIQuestion[]> = {
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
  },
  handler: async (_ctx, args): Promise<AIQuestion[]> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return FALLBACK_QUESTIONS[args.siteType] || FALLBACK_QUESTIONS._default;
    }

    try {
      const client = new Anthropic({ apiKey });

      const businessContext = args.businessName
        ? `You are discovering details for "${args.businessName}", a ${args.siteType} website. Their description: "${args.description}".`
        : `You are discovering details for a ${args.siteType} website. Their description: "${args.description}".`;

      const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `You are an expert web design consultant conducting a discovery session. ${businessContext}

Generate exactly 4 targeted follow-up questions to gather the specific details needed to build their website.

Return a JSON array of questions. Each question has:
- "id": "q1" through "q4"
- "question": The question text
- "type": Either "text" for open-ended or "select" for multiple choice
- "options": Array of 3-4 option strings (only if type is "select")

Guidelines:
- Ask questions specific to their industry and business type. Reference their business by name when relevant.
- NEVER ask generic questions like "What's your business name?" or "What type of website do you want?" — we already know these.
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

Generate 4 discovery questions for this client.`,
          },
        ],
      });

      const textBlock = message.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        return FALLBACK_QUESTIONS[args.siteType] || FALLBACK_QUESTIONS._default;
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

      return FALLBACK_QUESTIONS[args.siteType] || FALLBACK_QUESTIONS._default;
    } catch (error) {
      console.error("Failed to generate AI questions:", error);
      return FALLBACK_QUESTIONS[args.siteType] || FALLBACK_QUESTIONS._default;
    }
  },
});
