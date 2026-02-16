import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import {
  createCtaBannerProps,
  createFormContactProps,
  createFooterStandardProps,
} from "../../helpers/component-fixtures";
import { CtaBanner, FormContact, FooterStandard } from "@/components/library";

/* ── CtaBanner ────────────────────────────────────────────────── */

describe("CtaBanner", () => {
  it("renders without crashing", () => {
    expect(() => {
      renderWithTheme(<CtaBanner {...createCtaBannerProps()} />);
    }).not.toThrow();
  });

  it("displays headline", () => {
    renderWithTheme(<CtaBanner {...createCtaBannerProps()} />);
    expect(screen.getByText("Ready to Get Started?")).toBeInTheDocument();
  });

  it("renders CTA button text", () => {
    renderWithTheme(<CtaBanner {...createCtaBannerProps()} />);
    expect(screen.getByText("Start Free")).toBeInTheDocument();
  });

  it('variant="full-width" renders', () => {
    expect(() => {
      renderWithTheme(<CtaBanner {...createCtaBannerProps({ variant: "full-width" })} />);
    }).not.toThrow();
  });
});

/* ── FormContact ──────────────────────────────────────────────── */

describe("FormContact", () => {
  it("renders without crashing", () => {
    expect(() => {
      renderWithTheme(<FormContact {...createFormContactProps()} />);
    }).not.toThrow();
  });

  it("displays headline", () => {
    renderWithTheme(<FormContact {...createFormContactProps()} />);
    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
  });

  it("renders form field labels", () => {
    renderWithTheme(<FormContact {...createFormContactProps()} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
  });

  it("renders submit button text", () => {
    renderWithTheme(<FormContact {...createFormContactProps()} />);
    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });
});

/* ── FooterStandard ───────────────────────────────────────────── */

describe("FooterStandard", () => {
  it("renders without crashing", () => {
    expect(() => {
      renderWithTheme(<FooterStandard {...createFooterStandardProps()} />);
    }).not.toThrow();
  });

  it("displays logo text", () => {
    renderWithTheme(<FooterStandard {...createFooterStandardProps()} />);
    expect(screen.getByText("TestBrand")).toBeInTheDocument();
  });

  it("renders column titles", () => {
    renderWithTheme(<FooterStandard {...createFooterStandardProps()} />);
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
  });

  it("displays copyright text", () => {
    renderWithTheme(<FooterStandard {...createFooterStandardProps()} />);
    expect(screen.getByText("2026 TestBrand. All rights reserved.")).toBeInTheDocument();
  });
});
