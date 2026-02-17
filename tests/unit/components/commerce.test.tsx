// tests/unit/components/commerce.test.tsx
//
// Requirements-first tests for commerce-related components:
// CommerceServices, PricingTable, BlogPreview
//
// @requirements
// - CommerceServices: Uses `name` field (NOT `title`) per CLAUDE.md critical field naming
// - CommerceServices: Displays service descriptions, has accessible aria-label, all 3 variants render
// - PricingTable: Featured plan has visual prominence ("Most Popular" badge in featured variant)
// - PricingTable: Included features visually distinct from excluded (checkmark vs X icon, line-through)
// - PricingTable: CTA buttons render as links with correct href
// - PricingTable: Plan price and period displayed together
// - PricingTable: Works with single plan (no featured), all 3 variants render
// - BlogPreview: Post date and author displayed via PostMeta, accessible aria-label, all 3 variants render

import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import {
  createCommerceServicesProps,
  createPricingTableProps,
  createBlogPreviewProps,
} from "../../helpers/component-fixtures";
import { CommerceServices, PricingTable, BlogPreview } from "@/components/library";

// Mock next/image since BlogPreview uses it for post images
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, blurDataURL, placeholder, ...rest } = props;
    return <img {...rest} />;
  },
}));

/* ================================================================
 * CommerceServices
 *
 * Source: src/components/library/commerce/commerce-services/
 * Key: ServiceItem uses `name` (NOT `title`) — CLAUDE.md critical naming
 * Variants: "card-grid", "list", "tiered"
 * ================================================================ */

describe("CommerceServices", () => {
  // @requirement CLAUDE.md field naming: CommerceServices uses `name` not `title`
  it("displays service names from the `name` field (NOT `title`)", () => {
    const props = createCommerceServicesProps();
    renderWithTheme(<CommerceServices {...props} />);

    // Verify each service name from the fixture is rendered.
    // The ServiceItem interface defines `name: string` — this test guards against
    // accidental renames to `title` which would silently break spec generation.
    for (const service of props.services) {
      expect(screen.getByText(service.name)).toBeTruthy();
    }
  });

  // @requirement Each service description must be visible to the user
  it("displays service descriptions", () => {
    const props = createCommerceServicesProps();
    renderWithTheme(<CommerceServices {...props} />);

    for (const service of props.services) {
      expect(screen.getByText(service.description)).toBeTruthy();
    }
  });

  // @requirement Section must have accessible aria-label for screen readers
  it("has an accessible aria-label from the headline", () => {
    const props = createCommerceServicesProps({ headline: "Premium Services" });
    const { container } = renderWithTheme(<CommerceServices {...props} />);

    const section = container.querySelector("section");
    expect(section).toBeTruthy();
    expect(section!.getAttribute("aria-label")).toBe("Premium Services");
  });

  // @requirement All 3 variants must render without crashing
  it.each(["card-grid", "list", "tiered"] as const)(
    'variant="%s" renders a section with service content',
    (variant) => {
      const props = createCommerceServicesProps({ variant });
      const { container } = renderWithTheme(<CommerceServices {...props} />);

      const section = container.querySelector("section");
      expect(section).toBeTruthy();
      // Verify at least one service name is present in the output
      expect(screen.getByText(props.services[0].name)).toBeTruthy();
    }
  );
});

/* ================================================================
 * PricingTable
 *
 * Source: src/components/library/commerce/pricing-table/
 * Key behaviors:
 * - `featured: true` plan gets "Most Popular" badge + primary bg (in "featured" variant)
 * - PricingFeature.included controls checkmark (true) vs X icon (false) + line-through
 * - CTA buttons rendered as <a> tags with href
 * - Plans display price + period together
 * ================================================================ */

