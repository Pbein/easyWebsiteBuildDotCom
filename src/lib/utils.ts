import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with intelligent conflict resolution.
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 *
 * Usage:
 *   cn("px-4 py-2", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generate a stable session ID for anonymous intake tracking.
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Clamp a number between a min and max value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}
