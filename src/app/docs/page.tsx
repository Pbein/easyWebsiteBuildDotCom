"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Layers,
  Blocks,
  Palette,
  MessageSquare,
  Cpu,
  Brain,
  Map,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Navigation Data                                            */
/* ------------------------------------------------------------------ */

interface DocSection {
  id: string;
  label: string;
  icon: LucideIcon;
  headings: string[];
}

const sections: DocSection[] = [
  {
    id: "overview",
    label: "Overview",
    icon: BookOpen,
    headings: ["What is EasyWebsiteBuild?", "Core Principles", "Tech Stack"],
  },
  {
    id: "architecture",
    label: "Architecture",
    icon: Layers,
    headings: [
      "System Overview",
      "Intent Capture Layer",
      "Component Assembly Engine",
      "Theming & Style System",
      "Evolving Knowledge Base",
      "Database Schema",
      "API Integration",
      "Deployment Architecture",
    ],
  },
  {
    id: "component-library",
    label: "Component Library",
    icon: Blocks,
    headings: [
      "Design Principles",
      "File Structure",
      "Props Contract",
      "Component Manifest",
      "Full Inventory",
      "Development Priority",
    ],
  },
  {
    id: "theme-system",
    label: "Theme System",
    icon: Palette,
    headings: [
      "Design Token Categories",
      "Personality Vector Mapping",
      "Curated Font Pairings",
      "Theme Presets",
      "Theme Application",
    ],
  },
  {
    id: "intake-flow",
    label: "Intake Flow",
    icon: MessageSquare,
    headings: [
      "User Experience Flow",
      "Step 1: Site Type",
      "Step 2: Primary Goal",
      "Step 3: Industry & Context",
      "Step 4: Brand Personality",
      "Step 5: Deep Discovery",
      "Step 6: Preview & Proposal",
      "Technical Implementation",
    ],
  },
  {
    id: "assembly-engine",
    label: "Assembly Engine",
    icon: Cpu,
    headings: [
      "Assembly Pipeline",
      "Step 1: Resolve Theme",
      "Step 2: Select Components",
      "Step 3: Configure Variants",
      "Step 4: Compose Layout",
      "Step 5: Generate Content",
      "Step 6: Render Preview",
      "Step 7: User Approval Loop",
      "Step 8: Build & Deploy",
    ],
  },
  {
    id: "knowledge-base",
    label: "Knowledge Base",
    icon: Brain,
    headings: [
      "Learning Mechanisms",
      "Intent Path Evolution",
      "Proven Recipes",
      "Theme Library Growth",
      "Content Pattern Templates",
      "Similarity Matching",
      "Feedback Loop",
      "Data Hygiene",
    ],
  },
  {
    id: "roadmap",
    label: "Roadmap",
    icon: Map,
    headings: [
      "Phase 1: Platform Website",
      "Phase 2: Core Component Library",
      "Phase 3: Intent Capture System",
      "Phase 4: Assembly Engine & Preview",
      "Phase 5: Expand Component Library",
      "Phase 6: Knowledge Base & Learning",
      "Phase 7: Build & Deploy Pipeline",
      "Phase 8: Visual Editor",
      "Phase 9: Commerce & Advanced",
      "Phase 10: Scale & Optimize",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Doc Content                                                        */
/* ------------------------------------------------------------------ */

function DocContent({ sectionId }: { sectionId: string }): React.ReactElement {
  switch (sectionId) {
    case "overview":
      return <OverviewContent />;
    case "architecture":
      return <ArchitectureContent />;
    case "component-library":
      return <ComponentLibraryContent />;
    case "theme-system":
      return <ThemeSystemContent />;
    case "intake-flow":
      return <IntakeFlowContent />;
    case "assembly-engine":
      return <AssemblyEngineContent />;
    case "knowledge-base":
      return <KnowledgeBaseContent />;
    case "roadmap":
      return <RoadmapContent />;
    default:
      return <OverviewContent />;
  }
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function DocsPage(): React.ReactElement {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSectionChange = useCallback((id: string): void => {
    setActiveSection(id);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && sections.some((s) => s.id === hash)) {
      setActiveSection(hash);
    }
  }, []);

  useEffect(() => {
    window.location.hash = activeSection;
  }, [activeSection]);

  const currentSection = sections.find((s) => s.id === activeSection) || sections[0];

  return (
    <div className="min-h-screen pt-16">
      {/* Mobile nav toggle */}
      <button
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[var(--color-accent)] text-[var(--color-bg-primary)] flex items-center justify-center shadow-[var(--shadow-lg)]"
        aria-label="Toggle navigation"
      >
        {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="max-w-[90rem] mx-auto flex">
        {/* Left Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="p-6">
            <p
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Documentation
            </p>
            <ul className="space-y-1">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => handleSectionChange(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                        isActive
                          ? "bg-[var(--color-accent-glow)] text-[var(--color-accent)] border border-[var(--color-border-accent)]"
                          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
                      }`}
                    >
                      <section.icon className="w-4 h-4 shrink-0" />
                      <span style={{ fontFamily: "var(--font-heading)" }}>{section.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-6 lg:px-12 py-10">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl docs-content"
          >
            <DocContent sectionId={activeSection} />
          </motion.div>

          {/* Prev / Next navigation */}
          <div className="max-w-4xl mt-16 pt-8 border-t border-[var(--color-border)] flex justify-between">
            {(() => {
              const idx = sections.findIndex((s) => s.id === activeSection);
              const prev = idx > 0 ? sections[idx - 1] : null;
              const next = idx < sections.length - 1 ? sections[idx + 1] : null;
              return (
                <>
                  {prev ? (
                    <button
                      onClick={() => handleSectionChange(prev.id)}
                      className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      {prev.label}
                    </button>
                  ) : (
                    <div />
                  )}
                  {next ? (
                    <button
                      onClick={() => handleSectionChange(next.id)}
                      className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      {next.label}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div />
                  )}
                </>
              );
            })()}
          </div>
        </main>

        {/* Right TOC */}
        <aside className="hidden xl:block sticky top-16 h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto p-6">
          <p
            className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            On This Page
          </p>
          <ul className="space-y-2">
            {currentSection.headings.map((heading) => (
              <li key={heading}>
                <span className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] cursor-default leading-snug block">
                  {heading}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Content Components                                         */
/* ------------------------------------------------------------------ */

function OverviewContent(): React.ReactElement {
  return (
    <>
      <h1>Overview</h1>
      <p>
        <strong>EasyWebsiteBuild</strong> is an AI-powered website assembly platform that creates professional
        websites from a modular component library based on structured client intake. Instead of choosing templates,
        clients go through an intelligent discovery process that captures their real requirements — then the system
        assembles a unique website tailored to their needs.
      </p>

      <h2>What is EasyWebsiteBuild?</h2>
      <p>
        This is <strong>NOT</strong> a drag-and-drop builder. It is an intelligent assembly system that:
      </p>
      <ul>
        <li>Captures client intent through a guided discovery flow</li>
        <li>Uses AI (Claude API) combined with deterministic decision trees to make design decisions</li>
        <li>Selects, configures, and composes website components into fully themed sites</li>
        <li>Gets smarter over time — every client interaction enriches the system</li>
      </ul>

      <h2>Core Principles</h2>
      <ul>
        <li><strong>Component-First Design</strong> — Every UI element comes from a modular component library with multiple variants per component type</li>
        <li><strong>Intent-Driven Assembly</strong> — Websites are assembled based on a structured Site Intent Document produced by the intake flow</li>
        <li><strong>Evolving Knowledge Base</strong> — New intent paths start as AI-interpreted, graduate to deterministic after repeated confirmation</li>
        <li><strong>Modular & Reusable</strong> — Components, themes, content patterns, and generated assets are all extractable and reusable</li>
      </ul>

      <h2>Tech Stack</h2>
      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Technology</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Framework</td><td>Next.js 14+ (App Router)</td></tr>
          <tr><td>Language</td><td>TypeScript (strict mode)</td></tr>
          <tr><td>Database</td><td>Convex (real-time backend)</td></tr>
          <tr><td>AI Integration</td><td>Claude SDK (@anthropic-ai/sdk)</td></tr>
          <tr><td>Styling</td><td>Tailwind CSS v4 + CSS Custom Properties</td></tr>
          <tr><td>Deployment</td><td>Vercel</td></tr>
        </tbody>
      </table>
    </>
  );
}

function ArchitectureContent(): React.ReactElement {
  return (
    <>
      <h1>Architecture</h1>
      <p>
        EasyWebsiteBuild is built on three core layers that work together in a pipeline:
        <strong> Intent → Spec → Assembly → Preview → Delivery</strong>.
      </p>

      <h2>System Overview</h2>
      <p>The three core layers are:</p>
      <ol>
        <li><strong>Intent Capture Layer</strong> — Guided discovery that extracts what a client actually needs</li>
        <li><strong>Component Assembly Engine</strong> — Modular building blocks + composition logic</li>
        <li><strong>Theming &amp; Style System</strong> — Design tokens that make each site unique</li>
      </ol>

      <h2>Intent Capture Layer</h2>
      <p>
        Replaces the traditional &quot;pick a template&quot; approach with an intelligent flow that captures
        business goals, brand personality, content inventory, and conversion objectives.
      </p>
      <p>The intake flow has four phases:</p>
      <ul>
        <li><strong>Phase A: Quick Classification</strong> — Deterministic selection of site type, conversion goal, and industry</li>
        <li><strong>Phase B: Brand Personality</strong> — Visual A/B comparisons across 6 personality axes producing a 6-dimensional vector</li>
        <li><strong>Phase C: Deep Discovery</strong> — AI-powered contextual follow-up questions</li>
        <li><strong>Phase D: Proposal &amp; Preview</strong> — Generated Site Intent Document + visual preview</li>
      </ul>

      <h3>Site Intent Document</h3>
      <p>The structured JSON spec that drives assembly:</p>
      <pre><code>{`interface SiteIntentDocument {
  siteType: SiteType;
  industry: string;
  conversionGoal: ConversionGoal;
  personalityVector: [number, number, number, number, number, number];
  pages: PageSpec[];
  navigation: NavigationSpec;
  footer: FooterSpec;
  businessName: string;
  features: Feature[];
  confidence: number;
}`}</code></pre>

      <h2>Component Assembly Engine</h2>
      <p>
        Every component follows a strict contract with identity, classification, data contract, theming integration,
        and variant specifications. The assembly protocol follows this process:
      </p>
      <ol>
        <li>Read Site Intent Document</li>
        <li>Resolve Theme (load proven or generate from personality vector)</li>
        <li>Select Components (match IDs to library)</li>
        <li>Configure Variants (based on personality fit + content)</li>
        <li>Compose Layout (arrange with section wrappers)</li>
        <li>Populate Content (real or AI-generated)</li>
        <li>Render Preview (live, interactive)</li>
        <li>Export (deployable Next.js project)</li>
      </ol>

      <h2>Theming &amp; Style System</h2>
      <p>
        Every generated website consumes a theme defined as CSS Custom Properties. The 6-axis personality
        vector maps to theme tokens through a generation function.
      </p>
      <table>
        <thead>
          <tr><th>Personality Axis</th><th>Token Effects</th></tr>
        </thead>
        <tbody>
          <tr><td>Minimal ↔ Rich</td><td>Spacing, shadows, borders, background complexity</td></tr>
          <tr><td>Playful ↔ Serious</td><td>Font pairing, color saturation, radius values</td></tr>
          <tr><td>Warm ↔ Cool</td><td>Hue rotation, warm vs cool neutrals</td></tr>
          <tr><td>Light ↔ Bold</td><td>Font weights, contrast, text sizes</td></tr>
          <tr><td>Classic ↔ Modern</td><td>Serif vs sans, ornamental details, proportions</td></tr>
          <tr><td>Calm ↔ Dynamic</td><td>Animation speed, transition types, interactive effects</td></tr>
        </tbody>
      </table>

      <h2>Evolving Knowledge Base</h2>
      <p>
        The system learns from every interaction. New intent paths start as AI-interpreted and graduate
        to deterministic after repeated confirmation. Path lifecycle:
      </p>
      <ul>
        <li><strong>Candidate</strong> — New path, AI-interpreted, usage count starts at 1</li>
        <li><strong>Proven</strong> — Usage ≥ 3 AND confirmation rate ≥ 0.8 → zero AI calls needed</li>
        <li><strong>Deprecated</strong> — Confirmation rate drops below 0.5 after 5+ uses</li>
      </ul>

      <h2>Database Schema</h2>
      <p>Core Convex tables:</p>
      <table>
        <thead>
          <tr><th>Table</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code>projects</code></td><td>Client website projects</td></tr>
          <tr><td><code>intakeResponses</code></td><td>Individual answers from intake flow</td></tr>
          <tr><td><code>intentPaths</code></td><td>Evolving decision tree</td></tr>
          <tr><td><code>components</code></td><td>Component library registry</td></tr>
          <tr><td><code>themes</code></td><td>Theme presets and custom themes</td></tr>
          <tr><td><code>assets</code></td><td>File references and metadata</td></tr>
          <tr><td><code>recipes</code></td><td>Proven component configurations</td></tr>
          <tr><td><code>users</code></td><td>Platform users</td></tr>
        </tbody>
      </table>

      <h2>API Integration</h2>
      <p>Claude is called for:</p>
      <ol>
        <li><strong>Deep Discovery Questions</strong> — Generating contextual follow-up questions</li>
        <li><strong>Intent Interpretation</strong> — Novel responses that don&apos;t match known paths</li>
        <li><strong>Copy Generation</strong> — Website copy based on business info</li>
        <li><strong>Component Selection</strong> — When optimal arrangement isn&apos;t deterministic</li>
        <li><strong>Theme Fine-tuning</strong> — Adjusting tokens from nuanced brand descriptions</li>
      </ol>

      <h2>Deployment Architecture</h2>
      <p>The platform runs on Next.js (Vercel) + Convex cloud. Generated sites are either:</p>
      <ul>
        <li><strong>Subscription</strong> — Separate Next.js deployments with shared component library</li>
        <li><strong>One-time purchase</strong> — Standalone exported Next.js project with bundled components</li>
      </ul>
    </>
  );
}

function ComponentLibraryContent(): React.ReactElement {
  return (
    <>
      <h1>Component Library</h1>
      <p>
        The component library is the core building block system. Every UI element on generated websites comes
        from this library. Components are self-contained, variant-aware, theme-token driven, and composable.
      </p>

      <h2>Design Principles</h2>
      <ol>
        <li><strong>Token-driven</strong> — Components NEVER hardcode colors, fonts, or brand-specific values</li>
        <li><strong>Variant-rich</strong> — Each component type supports multiple visual variants sharing the same data contract</li>
        <li><strong>Content-agnostic</strong> — Components accept structured content via props</li>
        <li><strong>Responsive</strong> — Fully responsive across mobile, tablet, and desktop</li>
        <li><strong>Accessible</strong> — WCAG 2.1 AA compliance as baseline</li>
        <li><strong>Performance</strong> — Optimized for Core Web Vitals</li>
      </ol>

      <h2>File Structure</h2>
      <pre><code>{`components/library/[category]/[component-name]/
├── index.ts                    # Public export
├── [ComponentName].tsx         # Default/primary variant
├── [ComponentName][Variant].tsx # Additional variants
├── [component-name].types.ts   # TypeScript interfaces
├── [component-name].manifest.json  # Manifest for assembly engine
└── [component-name].tokens.ts  # Token consumption declarations`}</code></pre>

      <h2>Props Contract</h2>
      <pre><code>{`interface BaseComponentProps {
  id?: string;
  className?: string;
  theme?: Partial<ThemeTokens>;
  animate?: boolean;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}`}</code></pre>

      <h2>Component Manifest</h2>
      <p>Each component has a JSON manifest that describes its identity, classification, data contract, theming integration, and variants:</p>
      <pre><code>{`{
  "id": "hero-parallax",
  "category": "hero",
  "name": "Parallax Hero",
  "siteTypes": ["business", "booking", "portfolio"],
  "personalityFit": {
    "minimal_rich": [0.4, 1.0],
    "playful_serious": [0.3, 0.9]
  },
  "variants": [
    { "id": "default", "name": "Standard Parallax" },
    { "id": "with-subject", "name": "With Foreground Subject" }
  ]
}`}</code></pre>

      <h2>Full Inventory</h2>
      <p>The library spans 10 categories with 50+ components:</p>
      <table>
        <thead>
          <tr><th>Category</th><th>Components</th><th>Examples</th></tr>
        </thead>
        <tbody>
          <tr><td>Navigation</td><td>5</td><td>Sticky, Hamburger, Mega Menu, Centered, Sidebar</td></tr>
          <tr><td>Hero Sections</td><td>8</td><td>Centered, Split, Video, Parallax, Carousel, Minimal</td></tr>
          <tr><td>Content Blocks</td><td>10</td><td>Features, Cards, Split, Stats, Timeline, Accordion</td></tr>
          <tr><td>Social Proof</td><td>4</td><td>Testimonials, Reviews, Case Studies, Before/After</td></tr>
          <tr><td>Team &amp; People</td><td>3</td><td>Grid, Carousel, Spotlight</td></tr>
          <tr><td>Media</td><td>4</td><td>Gallery, Video, Portfolio, Showcase</td></tr>
          <tr><td>Call to Action</td><td>4</td><td>Banner, Card, Floating, Newsletter</td></tr>
          <tr><td>Forms</td><td>4</td><td>Contact, Booking, Search, Subscribe</td></tr>
          <tr><td>Commerce</td><td>4</td><td>Products, Detail, Services, Pricing</td></tr>
          <tr><td>Footer</td><td>4</td><td>Standard, Minimal, CTA, Mega</td></tr>
        </tbody>
      </table>

      <h2>Development Priority</h2>
      <p><strong>Phase 1 (MVP)</strong> — 10 core components:</p>
      <ol>
        <li><code>nav-sticky</code> (transparent + solid)</li>
        <li><code>hero-centered</code> (with-bg-image)</li>
        <li><code>hero-split</code> (image-right)</li>
        <li><code>content-features</code> (icon-cards)</li>
        <li><code>content-split</code> (alternating)</li>
        <li><code>cta-banner</code> (full-width)</li>
        <li><code>form-contact</code> (simple)</li>
        <li><code>footer-standard</code> (multi-column)</li>
        <li><code>proof-testimonials</code> (carousel)</li>
        <li><code>content-text</code> (centered)</li>
      </ol>
    </>
  );
}

function ThemeSystemContent(): React.ReactElement {
  return (
    <>
      <h1>Theme System</h1>
      <p>
        The theme system prevents every generated website from looking the same. It translates the brand
        personality captured during intake into a complete set of CSS Custom Properties (design tokens).
      </p>

      <h2>Design Token Categories</h2>
      <p>Tokens are organized into categories:</p>
      <table>
        <thead>
          <tr><th>Category</th><th>Examples</th></tr>
        </thead>
        <tbody>
          <tr><td>Color</td><td><code>--color-primary</code>, <code>--color-secondary</code>, <code>--color-accent</code>, <code>--color-background</code></td></tr>
          <tr><td>Typography</td><td><code>--font-heading</code>, <code>--font-body</code>, <code>--text-xs</code> through <code>--text-7xl</code></td></tr>
          <tr><td>Spacing</td><td><code>--space-section</code>, <code>--space-component</code>, <code>--container-max</code></td></tr>
          <tr><td>Shape</td><td><code>--radius-sm</code> through <code>--radius-full</code></td></tr>
          <tr><td>Shadows</td><td><code>--shadow-sm</code> through <code>--shadow-xl</code></td></tr>
          <tr><td>Animation</td><td><code>--transition-fast</code>, <code>--transition-base</code>, <code>--animation-distance</code></td></tr>
        </tbody>
      </table>

      <h2>Personality Vector Mapping</h2>
      <p>The 6-axis personality vector maps to theme tokens:</p>
      <table>
        <thead>
          <tr><th>Axis</th><th>Low (0)</th><th>High (1)</th></tr>
        </thead>
        <tbody>
          <tr><td>Density</td><td>Large spacing, no shadows, monochrome</td><td>Compact, layered shadows, decorative borders</td></tr>
          <tr><td>Tone</td><td>Rounded fonts, high saturation, bouncy</td><td>Serif/geometric, desaturated, subtle easing</td></tr>
          <tr><td>Temperature</td><td>Warm neutrals, earth tones</td><td>Cool neutrals, steel/ice tones</td></tr>
          <tr><td>Weight</td><td>Thin weights, subtle contrast</td><td>Heavy weights, high contrast, dark backgrounds</td></tr>
          <tr><td>Era</td><td>Serif headings, ornamental, traditional</td><td>Geometric sans, minimal, contemporary</td></tr>
          <tr><td>Energy</td><td>Slow transitions, static layouts</td><td>Fast transitions, parallax, interactive</td></tr>
        </tbody>
      </table>

      <h2>Curated Font Pairings</h2>
      <table>
        <thead>
          <tr><th>Style</th><th>Heading Font</th><th>Body Font</th></tr>
        </thead>
        <tbody>
          <tr><td>Luxury</td><td>Cormorant Garamond</td><td>Outfit</td></tr>
          <tr><td>Corporate</td><td>Sora</td><td>DM Sans</td></tr>
          <tr><td>Creative</td><td>Clash Display</td><td>Satoshi</td></tr>
          <tr><td>Traditional</td><td>Lora</td><td>Merriweather Sans</td></tr>
          <tr><td>Impact</td><td>Bebas Neue</td><td>Barlow</td></tr>
          <tr><td>Tech</td><td>JetBrains Mono</td><td>DM Sans</td></tr>
        </tbody>
      </table>

      <h2>Theme Presets</h2>
      <p>10 curated starting points that can be adjusted:</p>
      <ul>
        <li><strong>Luxury Dark</strong> — Deep jewel tones, serif headings, gold accents</li>
        <li><strong>Luxury Light</strong> — Cream/ivory base, elegant serif, muted metallics</li>
        <li><strong>Modern Clean</strong> — Crisp whites, geometric sans-serif, single accent</li>
        <li><strong>Bold Creative</strong> — Vibrant colors, display fonts, dynamic animations</li>
        <li><strong>Warm Professional</strong> — Earth tones, friendly sans-serif, rounded corners</li>
        <li><strong>Editorial</strong> — High contrast, strong typography hierarchy</li>
        <li><strong>Tech Forward</strong> — Dark mode, monospace accents, gradient meshes</li>
        <li><strong>Organic Natural</strong> — Greens/browns, handwritten accents, texture</li>
        <li><strong>Playful Bright</strong> — Primary colors, bouncy animations, large rounded elements</li>
        <li><strong>Minimalist Zen</strong> — Near-monochrome, extreme whitespace, delicate typography</li>
      </ul>

      <h2>Theme Application</h2>
      <p>Components consume tokens via CSS custom properties or extended Tailwind config:</p>
      <pre><code>{`// Tailwind config for generated sites
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
    },
    fontFamily: {
      heading: 'var(--font-heading)',
      body: 'var(--font-body)',
    }
  }
}`}</code></pre>
    </>
  );
}

function IntakeFlowContent(): React.ReactElement {
  return (
    <>
      <h1>Intake Flow</h1>
      <p>
        The intake flow is the guided discovery experience that replaces &quot;pick a template.&quot;
        It extracts what a client actually needs through structured questions, visual comparisons,
        and AI-powered conversation.
      </p>

      <h2>User Experience Flow</h2>
      <p>The flow is designed to feel light and fast — one question per screen, visual choices over text, with progressive disclosure. Estimated time: about 3 minutes.</p>

      <h2>Step 1: Site Type</h2>
      <p>Clean welcome screen with a single question: &quot;What kind of website are you building?&quot;</p>
      <p>Options presented as visual cards with icons covering 13 site types, plus a &quot;Something else&quot; option that feeds into AI interpretation.</p>

      <h2>Step 2: Primary Goal</h2>
      <p>Based on the Step 1 selection, contextual goals are shown. For example:</p>
      <ul>
        <li><strong>Business</strong>: Contact, book consultation, showcase services, sell directly</li>
        <li><strong>Portfolio</strong>: Get hired, get industry attention, build audience, sell work</li>
        <li><strong>E-commerce</strong>: Physical products, digital products, subscriptions, marketplace</li>
      </ul>

      <h2>Step 3: Industry &amp; Context</h2>
      <p>Text input with smart suggestions. The AI extracts: industry, location, scale, target audience, and competitive positioning.</p>

      <h2>Step 4: Brand Personality</h2>
      <p>Series of 6 visual A/B comparisons across personality axes:</p>
      <table>
        <thead>
          <tr><th>Axis</th><th>Left Pole</th><th>Right Pole</th></tr>
        </thead>
        <tbody>
          <tr><td>Density</td><td>Minimal / Spacious</td><td>Rich / Dense</td></tr>
          <tr><td>Tone</td><td>Playful / Casual</td><td>Serious / Professional</td></tr>
          <tr><td>Temperature</td><td>Warm / Inviting</td><td>Cool / Sleek</td></tr>
          <tr><td>Weight</td><td>Light / Airy</td><td>Bold / Heavy</td></tr>
          <tr><td>Era</td><td>Classic / Traditional</td><td>Modern / Contemporary</td></tr>
          <tr><td>Energy</td><td>Calm / Serene</td><td>Dynamic / Energetic</td></tr>
        </tbody>
      </table>

      <h2>Step 5: Deep Discovery</h2>
      <p>AI generates 3-5 targeted questions based on all previous answers in a conversational format.</p>

      <h2>Step 6: Preview &amp; Proposal</h2>
      <p>The system generates: a visual preview with real components, a proposed sitemap, theme details, and component breakdown.</p>

      <h2>Technical Implementation</h2>
      <pre><code>{`interface IntakeState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  completedSteps: number[];
  siteType: SiteType | null;
  conversionGoal: ConversionGoal | null;
  businessDescription: string;
  personalityVector: [number, number, number, number, number, number];
  aiQuestions: AIQuestion[];
  aiResponses: { questionId: string; response: string }[];
  generatedSpec?: SiteIntentDocument;
}`}</code></pre>
    </>
  );
}

function AssemblyEngineContent(): React.ReactElement {
  return (
    <>
      <h1>Assembly Engine</h1>
      <p>
        The Assembly Engine takes a Site Intent Document and composes it into a complete, themed,
        deployable website using components from the library.
      </p>

      <h2>Assembly Pipeline</h2>
      <pre><code>{`Site Intent Document
       ↓
  1. Resolve Theme
       ↓
  2. Select Components
       ↓
  3. Configure Variants
       ↓
  4. Compose Layout
       ↓
  5. Generate Content
       ↓
  6. Render Preview
       ↓
  7. User Approval Loop
       ↓
  8. Build & Deploy / Export`}</code></pre>

      <h2>Step 1: Resolve Theme</h2>
      <p>Check for proven theme match (cosine similarity &gt; 0.95), otherwise generate from personality vector. Apply any explicit overrides from brand guidelines.</p>

      <h2>Step 2: Select Components</h2>
      <p>For each page, iterate through component placements, look up in the manifest index, verify variants exist, and check personality fit.</p>

      <h2>Step 3: Configure Variants</h2>
      <p>Select optimal variant based on personality vector fit, available content, page position, and proven recipe availability.</p>

      <h2>Step 4: Compose Layout</h2>
      <p>Wrap components in Section containers, apply alternating backgrounds, insert navigation and footer, handle responsive stacking.</p>

      <h2>Step 5: Generate Content</h2>
      <p>Place user-provided content directly. For missing content, use Claude to generate headlines, descriptions, CTAs, and meta descriptions matching brand voice.</p>

      <h2>Step 6: Render Preview</h2>
      <p>Generate a live, interactive preview with actual React components, resolved theme tokens, loaded fonts, and animations.</p>

      <h2>Step 7: User Approval Loop</h2>
      <p>Users can approve, request theme changes, component changes, or content changes — all applied in real-time.</p>

      <h2>Step 8: Build &amp; Deploy</h2>
      <p>
        <strong>Subscription sites:</strong> Deploy to Vercel with component library as dependency.<br />
        <strong>One-time purchase:</strong> Export as standalone Next.js project with bundled components.
      </p>
    </>
  );
}

function KnowledgeBaseContent(): React.ReactElement {
  return (
    <>
      <h1>Knowledge Base</h1>
      <p>
        The Knowledge Base is what makes EasyWebsiteBuild smarter over time. Every client interaction
        enriches the system. The core principle: <strong>AI bootstraps new paths, but proven paths become deterministic.</strong>
      </p>

      <h2>Learning Mechanisms</h2>
      <p>Five interconnected learning systems:</p>
      <ol>
        <li><strong>Intent Path Evolution</strong> — Decision paths graduate from AI-interpreted to deterministic</li>
        <li><strong>Proven Recipes</strong> — Approved component configurations are cataloged for reuse</li>
        <li><strong>Theme Library Growth</strong> — Approved themes are saved and searchable</li>
        <li><strong>Content Pattern Templates</strong> — Approved copy patterns are extracted and stored</li>
        <li><strong>Page Composition Templates</strong> — Full page component sequences that work</li>
      </ol>

      <h2>Intent Path Evolution</h2>
      <p>Every decision point creates an intent path entry with lifecycle:</p>
      <ul>
        <li><strong>Birth (Candidate)</strong> — Novel input → AI interprets → stored as candidate</li>
        <li><strong>Growth</strong> — Similar input matched (cosine ≥ 0.92) → increment usage</li>
        <li><strong>Promotion (Proven)</strong> — Usage ≥ 3 AND confirmation ≥ 0.8 → deterministic</li>
        <li><strong>Deprecation</strong> — Confirmation &lt; 0.5 after 5+ uses → deprecated</li>
      </ul>

      <h2>Proven Recipes</h2>
      <p>Specific component + variant + configuration that was approved, capturing the full context (site type, industry, personality, page position).</p>

      <h2>Theme Library Growth</h2>
      <p>Every approved theme is saved with its personality vector, token set, preset base, and industry tags — creating a searchable library of proven themes.</p>

      <h2>Content Pattern Templates</h2>
      <p>When AI-generated copy is approved, patterns are extracted:</p>
      <pre><code>{`// Example patterns for luxury med spa:
Hero headline: "[Discover/Experience] [Noun] at [Business Name]"
CTA: "[Action Verb] Your [Outcome] Today"`}</code></pre>

      <h2>Similarity Matching</h2>
      <p>Semantic embeddings enable matching:</p>
      <table>
        <thead>
          <tr><th>Similarity</th><th>Action</th></tr>
        </thead>
        <tbody>
          <tr><td>≥ 0.97</td><td>Exact match — use directly</td></tr>
          <tr><td>0.92 – 0.97</td><td>Strong match — use with confidence</td></tr>
          <tr><td>0.85 – 0.92</td><td>Partial match — AI refines</td></tr>
          <tr><td>&lt; 0.85</td><td>No match — full AI interpretation</td></tr>
        </tbody>
      </table>

      <h2>Feedback Loop</h2>
      <p><strong>Explicit:</strong> Approve/reject previews, request changes, rate satisfaction.</p>
      <p><strong>Implicit:</strong> Time per step, change request count, component removal frequency, theme modification frequency.</p>

      <h2>Data Hygiene</h2>
      <ul>
        <li>Similar paths (similarity &gt; 0.97) are merged</li>
        <li>Unused candidates archived after 90 days</li>
        <li>User-specific content stripped before storing patterns</li>
      </ul>
    </>
  );
}

function RoadmapContent(): React.ReactElement {
  const phases = [
    {
      number: 1,
      title: "Platform Website & Foundation",
      status: "current" as const,
      items: [
        "Next.js project with App Router, TypeScript, Tailwind CSS",
        "Convex backend setup with initial schema",
        "Homepage — product landing page",
        "Demo page — working intake flow (Steps 1-4)",
        "Docs page — full project documentation",
        "Platform layout and responsive design",
      ],
    },
    {
      number: 2,
      title: "Core Component Library",
      status: "upcoming" as const,
      items: [
        "Theme token system (CSS Custom Properties + Tailwind)",
        "Theme generation from personality vector",
        "3 theme presets (Luxury, Modern Clean, Warm Professional)",
        "10 core components with 2-3 variants each",
        "Component manifest system",
        "Section wrapper component",
      ],
    },
    {
      number: 3,
      title: "Intent Capture System",
      status: "upcoming" as const,
      items: [
        "Full 6-step intake flow UI",
        "Brand personality visual comparison system",
        "Claude API integration for discovery + spec generation",
        "Site Intent Document generation",
        "Intent path storage (knowledge base foundation)",
      ],
    },
    {
      number: 4,
      title: "Assembly Engine & Preview",
      status: "upcoming" as const,
      items: [
        "Assembly engine (spec → component composition)",
        "Theme resolver",
        "Live preview renderer",
        "Preview approval/change request flow",
        "AI copy generation",
        "Preview sharing",
      ],
    },
    {
      number: 5,
      title: "Expand Component Library",
      status: "future" as const,
      items: [
        "Parallax hero, video hero, centered nav",
        "Gallery, team grid, commerce components",
        "Stats, before/after, accordion, timeline",
        "5+ additional theme presets",
      ],
    },
    {
      number: 6,
      title: "Knowledge Base & Learning",
      status: "future" as const,
      items: [
        "Semantic embeddings for intent paths",
        "Vector search for similarity matching",
        "Path lifecycle management",
        "Proven recipe system",
        "Analytics dashboard",
      ],
    },
    {
      number: 7,
      title: "Build & Deploy Pipeline",
      status: "future" as const,
      items: [
        "Next.js project generator",
        "Vercel deployment via API",
        "ZIP export for one-time purchase",
        "Custom domain configuration",
      ],
    },
    {
      number: 8,
      title: "Visual Editor & Subscriptions",
      status: "future" as const,
      items: [
        "Inline text editing",
        "Image replacement",
        "Component reordering (drag and drop)",
        "User auth and project dashboard",
        "Stripe payment integration",
      ],
    },
    {
      number: 9,
      title: "Commerce & Advanced Features",
      status: "future" as const,
      items: [
        "E-commerce components",
        "Booking/calendar components",
        "Membership/gating",
        "Blog/CMS, SEO tools, analytics",
      ],
    },
    {
      number: 10,
      title: "Scale & Optimize",
      status: "future" as const,
      items: [
        "Performance optimization (Core Web Vitals)",
        "Load testing and scaling",
        "API rate limiting and caching",
        "Public launch",
      ],
    },
  ];

  return (
    <>
      <h1>Roadmap</h1>
      <p>
        EasyWebsiteBuild is being built in 10 progressive phases, each adding a major capability layer.
      </p>

      {phases.map((phase) => (
        <div key={phase.number} style={{ marginBottom: "2rem" }}>
          <h2>
            Phase {phase.number}: {phase.title}
            {phase.status === "current" && (
              <span
                style={{
                  marginLeft: "0.75rem",
                  fontSize: "0.75rem",
                  padding: "0.15rem 0.6rem",
                  borderRadius: "9999px",
                  background: "var(--color-accent-glow)",
                  color: "var(--color-accent)",
                  border: "1px solid var(--color-border-accent)",
                  verticalAlign: "middle",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Current
              </span>
            )}
          </h2>
          <ul>
            {phase.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
