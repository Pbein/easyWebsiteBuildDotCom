/**
 * Keyframe injection utility.
 *
 * Injects @keyframes CSS into a shared <style> tag with deduplication.
 * Multiple calls with the same keyframeName are no-ops.
 */

const STYLE_ID = "ewb-css-effects-keyframes";
const injectedKeyframes = new Set<string>();

/**
 * Inject @keyframes CSS into the document <head>.
 * Deduplicates by keyframeName — safe to call repeatedly.
 */
export function injectKeyframes(keyframeName: string, keyframesCSS: string): void {
  if (typeof document === "undefined") return;
  if (injectedKeyframes.has(keyframeName)) return;

  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    styleEl.setAttribute("data-ewb", "css-effects");
    document.head.appendChild(styleEl);
  }

  styleEl.textContent += `\n${keyframesCSS}`;
  injectedKeyframes.add(keyframeName);
}

/**
 * Check if a keyframe has already been injected.
 * Useful for testing.
 */
export function isKeyframeInjected(keyframeName: string): boolean {
  return injectedKeyframes.has(keyframeName);
}

/**
 * Clear all injected keyframes (for testing).
 */
export function clearInjectedKeyframes(): void {
  injectedKeyframes.clear();
  if (typeof document === "undefined") return;
  const styleEl = document.getElementById(STYLE_ID);
  if (styleEl) styleEl.textContent = "";
}
