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
  User,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useIntakeStore } from "@/lib/stores/intake-store";
import { Step5Discovery, Step6Loading } from "@/components/platform/intake";

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

interface LocalIntakeState {
  siteType: string | null;
  goal: string | null;
  businessName: string;
  description: string;
  personality: number[];
}

const siteTypes: SiteTypeOption[] = [
  {
    id: "business",
    label: "Business Website",
    description: "Showcase your business and attract clients",
    icon: Briefcase,
    color: "#e8a849",
  },
  {
    id: "booking",
    label: "Booking Website",
    description: "Let customers book appointments or services",
    icon: CalendarCheck,
    color: "#f97316",
  },
  {
    id: "ecommerce",
    label: "Online Store",
    description: "Sell products directly online",
    icon: ShoppingBag,
    color: "#3ecfb4",
  },
  {
    id: "blog",
    label: "Blog",
    description: "Share your writing and ideas",
    icon: PenLine,
    color: "#60a5fa",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "Showcase your creative work",
    icon: Camera,
    color: "#c084fc",
  },
  {
    id: "personal",
    label: "Personal Website",
    description: "Your personal corner of the internet",
    icon: User,
    color: "#e8a849",
  },
  {
    id: "educational",
    label: "Educational",
    description: "Teach, train, or share knowledge",
    icon: GraduationCap,
    color: "#3ecfb4",
  },
  {
    id: "community",
    label: "Community",
    description: "Build a membership or community space",
    icon: Users,
    color: "#c084fc",
  },
  {
    id: "nonprofit",
    label: "Nonprofit",
    description: "Rally support for your cause",
    icon: Heart,
    color: "#f97316",
  },
  {
    id: "event",
    label: "Event",
    description: "Promote and manage an event",
    icon: PartyPopper,
    color: "#60a5fa",
  },
  {
    id: "landing",
    label: "Landing Page",
    description: "One focused page with a single goal",
    icon: FileText,
    color: "#e8a849",
  },
  {
    id: "directory",
    label: "Directory",
    description: "List and organize businesses or resources",
    icon: LayoutList,
    color: "#3ecfb4",
  },
  {
    id: "other",
    label: "Something Else",
    description: "Tell us what you need",
    icon: HelpCircle,
    color: "#9496a8",
  },
];

