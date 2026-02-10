import { describe, it, expect, beforeEach } from "vitest";
import { useIntakeStore } from "@/lib/stores/intake-store";

describe("useIntakeStore", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useIntakeStore.getState().reset();
  });

  describe("initial state", () => {
    it("starts at step 1", () => {
      expect(useIntakeStore.getState().currentStep).toBe(1);
    });

    it("has null siteType and goal", () => {
      expect(useIntakeStore.getState().siteType).toBeNull();
      expect(useIntakeStore.getState().goal).toBeNull();
    });

    it("has empty business name and description", () => {
      expect(useIntakeStore.getState().businessName).toBe("");
      expect(useIntakeStore.getState().description).toBe("");
    });

    it("has balanced personality vector [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]", () => {
      expect(useIntakeStore.getState().personality).toEqual([0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    });

    it("has a session ID", () => {
      const { sessionId } = useIntakeStore.getState();
      expect(sessionId).toBeTruthy();
      expect(sessionId).toMatch(/^session_/);
    });

    it("has empty brand character fields", () => {
      const state = useIntakeStore.getState();
      expect(state.emotionalGoals).toEqual([]);
      expect(state.voiceProfile).toBeNull();
      expect(state.brandArchetype).toBeNull();
      expect(state.antiReferences).toEqual([]);
      expect(state.narrativePrompts).toEqual({});
    });
  });

  describe("actions", () => {
    it("setSiteType updates siteType and resets goal", () => {
      useIntakeStore.getState().setGoal("contact");
      useIntakeStore.getState().setSiteType("portfolio");
      expect(useIntakeStore.getState().siteType).toBe("portfolio");
      expect(useIntakeStore.getState().goal).toBeNull();
    });

    it("setGoal updates goal", () => {
      useIntakeStore.getState().setGoal("sell");
      expect(useIntakeStore.getState().goal).toBe("sell");
    });

    it("setBusinessName updates businessName", () => {
      useIntakeStore.getState().setBusinessName("My Corp");
      expect(useIntakeStore.getState().businessName).toBe("My Corp");
    });

    it("setDescription updates description", () => {
      useIntakeStore.getState().setDescription("A great business");
      expect(useIntakeStore.getState().description).toBe("A great business");
    });

    it("setPersonalityAxis updates a single axis and increments personalityStep", () => {
      useIntakeStore.getState().setPersonalityAxis(0, 0.8);
      const state = useIntakeStore.getState();
      expect(state.personality[0]).toBe(0.8);
      expect(state.personalityStep).toBe(1);
    });

    it("setEmotionalGoals updates emotionalGoals", () => {
      useIntakeStore.getState().setEmotionalGoals(["trust", "excitement"]);
      expect(useIntakeStore.getState().emotionalGoals).toEqual(["trust", "excitement"]);
    });

    it("setVoiceProfile updates voiceProfile", () => {
      useIntakeStore.getState().setVoiceProfile("warm");
      expect(useIntakeStore.getState().voiceProfile).toBe("warm");
    });

    it("setNarrativePrompt adds a narrative prompt", () => {
      useIntakeStore.getState().setNarrativePrompt("mission", "We help people");
      expect(useIntakeStore.getState().narrativePrompts.mission).toBe("We help people");
    });

    it("setBrandArchetype updates brandArchetype", () => {
      useIntakeStore.getState().setBrandArchetype("innovator");
      expect(useIntakeStore.getState().brandArchetype).toBe("innovator");
    });

    it("setAntiReferences updates antiReferences", () => {
      useIntakeStore.getState().setAntiReferences(["salesy", "corporate"]);
      expect(useIntakeStore.getState().antiReferences).toEqual(["salesy", "corporate"]);
    });

    it("setAiQuestions updates aiQuestions and sets questionsGeneratedAt", () => {
      const questions = [{ id: "q1", question: "What?", type: "text" as const }];
      useIntakeStore.getState().setAiQuestions(questions);
      expect(useIntakeStore.getState().aiQuestions).toEqual(questions);
      expect(useIntakeStore.getState().questionsGeneratedAt).toBeGreaterThan(0);
    });

    it("setAiResponse adds a response for a question", () => {
      useIntakeStore.getState().setAiResponse("q1", "My answer");
      expect(useIntakeStore.getState().aiResponses.q1).toBe("My answer");
    });

    it("setSpecId updates specId", () => {
      useIntakeStore.getState().setSpecId("spec_abc");
      expect(useIntakeStore.getState().specId).toBe("spec_abc");
    });
  });

  describe("navigation", () => {
    it("goNext increments currentStep and sets direction to 1", () => {
      useIntakeStore.getState().goNext();
      expect(useIntakeStore.getState().currentStep).toBe(2);
      expect(useIntakeStore.getState().direction).toBe(1);
    });

    it("goBack decrements currentStep and sets direction to -1", () => {
      useIntakeStore.getState().goNext();
      useIntakeStore.getState().goNext();
      useIntakeStore.getState().goBack();
      expect(useIntakeStore.getState().currentStep).toBe(2);
      expect(useIntakeStore.getState().direction).toBe(-1);
    });

    it("goBack does nothing at step 1", () => {
      useIntakeStore.getState().goBack();
      expect(useIntakeStore.getState().currentStep).toBe(1);
    });

    it("goNext at step 9 sets showSummary to true", () => {
      useIntakeStore.getState().goToStep(9);
      useIntakeStore.getState().goNext();
      expect(useIntakeStore.getState().showSummary).toBe(true);
      expect(useIntakeStore.getState().currentStep).toBe(9);
    });

    it("goBack when showSummary is true hides summary", () => {
      useIntakeStore.getState().goToStep(9);
      useIntakeStore.getState().goNext();
      expect(useIntakeStore.getState().showSummary).toBe(true);
      useIntakeStore.getState().goBack();
      expect(useIntakeStore.getState().showSummary).toBe(false);
    });

    it("goToStep sets step and direction correctly", () => {
      useIntakeStore.getState().goToStep(5);
      expect(useIntakeStore.getState().currentStep).toBe(5);
      expect(useIntakeStore.getState().direction).toBe(1);
      useIntakeStore.getState().goToStep(3);
      expect(useIntakeStore.getState().currentStep).toBe(3);
      expect(useIntakeStore.getState().direction).toBe(-1);
    });
  });

  describe("reset", () => {
    it("resets all state to initial values", () => {
      useIntakeStore.getState().setSiteType("portfolio");
      useIntakeStore.getState().setGoal("sell");
      useIntakeStore.getState().setBusinessName("Test Corp");
      useIntakeStore.getState().goToStep(5);
      useIntakeStore.getState().reset();
      const state = useIntakeStore.getState();
      expect(state.siteType).toBeNull();
      expect(state.goal).toBeNull();
      expect(state.businessName).toBe("");
      expect(state.currentStep).toBe(1);
    });

    it("generates a new session ID on reset", () => {
      const oldSessionId = useIntakeStore.getState().sessionId;
      useIntakeStore.getState().reset();
      expect(useIntakeStore.getState().sessionId).not.toBe(oldSessionId);
    });
  });
});
