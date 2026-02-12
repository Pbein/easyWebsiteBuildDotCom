"use client";

import { useState, useSyncExternalStore } from "react";

/**
 * Returns true when viewport width is below the given breakpoint.
 * Uses matchMedia for efficiency — only fires at breakpoint boundaries.
 * SSR-safe: defaults to false (desktop) on the server.
 */
export function useIsMobile(breakpoint: number = 640): boolean {
  // Build the media query string once for the given breakpoint
  const [query] = useState(() => `(max-width: ${breakpoint - 1}px)`);

  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false // Server snapshot — default to desktop
  );
}
