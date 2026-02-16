// tests/unit/components/content-data.test.tsx
//
// Unit tests for data-display content components:
// ContentStats, ContentTimeline, ContentLogos, ContentSteps, ContentComparison

import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import {
  createContentStatsProps,
  createContentTimelineProps,
  createContentLogosProps,
  createContentStepsProps,
  createContentComparisonProps,
} from "../../helpers/component-fixtures";
import {
  ContentStats,
  ContentTimeline,
  ContentLogos,
  ContentSteps,
  ContentComparison,
} from "@/components/library";

/* ================================================================
 * ContentStats
 * ================================================================ */

describe("ContentStats", () => {
  it("renders without crashing", () => {
    const props = createContentStatsProps();
    const { container } = renderWithTheme(<ContentStats {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays stat labels", () => {
    const props = createContentStatsProps();
    renderWithTheme(<ContentStats {...props} />);
    expect(screen.getByText("Clients Served")).toBeTruthy();
    expect(screen.getByText("Satisfaction Rate")).toBeTruthy();
    expect(screen.getByText("Hour Support")).toBeTruthy();
  });

  it('variant="cards" renders', () => {
    const props = createContentStatsProps({ variant: "cards" });
    const { container } = renderWithTheme(<ContentStats {...props} />);
    // Cards variant renders a grid of stat cards
    expect(container.querySelector("section")).toBeTruthy();
    expect(screen.getByText("Clients Served")).toBeTruthy();
  });
});

/* ================================================================
 * ContentTimeline
 * ================================================================ */

describe("ContentTimeline", () => {
  it("renders without crashing", () => {
    const props = createContentTimelineProps();
    const { container } = renderWithTheme(<ContentTimeline {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays timeline event titles", () => {
    const props = createContentTimelineProps();
    renderWithTheme(<ContentTimeline {...props} />);
    expect(screen.getByText("Founded")).toBeTruthy();
    expect(screen.getByText("First 100 Customers")).toBeTruthy();
    expect(screen.getByText("Series A")).toBeTruthy();
  });

  it('uses `date` field (not `year`) — "2020" appears in output', () => {
    const props = createContentTimelineProps();
    renderWithTheme(<ContentTimeline {...props} />);
    // The fixture uses date: "2020", "2021", "2023"
    expect(screen.getAllByText("2020").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2021").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2023").length).toBeGreaterThan(0);
  });
});

/* ================================================================
 * ContentLogos
 * ================================================================ */

describe("ContentLogos", () => {
  it("renders without crashing", () => {
    const props = createContentLogosProps();
    const { container } = renderWithTheme(<ContentLogos {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays logo names", () => {
    const props = createContentLogosProps();
    renderWithTheme(<ContentLogos {...props} />);
    expect(screen.getByText("Acme Corp")).toBeTruthy();
    expect(screen.getByText("Globex")).toBeTruthy();
    expect(screen.getByText("Initech")).toBeTruthy();
    expect(screen.getByText("Umbrella")).toBeTruthy();
  });

  it("displays headline", () => {
    const props = createContentLogosProps();
    renderWithTheme(<ContentLogos {...props} />);
    expect(screen.getByText("Trusted By Leading Brands")).toBeTruthy();
  });
});

/* ================================================================
 * ContentSteps
 * ================================================================ */

describe("ContentSteps", () => {
  it("renders without crashing", () => {
    const props = createContentStepsProps();
    const { container } = renderWithTheme(<ContentSteps {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays step titles", () => {
    const props = createContentStepsProps();
    renderWithTheme(<ContentSteps {...props} />);
    expect(screen.getByText("Tell Us About Your Business")).toBeTruthy();
    expect(screen.getByText("We Build Your Site")).toBeTruthy();
    expect(screen.getByText("Launch")).toBeTruthy();
  });

  it('variant="numbered" renders', () => {
    const props = createContentStepsProps({ variant: "numbered" });
    const { container } = renderWithTheme(<ContentSteps {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
    // Numbered variant renders step titles
    expect(screen.getByText("Tell Us About Your Business")).toBeTruthy();
  });
});

/* ================================================================
 * ContentComparison
 * ================================================================ */

describe("ContentComparison", () => {
  it("renders without crashing", () => {
    const props = createContentComparisonProps();
    const { container } = renderWithTheme(<ContentComparison {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays column names", () => {
    const props = createContentComparisonProps();
    renderWithTheme(<ContentComparison {...props} />);
    expect(screen.getByText("Free")).toBeTruthy();
    expect(screen.getByText("Pro")).toBeTruthy();
    expect(screen.getByText("Enterprise")).toBeTruthy();
  });

  it("displays feature names from rows", () => {
    const props = createContentComparisonProps();
    renderWithTheme(<ContentComparison {...props} />);
    expect(screen.getByText("Custom Domain")).toBeTruthy();
    expect(screen.getByText("Analytics")).toBeTruthy();
    expect(screen.getByText("Support")).toBeTruthy();
  });
});
