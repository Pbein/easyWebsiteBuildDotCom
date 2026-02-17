"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  useEffect(() => {
    posthog.capture("route_error", {
      error_message: error.message,
      error_digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="max-w-md text-center">
        <h2
          className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Something went wrong
        </h2>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] focus-visible:outline-none"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
