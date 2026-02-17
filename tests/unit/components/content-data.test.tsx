// tests/unit/components/content-data.test.tsx
//
// Requirements-first tests for data-display content components:
// ContentStats, ContentTimeline, ContentLogos, ContentSteps, ContentComparison
//
// @requirements
// - CLAUDE.md "Content Field Naming" table: value is number, date (not year),
//   headline (no subheadline on logos), steps[] with StepItem, columns+rows with string|boolean
// - CLAUDE.md "Component Library" table: variant lists per component
// - Each component wraps in <section> with accessible aria-label
// - All theme values via CSS custom properties, never hardcoded

import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
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
 * @requirements
 * - StatItem.value is type `number` (CLAUDE.md: "value is number type, not string")
 * - Suffix/prefix combine with value (e.g., "500+", "98%")
 * - Section has accessible aria-label from headline
 * - Variants: "inline", "cards", "animated-counter"
 * ================================================================ */

describe("ContentStats", () => {
  it("renders numeric values with suffix/prefix formatting", () => {
    // @requirement: value is number type; suffix/prefix combine with value
    // The fixture has: 500 with suffix "+", 98 with suffix "%", 24 with prefix ""
    const props = createContentStatsProps();
    const { container } = renderWithTheme(<ContentStats {...props} />);

    // Verify the stat values are rendered as formatted numbers (toLocaleString)
    // 500+ should appear as the formatted value with suffix
    expect(container.textContent).toContain("500");
    expect(container.textContent).toContain("+");
    expect(container.textContent).toContain("98");
    expect(container.textContent).toContain("%");
    expect(container.textContent).toContain("24");
  });

  it("renders each stat with both its value and its label", () => {
    // @requirement: each stat pair (value + label) must be present
    const props = createContentStatsProps();
    renderWithTheme(<ContentStats {...props} />);

    // Labels are required per StatItem interface
    expect(screen.getByText("Clients Served")).toBeTruthy();
    expect(screen.getByText("Satisfaction Rate")).toBeTruthy();
    expect(screen.getByText("Hour Support")).toBeTruthy();
  });

  it("section has accessible aria-label derived from headline", () => {
    // @requirement: section aria-label={headline ?? "Statistics"}
    const props = createContentStatsProps();
    const { container } = renderWithTheme(<ContentStats {...props} />);
    const section = container.querySelector("section");

    expect(section).toBeTruthy();
    expect(section!.getAttribute("aria-label")).toBe("By the Numbers");
  });

  it("falls back to default aria-label when no headline is provided", () => {
    // @requirement: aria-label fallback is "Statistics"
    const props = createContentStatsProps({ headline: undefined });
    const { container } = renderWithTheme(<ContentStats {...props} />);
    const section = container.querySelector("section");

    expect(section!.getAttribute("aria-label")).toBe("Statistics");
  });

  it("all three variants render without crashing", () => {
    // @requirement: variants "inline", "cards", "animated-counter"
    const variants = ["inline", "cards", "animated-counter"] as const;

    for (const variant of variants) {
      const props = createContentStatsProps({ variant });
      const { container } = renderWithTheme(<ContentStats {...props} />);

      const section = container.querySelector("section");
      expect(section).toBeTruthy();
      // Each variant must render all 3 stat labels
      expect(container.textContent).toContain("Clients Served");
      expect(container.textContent).toContain("Satisfaction Rate");
      expect(container.textContent).toContain("Hour Support");
    }
  });
});

/* ================================================================
 * ContentTimeline
 * @requirements
 * - TimelineItem uses `date` field, NOT `year` (CLAUDE.md critical naming rule)
 * - Events render in source order (first item before second in DOM)
 * - Each event shows title, description, and date
 * - Variants: "vertical", "alternating"
 * ================================================================ */

