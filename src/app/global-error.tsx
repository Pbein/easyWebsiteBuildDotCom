"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        style={{
          background: "#0a0b0f",
          color: "#f0f0f4",
          fontFamily: "'Outfit', sans-serif",
          margin: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#9496a8",
                marginBottom: "1.5rem",
              }}
            >
              A critical error occurred. Please try again.
            </p>
            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "0.5rem",
                backgroundColor: "#e8a849",
                padding: "0.625rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#0a0b0f",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
