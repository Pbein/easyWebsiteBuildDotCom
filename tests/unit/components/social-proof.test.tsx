/**
 * @requirements ProofTestimonials + ProofBeforeAfter — Requirements-First Tests
 *
 * Source: src/components/library/social-proof/proof-testimonials/ProofTestimonials.tsx
 * Source: src/components/library/social-proof/proof-beforeafter/ProofBeforeAfter.tsx
 *
 * ProofTestimonials key behaviors:
 *   - Testimonial attribution: name and role displayed for each testimonial
 *   - Star ratings: renders 5 SVG Star icons per testimonial when showRating=true
 *     (filled count matches rating value)
 *   - Quote text displayed in blockquote elements
 *   - Section aria-label uses headline, falls back to "Testimonials"
 *   - Initials fallback: first letter of name shown when no avatar image
 *   - All variants ("carousel") render without crashing
 *
 * ProofBeforeAfter key behaviors:
 *   - Uses `comparisons` field (CLAUDE.md contract — NOT `items`)
 *   - Before/After labels displayed for each comparison
 *   - Slider variant has ARIA slider attributes (role="slider", aria-valuemin/max/now)
 *   - Section aria-label uses headline, falls back to "Before & After"
 *   - Both variants ("slider", "side-by-side") render without crashing
 *
 * These tests validate REQUIREMENTS and BEHAVIOR, not implementation details.
 */

import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import {
  createProofTestimonialsProps,
  createProofBeforeAfterProps,
} from "../../helpers/component-fixtures";
import { ProofTestimonials, ProofBeforeAfter } from "@/components/library";

// Mock next/image since ProofBeforeAfter uses it for comparison images
// and ProofTestimonials uses it for avatar images
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, blurDataURL, placeholder, ...rest } = props;
    return <img {...rest} />;
  },
}));

/* ================================================================
 * ProofTestimonials
 * ================================================================ */

describe("ProofTestimonials — attribution", () => {
  it("requirement: testimonial author names are displayed", () => {
    renderWithTheme(<ProofTestimonials {...createProofTestimonialsProps()} />);

    expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
    expect(screen.getByText("Michael Park")).toBeInTheDocument();
    expect(screen.getByText("Emily Torres")).toBeInTheDocument();
  });

  it("requirement: testimonial roles are displayed alongside names", () => {
    renderWithTheme(<ProofTestimonials {...createProofTestimonialsProps()} />);

    expect(screen.getByText("CEO")).toBeInTheDocument();
    expect(screen.getByText("Founder")).toBeInTheDocument();
    expect(screen.getByText("Marketing Director")).toBeInTheDocument();
  });
});

describe("ProofTestimonials — star ratings", () => {
  it("requirement: star ratings render SVG elements when showRating is true", () => {
    // The StarRating sub-component renders 5 Star icons per testimonial.
    // With 3 testimonials and showRating=true, we expect 15 SVG star elements.
    const { container } = renderWithTheme(
      <ProofTestimonials {...createProofTestimonialsProps({ showRating: true })} />
    );

    // Each Star from lucide-react renders as an <svg> element.
    // 3 testimonials * 5 stars each = 15 star SVGs.
    // The component may also render ChevronLeft/ChevronRight nav icons,
    // so we check that at least 15 SVGs exist (the star count).
    const svgElements = container.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThanOrEqual(15);
  });
});

describe("ProofTestimonials — content", () => {
  it("requirement: quote text is displayed", () => {
    renderWithTheme(<ProofTestimonials {...createProofTestimonialsProps()} />);

    // Quotes are wrapped in curly quotes by the component (&ldquo;...&rdquo;)
    expect(screen.getByText(/Absolutely transformed our online presence/)).toBeInTheDocument();
    expect(screen.getByText(/The best investment we made this year/)).toBeInTheDocument();
    expect(screen.getByText(/Simple, fast, and beautiful results/)).toBeInTheDocument();
  });
});

describe("ProofTestimonials — accessibility", () => {
  it("contract: section uses headline as aria-label when provided", () => {
    renderWithTheme(<ProofTestimonials {...createProofTestimonialsProps()} />);

    const section = screen.getByRole("region", {
      name: "What Our Clients Say",
    });
    expect(section).toBeInTheDocument();
  });

  it("contract: section falls back to 'Testimonials' aria-label when no headline", () => {
    renderWithTheme(
      <ProofTestimonials {...createProofTestimonialsProps({ headline: undefined })} />
    );

    const section = screen.getByRole("region", { name: "Testimonials" });
    expect(section).toBeInTheDocument();
  });
});

describe("ProofTestimonials — variants", () => {
  it("contract: 'carousel' variant renders without crashing and shows content", () => {
    expect(() => {
      renderWithTheme(
        <ProofTestimonials {...createProofTestimonialsProps({ variant: "carousel" })} />
      );
    }).not.toThrow();

    expect(screen.getByText("What Our Clients Say")).toBeInTheDocument();
    expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
  });
});

/* ================================================================
 * ProofBeforeAfter
 * ================================================================ */

describe("ProofBeforeAfter — data contract", () => {
  it("contract: uses `comparisons` field (not `items`) — renders comparison content", () => {
    // The fixture uses `comparisons` array with beforeImage/afterImage.
    // This verifies the component accepts and renders the `comparisons` prop.
    renderWithTheme(<ProofBeforeAfter {...createProofBeforeAfterProps()} />);

    // The default slider variant renders Before/After labels
    expect(screen.getByText("Before")).toBeInTheDocument();
    expect(screen.getByText("After")).toBeInTheDocument();
  });
});

describe("ProofBeforeAfter — labels", () => {
  it("requirement: Before/After labels are displayed", () => {
    renderWithTheme(<ProofBeforeAfter {...createProofBeforeAfterProps()} />);

    expect(screen.getByText("Before")).toBeInTheDocument();
    expect(screen.getByText("After")).toBeInTheDocument();
  });
});

describe("ProofBeforeAfter — slider accessibility", () => {
  it("requirement: slider variant has ARIA slider attributes", () => {
    // Default variant is "slider" which renders role="slider" on the comparison container
    const { container } = renderWithTheme(<ProofBeforeAfter {...createProofBeforeAfterProps()} />);

    const slider = container.querySelector('[role="slider"]');
    expect(slider).not.toBeNull();
    expect(slider!.getAttribute("aria-valuemin")).toBe("0");
    expect(slider!.getAttribute("aria-valuemax")).toBe("100");
    // Default position is 50
    expect(slider!.getAttribute("aria-valuenow")).toBe("50");
  });

  it("contract: section uses headline as aria-label when provided", () => {
    renderWithTheme(<ProofBeforeAfter {...createProofBeforeAfterProps()} />);

    const section = screen.getByRole("region", {
      name: "The Transformation",
    });
    expect(section).toBeInTheDocument();
  });

  it("contract: section falls back to 'Before & After' aria-label when no headline", () => {
    renderWithTheme(<ProofBeforeAfter {...createProofBeforeAfterProps({ headline: undefined })} />);

    const section = screen.getByRole("region", { name: "Before & After" });
    expect(section).toBeInTheDocument();
  });
});

describe("ProofBeforeAfter — variants", () => {
  it.each(["slider", "side-by-side"] as const)(
    "contract: '%s' variant renders without crashing and shows labels",
    (variant) => {
      expect(() => {
        renderWithTheme(<ProofBeforeAfter {...createProofBeforeAfterProps({ variant })} />);
      }).not.toThrow();

      expect(screen.getByText("Before")).toBeInTheDocument();
      expect(screen.getByText("After")).toBeInTheDocument();
    }
  );
});