describe("ContentTimeline", () => {
  it("renders date values from the `date` field (not `year`)", () => {
    // @requirement: CLAUDE.md "content-timeline: uses `date` field, NOT `year`"
    // The fixture uses date: "2020", "2021", "2023" on TimelineItem
    const props = createContentTimelineProps();
    renderWithTheme(<ContentTimeline {...props} />);

    // All date values from the `date` field must appear in output
    expect(screen.getAllByText("2020").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2021").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2023").length).toBeGreaterThan(0);
  });

  it("renders events in source order (first before second in DOM)", () => {
    // @requirement: timeline items preserve chronological order
    const props = createContentTimelineProps();
    const { container } = renderWithTheme(<ContentTimeline {...props} />);

    // Get all h3 elements (event titles) and verify DOM order matches data order
    const headings = container.querySelectorAll("h3");
    const titles = Array.from(headings).map((h) => h.textContent);

    const foundIndex = titles.indexOf("Founded");
    const customersIndex = titles.indexOf("First 100 Customers");
    const seriesAIndex = titles.indexOf("Series A");

    expect(foundIndex).toBeGreaterThanOrEqual(0);
    expect(customersIndex).toBeGreaterThan(foundIndex);
    expect(seriesAIndex).toBeGreaterThan(customersIndex);
  });

  it("each event displays title, description, and date together", () => {
    // @requirement: all three fields of each TimelineItem are rendered
    const props = createContentTimelineProps();
    const { container } = renderWithTheme(<ContentTimeline {...props} />);

    // Verify all titles
    expect(screen.getByText("Founded")).toBeTruthy();
    expect(screen.getByText("First 100 Customers")).toBeTruthy();
    expect(screen.getByText("Series A")).toBeTruthy();

    // Verify all descriptions
    expect(screen.getByText("Started in a garage with a big dream.")).toBeTruthy();
    expect(screen.getByText("Reached our first milestone.")).toBeTruthy();
    expect(screen.getByText("Raised funding to scale the platform.")).toBeTruthy();

    // Verify all dates are present (may appear multiple times due to alternating variant)
    expect(container.textContent).toContain("2020");
    expect(container.textContent).toContain("2021");
    expect(container.textContent).toContain("2023");
  });

  it("both variants render without crashing", () => {
    // @requirement: variants "vertical", "alternating"
    const variants = ["vertical", "alternating"] as const;

    for (const variant of variants) {
      const props = createContentTimelineProps({ variant });
      const { container } = renderWithTheme(<ContentTimeline {...props} />);

      const section = container.querySelector("section");
      expect(section).toBeTruthy();
      // Each variant must render all event titles
      expect(container.textContent).toContain("Founded");
      expect(container.textContent).toContain("First 100 Customers");
      expect(container.textContent).toContain("Series A");
    }
  });
});

/* ================================================================
 * ContentLogos
 * @requirements
 * - ContentLogosProps has `headline` but NO `subheadline` property
 *   (CLAUDE.md: "has `headline` (no `subheadline`)")
 * - Each logo's name is displayed (text placeholder when no image)
 * - Variants: "grid", "scroll", "fade"
 * ================================================================ */

describe("ContentLogos", () => {
  it("accepts headline prop and renders it (no subheadline in interface)", () => {
    // @requirement: CLAUDE.md "content-logos: has `headline` (no `subheadline`)"
    // ContentLogosProps type definition confirms: headline?: string, no subheadline field
    const props = createContentLogosProps();
    renderWithTheme(<ContentLogos {...props} />);

    expect(screen.getByText("Trusted By Leading Brands")).toBeTruthy();

    // Verify the section does NOT have a subheadline-like <p> under the heading.
    // The component only renders a headline h2 — no <p> sibling in the header div.
    // (This is a structural assertion, not just "prop doesn't exist" at type level.)
    const h2 = screen.getByText("Trusted By Leading Brands");
    const headerParent = h2.parentElement;
    // The header container should contain only the h2, no paragraph element
    const paragraphs = headerParent?.querySelectorAll("p");
    expect(paragraphs?.length ?? 0).toBe(0);
  });

  it("renders each logo name as visible text", () => {
    // @requirement: logo names displayed (as text badges when no image provided)
    const props = createContentLogosProps();
    renderWithTheme(<ContentLogos {...props} />);

    expect(screen.getByText("Acme Corp")).toBeTruthy();
    expect(screen.getByText("Globex")).toBeTruthy();
    expect(screen.getByText("Initech")).toBeTruthy();
    expect(screen.getByText("Umbrella")).toBeTruthy();
  });

  it("all three variants render without crashing", () => {
    // @requirement: variants "grid", "scroll", "fade"
    const variants = ["grid", "scroll", "fade"] as const;

    for (const variant of variants) {
      const props = createContentLogosProps({ variant });
      const { container } = renderWithTheme(<ContentLogos {...props} />);

      const section = container.querySelector("section");
      expect(section).toBeTruthy();
      // Each variant must render all logo names
      expect(container.textContent).toContain("Acme Corp");
      expect(container.textContent).toContain("Globex");
      expect(container.textContent).toContain("Initech");
      expect(container.textContent).toContain("Umbrella");
    }
  });
});

