/**
 * @requirements MediaGallery — Requirements-First Tests
 *
 * Source: src/components/library/media/media-gallery/MediaGallery.tsx
 * Variants: grid (variants/grid.tsx), masonry (variants/masonry.tsx),
 *           lightbox (uses grid + lightbox-overlay.tsx)
 *
 * Key behaviors under test:
 *   - All images render with alt text for accessibility
 *   - Image count matches input array length
 *   - Section aria-label uses headline, falls back to "Gallery"
 *   - All 3 variants ("grid", "masonry", "lightbox") render without crashing
 *   - Boundary: empty images array renders section without crashing
 *
 * These tests validate REQUIREMENTS and BEHAVIOR, not implementation details.
 */

import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import { createMediaGalleryProps } from "../../helpers/component-fixtures";
import { MediaGallery } from "@/components/library";

// Mock next/image since MediaGallery may use it in some rendering paths
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, blurDataURL, placeholder, ...rest } = props;
    return <img {...rest} />;
  },
}));

/* ── Test 1: All images render with alt text ─────────────────── */

describe("MediaGallery — image accessibility", () => {
  it("requirement: all images render with correct alt text", () => {
    renderWithTheme(<MediaGallery {...createMediaGalleryProps()} />);

    expect(screen.getByAltText("Project showcase 1")).toBeInTheDocument();
    expect(screen.getByAltText("Project showcase 2")).toBeInTheDocument();
    expect(screen.getByAltText("Project showcase 3")).toBeInTheDocument();
    expect(screen.getByAltText("Project showcase 4")).toBeInTheDocument();
  });
});

/* ── Test 2: Image count matches input ───────────────────────── */

describe("MediaGallery — data integrity", () => {
  it("contract: renders exactly as many images as items in the input array", () => {
    const { container } = renderWithTheme(<MediaGallery {...createMediaGalleryProps()} />);

    // The fixture has 4 images; each renders an <img> element
    const imgElements = container.querySelectorAll("img");
    expect(imgElements.length).toBe(4);
  });

  it("contract: renders correct count with a different-sized input array", () => {
    const sixImages = [
      { src: "/images/a.jpg", alt: "Image A" },
      { src: "/images/b.jpg", alt: "Image B" },
      { src: "/images/c.jpg", alt: "Image C" },
      { src: "/images/d.jpg", alt: "Image D" },
      { src: "/images/e.jpg", alt: "Image E" },
      { src: "/images/f.jpg", alt: "Image F" },
    ];

    const { container } = renderWithTheme(
      <MediaGallery {...createMediaGalleryProps({ images: sixImages })} />
    );

    const imgElements = container.querySelectorAll("img");
    expect(imgElements.length).toBe(6);
  });
});

/* ── Test 3: Accessibility ───────────────────────────────────── */

describe("MediaGallery — accessibility", () => {
  it("contract: section uses headline as aria-label when provided", () => {
    renderWithTheme(<MediaGallery {...createMediaGalleryProps()} />);

    const section = screen.getByRole("region", { name: "Gallery" });
    expect(section).toBeInTheDocument();
  });

  it("contract: section falls back to 'Gallery' aria-label when no headline", () => {
    renderWithTheme(<MediaGallery {...createMediaGalleryProps({ headline: undefined })} />);

    const section = screen.getByRole("region", { name: "Gallery" });
    expect(section).toBeInTheDocument();
  });
});

/* ── Test 4: All variants render ─────────────────────────────── */

describe("MediaGallery — variants", () => {
  it.each(["grid", "masonry", "lightbox"] as const)(
    "contract: '%s' variant renders without crashing and shows images",
    (variant) => {
      expect(() => {
        renderWithTheme(<MediaGallery {...createMediaGalleryProps({ variant })} />);
      }).not.toThrow();

      // All image alt texts should be present regardless of variant
      expect(screen.getByAltText("Project showcase 1")).toBeInTheDocument();
      expect(screen.getByAltText("Project showcase 4")).toBeInTheDocument();
    }
  );
});

/* ── Test 5: Boundary — empty images array ───────────────────── */

describe("MediaGallery — boundary conditions", () => {
  it("boundary: empty images array renders section without crashing", () => {
    expect(() => {
      renderWithTheme(<MediaGallery {...createMediaGalleryProps({ images: [] })} />);
    }).not.toThrow();

    // Section should still render (with headline)
    expect(screen.getByText("Gallery")).toBeInTheDocument();
  });
});
