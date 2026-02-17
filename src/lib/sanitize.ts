/**
 * Allowed HTML tags for AI-generated content fields.
 * Permits basic formatting while stripping scripts, iframes, event handlers.
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "a",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "span",
  "div",
  "hr",
];

const ALLOWED_ATTR = ["href", "target", "rel", "class"];

/**
 * Server-safe fallback: strip all HTML tags when DOMPurify is unavailable (SSR).
 */
function stripHtml(dirty: string): string {
  return dirty.replace(/<[^>]*>/g, "");
}

/**
 * Sanitize HTML string to prevent XSS while preserving safe formatting tags.
 * Used for AI-generated content rendered via dangerouslySetInnerHTML.
 *
 * Falls back to stripping all HTML during SSR (DOMPurify requires a DOM).
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === "undefined") {
    return stripHtml(dirty);
  }

  // Dynamic import at module level would break SSR — lazy-init on first client call
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DOMPurify = require("dompurify") as typeof import("dompurify").default;
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}
