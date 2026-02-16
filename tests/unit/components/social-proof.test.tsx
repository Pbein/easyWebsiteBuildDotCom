// tests/unit/components/social-proof.test.tsx
//
// Unit tests for social proof components:
// ProofTestimonials and ProofBeforeAfter

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

describe("ProofTestimonials", () => {
  it("renders without crashing", () => {
    const props = createProofTestimonialsProps();
    const { container } = renderWithTheme(<ProofTestimonials {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays headline", () => {
    const props = createProofTestimonialsProps();
    renderWithTheme(<ProofTestimonials {...props} />);
    expect(screen.getByText("What Our Clients Say")).toBeTruthy();
  });

  it("displays testimonial quotes", () => {
    const props = createProofTestimonialsProps();
    renderWithTheme(<ProofTestimonials {...props} />);
    // Quotes are wrapped in curly quotes by the component: &ldquo;...&rdquo;
    // The text content will include the quote marks
    expect(screen.getByText(/Absolutely transformed our online presence/)).toBeTruthy();
  });

  it('variant="carousel" renders', () => {
    const props = createProofTestimonialsProps({ variant: "carousel" });
    const { container } = renderWithTheme(<ProofTestimonials {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
    expect(screen.getByText("What Our Clients Say")).toBeTruthy();
  });
});

/* ================================================================
 * ProofBeforeAfter
 * ================================================================ */

describe("ProofBeforeAfter", () => {
  it("renders without crashing", () => {
    const props = createProofBeforeAfterProps();
    const { container } = renderWithTheme(<ProofBeforeAfter {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays headline", () => {
    const props = createProofBeforeAfterProps();
    renderWithTheme(<ProofBeforeAfter {...props} />);
    expect(screen.getByText("The Transformation")).toBeTruthy();
  });

  it("uses `comparisons` field (not `items`) — renders comparison content", () => {
    // The fixture uses `comparisons` array with beforeImage/afterImage
    // Verifying the component accepts and renders the `comparisons` prop
    const props = createProofBeforeAfterProps();
    renderWithTheme(<ProofBeforeAfter {...props} />);
    // The default slider variant renders Before/After labels
    expect(screen.getByText("Before")).toBeTruthy();
    expect(screen.getByText("After")).toBeTruthy();
  });

  it('variant="side-by-side" renders', () => {
    const props = createProofBeforeAfterProps({ variant: "side-by-side" });
    const { container } = renderWithTheme(<ProofBeforeAfter {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
    // Side-by-side variant also shows Before/After labels
    expect(screen.getByText("Before")).toBeTruthy();
    expect(screen.getByText("After")).toBeTruthy();
  });
});
