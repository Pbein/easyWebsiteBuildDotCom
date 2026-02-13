"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Heart, Gem, Zap, Users, Frown, Smile } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useIntakeStore } from "@/lib/stores/intake-store";
import {
  VOICE_TONE_CARDS,
  NARRATIVE_PROMPT_DEFS,
  NARRATIVE_PLACEHOLDERS,
} from "@/lib/types/brand-character";
import type { VoiceTone } from "@/lib/types/brand-character";

/* ── Icon map ────────────────────────────────────────────── */

const ICON_MAP: Record<string, LucideIcon> = {
  Heart,
  Gem,
  Zap,
  Users,
  Frown,
  Smile,
};

/* ── Personalized content templates ──────────────────────── */

function getPersonalizedHeadline(
  tone: VoiceTone,
  businessName: string,
  siteType: string | null
): string {
  const name = businessName || "Your Business";
  const type = siteType || "business";

  const templates: Record<VoiceTone, Record<string, string>> = {
    warm: {
      restaurant: `Hey, welcome to ${name} — pull up a chair, you\u2019re family here`,
      booking: `We\u2019re so glad you found ${name} — let\u2019s get you booked in`,
      ecommerce: `Welcome to ${name}! We handpick everything just for you`,
      portfolio: `Hey there \u2014 I\u2019m glad you stopped by ${name}`,
      blog: `Welcome to ${name} \u2014 grab a coffee and stay a while`,
      nonprofit: `Welcome to ${name} \u2014 together, we can make a difference`,
      educational: `Welcome to ${name} \u2014 let\u2019s learn something great together`,
      event: `You\u2019re invited! ${name} is going to be something special`,
      _default: `Hey, welcome to ${name} \u2014 we\u2019re glad you\u2019re here`,
    },
    polished: {
      restaurant: `${name} \u2014 Where Every Dish Tells a Story`,
      booking: `${name} \u2014 Where Excellence Meets Your Schedule`,
      ecommerce: `${name} \u2014 Curated With Intention, Crafted With Care`,
      portfolio: `${name} \u2014 A Portfolio of Purposeful Work`,
      blog: `${name} \u2014 Thoughtful Perspectives, Carefully Written`,
      nonprofit: `${name} \u2014 Purposeful Impact, Lasting Change`,
      educational: `${name} \u2014 Elevating Minds Through Expert Instruction`,
      event: `${name} \u2014 An Experience Designed to Inspire`,
      _default: `${name} \u2014 Where Excellence Meets Precision`,
    },
    direct: {
      restaurant: `${name}. Great food. No pretense`,
      booking: `${name}. Book in 30 seconds`,
      ecommerce: `${name}. Better products. Fair prices`,
      portfolio: `${name}. The work speaks for itself`,
      blog: `${name}. Real insights. No filler`,
      nonprofit: `${name}. Real impact. Transparent results`,
      educational: `${name}. Learn fast. Apply immediately`,
      event: `${name}. One event. Don\u2019t miss it`,
      _default: `${name}. Better results. Less hassle`,
    },
  };

  return templates[tone][type] || templates[tone]._default;
}

