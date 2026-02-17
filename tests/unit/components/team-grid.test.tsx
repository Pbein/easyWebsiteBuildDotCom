/**
 * @requirements TeamGrid — Requirements-First Tests
 *
 * Source: src/components/library/team/team-grid/TeamGrid.tsx
 * Variants: cards (variants/cards.tsx), minimal (variants/minimal.tsx),
 *           hover-reveal (variants/hover-reveal.tsx)
 * Shared: shared.tsx — getInitials(), AvatarFallback, SectionHeader
 *
 * Key behaviors under test:
 *   - Uses `image` field (CLAUDE.md contract — NOT `avatar`)
 *   - Member names and roles are displayed in all variants
 *   - Initials fallback: when no image, AvatarFallback renders initials
 *     via getInitials() — first letter of each word, uppercased, max 2 chars
 *   - Section aria-label uses headline, falls back to "Our Team"
 *   - All 3 variants ("cards", "minimal", "hover-reveal") render without crashing
 *
 * These tests validate REQUIREMENTS and BEHAVIOR, not implementation details.
 */

import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import { createTeamGridProps } from "../../helpers/component-fixtures";
import { TeamGrid } from "@/components/library";

// Mock next/image since TeamGrid variants use it for member images
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, blurDataURL, placeholder, ...rest } = props;
    return <img {...rest} />;
  },
}));

/* ── Test 1: image field contract ─────────────────────────────── */

describe("TeamGrid — data contract", () => {
  it("contract: uses `image` field (not `avatar`) — no <img> tags when members lack images", () => {
    // The default fixture members have no `image` property, which triggers
    // the AvatarFallback (initials circle) instead of an <img>.
    const { container } = renderWithTheme(<TeamGrid {...createTeamGridProps()} />);

    // All members should still render their names
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Williams")).toBeInTheDocument();
    expect(screen.getByText("Carol Davis")).toBeInTheDocument();

    // No <img> tags since members have no image — only fallback initials
    const images = container.querySelectorAll("img");
    expect(images.length).toBe(0);
  });
});

/* ── Test 2: Member names and roles ──────────────────────────── */

describe("TeamGrid — attribution", () => {
  it("requirement: member names are displayed", () => {
    renderWithTheme(<TeamGrid {...createTeamGridProps()} />);

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Williams")).toBeInTheDocument();
    expect(screen.getByText("Carol Davis")).toBeInTheDocument();
  });

  it("requirement: member roles are displayed", () => {
    renderWithTheme(<TeamGrid {...createTeamGridProps()} />);

    expect(screen.getByText("CEO")).toBeInTheDocument();
    expect(screen.getByText("CTO")).toBeInTheDocument();
    expect(screen.getByText("Head of Design")).toBeInTheDocument();
  });
});

/* ── Test 3: Initials fallback ───────────────────────────────── */

describe("TeamGrid — initials fallback", () => {
  it("requirement: when no image, member initials are shown as avatar fallback", () => {
    // Default fixture members have no `image`, so AvatarFallback should
    // render initials via getInitials(): "Alice Johnson" → "AJ",
    // "Bob Williams" → "BW", "Carol Davis" → "CD"
    const { container } = renderWithTheme(<TeamGrid {...createTeamGridProps()} />);

    // getInitials splits on spaces, takes first char of each word,
    // uppercases, and slices to 2 chars. The initials appear as text
    // content within the avatar fallback spans.
    expect(container.textContent).toContain("AJ");
    expect(container.textContent).toContain("BW");
    expect(container.textContent).toContain("CD");
  });
});

/* ── Test 4: Accessibility ───────────────────────────────────── */

describe("TeamGrid — accessibility", () => {
  it("contract: section uses headline as aria-label when provided", () => {
    renderWithTheme(<TeamGrid {...createTeamGridProps()} />);

    const section = screen.getByRole("region", { name: "Meet the Team" });
    expect(section).toBeInTheDocument();
  });

  it("contract: section falls back to 'Our Team' aria-label when no headline", () => {
    renderWithTheme(<TeamGrid {...createTeamGridProps({ headline: undefined })} />);

    const section = screen.getByRole("region", { name: "Our Team" });
    expect(section).toBeInTheDocument();
  });
});

/* ── Test 5: All variants render ─────────────────────────────── */

describe("TeamGrid — variants", () => {
  it.each(["cards", "minimal", "hover-reveal"] as const)(
    "contract: '%s' variant renders without crashing and shows member names",
    (variant) => {
      expect(() => {
        renderWithTheme(<TeamGrid {...createTeamGridProps({ variant })} />);
      }).not.toThrow();

      // All member names should be present regardless of variant.
      // Note: hover-reveal renders each name twice (default overlay + hover overlay),
      // so we use getAllByText which works for all variants.
      expect(screen.getAllByText("Alice Johnson").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Bob Williams").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Carol Davis").length).toBeGreaterThanOrEqual(1);
    }
  );
});
