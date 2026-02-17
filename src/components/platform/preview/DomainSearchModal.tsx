"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Globe, Check, Loader2, AlertCircle } from "lucide-react";

interface DomainResult {
  domain: string;
  available: boolean;
  price: number | null;
}

interface DomainSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDomainSelected: (domain: string) => void;
  projectId?: string;
}

export function DomainSearchModal({
  isOpen,
  onClose,
  onDomainSelected,
}: DomainSearchModalProps): React.ReactElement {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DomainResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim() || query.trim().length < 2) return;
    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch(`/api/domains?q=${encodeURIComponent(query.trim())}`);
      const data = (await res.json()) as {
        results?: DomainResult[];
        error?: string;
      };

      if (data.error) {
        setError(data.error);
      } else if (data.results) {
        setResults(data.results);
      }
    } catch {
      setError("Failed to check domain availability");
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handlePurchase = useCallback(
    async (domain: string) => {
      setIsPurchasing(domain);
      setError(null);

      try {
        const res = await fetch("/api/domains", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        });
        const data = (await res.json()) as {
          success?: boolean;
          domain?: string;
          error?: string;
        };

        if (data.success) {
          setSuccess(domain);
          onDomainSelected(domain);
        } else {
          setError(data.error ?? "Purchase failed");
        }
      } catch {
        setError("Failed to purchase domain");
      } finally {
        setIsPurchasing(null);
      }
    },
    [onDomainSelected]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3ecfb4]/10">
                <Globe className="h-6 w-6 text-[#3ecfb4]" />
              </div>
              <h2
                className="mb-1 text-xl font-bold text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Choose your domain
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Search for the perfect domain name for your site
              </p>
            </div>

            {/* Success state */}
            {success && (
              <div className="mb-6 rounded-xl border border-[#3ecfb4]/30 bg-[#3ecfb4]/10 p-4 text-center">
                <Check className="mx-auto mb-2 h-8 w-8 text-[#3ecfb4]" />
                <p className="text-sm font-semibold text-[#3ecfb4]">{success} is yours!</p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  DNS will propagate in 1-5 minutes
                </p>
              </div>
            )}

            {/* Search */}
            {!success && (
              <>
                <div className="mb-4 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void handleSearch();
                      }}
                      placeholder="e.g. highclassspa"
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-2.5 pr-3 pl-9 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[#3ecfb4]/50 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => void handleSearch()}
                    disabled={isSearching || !query.trim()}
                    className="rounded-lg bg-[#3ecfb4] px-4 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] transition-transform hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {error}
                  </div>
                )}

                {/* Results */}
                {results.length > 0 && (
                  <div className="space-y-2">
                    {results.map((result) => (
                      <div
                        key={result.domain}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          result.available
                            ? "border-[var(--color-border)] bg-[var(--color-bg-card)]"
                            : "border-[var(--color-border)] bg-[var(--color-bg-card)] opacity-50"
                        }`}
                      >
                        <div>
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">
                            {result.domain}
                          </span>
                          {result.price !== null && result.available && (
                            <span className="ml-2 text-xs text-[var(--color-text-tertiary)]">
                              ~${result.price}/yr
                            </span>
                          )}
                        </div>
                        {result.available ? (
                          <button
                            onClick={() => void handlePurchase(result.domain)}
                            disabled={isPurchasing !== null}
                            className="rounded-lg bg-[#3ecfb4] px-3 py-1.5 text-xs font-semibold text-[var(--color-bg-primary)] transition-transform hover:scale-[1.02] disabled:opacity-50"
                          >
                            {isPurchasing === result.domain ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Get it"
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-[var(--color-text-tertiary)]">Taken</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Bring your own domain */}
                <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                  <p className="mb-2 text-xs font-semibold tracking-wider text-[var(--color-text-tertiary)] uppercase">
                    Already own a domain?
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Point your domain&apos;s CNAME record to{" "}
                    <code className="rounded bg-[var(--color-bg-card)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-text-primary)]">
                      cname.vercel-dns.com
                    </code>{" "}
                    and we&apos;ll verify it automatically.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
