"use client";

/**
 * Parallax scroll hook using framer-motion.
 *
 * - Applies subtle y-offset to an element based on scroll position.
 * - Disables on mobile (< 768px) for performance.
 * - Respects `prefers-reduced-motion` media query.
 * - Uses passive event listeners via framer-motion internals.
 * - Uses useSyncExternalStore for viewport detection (no setState in effect).
 */

import { useRef, useSyncExternalStore, useCallback } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

interface UseParallaxOptions {
  /** Parallax distance in pixels (default: 40). */
  distance?: number;
  /** Disable parallax entirely (e.g., from personality override). */
  disabled?: boolean;
}

interface UseParallaxReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
}

/** Subscribe to resize events. */
function subscribeToResize(callback: () => void): () => void {
  window.addEventListener("resize", callback, { passive: true });
  return () => window.removeEventListener("resize", callback);
}

/** Check if parallax should be enabled based on viewport and motion preferences. */
function getIsParallaxEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;
  return !prefersReducedMotion && !isMobile;
}

/** Server-side snapshot — always false. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Hook that provides a parallax y-offset MotionValue.
 *
 * Usage:
 * ```tsx
 * const { ref, y } = useParallax({ distance: 40 });
 * return <motion.div ref={ref} style={{ y }}>...</motion.div>
 * ```
 */
export function useParallax({
  distance = 40,
  disabled = false,
}: UseParallaxOptions = {}): UseParallaxReturn {
  const ref = useRef<HTMLDivElement>(null);

  // Derive parallax-enabled state from external source (viewport + motion preference)
  const getSnapshot = useCallback(() => {
    if (disabled) return false;
    return getIsParallaxEnabled();
  }, [disabled]);

  const isEnabled = useSyncExternalStore(subscribeToResize, getSnapshot, getServerSnapshot);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const effectiveDistance = isEnabled ? distance : 0;
  const y = useTransform(scrollYProgress, [0, 1], [effectiveDistance, -effectiveDistance]);

  return { ref, y };
}
