import { action } from "../_generated/server";
import { v } from "convex/values";

/**
 * AI Design Chat action.
 *
 * Receives a natural language instruction + current spec context,
 * returns structured patches and a human-readable message.
 *
 * Uses Claude API with XML prompt boundaries for injection prevention.
 */
export const chat = action({
  args: {
    sessionId: v.string(),
    message: v.string(),
    currentSpec: v.string(),
  },
  handler: async (
    _ctx,
    args
  ): Promise<{
    message: string;
    patches: Array<{
      type: string;
      description: string;
      payload: Record<string, unknown>;
    }>;
  }> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Deterministic fallback when no API key
      return generateDeterministicResponse(args.message);
    }

    try {
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey });

      const response = await client.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `<system>
You are a web design assistant helping users customize their website.
Given the user's request and current site context, suggest specific design changes.

Respond with JSON in this exact format:
{
  "message": "A friendly explanation of what you'll change",
  "patches": [
    {
      "type": "adjust_theme" | "rewrite_copy" | "add_component" | "remove_component",
      "description": "Human-readable description of this change",
      "payload": { ...relevant data }
    }
  ]
}

For adjust_theme: payload should have ThemeTokens keys (camelCase) and CSS values. Valid keys include: colorPrimary, colorPrimaryLight, colorPrimaryDark, colorSecondary, colorAccent, colorBackground, colorSurface, colorSurfaceElevated, colorText, colorTextSecondary, colorBorder, fontHeading, fontBody, radiusSm, radiusMd, radiusLg, radiusXl, spaceSection, spaceComponent, transitionFast, transitionBase, transitionSlow. Example: {"colorBackground": "#0a0a0a", "colorText": "#f5f5f5"}
For rewrite_copy: payload should have componentIndex (0-based number matching component order), field (the content field name like "headline", "subheadline", "body", "ctaText"), and newValue (the new string).
For add_component: payload should have componentId, variant, order, and content (not yet supported, will be deferred).
For remove_component: payload should have componentIndex (not yet supported, will be deferred).

Keep changes focused and minimal. Only change what the user asks for.
</system>

<user-input>
Current site context:
${args.currentSpec}

User request: ${args.message}
</user-input>`,
          },
        ],
      });

      // Parse the AI response
      const text = response.content[0].type === "text" ? response.content[0].text : "";

      // Extract JSON from response (may be wrapped in markdown code blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as {
          message: string;
          patches: Array<{
            type: string;
            description: string;
            payload: Record<string, unknown>;
          }>;
        };
        return {
          message: parsed.message || "Here are my suggested changes:",
          patches: parsed.patches || [],
        };
      }

      // If no JSON found, return the text as a message with no patches
      return {
        message:
          text ||
          "I understand your request but couldn't generate specific changes. Could you be more specific?",
        patches: [],
      };
    } catch (err) {
      console.error("Design chat AI error:", err);
      return generateDeterministicResponse(args.message);
    }
  },
});

/**
 * Deterministic fallback for when AI is unavailable.
 */
function generateDeterministicResponse(message: string): {
  message: string;
  patches: Array<{
    type: string;
    description: string;
    payload: Record<string, unknown>;
  }>;
} {
  const lower = message.toLowerCase();

  if (lower.includes("dark") || lower.includes("darker")) {
    return {
      message: "I'll darken the overall theme by adjusting the background and reducing brightness.",
      patches: [
        {
          type: "adjust_theme",
          description: "Darken background colors",
          payload: {
            colorBackground: "#0a0a0a",
            colorSurface: "#141414",
            colorText: "#f5f5f5",
          },
        },
      ],
    };
  }

  if (lower.includes("light") || lower.includes("lighter") || lower.includes("bright")) {
    return {
      message: "I'll brighten the theme with a lighter background and darker text.",
      patches: [
        {
          type: "adjust_theme",
          description: "Lighten background colors",
          payload: {
            colorBackground: "#ffffff",
            colorSurface: "#f8f9fa",
            colorText: "#1a1a1a",
          },
        },
      ],
    };
  }

  if (lower.includes("bold") || lower.includes("bigger") || lower.includes("larger")) {
    return {
      message: "I'll increase the visual weight with bolder typography.",
      patches: [
        {
          type: "adjust_theme",
          description: "Increase heading size and weight",
          payload: {
            text5xl: "clamp(2.5rem, 5vw, 4rem)",
            text6xl: "clamp(3rem, 6vw, 4.5rem)",
          },
        },
      ],
    };
  }

  return {
    message:
      "I can help with that! Try being more specific, like 'make the hero darker', 'change the headline to...', or 'add a testimonials section'.",
    patches: [],
  };
}
