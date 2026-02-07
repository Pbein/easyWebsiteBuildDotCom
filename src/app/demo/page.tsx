"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Briefcase,
  ShoppingBag,
  Camera,
  CalendarCheck,
  PenLine,
  GraduationCap,
  Users,
  Heart,
  PartyPopper,
  FileText,
  LayoutList,
  Globe,
  User,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface SiteTypeOption {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

interface GoalOption {
  id: string;
  label: string;
  description: string;
}

interface PersonalityAxis {
  id: string;
  label: string;
  leftLabel: string;
  rightLabel: string;
  leftDescription: string;
  rightDescription: string;
  leftStyle: React.CSSProperties;
  rightStyle: React.CSSProperties;
}

interface IntakeState {
  siteType: string | null;
  goal: string | null;
  description: string;
  personality: number[];
}

const siteTypes: SiteTypeOption[] = [
  { id: "business", label: "Business Website", description: "Showcase your business and attract clients", icon: Briefcase, color: "#e8a849" },
  { id: "booking", label: "Booking Website", description: "Let customers book appointments or services", icon: CalendarCheck, color: "#f97316" },
  { id: "ecommerce", label: "Online Store", description: "Sell products directly online", icon: ShoppingBag, color: "#3ecfb4" },
  { id: "blog", label: "Blog", description: "Share your writing and ideas", icon: PenLine, color: "#60a5fa" },
  { id: "portfolio", label: "Portfolio", description: "Showcase your creative work", icon: Camera, color: "#c084fc" },
  { id: "personal", label: "Personal Website", description: "Your personal corner of the internet", icon: User, color: "#e8a849" },
  { id: "educational", label: "Educational", description: "Teach, train, or share knowledge", icon: GraduationCap, color: "#3ecfb4" },
  { id: "community", label: "Community", description: "Build a membership or community space", icon: Users, color: "#c084fc" },
  { id: "nonprofit", label: "Nonprofit", description: "Rally support for your cause", icon: Heart, color: "#f97316" },
  { id: "event", label: "Event", description: "Promote and manage an event", icon: PartyPopper, color: "#60a5fa" },
  { id: "landing", label: "Landing Page", description: "One focused page with a single goal", icon: FileText, color: "#e8a849" },
  { id: "directory", label: "Directory", description: "List and organize businesses or resources", icon: LayoutList, color: "#3ecfb4" },
  { id: "other", label: "Something Else", description: "Tell us what you need", icon: HelpCircle, color: "#9496a8" },
];

const goalsByType: Record<string, GoalOption[]> = {
  business: [
    { id: "contact", label: "Get people to contact me", description: "Drive inquiries and leads through contact forms" },
    { id: "book", label: "Get people to book a consultation", description: "Convert visitors into booked consultations" },
    { id: "showcase", label: "Showcase services & build trust", description: "Establish credibility and demonstrate expertise" },
    { id: "sell", label: "Sell products or services directly", description: "Enable direct purchases or service orders" },
  ],
  portfolio: [
    { id: "hire", label: "Get hired / freelance work", description: "Attract clients and showcase skills professionally" },
    { id: "attention", label: "Get industry attention", description: "Impress galleries, labels, or publishers" },
    { id: "audience", label: "Build my audience", description: "Grow a following and fan engagement" },
    { id: "sell", label: "Sell my work directly", description: "Monetize creative work through direct sales" },
  ],
  ecommerce: [
    { id: "products", label: "Sell physical products", description: "Ship tangible goods to customers" },
    { id: "digital", label: "Sell digital products", description: "Deliver downloads, courses, or digital goods" },
    { id: "subscriptions", label: "Subscription-based sales", description: "Recurring revenue from memberships or boxes" },
    { id: "marketplace", label: "Multi-vendor marketplace", description: "Platform for multiple sellers" },
  ],
  _default: [
    { id: "contact", label: "Drive inquiries & contact", description: "Get visitors to reach out" },
    { id: "inform", label: "Provide information", description: "Share knowledge and resources" },
    { id: "convert", label: "Generate leads & signups", description: "Capture email addresses and sign-ups" },
    { id: "sell", label: "Sell products or services", description: "Enable direct transactions" },
  ],
};

const personalityAxes: PersonalityAxis[] = [
  {
    id: "density",
    label: "Density",
    leftLabel: "Minimal & Spacious",
    rightLabel: "Rich & Layered",
    leftDescription: "Clean whitespace, breathing room, simplicity",
    rightDescription: "Textured backgrounds, multiple layers, visual richness",
    leftStyle: {
      background: "linear-gradient(135deg, #1a1b26, #1e2030)",
      borderColor: "rgba(148, 150, 168, 0.1)",
    },
    rightStyle: {
      background: "linear-gradient(135deg, #1a1230, #2a1f3d)",
      borderColor: "rgba(232, 168, 73, 0.2)",
    },
  },
  {
    id: "tone",
    label: "Tone",
    leftLabel: "Playful & Casual",
    rightLabel: "Serious & Professional",
    leftDescription: "Rounded shapes, vibrant colors, friendly feel",
    rightDescription: "Sharp lines, muted palette, refined elegance",
    leftStyle: {
      background: "linear-gradient(135deg, #1a2636, #1a3040)",
      borderColor: "rgba(62, 207, 180, 0.2)",
    },
    rightStyle: {
      background: "linear-gradient(135deg, #1a1b26, #16171f)",
      borderColor: "rgba(148, 150, 168, 0.15)",
    },
  },
  {
    id: "temperature",
    label: "Temperature",
    leftLabel: "Warm & Inviting",
    rightLabel: "Cool & Sleek",
    leftDescription: "Earth tones, cream backgrounds, organic shapes",
    rightDescription: "Blue-gray palette, crisp whites, geometric forms",
    leftStyle: {
      background: "linear-gradient(135deg, #2a1f1a, #302518)",
      borderColor: "rgba(232, 168, 73, 0.2)",
    },
    rightStyle: {
      background: "linear-gradient(135deg, #141a26, #0f1a2a)",
      borderColor: "rgba(96, 165, 250, 0.2)",
    },
  },
  {
    id: "weight",
    label: "Weight",
    leftLabel: "Light & Airy",
    rightLabel: "Bold & Heavy",
    leftDescription: "Thin fonts, subtle colors, delicate elements",
    rightDescription: "Thick fonts, strong contrast, visual impact",
    leftStyle: {
      background: "linear-gradient(135deg, #1a1b26, #1e1f2a)",
      borderColor: "rgba(148, 150, 168, 0.08)",
    },
    rightStyle: {
      background: "linear-gradient(135deg, #0a0b0f, #111218)",
      borderColor: "rgba(232, 168, 73, 0.25)",
    },
  },
  {
    id: "era",
    label: "Era",
    leftLabel: "Classic & Traditional",
    rightLabel: "Modern & Contemporary",
    leftDescription: "Serif fonts, ornamental details, timeless layout",
    rightDescription: "Sans-serif, minimalist, cutting-edge design",
    leftStyle: {
      background: "linear-gradient(135deg, #1f1a14, #2a2018)",
      borderColor: "rgba(200, 169, 110, 0.2)",
    },
    rightStyle: {
      background: "linear-gradient(135deg, #0f1018, #151626)",
      borderColor: "rgba(62, 207, 180, 0.2)",
    },
  },
  {
    id: "energy",
    label: "Energy",
    leftLabel: "Calm & Serene",
    rightLabel: "Dynamic & Energetic",
    leftDescription: "Static elements, gentle transitions, peaceful",
    rightDescription: "Motion, scroll effects, interactive elements",
    leftStyle: {
      background: "linear-gradient(135deg, #141a20, #1a2028)",
      borderColor: "rgba(148, 150, 168, 0.1)",
    },
    rightStyle: {
      background: "linear-gradient(135deg, #1a1030, #251540)",
      borderColor: "rgba(192, 132, 252, 0.2)",
    },
  },
];

const placeholders = [
  "I'm opening a luxury med spa in Miami...",
  "I'm a wedding photographer based in Portland...",
  "We sell handmade ceramics online...",
  "I run a CrossFit gym in Austin...",
  "I'm a freelance graphic designer specializing in branding...",
  "We're a nonprofit helping homeless veterans...",
];

/* ------------------------------------------------------------------ */
/*  Transition variants                                                */
/* ------------------------------------------------------------------ */

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  Main Demo Component                                                */
/* ------------------------------------------------------------------ */

export default function DemoPage(): React.ReactElement {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [state, setState] = useState<IntakeState>({
    siteType: null,
    goal: null,
    description: "",
    personality: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  });
  const [personalityStep, setPersonalityStep] = useState(0);
  const [placeholderIndex] = useState(() => Math.floor(Math.random() * placeholders.length));
  const [showSummary, setShowSummary] = useState(false);

  const totalSteps = 4;

  const goNext = useCallback((): void => {
    if (step === 4) {
      setShowSummary(true);
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, totalSteps));
  }, [step]);

  const goBack = useCallback((): void => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }, [showSummary]);

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return state.siteType !== null;
      case 2: return state.goal !== null;
      case 3: return state.description.trim().length > 10;
      case 4: return personalityStep >= personalityAxes.length;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1
            className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Build Your Website
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Answer a few questions and watch the magic happen. Takes about 3 minutes.
          </p>
        </motion.div>

        {/* Progress Bar */}
        {!showSummary && (
          <div className="mb-12 max-w-md mx-auto">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      i + 1 < step
                        ? "bg-[var(--color-accent)] text-[var(--color-bg-primary)]"
                        : i + 1 === step
                        ? "border-2 border-[var(--color-accent)] text-[var(--color-accent)]"
                        : "border border-[var(--color-border)] text-[var(--color-text-tertiary)]"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`hidden sm:block w-16 md:w-24 h-px transition-all duration-300 ${
                        i + 1 < step ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p
              className="text-xs text-[var(--color-text-tertiary)] text-center mt-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Step {step} of {totalSteps}
              {step === 1 && " — Site Type"}
              {step === 2 && " — Primary Goal"}
              {step === 3 && " — Your Business"}
              {step === 4 && ` — Brand Personality (${personalityStep}/${personalityAxes.length})`}
            </p>
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
          {showSummary ? (
            <SummaryView key="summary" state={state} direction={direction} />
          ) : (
            <motion.div
              key={step}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {step === 1 && (
                <Step1SiteType
                  selected={state.siteType}
                  onSelect={(id) => {
                    setState((s) => ({ ...s, siteType: id, goal: null }));
                  }}
                />
              )}
              {step === 2 && (
                <Step2Goal
                  siteType={state.siteType!}
                  selected={state.goal}
                  onSelect={(id) => setState((s) => ({ ...s, goal: id }))}
                />
              )}
              {step === 3 && (
                <Step3Description
                  value={state.description}
                  onChange={(v) => setState((s) => ({ ...s, description: v }))}
                  placeholder={placeholders[placeholderIndex]}
                />
              )}
              {step === 4 && (
                <Step4Personality
                  personality={state.personality}
                  currentAxis={personalityStep}
                  onUpdate={(axis, value) => {
                    setState((s) => {
                      const newP = [...s.personality];
                      newP[axis] = value;
                      return { ...s, personality: newP };
                    });
                    setPersonalityStep((s) => s + 1);
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-12 max-w-2xl mx-auto">
          <button
            onClick={goBack}
            disabled={step === 1 && !showSummary}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-tertiary)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={goNext}
            disabled={!canProceed()}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] text-[var(--color-bg-primary)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            {step === 4 && canProceed() ? "See Results" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1: Site Type                                                  */
/* ------------------------------------------------------------------ */

function Step1SiteType({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}): React.ReactElement {
  return (
    <div>
      <h2
        className="text-2xl font-bold text-[var(--color-text-primary)] text-center mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        What kind of website are you building?
      </h2>
      <p className="text-[var(--color-text-secondary)] text-center mb-8">
        Choose the category that best describes your project.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {siteTypes.map((type) => {
          const isSelected = selected === type.id;
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`group relative p-4 rounded-xl border text-left transition-all duration-200 card-glow ${
                isSelected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-accent)]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-[var(--color-accent)]" />
                </div>
              )}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110"
                style={{ background: `color-mix(in srgb, ${type.color} 12%, transparent)` }}
              >
                <type.icon className="w-5 h-5" style={{ color: type.color }} />
              </div>
              <p
                className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {type.label}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] leading-snug">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2: Goal                                                       */
