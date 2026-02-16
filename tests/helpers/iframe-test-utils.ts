/**
 * DOM utilities for testing the link interception logic
 * in the iframe preview render page.
 *
 * The iframe render page intercepts all click events on anchor elements
 * to prevent navigation inside the iframe:
 * - Hash links (#section) are allowed for in-page scrolling
 * - External links (http/https) open in a new tab
 * - Internal links (/, /about) are prevented and scroll to top
 *
 * These helpers create DOM structures and simulate clicks so tests
 * can verify that `event.defaultPrevented` is set correctly.
 */

/**
 * Creates an anchor element with the given href and optional text content.
 *
 * @param href - The href attribute value
 * @param text - The visible link text (defaults to "Link")
 * @returns An HTMLAnchorElement (not yet attached to the DOM)
 *
 * @example
 * ```ts
 * const anchor = createMockAnchor("https://example.com", "Visit Example");
 * container.appendChild(anchor);
 * ```
 */
export function createMockAnchor(href: string, text?: string): HTMLAnchorElement {
  const anchor = document.createElement("a");
  anchor.setAttribute("href", href);
  anchor.textContent = text ?? "Link";
  return anchor;
}

/**
 * Creates a nested link structure for testing `.closest('a')` traversal.
 *
 * Produces: `<a href="..."><span>Click me</span></a>`
 *
 * This simulates the common pattern where a click event fires on a child
 * element (e.g. an icon or span inside a link) and the handler must
 * walk up the DOM to find the enclosing anchor.
 *
 * @param href - The href attribute on the anchor
 * @returns The outer anchor element containing a nested span
 *
 * @example
 * ```ts
 * const anchor = createNestedLink("/about");
 * container.appendChild(anchor);
 * // Click the inner span to test .closest("a") traversal
 * const span = anchor.querySelector("span")!;
 * simulateLinkClick(container, anchor);
 * ```
 */
export function createNestedLink(href: string): HTMLElement {
  const anchor = document.createElement("a");
  anchor.setAttribute("href", href);

  const span = document.createElement("span");
  span.textContent = "Click me";
  anchor.appendChild(span);

  return anchor;
}

/**
 * Dispatches a click event on the given anchor element and returns
 * the event object so tests can inspect `event.defaultPrevented`.
 *
 * The event is created with `bubbles: true` and `cancelable: true`
 * so that it propagates up through the container and can be
 * intercepted by delegated click handlers (as used in the render page).
 *
 * @param container - The parent element with the click handler attached
 * @param anchor - The anchor element to click
 * @returns The MouseEvent that was dispatched (check `.defaultPrevented`)
 *
 * @example
 * ```ts
 * const anchor = createMockAnchor("https://example.com");
 * container.appendChild(anchor);
 *
 * const event = simulateLinkClick(container, anchor);
 * expect(event.defaultPrevented).toBe(true);
 * ```
 */
export function simulateLinkClick(container: HTMLElement, anchor: HTMLAnchorElement): MouseEvent {
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
  });

  anchor.dispatchEvent(event);

  return event;
}
