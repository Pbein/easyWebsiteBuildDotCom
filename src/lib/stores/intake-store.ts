import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IntakeState {
  /** Current step (1-9) */
  currentStep: number;
  /** Direction of navigation for animations: 1 = forward, -1 = back */
  direction: number;

  /** Step 1 */
  siteType: string | null;
  /** Step 2 */
  goal: string | null;
  /** Step 3 */
  businessName: string;
  description: string;
  /** Step 4 — 6-axis personality vector [density, tone, temp, weight, era, energy] */
  personality: number[];
  /** Which personality axis the user is currently choosing */
  personalityStep: number;

  /** Step 5 — Emotional goals (1-2 primary emotions) */
  emotionalGoals: string[];
  /** Step 6 — Voice tone ("warm" | "polished" | "direct") */
  voiceProfile: string | null;
  /** Step 6 — Fill-in-the-blank narrative prompts */
  narrativePrompts: Record<string, string>;
  /** Step 7 — Brand archetype ID */
  brandArchetype: string | null;
  /** Step 7 — Anti-reference IDs */
  antiReferences: string[];

  /** Step 8 — AI-generated follow-up questions */
  aiQuestions: { id: string; question: string; type: "text" | "select"; options?: string[] }[];
  aiResponses: Record<string, string>;
  /** Timestamp when AI questions were generated (for staleness check) */
  questionsGeneratedAt: number | null;
  /** Fingerprint of intake inputs when questions were generated (for staleness check) */
  questionsInputKey: string | null;

  /** Anonymous session ID for Convex storage */
  sessionId: string;

  /** Convex ID of the generated site spec */
  specId: string | null;

  /** Whether the summary/results view is shown */
  showSummary: boolean;
}

export interface IntakeActions {
  setSiteType: (siteType: string) => void;
  setGoal: (goal: string) => void;
  setBusinessName: (name: string) => void;
  setDescription: (description: string) => void;
  setPersonalityAxis: (axis: number, value: number) => void;
  setEmotionalGoals: (goals: string[]) => void;
  setVoiceProfile: (voice: string) => void;
  setNarrativePrompt: (key: string, value: string) => void;
  setBrandArchetype: (archetype: string) => void;
  setAntiReferences: (refs: string[]) => void;
  setAiQuestions: (questions: IntakeState["aiQuestions"]) => void;
  setAiResponse: (questionId: string, response: string) => void;
  setSpecId: (id: string) => void;

  goToStep: (step: number) => void;
  goNext: () => void;
  goBack: () => void;
  setShowSummary: (show: boolean) => void;

  reset: () => void;
}

const generateSessionId = (): string =>
  `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const initialState: IntakeState = {
  currentStep: 1,
  direction: 1,
  siteType: null,
  goal: null,
  businessName: "",
  description: "",
  personality: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  personalityStep: 0,
  emotionalGoals: [],
  voiceProfile: null,
  narrativePrompts: {},
  brandArchetype: null,
  antiReferences: [],
  aiQuestions: [],
  aiResponses: {},
  questionsGeneratedAt: null,
  questionsInputKey: null,
  sessionId: generateSessionId(),
  specId: null,
  showSummary: false,
};

export const useIntakeStore = create<IntakeState & IntakeActions>()(
  persist(
    (set) => ({
      ...initialState,

      setSiteType: (siteType) => set({ siteType, goal: null }),
      setGoal: (goal) => set({ goal }),
      setBusinessName: (name) => set({ businessName: name }),
      setDescription: (description) => set({ description }),
      setPersonalityAxis: (axis, value) =>
        set((state) => {
          const personality = [...state.personality];
          personality[axis] = value;
          return { personality, personalityStep: state.personalityStep + 1 };
        }),
      setEmotionalGoals: (goals) => set({ emotionalGoals: goals }),
      setVoiceProfile: (voice) => set({ voiceProfile: voice }),
      setNarrativePrompt: (key, value) =>
        set((state) => ({
          narrativePrompts: { ...state.narrativePrompts, [key]: value },
        })),
      setBrandArchetype: (archetype) => set({ brandArchetype: archetype }),
      setAntiReferences: (refs) => set({ antiReferences: refs }),
      setAiQuestions: (questions) =>
        set({ aiQuestions: questions, questionsGeneratedAt: Date.now() }),
      setAiResponse: (questionId, response) =>
        set((state) => ({
          aiResponses: { ...state.aiResponses, [questionId]: response },
        })),
      setSpecId: (id) => set({ specId: id }),

      goToStep: (step) =>
        set((state) => ({
          currentStep: step,
          direction: step > state.currentStep ? 1 : -1,
        })),
      goNext: () =>
        set((state) => {
          if (state.currentStep >= 9) return { showSummary: true };
          return { currentStep: state.currentStep + 1, direction: 1 };
        }),
      goBack: () =>
        set((state) => {
          if (state.showSummary) return { showSummary: false };
          if (state.currentStep <= 1) return {};
          return { currentStep: state.currentStep - 1, direction: -1 };
        }),
      setShowSummary: (show) => set({ showSummary: show }),

      reset: () => set({ ...initialState, sessionId: generateSessionId() }),
    }),
    {
      name: "ewb-intake",
      partialize: (state) => ({
        siteType: state.siteType,
        goal: state.goal,
        businessName: state.businessName,
        description: state.description,
        personality: state.personality,
        personalityStep: state.personalityStep,
        emotionalGoals: state.emotionalGoals,
        voiceProfile: state.voiceProfile,
        narrativePrompts: state.narrativePrompts,
        brandArchetype: state.brandArchetype,
        antiReferences: state.antiReferences,
        currentStep: state.currentStep,
        sessionId: state.sessionId,
        aiQuestions: state.aiQuestions,
        aiResponses: state.aiResponses,
        questionsGeneratedAt: state.questionsGeneratedAt,
        questionsInputKey: state.questionsInputKey,
      }),
    }
  )
);