function getPersonalizedSubheadline(
  tone: VoiceTone,
  businessName: string,
  siteType: string | null,
  description: string,
  narrativePrompts: Record<string, string>
): string {
  const comeBecause = narrativePrompts.come_because?.trim();
  const afterFeel = narrativePrompts.after_feel?.trim();

  // If the user wrote narrative prompts, weave them in
  if (comeBecause) {
    switch (tone) {
      case "warm":
        return `People love us because ${comeBecause.toLowerCase().replace(/^because\s*/i, "")}`;
      case "polished":
        return capitalizeFirst(comeBecause);
      case "direct":
        return capitalizeFirst(comeBecause) + ".";
    }
  }

  if (afterFeel) {
    switch (tone) {
      case "warm":
        return `Our clients walk away feeling ${afterFeel.toLowerCase()}`;
      case "polished":
        return `Experience the difference: ${afterFeel.toLowerCase()}`;
      case "direct":
        return capitalizeFirst(afterFeel);
    }
  }

  // Fallback: use description snippet or generic
  if (description && description.length > 15) {
    const snippet = description.length > 80 ? description.slice(0, 77) + "..." : description;
    switch (tone) {
      case "warm":
        return snippet;
      case "polished":
        return snippet;
      case "direct":
        return snippet;
    }
  }

  const type = siteType || "business";
  const fallbacks: Record<VoiceTone, Record<string, string>> = {
    warm: {
      restaurant: "We pour love into every plate — come taste the difference",
      ecommerce: "Every product in our shop is something we truly believe in",
      _default: "We care about what we do, and it shows in the details",
    },
    polished: {
      restaurant: "An elevated dining experience crafted for discerning palates",
      ecommerce: "A thoughtfully curated collection for the modern connoisseur",
      _default: "Precision, craft, and attention to every detail",
    },
    direct: {
      restaurant: "Fresh ingredients. Expert technique. Every single day",
      ecommerce: "Quality products. Fast shipping. Simple returns",
      _default: "We do the work. You see the results",
    },
  };

  return fallbacks[tone][type] || fallbacks[tone]._default;
}

function getPersonalizedCTA(tone: VoiceTone, goal: string | null, siteType: string | null): string {
  const type = siteType || "business";

  const templates: Record<VoiceTone, Record<string, string>> = {
    warm: {
      book: "Let\u2019s find a time that works",
      contact: "Let\u2019s chat",
      sell: "Browse our favorites",
      hire: "Let\u2019s work together",
      showcase: "See what we do",
      _default: "Get in touch",
    },
    polished: {
      book: "Schedule a Consultation",
      contact: "Begin a Conversation",
      sell: "Explore the Collection",
      hire: "View Selected Works",
      showcase: "Discover Our Expertise",
      _default: "Learn More",
    },
    direct: {
      book: "Book now",
      contact: "Contact us",
      sell: "Shop now",
      hire: "See my work",
      showcase: "See services",
      _default: "Get started",
    },
  };

  // Try goal first, then site type, then default
  const toneTemplates = templates[tone];
  if (goal && toneTemplates[goal]) return toneTemplates[goal];

  // Map site type to likely CTA
  const typeGoalMap: Record<string, string> = {
    restaurant: "book",
    booking: "book",
    ecommerce: "sell",
    portfolio: "hire",
    blog: "showcase",
    nonprofit: "contact",
    educational: "showcase",
    event: "book",
  };

  const mappedGoal = typeGoalMap[type];
  if (mappedGoal && toneTemplates[mappedGoal]) return toneTemplates[mappedGoal];

  return toneTemplates._default;
}

function capitalizeFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ── Component ───────────────────────────────────────────── */

interface Step6VoiceProps {
  onComplete: () => void;
  onBack: () => void;
}

