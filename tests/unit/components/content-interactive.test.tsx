// tests/unit/components/content-interactive.test.tsx
//
// Requirements-first tests for interactive content components:
// ContentAccordion (toggle, single-open vs multi-open, accessibility)
// ContentMap (contact links, map rendering, accessibility)
//
// @requirements
//   ContentAccordion:
//     - Items start collapsed by default (no answers visible)
//     - Clicking a question button reveals its answer text
//     - "single-open" variant: only one item open at a time
//     - "multi-open" variant: multiple items can be open simultaneously
//     - Each toggle button has aria-expanded reflecting open/closed state
//     - defaultOpen prop opens the specified item on initial render
//     - Out-of-range defaultOpen is handled gracefully (no item opens)
//     - All styling uses CSS variables, no hardcoded hex colors in inline styles
//     - Answers support HTML content (rendered via dangerouslySetInnerHTML)
//     - Section falls back to aria-label "Frequently Asked Questions" when no headline
//     - Headline renders as h2 element
//     - All 3 variants render without crashing
//
//   ContentMap:
//     - Phone number is wrapped in a clickable tel: link
//     - Email is wrapped in a clickable mailto: link
//     - Section falls back to aria-label "Location" when no headline
//     - When mapEmbedUrl is provided, renders an iframe with title="Location map"
//     - When no mapEmbedUrl, renders map placeholder (no iframe present)
//     - Hours are displayed as individual lines
//     - Missing optional contactInfo fields don't crash
//     - All 3 variants render without crashing

import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../helpers/render-with-theme";
import {
  createContentAccordionProps,
  createContentMapProps,
} from "../../helpers/component-fixtures";
import { ContentAccordion, ContentMap } from "@/components/library";

/* ================================================================
 * ContentAccordion
 * ================================================================ */

