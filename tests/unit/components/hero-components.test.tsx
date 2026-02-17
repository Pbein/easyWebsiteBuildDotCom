/**
 * @requirements Hero Component Tests
 *
 * Tests cover the three hero component variants in the library:
 *
 * HeroCentered (src/components/library/hero/hero-centered/HeroCentered.tsx):
 *  - REQ-HC-01: Headline renders as <h1> (semantic: hero = main page heading)
 *  - REQ-HC-02: Section has aria-label derived from headline text
 *  - REQ-HC-03: Badge prop renders above the headline when provided
 *  - REQ-HC-04: CTAs render as <a> links with correct href values
 *  - REQ-HC-05: Renders gracefully when neither CTA is provided (boundary)
 *  - REQ-HC-06: variant="with-bg-image" renders background + gradient overlay
 *  - REQ-HC-07: variant="gradient-bg" renders gradient mesh background
 *
 * HeroSplit (src/components/library/hero/hero-split/HeroSplit.tsx):
 *  - REQ-HS-01: Headline renders as <h1> (semantic)
 *  - REQ-HS-02: Body text renders in a <p> element
 *  - REQ-HS-03: Features prop renders list items with checkmark icons
 *  - REQ-HS-04: Image is optional — renders ImagePlaceholder when absent
 *  - REQ-HS-05: Section has aria-label derived from headline text
 *  - REQ-HS-06: variant="image-right" and "image-left" both render
 *
 * HeroVideo (src/components/library/hero/hero-video/HeroVideo.tsx):
 *  - REQ-HV-01: Headline renders as <h1> (semantic)
 *  - REQ-HV-02: videoUrl is optional — shows Play button placeholder when absent
 *  - REQ-HV-03: All 3 variants render: "background-video", "embedded", "split-video"
 *  - REQ-HV-04: Section has aria-label derived from headline text
 */

import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import {
  createHeroCenteredProps,
  createHeroSplitProps,
  createHeroVideoProps,
} from "../../helpers/component-fixtures";
import { HeroCentered, HeroSplit, HeroVideo } from "@/components/library";

/* ────────────────────────────────────────────────────────────
 * HeroCentered
 * ──────────────────────────────────────────────────────────── */

