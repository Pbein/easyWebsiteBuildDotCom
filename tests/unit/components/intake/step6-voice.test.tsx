import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithTheme } from "../../../helpers/render-with-theme";
import { Step6Voice } from "@/components/platform/intake/Step6Voice";
import {
  VOICE_TONE_CARDS,
  NARRATIVE_PROMPT_DEFS,
  NARRATIVE_PLACEHOLDERS,
} from "@/lib/types/brand-character";

// ── Mock intake store ─────────────────────────────────────────────
const mockSetVoiceProfile = vi.fn();
const mockSetNarrativePrompt = vi.fn();

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

function renderStep6(overrides: Partial<{ onComplete: () => void; onBack: () => void }> = {}) {
  const onComplete = overrides.onComplete ?? vi.fn();
  const onBack = overrides.onBack ?? vi.fn();
  return {
    ...renderWithTheme(<Step6Voice onComplete={onComplete} onBack={onBack} />),
    onComplete,
    onBack,
  };
}

// ── Tests ─────────────────────────────────────────────────────────

describe("Step6Voice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.voiceProfile = null;
    mockStore.setVoiceProfile = mockSetVoiceProfile;
    mockStore.narrativePrompts = {};
    mockStore.setNarrativePrompt = mockSetNarrativePrompt;
    mockStore.businessName = "Acme Co";
    mockStore.siteType = "business";
    mockStore.goal = "contact";
    mockStore.description = "";
  });

  it('renders "In your own words" heading', () => {
    renderStep6();
    expect(screen.getByText("In your own words")).toBeInTheDocument();
  });

  it("renders all 3 narrative prompt inputs", () => {
    renderStep6();
    // Each prompt renders as a labeled input; check they exist
    for (const prompt of NARRATIVE_PROMPT_DEFS) {
      const input = screen.getByRole("textbox", {
        name: new RegExp(
          prompt.key === "come_because"
            ? "People come to"
            : prompt.key === "frustrated_with"
              ? "Before finding us"
              : "After working with us"
        ),
      });
      expect(input).toBeInTheDocument();
    }
  });

  it("narrative prompts show correct labels with businessName interpolated", () => {
    mockStore.businessName = "Taco Palace";
    renderStep6();
    // First prompt should include the business name
    expect(screen.getByText(/People come to Taco Palace because/)).toBeInTheDocument();
    // Second and third don't use businessName, but render as-is
    expect(screen.getByText(/Before finding us, people were frustrated with/)).toBeInTheDocument();
    expect(screen.getByText(/After working with us, people feel/)).toBeInTheDocument();
  });

  it("narrative prompts show industry-specific placeholders for restaurant siteType", () => {
    mockStore.siteType = "restaurant";
    renderStep6();
    const restaurantPlaceholders = NARRATIVE_PLACEHOLDERS.restaurant;
    // Check the first input has the restaurant-specific placeholder
    const firstInput = screen.getByRole("textbox", { name: /People come to/ });
    expect(firstInput).toHaveAttribute("placeholder", restaurantPlaceholders.come_because);
  });

  it("typing in narrative prompt calls setNarrativePrompt", () => {
    renderStep6();
    const firstInput = screen.getByRole("textbox", { name: /People come to/ });
    fireEvent.change(firstInput, { target: { value: "we deliver results" } });
    expect(mockSetNarrativePrompt).toHaveBeenCalledWith("come_because", "we deliver results");
  });

  it('renders "How should [businessName] sound?" heading', () => {
    mockStore.businessName = "Acme Co";
    renderStep6();
    expect(screen.getByText("How should Acme Co sound?")).toBeInTheDocument();
  });

  it("renders all 3 voice tone cards with labels and taglines", () => {
    renderStep6();
    for (const card of VOICE_TONE_CARDS) {
      expect(screen.getByText(card.label)).toBeInTheDocument();
      expect(screen.getByText(card.tagline)).toBeInTheDocument();
    }
  });

  it("Continue button is disabled when no voice selected", () => {
    mockStore.voiceProfile = null;
    renderStep6();
    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });

  it("Continue button is enabled when voice selected", () => {
    mockStore.voiceProfile = "warm";
    renderStep6();
    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeEnabled();
  });

  it("clicking a voice card calls setVoiceProfile with the tone id", () => {
    renderStep6();
    // Click "Direct & Clear" card
    fireEvent.click(screen.getByText("Direct & Clear"));
    expect(mockSetVoiceProfile).toHaveBeenCalledWith("direct");
  });

  it("selected voice card shows Check icon", () => {
    mockStore.voiceProfile = "polished";
    renderStep6();

    // The selected card should have an absolute-positioned check
    const selectedCard = screen.getByText("Polished & Refined").closest("button")!;
    const checkSvg = selectedCard.querySelector("div.absolute svg");
    expect(checkSvg).toBeInTheDocument();

    // An unselected card should not
    const unselectedCard = screen.getByText("Warm & Friendly").closest("button")!;
    const noCheck = unselectedCard.querySelector("div.absolute");
    expect(noCheck).not.toBeInTheDocument();
  });

  it("voice cards show personalized headline preview", () => {
    mockStore.businessName = "Taco Palace";
    mockStore.siteType = "restaurant";
    renderStep6();

    // The warm card should show the restaurant-specific headline
    // The headline is wrapped in left/right double quotes within the component
    expect(screen.getByText(/welcome to Taco Palace/i)).toBeInTheDocument();
  });

  it("Back button calls onBack", () => {
    const { onBack } = renderStep6();
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("Continue button calls onComplete when clicked with selection", () => {
    mockStore.voiceProfile = "warm";
    const { onComplete } = renderStep6();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
