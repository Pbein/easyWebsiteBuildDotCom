import { describe, it, expect } from "vitest";
import React from "react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import { Section } from "@/components/library";

describe("Section", () => {
  it("renders children correctly", () => {
    const { container } = renderWithTheme(
      <Section>
        <p>Hello Section</p>
      </Section>
    );
    expect(container.textContent).toContain("Hello Section");
  });

  it('background="default" renders', () => {
    expect(() => {
      renderWithTheme(
        <Section background="default">
          <p>Content</p>
        </Section>
      );
    }).not.toThrow();
  });

  it('background="surface" renders', () => {
    expect(() => {
      renderWithTheme(
        <Section background="surface">
          <p>Content</p>
        </Section>
      );
    }).not.toThrow();
  });

  it('background="primary" renders', () => {
    expect(() => {
      renderWithTheme(
        <Section background="primary">
          <p>Content</p>
        </Section>
      );
    }).not.toThrow();
  });

  it('background="dark" renders', () => {
    expect(() => {
      renderWithTheme(
        <Section background="dark">
          <p>Content</p>
        </Section>
      );
    }).not.toThrow();
  });

  it("contained=true adds container width constraint", () => {
    const { container } = renderWithTheme(
      <Section contained={true}>
        <p>Contained content</p>
      </Section>
    );
    // When contained=true, children are wrapped in a div with maxWidth set to
    // the theme container token. Look for a div with a maxWidth style.
    const innerDiv = container.querySelector("[style*='max-width']");
    expect(innerDiv).not.toBeNull();
  });

  it('spacing="lg" renders', () => {
    expect(() => {
      renderWithTheme(
        <Section spacing="lg">
          <p>Content</p>
        </Section>
      );
    }).not.toThrow();
  });

  it("renders as a section element by default", () => {
    const { container } = renderWithTheme(
      <Section>
        <p>Content</p>
      </Section>
    );
    // The Section component renders either a <section> (when animate=false)
    // or a motion.section (mocked as <section> by the setup mock).
    // Either way, we should find a section element in the output.
    const sectionElement = container.querySelector("section");
    expect(sectionElement).toBeInTheDocument();
  });
});
