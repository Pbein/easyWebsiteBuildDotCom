"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  Star,
  ChevronRight,
  Zap,
  MessageSquare,
  Palette,
  Rocket,
} from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/platform/AnimatedSection";

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */

function HeroSection(): React.ReactElement {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      <div className="absolute inset-0 grid-bg" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--color-accent)] opacity-[0.03] blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--color-teal)] opacity-[0.04] blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border-accent)] bg-[var(--color-accent-glow)] mb-8"
        >
          <Zap className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          <span className="text-xs font-medium text-[var(--color-accent)]" style={{ fontFamily: "var(--font-heading)" }}>
            AI-Powered Website Assembly
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
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
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Describe your vision. Our AI assembles a professional website from modular
          components — no drag-and-drop, no cookie-cutter layouts. Every site is
          unique, every decision is intelligent.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/demo"
            className="group inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] text-[var(--color-bg-primary)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-[1.03]"
          >
            Try the Demo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-tertiary)] transition-all duration-300"
          >
            Read the Docs
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "50+", label: "Components" },
            { value: "10", label: "Theme Presets" },
            { value: "13", label: "Site Types" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl md:text-3xl font-bold text-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-[var(--color-text-tertiary)] mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--color-bg-primary)] to-transparent" />
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
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--color-bg-secondary)]" />
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4 block"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How It Works
          </span>
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            From Vision to Website
            <br />
            <span className="text-[var(--color-text-tertiary)]">in Four Steps</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <StaggerItem key={step.title}>
              <div className="relative group h-full">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-[var(--color-border)] to-transparent z-0" />
                )}

                <div className="relative h-full p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-accent)] transition-all duration-400 card-glow">
                  {/* Step number */}
                  <div
                    className="absolute -top-3 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
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
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `color-mix(in srgb, ${step.accent} 12%, transparent)` }}
                  >
                    <step.icon className="w-6 h-6" style={{ color: step.accent }} />
                  </div>

                  <h3
                    className="text-lg font-semibold text-[var(--color-text-primary)] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
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
      "Every website is composed from a modular library of 50+ components with multiple variants. No two sites share the same layout.",
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
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-teal)] mb-4 block"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Why EasyWebsiteBuild
          </span>
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Makes Us
            <br />
            <span className="text-[var(--color-text-tertiary)]">Fundamentally Different</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.15}>
          {differentiators.map((d) => (
            <StaggerItem key={d.title}>
              <div className="group relative p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-accent)] transition-all duration-400 card-glow h-full">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${d.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <d.icon className="w-8 h-8 text-[var(--color-accent)] mb-5" />
                  <h3
                    className="text-xl font-semibold text-[var(--color-text-primary)] mb-3"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {d.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">
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
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--color-bg-secondary)]" />
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4 block"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Site Types
          </span>
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Build Any Kind of Website
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            From business sites to online stores, portfolios to communities — our
            modular system adapts to any industry and purpose.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" staggerDelay={0.05}>
          {siteTypes.map((type) => (
            <StaggerItem key={type.label}>
              <div className="group relative p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-accent)] transition-all duration-300 text-center card-glow cursor-default">
                <div
                  className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `color-mix(in srgb, ${type.color} 12%, transparent)` }}
                >
                  <type.icon className="w-5 h-5" style={{ color: type.color }} />
                </div>
                <span
                  className="text-sm font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors"
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

const testimonials = [
  {
    quote:
      "The site it assembled for my med spa looked like it cost $15k. The AI understood my luxury brand perfectly from just a few questions.",
    name: "Dr. Sarah Chen",
    role: "Founder, Lumiere Med Spa",
    rating: 5,
  },
  {
    quote:
      "I've used Squarespace, Wix, and WordPress. This is the first builder that actually produced something that doesn't look like a template.",
    name: "Marcus Rivera",
    role: "Photographer & Creative Director",
    rating: 5,
  },
  {
    quote:
      "Got my bakery website live in under 20 minutes. The brand personality quiz really nailed the warm, inviting feel I was going for.",
    name: "Emma Thornton",
    role: "Owner, Golden Crust Bakery",
    rating: 5,
  },
];

function SocialProofSection(): React.ReactElement {
  return (
    <section className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-teal)] mb-4 block"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Early Access Feedback
          </span>
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Loved by Early Users
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.15}>
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] h-full flex flex-col gradient-border">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[var(--color-accent)] text-[var(--color-accent)]"
                    />
                  ))}
                </div>

                <p className="text-[var(--color-text-secondary)] leading-relaxed flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div>
                  <p
                    className="text-sm font-semibold text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {t.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{t.role}</p>
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
/*  Final CTA Section                                                  */
/* ------------------------------------------------------------------ */

function CTASection(): React.ReactElement {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--color-bg-secondary)]" />
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Glowing orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-accent)] opacity-[0.04] blur-[120px]" />

      <AnimatedSection className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2
          className="text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ready to Build Something
          <br />
          <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-teal)] bg-clip-text text-transparent">
            Amazing?
          </span>
        </h2>
        <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-xl mx-auto">
          Experience the future of website creation. Answer a few questions and watch
          as AI assembles your perfect site in real time.
        </p>
        <Link
          href="/demo"
          className="group inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] text-[var(--color-bg-primary)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-[1.03]"
        >
          Start Building — It&apos;s Free
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </AnimatedSection>
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
      <SocialProofSection />
      <CTASection />
    </>
  );
}
