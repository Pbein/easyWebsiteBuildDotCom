import { describe, it, expect } from "vitest";
import type { ScreenshotResult } from "@/lib/screenshot/types";

describe("ScreenshotResult type", () => {
  it("can construct a valid client screenshot result", () => {
    const result: ScreenshotResult = {
      base64: "iVBORw0KGgoAAAANSUhEUg==",
      width: 1280,
      height: 900,
      captureMethod: "client",
      capturedAt: Date.now(),
    };

    expect(result.base64).toBeTruthy();
    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
    expect(result.captureMethod).toBe("client");
    expect(result.capturedAt).toBeGreaterThan(0);
  });

  it("can construct a valid server screenshot result", () => {
    const result: ScreenshotResult = {
      base64: "iVBORw0KGgoAAAANSUhEUg==",
      width: 768,
      height: 1024,
      captureMethod: "server",
      capturedAt: Date.now(),
    };

    expect(result.captureMethod).toBe("server");
  });

  it("distinguishes client vs server capture methods", () => {
    const clientResult: ScreenshotResult = {
      base64: "abc",
      width: 100,
      height: 100,
      captureMethod: "client",
      capturedAt: 0,
    };

    const serverResult: ScreenshotResult = {
      base64: "abc",
      width: 100,
      height: 100,
      captureMethod: "server",
      capturedAt: 0,
    };

    expect(clientResult.captureMethod).not.toBe(serverResult.captureMethod);
  });
});
