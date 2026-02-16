import { describe, it, expect } from "vitest";
import { generateShareId } from "@/lib/share/generate-share-id";

describe("generateShareId", () => {
  it("returns a 10-character string", () => {
    const id = generateShareId();
    expect(typeof id).toBe("string");
    expect(id).toHaveLength(10);
  });

  it("returns only alphanumeric characters", () => {
    const id = generateShareId();
    expect(id).toMatch(/^[A-Za-z0-9]{10}$/);
  });

  it("produces different IDs on successive calls", () => {
    const id1 = generateShareId();
    const id2 = generateShareId();
    // With 62^10 possibilities, collision is effectively impossible
    expect(id1).not.toBe(id2);
  });

  it("generates 100 valid IDs without collisions", () => {
    const ids = new Set<string>();
    const pattern = /^[A-Za-z0-9]{10}$/;

    for (let i = 0; i < 100; i++) {
      const id = generateShareId();
      expect(id).toMatch(pattern);
      ids.add(id);
    }

    // All 100 should be unique
    expect(ids.size).toBe(100);
  });
});
