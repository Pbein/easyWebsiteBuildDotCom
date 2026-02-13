"use client";

/**
 * Hook for detecting prefers-reduced-motion.
 *
 * Uses useSyncExternalStore (same pattern as use-parallax.ts)
 * to avoid setState-in-effect React warnings.
 */

import { useSyncExternalStore } from "react";

/** Subscribe to changes in the reduced-motion media query. */
function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/** Get current reduced-motion preference. */
function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Server-side snapshot — assume motion is okay. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Returns true if the user prefers reduced motion.
 *
 * Usage:
 * ```tsx
 * const reducedMotion = useReducedMotion();
 * const effect = gradientText({ reducedMotion });
 * ```
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