describe("ContentAccordion", () => {
  /* ---- Requirement: Items start collapsed ---- */

  it("items start collapsed by default — no answers visible initially", () => {
    renderWithTheme(<ContentAccordion {...createContentAccordionProps()} />);

    // Questions are visible
    expect(screen.getByText("How long does it take?")).toBeInTheDocument();
    expect(screen.getByText("Can I customize my site?")).toBeInTheDocument();
    expect(screen.getByText("Is there a free plan?")).toBeInTheDocument();

    // Answers are NOT visible (they are only rendered when open via AnimatePresence)
    expect(screen.queryByText("Most sites are ready within minutes.")).not.toBeInTheDocument();
    expect(screen.queryByText("Yes, every element is fully customizable.")).not.toBeInTheDocument();
    expect(
      screen.queryByText("We offer a generous free tier to get started.")
    ).not.toBeInTheDocument();
  });

  /* ---- Requirement: Clicking a question reveals its answer ---- */

  it("clicking a question button reveals its answer text", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ContentAccordion {...createContentAccordionProps()} />);

    // Answer is not visible before clicking
    expect(screen.queryByText("Most sites are ready within minutes.")).not.toBeInTheDocument();

    // Click the first question
    await user.click(screen.getByText("How long does it take?"));

    // Answer is now visible
    expect(screen.getByText("Most sites are ready within minutes.")).toBeInTheDocument();
  });

  /* ---- Requirement: single-open exclusivity ---- */

  it('in "single-open" variant, opening one item closes the previously open item', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <ContentAccordion {...createContentAccordionProps({ variant: "single-open" })} />
    );

    // Open the first item
    await user.click(screen.getByText("How long does it take?"));
    expect(screen.getByText("Most sites are ready within minutes.")).toBeInTheDocument();

    // Open the second item — first should close
    await user.click(screen.getByText("Can I customize my site?"));
    expect(screen.getByText("Yes, every element is fully customizable.")).toBeInTheDocument();
    expect(screen.queryByText("Most sites are ready within minutes.")).not.toBeInTheDocument();
  });

  /* ---- Requirement: multi-open independence ---- */

  it('in "multi-open" variant, multiple items can be open simultaneously', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <ContentAccordion {...createContentAccordionProps({ variant: "multi-open" })} />
    );

    // Open first item
    await user.click(screen.getByText("How long does it take?"));
    expect(screen.getByText("Most sites are ready within minutes.")).toBeInTheDocument();

    // Open second item — first should remain open
    await user.click(screen.getByText("Can I customize my site?"));
    expect(screen.getByText("Yes, every element is fully customizable.")).toBeInTheDocument();
    expect(screen.getByText("Most sites are ready within minutes.")).toBeInTheDocument();

    // Open third item — both first and second should remain open
    await user.click(screen.getByText("Is there a free plan?"));
    expect(screen.getByText("We offer a generous free tier to get started.")).toBeInTheDocument();
    expect(screen.getByText("Most sites are ready within minutes.")).toBeInTheDocument();
    expect(screen.getByText("Yes, every element is fully customizable.")).toBeInTheDocument();
  });

  /* ---- Contract: aria-expanded reflects open/closed state ---- */

  it("toggle buttons have aria-expanded reflecting their open/closed state", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ContentAccordion {...createContentAccordionProps()} />);

    // All buttons start with aria-expanded="false"
    const initialButtons = screen.getAllByRole("button");
    for (const button of initialButtons) {
      expect(button).toHaveAttribute("aria-expanded", "false");
    }

    // Click first question text — the parent button's aria-expanded should flip
    await user.click(screen.getByText("How long does it take?"));

    // Re-query buttons after state update
    const updatedButtons = screen.getAllByRole("button");
    expect(updatedButtons[0]).toHaveAttribute("aria-expanded", "true");
    expect(updatedButtons[1]).toHaveAttribute("aria-expanded", "false");
    expect(updatedButtons[2]).toHaveAttribute("aria-expanded", "false");
  });

  /* ---- Requirement: defaultOpen prop ---- */

  it("defaultOpen prop opens the specified item on first render", () => {
    renderWithTheme(<ContentAccordion {...createContentAccordionProps({ defaultOpen: 1 })} />);

    // Second item's answer should be visible (index 1)
    expect(screen.getByText("Yes, every element is fully customizable.")).toBeInTheDocument();

    // First and third items' answers should NOT be visible
    expect(screen.queryByText("Most sites are ready within minutes.")).not.toBeInTheDocument();
    expect(
      screen.queryByText("We offer a generous free tier to get started.")
    ).not.toBeInTheDocument();

    // The corresponding button should be aria-expanded="true"
    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "true");
  });

  /* ---- Boundary: out-of-range defaultOpen ---- */

  it("out-of-range defaultOpen is handled gracefully — no item opens", () => {
    renderWithTheme(<ContentAccordion {...createContentAccordionProps({ defaultOpen: 99 })} />);

    // No answers should be visible
    expect(screen.queryByText("Most sites are ready within minutes.")).not.toBeInTheDocument();
    expect(screen.queryByText("Yes, every element is fully customizable.")).not.toBeInTheDocument();
    expect(
      screen.queryByText("We offer a generous free tier to get started.")
    ).not.toBeInTheDocument();

    // All buttons should be aria-expanded="false"
    const buttons = screen.getAllByRole("button");
    for (const button of buttons) {
      expect(button).toHaveAttribute("aria-expanded", "false");
    }
  });

  /* ---- Invariant: CSS variables only, no hardcoded hex ---- */

  it("component inline styles use CSS variables — no hardcoded hex colors", () => {
    const { container } = renderWithTheme(<ContentAccordion {...createContentAccordionProps()} />);

    // The ThemeProvider wrapper injects CSS custom property *definitions* (--color-primary: #hex)
    // which legitimately contain hex values. We only want to check elements INSIDE the <section>,
    // which are the component's own styles that should use var(--token) references, not raw hex.
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();

    const componentElements = section!.querySelectorAll("[style]");
    // Regex matches raw hex colors like #fff, #39c645 — but NOT inside var() references
    // or CSS custom property definitions. We check that style values don't contain bare hex
    // outside of var() usage.
    const bareHexColor = /#[0-9a-fA-F]{3,8}\b/;

    for (const el of componentElements) {
      const styleAttr = el.getAttribute("style") ?? "";
      // Filter out the section element itself if it has ThemeProvider-injected variables
      // (tokensToCSSProperties generates --color-*: #hex declarations)
      if (styleAttr.includes("--color-primary:")) continue;
      expect(styleAttr).not.toMatch(bareHexColor);
    }
  });

  /* ---- Requirement: HTML content in answers ---- */

  it("answers support HTML content rendered via dangerouslySetInnerHTML", async () => {
    const user = userEvent.setup();
    const htmlAnswer = "This has <strong>bold</strong> and <em>italic</em> content.";
    renderWithTheme(
      <ContentAccordion
        {...createContentAccordionProps({
          items: [{ question: "HTML test?", answer: htmlAnswer }],
        })}
      />
    );

    await user.click(screen.getByText("HTML test?"));

    // The bold and italic elements should be present in the DOM
    expect(screen.getByText("bold").tagName).toBe("STRONG");
    expect(screen.getByText("italic").tagName).toBe("EM");
  });

  /* ---- Contract: section aria-label fallback ---- */

  it('section has aria-label — falls back to "Frequently Asked Questions" when no headline', () => {
    const { container } = renderWithTheme(
      <ContentAccordion {...createContentAccordionProps({ headline: undefined })} />
    );

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-label", "Frequently Asked Questions");
  });

  /* ---- Requirement: headline renders as h2 ---- */

  it("headline renders as an h2 element", () => {
    renderWithTheme(<ContentAccordion {...createContentAccordionProps()} />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Frequently Asked Questions");
  });

  /* ---- Contract: all 3 variants render without crashing ---- */

  it.each(["single-open", "multi-open", "bordered"] as const)(
    'variant="%s" renders without crashing',
    (variant) => {
      expect(() => {
        renderWithTheme(<ContentAccordion {...createContentAccordionProps({ variant })} />);
      }).not.toThrow();

      // All questions should be visible regardless of variant
      expect(screen.getByText("How long does it take?")).toBeInTheDocument();
      expect(screen.getByText("Can I customize my site?")).toBeInTheDocument();
      expect(screen.getByText("Is there a free plan?")).toBeInTheDocument();
    }
  );
});

