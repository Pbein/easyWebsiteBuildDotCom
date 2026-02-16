/**
 * Test helpers for the PostMessage communication protocol
 * used between the parent preview page and the iframe render page.
 *
 * All EWB messages use the `ewb:` prefix to avoid collisions
 * with other window message traffic.
 *
 * Message types:
 * - ewb:set-theme       — Parent → iframe: apply theme tokens
 * - ewb:set-page        — Parent → iframe: switch active page
 * - ewb:request-screenshot — Parent → iframe: capture screenshot
 * - ewb:update-content  — Parent → iframe: patch component content
 * - ewb:reset-content   — Parent → iframe: clear content overrides
 * - ewb:render-ready    — Iframe → parent: spec loaded, ready to render
 */

import type { ThemeTokens } from "@/lib/theme/theme.types";

/**
 * Known EWB PostMessage type strings.
 */
export type EwbMessageType =
  | "ewb:set-theme"
  | "ewb:set-page"
  | "ewb:request-screenshot"
  | "ewb:update-content"
  | "ewb:reset-content"
  | "ewb:render-ready";

/**
 * Union of all valid EWB message shapes.
 */
export type EwbMessage =
  | { type: "ewb:set-theme"; theme: ThemeTokens }
  | { type: "ewb:set-page"; activePage: string }
  | { type: "ewb:request-screenshot"; requestId: string }
  | { type: "ewb:update-content"; overrides: Record<number, Record<string, string>> }
  | { type: "ewb:reset-content" }
  | { type: "ewb:render-ready" };

/**
 * Creates a properly formed EWB PostMessage object.
 *
 * @param type - The `ewb:` prefixed message type
 * @param payload - Additional fields to spread into the message
 * @returns A message object with `type` and any extra payload fields
 *
 * @example
 * ```ts
 * const msg = createEwbMessage("ewb:set-page", { activePage: "/about" });
 * // { type: "ewb:set-page", activePage: "/about" }
 * ```
 */
export function createEwbMessage(
  type: string,
  payload?: Record<string, unknown>
): { type: string } & Record<string, unknown> {
  return { type, ...payload };
}

/**
 * Dispatches a MessageEvent on the target window, simulating
 * a postMessage received from a parent or iframe.
 *
 * @param targetWindow - The window to dispatch the event on
 * @param msg - The message data (will become `event.data`)
 * @param origin - The origin string for the MessageEvent (defaults to current location origin)
 *
 * @example
 * ```ts
 * const msg = createEwbMessage("ewb:set-theme", { theme: myTokens });
 * simulateParentMessage(window, msg);
 * ```
 */
export function simulateParentMessage(targetWindow: Window, msg: unknown, origin?: string): void {
  const resolvedOrigin = origin ?? targetWindow.location.origin;

  const event = new MessageEvent("message", {
    data: msg,
    origin: resolvedOrigin,
    source: targetWindow,
  });

  targetWindow.dispatchEvent(event);
}

/**
 * Type guard that checks whether `data` is an EWB-prefixed message.
 *
 * A value qualifies if it is a non-null object with a `type` field
 * whose string value starts with `"ewb:"`.
 *
 * @param data - The unknown value to check (typically from `event.data`)
 * @returns `true` if data looks like a valid EWB message
 *
 * @example
 * ```ts
 * window.addEventListener("message", (e) => {
 *   if (isEwbMessage(e.data)) {
 *     // handle EWB message
 *   }
 * });
 * ```
 */
export function isEwbMessage(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    typeof (data as { type: unknown }).type === "string" &&
    (data as { type: string }).type.startsWith("ewb:")
  );
}
