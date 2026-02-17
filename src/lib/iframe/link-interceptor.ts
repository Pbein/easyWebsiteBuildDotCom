/**
 * Click handler for intercepting link clicks inside the iframe preview.
 *
 * Prevents the iframe from navigating away:
 * - Hash links (#section)       -> allowed (in-page scrolling)
 * - External links (http/https) -> preventDefault + window.open in new tab
 * - Internal links (/, /about)  -> preventDefault + scrollTo top
 * - Non-anchor / no-href clicks -> ignored (not prevented)
 */
export function handleLinkClick(e: MouseEvent): void {
  const anchor = (e.target as HTMLElement).closest("a");
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (!href) return;

  // Allow hash links for in-page scrolling
  if (href.startsWith("#")) return;

  // External links: open in new tab (not inside iframe)
  if (href.startsWith("http://") || href.startsWith("https://")) {
    e.preventDefault();
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }

  // Internal navigation (/, /about, etc.): prevent, scroll to top
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
