/**
 * @requirements
 *
 * Section is the universal layout wrapper for all component library sections.
 *
 * REQ-SEC-01: Renders as a <section> HTML element.
 * REQ-SEC-02: Renders children content inside the section.
 * REQ-SEC-03: `contained=true` wraps children in a div with maxWidth constraint.
 * REQ-SEC-04: `background` prop accepts 6 variants: default | surface | elevated | primary | dark | none.
 * REQ-SEC-05: "primary" background sets text color to `var(--color-text-on-primary)`.
 * REQ-SEC-06: "dark" background sets text color to `var(--color-text-on-dark)`.
 * REQ-SEC-07: `spacing` prop accepts 5 presets: none | sm | md | lg | xl.
 * REQ-SEC-08: `pattern` prop renders a decorative overlay div with CSS background pattern.
 * REQ-SEC-09: Pattern overlay has `aria-hidden="true"` for accessibility.
 * REQ-SEC-10: `dividerTop` prop renders a SectionDivider element at the top.
 * REQ-SEC-11: `dividerBottom` prop renders a SectionDivider element at the bottom.
 * REQ-SEC-12: All 6 background variants render without crashing.
 * REQ-SEC-13: All 5 spacing presets render without crashing.
 */

import { describe, it, expect } from "vitest";
import React from "react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import { Section } from "@/components/library";

describe("Section", () => {
  // ── REQ-SEC-01: Renders as a <section> element ────────────
  it("renders as a <section> element by default", () => {
    const { container } = renderWithTheme(
      <Section>
        <p>Content</p>
      </Section>
    );
    // Section renders either <section> (animate=false) or motion.section
    // (mocked as <section> in test setup). Either way, section must exist.
    const sectionElement = container.querySelector("section");
    expect(sectionElement).toBeInTheDocument();
  });

  // ── REQ-SEC-02: Renders children ──────────────────────────
  it("renders children correctly", () => {
    const { container } = renderWithTheme(
      <Section>
        <p>Hello Section</p>
      </Section>
    );
    expect(container.textContent).toContain("Hello Section");
  });

  // ── REQ-SEC-03: contained=true adds maxWidth ──────────────
  it("contained=true adds container width constraint", () => {
    const { container } = renderWithTheme(
      <Section contained={true}>
        <p>Contained content</p>
      </Section>
    );
    const innerDiv = container.querySelector("[style*='max-width']");
    expect(innerDiv).not.toBeNull();
  });

  // ── REQ-SEC-05: "primary" background text color ───────────
  it('background="primary" applies var(--color-text-on-primary) text color', () => {
    const { container } = renderWithTheme(
      <Section background="primary">
        <p>Primary content</p>
      </Section>
    );
    const sectionEl = container.querySelector("section");
    expect(sectionEl).not.toBeNull();
    const style = sectionEl!.getAttribute("style") || "";
    expect(style).toContain("var(--color-text-on-primary)");
  });

  // ── REQ-SEC-06: "dark" background text color ──────────────
  it('background="dark" applies var(--color-text-on-dark) text color', () => {
    const { container } = renderWithTheme(
      <Section background="dark">
        <p>Dark content</p>
      </Section>
    );
    const sectionEl = container.querySelector("section");
    expect(sectionEl).not.toBeNull();
    const style = sectionEl!.getAttribute("style") || "";
    expect(style).toContain("var(--color-text-on-dark)");
  });

  // ── REQ-SEC-08 + REQ-SEC-09: Pattern prop renders overlay ─
  it("pattern prop renders a decorative overlay element with aria-hidden", () => {
    const patternCSS = "radial-gradient(circle, #ccc 1px, transparent 1px)";
    const { container } = renderWithTheme(
      <Section pattern={patternCSS} patternOpacity={0.1}>
        <p>Patterned section</p>
      </Section>
    );
    // The pattern overlay is a div with aria-hidden="true" inside the section
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).not.toBeNull();
    const overlayStyle = overlay!.getAttribute("style") || "";
    // The background style should contain the pattern CSS value
    expect(overlayStyle).toContain("radial-gradient");
  });

  // ── REQ-SEC-10: dividerTop renders a divider ──────────────
  it('dividerTop="wave" renders a divider element at the top', () => {
    const { container } = renderWithTheme(
      <Section dividerTop="wave">
        <p>Section with top divider</p>
      </Section>
    );
    // SectionDivider renders a div with aria-hidden="true" containing an SVG.
    // There should be an SVG element for the wave divider inside the section.
    const sectionEl = container.querySelector("section");
    expect(sectionEl).not.toBeNull();
    const svgs = sectionEl!.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  // ── REQ-SEC-11: dividerBottom renders a divider ───────────
  it('dividerBottom="angle" renders a divider element at the bottom', () => {
    const { container } = renderWithTheme(
      <Section dividerBottom="angle">
        <p>Section with bottom divider</p>
      </Section>
    );
    const sectionEl = container.querySelector("section");
    expect(sectionEl).not.toBeNull();
    const svgs = sectionEl!.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  // ── REQ-SEC-12: All 6 background variants render ──────────
  it.each(["default", "surface", "elevated", "primary", "dark", "none"] as const)(
    'background="%s" renders without crashing',
    (bg) => {
      expect(() => {
        renderWithTheme(
          <Section background={bg}>
            <p>Content</p>
          </Section>
        );
      }).not.toThrow();
    }
  );

  // ── REQ-SEC-13: All 5 spacing presets render ──────────────
  it.each(["none", "sm", "md", "lg", "xl"] as const)(
    'spacing="%s" renders without crashing',
    (sp) => {
      expect(() => {
        renderWithTheme(
          <Section spacing={sp}>
            <p>Content</p>
          </Section>
        );
      }).not.toThrow();
    }
  );
});
