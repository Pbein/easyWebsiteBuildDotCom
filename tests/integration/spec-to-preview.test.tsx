import { render } from "@testing-library/react";
import { AssemblyRenderer } from "@/lib/assembly/AssemblyRenderer";
import type { SiteIntentDocument } from "@/lib/assembly/spec.types";
import type { ReactNode } from "react";

/* ────────────────────────────────────────────────────────────
 * Mocks
 * ──────────────────────────────────────────────────────────── */

vi.mock("@/lib/assembly/font-loader", () => ({
  loadGoogleFonts: vi.fn(),
}));

vi.mock("framer-motion", () => {
  const el = (Tag: string) => {
    const C = ({ children, ...props }: { children?: ReactNode; [k: string]: unknown }) => {
      // Filter out motion-specific props
      const filtered: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (
          !k.startsWith("animate") &&
          !k.startsWith("initial") &&
          !k.startsWith("exit") &&
          !k.startsWith("transition") &&
          !k.startsWith("variants") &&
          !k.startsWith("while") &&
          k !== "layout" &&
          k !== "layoutId" &&
          k !== "drag" &&
          k !== "onDrag"
        )
          filtered[k] = v;
      }
      return (
        <>
          {Tag === "img" ? (
            <img {...(filtered as React.ImgHTMLAttributes<HTMLImageElement>)} alt="" />
          ) : (
            <div data-testid={`motion-${Tag}`} {...filtered}>
              {children}
            </div>
          )}
        </>
      );
    };
    C.displayName = `Motion${Tag}`;
    return C;
  };

  return {
    motion: {
      div: el("div"),
      section: el("section"),
      span: el("span"),
      nav: el("nav"),
      p: el("p"),
      h1: el("h1"),
      h2: el("h2"),
      h3: el("h3"),
      ul: el("ul"),
      li: el("li"),
      a: el("a"),
      img: el("img"),
      button: el("button"),
      footer: el("footer"),
      header: el("header"),
    },
    AnimatePresence: ({ children }: { children?: ReactNode }) => <>{children}</>,
    useInView: () => true,
    useAnimation: () => ({ start: vi.fn(), set: vi.fn() }),
    useMotionValue: (val: number) => ({ get: () => val, set: vi.fn() }),
    useTransform: (_val: unknown, _input: unknown, output: number[]) => ({
      get: () => output[0],
    }),
    useScroll: () => ({
      scrollY: { get: () => 0 },
      scrollYProgress: { get: () => 0 },
    }),
  };
});

/* ────────────────────────────────────────────────────────────
 * Fixtures
 * ──────────────────────────────────────────────────────────── */

const minimalSpec: SiteIntentDocument = {
  sessionId: "test-001",
  businessName: "TestBiz Co",
  tagline: "Testing made easy",
  siteType: "business",
  conversionGoal: "contact",
  personalityVector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  pages: [
    {
      slug: "/",
      title: "Home",
      purpose: "Test page",
      components: [
        {
          componentId: "nav-sticky",
          variant: "transparent",
          order: 0,
          content: {
            logoText: "TestBiz Co",
            links: [{ label: "Home", href: "/" }],
            cta: { text: "Contact", href: "#" },
          },
        },
        {
          componentId: "content-text",
          variant: "centered",
          order: 1,
          content: {
            headline: "About TestBiz",
            body: "We do testing.",
          },
        },
        {
          componentId: "footer-standard",
          variant: "multi-column",
          order: 99,
          content: {
            logoText: "TestBiz Co",
            copyright: "\u00a9 2026",
            columns: [],
            socialLinks: [],
          },
        },
      ],
    },
  ],
  metadata: { generatedAt: Date.now(), method: "deterministic" },
};

/* ────────────────────────────────────────────────────────────
 * Integration: Spec → Preview Rendering
 * ──────────────────────────────────────────────────────────── */

describe("AssemblyRenderer — spec to preview integration", () => {
  it("renders without crashing given a minimal spec", () => {
    expect(() => {
      render(<AssemblyRenderer spec={minimalSpec} />);
    }).not.toThrow();
  });

  it("renders the business name in the output", () => {
    const { container } = render(<AssemblyRenderer spec={minimalSpec} />);
    expect(container.textContent).toContain("TestBiz Co");
  });

  it("skips an invalid componentId without crashing", () => {
    const specWithInvalid: SiteIntentDocument = {
      ...minimalSpec,
      pages: [
        {
          ...minimalSpec.pages[0],
          components: [
            ...minimalSpec.pages[0].components,
            {
              componentId: "nonexistent-widget",
              variant: "default",
              order: 2,
              content: {},
            },
          ],
        },
      ],
    };

    expect(() => {
      render(<AssemblyRenderer spec={specWithInvalid} />);
    }).not.toThrow();

    // The valid components should still render
    const { container } = render(<AssemblyRenderer spec={specWithInvalid} />);
    expect(container.textContent).toContain("TestBiz Co");
  });

  it("applies CSS custom properties to the wrapper div", () => {
    const { container } = render(<AssemblyRenderer spec={minimalSpec} />);

    // The ThemeProvider wraps children in a div with CSS variables,
    // and AssemblyRenderer adds a min-h-screen div inside it.
    // We look for any element that has a style attribute with CSS custom properties.
    const styledElements = container.querySelectorAll("[style]");
    const hasCustomProperties = Array.from(styledElements).some(
      (el) =>
        el.getAttribute("style")?.includes("--color-primary") ||
        el.getAttribute("style")?.includes("--color-background")
    );

    expect(hasCustomProperties).toBe(true);
  });
});
