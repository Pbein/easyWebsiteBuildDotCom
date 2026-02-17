"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Sparkles, Download, Check, Loader2, Crown } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";

interface MakeItYoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

interface PlanOption {
  id: "starter" | "pro" | "own_it";
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
  icon: typeof Globe;
  accentColor: string;
}

const PLANS: PlanOption[] = [
  {
    id: "starter",
    name: "Go Live",
    price: "$12",
    period: "/mo",
    description: "Custom domain hosting with a clean, professional site",
    features: [
      "Custom domain hosting",
      "Clean export (no badge)",
      "Working contact form",
      "Email support",
    ],
    icon: Globe,
    accentColor: "#3ecfb4",
  },
  {
    id: "pro",
    name: "Go Pro",
    price: "$29",
    period: "/mo",
    description: "Everything in Starter plus AI chat and full customization",
    features: [
      "Everything in Go Live",
      "AI Design Chat (unlimited)",
      "All 14 font pairings",
      "Full color palette control",
      "CSS effects library",
      "Priority support",
    ],
    recommended: true,
    icon: Crown,
    accentColor: "#e8a849",
  },
  {
    id: "own_it",
    name: "Own It",
    price: "$99",
    period: "once",
    description: "Full source code — deploy anywhere, no monthly fees",
    features: [
      "Full source code export",
      "Deploy guide included",
      "All Pro features included",
      "No monthly fees ever",
      "Self-host anywhere",
    ],
    icon: Download,
    accentColor: "#c084fc",
  },
];

export function MakeItYoursModal({
  isOpen,
  onClose,
  projectId,
}: MakeItYoursModalProps): React.ReactElement {
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = useCallback(
    async (planId: string) => {
      if (!isSignedIn) return;
      setLoading(planId);

      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: planId, projectId }),
        });

        const data = (await res.json()) as { url?: string; error?: string };

        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("Checkout error:", data.error);
          setLoading(null);
        }
      } catch (err) {
        console.error("Checkout failed:", err);
        setLoading(null);
      }
    },
    [isSignedIn, projectId]
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
            className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-2xl md:p-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
                <Sparkles className="h-7 w-7 text-[var(--color-accent)]" />
              </div>
              <h2
                className="mb-2 text-2xl font-bold text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Make it yours
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Go live with a custom domain, or own the source code forever
              </p>
            </div>

            {/* Sign-in gate */}
            {!isSignedIn && (
              <div className="mb-6 rounded-xl border border-[var(--color-border-accent)] bg-[var(--color-accent-glow)] p-4 text-center">
                <p className="mb-3 text-sm text-[var(--color-text-secondary)]">
                  Sign in to continue with your purchase
                </p>
                <SignInButton mode="modal">
                  <button className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)]">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            )}

            {/* Plan cards */}
            <div className="grid gap-4 md:grid-cols-3">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-xl border p-5 transition-colors ${
                      plan.recommended
                        ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5"
                        : "border-[var(--color-border)] bg-[var(--color-bg-card)]"
                    }`}
                  >
                    {plan.recommended && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent)] px-3 py-0.5 text-[10px] font-bold tracking-wider text-[var(--color-bg-primary)] uppercase">
                        Recommended
                      </span>
                    )}

                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${plan.accentColor}15` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: plan.accentColor }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                          {plan.name}
                        </h3>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span
                        className="text-3xl font-bold text-[var(--color-text-primary)]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {plan.price}
                      </span>
                      <span className="text-sm text-[var(--color-text-tertiary)]">
                        {plan.period}
                      </span>
                    </div>

                    <p className="mb-4 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                      {plan.description}
                    </p>

                    <ul className="mb-5 flex-1 space-y-2">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]"
                        >
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 shrink-0"
                            style={{ color: plan.accentColor }}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => void handleSelectPlan(plan.id)}
                      disabled={!isSignedIn || loading !== null}
                      className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 ${
                        plan.recommended
                          ? "bg-[var(--color-accent)] text-[var(--color-bg-primary)] hover:scale-[1.02]"
                          : "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-border-accent)]"
                      }`}
                    >
                      {loading === plan.id ? (
                        <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                      ) : (
                        `Choose ${plan.name}`
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-[10px] text-[var(--color-text-tertiary)]">
              Secure checkout powered by Stripe. Cancel anytime.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