/* ------------------------------------------------------------------ */

function Step2Goal({
  siteType,
  selected,
  onSelect,
}: {
  siteType: string;
  selected: string | null;
  onSelect: (id: string) => void;
}): React.ReactElement {
  const goals = goalsByType[siteType] || goalsByType._default;
  const typeLabel = siteTypes.find((t) => t.id === siteType)?.label || "your website";

  return (
    <div>
      <h2
        className="text-2xl font-bold text-[var(--color-text-primary)] text-center mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        What&apos;s the primary goal of {typeLabel.toLowerCase()}?
      </h2>
      <p className="text-[var(--color-text-secondary)] text-center mb-8">
        This helps us optimize the layout and conversion strategy.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {goals.map((goal) => {
          const isSelected = selected === goal.id;
          return (
            <button
              key={goal.id}
              onClick={() => onSelect(goal.id)}
              className={`group relative p-6 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-accent)]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <Check className="w-4 h-4 text-[var(--color-accent)]" />
                </div>
              )}
              <p
                className="text-base font-semibold text-[var(--color-text-primary)] mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {goal.label}
              </p>
              <p className="text-sm text-[var(--color-text-tertiary)]">{goal.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3: Description                                                */
/* ------------------------------------------------------------------ */

function Step3Description({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}): React.ReactElement {
  return (
    <div className="max-w-2xl mx-auto">
      <h2
        className="text-2xl font-bold text-[var(--color-text-primary)] text-center mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Tell us about your business or project
      </h2>
      <p className="text-[var(--color-text-secondary)] text-center mb-8">
        A sentence or two helps our AI understand your industry, audience, and goals.
      </p>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="w-full p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none transition-all duration-200 resize-none text-base leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        />
        <div className="absolute bottom-3 right-4 text-xs text-[var(--color-text-tertiary)]">
          {value.length > 0 ? `${value.length} characters` : "Min. 10 characters"}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs text-[var(--color-text-tertiary)]">Examples:</span>
        {placeholders.slice(0, 3).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="text-xs px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-tertiary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          >
            {p.slice(0, 40)}...
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4: Brand Personality                                          */
/* ------------------------------------------------------------------ */

function Step4Personality({
  personality,
  currentAxis,
  onUpdate,
}: {
  personality: number[];
  currentAxis: number;
  onUpdate: (axis: number, value: number) => void;
}): React.ReactElement {
  const [sliderValue, setSliderValue] = useState(0.5);

  if (currentAxis >= personalityAxes.length) {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-glow)] flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[var(--color-accent)]" />
        </div>
        <h2
          className="text-2xl font-bold text-[var(--color-text-primary)] mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Brand Personality Captured
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-8">
          We&apos;ve mapped your brand across 6 personality dimensions. Click &quot;See Results&quot; to view your profile.
        </p>

        {/* Mini visualization of the personality vector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
          {personalityAxes.map((axis, i) => (
            <div
              key={axis.id}
              className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]"
            >
              <p className="text-xs text-[var(--color-text-tertiary)] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                {axis.label}
              </p>
              <div className="w-full h-1.5 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--color-accent)]"
                  style={{ width: `${personality[i] * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-[var(--color-text-tertiary)]">{axis.leftLabel.split(" ")[0]}</span>
                <span className="text-[9px] text-[var(--color-text-tertiary)]">{axis.rightLabel.split(" ")[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const axis = personalityAxes[currentAxis];

  return (
    <div className="max-w-3xl mx-auto">
      <h2
        className="text-2xl font-bold text-[var(--color-text-primary)] text-center mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {axis.label}: Which feels more like your brand?
      </h2>
      <p className="text-[var(--color-text-secondary)] text-center mb-8">
        Choose the style that resonates with your brand, or position the slider between them.
      </p>

      {/* A/B Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Left pole */}
        <button
          onClick={() => setSliderValue(0.2)}
          className={`group relative p-6 rounded-xl border transition-all duration-200 text-left ${
            sliderValue < 0.4
              ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-accent)]"
          }`}
          style={axis.leftStyle}
        >
          {/* Mock website preview */}
          <div className="mb-4 h-28 rounded-lg overflow-hidden" style={{ ...axis.leftStyle, border: `1px solid ${axis.leftStyle.borderColor}` }}>
            <div className="p-3">
              <div className="w-16 h-1.5 rounded bg-white/10 mb-2" />
              <div className="w-full h-1 rounded bg-white/5 mb-1" />
              <div className="w-3/4 h-1 rounded bg-white/5 mb-4" />
              <div className="flex gap-2">
                <div className="w-8 h-3 rounded bg-[var(--color-accent)]/30" />
                <div className="w-8 h-3 rounded bg-white/5" />
              </div>
            </div>
          </div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            {axis.leftLabel}
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)]">{axis.leftDescription}</p>
        </button>

        {/* Right pole */}
        <button
          onClick={() => setSliderValue(0.8)}
          className={`group relative p-6 rounded-xl border transition-all duration-200 text-left ${
            sliderValue > 0.6
              ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-accent)]"
          }`}
          style={axis.rightStyle}
        >
          {/* Mock website preview */}
          <div className="mb-4 h-28 rounded-lg overflow-hidden" style={{ ...axis.rightStyle, border: `1px solid ${axis.rightStyle.borderColor}` }}>
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="w-12 h-1.5 rounded bg-white/10" />
                <div className="flex gap-1">
                  <div className="w-6 h-1 rounded bg-white/5" />
                  <div className="w-6 h-1 rounded bg-white/5" />
                </div>
              </div>
              <div className="w-full h-8 rounded bg-white/5 mb-2" />
              <div className="grid grid-cols-3 gap-1">
                <div className="h-4 rounded bg-white/5" />
                <div className="h-4 rounded bg-[var(--color-accent)]/20" />
                <div className="h-4 rounded bg-white/5" />
              </div>
            </div>
          </div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            {axis.rightLabel}
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)]">{axis.rightDescription}</p>
        </button>
      </div>

      {/* Slider */}
      <div className="max-w-md mx-auto">
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={sliderValue}
          onChange={(e) => setSliderValue(parseFloat(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--color-accent)]"
          style={{
            background: `linear-gradient(to right, var(--color-bg-tertiary), var(--color-accent-dim) ${sliderValue * 100}%, var(--color-bg-tertiary) ${sliderValue * 100}%)`,
          }}
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-[var(--color-text-tertiary)]">{axis.leftLabel}</span>
          <span className="text-xs text-[var(--color-text-tertiary)]">{axis.rightLabel}</span>
        </div>
      </div>

      {/* Confirm button */}
      <div className="text-center mt-8">
        <button
          onClick={() => onUpdate(currentAxis, sliderValue)}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-all duration-200"
        >
          Confirm &amp; Next Axis
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Summary View                                                       */
/* ------------------------------------------------------------------ */

function SummaryView({
  state,
  direction,
}: {
  state: IntakeState;
  direction: number;
}): React.ReactElement {
  const siteType = siteTypes.find((t) => t.id === state.siteType);
  const goals = goalsByType[state.siteType || ""] || goalsByType._default;
  const goal = goals.find((g) => g.id === state.goal);

  return (
    <motion.div
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] flex items-center justify-center mx-auto mb-5 shadow-[var(--shadow-glow)]">
          <Sparkles className="w-8 h-8 text-[var(--color-bg-primary)]" />
        </div>
        <h2
          className="text-3xl font-bold text-[var(--color-text-primary)] mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Your Site Intent Profile
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Here&apos;s what our AI captured. This drives every design decision.
        </p>
      </div>

      {/* Summary cards */}
      <div className="space-y-4">
        {/* Site type + goal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Site Type
            </p>
            <div className="flex items-center gap-3">
              {siteType && (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${siteType.color} 12%, transparent)` }}
                >
                  <siteType.icon className="w-4 h-4" style={{ color: siteType.color }} />
                </div>
              )}
              <p className="text-[var(--color-text-primary)] font-medium">{siteType?.label || "Not selected"}</p>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-teal)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Primary Goal
            </p>
            <p className="text-[var(--color-text-primary)] font-medium">{goal?.label || "Not selected"}</p>
          </div>
        </div>

        {/* Description */}
        <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Business Description
          </p>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            {state.description || "No description provided"}
          </p>
        </div>

        {/* Personality vector */}
        <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Brand Personality Vector
          </p>
          <div className="space-y-3">
            {personalityAxes.map((axis, i) => (
              <div key={axis.id} className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-text-tertiary)] w-24 shrink-0 text-right" style={{ fontFamily: "var(--font-heading)" }}>
                  {axis.label}
                </span>
                <div className="flex-1 h-2 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${state.personality[i] * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-teal)]"
                  />
                </div>
                <span className="text-xs text-[var(--color-text-tertiary)] w-8 font-mono">
                  {state.personality[i].toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coming soon notice */}
        <div className="p-6 rounded-xl border border-dashed border-[var(--color-border-accent)] bg-[var(--color-accent-glow)] text-center">
          <Sparkles className="w-6 h-6 text-[var(--color-accent)] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            Assembly Engine Coming Soon
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto">
            In the full version, this intent profile feeds into our AI assembly engine which selects
            components, generates a theme, and builds a live preview of your website — all in real time.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
