/**
 * Tests for convex/ai/designChat.ts deterministic fallback logic.
 *
 * Since the Convex action cannot be imported into Vitest, we replicate
 * the deterministic fallback function and test it directly.
 */

import { describe, it, expect } from "vitest";
import { getSourceHash } from "../../helpers/convex-staleness";

// ---------------------------------------------------------------------------
// Replicated deterministic response logic (mirrors convex/ai/designChat.ts)
// ---------------------------------------------------------------------------

interface DesignPatch {
  type: string;
  description: string;
  payload: Record<string, unknown>;
}

interface DesignChatResponse {
  message: string;
  patches: DesignPatch[];
}

function generateDeterministicResponse(message: string): DesignChatResponse {
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

/**
 * @requirements
 * - [REQ-1]: Design chat returns structured patches with type/description/payload (Source: DesignChat.tsx DesignPatch interface)
 * - [REQ-2]: Deterministic fallback provides useful responses when AI is unavailable (Source: CLAUDE.md dual-path generation)
 * - [REQ-3]: Patch types are one of: adjust_theme, rewrite_copy, add_component, remove_component (Source: DesignChat.tsx)
 * - [REQ-4]: adjust_theme payloads use ThemeTokens keys (camelCase), not CSS property names (Source: designChat.ts system prompt)
 * - [REQ-5]: Unrecognized messages return helpful guidance with no patches (Source: UX requirement)
 */
describe("designChat deterministic fallback", () => {
  // Staleness guard — if this fails, convex/ai/designChat.ts was modified.
  // Update the replicated deterministic response logic above to match, then update the hash.
  it("staleness guard — source file unchanged", () => {
    expect(getSourceHash("convex/ai/designChat.ts")).toBe("2cb78596ce454511");
  });

  describe("dark theme requests (Requirement)", () => {
    it("returns adjust_theme patch for 'make it dark'", () => {
      const result = generateDeterministicResponse("make it dark");
      expect(result.patches).toHaveLength(1);
      expect(result.patches[0].type).toBe("adjust_theme");
    });

    it("responds to 'darker' keyword", () => {
      const result = generateDeterministicResponse("I want a darker background");
      expect(result.patches).toHaveLength(1);
      expect(result.patches[0].type).toBe("adjust_theme");
    });

    it("dark theme uses actually dark colors", () => {
      const result = generateDeterministicResponse("make it dark");
      const payload = result.patches[0].payload;

      // Background should be a very dark color (low hex values)
      const bg = payload.colorBackground as string;
      expect(bg).toMatch(/^#[0-9a-f]{6}$/i);
      // Parse the red channel — should be very low for a dark theme
      const red = parseInt(bg.slice(1, 3), 16);
      expect(red).toBeLessThan(30);

      // Text should be light for contrast
      const text = payload.colorText as string;
      const textRed = parseInt(text.slice(1, 3), 16);
      expect(textRed).toBeGreaterThan(200);
    });

    it("uses camelCase ThemeTokens keys, not CSS properties", () => {
      const result = generateDeterministicResponse("dark mode please");
      const payload = result.patches[0].payload;

      // Should use camelCase keys
      expect(payload).toHaveProperty("colorBackground");
      expect(payload).toHaveProperty("colorSurface");
      expect(payload).toHaveProperty("colorText");

      // Should NOT use CSS property names
      expect(payload).not.toHaveProperty("--color-background");
      expect(payload).not.toHaveProperty("color-background");
      expect(payload).not.toHaveProperty("background-color");
    });
  });

  describe("light theme requests (Requirement)", () => {
    it("returns adjust_theme patch for 'make it light'", () => {
      const result = generateDeterministicResponse("make it light");
      expect(result.patches).toHaveLength(1);
      expect(result.patches[0].type).toBe("adjust_theme");
    });

    it("responds to 'brighter' keyword", () => {
      const result = generateDeterministicResponse("can you make it bright?");
      expect(result.patches).toHaveLength(1);
    });

    it("light theme uses actually light colors", () => {
      const result = generateDeterministicResponse("lighter please");
      const payload = result.patches[0].payload;

      // Background should be white or near-white
      const bg = payload.colorBackground as string;
      const red = parseInt(bg.slice(1, 3), 16);
      expect(red).toBeGreaterThan(240);

      // Text should be dark for contrast
      const text = payload.colorText as string;
      const textRed = parseInt(text.slice(1, 3), 16);
      expect(textRed).toBeLessThan(50);
    });
  });

  describe("bold/bigger typography requests (Requirement)", () => {
    it("returns adjust_theme patch for 'bigger'", () => {
      const result = generateDeterministicResponse("make the text bigger");
      expect(result.patches).toHaveLength(1);
      expect(result.patches[0].type).toBe("adjust_theme");
    });

    it("responds to 'bold' keyword", () => {
      const result = generateDeterministicResponse("make it more bold");
      expect(result.patches).toHaveLength(1);
    });

    it("responds to 'larger' keyword", () => {
      const result = generateDeterministicResponse("larger headings");
      expect(result.patches).toHaveLength(1);
    });

    it("typography changes use clamp() for responsive sizing", () => {
      const result = generateDeterministicResponse("bigger text");
      const payload = result.patches[0].payload;

      // At least one value should use clamp() for responsive sizing
      const values = Object.values(payload).filter((v) => typeof v === "string");
      const hasClamp = values.some((v) => typeof v === "string" && v.includes("clamp("));
      expect(hasClamp).toBe(true);
    });
  });

  describe("unrecognized requests (Boundary)", () => {
    it("returns empty patches for unrecognized messages", () => {
      const result = generateDeterministicResponse("add a unicorn to my website");
      expect(result.patches).toHaveLength(0);
    });

    it("returns a helpful guidance message", () => {
      const result = generateDeterministicResponse("something random");
      expect(result.message).toBeTruthy();
      expect(result.message.length).toBeGreaterThan(20);
      // Should suggest specific actions users can try
      expect(result.message.toLowerCase()).toContain("specific");
    });
  });

  describe("response structure contract (Contract)", () => {
    const testCases = ["dark mode", "lighter theme", "bigger text", "something unknown"];

    testCases.forEach((input) => {
      it(`response for "${input}" has required message and patches fields`, () => {
        const result = generateDeterministicResponse(input);
        expect(result).toHaveProperty("message");
        expect(result).toHaveProperty("patches");
        expect(typeof result.message).toBe("string");
        expect(Array.isArray(result.patches)).toBe(true);
      });

      it(`each patch for "${input}" has type, description, and payload`, () => {
        const result = generateDeterministicResponse(input);
        for (const patch of result.patches) {
          expect(patch).toHaveProperty("type");
          expect(patch).toHaveProperty("description");
          expect(patch).toHaveProperty("payload");
          expect(typeof patch.type).toBe("string");
          expect(typeof patch.description).toBe("string");
          expect(typeof patch.payload).toBe("object");
        }
      });
    });

    it("patch types are from the allowed set", () => {
      const allowedTypes = ["adjust_theme", "rewrite_copy", "add_component", "remove_component"];

      // Test all paths that produce patches
      const inputs = ["dark", "light", "bold"];
      for (const input of inputs) {
        const result = generateDeterministicResponse(input);
        for (const patch of result.patches) {
          expect(allowedTypes).toContain(patch.type);
        }
      }
    });
  });

  describe("case insensitivity (Invariant)", () => {
    it("responds to 'DARK' the same as 'dark'", () => {
      const lower = generateDeterministicResponse("dark");
      const upper = generateDeterministicResponse("DARK");
      expect(lower.patches.length).toBe(upper.patches.length);
      expect(lower.patches[0].type).toBe(upper.patches[0].type);
    });

    it("responds to 'Make It LIGHTER' the same as 'lighter'", () => {
      const mixed = generateDeterministicResponse("Make It LIGHTER");
      const lower = generateDeterministicResponse("lighter");
      expect(mixed.patches.length).toBe(lower.patches.length);
    });
  });
});