/* ================================================================
 * ContentSteps
 * @requirements
 * - steps[] with StepItem (title, description, icon optional)
 * - Steps maintain order (step 1 before step 2 in DOM)
 * - Each step shows title and description
 * - icon is optional; works with and without
 * - Variants: "numbered", "icon-cards", "horizontal"
 * ================================================================ */

describe("ContentSteps", () => {
  it("steps render in source order (step 1 appears before step 2 in DOM)", () => {
    // @requirement: step ordering is preserved in rendered output
    const props = createContentStepsProps();
    const { container } = renderWithTheme(<ContentSteps {...props} />);

    const headings = container.querySelectorAll("h3");
    const titles = Array.from(headings).map((h) => h.textContent);

    const step1Idx = titles.indexOf("Tell Us About Your Business");
    const step2Idx = titles.indexOf("We Build Your Site");
    const step3Idx = titles.indexOf("Launch");

    expect(step1Idx).toBeGreaterThanOrEqual(0);
    expect(step2Idx).toBeGreaterThan(step1Idx);
    expect(step3Idx).toBeGreaterThan(step2Idx);
  });

  it("each step renders both title and description", () => {
    // @requirement: StepItem has title + description, both must appear
    const props = createContentStepsProps();
    renderWithTheme(<ContentSteps {...props} />);

    // Titles
    expect(screen.getByText("Tell Us About Your Business")).toBeTruthy();
    expect(screen.getByText("We Build Your Site")).toBeTruthy();
    expect(screen.getByText("Launch")).toBeTruthy();

    // Descriptions
    expect(screen.getByText("Answer a few quick questions.")).toBeTruthy();
    expect(screen.getByText("AI assembles a professional website.")).toBeTruthy();
    expect(screen.getByText("Go live with one click.")).toBeTruthy();
  });

  it("renders without icon (icon is optional in StepItem)", () => {
    // @requirement: StepItem.icon is optional — component must work without it
    // The default fixture does not provide icons — this must not crash
    const props = createContentStepsProps();
    const { container } = renderWithTheme(<ContentSteps {...props} />);

    const section = container.querySelector("section");
    expect(section).toBeTruthy();
    expect(container.textContent).toContain("Tell Us About Your Business");
  });

  it("renders with icon provided on steps", () => {
    // @requirement: StepItem.icon is optional — component must also work WITH it
    const props = createContentStepsProps({
      variant: "icon-cards",
      steps: [
        { title: "Discover", description: "Find your path.", icon: "Zap" },
        { title: "Build", description: "Create your site.", icon: "Hammer" },
        { title: "Ship", description: "Go live.", icon: "Rocket" },
      ],
    });
    const { container } = renderWithTheme(<ContentSteps {...props} />);

    expect(container.querySelector("section")).toBeTruthy();
    expect(screen.getByText("Discover")).toBeTruthy();
    expect(screen.getByText("Build")).toBeTruthy();
    expect(screen.getByText("Ship")).toBeTruthy();
  });

  it("all three variants render without crashing", () => {
    // @requirement: variants "numbered", "icon-cards", "horizontal"
    const variants = ["numbered", "icon-cards", "horizontal"] as const;

    for (const variant of variants) {
      const props = createContentStepsProps({ variant });
      const { container } = renderWithTheme(<ContentSteps {...props} />);

      const section = container.querySelector("section");
      expect(section).toBeTruthy();
      // Every variant must render all step titles
      expect(container.textContent).toContain("Tell Us About Your Business");
      expect(container.textContent).toContain("We Build Your Site");
      expect(container.textContent).toContain("Launch");
    }
  });
});

