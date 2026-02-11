"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Heart, Meh, ThumbsDown, X, Send } from "lucide-react";

interface FeedbackBannerProps {
  sessionId: string;
}

type Rating = "love" | "okay" | "not-right";

const RATING_OPTIONS: {
  id: Rating;
  label: string;
  icon: typeof Heart;
  activeColor: string;
  activeBg: string;
}[] = [
  {
    id: "love",
    label: "Love it",
    icon: Heart,
    activeColor: "text-rose-400",
    activeBg: "bg-rose-500/15",
  },
  {
    id: "okay",
    label: "It's OK",
    icon: Meh,
    activeColor: "text-amber-400",
    activeBg: "bg-amber-500/15",
  },
  {
    id: "not-right",
    label: "Not right",
    icon: ThumbsDown,
    activeColor: "text-red-400",
    activeBg: "bg-red-500/15",
  },
];

const DIMENSION_CHIPS: { id: string; label: string }[] = [
  { id: "colors", label: "Colors" },
  { id: "layout", label: "Layout" },
  { id: "content", label: "Content" },
  { id: "fonts", label: "Fonts" },
  { id: "vibe", label: "Overall vibe" },
  { id: "images", label: "Images" },
];

const DELAY_MS = 3000;

export function FeedbackBanner({ sessionId }: FeedbackBannerProps): React.ReactElement | null {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);

  const existingFeedback = useQuery(api.feedback.getFeedback, { sessionId });
  const saveFeedback = useMutation(api.feedback.saveFeedback);

  // Show banner after delay (only if no existing feedback)
  useEffect(() => {
    if (existingFeedback !== undefined && existingFeedback !== null) {
      return;
    }
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [existingFeedback]);

  const handleDismiss = useCallback((): void => {
    setDismissed(true);
  }, []);

  const toggleDimension = useCallback((id: string): void => {
    setSelectedDimensions((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }, []);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!selectedRating) return;
    try {
      await saveFeedback({
        sessionId,
        rating: selectedRating,
        dimensions: selectedDimensions.length > 0 ? selectedDimensions : undefined,
        freeText: freeText.trim() || undefined,
      });
      setJustSubmitted(true);
    } catch (err) {
      console.error("Failed to save feedback:", err);
    }
  }, [selectedRating, selectedDimensions, freeText, sessionId, saveFeedback]);

  // Already had feedback from a previous session — don't show anything
  if (
    dismissed ||
    (existingFeedback !== undefined && existingFeedback !== null && !justSubmitted)
  ) {
    return null;
  }

  // Don't render until visible (unless we just submitted)
  if (!visible && !justSubmitted) {
    return null;
  }

  // Just-submitted confirmation
  if (justSubmitted) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-50 duration-300">
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#12131a] px-5 py-3.5 shadow-2xl">
          <p className="text-sm font-medium text-emerald-400">Thanks for your feedback!</p>
        </div>
      </div>
    );
  }

  const showFollowUp = selectedRating === "not-right" || selectedRating === "okay";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-50 duration-300">
      <div className="w-80 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#12131a] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-4 py-3">
          <p className="text-xs font-semibold tracking-wide text-[#9496a8] uppercase">
            How does this look?
          </p>
          <button
            onClick={handleDismiss}
            className="rounded-md p-0.5 text-[#6b6d80] transition-colors hover:text-white"
            title="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Rating buttons */}
        <div className="flex gap-2 px-4 py-3">
          {RATING_OPTIONS.map(({ id, label, icon: Icon, activeColor, activeBg }) => {
            const isActive = selectedRating === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedRating(id)}
                className={`flex flex-1 flex-col items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? `${activeBg} ${activeColor}`
                    : "text-[#9496a8] hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive && id === "love" ? "fill-current" : ""}`} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Follow-up: dimension chips + free text (only for okay / not-right) */}
        {showFollowUp && (
          <div className="border-t border-[rgba(255,255,255,0.06)] px-4 py-3">
            <p className="mb-2 text-[11px] font-medium text-[#6b6d80]">What feels off?</p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {DIMENSION_CHIPS.map(({ id, label }) => {
                const isSelected = selectedDimensions.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleDimension(id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      isSelected
                        ? "bg-[#e8a849]/15 text-[#e8a849]"
                        : "bg-[rgba(255,255,255,0.04)] text-[#9496a8] hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="Anything else? (optional)"
              rows={2}
              className="w-full resize-none rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-xs text-white placeholder-[#6b6d80] transition-colors outline-none focus:border-[#e8a849]/40"
            />
          </div>
        )}

        {/* Submit */}
        {selectedRating && (
          <div className="border-t border-[rgba(255,255,255,0.06)] px-4 py-3">
            <button
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#e8a849] px-4 py-2 text-xs font-semibold text-[#0a0b0f] transition-opacity hover:opacity-90"
            >
              <Send className="h-3 w-3" />
              Send Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