/* ================================================================
 * ContentMap
 * ================================================================ */

describe("ContentMap", () => {
  /* ---- Requirement: phone number is a tel: link ---- */

  it("phone number is wrapped in a clickable tel: link with non-numeric chars stripped", () => {
    renderWithTheme(<ContentMap {...createContentMapProps()} />);

    // Find the link by its text content
    const phoneLink = screen.getByRole("link", { name: "(555) 123-4567" });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute("href", "tel:5551234567");
  });

  /* ---- Requirement: email is a mailto: link ---- */

  it("email is wrapped in a clickable mailto: link", () => {
    renderWithTheme(<ContentMap {...createContentMapProps()} />);

    const emailLink = screen.getByRole("link", { name: "hello@example.com" });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:hello@example.com");
  });

  /* ---- Contract: section aria-label fallback ---- */

  it('section has aria-label — falls back to "Location" when no headline', () => {
    const { container } = renderWithTheme(
      <ContentMap {...createContentMapProps({ headline: undefined })} />
    );

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-label", "Location");
  });

  /* ---- Requirement: mapEmbedUrl renders iframe ---- */

  it('when mapEmbedUrl is provided, renders an iframe with title="Location map"', () => {
    const { container } = renderWithTheme(
      <ContentMap
        {...createContentMapProps({
          mapEmbedUrl: "https://maps.google.com/embed?q=test",
        })}
      />
    );

    const iframe = container.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("title", "Location map");
    expect(iframe).toHaveAttribute("src", "https://maps.google.com/embed?q=test");
  });

  /* ---- Requirement: no mapEmbedUrl shows placeholder ---- */

  it("when no mapEmbedUrl is provided, renders map placeholder — no iframe present", () => {
    const { container } = renderWithTheme(<ContentMap {...createContentMapProps()} />);

    // No iframe should be rendered
    const iframe = container.querySelector("iframe");
    expect(iframe).not.toBeInTheDocument();

    // The address should appear in the placeholder area
    // (MapPlaceholder shows the address text when present)
    const addressTexts = screen.getAllByText("123 Main St, Anytown, USA 12345");
    expect(addressTexts.length).toBeGreaterThanOrEqual(1);
  });

  /* ---- Requirement: hours displayed as individual lines ---- */

  it("hours are displayed as individual lines", () => {
    renderWithTheme(<ContentMap {...createContentMapProps()} />);

    expect(screen.getByText("Mon-Fri: 9am-5pm")).toBeInTheDocument();
    expect(screen.getByText("Sat: 10am-2pm")).toBeInTheDocument();
  });

  /* ---- Boundary: missing optional contactInfo fields ---- */

  it("missing optional contactInfo fields (no phone, no email) do not crash", () => {
    expect(() => {
      renderWithTheme(
        <ContentMap
          {...createContentMapProps({
            contactInfo: {
              address: "456 Oak Ave",
              // no phone, no email, no hours
            },
          })}
        />
      );
    }).not.toThrow();

    // Address should still render
    expect(screen.getAllByText("456 Oak Ave").length).toBeGreaterThanOrEqual(1);

    // Phone and email links should not be present
    const links = screen.queryAllByRole("link");
    const telLinks = links.filter((l) => l.getAttribute("href")?.startsWith("tel:"));
    const mailtoLinks = links.filter((l) => l.getAttribute("href")?.startsWith("mailto:"));
    expect(telLinks).toHaveLength(0);
    expect(mailtoLinks).toHaveLength(0);
  });

  /* ---- Contract: all 3 variants render without crashing ---- */

  it.each(["full-width", "split-with-info", "embedded"] as const)(
    'variant="%s" renders without crashing',
    (variant) => {
      expect(() => {
        renderWithTheme(<ContentMap {...createContentMapProps({ variant })} />);
      }).not.toThrow();

      // Headline should be present regardless of variant
      expect(screen.getByText("Find Us")).toBeInTheDocument();
    }
  );
});
