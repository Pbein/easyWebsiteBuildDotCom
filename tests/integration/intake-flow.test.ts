import { describe, it, expect, beforeEach } from "vitest";
import { useIntakeStore } from "@/lib/stores/intake-store";

describe("Intake Flow State Transitions", () => {
  beforeEach(() => {
    useIntakeStore.getState().reset();
  });

  it("simulates full 9-step flow", () => {
    const store = useIntakeStore.getState;

    // Step 1: Site Type
    store().setSiteType("business");
    store().goNext();
    expect(store().currentStep).toBe(2);

    // Step 2: Goal
    store().setGoal("contact");
    store().goNext();
    expect(store().currentStep).toBe(3);

    // Step 3: Business Info
    store().setBusinessName("TestBiz");
    store().setDescription("A consulting firm");
    store().goNext();
    expect(store().currentStep).toBe(4);

    // Step 4: Personality
    store().setPersonalityAxis(0, 0.7);
    store().setPersonalityAxis(1, 0.8);
    store().goNext();
    expect(store().currentStep).toBe(5);

    // Step 5: Emotional Goals
    store().setEmotionalGoals(["trust", "confidence"]);
    store().goNext();
    expect(store().currentStep).toBe(6);

    // Step 6: Voice & Narrative
    store().setVoiceProfile("polished");
    store().setNarrativePrompt("mission", "We deliver results");
    store().goNext();
    expect(store().currentStep).toBe(7);

    // Step 7: Culture & Anti-References
    store().setBrandArchetype("sage");
    store().setAntiReferences(["salesy", "corporate"]);
    store().goNext();
    expect(store().currentStep).toBe(8);

    // Step 8: AI Discovery
    store().setAiQuestions([{ id: "q1", question: "What services?", type: "text" }]);
    store().setAiResponse("q1", "Consulting and strategy");
    store().goNext();
    expect(store().currentStep).toBe(9);

    // Step 9: Generation
    store().setSpecId("spec_123");
    store().goNext();
    expect(store().showSummary).toBe(true);
  });

  it("supports back navigation through all steps", () => {
    const store = useIntakeStore.getState;

    // Navigate forward to step 5
    for (let i = 0; i < 4; i++) {
      store().goNext();
    }
    expect(store().currentStep).toBe(5);

    // Navigate back to step 1
    for (let i = 0; i < 4; i++) {
      store().goBack();
    }
    expect(store().currentStep).toBe(1);
  });

  it("changing site type resets goal", () => {
    const store = useIntakeStore.getState;
    store().setSiteType("business");
    store().setGoal("contact");
    store().setSiteType("portfolio");
    expect(store().goal).toBeNull();
  });

  it("reset generates a fresh session", () => {
    const store = useIntakeStore.getState;
    store().setSiteType("business");
    store().goToStep(5);
    const oldSession = store().sessionId;
    store().reset();
    expect(store().sessionId).not.toBe(oldSession);
    expect(store().currentStep).toBe(1);
    expect(store().siteType).toBeNull();
  });

  it("brand character data persists across step navigation", () => {
    const store = useIntakeStore.getState;
    store().goToStep(5);
    store().setEmotionalGoals(["trust"]);
    store().goNext();
    store().setVoiceProfile("warm");
    store().goBack();
    // Going back shouldn't lose the emotional goals
    expect(store().emotionalGoals).toEqual(["trust"]);
    // Voice profile should also persist
    expect(store().voiceProfile).toBe("warm");
  });

  it("AI responses accumulate across questions", () => {
    const store = useIntakeStore.getState;
    store().setAiResponse("q1", "Answer 1");
    store().setAiResponse("q2", "Answer 2");
    store().setAiResponse("q3", "Answer 3");
    expect(Object.keys(store().aiResponses)).toHaveLength(3);
  });
});
