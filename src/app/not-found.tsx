import Link from "next/link";

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="max-w-md text-center">
        <p
          className="mb-1 text-6xl font-bold text-[var(--color-accent)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          404
        </p>
        <h2
          className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Page Not Found
        </h2>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] focus-visible:outline-none"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