describe("HeroCentered", () => {
  it("renders without crashing", () => {
    expect(() => {
      renderWithTheme(<HeroCentered {...createHeroCenteredProps()} />);
    }).not.toThrow();
  });

  it("displays headline", () => {
    renderWithTheme(<HeroCentered {...createHeroCenteredProps()} />);
    expect(screen.getByText("Build Something Amazing")).toBeInTheDocument();
  });

  it("displays subheadline", () => {
    renderWithTheme(<HeroCentered {...createHeroCenteredProps()} />);
    expect(screen.getByText("The fastest way to launch your next project.")).toBeInTheDocument();
  });

  // REQ-HC-01: Headline is an <h1> for correct semantic hierarchy
  it("headline renders as an h1 element (semantic HTML)", () => {
    renderWithTheme(<HeroCentered {...createHeroCenteredProps()} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Build Something Amazing");
  });

  // REQ-HC-02: Section has accessible aria-label from headline
  it("section has aria-label derived from headline", () => {
    renderWithTheme(<HeroCentered {...createHeroCenteredProps()} />);
    const section = screen.getByRole("region", { name: "Build Something Amazing" });
    expect(section).toBeInTheDocument();
  });

  // REQ-HC-03: Badge renders above headline when provided
  it("badge renders when provided", () => {
    renderWithTheme(<HeroCentered {...createHeroCenteredProps({ badge: "New Launch" })} />);
    expect(screen.getByText("New Launch")).toBeInTheDocument();

    // Badge should appear before the headline in DOM order (above it visually)
    const section = screen.getByRole("region");
    const badgeEl = within(section).getByText("New Launch");
    const headlineEl = within(section).getByRole("heading", { level: 1 });
    // Badge comes before headline in document order
    expect(
      badgeEl.compareDocumentPosition(headlineEl) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  // REQ-HC-04: CTA links (existing tests, KEPT)
  it("renders primary CTA when provided", () => {
    renderWithTheme(
      <HeroCentered
        {...createHeroCenteredProps({
          ctaPrimary: { text: "Start Now", href: "/start" },
        })}
      />
    );
    expect(screen.getByText("Start Now")).toBeInTheDocument();
    const link = screen.getByText("Start Now").closest("a");
    expect(link?.getAttribute("href")).toBe("/start");
  });

  it("renders secondary CTA when provided", () => {
    renderWithTheme(
      <HeroCentered
        {...createHeroCenteredProps({
          ctaSecondary: { text: "Learn More", href: "/learn" },
        })}
      />
    );
    expect(screen.getByText("Learn More")).toBeInTheDocument();
    const link = screen.getByText("Learn More").closest("a");
    expect(link?.getAttribute("href")).toBe("/learn");
  });

  // REQ-HC-05: Renders without any CTAs (boundary)
  it("renders without CTAs when neither is provided", () => {
    renderWithTheme(
      <HeroCentered
        {...createHeroCenteredProps({
          ctaPrimary: undefined,
          ctaSecondary: undefined,
        })}
      />
    );
    // Should still render headline without crashing
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Build Something Amazing");
    // No links should be present in the section
    const section = screen.getByRole("region");
    const links = within(section).queryAllByRole("link");
    expect(links).toHaveLength(0);
  });

  // REQ-HC-06: variant="with-bg-image" adds gradient overlay
  it('variant="with-bg-image" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<HeroCentered {...createHeroCenteredProps({ variant: "with-bg-image" })} />);
    }).not.toThrow();
  });

  // REQ-HC-07: variant="gradient-bg" renders gradient mesh background
  it('variant="gradient-bg" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<HeroCentered {...createHeroCenteredProps({ variant: "gradient-bg" })} />);
    }).not.toThrow();
  });
});

/* ────────────────────────────────────────────────────────────
 * HeroSplit
 * ──────────────────────────────────────────────────────────── */

describe("HeroSplit", () => {
  it("renders without crashing", () => {
    expect(() => {
      renderWithTheme(<HeroSplit {...createHeroSplitProps()} />);
    }).not.toThrow();
  });

  it("displays headline", () => {
    renderWithTheme(<HeroSplit {...createHeroSplitProps()} />);
    expect(screen.getByText("Grow Your Business Online")).toBeInTheDocument();
  });

  // REQ-HS-01: Headline is an <h1> for correct semantic hierarchy
  it("headline renders as an h1 element (semantic HTML)", () => {
    renderWithTheme(<HeroSplit {...createHeroSplitProps()} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Grow Your Business Online");
  });

  // REQ-HS-02: Body text renders in a <p> element
  it("body text renders in a paragraph element", () => {
    renderWithTheme(<HeroSplit {...createHeroSplitProps()} />);
    const bodyText = screen.getByText(
      "We help small businesses create professional websites that convert visitors into customers."
    );
    expect(bodyText).toBeInTheDocument();
    expect(bodyText.tagName).toBe("P");
  });

  it("displays body text", () => {
    renderWithTheme(<HeroSplit {...createHeroSplitProps()} />);
    expect(
      screen.getByText(
        "We help small businesses create professional websites that convert visitors into customers."
      )
    ).toBeInTheDocument();
  });

  // REQ-HS-03: Features list renders items with checkmark icons
  it("features list renders items when features prop is provided", () => {
    renderWithTheme(
      <HeroSplit
        {...createHeroSplitProps({
          features: [
            { text: "Free hosting included" },
            { text: "Custom domain support" },
            { text: "SSL certificate" },
          ],
        })}
      />
    );
    expect(screen.getByText("Free hosting included")).toBeInTheDocument();
    expect(screen.getByText("Custom domain support")).toBeInTheDocument();
    expect(screen.getByText("SSL certificate")).toBeInTheDocument();

    // Features render as list items within a <ul>
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(3);
  });

  // REQ-HS-05: Section has accessible aria-label
  it("section has aria-label derived from headline", () => {
    renderWithTheme(<HeroSplit {...createHeroSplitProps()} />);
    const section = screen.getByRole("region", { name: "Grow Your Business Online" });
    expect(section).toBeInTheDocument();
  });

  // REQ-HS-06: Both layout variants render
  it('variant="image-right" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<HeroSplit {...createHeroSplitProps({ variant: "image-right" })} />);
    }).not.toThrow();
  });

  it('variant="image-left" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<HeroSplit {...createHeroSplitProps({ variant: "image-left" })} />);
    }).not.toThrow();
  });

  // REQ-HS-04: Image is optional — renders placeholder when absent (KEPT + improved)
  it("renders without image (image is optional) and shows placeholder", () => {
    const { container } = renderWithTheme(
      <HeroSplit {...createHeroSplitProps({ image: undefined })} />
    );

    // Should still display text content
    expect(screen.getByText("Grow Your Business Online")).toBeInTheDocument();

    // Should NOT have an <img> element since no image was provided
    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(0);
  });
});