export function Step6Voice({ onComplete, onBack }: Step6VoiceProps): React.ReactElement {
  const {
    voiceProfile,
    setVoiceProfile,
    narrativePrompts,
    setNarrativePrompt,
    businessName,
    siteType,
    goal,
    description,
  } = useIntakeStore();

  const handleSelectVoice = useCallback(
    (tone: VoiceTone): void => {
      setVoiceProfile(tone);
    },
    [setVoiceProfile]
  );

  const canProceed = voiceProfile !== null;
  const displayName = businessName || "your business";

  return (
    <div className="mx-auto max-w-3xl">
      {/* ── Section 1: Your Story ────────────────────────── */}
      <h2
        className="mb-2 text-center text-2xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        In your own words
      </h2>
      <p className="mb-8 text-center text-[var(--color-text-secondary)]">
        Share a bit about what makes{" "}
        <span className="font-semibold text-[var(--color-text-primary)]">{displayName}</span>{" "}
        special. Even a few words help us write better copy.
      </p>

      <div className="mb-12 space-y-3">
        {NARRATIVE_PROMPT_DEFS.map((prompt, i) => {
          const Icon = ICON_MAP[prompt.icon] || Users;
          const placeholders =
            NARRATIVE_PLACEHOLDERS[siteType || "business"] || NARRATIVE_PLACEHOLDERS.business;
          const placeholder = placeholders?.[prompt.key] || "Type your answer...";
          const label = prompt.promptTemplate.replace("{businessName}", displayName);

          return (
            <motion.div
              key={prompt.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 transition-colors duration-200 focus-within:border-[var(--color-accent)]"
            >
              <label
                htmlFor={`narrative-${prompt.key}`}
                className="mb-2.5 flex items-center gap-2.5"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `color-mix(in srgb, ${prompt.accent} 12%, transparent)` }}
                >
                  <Icon className="h-4 w-4" style={{ color: prompt.accent }} />
                </div>
                <span
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {label}
                </span>
              </label>
              <input
                type="text"
                id={`narrative-${prompt.key}`}
                name={`narrative-${prompt.key}`}
                value={narrativePrompts[prompt.key] || ""}
                onChange={(e) => setNarrativePrompt(prompt.key, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border-0 bg-[var(--color-bg-tertiary)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] transition-colors duration-200 focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </motion.div>
          );
        })}

        <p className="text-center text-xs text-[var(--color-text-tertiary)]">
          All optional — skip ahead to pick your voice if you prefer.
        </p>
      </div>

      {/* ── Section 2: Pick Your Voice ───────────────────── */}
      <h3
        className="mb-2 text-center text-xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        How should {displayName} sound?
      </h3>
      <p className="mb-6 text-center text-sm text-[var(--color-text-secondary)]">
        Pick the voice that feels most like you.
      </p>

      <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {VOICE_TONE_CARDS.map((card, i) => {
          const isSelected = voiceProfile === card.id;
          const Icon = ICON_MAP[card.icon] || Zap;
          const headline = getPersonalizedHeadline(card.id, businessName, siteType);
          const subheadline = getPersonalizedSubheadline(
            card.id,
            businessName,
            siteType,
            description,
            narrativePrompts
          );
          const cta = getPersonalizedCTA(card.id, goal, siteType);

          return (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
              onClick={() => handleSelectVoice(card.id)}
              className={`group relative flex flex-col rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none ${
                isSelected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)] shadow-[0_0_20px_rgba(232,168,73,0.08)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-accent)]"
              }`}
            >
              {/* Check indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <Check className="h-4 w-4 text-[var(--color-accent)]" />
                </div>
              )}

              {/* Header: icon + label + tagline */}
              <div className="mb-3 flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `color-mix(in srgb, ${card.accent} 12%, transparent)` }}
                >
                  <Icon className="h-4 w-4" style={{ color: card.accent }} />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm leading-tight font-semibold text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {card.label}
                  </p>
                  <p className="text-[11px] leading-tight text-[var(--color-text-tertiary)]">
                    {card.tagline}
                  </p>
                </div>
              </div>

              {/* Mini-preview: personalized headline + subheadline + CTA */}
              <div className="mb-3 flex-1 rounded-lg bg-[var(--color-bg-tertiary)] p-3">
                <p
                  className="mb-1.5 text-xs leading-snug font-semibold text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  &ldquo;{headline}&rdquo;
                </p>
                <p className="mb-2.5 text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
                  {subheadline}
                </p>
                <span
                  className="inline-block rounded-md px-2.5 py-1 text-[10px] font-semibold"
                  style={{
                    background: `color-mix(in srgb, ${card.accent} 15%, transparent)`,
                    color: card.accent,
                  }}
                >
                  {cta}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] leading-snug text-[var(--color-text-tertiary)]">
                {card.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* ── Navigation ───────────────────────────────────── */}
      <div className="mx-auto flex max-w-2xl justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={!canProceed}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] px-6 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] transition-transform duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
