"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { LUXURY_DARK, THEME_PRESETS } from "@/lib/theme/presets";
import { generateThemeFromVector } from "@/lib/theme/generate-theme";
import type { PersonalityVector } from "@/lib/theme/theme.types";
import type { ThemeTokens } from "@/lib/theme/theme.types";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";

import { NavSticky } from "@/components/library/navigation/nav-sticky";
import { HeroCentered } from "@/components/library/hero/hero-centered";
import { ContentFeatures } from "@/components/library/content/content-features";
import { ContentSplit } from "@/components/library/content/content-split";
import { ContentStats } from "@/components/library/content/content-stats";
import { ContentAccordion } from "@/components/library/content/content-accordion";
import { ContentTimeline } from "@/components/library/content/content-timeline";
import { ContentLogos } from "@/components/library/content/content-logos";
import { ProofTestimonials } from "@/components/library/social-proof/proof-testimonials";
import { ContentText } from "@/components/library/content/content-text";
import { CtaBanner } from "@/components/library/cta/cta-banner";
import { FormContact } from "@/components/library/forms/form-contact";
import { FooterStandard } from "@/components/library/footer/footer-standard";
import { TeamGrid } from "@/components/library/team/team-grid";
import { CommerceServices } from "@/components/library/commerce/commerce-services";
import { MediaGallery } from "@/components/library/media/media-gallery";

