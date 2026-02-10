import type { SiteIntentDocument } from "@/lib/assembly/spec.types";
import type { PersonalityVector } from "@/lib/theme/theme.types";

/** Named personality vectors for testing */
export const PERSONALITY_VECTORS = {
  minimal: [0.1, 0.5, 0.5, 0.3, 0.5, 0.3] as PersonalityVector,
  rich: [0.9, 0.5, 0.5, 0.7, 0.5, 0.7] as PersonalityVector,
  playful: [0.5, 0.1, 0.5, 0.4, 0.5, 0.8] as PersonalityVector,
  serious: [0.5, 0.9, 0.5, 0.6, 0.5, 0.3] as PersonalityVector,
  warm: [0.5, 0.5, 0.1, 0.5, 0.3, 0.5] as PersonalityVector,
  cool: [0.5, 0.5, 0.9, 0.5, 0.8, 0.5] as PersonalityVector,
  light: [0.3, 0.5, 0.5, 0.2, 0.5, 0.5] as PersonalityVector,
  bold: [0.7, 0.5, 0.5, 0.8, 0.5, 0.5] as PersonalityVector,
  classic: [0.5, 0.5, 0.5, 0.5, 0.1, 0.5] as PersonalityVector,
  modern: [0.5, 0.5, 0.5, 0.5, 0.9, 0.5] as PersonalityVector,
  balanced: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5] as PersonalityVector,
};

/** Create a minimal valid SiteIntentDocument */
export function createMinimalSpec(overrides: Partial<SiteIntentDocument> = {}): SiteIntentDocument {
  return {
    sessionId: "test_session_123",
    siteType: "business",
    conversionGoal: "contact",
    personalityVector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    businessName: "TestBiz Co",
    tagline: "Professional solutions tailored to your needs",
    pages: [
      {
        slug: "/",
        title: "Home",
        purpose: "Primary landing page",
        components: [
          {
            componentId: "nav-sticky",
            variant: "transparent",
            order: 0,
            content: {
              logoText: "TestBiz Co",
              links: [{ label: "Home", href: "#" }],
              cta: { text: "Get Started", href: "#contact" },
            },
          },
          {
            componentId: "hero-centered",
            variant: "gradient-bg",
            order: 1,
            content: {
              headline: "Welcome to TestBiz Co",
              subheadline: "Professional solutions tailored to your needs",
              ctaPrimary: { text: "Get Started", href: "#contact" },
              ctaSecondary: { text: "Learn More", href: "#about" },
            },
          },
          {
            componentId: "content-text",
            variant: "centered",
            order: 2,
            content: {
              eyebrow: "About Us",
              headline: "Why Choose TestBiz Co",
              body: "<p>We deliver exceptional results.</p>",
            },
          },
          {
            componentId: "footer-standard",
            variant: "multi-column",
            order: 3,
            content: {
              logoText: "TestBiz Co",
              copyright: "\u00a9 2026 TestBiz Co",
              columns: [
                {
                  title: "Links",
                  links: [{ label: "Home", href: "#" }],
                },
              ],
              socialLinks: [],
            },
          },
        ],
      },
    ],
    metadata: {
      generatedAt: Date.now(),
      method: "deterministic",
    },
    ...overrides,
  };
}