/* ================================================================
 * ContentComparison
 * @requirements
 * - rows.values can be string OR boolean (CLAUDE.md: "values: string or boolean")
 * - Boolean false gets different visual treatment than true (X icon vs Check icon)
 * - String values render as visible text
 * - Highlighted column has distinct visual styling
 * - Variants: "table", "side-by-side", "checkmark-matrix"
 * ================================================================ */

describe("ContentComparison", () => {
  it("boolean true and false get different visual treatment", () => {
    // @requirement: `true` renders Check icon, `false` renders X icon
    // The CellValue component renders Check for true and X for false.
    // Fixture row: "Custom Domain" has values [false, true, true]
    const props = createContentComparisonProps();
    const { container } = renderWithTheme(<ContentComparison {...props} />);

    // The Check icon uses strokeWidth={2.5} and X uses strokeWidth={2}
    // Both are SVG elements; Check has a checkmark polyline and X has cross lines.
    // We can verify that both icon types are present in the rendered output.
    const svgs = container.querySelectorAll("svg");

    // There should be multiple SVGs: some Check icons and some X icons
    // From fixture data: row 0 has [false, true, true] = 1 X + 2 Checks
    // Rows 1 and 2 are all strings, so no boolean icons for those.
    // Total: at least 1 X icon and 2 Check icons from the first row alone
    expect(svgs.length).toBeGreaterThanOrEqual(3);

    // Verify the false value (X icon) has reduced opacity styling
    // The X span gets opacity: 0.4, while Check span does not
    const xIcons = container.querySelectorAll('svg[class*="lucide-x"]');
    const checkIcons = container.querySelectorAll('svg[class*="lucide-check"]');

    // Both icon types should be present (Check for true, X for false)
    expect(checkIcons.length).toBeGreaterThanOrEqual(1);
    expect(xIcons.length).toBeGreaterThanOrEqual(1);
  });

  it("string values render as visible text in the table", () => {
    // @requirement: string values in rows appear as readable text
    // Fixture rows: "Analytics" = ["Basic", "Advanced", "Advanced"],
    //               "Support" = ["Community", "Email", "Dedicated"]
    const props = createContentComparisonProps();
    renderWithTheme(<ContentComparison {...props} />);

    expect(screen.getByText("Basic")).toBeTruthy();
    expect(screen.getAllByText("Advanced").length).toBe(2);
    expect(screen.getByText("Community")).toBeTruthy();
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Dedicated")).toBeTruthy();
  });

  it("highlighted column receives distinct visual styling", () => {
    // @requirement: ComparisonColumn.highlighted causes different styling
    // In the table variant, highlighted column header gets backgroundColor: primary
    // and color: text-on-primary. Non-highlighted get surface background.
    const props = createContentComparisonProps();
    const { container } = renderWithTheme(<ContentComparison {...props} />);

    // Find column headers (th elements)
    const thElements = container.querySelectorAll("th");
    // First th is empty corner, then Free, Pro (highlighted), Enterprise
    expect(thElements.length).toBe(4);

    // The "Pro" column (index 2) is highlighted and should have primary background
    const proTh = thElements[2]; // 0=corner, 1=Free, 2=Pro, 3=Enterprise
    expect(proTh.textContent).toBe("Pro");
    expect(proTh.style.backgroundColor).toContain("var(--color-primary)");

    // The "Free" column (index 1) is NOT highlighted — should have surface background
    const freeTh = thElements[1];
    expect(freeTh.textContent).toBe("Free");
    expect(freeTh.style.backgroundColor).toContain("var(--color-surface)");
  });

  it("all three variants render without crashing", () => {
    // @requirement: variants "table", "side-by-side", "checkmark-matrix"
    const variants = ["table", "side-by-side", "checkmark-matrix"] as const;

    for (const variant of variants) {
      const props = createContentComparisonProps({ variant });
      const { container } = renderWithTheme(<ContentComparison {...props} />);

      const section = container.querySelector("section");
      expect(section).toBeTruthy();
      // Every variant must show the headline and feature names
      expect(container.textContent).toContain("Compare Plans");
      expect(container.textContent).toContain("Custom Domain");
      expect(container.textContent).toContain("Analytics");
      expect(container.textContent).toContain("Support");
    }
  });
});
