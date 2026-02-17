/**
 * Integration tests for the PostMessage communication protocol
 * used between parent preview page and iframe render page.
 *
 * @requirements
 * - [REQ-1]: All EWB messages use `ewb:` prefix (Source: CLAUDE.md iframe preview)
 * - [REQ-2]: isParentMessage validates object shape + ewb: prefix (Source: postmessage-utils.ts)
 * - [REQ-3]: Non-EWB messages are rejected (Source: postmessage-utils.ts type guard contract)
 *
 * @tested-module src/lib/iframe/postmessage-utils.ts
 */

import { describe, it, expect } from "vitest";
import { isParentMessage } from "@/lib/iframe/postmessage-utils";
import { createEwbMessage, simulateParentMessage } from "../helpers/postmessage-helpers";

describe("PostMessage Protocol", () => {
  describe("isParentMessage (production type guard)", () => {
    it("returns true for ewb:set-theme message", () => {
      expect(isParentMessage({ type: "ewb:set-theme" })).toBe(true);
    });

    it("returns true for ewb:set-page message", () => {
      expect(isParentMessage({ type: "ewb:set-page" })).toBe(true);
    });

    it("returns true for ewb:request-screenshot message", () => {
      expect(isParentMessage({ type: "ewb:request-screenshot" })).toBe(true);
    });

    it("returns true for ewb:update-content message", () => {
      expect(isParentMessage({ type: "ewb:update-content" })).toBe(true);
    });

    it("returns true for ewb:reset-content message", () => {
      expect(isParentMessage({ type: "ewb:reset-content" })).toBe(true);
    });

    it("returns false for message without ewb: prefix", () => {
      expect(isParentMessage({ type: "not-ewb" })).toBe(false);
    });

    it("returns false for object without type field", () => {
      expect(isParentMessage({ foo: "bar" })).toBe(false);
    });

    it("returns false for null", () => {
      expect(isParentMessage(null)).toBe(false);
    });

    it("returns false for string value", () => {
      expect(isParentMessage("string")).toBe(false);
    });

    it("returns false for number value", () => {
      expect(isParentMessage(42)).toBe(false);
    });

    it("returns false when type field is not a string", () => {
      expect(isParentMessage({ type: 123 })).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isParentMessage(undefined)).toBe(false);
    });
  });

  describe("createEwbMessage (test helper)", () => {
    it("creates message with just type", () => {
      const msg = createEwbMessage("ewb:reset-content");
      expect(msg).toEqual({ type: "ewb:reset-content" });
    });

    it("creates message with payload", () => {
      const msg = createEwbMessage("ewb:set-page", { activePage: "/about" });
      expect(msg).toEqual({ type: "ewb:set-page", activePage: "/about" });
    });

    it("creates message with complex payload", () => {
      const msg = createEwbMessage("ewb:update-content", {
        overrides: { 0: { headline: "New" } },
      });
      expect(msg).toEqual({
        type: "ewb:update-content",
        overrides: { 0: { headline: "New" } },
      });
      expect(msg.overrides).toBeDefined();
    });
  });

  describe("simulateParentMessage", () => {
    it("dispatches MessageEvent on target window that can be received by addEventListener", () => {
      return new Promise<void>((resolve) => {
        const testMessage = createEwbMessage("ewb:set-theme", {
          theme: { colorPrimary: "#ff0000" },
        });

        const handler = (event: MessageEvent): void => {
          expect(event.data).toEqual(testMessage);
          expect(event.data.type).toBe("ewb:set-theme");
          expect(event.data.theme).toEqual({ colorPrimary: "#ff0000" });
          window.removeEventListener("message", handler);
          resolve();
        };

        window.addEventListener("message", handler);
        simulateParentMessage(window, testMessage);
      });
    });
  });
});
