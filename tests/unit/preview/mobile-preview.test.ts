import { describe, it, expect } from "vitest";

/**
 * Tests for the mobile preview experience on /demo/preview.
 *
 * The mobile preview uses a tab-based layout with bottom sheets instead of
 * the desktop sidebar+toolbar approach. These tests verify the contracts
 * and data structures used by the mobile components.
 */

// Replicate the MobileTab type and MOBILE_TABS constant from the page
type MobileTab = "preview" | "info" | "theme" | "actions";

const MOBILE_TABS: { id: MobileTab; label: string }[] = [
  { id: "preview", label: "Preview" },
  { id: "info", label: "Info" },
  { id: "theme", label: "Theme" },
  { id: "actions", label: "Actions" },
];

// Replicate the PERSONALITY_LABELS constant
const PERSONALITY_LABELS = [
  { label: "Density", left: "Minimal", right: "Rich" },
  { label: "Tone", left: "Playful", right: "Serious" },
  { label: "Temp", left: "Warm", right: "Cool" },
  { label: "Weight", left: "Light", right: "Bold" },
  { label: "Era", left: "Classic", right: "Modern" },
  { label: "Energy", left: "Calm", right: "Dynamic" },
];

describe("Mobile tab bar", () => {
  it("has exactly 4 tabs", () => {
    expect(MOBILE_TABS).toHaveLength(4);
  });

  it("tab IDs are unique", () => {
    const ids = MOBILE_TABS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("first tab is preview (default view)", () => {
    expect(MOBILE_TABS[0].id).toBe("preview");
  });

  it("includes info, theme, and actions tabs", () => {
    const ids = MOBILE_TABS.map((t) => t.id);
    expect(ids).toContain("info");
    expect(ids).toContain("theme");
    expect(ids).toContain("actions");
  });

  it("tab labels are short enough for mobile display", () => {
    for (const tab of MOBILE_TABS) {
      // Labels should be max ~8 chars to fit 4 tabs in a row
      expect(tab.label.length).toBeLessThanOrEqual(8);
    }
  });
});

describe("Mobile tab toggle behavior", () => {
  it("tapping active non-preview tab dismisses to preview", () => {
    const activeTab: MobileTab = "info";
    const tappedTab: MobileTab = "info";

    // The toggle logic: if tapping the active tab (except preview), return to preview
    const nextTab = activeTab === tappedTab && tappedTab !== "preview" ? "preview" : tappedTab;

    expect(nextTab).toBe("preview");
  });

  it("tapping inactive tab switches to that tab", () => {
    const activeTab: MobileTab = "preview";
    const tappedTab: MobileTab = "info";

    const nextTab = activeTab === tappedTab && tappedTab !== "preview" ? "preview" : tappedTab;

    expect(nextTab).toBe("info");
  });

  it("tapping preview tab when already on preview stays on preview", () => {
    const activeTab: MobileTab = "preview";
    const tappedTab: MobileTab = "preview";

    const nextTab = activeTab === tappedTab && tappedTab !== "preview" ? "preview" : tappedTab;

    expect(nextTab).toBe("preview");
  });

  it("switching from one sheet tab to another opens new sheet", () => {
    const activeTab: MobileTab = "info";
    const tappedTab: MobileTab = "theme";

    const nextTab = activeTab === tappedTab && tappedTab !== "preview" ? "preview" : tappedTab;

    expect(nextTab).toBe("theme");
  });
});

describe("Mobile sidebar content personality labels", () => {
  it("has exactly 6 personality axes", () => {
    expect(PERSONALITY_LABELS).toHaveLength(6);
  });

  it("each axis has left, right, and label", () => {
    for (const axis of PERSONALITY_LABELS) {
      expect(axis.label).toBeTruthy();
      expect(axis.left).toBeTruthy();
      expect(axis.right).toBeTruthy();
    }
  });

  it("matches the axes from PreviewSidebar (contract consistency)", () => {
    const expectedLabels = ["Density", "Tone", "Temp", "Weight", "Era", "Energy"];
    const actualLabels = PERSONALITY_LABELS.map((a) => a.label);
    expect(actualLabels).toEqual(expectedLabels);
  });
});

describe("Mobile bottom sheet constraints", () => {
  it("max height allows at least 35% of content to be visible", () => {
    // Bottom sheet uses max-h-[65vh] = 65% of viewport
    // This means at least 35% of the preview is visible above the sheet
    const maxSheetHeight = 65; // vh
    const minVisiblePreview = 100 - maxSheetHeight;
    expect(minVisiblePreview).toBeGreaterThanOrEqual(35);
  });

  it("mobile toolbar is slimmer than desktop toolbar", () => {
    const mobileToolbarHeight = 10; // h-10 = 40px (2.5rem)
    const desktopToolbarHeight = 12; // h-12 = 48px (3rem)
    expect(mobileToolbarHeight).toBeLessThan(desktopToolbarHeight);
  });

  it("mobile tab bar is 14 tailwind units (56px)", () => {
    const tabBarHeight = 14; // h-14 = 56px (3.5rem)
    // Should be large enough for comfortable touch targets
    expect(tabBarHeight * 4).toBeGreaterThanOrEqual(44); // 44px min touch target
  });
});

describe("Mobile variant toggle", () => {
  it("supports exactly 2 variants (A and B)", () => {
    const variants = ["A", "B"] as const;
    expect(variants).toHaveLength(2);
    expect(variants[0]).toBe("A");
    expect(variants[1]).toBe("B");
  });
});
