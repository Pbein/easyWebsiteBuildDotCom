import { describe, it, expect } from "vitest";
import {
  getVoiceKeyedHeadline,
  getVoiceKeyedCtaText,
  type VoiceTone,
} from "@/lib/content/voice-keyed";

describe("getVoiceKeyedHeadline", () => {
  const businessName = "Bella's Bistro";

  it("warm tone for restaurant includes business name and warm language", () => {
    const result = getVoiceKeyedHeadline(businessName, "restaurant", "warm");
    expect(result).toContain(businessName);
    // Warm restaurant headline: "Welcome to ... pull up a chair, stay a while"
    expect(result.toLowerCase()).toContain("welcome");
  });

  it("polished tone for business includes business name and formal language", () => {
    const result = getVoiceKeyedHeadline(businessName, "business", "polished");
    expect(result).toContain(businessName);
    // Polished business headline: "Where Excellence Meets Precision"
    expect(result).toContain("Excellence");
  });

  it("direct tone for portfolio includes business name and direct language", () => {
    const result = getVoiceKeyedHeadline(businessName, "portfolio", "direct");
    expect(result).toContain(businessName);
    // Direct portfolio: "Work that speaks for itself."
    expect(result.toLowerCase()).toContain("work");
  });

  it("all 3 tones produce different output for the same inputs", () => {
    const warm = getVoiceKeyedHeadline(businessName, "restaurant", "warm");
    const polished = getVoiceKeyedHeadline(businessName, "restaurant", "polished");
    const direct = getVoiceKeyedHeadline(businessName, "restaurant", "direct");

    expect(warm).not.toBe(polished);
    expect(polished).not.toBe(direct);
    expect(warm).not.toBe(direct);
  });

  it("all 13 site types return non-empty strings for each voice tone", () => {
    const siteTypes = [
      "restaurant",
      "spa",
      "photography",
      "business",
      "portfolio",
      "ecommerce",
      "booking",
      "blog",
      "personal",
      "educational",
      "nonprofit",
      "event",
      "landing",
    ];
    const tones: VoiceTone[] = ["warm", "polished", "direct"];

    for (const siteType of siteTypes) {
      for (const tone of tones) {
        const result = getVoiceKeyedHeadline("TestBiz", siteType, tone);
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
      }
    }
  });

  it("unknown siteType falls back to business template", () => {
    const result = getVoiceKeyedHeadline(businessName, "unknown-type", "warm");
    const businessResult = getVoiceKeyedHeadline(businessName, "business", "warm");
    expect(result).toBe(businessResult);
  });

  it("unknown voiceTone falls back to polished", () => {
    // Cast to bypass TypeScript — testing runtime fallback behavior
    const result = getVoiceKeyedHeadline(businessName, "restaurant", "unknown-tone" as VoiceTone);
    const polishedResult = getVoiceKeyedHeadline(businessName, "restaurant", "polished");
    expect(result).toBe(polishedResult);
  });

  it("subType overrides siteType when available", () => {
    // Using "restaurant" as subType but "business" as siteType
    const withSubType = getVoiceKeyedHeadline(businessName, "business", "warm", "restaurant");
    const restaurantDirect = getVoiceKeyedHeadline(businessName, "restaurant", "warm");
    // SubType "restaurant" should resolve to the restaurant template
    expect(withSubType).toBe(restaurantDirect);
  });
});

describe("getVoiceKeyedCtaText", () => {
  it("warm + contact returns 'Let\\'s chat'", () => {
    const result = getVoiceKeyedCtaText("contact", "warm", []);
    expect(result).toBe("Let's chat");
  });

  it("polished + book returns 'Reserve Your Experience'", () => {
    const result = getVoiceKeyedCtaText("book", "polished", []);
    expect(result).toBe("Reserve Your Experience");
  });

  it("direct + sell returns 'Shop now'", () => {
    const result = getVoiceKeyedCtaText("sell", "direct", []);
    expect(result).toBe("Shop now");
  });

  it("anti-reference 'salesy' changes warm + sell output to browse language", () => {
    const withoutAntiRef = getVoiceKeyedCtaText("sell", "warm", []);
    const withAntiRef = getVoiceKeyedCtaText("sell", "warm", ["salesy"]);

    expect(withoutAntiRef).toBe("Shop now");
    expect(withAntiRef).toBe("Browse the collection");
    expect(withAntiRef).not.toBe(withoutAntiRef);
  });

  it("anti-reference 'salesy' changes warm + book output", () => {
    const withoutAntiRef = getVoiceKeyedCtaText("book", "warm", []);
    const withAntiRef = getVoiceKeyedCtaText("book", "warm", ["salesy"]);

    expect(withoutAntiRef).toBe("Book your spot");
    expect(withAntiRef).toBe("See what's available");
    expect(withAntiRef).not.toBe(withoutAntiRef);
  });

  it("subType restaurant + warm + book returns restaurant-specific CTA", () => {
    const result = getVoiceKeyedCtaText("book", "warm", [], "restaurant");
    expect(result).toBe("Come dine with us");
  });

  it("unknown goal falls back gracefully and returns a string", () => {
    const result = getVoiceKeyedCtaText("unknown-goal", "warm", []);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
