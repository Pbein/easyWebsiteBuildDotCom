export interface ScreenshotResult {
  /** Raw base64 string (no data: prefix) */
  base64: string;
  width: number;
  height: number;
  captureMethod: "client" | "server";
  capturedAt: number;
}