const goalsByType: Record<string, GoalOption[]> = {
  business: [
    {
      id: "contact",
      label: "Get people to contact me",
      description: "Drive inquiries and leads through contact forms",
    },
    {
      id: "book",
      label: "Get people to book a consultation",
      description: "Convert visitors into booked consultations",
    },
    {
      id: "showcase",
      label: "Showcase services & build trust",
      description: "Establish credibility and demonstrate expertise",
    },
    {
      id: "sell",
      label: "Sell products or services directly",
      description: "Enable direct purchases or service orders",
    },
  ],
  portfolio: [
    {
      id: "hire",
      label: "Get hired / freelance work",
      description: "Attract clients and showcase skills professionally",
    },
    {
      id: "attention",
      label: "Get industry attention",
      description: "Impress galleries, labels, or publishers",
    },
    {
      id: "audience",
      label: "Build my audience",
      description: "Grow a following and fan engagement",
    },
    {
      id: "sell",
      label: "Sell my work directly",
      description: "Monetize creative work through direct sales",
    },
  ],
  ecommerce: [
    {
      id: "products",
      label: "Sell physical products",
      description: "Ship tangible goods to customers",
    },
    {
      id: "digital",
      label: "Sell digital products",
      description: "Deliver downloads, courses, or digital goods",
    },
    {
      id: "subscriptions",
      label: "Subscription-based sales",
      description: "Recurring revenue from memberships or boxes",
    },
    {
      id: "marketplace",
      label: "Multi-vendor marketplace",
      description: "Platform for multiple sellers",
    },
  ],
  _default: [
    { id: "contact", label: "Drive inquiries & contact", description: "Get visitors to reach out" },
    { id: "inform", label: "Provide information", description: "Share knowledge and resources" },
    {
      id: "convert",
      label: "Generate leads & signups",
      description: "Capture email addresses and sign-ups",
    },
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
  const [state, setState] = useState<LocalIntakeState>({
    siteType: null,
    goal: null,
    businessName: "",
    description: "",
    personality: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  });
  const [personalityStep, setPersonalityStep] = useState(0);
  const [placeholderIndex] = useState(() => Math.floor(Math.random() * placeholders.length));

  const store = useIntakeStore();

  const totalSteps = 6;

  /** Bridge local state → Zustand store at step 4→5 boundary */
  const bridgeToStore = useCallback((): void => {
    store.setSiteType(state.siteType || "business");
    store.setGoal(state.goal || "contact");
    store.setBusinessName(state.businessName);
    store.setDescription(state.description);
    // Set each personality axis
    state.personality.forEach((value, i) => {
      // We need direct store mutation for personality without incrementing personalityStep each time
      const newPersonality = [...useIntakeStore.getState().personality];
      newPersonality[i] = value;
      useIntakeStore.setState({ personality: newPersonality });
    });
  }, [state, store]);

  const goNext = useCallback((): void => {
    if (step === 4 && personalityStep >= personalityAxes.length) {
      // Bridge to Zustand store before moving to step 5
      bridgeToStore();
      setDirection(1);
      setStep(5);
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, totalSteps));
  }, [step, personalityStep, bridgeToStore]);

  const goBack = useCallback((): void => {
    if (step === 5) {
      setDirection(-1);
      setStep(4);
      return;
    }
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }, [step]);

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return state.siteType !== null;
      case 2:
        return state.goal !== null;
      case 3:
        return state.businessName.trim().length > 0 && state.description.trim().length > 10;
      case 4:
        return personalityStep >= personalityAxes.length;
      default:
        return false;
    }
  };

  // Steps 5 and 6 manage their own navigation
  const showNavButtons = step <= 4;

  const stepLabels: Record<number, string> = {
    1: "Site Type",
    2: "Primary Goal",
    3: "Your Business",
    4: `Brand Personality (${personalityStep}/${personalityAxes.length})`,
    5: "Discovery",
    6: "Generating",
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1
            className="mb-3 text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Build Your Website
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Answer a few questions and watch the magic happen. Takes about 3 minutes.
          </p>
        </motion.div>

        {/* Progress Bar */}
        {step <= 5 && (
          <div className="mx-auto mb-12 max-w-lg">
            <div className="mb-2 flex justify-between">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                      i + 1 < step
                        ? "bg-[var(--color-accent)] text-[var(--color-bg-primary)]"
                        : i + 1 === step
                          ? "border-2 border-[var(--color-accent)] text-[var(--color-accent)]"
                          : "border border-[var(--color-border)] text-[var(--color-text-tertiary)]"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {i + 1 < step ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`hidden h-px w-8 transition-all duration-300 sm:block md:w-14 ${
                        i + 1 < step ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p
              className="mt-3 text-center text-xs text-[var(--color-text-tertiary)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Step {step} of {totalSteps}
              {stepLabels[step] ? ` — ${stepLabels[step]}` : ""}
            </p>
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
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
                businessName={state.businessName}
                onBusinessNameChange={(v) => setState((s) => ({ ...s, businessName: v }))}
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
            {step === 5 && (
              <Step5Discovery
                onComplete={() => {
                  setDirection(1);
                  setStep(6);
                }}
              />
            )}
            {step === 6 && <Step6Loading />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation — only shown for steps 1-4 */}
        {showNavButtons && (
          <div className="mx-auto mt-12 flex max-w-2xl justify-between">
            <button
              onClick={goBack}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={goNext}
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] px-6 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              {step === 4 && canProceed() ? "Continue to Discovery" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Back button for step 5 */}
        {step === 5 && (
          <div className="mx-auto mt-12 flex max-w-2xl justify-start">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        )}
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
        className="mb-2 text-center text-2xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        What kind of website are you building?
      </h2>
      <p className="mb-8 text-center text-[var(--color-text-secondary)]">
        Choose the category that best describes your project.
      </p>

      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {siteTypes.map((type) => {
          const isSelected = selected === type.id;
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`group card-glow relative rounded-xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-accent)]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-[var(--color-accent)]" />
                </div>
              )}
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                style={{ background: `color-mix(in srgb, ${type.color} 12%, transparent)` }}
              >
                <type.icon className="h-5 w-5" style={{ color: type.color }} />
              </div>
              <p
                className="mb-0.5 text-sm font-semibold text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {type.label}
              </p>
              <p className="text-xs leading-snug text-[var(--color-text-tertiary)]">
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
        className="mb-2 text-center text-2xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        What&apos;s the primary goal of {typeLabel.toLowerCase()}?
      </h2>
      <p className="mb-8 text-center text-[var(--color-text-secondary)]">
        This helps us optimize the layout and conversion strategy.
      </p>

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {goals.map((goal) => {
          const isSelected = selected === goal.id;
          return (
            <button
              key={goal.id}
              onClick={() => onSelect(goal.id)}
              className={`group relative rounded-xl border p-6 text-left transition-all duration-200 ${
                isSelected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-accent)]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <Check className="h-4 w-4 text-[var(--color-accent)]" />
                </div>
              )}
              <p
                className="mb-1 text-base font-semibold text-[var(--color-text-primary)]"
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
  businessName,
  onBusinessNameChange,
  value,
  onChange,
  placeholder,
}: {
  businessName: string;
  onBusinessNameChange: (v: string) => void;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}): React.ReactElement {
  return (
    <div className="mx-auto max-w-2xl">
      <h2
        className="mb-2 text-center text-2xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Tell us about your business or project
      </h2>
      <p className="mb-8 text-center text-[var(--color-text-secondary)]">
        We&apos;ll use this to personalize your website content.
      </p>

      {/* Business Name Input */}
      <div className="mb-5">
        <label
          className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Business / Project Name
        </label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => onBusinessNameChange(e.target.value)}
          placeholder="e.g. Luxe Cuts Barbershop, Acme Design Studio"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-5 py-3 text-base text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
          style={{ fontFamily: "var(--font-body)" }}
          autoFocus
        />
      </div>

      {/* Description Textarea */}
      <div className="relative">
        <label
          className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Describe what you do
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 text-base leading-relaxed text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
          style={{ fontFamily: "var(--font-body)" }}
        />
        <div className="absolute right-4 bottom-3 text-xs text-[var(--color-text-tertiary)]">
          {value.length > 0 ? `${value.length} characters` : "Min. 10 characters"}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs text-[var(--color-text-tertiary)]">Examples:</span>
        {placeholders.slice(0, 3).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-tertiary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
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
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-glow)]">
          <Check className="h-8 w-8 text-[var(--color-accent)]" />
        </div>
        <h2
          className="mb-3 text-2xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Brand Personality Captured
        </h2>
        <p className="mb-8 text-[var(--color-text-secondary)]">
          We&apos;ve mapped your brand across 6 personality dimensions. Click &quot;Continue to
          Discovery&quot; to proceed.
        </p>

        {/* Mini visualization of the personality vector */}
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">
          {personalityAxes.map((axis, i) => (
            <div
              key={axis.id}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3"
            >
              <p
                className="mb-1 text-xs text-[var(--color-text-tertiary)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {axis.label}
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-tertiary)]">
                <div
                  className="h-full rounded-full bg-[var(--color-accent)]"
                  style={{ width: `${personality[i] * 100}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-[9px] text-[var(--color-text-tertiary)]">
                  {axis.leftLabel.split(" ")[0]}
                </span>
                <span className="text-[9px] text-[var(--color-text-tertiary)]">
                  {axis.rightLabel.split(" ")[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const axis = personalityAxes[currentAxis];

  return (
    <div className="mx-auto max-w-3xl">
      <h2
        className="mb-2 text-center text-2xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {axis.label}: Which feels more like your brand?
      </h2>
      <p className="mb-8 text-center text-[var(--color-text-secondary)]">
        Choose the style that resonates with your brand, or position the slider between them.
      </p>

      {/* A/B Comparison Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Left pole */}
        <button
          onClick={() => setSliderValue(0.2)}
          className={`group relative rounded-xl border p-6 text-left transition-all duration-200 ${
            sliderValue < 0.4
              ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-accent)]"
          }`}
          style={axis.leftStyle}
        >
          {/* Mock website preview */}
          <div
            className="mb-4 h-28 overflow-hidden rounded-lg"
            style={{ ...axis.leftStyle, border: `1px solid ${axis.leftStyle.borderColor}` }}
          >
            <div className="p-3">
              <div className="mb-2 h-1.5 w-16 rounded bg-white/10" />
              <div className="mb-1 h-1 w-full rounded bg-white/5" />
              <div className="mb-4 h-1 w-3/4 rounded bg-white/5" />
              <div className="flex gap-2">
                <div className="h-3 w-8 rounded bg-[var(--color-accent)]/30" />
                <div className="h-3 w-8 rounded bg-white/5" />
              </div>
            </div>
          </div>
          <p
            className="mb-1 text-sm font-semibold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {axis.leftLabel}
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)]">{axis.leftDescription}</p>
        </button>

        {/* Right pole */}
        <button
          onClick={() => setSliderValue(0.8)}
          className={`group relative rounded-xl border p-6 text-left transition-all duration-200 ${
            sliderValue > 0.6
              ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-accent)]"
          }`}
          style={axis.rightStyle}
        >
          {/* Mock website preview */}
          <div
            className="mb-4 h-28 overflow-hidden rounded-lg"
            style={{ ...axis.rightStyle, border: `1px solid ${axis.rightStyle.borderColor}` }}
          >
            <div className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-1.5 w-12 rounded bg-white/10" />
                <div className="flex gap-1">
                  <div className="h-1 w-6 rounded bg-white/5" />
                  <div className="h-1 w-6 rounded bg-white/5" />
                </div>
              </div>
              <div className="mb-2 h-8 w-full rounded bg-white/5" />
              <div className="grid grid-cols-3 gap-1">
                <div className="h-4 rounded bg-white/5" />
                <div className="h-4 rounded bg-[var(--color-accent)]/20" />
                <div className="h-4 rounded bg-white/5" />
              </div>
            </div>
          </div>
          <p
            className="mb-1 text-sm font-semibold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {axis.rightLabel}
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)]">{axis.rightDescription}</p>
        </button>
      </div>

      {/* Slider */}
      <div className="mx-auto max-w-md">
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={sliderValue}
          onChange={(e) => setSliderValue(parseFloat(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full accent-[var(--color-accent)]"
          style={{
            background: `linear-gradient(to right, var(--color-bg-tertiary), var(--color-accent-dim) ${sliderValue * 100}%, var(--color-bg-tertiary) ${sliderValue * 100}%)`,
          }}
        />
        <div className="mt-2 flex justify-between">
          <span className="text-xs text-[var(--color-text-tertiary)]">{axis.leftLabel}</span>
          <span className="text-xs text-[var(--color-text-tertiary)]">{axis.rightLabel}</span>
        </div>
      </div>

      {/* Confirm button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => onUpdate(currentAxis, sliderValue)}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition-all duration-200 hover:border-[var(--color-accent)]"
        >
          Confirm &amp; Next Axis
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
