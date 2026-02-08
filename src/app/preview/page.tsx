"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { LUXURY_DARK, MODERN_CLEAN, WARM_PROFESSIONAL, THEME_PRESETS } from "@/lib/theme/presets";
import { generateThemeFromVector } from "@/lib/theme/generate-theme";
import type { PersonalityVector } from "@/lib/theme/theme.types";
import type { ThemeTokens } from "@/lib/theme/theme.types";

import { NavSticky } from "@/components/library/navigation/nav-sticky";
import { HeroCentered } from "@/components/library/hero/hero-centered";
import { ContentFeatures } from "@/components/library/content/content-features";
import { ContentSplit } from "@/components/library/content/content-split";
import { ProofTestimonials } from "@/components/library/social-proof/proof-testimonials";
import { ContentText } from "@/components/library/content/content-text";
import { CtaBanner } from "@/components/library/cta/cta-banner";
import { FormContact } from "@/components/library/forms/form-contact";
import { FooterStandard } from "@/components/library/footer/footer-standard";

/* ────────────────────────────────────────────────────────────
 * Placeholder content for the fictional business "Meridian"
 * ──────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#features" },
  { label: "Work", href: "#work" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const NAV_CTA = { text: "Get Started", href: "#contact", variant: "primary" as const };

const FEATURES = [
  {
    icon: "Compass",
    title: "Strategic Planning",
    description:
      "We map the journey from concept to launch with a clear, data-driven roadmap tailored to your goals.",
  },
  {
    icon: "Palette",
    title: "Brand Design",
    description:
      "Crafting visual identities that resonate with your audience and stand out in a crowded market.",
  },
  {
    icon: "Code",
    title: "Development",
    description:
      "Pixel-perfect, performant web experiences built with modern technologies and best practices.",
  },
  {
    icon: "TrendingUp",
    title: "Growth Marketing",
    description:
      "Data-backed strategies that drive organic traffic, engagement, and conversions at scale.",
  },
  {
    icon: "Shield",
    title: "Security & Compliance",
    description:
      "Enterprise-grade security practices and regulatory compliance baked into every project.",
  },
  {
    icon: "Headphones",
    title: "Ongoing Support",
    description:
      "Dedicated support team available to maintain, optimize, and evolve your digital presence.",
  },
];

const SPLIT_SECTIONS = [
  {
    headline: "We Build Brands That Endure",
    body: "Our approach combines deep strategic thinking with world-class creative execution. Every brand we touch is built to adapt, grow, and resonate with its audience for years to come.",
    image: {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      alt: "Team collaboration",
    },
    ctaText: "Learn more about our process",
    ctaLink: "#about",
  },
  {
    headline: "Technology That Scales With You",
    body: "From startup MVPs to enterprise platforms, we architect solutions that grow with your business. Our tech stack choices are deliberate, future-proof, and performance-obsessed.",
    image: {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      alt: "Technology dashboard",
    },
    ctaText: "See our tech stack",
    ctaLink: "#features",
  },
  {
    headline: "Results You Can Measure",
    body: "We don't just build beautiful things — we build things that perform. Every project includes analytics integration, conversion tracking, and regular performance reviews.",
    image: {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      alt: "Analytics dashboard",
    },
    ctaText: "View case studies",
    ctaLink: "#testimonials",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Meridian transformed our online presence completely. The attention to detail and strategic thinking set them apart from every agency we've worked with.",
    name: "Sarah Chen",
    role: "CEO",
    company: "Vanta Labs",
    rating: 5,
  },
  {
    quote:
      "Working with the Meridian team felt like having an in-house creative department. They understood our brand vision from day one and executed flawlessly.",
    name: "Marcus Rivera",
    role: "Founder",
    company: "Atlas & Co",
    rating: 5,
  },
  {
    quote:
      "Our conversion rate increased 340% within the first quarter of launching the new site. The ROI speaks for itself — this was the best investment we've made.",
    name: "Emily Nakamura",
    role: "CMO",
    company: "Redwood Health",
    rating: 5,
  },
  {
    quote:
      "They didn't just build us a website — they built us a growth engine. The strategic framework they put in place continues to drive results months later.",
    name: "James Okafor",
    role: "VP Marketing",
    company: "Prism Technologies",
    rating: 5,
  },
  {
    quote:
      "Meridian brought a level of polish and sophistication that we didn't think was possible within our budget. Incredible value for the quality delivered.",
    name: "Lisa Petrov",
    role: "Director",
    company: "Northlight Studio",
    rating: 5,
  },
  {
    quote:
      "The team's ability to translate our complex services into clear, compelling storytelling was remarkable. Our clients finally understand what we do.",
    name: "David Kim",
    role: "Partner",
    company: "Apex Consulting",
    rating: 4,
  },
];

const FOOTER_COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Brand Strategy", href: "#" },
      { label: "Web Design", href: "#" },
      { label: "Development", href: "#" },
      { label: "SEO & Marketing", href: "#" },
      { label: "Content Strategy", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Our Work", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Case Studies", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Brand Guidelines", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
];

const SOCIAL_LINKS = [
  { platform: "twitter", url: "#" },
  { platform: "linkedin", url: "#" },
  { platform: "github", url: "#" },
  { platform: "instagram", url: "#" },
];

/* ────────────────────────────────────────────────────────────
 * Theme selector panel
 * ──────────────────────────────────────────────────────────── */

