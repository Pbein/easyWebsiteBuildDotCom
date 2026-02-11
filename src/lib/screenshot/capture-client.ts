import type { ScreenshotResult } from "./types";

/**
 * Captures a DOM element as a PNG screenshot using html2canvas.
 * Waits for fonts to load and a brief settle delay before capturing.
 */
export async function capturePreviewScreenshot(
  element: HTMLElement,
  options?: { width?: number; scale?: number }
): Promise<ScreenshotResult> {
  // Wait for web fonts to finish loading
  await document.fonts.ready;
  // Brief delay for paint/layout to settle after fonts load
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Dynamic import to keep html2canvas out of the main bundle
  const html2canvas = (await import("html2canvas")).default;

  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: options?.scale ?? 1,
    windowWidth: options?.width,
    // Cap height at 4000px to keep base64 manageable for VLM (~1-2MB)
    height: Math.min(element.scrollHeight, 4000),
    logging: false,
  });

  const dataUrl = canvas.toDataURL("image/png");
  const base64 = dataUrl.replace("data:image/png;base64,", "");

  return {
    base64,
    width: canvas.width,
    height: canvas.height,
    captureMethod: "client",
    capturedAt: Date.now(),
  };
}
