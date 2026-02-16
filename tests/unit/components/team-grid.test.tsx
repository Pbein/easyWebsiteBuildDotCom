// tests/unit/components/team-grid.test.tsx
//
// Unit tests for the TeamGrid component

import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import { createTeamGridProps } from "../../helpers/component-fixtures";
import { TeamGrid } from "@/components/library";

// Mock next/image since TeamGrid cards variant uses it for member images
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, blurDataURL, placeholder, ...rest } = props;
    return <img {...rest} />;
  },
}));

describe("TeamGrid", () => {
  it("renders without crashing", () => {
    const props = createTeamGridProps();
    const { container } = renderWithTheme(<TeamGrid {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays member names", () => {
    const props = createTeamGridProps();
    renderWithTheme(<TeamGrid {...props} />);
    expect(screen.getByText("Alice Johnson")).toBeTruthy();
    expect(screen.getByText("Bob Williams")).toBeTruthy();
    expect(screen.getByText("Carol Davis")).toBeTruthy();
  });

  it("displays member roles", () => {
    const props = createTeamGridProps();
    renderWithTheme(<TeamGrid {...props} />);
    expect(screen.getByText("CEO")).toBeTruthy();
    expect(screen.getByText("CTO")).toBeTruthy();
    expect(screen.getByText("Head of Design")).toBeTruthy();
  });

  it("uses `image` field (not `avatar`) — renders without crashing when members have no image", () => {
    // The default fixture members have no `image` property, which should
    // trigger the avatar fallback (initials circle) instead of crashing.
    const props = createTeamGridProps();
    const { container } = renderWithTheme(<TeamGrid {...props} />);
    // Component should still render all members with their fallback avatars
    expect(screen.getByText("Alice Johnson")).toBeTruthy();
    expect(screen.getByText("Bob Williams")).toBeTruthy();
    expect(screen.getByText("Carol Davis")).toBeTruthy();
    // No <img> tags since members have no image — only fallback initials
    const images = container.querySelectorAll("img");
    expect(images.length).toBe(0);
  });

  it('variant="cards" renders', () => {
    const props = createTeamGridProps({ variant: "cards" });
    const { container } = renderWithTheme(<TeamGrid {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
    expect(screen.getByText("Alice Johnson")).toBeTruthy();
  });
});
