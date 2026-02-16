import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithTheme } from "../../../helpers/render-with-theme";
import { Step5Emotion } from "@/components/platform/intake/Step5Emotion";
import { EMOTIONAL_OUTCOMES } from "@/lib/types/brand-character";

// ── Mock intake store ─────────────────────────────────────────────
const mockSetEmotionalGoals = vi.fn();

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

function renderStep5(overrides: Partial<{ onComplete: () => void; onBack: () => void }> = {}) {
  const onComplete = overrides.onComplete ?? vi.fn();
  const onBack = overrides.onBack ?? vi.fn();
  return {
    ...renderWithTheme(<Step5Emotion onComplete={onComplete} onBack={onBack} />),
    onComplete,
    onBack,
  };
}

// ── Tests ─────────────────────────────────────────────────────────

describe("Step5Emotion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to defaults
    mockStore.emotionalGoals = [];
    mockStore.setEmotionalGoals = mockSetEmotionalGoals;
  });

  it('renders the heading "How should visitors FEEL in the first 5 seconds?"', () => {
    renderStep5();
    expect(
      screen.getByText("How should visitors FEEL in the first 5 seconds?")
    ).toBeInTheDocument();
  });

  it("renders all 10 emotional outcomes", () => {
    renderStep5();
    for (const emotion of EMOTIONAL_OUTCOMES) {
      expect(screen.getByText(emotion.label)).toBeInTheDocument();
    }
  });

  it("renders each emotion's label and description", () => {
    renderStep5();
    for (const emotion of EMOTIONAL_OUTCOMES) {
      expect(screen.getByText(emotion.label)).toBeInTheDocument();
      expect(screen.getByText(emotion.description)).toBeInTheDocument();
    }
  });

  it("Continue button is disabled when no emotions selected", () => {
    renderStep5();
    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });

  it("Continue button is enabled when 1 emotion selected", () => {
    mockStore.emotionalGoals = ["trust"];
    renderStep5();
    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeEnabled();
  });

  it("clicking an emotion calls setEmotionalGoals with that emotion added", () => {
    mockStore.emotionalGoals = [];
    renderStep5();
    fireEvent.click(screen.getByText("Trust"));
    expect(mockSetEmotionalGoals).toHaveBeenCalledWith(["trust"]);
  });

  it("clicking a selected emotion calls setEmotionalGoals without that emotion", () => {
    mockStore.emotionalGoals = ["trust"];
    renderStep5();
    fireEvent.click(screen.getByText("Trust"));
    expect(mockSetEmotionalGoals).toHaveBeenCalledWith([]);
  });

  it("when 2 emotions selected, other emotion buttons are disabled", () => {
    mockStore.emotionalGoals = ["trust", "luxury"];
    renderStep5();

    // The two selected emotions should NOT be disabled (they can be toggled off)
    const trustButton = screen.getByText("Trust").closest("button");
    const luxuryButton = screen.getByText("Luxury").closest("button");
    expect(trustButton).toBeEnabled();
    expect(luxuryButton).toBeEnabled();

    // An unselected emotion should be disabled
    const calmButton = screen.getByText("Calm").closest("button");
    expect(calmButton).toBeDisabled();
  });

  it("Back button calls onBack when clicked", () => {
    const { onBack } = renderStep5();
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("Continue button calls onComplete when clicked with a selection", () => {
    mockStore.emotionalGoals = ["calm"];
    const { onComplete } = renderStep5();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("renders a Check icon on selected emotions", () => {
    mockStore.emotionalGoals = ["trust"];
    const { container } = renderStep5();

    // The selected emotion button should contain an SVG (the Check icon)
    const trustButton = screen.getByText("Trust").closest("button")!;
    const checkSvg = trustButton.querySelector("div.absolute svg");
    expect(checkSvg).toBeInTheDocument();

    // An unselected emotion should NOT have the absolute check container
    const calmButton = screen.getByText("Calm").closest("button")!;
    const noCheck = calmButton.querySelector("div.absolute");
    expect(noCheck).not.toBeInTheDocument();
  });

  it('shows "Pick 1-2 emotional reactions" instruction text', () => {
    renderStep5();
    expect(screen.getByText(/pick 1-2 emotional reactions/i)).toBeInTheDocument();
  });
});
