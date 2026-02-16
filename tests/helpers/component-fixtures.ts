// tests/helpers/component-fixtures.ts
//
// Factory functions for creating minimal valid props for each of the 24
// component types in the library plus the Section layout wrapper.
// Use these in unit/integration tests to avoid repeating fixture data.
//
// Every factory returns the minimum set of fields required by its interface
// and accepts an optional `overrides` parameter (Partial<Props>) that is
// spread on top, so callers can selectively replace any field.

import type { ReactNode } from "react";

import type {
  NavStickyProps,
  HeroCenteredProps,
  HeroSplitProps,
  HeroVideoProps,
  ContentFeaturesProps,
  ContentSplitProps,
  ContentTextProps,
  ContentStatsProps,
  ContentAccordionProps,
  ContentTimelineProps,
  ContentLogosProps,
  ContentStepsProps,
  ContentComparisonProps,
  ContentMapProps,
  BlogPreviewProps,
  CommerceServicesProps,
  PricingTableProps,
  ProofTestimonialsProps,
  ProofBeforeAfterProps,
  TeamGridProps,
  MediaGalleryProps,
  CtaBannerProps,
  FormContactProps,
  FooterStandardProps,
  SectionProps,
} from "@/components/library";

/* ── Navigation ─────────────────────────────────────────────── */

export function createNavStickyProps(overrides?: Partial<NavStickyProps>): NavStickyProps {
  return {
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    logoText: "TestBrand",
    ...overrides,
  };
}

/* ── Hero ────────────────────────────────────────────────────── */

export function createHeroCenteredProps(overrides?: Partial<HeroCenteredProps>): HeroCenteredProps {
  return {
    headline: "Build Something Amazing",
    subheadline: "The fastest way to launch your next project.",
    ...overrides,
  };
}

export function createHeroSplitProps(overrides?: Partial<HeroSplitProps>): HeroSplitProps {
  return {
    headline: "Grow Your Business Online",
    subheadline: "Everything you need in one place.",
    body: "We help small businesses create professional websites that convert visitors into customers.",
    ...overrides,
  };
}

export function createHeroVideoProps(overrides?: Partial<HeroVideoProps>): HeroVideoProps {
  return {
    headline: "See It In Action",
    subheadline: "Watch how easy it is to get started.",
    ...overrides,
  };
}

/* ── Content ─────────────────────────────────────────────────── */

export function createContentFeaturesProps(
  overrides?: Partial<ContentFeaturesProps>
): ContentFeaturesProps {
  return {
    headline: "Why Choose Us",
    features: [
      { icon: "Zap", title: "Lightning Fast", description: "Built for speed from the ground up." },
      { icon: "Shield", title: "Secure", description: "Enterprise-grade security by default." },
      {
        icon: "Globe",
        title: "Global CDN",
        description: "Content delivered from the nearest edge.",
      },
    ],
    ...overrides,
  };
}

export function createContentSplitProps(overrides?: Partial<ContentSplitProps>): ContentSplitProps {
  return {
    sections: [
      {
        headline: "Design That Converts",
        body: "Every pixel is optimized for engagement and conversion.",
      },
      {
        headline: "Built for Growth",
        body: "Scale effortlessly as your audience grows.",
      },
    ],
    ...overrides,
  };
}

export function createContentTextProps(overrides?: Partial<ContentTextProps>): ContentTextProps {
  return {
    body: "We believe great design should be accessible to everyone. Our platform makes it simple to create stunning websites without writing a single line of code.",
    headline: "Our Philosophy",
    ...overrides,
  };
}

export function createContentStatsProps(overrides?: Partial<ContentStatsProps>): ContentStatsProps {
  return {
    headline: "By the Numbers",
    stats: [
      { value: 500, label: "Clients Served", suffix: "+" },
      { value: 98, label: "Satisfaction Rate", suffix: "%" },
      { value: 24, label: "Hour Support", prefix: "" },
    ],
    ...overrides,
  };
}

export function createContentAccordionProps(
  overrides?: Partial<ContentAccordionProps>
): ContentAccordionProps {
  return {
    headline: "Frequently Asked Questions",
    items: [
      { question: "How long does it take?", answer: "Most sites are ready within minutes." },
      { question: "Can I customize my site?", answer: "Yes, every element is fully customizable." },
      {
        question: "Is there a free plan?",
        answer: "We offer a generous free tier to get started.",
      },
    ],
    ...overrides,
  };
}

