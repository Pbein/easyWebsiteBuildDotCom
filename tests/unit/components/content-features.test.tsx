import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import { createContentFeaturesProps } from "../../helpers/component-fixtures";
import { ContentFeatures } from "@/components/library";

describe("ContentFeatures", () => {
  it("renders without crashing", () => {
    expect(() => {
      renderWithTheme(<ContentFeatures {...createContentFeaturesProps()} />);
    }).not.toThrow();
  });

  it("displays headline", () => {
    renderWithTheme(<ContentFeatures {...createContentFeaturesProps()} />);
    expect(screen.getByText("Why Choose Us")).toBeInTheDocument();
  });

  it("renders all feature titles", () => {
    renderWithTheme(<ContentFeatures {...createContentFeaturesProps()} />);
    expect(screen.getByText("Lightning Fast")).toBeInTheDocument();
    expect(screen.getByText("Secure")).toBeInTheDocument();
    expect(screen.getByText("Global CDN")).toBeInTheDocument();
  });

  it("renders all feature descriptions", () => {
    renderWithTheme(<ContentFeatures {...createContentFeaturesProps()} />);
    expect(screen.getByText("Built for speed from the ground up.")).toBeInTheDocument();
    expect(screen.getByText("Enterprise-grade security by default.")).toBeInTheDocument();
    expect(screen.getByText("Content delivered from the nearest edge.")).toBeInTheDocument();
  });

  it('variant="icon-cards" renders without crashing', () => {
    expect(() => {
      renderWithTheme(
        <ContentFeatures {...createContentFeaturesProps({ variant: "icon-cards" })} />
      );
    }).not.toThrow();
  });
});
