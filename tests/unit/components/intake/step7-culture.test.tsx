import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithTheme } from "../../../helpers/render-with-theme";
import { Step7Culture } from "@/components/platform/intake/Step7Culture";
import {
  BRAND_ARCHETYPES,
  ANTI_REFERENCES,
  INDUSTRY_ANTI_REFERENCES,
} from "@/lib/types/brand-character";

// ── Mock intake store ─────────────────────────────────────────────
const mockSetBrandArchetype = vi.fn();
const mockSetAntiReferences = vi.fn();

const mockStore: Record<string, unknown> = {};

vi.mock("@/lib/stores/intake-store", () => ({
  useIntakeStore: (selector?: (state: Record<string, unknown>) => unknown) => {
    if (typeof selector === "function") {
      return selector(mockStore);
    }
    return mockStore;
  },
}));

// ── Helpers ───────────────────────────────────────────────────────

function renderStep7(overrides: Partial<{ onComplete: () => void; onBack: () => void }> = {}) {
  const onComplete = overrides.onComplete ?? vi.fn();
  const onBack = overrides.onBack ?? vi.fn();
  return {
    ...renderWithTheme(<Step7Culture onComplete={onComplete} onBack={onBack} />),
    onComplete,
    onBack,
  };
}

// ── Tests ─────────────────────────────────────────────────────────

describe("Step7Culture", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.brandArchetype = null;
    mockStore.setBrandArchetype = mockSetBrandArchetype;
    mockStore.antiReferences = [];
    mockStore.setAntiReferences = mockSetAntiReferences;
    mockStore.siteType = null;
  });

  it('renders "What role does your brand play?" heading', () => {
    renderStep7();
    expect(screen.getByText("What role does your brand play?")).toBeInTheDocument();
  });

  it("renders all 6 brand archetypes with labels", () => {
    renderStep7();
    for (const archetype of BRAND_ARCHETYPES) {
      expect(screen.getByText(archetype.label)).toBeInTheDocument();
    }
  });

  it("renders archetype taglines and descriptions", () => {
    renderStep7();
    for (const archetype of BRAND_ARCHETYPES) {
      expect(screen.getByText(archetype.tagline)).toBeInTheDocument();
      expect(screen.getByText(archetype.description)).toBeInTheDocument();
    }
  });

  it("clicking archetype calls setBrandArchetype", () => {
    renderStep7();
    fireEvent.click(screen.getByText("The Creative"));
    expect(mockSetBrandArchetype).toHaveBeenCalledWith("creative");
  });

  it("selected archetype shows Check icon", () => {
    mockStore.brandArchetype = "guide";
    renderStep7();

    const selectedButton = screen.getByText("The Guide").closest("button")!;
    const checkSvg = selectedButton.querySelector("div.absolute svg");
    expect(checkSvg).toBeInTheDocument();

    // Unselected should not have the absolute check container
    const unselectedButton = screen.getByText("The Expert").closest("button")!;
    const noCheck = unselectedButton.querySelector("div.absolute");
    expect(noCheck).not.toBeInTheDocument();
  });

  it("Continue button is disabled when no archetype selected", () => {
    mockStore.brandArchetype = null;
    renderStep7();
    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });

  it("Continue button is enabled when archetype selected", () => {
    mockStore.brandArchetype = "rebel";
    renderStep7();
    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeEnabled();
  });

  it('renders "What should your site NEVER feel like?" heading', () => {
    renderStep7();
    expect(screen.getByText("What should your site NEVER feel like?")).toBeInTheDocument();
  });

  it("renders all 10 general anti-reference pills", () => {
    renderStep7();
    for (const ref of ANTI_REFERENCES) {
      expect(screen.getByText(ref.label)).toBeInTheDocument();
    }
  });

  it("clicking anti-ref calls setAntiReferences with it added", () => {
    mockStore.antiReferences = [];
    renderStep7();
    fireEvent.click(screen.getByText("Corporate"));
    expect(mockSetAntiReferences).toHaveBeenCalledWith(["corporate"]);
  });

  it("clicking active anti-ref calls setAntiReferences with it removed", () => {
    mockStore.antiReferences = ["corporate", "cheap"];
    renderStep7();
    fireEvent.click(screen.getByText("Corporate"));
    expect(mockSetAntiReferences).toHaveBeenCalledWith(["cheap"]);
  });

  it("shows industry-specific anti-references when siteType matches (restaurant)", () => {
    mockStore.siteType = "restaurant";
    renderStep7();

    const restaurantRefs = INDUSTRY_ANTI_REFERENCES.restaurant;
    for (const ref of restaurantRefs) {
      expect(screen.getByText(ref.label)).toBeInTheDocument();
    }
    // Also verify the "For your industry specifically:" label appears
    expect(screen.getByText("For your industry specifically:")).toBeInTheDocument();
  });
});
