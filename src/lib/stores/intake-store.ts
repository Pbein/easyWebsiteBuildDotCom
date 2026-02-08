import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IntakeState {
  /** Current step (1-6) */
  currentStep: number;
  /** Direction of navigation for animations: 1 = forward, -1 = back */
  direction: number;

  /** Step 1 */
  siteType: string | null;
  /** Step 2 */
  goal: string | null;
  /** Step 3 */
  description: string;
  /** Step 4 — 6-axis personality vector [density, tone, temp, weight, era, energy] */
  personality: number[];
  /** Which personality axis the user is currently choosing */
  personalityStep: number;

  /** Step 5 — AI-generated follow-up questions */
  aiQuestions: { id: string; question: string; type: "text" | "select"; options?: string[] }[];
  aiResponses: Record<string, string>;

  /** Anonymous session ID for Convex storage */
  sessionId: string;

  /** Whether the summary/results view is shown */
  showSummary: boolean;
}

export interface IntakeActions {
  setSiteType: (siteType: string) => void;
  setGoal: (goal: string) => void;
  setDescription: (description: string) => void;
  setPersonalityAxis: (axis: number, value: number) => void;
  setAiResponse: (questionId: string, response: string) => void;

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
  description: "",
  personality: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  personalityStep: 0,
  aiQuestions: [],
  aiResponses: {},
  sessionId: generateSessionId(),
  showSummary: false,
};

export const useIntakeStore = create<IntakeState & IntakeActions>()(
  persist(
    (set) => ({
      ...initialState,

      setSiteType: (siteType) => set({ siteType, goal: null }),
      setGoal: (goal) => set({ goal }),
      setDescription: (description) => set({ description }),
      setPersonalityAxis: (axis, value) =>
        set((state) => {
          const personality = [...state.personality];
          personality[axis] = value;
          return { personality, personalityStep: state.personalityStep + 1 };
        }),
      setAiResponse: (questionId, response) =>
        set((state) => ({
          aiResponses: { ...state.aiResponses, [questionId]: response },
        })),

      goToStep: (step) =>
        set((state) => ({
          currentStep: step,
          direction: step > state.currentStep ? 1 : -1,
        })),
      goNext: () =>
        set((state) => {
          if (state.currentStep >= 6) return { showSummary: true };
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
        description: state.description,
        personality: state.personality,
        personalityStep: state.personalityStep,
        currentStep: state.currentStep,
        sessionId: state.sessionId,
        aiResponses: state.aiResponses,
      }),
    }
  )
);