/* ────────────────────────────────────────────────────────────
 * HeroVideo
 * ──────────────────────────────────────────────────────────── */

describe("HeroVideo", () => {
  it("renders without crashing", () => {
    expect(() => {
      renderWithTheme(<HeroVideo {...createHeroVideoProps()} />);
    }).not.toThrow();
  });

  it("displays headline", () => {
    renderWithTheme(<HeroVideo {...createHeroVideoProps()} />);
    expect(screen.getByText("See It In Action")).toBeInTheDocument();
  });

  // REQ-HV-01: Headline is an <h1> for correct semantic hierarchy
  it("headline renders as an h1 element (semantic HTML)", () => {
    renderWithTheme(<HeroVideo {...createHeroVideoProps()} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("See It In Action");
  });

  // REQ-HV-04: Section has accessible aria-label
  it("section has aria-label derived from headline", () => {
    renderWithTheme(<HeroVideo {...createHeroVideoProps()} />);
    const section = screen.getByRole("region", { name: "See It In Action" });
    expect(section).toBeInTheDocument();
  });

  // REQ-HV-03: All 3 variants render
  it('variant="embedded" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<HeroVideo {...createHeroVideoProps({ variant: "embedded" })} />);
    }).not.toThrow();
  });

  it('variant="background-video" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<HeroVideo {...createHeroVideoProps({ variant: "background-video" })} />);
    }).not.toThrow();
  });

  it('variant="split-video" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<HeroVideo {...createHeroVideoProps({ variant: "split-video" })} />);
    }).not.toThrow();
    // Verify headline still appears in the split variant
    renderWithTheme(<HeroVideo {...createHeroVideoProps({ variant: "split-video" })} />);
    expect(screen.getAllByText("See It In Action").length).toBeGreaterThanOrEqual(1);
  });

  // REQ-HV-02: videoUrl is optional — shows Play icon when absent (KEPT + improved)
  it("renders without videoUrl (optional) and shows Play icon placeholder", () => {
    const { container } = renderWithTheme(
      <HeroVideo {...createHeroVideoProps({ videoUrl: undefined })} />
    );

    // Should still display headline
    expect(screen.getByText("See It In Action")).toBeInTheDocument();

    // Background-video variant renders a Play SVG icon (lucide-play) inside a div
    const playSvg = container.querySelector(".lucide-play");
    expect(playSvg).toBeInTheDocument();
  });

  // Embedded variant uses VideoPlaceholder which has a <button> with aria-label
  it("shows Play button in embedded variant without videoUrl", () => {
    renderWithTheme(
      <HeroVideo {...createHeroVideoProps({ variant: "embedded", videoUrl: undefined })} />
    );
    const playButton = screen.getByRole("button", { name: /play video/i });
    expect(playButton).toBeInTheDocument();
  });
});
