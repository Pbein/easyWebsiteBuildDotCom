import { describe, it, expect } from "vitest";
import {
  createEwbMessage,
  simulateParentMessage,
  isEwbMessage,
} from "../helpers/postmessage-helpers";

describe("PostMessage Protocol", () => {
  describe("isEwbMessage", () => {
    it("returns true for ewb:set-theme message", () => {
      expect(isEwbMessage({ type: "ewb:set-theme" })).toBe(true);
    });

    it("returns true for ewb:render-ready message", () => {
      expect(isEwbMessage({ type: "ewb:render-ready" })).toBe(true);
    });

    it("returns false for message without ewb: prefix", () => {
      expect(isEwbMessage({ type: "not-ewb" })).toBe(false);
    });

    it("returns false for object without type field", () => {
      expect(isEwbMessage({ foo: "bar" })).toBe(false);
    });

    it("returns false for null", () => {
      expect(isEwbMessage(null)).toBe(false);
    });

    it("returns false for string value", () => {
      expect(isEwbMessage("string")).toBe(false);
    });

    it("returns false for number value", () => {
      expect(isEwbMessage(42)).toBe(false);
    });

    it("returns false when type field is not a string", () => {
      expect(isEwbMessage({ type: 123 })).toBe(false);
    });
  });

  describe("createEwbMessage", () => {
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