/** Create a spec with all 18 component types */
export function createFullSpec(): SiteIntentDocument {
  return createMinimalSpec({
    pages: [
      {
        slug: "/",
        title: "Home",
        purpose: "Full demo page",
        components: [
          {
            componentId: "nav-sticky",
            variant: "transparent",
            order: 0,
            content: { logoText: "Full Demo", links: [], cta: { text: "CTA", href: "#" } },
          },
          {
            componentId: "hero-centered",
            variant: "gradient-bg",
            order: 1,
            content: {
              headline: "Test Headline",
              subheadline: "Sub",
              ctaPrimary: { text: "Go", href: "#" },
            },
          },
          {
            componentId: "hero-split",
            variant: "image-right",
            order: 2,
            content: {
              headline: "Split Hero",
              subheadline: "Sub",
              image: { src: "https://example.com/img.jpg", alt: "test" },
            },
          },
          {
            componentId: "content-features",
            variant: "icon-cards",
            order: 3,
            content: {
              headline: "Features",
              features: [{ icon: "Target", title: "Feature 1", description: "Desc" }],
            },
          },
          {
            componentId: "content-split",
            variant: "alternating",
            order: 4,
            content: {
              headline: "Split Content",
              rows: [
                {
                  title: "Row 1",
                  body: "Body",
                  image: { src: "https://example.com/img.jpg", alt: "test" },
                },
              ],
            },
          },
          {
            componentId: "content-text",
            variant: "centered",
            order: 5,
            content: { headline: "Text Section", body: "<p>Body text</p>" },
          },
          {
            componentId: "content-stats",
            variant: "cards",
            order: 6,
            content: { headline: "Stats", stats: [{ value: 100, label: "Users", suffix: "+" }] },
          },
          {
            componentId: "content-accordion",
            variant: "single-open",
            order: 7,
            content: { headline: "FAQ", items: [{ question: "Q?", answer: "A." }] },
          },
          {
            componentId: "content-timeline",
            variant: "vertical",
            order: 8,
            content: {
              headline: "Timeline",
              items: [{ date: "2024", title: "Event", description: "Desc" }],
            },
          },
          {
            componentId: "content-logos",
            variant: "grid",
            order: 9,
            content: { headline: "Trusted By", logos: [{ name: "Company A" }] },
          },
          {
            componentId: "cta-banner",
            variant: "full-width",
            order: 10,
            content: {
              headline: "CTA",
              subheadline: "Act now",
              ctaPrimary: { text: "Go", href: "#" },
            },
          },
          {
            componentId: "form-contact",
            variant: "simple",
            order: 11,
            content: {
              headline: "Contact",
              fields: [{ name: "email", label: "Email", type: "email", required: true }],
              submitText: "Send",
            },
          },
          {
            componentId: "proof-testimonials",
            variant: "carousel",
            order: 12,
            content: {
              headline: "Testimonials",
              testimonials: [{ quote: "Great!", name: "Jane", role: "CEO", rating: 5 }],
            },
          },
          {
            componentId: "proof-beforeafter",
            variant: "side-by-side",
            order: 13,
            content: {
              headline: "Before & After",
              comparisons: [
                {
                  before: { src: "a.jpg", alt: "before" },
                  after: { src: "b.jpg", alt: "after" },
                  label: "Transformation",
                },
              ],
            },
          },
          {
            componentId: "team-grid",
            variant: "cards",
            order: 14,
            content: {
              headline: "Team",
              members: [{ name: "John", role: "CEO", image: "https://example.com/john.jpg" }],
            },
          },
          {
            componentId: "commerce-services",
            variant: "card-grid",
            order: 15,
            content: {
              headline: "Services",
              services: [{ name: "Service A", description: "Desc", price: "$99" }],
            },
          },
          {
            componentId: "media-gallery",
            variant: "grid",
            order: 16,
            content: {
              headline: "Gallery",
              images: [{ src: "https://example.com/img.jpg", alt: "photo" }],
            },
          },
          {
            componentId: "footer-standard",
            variant: "multi-column",
            order: 17,
            content: {
              logoText: "Full Demo",
              copyright: "\u00a9 2026",
              columns: [{ title: "Links", links: [{ label: "Home", href: "#" }] }],
              socialLinks: [],
            },
          },
        ],
      },
    ],
  });
}

/** Create a spec with an invalid/unknown component */
export function createSpecWithInvalidComponent(): SiteIntentDocument {
  return createMinimalSpec({
    pages: [
      {
        slug: "/",
        title: "Home",
        purpose: "Test invalid component",
        components: [
          {
            componentId: "nonexistent-component",
            variant: "default",
            order: 0,
            content: {},
          },
        ],
      },
    ],
  });
}
