import {
  ArrowRight,
  Blocks,
  Brain,
  Fingerprint,
  Cpu,
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
  ChevronRight,
  Zap,
  MessageSquare,
  Palette,
  Rocket,
  Check,
  Crown,
  Download,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/platform/AnimatedSection";
import { MotionFade } from "@/components/platform/MotionFade";
import { TrackedLink } from "@/components/platform/TrackedLink";

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */

function HeroSection(): React.ReactElement {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      <div className="grid-bg absolute inset-0" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-[var(--color-accent)] opacity-[0.03] blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-[var(--color-teal)] opacity-[0.04] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-32 text-center">
        {/* Badge */}
        <MotionFade
          y={20}
          delay={0.2}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-accent)] bg-[var(--color-accent-glow)] px-4 py-1.5"
        >
          <Zap className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          <span
            className="text-xs font-medium text-[var(--color-accent)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            AI-Powered Website Assembly
          </span>
        </MotionFade>

        {/* Headline */}
        <MotionFade y={30} delay={0.35} duration={0.8}>
          <h1
            className="mb-6 text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="text-[var(--color-text-primary)]">Websites Built by</span>
            <br />
            <span className="bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-light)] to-[var(--color-teal)] bg-clip-text text-transparent">
              Intelligence
            </span>
            <span className="text-[var(--color-text-primary)]">,</span>
            <br />
            <span className="text-[var(--color-text-primary)]">Not Templates</span>
          </h1>
        </MotionFade>

        {/* Subheadline */}
        <MotionFade y={20} delay={0.55} duration={0.7}>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
            Describe your vision. Our AI assembles a professional website from modular components —
            no drag-and-drop, no cookie-cutter layouts. Every site is unique, every decision is
            intelligent.
          </p>
        </MotionFade>

        {/* CTAs */}
        <MotionFade
          y={20}
          delay={0.7}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <TrackedLink
            href="/preview"
            eventName="homepage_cta_clicked"
            eventProperties={{
              cta_type: "secondary",
              cta_text: "Sample Site Preview",
              location: "hero",
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border-accent)] px-8 py-3.5 text-base font-medium text-[var(--color-accent)] transition-colors duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-glow)] hover:text-[var(--color-accent-light)]"
          >
            Sample Site Preview
          </TrackedLink>
          <TrackedLink
            href="/demo"
            eventName="homepage_cta_clicked"
            eventProperties={{ cta_type: "primary", cta_text: "Try the Demo", location: "hero" }}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] px-8 py-3.5 text-base font-semibold text-[var(--color-bg-primary)] transition-transform duration-300 hover:scale-[1.03] hover:shadow-[var(--shadow-glow)]"
          >
            Try the Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </TrackedLink>
        </MotionFade>

        {/* Stats */}
        <MotionFade
          y={0}
          delay={1}
          duration={0.8}
          className="mx-auto mt-20 grid max-w-lg grid-cols-3 gap-8"
        >
          {[
            { value: "24", label: "Components" },
            { value: "7", label: "Theme Presets" },
            { value: "13", label: "Site Types" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl font-bold text-[var(--color-accent)] md:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-[var(--color-text-tertiary)]">{stat.label}</div>
            </div>
          ))}
        </MotionFade>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-[var(--color-bg-primary)] to-transparent" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works Section                                               */
/* ------------------------------------------------------------------ */

const steps = [
  {
    icon: MessageSquare,
    title: "Share Your Vision",
    description:
      "Answer a guided series of questions about your business, goals, and brand personality. No design knowledge required.",
    accent: "var(--color-accent)",
  },
  {
    icon: Cpu,
    title: "AI Assembles",
    description:
      "Our engine selects the perfect components, theme, and layout based on your unique intent profile. No two sites are the same.",
    accent: "var(--color-teal)",
  },
  {
    icon: Palette,
    title: "Review & Refine",
    description:
      "See a live preview with real components and your brand identity applied. Request changes — the system learns from every refinement.",
    accent: "var(--color-accent)",
  },
  {
    icon: Rocket,
    title: "Launch",
    description:
      "Deploy your professional website to the web. Get a blazing-fast, SEO-optimized Next.js site — not a generic page builder output.",
    accent: "var(--color-teal)",
  },
];

