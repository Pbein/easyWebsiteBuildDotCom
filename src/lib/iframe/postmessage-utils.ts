import type { ThemeTokens } from "@/lib/theme";

/**
 * PostMessage types for parent <-> iframe communication.
 * All messages use `ewb:` prefix to avoid collisions.
 */
export interface SetThemeMessage {
  type: "ewb:set-theme";
  theme: ThemeTokens;
}

export interface SetPageMessage {
  type: "ewb:set-page";
  activePage: string;
}

export interface RequestScreenshotMessage {
  type: "ewb:request-screenshot";
  requestId: string;
}

export interface UpdateContentMessage {
  type: "ewb:update-content";
  overrides: Record<number, Record<string, string>>;
}

export interface ResetContentMessage {
  type: "ewb:reset-content";
}

export type ParentMessage =
  | SetThemeMessage
  | SetPageMessage
  | RequestScreenshotMessage
  | UpdateContentMessage
  | ResetContentMessage;

/**
 * Type guard that checks whether unknown data is a valid EWB parent message.
 * A value qualifies if it is a non-null object with a `type` field
 * whose string value starts with `"ewb:"`.
 */
export function isParentMessage(data: unknown): data is ParentMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    typeof (data as { type: unknown }).type === "string" &&
    (data as { type: string }).type.startsWith("ewb:")
  );
}