const AXIS_LABELS = [
  "Minimal ↔ Rich",
  "Playful ↔ Serious",
  "Warm ↔ Cool",
  "Light ↔ Bold",
  "Classic ↔ Modern",
  "Calm ↔ Dynamic",
];

function ThemeSelector({
  activePreset,
  onSelectPreset,
  customVector,
  onChangeVector,
  onUseCustom,
  isCustom,
  isMinimized,
  onToggleMinimize,
}: {
  activePreset: string;
  onSelectPreset: (id: string) => void;
  customVector: PersonalityVector;
  onChangeVector: (axis: number, value: number) => void;
  onUseCustom: () => void;
  isCustom: boolean;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}) {
  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={onToggleMinimize}
        className="fixed top-0 right-0 z-[100] m-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 shadow-2xl backdrop-blur-xl transition-all hover:scale-105"
        style={{
          backgroundColor: "rgba(15, 15, 20, 0.92)",
          borderColor: "rgba(255,255,255,0.15)",
          fontFamily: "'Outfit', sans-serif",
          color: "#ccc",
          cursor: "pointer",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
        <span className="text-sm font-medium">Theme</span>
      </button>
    );
  }

  return (
    <div
      className="fixed top-0 right-0 z-[100] m-4 flex flex-col gap-4 rounded-xl border p-5 shadow-2xl backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(15, 15, 20, 0.92)",
        borderColor: "rgba(255,255,255,0.1)",
        maxWidth: "320px",
        width: "100%",
        fontFamily: "'Outfit', sans-serif",
        color: "#e0e0e0",
      }}
    >
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "#999", fontSize: "11px", letterSpacing: "0.12em" }}
        >
          Theme Preview
        </h3>
        <button
          type="button"
          onClick={onToggleMinimize}
          className="flex h-6 w-6 items-center justify-center rounded-md transition-colors"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "#777",
            cursor: "pointer",
            border: "none",
          }}
          title="Minimize panel"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-col gap-2">
        {THEME_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset.id)}
            className="rounded-lg px-4 py-2.5 text-left text-sm transition-all"
            style={{
              backgroundColor:
                activePreset === preset.id && !isCustom ? "rgba(255,255,255,0.12)" : "transparent",
              border:
                activePreset === preset.id && !isCustom
                  ? "1px solid rgba(255,255,255,0.2)"
                  : "1px solid transparent",
              cursor: "pointer",
              color: activePreset === preset.id && !isCustom ? "#fff" : "#aaa",
            }}
          >
            <div className="font-medium">{preset.name}</div>
            <div className="mt-0.5 text-xs" style={{ color: "#777", lineHeight: 1.4 }}>
              {preset.description.slice(0, 80)}...
            </div>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

      {/* Custom vector sliders */}
      <button
        type="button"
        onClick={onUseCustom}
        className="rounded-lg px-4 py-2 text-left text-sm transition-all"
        style={{
          backgroundColor: isCustom ? "rgba(255,255,255,0.12)" : "transparent",
          border: isCustom ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
          cursor: "pointer",
          color: isCustom ? "#fff" : "#aaa",
          fontWeight: 500,
        }}
      >
        Custom Vector
      </button>

      {isCustom && (
        <div className="flex flex-col gap-3">
          {AXIS_LABELS.map((label, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#888" }}>
                  {label}
                </span>
                <span className="font-mono text-xs" style={{ color: "#666" }}>
                  {customVector[i].toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={customVector[i] * 100}
                onChange={(e) => onChangeVector(i, parseInt(e.target.value) / 100)}
                className="w-full accent-blue-500"
                style={{ height: "4px" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Preview Page
 * ──────────────────────────────────────────────────────────── */

export default function PreviewPage() {
  const [activePreset, setActivePreset] = useState(LUXURY_DARK.id);
  const [isCustom, setIsCustom] = useState(false);
  const [customVector, setCustomVector] = useState<PersonalityVector>([
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
  ]);
  const [isMinimized, setIsMinimized] = useState(false);

  const tokens: ThemeTokens = useMemo(() => {
    if (isCustom) {
      return generateThemeFromVector(customVector);
    }
    const preset = THEME_PRESETS.find((p) => p.id === activePreset);
    return preset?.tokens ?? LUXURY_DARK.tokens;
  }, [activePreset, isCustom, customVector]);

  const handleSelectPreset = (id: string) => {
    setActivePreset(id);
    setIsCustom(false);
  };

  const handleChangeVector = (axis: number, value: number) => {
    setCustomVector((prev) => {
      const next = [...prev] as PersonalityVector;
      next[axis] = value;
      return next;
    });
  };

  const handleUseCustom = () => {
    setIsCustom(true);
  };

  return (
    <>
      {/* Exit button */}
      <Link
        href="/"
        className="fixed top-0 left-0 z-[100] m-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 shadow-2xl backdrop-blur-xl transition-all hover:scale-105"
        style={{
          backgroundColor: "rgba(15, 15, 20, 0.92)",
          borderColor: "rgba(255,255,255,0.15)",
          fontFamily: "'Outfit', sans-serif",
          color: "#ccc",
          textDecoration: "none",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back to Site</span>
      </Link>

      {/* Theme selector panel */}
      <ThemeSelector
        activePreset={activePreset}
        onSelectPreset={handleSelectPreset}
        customVector={customVector}
        onChangeVector={handleChangeVector}
        onUseCustom={handleUseCustom}
        isCustom={isCustom}
        isMinimized={isMinimized}
        onToggleMinimize={() => setIsMinimized((prev) => !prev)}
      />

      {/* Themed site preview */}
      <ThemeProvider tokens={tokens}>
        <div style={{ backgroundColor: "var(--color-background)", minHeight: "100vh" }}>
          {/* Navigation */}
          <NavSticky logoText="Meridian" links={NAV_LINKS} cta={NAV_CTA} variant="transparent" />

          {/* Hero */}
          <HeroCentered
            id="hero"
            headline="We Build Digital Experiences That Matter"
            subheadline="Meridian is a strategic design and technology studio that helps ambitious brands create unforgettable digital presences."
            ctaPrimary={{ text: "Start a Project", href: "#contact" }}
            ctaSecondary={{ text: "View Our Work", href: "#work", variant: "outline" }}
            badge="Award-Winning Studio"
            variant="gradient-bg"
            height="viewport"
          />

          {/* Features */}
          <ContentFeatures
            id="features"
            headline="Everything You Need to Grow"
            subheadline="From strategy to execution, we provide end-to-end digital services that drive real business results."
            features={FEATURES}
            columns={3}
          />

          {/* Split content */}
          <ContentSplit id="work" sections={SPLIT_SECTIONS} imageStyle="rounded" />

          {/* Testimonials */}
          <ProofTestimonials
            id="testimonials"
            headline="What Our Clients Say"
            testimonials={TESTIMONIALS}
            showRating
          />

          {/* Text block */}
          <ContentText
            id="about"
            eyebrow="Our Philosophy"
            headline="Craft Over Convention"
            body="We believe great digital experiences are born at the intersection of strategic thinking and creative courage. Every pixel, every interaction, every word is deliberate. We don't follow trends — we set them. Our work is driven by a simple belief: that the best brands deserve digital experiences as refined and thoughtful as the products and services they offer."
            textAlign="center"
            maxWidth="medium"
            spacing="xl"
          />

          {/* CTA Banner */}
          <CtaBanner
            headline="Ready to Transform Your Digital Presence?"
            subheadline="Let's build something extraordinary together. Start with a free strategy consultation."
            ctaPrimary={{ text: "Book a Consultation", href: "#contact" }}
            ctaSecondary={{ text: "View Pricing", href: "#" }}
            backgroundVariant="gradient"
            variant="contained"
          />

          {/* Contact Form */}
          <FormContact
            id="contact"
            headline="Start a Conversation"
            subheadline="Tell us about your project and we'll get back to you within 24 hours."
          />

          {/* Footer */}
          <FooterStandard
            logoText="Meridian"
            tagline="Strategic design and technology studio crafting unforgettable digital experiences."
            columns={FOOTER_COLUMNS}
            socialLinks={SOCIAL_LINKS}
            copyright={`© ${new Date().getFullYear()} Meridian Studio. All rights reserved.`}
            bottomLinks={[
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Cookies", href: "#" },
            ]}
          />
        </div>
      </ThemeProvider>
    </>
  );
}