function HowItWorksSection(): React.ReactElement {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-[var(--color-bg-secondary)]" />
      <div className="grid-bg absolute inset-0 opacity-50" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <AnimatedSection className="mb-20 text-center">
          <span
            className="mb-4 block text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How It Works
          </span>
          <h2
            className="mb-4 text-3xl font-bold text-[var(--color-text-primary)] md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            From Vision to Website
            <br />
            <span className="text-[var(--color-text-tertiary)]">in Four Steps</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <StaggerItem key={step.title}>
              <div className="group relative h-full">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute top-12 left-full z-0 hidden h-px w-full bg-gradient-to-r from-[var(--color-border)] to-transparent lg:block" />
                )}

                <div className="card-glow relative h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 transition-colors duration-400 hover:border-[var(--color-border-accent)]">
                  {/* Step number */}
                  <div
                    className="absolute -top-3 -right-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      fontFamily: "var(--font-heading)",
                      background: step.accent,
                      color: "var(--color-bg-primary)",
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: `color-mix(in srgb, ${step.accent} 12%, transparent)` }}
                  >
                    <step.icon className="h-6 w-6" style={{ color: step.accent }} />
                  </div>

                  <h3
                    className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {step.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  What Makes Us Different Section                                    */
/* ------------------------------------------------------------------ */

const differentiators = [
  {
    icon: Blocks,
    title: "Not Templates — Assembled",
    description:
      "Every website is composed from a modular library of 24 components with multiple variants. No two sites share the same layout.",
    gradient: "from-[#e8a849]/10 to-[#d4943d]/5",
  },
  {
    icon: Brain,
    title: "Learns & Improves",
    description:
      "Every site built enriches the system. Proven component configurations, theme palettes, and content patterns are preserved and reused.",
    gradient: "from-[#3ecfb4]/10 to-[#2a9f8c]/5",
  },
  {
    icon: Fingerprint,
    title: "Your Brand, Not Ours",
    description:
      "A 6-axis personality capture system ensures your site reflects your unique brand identity — not a generic cookie-cutter style.",
    gradient: "from-[#e8a849]/10 to-[#3ecfb4]/5",
  },
  {
    icon: Cpu,
    title: "AI-Powered Decisions",
    description:
      "Smart component selection, theme generation, and content structuring. The AI handles design decisions so you focus on your business.",
    gradient: "from-[#3ecfb4]/10 to-[#e8a849]/5",
  },
];

function DifferentiatorsSection(): React.ReactElement {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedSection className="mb-20 text-center">
          <span
            className="mb-4 block text-xs font-semibold tracking-[0.2em] text-[var(--color-teal)] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Why EasyWebsiteBuild
          </span>
          <h2
            className="mb-4 text-3xl font-bold text-[var(--color-text-primary)] md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Makes Us
            <br />
            <span className="text-[var(--color-text-tertiary)]">Fundamentally Different</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2" staggerDelay={0.15}>
          {differentiators.map((d) => (
            <StaggerItem key={d.title}>
              <div className="group card-glow relative h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 transition-colors duration-400 hover:border-[var(--color-border-accent)]">
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${d.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative z-10">
                  <d.icon className="mb-5 h-8 w-8 text-[var(--color-accent)]" />
                  <h3
                    className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {d.title}
                  </h3>
                  <p className="leading-relaxed text-[var(--color-text-secondary)]">
                    {d.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Site Types Section                                                 */
/* ------------------------------------------------------------------ */

const siteTypes = [
  { icon: Briefcase, label: "Business", color: "#e8a849" },
  { icon: ShoppingBag, label: "E-commerce", color: "#3ecfb4" },
  { icon: Camera, label: "Portfolio", color: "#c084fc" },
  { icon: CalendarCheck, label: "Booking", color: "#f97316" },
  { icon: PenLine, label: "Blog", color: "#60a5fa" },
  { icon: Globe, label: "Personal", color: "#e8a849" },
  { icon: GraduationCap, label: "Educational", color: "#3ecfb4" },
  { icon: Users, label: "Community", color: "#c084fc" },
  { icon: Heart, label: "Nonprofit", color: "#f97316" },
  { icon: PartyPopper, label: "Event", color: "#60a5fa" },
  { icon: FileText, label: "Landing Page", color: "#e8a849" },
  { icon: LayoutList, label: "Directory", color: "#3ecfb4" },
];

function SiteTypesSection(): React.ReactElement {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-[var(--color-bg-secondary)]" />
      <div className="grid-bg absolute inset-0 opacity-50" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <span
            className="mb-4 block text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Site Types
          </span>
          <h2
            className="mb-4 text-3xl font-bold text-[var(--color-text-primary)] md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Build Any Kind of Website
          </h2>
          <p className="mx-auto max-w-xl text-[var(--color-text-secondary)]">
            From business sites to online stores, portfolios to communities — our modular system
            adapts to any industry and purpose.
          </p>
        </AnimatedSection>

        <StaggerContainer
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          staggerDelay={0.05}
        >
          {siteTypes.map((type) => (
            <StaggerItem key={type.label}>
              <div className="group card-glow relative cursor-default rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 text-center transition-colors duration-300 hover:border-[var(--color-border-accent)]">
                <div
                  className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `color-mix(in srgb, ${type.color} 12%, transparent)` }}
                >
                  <type.icon className="h-5 w-5" style={{ color: type.color }} />
                </div>
                <span
                  className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors group-hover:text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {type.label}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Social Proof Section                                               */
/* ------------------------------------------------------------------ */

const capabilities = [
  {
    stat: "~90s",
    label: "Express Build",
    description:
      "Answer 3 questions and see a fully assembled website preview in under 90 seconds.",
  },
  {
    stat: "24",
    label: "Components",
    description:
      "Hero sections, pricing tables, testimonials, galleries, contact forms — each with multiple variants.",
  },
  {
    stat: "6-Axis",
    label: "Brand Personality",
    description:
      "Our personality capture system ensures every site reflects your unique brand identity, not a generic style.",
  },
];

function CapabilitiesSection(): React.ReactElement {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <span
            className="mb-4 block text-xs font-semibold tracking-[0.2em] text-[var(--color-teal)] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            See It In Action
          </span>
          <h2
            className="text-3xl font-bold text-[var(--color-text-primary)] md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Built for Speed &amp; Quality
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3" staggerDelay={0.15}>
          {capabilities.map((c) => (
            <StaggerItem key={c.label}>
              <div className="gradient-border flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
                <div
                  className="mb-4 text-4xl font-bold text-[var(--color-accent)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {c.stat}
                </div>
                <h3
                  className="mb-3 text-lg font-semibold text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {c.label}
                </h3>
                <p className="flex-1 leading-relaxed text-[var(--color-text-secondary)]">
                  {c.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Final CTA Section                                                  */
/* ------------------------------------------------------------------ */

function CTASection(): React.ReactElement {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-[var(--color-bg-secondary)]" />
      <div className="grid-bg absolute inset-0 opacity-50" />

      {/* Glowing orbs */}
      <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-[0.04] blur-[120px]" />

      <AnimatedSection className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h2
          className="mb-6 text-3xl font-bold text-[var(--color-text-primary)] md:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ready to Build Something
          <br />
          <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-teal)] bg-clip-text text-transparent">
            Amazing?
          </span>
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-lg text-[var(--color-text-secondary)]">
          Experience the future of website creation. Answer a few questions and watch as AI
          assembles your perfect site in real time.
        </p>
        <TrackedLink
          href="/demo"
          eventName="homepage_cta_clicked"
          eventProperties={{
            cta_type: "primary",
            cta_text: "Start Building — It's Free",
            location: "footer_cta",
          }}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] px-10 py-4 text-lg font-semibold text-[var(--color-bg-primary)] transition-transform duration-300 hover:scale-[1.03] hover:shadow-[var(--shadow-glow)]"
        >
          Start Building — It&apos;s Free
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </TrackedLink>
      </AnimatedSection>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing Section                                                     */
/* ------------------------------------------------------------------ */

const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Try it out — no credit card required",
    features: [
      "Full AI-powered generation",
      "Customization sidebar",
      "7 theme presets",
      "Share preview links",
      "ZIP export (with badge)",
    ],
    cta: "Start Free",
    ctaHref: "/demo",
    icon: Sparkles as LucideIcon,
    accentColor: "var(--color-text-secondary)",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$12",
    period: "/mo",
    description: "Go live with your own custom domain",
    features: [
      "Everything in Free",
      "Custom domain hosting",
      "Clean export (no badge)",
      "Working contact form",
      "Email support",
    ],
    cta: "Go Live",
    ctaHref: "/demo",
    icon: Globe as LucideIcon,
    accentColor: "#3ecfb4",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "Full creative control with AI assistance",
    features: [
      "Everything in Starter",
      "AI Design Chat (unlimited)",
      "All 14 font pairings",
      "Full color palette control",
      "CSS effects library",
      "Priority support",
    ],
    cta: "Go Pro",
    ctaHref: "/demo",
    icon: Crown as LucideIcon,
    accentColor: "var(--color-accent)",
    highlighted: true,
  },
  {
    name: "Own It",
    price: "$99",
    period: "once",
    description: "Full source code — deploy anywhere forever",
    features: [
      "All Pro features",
      "Full source code export",
      "Deploy guide included",
      "No monthly fees",
      "Self-host anywhere",
    ],
    cta: "Own Your Site",
    ctaHref: "/demo",
    icon: Download as LucideIcon,
    accentColor: "#c084fc",
    highlighted: false,
  },
];

function PricingSection(): React.ReactElement {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-[var(--gradient-section)]" />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <span
            className="mb-4 inline-block text-xs font-bold tracking-[0.2em] text-[var(--color-accent)] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Simple Pricing
          </span>
          <h2
            className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Start free, go live when ready
          </h2>
          <p className="mx-auto max-w-xl text-base text-[var(--color-text-secondary)]">
            Every plan includes full AI-powered site generation. Upgrade when you want a real
            domain.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING_TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <StaggerItem
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-6 transition-colors ${
                  tier.highlighted
                    ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5"
                    : "border-[var(--color-border)] bg-[var(--color-bg-card)]"
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent)] px-3 py-0.5 text-[10px] font-bold tracking-wider text-[var(--color-bg-primary)] uppercase">
                    Most Popular
                  </span>
                )}

                <div className="mb-4 flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${tier.accentColor} 12%, transparent)`,
                    }}
                  >
                    <Icon className="h-[18px] w-[18px]" style={{ color: tier.accentColor }} />
                  </div>
                  <span
                    className="text-sm font-bold text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {tier.name}
                  </span>
                </div>

                <div className="mb-3">
                  <span
                    className="text-3xl font-bold text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-[var(--color-text-tertiary)]">{tier.period}</span>
                  )}
                </div>

                <p className="mb-5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  {tier.description}
                </p>

                <ul className="mb-6 flex-1 space-y-2.5">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]"
                    >
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        style={{ color: tier.accentColor }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <TrackedLink
                  href={tier.ctaHref}
                  eventName="cta_click"
                  eventProperties={{
                    cta_type: "pricing",
                    cta_text: tier.cta,
                    tier: tier.name,
                  }}
                  className={`block rounded-xl py-2.5 text-center text-sm font-semibold transition-all ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] text-[var(--color-bg-primary)] hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
                      : "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-border-accent)]"
                  }`}
                >
                  {tier.cta}
                </TrackedLink>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Export                                                         */
/* ------------------------------------------------------------------ */

export default function HomePage(): React.ReactElement {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <DifferentiatorsSection />
      <SiteTypesSection />
      <PricingSection />
      <CapabilitiesSection />
      <CTASection />
    </>
  );
}
