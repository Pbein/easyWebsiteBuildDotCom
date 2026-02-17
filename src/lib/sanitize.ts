import DOMPurify from "dompurify";

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
 * Sanitize HTML string to prevent XSS while preserving safe formatting tags.
 * Used for AI-generated content rendered via dangerouslySetInnerHTML.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}
