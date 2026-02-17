import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ────────────────────────────────────────────────────────────
 * Customization Store
 *
 * Manages post-generation customization state, separate from
 * the intake store (different lifecycle: intake = pre-gen,
 * customization = post-gen).
 *
 * Persisted to localStorage so customizations survive refresh.
 * ──────────────────────────────────────────────────────────── */

export interface CustomizationState {
  /** Session being customized */
  sessionId: string | null;
  /** Active preset ID — null = AI-generated original theme */
  activePresetId: string | null;
  /** User-chosen primary color hex — null = use preset/original */
  primaryColorOverride: string | null;
  /** Font pairing ID override — null = use preset/original */
  fontPairingId: string | null;
  /** Content overrides: componentIndex → { field: value } */
  contentOverrides: Record<number, Record<string, string>>;
  /** Emotional goals — null = use spec values, [] = user cleared */
  emotionalGoals: string[] | null;
  /** Voice profile — null = use spec value */
  voiceProfile: string | null;
  /** Brand archetype — null = use spec value */
  brandArchetype: string | null;
  /** Anti-references — null = use spec values, [] = user cleared */
  antiReferences: string[] | null;
}

export interface CustomizationActions {
  /** Initialize for a session (resets if different session) */
  initSession: (sessionId: string) => void;
  /** Set active preset (resets color override per design decision) */
  setPreset: (presetId: string | null) => void;
  /** Set primary color override */
  setPrimaryColor: (hex: string | null) => void;
  /** Set font pairing override */
  setFontPairing: (fontPairingId: string | null) => void;
  /** Set a content field override for a component */
  setContentOverride: (componentIndex: number, field: string, value: string) => void;
  /** Set emotional goals override */
  setEmotionalGoals: (goals: string[] | null) => void;
  /** Set voice profile override */
  setVoiceProfile: (voice: string | null) => void;
  /** Set brand archetype override */
  setBrandArchetype: (archetype: string | null) => void;
  /** Set anti-references override */
  setAntiReferences: (refs: string[] | null) => void;
  /** Clear all customizations back to AI original */
  resetAll: () => void;
}

function hasChanges(state: CustomizationState): boolean {
  return (
    state.activePresetId !== null ||
    state.primaryColorOverride !== null ||
    state.fontPairingId !== null ||
    Object.keys(state.contentOverrides).length > 0 ||
    state.emotionalGoals !== null ||
    state.voiceProfile !== null ||
    state.brandArchetype !== null ||
    state.antiReferences !== null
  );
}

const initialState: CustomizationState = {
  sessionId: null,
  activePresetId: null,
  primaryColorOverride: null,
  fontPairingId: null,
  contentOverrides: {},
  emotionalGoals: null,
  voiceProfile: null,
  brandArchetype: null,
  antiReferences: null,
};

export const useCustomizationStore = create<
  CustomizationState & CustomizationActions & { hasChanges: boolean }
>()(
  persist(
    (set, get) => ({
      ...initialState,
      hasChanges: false,

      initSession: (sessionId: string) => {
        const current = get();
        if (current.sessionId !== sessionId) {
          set({ ...initialState, sessionId, hasChanges: false });
        }
      },

      setPreset: (presetId: string | null) =>
        set((state) => {
          const next = {
            activePresetId: presetId,
            // Preset switch resets color override (preset = new starting point)
            primaryColorOverride: null,
          };
          return { ...next, hasChanges: hasChanges({ ...state, ...next }) };
        }),

      setPrimaryColor: (hex: string | null) =>
        set((state) => {
          const next = { primaryColorOverride: hex };
          return { ...next, hasChanges: hasChanges({ ...state, ...next }) };
        }),

      setFontPairing: (fontPairingId: string | null) =>
        set((state) => {
          const next = { fontPairingId };
          return { ...next, hasChanges: hasChanges({ ...state, ...next }) };
        }),

      setContentOverride: (componentIndex: number, field: string, value: string) =>
        set((state) => {
          const existing = state.contentOverrides[componentIndex] ?? {};
          const next = {
            contentOverrides: {
              ...state.contentOverrides,
              [componentIndex]: { ...existing, [field]: value },
            },
          };
          return { ...next, hasChanges: hasChanges({ ...state, ...next }) };
        }),

      setEmotionalGoals: (goals: string[] | null) =>
        set((state) => {
          const next = { emotionalGoals: goals };
          return { ...next, hasChanges: hasChanges({ ...state, ...next }) };
        }),

      setVoiceProfile: (voice: string | null) =>
        set((state) => {
          const next = { voiceProfile: voice };
          return { ...next, hasChanges: hasChanges({ ...state, ...next }) };
        }),

      setBrandArchetype: (archetype: string | null) =>
        set((state) => {
          const next = { brandArchetype: archetype };
          return { ...next, hasChanges: hasChanges({ ...state, ...next }) };
        }),

      setAntiReferences: (refs: string[] | null) =>
        set((state) => {
          const next = { antiReferences: refs };
          return { ...next, hasChanges: hasChanges({ ...state, ...next }) };
        }),

      resetAll: () =>
        set((state) => ({
          ...initialState,
          sessionId: state.sessionId,
          hasChanges: false,
        })),
    }),
    {
      name: "ewb-customization",
      partialize: (state) => ({
        sessionId: state.sessionId,
        activePresetId: state.activePresetId,
        primaryColorOverride: state.primaryColorOverride,
        fontPairingId: state.fontPairingId,
        contentOverrides: state.contentOverrides,
        emotionalGoals: state.emotionalGoals,
        voiceProfile: state.voiceProfile,
        brandArchetype: state.brandArchetype,
        antiReferences: state.antiReferences,
        hasChanges: state.hasChanges,
      }),
    }
  )
);