export function createContentTimelineProps(
  overrides?: Partial<ContentTimelineProps>
): ContentTimelineProps {
  return {
    headline: "Our Journey",
    items: [
      { title: "Founded", description: "Started in a garage with a big dream.", date: "2020" },
      { title: "First 100 Customers", description: "Reached our first milestone.", date: "2021" },
      { title: "Series A", description: "Raised funding to scale the platform.", date: "2023" },
    ],
    ...overrides,
  };
}

export function createContentLogosProps(overrides?: Partial<ContentLogosProps>): ContentLogosProps {
  return {
    headline: "Trusted By Leading Brands",
    logos: [{ name: "Acme Corp" }, { name: "Globex" }, { name: "Initech" }, { name: "Umbrella" }],
    ...overrides,
  };
}

export function createContentStepsProps(overrides?: Partial<ContentStepsProps>): ContentStepsProps {
  return {
    headline: "How It Works",
    steps: [
      { title: "Tell Us About Your Business", description: "Answer a few quick questions." },
      { title: "We Build Your Site", description: "AI assembles a professional website." },
      { title: "Launch", description: "Go live with one click." },
    ],
    ...overrides,
  };
}

export function createContentComparisonProps(
  overrides?: Partial<ContentComparisonProps>
): ContentComparisonProps {
  return {
    headline: "Compare Plans",
    columns: [{ name: "Free" }, { name: "Pro", highlighted: true }, { name: "Enterprise" }],
    rows: [
      { feature: "Custom Domain", values: [false, true, true] },
      { feature: "Analytics", values: ["Basic", "Advanced", "Advanced"] },
      { feature: "Support", values: ["Community", "Email", "Dedicated"] },
    ],
    ...overrides,
  };
}

export function createContentMapProps(overrides?: Partial<ContentMapProps>): ContentMapProps {
  return {
    headline: "Find Us",
    contactInfo: {
      address: "123 Main St, Anytown, USA 12345",
      phone: "(555) 123-4567",
      email: "hello@example.com",
      hours: ["Mon-Fri: 9am-5pm", "Sat: 10am-2pm"],
    },
    ...overrides,
  };
}

/* ── Blog ────────────────────────────────────────────────────── */

export function createBlogPreviewProps(overrides?: Partial<BlogPreviewProps>): BlogPreviewProps {
  return {
    headline: "Latest Articles",
    posts: [
      {
        title: "Getting Started with Web Design",
        excerpt: "Learn the fundamentals of creating beautiful websites.",
        date: "2026-01-15",
        author: "Jane Doe",
        category: "Design",
      },
      {
        title: "SEO Best Practices for 2026",
        excerpt: "Everything you need to know about search optimization.",
        date: "2026-02-01",
        author: "John Smith",
        category: "Marketing",
      },
      {
        title: "The Future of AI in Web Development",
        excerpt: "How artificial intelligence is changing the way we build for the web.",
        date: "2026-02-10",
        author: "Alex Johnson",
        category: "Technology",
      },
    ],
    ...overrides,
  };
}

/* ── Commerce ────────────────────────────────────────────────── */

export function createCommerceServicesProps(
  overrides?: Partial<CommerceServicesProps>
): CommerceServicesProps {
  return {
    headline: "Our Services",
    services: [
      {
        name: "Web Design",
        description: "Custom website design tailored to your brand.",
        price: "$499",
      },
      {
        name: "SEO Optimization",
        description: "Improve your search engine rankings.",
        price: "$299",
      },
      {
        name: "Content Writing",
        description: "Professional copywriting for your site.",
        price: "$199",
      },
    ],
    ...overrides,
  };
}

