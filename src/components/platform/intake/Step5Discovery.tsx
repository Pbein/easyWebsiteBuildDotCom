"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Globe,
  Target,
  FileText,
  Loader2,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { useIntakeStore } from "@/lib/stores/intake-store";

interface Step5DiscoveryProps {
  onComplete: () => void;
}

function computeInputKey(
  siteType: string | null,
  goal: string | null,
  businessName: string,
  description: string,
  emotionalGoals: string[],
  voiceProfile: string | null,
  brandArchetype: string | null
): string {
  return `${siteType || ""}|${goal || ""}|${businessName}|${description.slice(0, 100)}|${emotionalGoals.sort().join(",")}|${voiceProfile || ""}|${brandArchetype || ""}`;
}

export function Step5Discovery({ onComplete }: Step5DiscoveryProps): React.ReactElement {
  const siteType = useIntakeStore((s) => s.siteType);
  const goal = useIntakeStore((s) => s.goal);
  const businessName = useIntakeStore((s) => s.businessName);
  const description = useIntakeStore((s) => s.description);
  const personality = useIntakeStore((s) => s.personality);
  const emotionalGoals = useIntakeStore((s) => s.emotionalGoals);
  const voiceProfile = useIntakeStore((s) => s.voiceProfile);
  const narrativePrompts = useIntakeStore((s) => s.narrativePrompts);
  const brandArchetype = useIntakeStore((s) => s.brandArchetype);
  const antiReferences = useIntakeStore((s) => s.antiReferences);
  const aiQuestions = useIntakeStore((s) => s.aiQuestions);
  const aiResponses = useIntakeStore((s) => s.aiResponses);
  const questionsInputKey = useIntakeStore((s) => s.questionsInputKey);
  const setAiQuestions = useIntakeStore((s) => s.setAiQuestions);
  const setAiResponse = useIntakeStore((s) => s.setAiResponse);
  const reset = useIntakeStore((s) => s.reset);

  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const generateQuestionsAction = useAction(api.ai.generateQuestions.generateQuestions);

  // Load AI questions on mount (with input-key staleness check)
  useEffect(() => {
    const currentKey = computeInputKey(
      siteType,
      goal,
      businessName,
      description,
      emotionalGoals,
      voiceProfile,
      brandArchetype
    );
    const keysMatch = questionsInputKey === currentKey;

    if (aiQuestions.length > 0 && keysMatch) {
      // Questions exist for the current intake data
      const allQuestionsAnswered = aiQuestions.every((q) => aiResponses[q.id]);
      if (allQuestionsAnswered) {
        setReviewMode(true);
      }
      // else: partially answered — resume from where they left off (existing behavior)
      return;
    }

    // Keys don't match OR no questions exist → clear stale data and generate fresh
    if (aiQuestions.length > 0) {
      setAiQuestions([]);
      useIntakeStore.setState({ aiResponses: {} });
      setCurrentQuestionIndex(0);
    }

    let cancelled = false;
    setIsLoading(true);

    generateQuestionsAction({
      siteType: siteType || "business",
      goal: goal || "contact",
      description: description || "",
      personality,
      businessName: businessName || "",
      emotionalGoals,
      voiceProfile: voiceProfile || undefined,
      brandArchetype: brandArchetype || undefined,
      antiReferences,
      narrativePrompts,
    })
      .then((questions) => {
        if (!cancelled) {
          setAiQuestions(questions);
          useIntakeStore.setState({ questionsInputKey: currentKey });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to generate questions:", err);
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startOver = useCallback((): void => {
    reset();
    router.push("/demo");
  }, [reset, router]);

  // Calculate how many questions are already answered (resume partial progress)
  useEffect(() => {
    if (aiQuestions.length === 0 || reviewMode) return;
    const answeredCount = aiQuestions.filter((q) => aiResponses[q.id]).length;
    if (answeredCount > 0 && answeredCount < aiQuestions.length) {
      setCurrentQuestionIndex(answeredCount);
    }
  }, [aiQuestions, aiResponses, reviewMode]);

  const handleSubmitText = useCallback((): void => {
    if (!inputValue.trim()) return;
    const question = aiQuestions[currentQuestionIndex];
    if (!question) return;

    setAiResponse(question.id, inputValue.trim());
    setInputValue("");

    if (currentQuestionIndex < aiQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    }
  }, [inputValue, aiQuestions, currentQuestionIndex, setAiResponse]);

  const handleSelectOption = useCallback(
    (option: string): void => {
      const question = aiQuestions[currentQuestionIndex];
      if (!question) return;

      setAiResponse(question.id, option);

      if (currentQuestionIndex < aiQuestions.length - 1) {
        setCurrentQuestionIndex((i) => i + 1);
      }
    },
    [aiQuestions, currentQuestionIndex, setAiResponse]
  );

  const handleUpdateAnswers = useCallback((): void => {
    useIntakeStore.setState({ aiResponses: {} });
    setReviewMode(false);
    setCurrentQuestionIndex(0);
  }, []);

  const allAnswered = aiQuestions.length > 0 && aiQuestions.every((q) => aiResponses[q.id]);

  const siteTypeLabels: Record<string, string> = {
    business: "Business Website",
    portfolio: "Portfolio",
    ecommerce: "Online Store",
    blog: "Blog",
    booking: "Booking Website",
    personal: "Personal Website",
    educational: "Educational",
    community: "Community",
    nonprofit: "Nonprofit",
    event: "Event",
    landing: "Landing Page",
    directory: "Directory",
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Summary card */}
      <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Globe className="h-4 w-4 text-[var(--color-accent)]" />
            <span>{siteTypeLabels[siteType || ""] || siteType}</span>
          </div>
          <div className="h-4 w-px bg-[var(--color-border)]" />
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Target className="h-4 w-4 text-[var(--color-teal)]" />
            <span className="capitalize">{goal}</span>
          </div>
          <div className="h-4 w-px bg-[var(--color-border)]" />
          <div className="flex items-center gap-2 text-[var(--color-text-tertiary)]">
            <FileText className="h-4 w-4" />
            <span className="max-w-[160px] truncate">{description?.slice(0, 40)}...</span>
          </div>
        </div>
      </div>

      <h2
        className="mb-2 text-center text-2xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        A Few More Details
      </h2>
      <p className="mb-8 text-center text-[var(--color-text-secondary)]">
        Help us fine-tune your website with these quick questions.
      </p>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-8 w-8 text-[var(--color-accent)]" />
          </motion.div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Our AI is crafting personalized questions for you...
          </p>
        </div>
      )}

      {/* Review mode — show previous answers with confirm/update options */}
      {!isLoading && reviewMode && aiQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="mb-2 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[var(--color-teal)]" />
            <p className="text-sm text-[var(--color-text-secondary)]">
              You previously answered these questions. Review and confirm or update.
            </p>
          </div>

          {aiQuestions.map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"
            >
              <p className="mb-1 text-sm text-[var(--color-text-secondary)]">{q.question}</p>
              <p className="font-medium text-[var(--color-text-primary)]">{aiResponses[q.id]}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row"
          >
            <button
              onClick={onComplete}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] px-8 py-3 text-sm font-semibold text-[var(--color-bg-primary)] transition-transform duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none"
            >
              <CheckCircle2 className="h-4 w-4" />
              These answers look good
            </button>
            <button
              onClick={handleUpdateAnswers}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none"
            >
              <RefreshCw className="h-4 w-4" />
              Update my answers
            </button>
          </motion.div>
        </div>
      )}

      {/* Questions (normal flow) */}
      {!isLoading && !reviewMode && aiQuestions.length > 0 && (
        <div className="space-y-4">
          {/* Answered questions */}
          {aiQuestions.slice(0, currentQuestionIndex).map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"
            >
              <p className="mb-1 text-sm text-[var(--color-text-secondary)]">{q.question}</p>
              <p className="font-medium text-[var(--color-text-primary)]">{aiResponses[q.id]}</p>
            </motion.div>
          ))}

          {/* Current question */}
          {!allAnswered && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-bg-card)] p-6"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="text-xs font-semibold tracking-wider text-[var(--color-accent)] uppercase"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Question {currentQuestionIndex + 1} of {aiQuestions.length}
                  </span>
                </div>
                <p
                  className="mb-4 text-lg font-medium text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {aiQuestions[currentQuestionIndex].question}
                </p>

                {aiQuestions[currentQuestionIndex].type === "select" &&
                aiQuestions[currentQuestionIndex].options ? (
                  <div className="grid grid-cols-1 gap-2">
                    {aiQuestions[currentQuestionIndex].options!.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSelectOption(option)}
                        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-3 text-left text-sm text-[var(--color-text-primary)] transition-colors duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-glow)] focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="discovery-answer"
                      name="discovery-answer"
                      aria-label="Your answer"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmitText();
                      }}
                      placeholder="Type your answer..."
                      className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] transition-colors focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSubmitText}
                      disabled={!inputValue.trim()}
                      className="rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-[var(--color-bg-primary)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* All answered — proceed button */}
          {allAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent-glow)]">
                <Sparkles className="h-7 w-7 text-[var(--color-accent)]" />
              </div>
              <p
                className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                All Set!
              </p>
              <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
                We have everything we need to generate your website preview.
              </p>
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] px-8 py-3 text-sm font-semibold text-[var(--color-bg-primary)] transition-transform duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none"
              >
                <Sparkles className="h-4 w-4" />
                Generate My Website Preview
                <Loader2 className="h-4 w-4 opacity-0" />
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Start Over link */}
      <div className="mt-8 text-center">
        <button
          onClick={startOver}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)] focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none"
        >
          <RotateCcw className="h-3 w-3" />
          Start Over
        </button>
      </div>
    </div>
  );
}
