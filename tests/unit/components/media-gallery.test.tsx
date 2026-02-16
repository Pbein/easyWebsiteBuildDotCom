import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import { createMediaGalleryProps } from "../../helpers/component-fixtures";
import { MediaGallery } from "@/components/library";

describe("MediaGallery", () => {
  it("renders without crashing", () => {
    expect(() => {
      renderWithTheme(<MediaGallery {...createMediaGalleryProps()} />);
    }).not.toThrow();
  });

  it("displays headline", () => {
    renderWithTheme(<MediaGallery {...createMediaGalleryProps()} />);
    expect(screen.getByText("Gallery")).toBeInTheDocument();
  });

  it("renders gallery images with alt text", () => {
    renderWithTheme(<MediaGallery {...createMediaGalleryProps()} />);
    expect(screen.getByAltText("Project showcase 1")).toBeInTheDocument();
    expect(screen.getByAltText("Project showcase 2")).toBeInTheDocument();
    expect(screen.getByAltText("Project showcase 3")).toBeInTheDocument();
    expect(screen.getByAltText("Project showcase 4")).toBeInTheDocument();
  });

  it('variant="grid" renders', () => {
    expect(() => {
      renderWithTheme(<MediaGallery {...createMediaGalleryProps({ variant: "grid" })} />);
    }).not.toThrow();
  });

  it('variant="masonry" renders', () => {
    expect(() => {
      renderWithTheme(<MediaGallery {...createMediaGalleryProps({ variant: "masonry" })} />);
    }).not.toThrow();
  });
});