export function createPricingTableProps(overrides?: Partial<PricingTableProps>): PricingTableProps {
  return {
    headline: "Simple Pricing",
    plans: [
      {
        name: "Starter",
        price: "$12",
        period: "/mo",
        features: [
          { text: "1 Website", included: true },
          { text: "Custom Domain", included: true },
          { text: "Analytics", included: false },
        ],
        cta: { text: "Get Started", href: "/signup" },
      },
      {
        name: "Pro",
        price: "$29",
        period: "/mo",
        featured: true,
        features: [
          { text: "5 Websites", included: true },
          { text: "Custom Domain", included: true },
          { text: "Analytics", included: true },
        ],
        cta: { text: "Go Pro", href: "/signup?plan=pro" },
      },
    ],
    ...overrides,
  };
}

/* ── Social Proof ────────────────────────────────────────────── */

export function createProofTestimonialsProps(
  overrides?: Partial<ProofTestimonialsProps>
): ProofTestimonialsProps {
  return {
    headline: "What Our Clients Say",
    testimonials: [
      {
        quote: "Absolutely transformed our online presence.",
        name: "Sarah Chen",
        role: "CEO",
        rating: 5,
      },
      {
        quote: "The best investment we made this year.",
        name: "Michael Park",
        role: "Founder",
        rating: 5,
      },
      {
        quote: "Simple, fast, and beautiful results.",
        name: "Emily Torres",
        role: "Marketing Director",
        rating: 4,
      },
    ],
    ...overrides,
  };
}

export function createProofBeforeAfterProps(
  overrides?: Partial<ProofBeforeAfterProps>
): ProofBeforeAfterProps {
  return {
    headline: "The Transformation",
    comparisons: [
      {
        beforeImage: { src: "/images/before-1.jpg", alt: "Before redesign" },
        afterImage: { src: "/images/after-1.jpg", alt: "After redesign" },
        beforeLabel: "Before",
        afterLabel: "After",
      },
    ],
    ...overrides,
  };
}

/* ── Team ────────────────────────────────────────────────────── */

export function createTeamGridProps(overrides?: Partial<TeamGridProps>): TeamGridProps {
  return {
    headline: "Meet the Team",
    members: [
      { name: "Alice Johnson", role: "CEO", bio: "Visionary leader with 15 years of experience." },
      {
        name: "Bob Williams",
        role: "CTO",
        bio: "Full-stack engineer and architecture enthusiast.",
      },
      {
        name: "Carol Davis",
        role: "Head of Design",
        bio: "Award-winning designer focused on user experience.",
      },
    ],
    ...overrides,
  };
}

/* ── Media ───────────────────────────────────────────────────── */

export function createMediaGalleryProps(overrides?: Partial<MediaGalleryProps>): MediaGalleryProps {
  return {
    headline: "Gallery",
    images: [
      { src: "/images/gallery-1.jpg", alt: "Project showcase 1" },
      { src: "/images/gallery-2.jpg", alt: "Project showcase 2" },
      { src: "/images/gallery-3.jpg", alt: "Project showcase 3" },
      { src: "/images/gallery-4.jpg", alt: "Project showcase 4" },
    ],
    ...overrides,
  };
}

/* ── CTA ─────────────────────────────────────────────────────── */

export function createCtaBannerProps(overrides?: Partial<CtaBannerProps>): CtaBannerProps {
  return {
    headline: "Ready to Get Started?",
    subheadline: "Join thousands of businesses already using our platform.",
    ctaPrimary: { text: "Start Free", href: "/signup" },
    ...overrides,
  };
}

/* ── Forms ───────────────────────────────────────────────────── */

export function createFormContactProps(overrides?: Partial<FormContactProps>): FormContactProps {
  return {
    headline: "Get in Touch",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "message", label: "Message", type: "textarea", required: true },
    ],
    submitText: "Send Message",
    ...overrides,
  };
}

/* ── Footer ──────────────────────────────────────────────────── */

export function createFooterStandardProps(
  overrides?: Partial<FooterStandardProps>
): FooterStandardProps {
  return {
    logoText: "TestBrand",
    tagline: "Building better websites, faster.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/testbrand" },
      { platform: "github", url: "https://github.com/testbrand" },
    ],
    copyright: "2026 TestBrand. All rights reserved.",
    ...overrides,
  };
}

/* ── Layout ──────────────────────────────────────────────────── */

export function createSectionProps(
  overrides?: Partial<Omit<SectionProps, "children">> & { children?: ReactNode }
): SectionProps {
  return {
    children: null,
    background: "default",
    contained: true,
    ...overrides,
  };
}