describe("PricingTable", () => {
  // @requirement Featured plan must have "Most Popular" badge in the "featured" variant
  // Source: FeaturedPlanCard renders "Most Popular" span when plan.featured === true
  it("renders 'Most Popular' badge for featured plan in 'featured' variant", () => {
    const props = createPricingTableProps({ variant: "featured" });
    renderWithTheme(<PricingTable {...props} />);

    // The fixture has the "Pro" plan with featured: true
    expect(screen.getByText("Most Popular")).toBeTruthy();
  });

  // @requirement Included features (included:true) are visually distinct from excluded (included:false)
  // Source: FeatureRow renders Check icon for included=true, X icon for included=false,
  // and applies text-decoration: line-through for excluded features
  it("renders included features with checkmark and excluded features with X icon", () => {
    const props = createPricingTableProps({ variant: "featured" });
    const { container } = renderWithTheme(<PricingTable {...props} />);

    // Find all feature list items
    const featureItems = container.querySelectorAll("li");
    expect(featureItems.length).toBeGreaterThan(0);

    // The Starter plan has "Analytics" with included: false.
    // The Pro plan has "Analytics" with included: true.
    // Both render as separate spans with different text-decoration.

    // Check that at least one excluded feature has line-through text decoration
    const excludedFeatureSpans = Array.from(container.querySelectorAll("li span")).filter(
      (span) => {
        const style = (span as HTMLElement).style;
        return style.textDecoration === "line-through";
      }
    );
    expect(excludedFeatureSpans.length).toBeGreaterThan(0);

    // Check that at least one included feature has text-decoration: none
    const includedFeatureSpans = Array.from(container.querySelectorAll("li span")).filter(
      (span) => {
        const style = (span as HTMLElement).style;
        return style.textDecoration === "none";
      }
    );
    expect(includedFeatureSpans.length).toBeGreaterThan(0);

    // "Analytics" appears in both plans — verify both instances exist
    const analyticsElements = screen.getAllByText("Analytics");
    expect(analyticsElements.length).toBe(2);
  });

  // @requirement CTA buttons render as <a> links with correct href
  // Source: PlanCTA renders <a href={plan.cta.href}> with the CTA text
  it("renders CTA buttons as links with correct href", () => {
    const props = createPricingTableProps({ variant: "featured" });
    renderWithTheme(<PricingTable {...props} />);

    const getStartedLink = screen.getByText("Get Started").closest("a");
    expect(getStartedLink).toBeTruthy();
    expect(getStartedLink!.getAttribute("href")).toBe("/signup");

    const goProLink = screen.getByText("Go Pro").closest("a");
    expect(goProLink).toBeTruthy();
    expect(goProLink!.getAttribute("href")).toBe("/signup?plan=pro");
  });

  // @requirement Plan price and period are displayed together
  // Source: SimplePlanCard/FeaturedPlanCard both render price in one span, period in adjacent span
  it("displays plan price and period", () => {
    const props = createPricingTableProps();
    renderWithTheme(<PricingTable {...props} />);

    // Both plans have prices
    expect(screen.getByText("$12")).toBeTruthy();
    expect(screen.getByText("$29")).toBeTruthy();

    // Both plans have "/mo" period — there should be two instances
    const periodElements = screen.getAllByText("/mo");
    expect(periodElements.length).toBe(2);
  });

  // @boundary Works with a single plan and no featured plan
  it("renders correctly with a single non-featured plan", () => {
    const singlePlanProps = createPricingTableProps({
      plans: [
        {
          name: "Basic",
          price: "$0",
          period: "/mo",
          features: [{ text: "1 Website", included: true }],
          cta: { text: "Start Free", href: "/signup" },
        },
      ],
    });
    const { container } = renderWithTheme(<PricingTable {...singlePlanProps} />);

    const section = container.querySelector("section");
    expect(section).toBeTruthy();
    expect(screen.getByText("Basic")).toBeTruthy();
    expect(screen.getByText("$0")).toBeTruthy();
    expect(screen.getByText("Start Free")).toBeTruthy();
  });

  // @requirement All 3 variants render without crashing
  it.each(["simple", "featured", "comparison"] as const)(
    'variant="%s" renders a section with plan content',
    (variant) => {
      const props = createPricingTableProps({ variant });
      const { container } = renderWithTheme(<PricingTable {...props} />);

      const section = container.querySelector("section");
      expect(section).toBeTruthy();
      // Both plan names should be present regardless of variant
      expect(screen.getByText("Starter")).toBeTruthy();
      expect(screen.getByText("Pro")).toBeTruthy();
    }
  );
});

/* ================================================================
 * BlogPreview
 *
 * Source: src/components/library/content/blog-preview/
 * Key behaviors:
 * - PostMeta renders date (Calendar icon) and author (User icon) per post
 * - Uses next/image for post images (mocked above)
 * - Section has aria-label from headline
 * - Variants: "card-grid", "featured-row", "list"
 * ================================================================ */

describe("BlogPreview", () => {
  // @requirement Post date is displayed for each post (showDate defaults to true)
  // Source: PostMeta renders Calendar icon + post.date when showDate=true and post.date exists
  it("displays post dates", () => {
    const props = createBlogPreviewProps();
    renderWithTheme(<BlogPreview {...props} />);

    // Each post in the fixture has a date field
    for (const post of props.posts) {
      expect(screen.getByText(post.date)).toBeTruthy();
    }
  });

  // @requirement Post author is displayed for each post (showAuthor defaults to true)
  // Source: PostMeta renders User icon + post.author when showAuthor=true and post.author exists
  it("displays post authors", () => {
    const props = createBlogPreviewProps();
    renderWithTheme(<BlogPreview {...props} />);

    for (const post of props.posts) {
      if (post.author) {
        expect(screen.getByText(post.author)).toBeTruthy();
      }
    }
  });

  // @requirement Section must have accessible aria-label for screen readers
  it("has an accessible aria-label from the headline", () => {
    const props = createBlogPreviewProps({ headline: "From Our Blog" });
    const { container } = renderWithTheme(<BlogPreview {...props} />);

    const section = container.querySelector("section");
    expect(section).toBeTruthy();
    expect(section!.getAttribute("aria-label")).toBe("From Our Blog");
  });

  // @requirement All 3 variants render without crashing
  it.each(["card-grid", "featured-row", "list"] as const)(
    'variant="%s" renders a section with post content',
    (variant) => {
      const props = createBlogPreviewProps({ variant });
      const { container } = renderWithTheme(<BlogPreview {...props} />);

      const section = container.querySelector("section");
      expect(section).toBeTruthy();
      // Verify post titles are rendered
      expect(screen.getByText(props.posts[0].title)).toBeTruthy();
    }
  );
});
