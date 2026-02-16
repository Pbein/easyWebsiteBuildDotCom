import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
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

  it('variant="gradient-bg" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<HeroCentered {...createHeroCenteredProps({ variant: "gradient-bg" })} />);
    }).not.toThrow();
  });

  it('variant="with-bg-image" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<HeroCentered {...createHeroCenteredProps({ variant: "with-bg-image" })} />);
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

  it("displays body text", () => {
    renderWithTheme(<HeroSplit {...createHeroSplitProps()} />);
    expect(
      screen.getByText(
        "We help small businesses create professional websites that convert visitors into customers."
      )
    ).toBeInTheDocument();
  });

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

  it("renders without image (image is optional)", () => {
    expect(() => {
      renderWithTheme(<HeroSplit {...createHeroSplitProps({ image: undefined })} />);
    }).not.toThrow();

    // Should still display text content
    renderWithTheme(<HeroSplit {...createHeroSplitProps({ image: undefined })} />);
    expect(screen.getAllByText("Grow Your Business Online").length).toBeGreaterThanOrEqual(1);
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

  it("renders without videoUrl (optional)", () => {
    expect(() => {
      renderWithTheme(<HeroVideo {...createHeroVideoProps({ videoUrl: undefined })} />);
    }).not.toThrow();

    // Should still display headline
    renderWithTheme(<HeroVideo {...createHeroVideoProps({ videoUrl: undefined })} />);
    expect(screen.getAllByText("See It In Action").length).toBeGreaterThanOrEqual(1);
  });
});
