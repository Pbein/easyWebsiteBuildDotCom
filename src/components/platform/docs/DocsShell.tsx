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
  ArrowDownUp,
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
    headings: ["What is EasyWebsiteBuild?", "Core Principles", "Tech Stack", "Current Status"],
  },
  {
    id: "data-flow",
    label: "Data Flow",
    icon: ArrowDownUp,
    headings: [
      "End-to-End Pipeline",
      "User Input Phase",
      "AI Processing Phase",
      "Assembly Phase",
      "Export Phase",
      "Data Flow Diagram",
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
      "Step 5: Deep Discovery (AI)",
      "Step 6: Generation & Preview",
      "State Management",
      "Staleness Detection",
    ],
  },
  {
    id: "assembly-engine",
    label: "Core Engine",
    icon: Cpu,
    headings: [
      "Assembly Pipeline",
      "Theme Resolution",
      "Component Selection",
      "Variant Configuration",
      "Layout Composition",
      "Content Generation",
      "Live Preview",
      "Export Pipeline",
      "Component Registry",
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
      "Built Components (18)",
      "Component Categories",
      "Field Naming Reference",
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
      "Theme Presets (7)",
      "Theme Application",
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    icon: Layers,
    headings: [
      "System Overview",
      "Project Structure",
      "Database Schema",
      "API Integration",
      "Deployment Architecture",
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
    ],
  },
  {
    id: "roadmap",
    label: "Roadmap",
    icon: Map,
    headings: [
      "Phase 1: Platform Website",
      "Phase 2: Core Component Library",
      "Phase 3: AI Integration & Assembly",
      "Phase 4A: Quality Improvements",
      "Phase 4B: Expansion & Export",
      "Phase 5: Visual Editor & Deploy",
      "Phase 6–9: Future",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  DocsShell — interactive documentation shell                        */
/* ------------------------------------------------------------------ */

interface DocsShellProps {
  sectionContent: Record<string, React.ReactNode>;
}

export function DocsShell({ sectionContent }: DocsShellProps): React.ReactElement {
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      if (hash && sections.some((s) => s.id === hash)) {
        return hash;
      }
    }
    return "overview";
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSectionChange = useCallback((id: string): void => {
    setActiveSection(id);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-bg-primary)] shadow-[var(--shadow-lg)] lg:hidden"
        aria-label="Toggle navigation"
      >
        {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className="mx-auto flex max-w-[90rem]">
        {/* Left Sidebar */}
        <aside
          className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] transition-transform duration-300 lg:sticky lg:translate-x-0 ${
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="p-6">
            <p
              className="mb-4 text-xs font-semibold tracking-[0.15em] text-[var(--color-text-tertiary)] uppercase"
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
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "border border-[var(--color-border-accent)] bg-[var(--color-accent-glow)] text-[var(--color-accent)]"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      <section.icon className="h-4 w-4 shrink-0" />
                      <span style={{ fontFamily: "var(--font-heading)" }}>{section.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 px-6 py-10 lg:px-12">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="docs-content max-w-4xl"
          >
            {sectionContent[activeSection] ?? sectionContent["overview"]}
          </motion.div>

          {/* Prev / Next navigation */}
          <div className="mt-16 flex max-w-4xl justify-between border-t border-[var(--color-border)] pt-8">
            {(() => {
              const idx = sections.findIndex((s) => s.id === activeSection);
              const prev = idx > 0 ? sections[idx - 1] : null;
              const next = idx < sections.length - 1 ? sections[idx + 1] : null;
              return (
                <>
                  {prev ? (
                    <button
                      onClick={() => handleSectionChange(prev.id)}
                      className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                      {prev.label}
                    </button>
                  ) : (
                    <div />
                  )}
                  {next ? (
                    <button
                      onClick={() => handleSectionChange(next.id)}
                      className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      {next.label}
                      <ChevronRight className="h-4 w-4" />
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
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto p-6 xl:block">
          <p
            className="mb-4 text-xs font-semibold tracking-[0.15em] text-[var(--color-text-tertiary)] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            On This Page
          </p>
          <ul className="space-y-2">
            {currentSection.headings.map((heading) => (
              <li key={heading}>
                <span className="block cursor-default text-xs leading-snug text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
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
