import { describe, it, expect, beforeEach } from "vitest";
import { useCustomizationStore } from "@/lib/stores/customization-store";

describe("Customization Store", () => {
  beforeEach(() => {
    const { resetAll } = useCustomizationStore.getState();
    resetAll();
    // Also clear sessionId since resetAll preserves it
    useCustomizationStore.setState({ sessionId: null, hasChanges: false });
  });

  // ── Initial State ──────────────────────────────────────────

  it("has all nulls and hasChanges is false in initial state", () => {
    const state = useCustomizationStore.getState();
    expect(state.sessionId).toBeNull();
    expect(state.activePresetId).toBeNull();
    expect(state.primaryColorOverride).toBeNull();
    expect(state.fontPairingId).toBeNull();
    expect(state.contentOverrides).toEqual({});
    expect(state.emotionalGoals).toBeNull();
    expect(state.voiceProfile).toBeNull();
    expect(state.brandArchetype).toBeNull();
    expect(state.antiReferences).toBeNull();
    expect(state.hasChanges).toBe(false);
  });

  // ── initSession ────────────────────────────────────────────

  it("initSession sets sessionId", () => {
    useCustomizationStore.getState().initSession("sess1");
    expect(useCustomizationStore.getState().sessionId).toBe("sess1");
  });

  it("initSession with different session resets all state to initial plus new sessionId", () => {
    const store = useCustomizationStore.getState;
    store().initSession("sess1");
    store().setPreset("luxury-dark");
    store().setPrimaryColor("#ff0000");
    store().setFontPairing("sora-dm-sans");
    store().setEmotionalGoals(["luxury"]);
    store().setVoiceProfile("warm");
    store().setBrandArchetype("magician");
    store().setAntiReferences(["corporate"]);
    store().setContentOverride(0, "headline", "Test");

    // Switch to a different session
    store().initSession("sess2");

    const state = store();
    expect(state.sessionId).toBe("sess2");
    expect(state.activePresetId).toBeNull();
    expect(state.primaryColorOverride).toBeNull();
    expect(state.fontPairingId).toBeNull();
    expect(state.contentOverrides).toEqual({});
    expect(state.emotionalGoals).toBeNull();
    expect(state.voiceProfile).toBeNull();
    expect(state.brandArchetype).toBeNull();
    expect(state.antiReferences).toBeNull();
    expect(state.hasChanges).toBe(false);
  });

  it("initSession with same session does NOT reset state", () => {
    const store = useCustomizationStore.getState;
    store().initSession("sess1");
    store().setPreset("luxury-dark");
    store().setPrimaryColor("#ff0000");

    // Re-init same session
    store().initSession("sess1");

    const state = store();
    expect(state.sessionId).toBe("sess1");
    expect(state.activePresetId).toBe("luxury-dark");
    // primaryColorOverride was cleared by setPreset, that's fine — but the preset persists
  });

  // ── setPreset ──────────────────────────────────────────────

  it("setPreset sets activePresetId, clears primaryColorOverride, hasChanges is true", () => {
    const store = useCustomizationStore.getState;
    store().setPrimaryColor("#00ff00"); // Set a color first
    store().setPreset("luxury-dark");

    const state = store();
    expect(state.activePresetId).toBe("luxury-dark");
    expect(state.primaryColorOverride).toBeNull();
    expect(state.hasChanges).toBe(true);
  });

  it("setPreset(null) clears preset, hasChanges is false when nothing else set", () => {
    const store = useCustomizationStore.getState;
    store().setPreset("luxury-dark");
    expect(store().hasChanges).toBe(true);

    store().setPreset(null);
    expect(store().activePresetId).toBeNull();
    expect(store().hasChanges).toBe(false);
  });

  // ── setPrimaryColor ────────────────────────────────────────

  it("setPrimaryColor sets hex override and hasChanges is true", () => {
    const store = useCustomizationStore.getState;
    store().setPrimaryColor("#ff0000");

    const state = store();
    expect(state.primaryColorOverride).toBe("#ff0000");
    expect(state.hasChanges).toBe(true);
  });

  // ── setFontPairing ────────────────────────────────────────

  it("setFontPairing sets pairing and hasChanges is true", () => {
    const store = useCustomizationStore.getState;
    store().setFontPairing("sora-dm-sans");

    const state = store();
    expect(state.fontPairingId).toBe("sora-dm-sans");
    expect(state.hasChanges).toBe(true);
  });

  // ── setContentOverride ─────────────────────────────────────

  it("setContentOverride creates nested record for new component index", () => {
    const store = useCustomizationStore.getState;
    store().setContentOverride(0, "headline", "New!");

    const state = store();
    expect(state.contentOverrides[0]).toEqual({ headline: "New!" });
    expect(state.hasChanges).toBe(true);
  });

  it("setContentOverride merges into existing component record", () => {
    const store = useCustomizationStore.getState;
    store().setContentOverride(0, "headline", "New!");
    store().setContentOverride(0, "subheadline", "Sub");

    const state = store();
    expect(state.contentOverrides[0]).toEqual({
      headline: "New!",
      subheadline: "Sub",
    });
  });

  // ── setEmotionalGoals ──────────────────────────────────────

  it("setEmotionalGoals sets goals and hasChanges is true", () => {
    const store = useCustomizationStore.getState;
    store().setEmotionalGoals(["luxury", "calm"]);

    const state = store();
    expect(state.emotionalGoals).toEqual(["luxury", "calm"]);
    expect(state.hasChanges).toBe(true);
  });

  it("setEmotionalGoals with empty array still counts as a change", () => {
    const store = useCustomizationStore.getState;
    store().setEmotionalGoals([]);

    const state = store();
    // Empty array is not null, so the store treats it as "user explicitly cleared"
    expect(state.emotionalGoals).toEqual([]);
    expect(state.hasChanges).toBe(true);
  });

  // ── setVoiceProfile ────────────────────────────────────────

  it("setVoiceProfile sets voice and hasChanges is true", () => {
    const store = useCustomizationStore.getState;
    store().setVoiceProfile("warm");

    expect(store().voiceProfile).toBe("warm");
    expect(store().hasChanges).toBe(true);
  });

  // ── setBrandArchetype ──────────────────────────────────────

  it("setBrandArchetype sets archetype and hasChanges is true", () => {
    const store = useCustomizationStore.getState;
    store().setBrandArchetype("magician");

    expect(store().brandArchetype).toBe("magician");
    expect(store().hasChanges).toBe(true);
  });

  // ── setAntiReferences ──────────────────────────────────────

  it("setAntiReferences sets refs and hasChanges is true", () => {
    const store = useCustomizationStore.getState;
    store().setAntiReferences(["corporate", "cheap"]);

    expect(store().antiReferences).toEqual(["corporate", "cheap"]);
    expect(store().hasChanges).toBe(true);
  });

  // ── resetAll ───────────────────────────────────────────────

  it("resetAll clears everything but preserves sessionId", () => {
    const store = useCustomizationStore.getState;
    store().initSession("sess1");
    store().setPreset("luxury-dark");
    store().setFontPairing("sora-dm-sans");
    store().setEmotionalGoals(["luxury"]);
    store().setVoiceProfile("warm");
    store().setBrandArchetype("magician");
    store().setAntiReferences(["corporate"]);
    store().setContentOverride(0, "headline", "Test");

    store().resetAll();

    const state = store();
    expect(state.sessionId).toBe("sess1");
    expect(state.activePresetId).toBeNull();
    expect(state.primaryColorOverride).toBeNull();
    expect(state.fontPairingId).toBeNull();
    expect(state.contentOverrides).toEqual({});
    expect(state.emotionalGoals).toBeNull();
    expect(state.voiceProfile).toBeNull();
    expect(state.brandArchetype).toBeNull();
    expect(state.antiReferences).toBeNull();
  });

  it("resetAll sets hasChanges to false", () => {
    const store = useCustomizationStore.getState;
    store().setPreset("luxury-dark");
    store().setVoiceProfile("warm");
    expect(store().hasChanges).toBe(true);

    store().resetAll();
    expect(store().hasChanges).toBe(false);
  });

  // ── hasChanges computed behavior ───────────────────────────

  it("hasChanges is false when all fields are null/empty after setting and clearing", () => {
    const store = useCustomizationStore.getState;

    // Set various fields
    store().setPrimaryColor("#ff0000");
    store().setFontPairing("sora-dm-sans");
    store().setVoiceProfile("warm");
    expect(store().hasChanges).toBe(true);

    // Clear them all individually
    store().setPrimaryColor(null);
    store().setFontPairing(null);
    store().setVoiceProfile(null);
    expect(store().hasChanges).toBe(false);
  });

  it("setPreset clears primaryColorOverride (preset is a new starting point)", () => {
    const store = useCustomizationStore.getState;
    store().setPrimaryColor("#ff0000");
    expect(store().primaryColorOverride).toBe("#ff0000");

    store().setPreset("modern-clean");
    expect(store().primaryColorOverride).toBeNull();
    expect(store().activePresetId).toBe("modern-clean");
  });

  it("multiple fields set gives hasChanges true; resetAll gives hasChanges false", () => {
    const store = useCustomizationStore.getState;

    store().initSession("sess1");
    store().setPreset("luxury-dark");
    store().setFontPairing("sora-dm-sans");
    store().setEmotionalGoals(["luxury", "calm"]);
    store().setVoiceProfile("warm");
    store().setBrandArchetype("magician");
    store().setAntiReferences(["corporate"]);
    store().setContentOverride(2, "headline", "Hello");

    expect(store().hasChanges).toBe(true);

    store().resetAll();
    expect(store().hasChanges).toBe(false);
    // Session should be preserved
    expect(store().sessionId).toBe("sess1");
  });
});