/* ────────────────────────────────────────────────────────────
 * Placeholder content for the fictional business "Meridian"
 * ──────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#gallery" },
  { label: "Team", href: "#team" },
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

const STATS = [
  { value: 340, label: "Projects Delivered", suffix: "+" },
  { value: 98, label: "Client Satisfaction", suffix: "%" },
  { value: 12, label: "Years in Business" },
  { value: 45, label: "Team Members" },
];

const TEAM_MEMBERS = [
  {
    name: "Elena Vasquez",
    role: "Founder & Creative Director",
    bio: "14 years of crafting digital experiences for Fortune 500 brands and ambitious startups.",
    image: {
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      alt: "Elena Vasquez",
    },
    socials: [
      { platform: "linkedin", url: "#" },
      { platform: "twitter", url: "#" },
    ],
  },
  {
    name: "Marcus Chen",
    role: "Head of Engineering",
    bio: "Former Google engineer with a passion for performant, accessible web experiences.",
    image: {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      alt: "Marcus Chen",
    },
    socials: [
      { platform: "github", url: "#" },
      { platform: "linkedin", url: "#" },
    ],
  },
  {
    name: "Priya Sharma",
    role: "Strategy Lead",
    bio: "Bridges the gap between business goals and creative execution with data-driven insights.",
    image: {
      src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face",
      alt: "Priya Sharma",
    },
    socials: [{ platform: "linkedin", url: "#" }],
  },
  {
    name: "Jordan Brooks",
    role: "Design Director",
    bio: "Award-winning designer specializing in brand systems and design language creation.",
    image: {
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      alt: "Jordan Brooks",
    },
    socials: [
      { platform: "dribbble", url: "#" },
      { platform: "twitter", url: "#" },
    ],
  },
];

const SERVICES = [
  {
    name: "Brand Strategy",
    description: "Comprehensive brand positioning, messaging frameworks, and competitive analysis.",
    price: "$15K",
    icon: "Compass",
  },
  {
    name: "Web Design & Dev",
    description:
      "Custom websites built with modern tech, optimized for performance and conversion.",
    price: "$25K",
    icon: "Code",
    featured: true,
  },
  {
    name: "Growth Marketing",
    description: "Data-driven marketing strategies that drive qualified traffic and conversions.",
    price: "$8K/mo",
    icon: "TrendingUp",
  },
  {
    name: "Ongoing Retainer",
    description:
      "Dedicated support, optimization, and continuous improvement for your digital presence.",
    price: "$5K/mo",
    icon: "Shield",
  },
];

const CLIENT_LOGOS = [
  { name: "Vanta Labs" },
  { name: "Atlas & Co" },
  { name: "Redwood Health" },
  { name: "Prism Tech" },
  { name: "Northlight" },
  { name: "Apex Consulting" },
  { name: "Horizon Media" },
  { name: "Ember Studios" },
];

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    alt: "Dashboard design for Vanta Labs",
    caption: "Vanta Labs Dashboard",
    category: "Web Design",
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
    alt: "Brand workshop session",
    caption: "Strategy Workshop",
    category: "Branding",
  },
  {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    alt: "Analytics platform interface",
    caption: "Prism Analytics Platform",
    category: "Web Design",
  },
  {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop",
    alt: "Team planning sprint",
    caption: "Sprint Planning",
    category: "Process",
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
    alt: "Client presentation",
    caption: "Atlas & Co Rebrand",
    category: "Branding",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    alt: "Modern office workspace",
    caption: "Meridian HQ",
    category: "Process",
  },
];

const TIMELINE_ITEMS = [
  {
    date: "2012",
    title: "Studio Founded",
    description:
      "Elena Vasquez launches Meridian from a shared coworking space with a vision for design-driven digital transformation.",
  },
  {
    date: "2015",
    title: "First Major Client",
    description:
      "Partnered with Redwood Health on a complete digital overhaul — the project that put Meridian on the map.",
  },
  {
    date: "2018",
    title: "Team Grows to 20",
    description:
      "Expanded into a dedicated studio space and brought on specialists in engineering, strategy, and growth.",
  },
  {
    date: "2021",
    title: "Award-Winning Year",
    description:
      "Recognized with three Webby Awards and named a top digital agency by Fast Company.",
  },
  {
    date: "2024",
    title: "Global Reach",
    description:
      "Now serving clients across 15 countries with a 45-person team delivering world-class digital experiences.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What does a typical engagement look like?",
    answer:
      "<p>Every project starts with a discovery phase where we deeply understand your business, goals, and audience. From there, we move into strategy, design, development, and launch — with checkpoints and feedback loops at every stage.</p>",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "<p>Timelines vary based on scope. A brand strategy project typically takes 4-6 weeks, while a full website design and development project runs 8-14 weeks. We'll provide a detailed timeline during our proposal phase.</p>",
  },
  {
    question: "Do you work with startups or only enterprise clients?",
    answer:
      "<p>We work with both. Our sweet spot is ambitious companies — whether that's a funded startup ready to make a splash or an established brand ready for a digital transformation. What matters most is alignment on values and vision.</p>",
  },
  {
    question: "What technologies do you use?",
    answer:
      "<p>Our stack varies by project needs, but we're strong advocates for Next.js, React, TypeScript, and modern JAMstack architectures. For content management, we work with Sanity, Contentful, and custom solutions. We always choose the right tool for the job.</p>",
  },
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
  isMobile,
}: {
  activePreset: string;
  onSelectPreset: (id: string) => void;
  customVector: PersonalityVector;
  onChangeVector: (axis: number, value: number) => void;
  onUseCustom: () => void;
  isCustom: boolean;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  isMobile: boolean;
}) {
  /* ── Shared: Preset button ─────────────────────────── */
  const presetButton = (preset: (typeof THEME_PRESETS)[number], compact: boolean) => (
    <button
      key={preset.id}
      type="button"
      onClick={() => onSelectPreset(preset.id)}
      className={
        compact
          ? "shrink-0 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-all"
          : "rounded-lg px-4 py-2.5 text-left text-sm transition-all"
      }
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
      {compact ? (
        preset.name
      ) : (
        <>
          <div className="font-medium">{preset.name}</div>
          <div className="mt-0.5 text-xs" style={{ color: "#777", lineHeight: 1.4 }}>
            {preset.description.slice(0, 80)}...
          </div>
        </>
      )}
    </button>
  );

  /* ── Shared: Custom vector sliders ─────────────────── */
  const customVectorSection = (
    <>
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
    </>
  );

  /* ── Minimized state ───────────────────────────────── */
  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={onToggleMinimize}
        className={`fixed z-[100] flex items-center gap-2 rounded-xl border px-4 py-2.5 shadow-2xl backdrop-blur-xl transition-all hover:scale-105 ${
          isMobile ? "right-4 bottom-4" : "top-0 right-0 m-4"
        }`}
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

  /* ── Mobile: Bottom sheet ──────────────────────────── */
  if (isMobile) {
    return (
      <>
        {/* Backdrop — tap to close */}
        <div className="fixed inset-0 z-[99] bg-black/40" onClick={onToggleMinimize} />
        {/* Bottom sheet */}
        <div
          className="fixed right-0 bottom-0 left-0 z-[100] flex flex-col overflow-hidden rounded-t-2xl border-t shadow-2xl backdrop-blur-xl"
          style={{
            backgroundColor: "rgba(15, 15, 20, 0.96)",
            borderColor: "rgba(255,255,255,0.1)",
            maxHeight: "60vh",
            fontFamily: "'Outfit', sans-serif",
            color: "#e0e0e0",
          }}
        >
          {/* Drag handle */}
          <div className="flex justify-center py-3">
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3">
            <h3
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "#999", fontSize: "11px", letterSpacing: "0.12em" }}
            >
              Theme Preview
            </h3>
            <button
              type="button"
              onClick={onToggleMinimize}
              className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                color: "#777",
                cursor: "pointer",
                border: "none",
              }}
              title="Close panel"
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
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 pb-6">
            {/* Horizontal scrolling presets */}
            <div className="-mx-5 mb-3 flex gap-2 overflow-x-auto px-5 pb-2">
              {THEME_PRESETS.map((preset) => presetButton(preset, true))}
            </div>

            {/* Divider */}
            <div className="my-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

            {/* Custom vector */}
            {customVectorSection}
          </div>
        </div>
      </>
    );
  }

  /* ── Desktop: Side panel (unchanged) ───────────────── */
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
        {THEME_PRESETS.map((preset) => presetButton(preset, false))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

      {/* Custom vector */}
      {customVectorSection}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Preview Page
 * ──────────────────────────────────────────────────────────── */

export default function PreviewPage() {
  const isMobile = useIsMobile();
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
        className={`fixed top-0 left-0 z-[100] flex items-center gap-2 rounded-xl border shadow-2xl backdrop-blur-xl transition-all hover:scale-105 ${
          isMobile ? "m-2 px-3 py-2" : "m-4 px-4 py-2.5"
        }`}
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
        isMobile={isMobile}
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

          {/* Client Logos */}
          <ContentLogos
            headline="Trusted by Industry Leaders"
            logos={CLIENT_LOGOS}
            variant="scroll"
          />

          {/* Stats */}
          <ContentStats
            headline="Meridian by the Numbers"
            subheadline="A decade of measurable impact for our clients"
            stats={STATS}
            variant="animated-counter"
          />

          {/* Features */}
          <ContentFeatures
            id="features"
            headline="Everything You Need to Grow"
            subheadline="From strategy to execution, we provide end-to-end digital services that drive real business results."
            features={FEATURES}
            columns={3}
          />

          {/* Services & Pricing */}
          <CommerceServices
            id="services"
            headline="Our Services"
            subheadline="Flexible engagement models tailored to your needs and budget"
            services={SERVICES}
            variant="card-grid"
          />

          {/* Split content */}
          <ContentSplit id="work" sections={SPLIT_SECTIONS} imageStyle="rounded" />

          {/* Gallery */}
          <MediaGallery
            id="gallery"
            headline="Selected Work"
            subheadline="A glimpse into the projects that define our craft"
            images={GALLERY_IMAGES}
            variant="lightbox"
            columns={3}
            showCaptions
            enableFilter
          />

          {/* Timeline */}
          <ContentTimeline
            headline="Our Journey"
            subheadline="From a two-person studio to an award-winning agency"
            items={TIMELINE_ITEMS}
            variant="alternating"
          />

          {/* Team */}
          <TeamGrid
            id="team"
            headline="Meet the Team"
            subheadline="The people behind the pixels"
            members={TEAM_MEMBERS}
            variant="cards"
          />

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

          {/* FAQ */}
          <ContentAccordion
            headline="Frequently Asked Questions"
            subheadline="Everything you need to know about working with Meridian"
            items={FAQ_ITEMS}
            variant="bordered"
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
