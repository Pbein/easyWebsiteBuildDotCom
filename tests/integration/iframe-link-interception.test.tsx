/**
 * Integration tests for the link interception logic used in the iframe
 * render page (`src/app/demo/preview/render/page.tsx`).
 *
 * The render page attaches a delegated click handler to the render container
 * that intercepts anchor clicks to prevent the iframe from navigating away:
 *
 *   - Hash links (#section)         -> allowed (in-page scrolling)
 *   - External links (http/https)   -> preventDefault + window.open in new tab
 *   - Internal links (/, /about)    -> preventDefault + scrollTo top
 *   - Non-anchor / no-href clicks   -> ignored (not prevented)
 *
 * Since the full page relies on Convex hooks and Next.js dynamic imports,
 * we recreate the exact handleLinkClick function in isolation and test it
 * against a real jsdom container with simulated click events.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createMockAnchor,
  createNestedLink,
  simulateLinkClick,
} from "../helpers/iframe-test-utils";

/**
 * Exact replica of the handleLinkClick function from the render page.
 * Kept in sync manually -- if the source changes, update this copy.
 */
function handleLinkClick(e: MouseEvent): void {
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

describe("Iframe link interception", () => {
  let container: HTMLDivElement;
  let openSpy: ReturnType<typeof vi.spyOn>;
  let scrollToSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    container.addEventListener("click", handleLinkClick);

    // Mock window.open and window.scrollTo
    openSpy = vi.fn() as unknown as ReturnType<typeof vi.spyOn>;
    window.open = openSpy as unknown as typeof window.open;

    scrollToSpy = vi.fn() as unknown as ReturnType<typeof vi.spyOn>;
    window.scrollTo = scrollToSpy as unknown as typeof window.scrollTo;
  });

  afterEach(() => {
    container.removeEventListener("click", handleLinkClick);
    document.body.removeChild(container);
    vi.restoreAllMocks();
  });

  it('internal root link (href="/") is prevented and scrolls to top', () => {
    const anchor = createMockAnchor("/", "Home");
    container.appendChild(anchor);

    const event = simulateLinkClick(container, anchor);

    expect(event.defaultPrevented).toBe(true);
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('hash link (href="#contact") is NOT prevented (allowed for in-page scrolling)', () => {
    const anchor = createMockAnchor("#contact", "Contact");
    container.appendChild(anchor);

    const event = simulateLinkClick(container, anchor);

    expect(event.defaultPrevented).toBe(false);
    expect(openSpy).not.toHaveBeenCalled();
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("https external link is prevented and opens in new tab", () => {
    const anchor = createMockAnchor("https://example.com", "Example");
    container.appendChild(anchor);

    const event = simulateLinkClick(container, anchor);

    expect(event.defaultPrevented).toBe(true);
    expect(openSpy).toHaveBeenCalledWith("https://example.com", "_blank", "noopener,noreferrer");
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("http external link is prevented and opens in new tab", () => {
    const anchor = createMockAnchor("http://example.com", "Example HTTP");
    container.appendChild(anchor);

    const event = simulateLinkClick(container, anchor);

    expect(event.defaultPrevented).toBe(true);
    expect(openSpy).toHaveBeenCalledWith("http://example.com", "_blank", "noopener,noreferrer");
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it('internal path link (href="/about") is prevented and scrolls to top', () => {
    const anchor = createMockAnchor("/about", "About Us");
    container.appendChild(anchor);

    const event = simulateLinkClick(container, anchor);

    expect(event.defaultPrevented).toBe(true);
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("nested element click (span inside anchor) is intercepted via .closest('a')", () => {
    const anchor = createNestedLink("/");
    container.appendChild(anchor);

    // Click the inner span, not the anchor itself
    const span = anchor.querySelector("span")!;
    expect(span).toBeTruthy();

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    span.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("anchor with no href attribute does NOT prevent the event", () => {
    const anchor = document.createElement("a");
    anchor.textContent = "No href";
    // Deliberately NOT setting an href attribute
    container.appendChild(anchor);

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    anchor.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(openSpy).not.toHaveBeenCalled();
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("non-anchor element click (div) does NOT prevent the event", () => {
    const div = document.createElement("div");
    div.textContent = "Just a div";
    container.appendChild(div);

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    div.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(openSpy).not.toHaveBeenCalled();
    expect(scrollToSpy).not.toHaveBeenCalled();
  });
});
