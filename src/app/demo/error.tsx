"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function DemoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  useEffect(() => {
    posthog.capture("demo_error", {
      error_message: error.message,
      error_digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0b0f]">
      <div className="max-w-md text-center">
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #e8a849, #3ecfb4)",
            fontWeight: 800,
            fontSize: "28px",
            color: "#0a0b0f",
            marginBottom: "24px",
          }}
        >
          E
        </div>
        <h2
          className="mb-2 text-lg font-semibold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Something went wrong
        </h2>
        <p className="mb-6 text-sm text-[rgba(255,255,255,0.5)]">
          We hit a snag while building your preview. Let&apos;s try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-[#0a0b0f] transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #e8a849, #3ecfb4)" }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
