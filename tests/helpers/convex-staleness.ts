/**
 * Staleness guard utility for Convex handler replica tests.
 *
 * Since Convex handlers run in a special runtime and cannot be imported
 * into Vitest, test files replicate the handler logic with a mock ctx.db.
 * This creates a drift risk: if the source handler changes, the test
 * replica becomes outdated and may pass even when the real handler is broken.
 *
 * This utility computes a SHA-256 hash of the source file and compares it
 * to a known expected hash. When the source changes, the staleness guard
 * test fails with a clear message telling the developer to update the
 * replicated logic in the test file.
 */

import { readFileSync } from "fs";
import { createHash } from "crypto";
import { resolve } from "path";

/**
 * Computes a truncated SHA-256 hash of a file's contents.
 *
 * @param relativePath - Path relative to the project root (e.g., "convex/siteSpecs.ts")
 * @returns First 16 hex characters of the SHA-256 hash
 */
export function getSourceHash(relativePath: string): string {
  const fullPath = resolve(__dirname, "../../", relativePath);
  const content = readFileSync(fullPath, "utf-8");
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}
