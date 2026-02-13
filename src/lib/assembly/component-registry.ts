import type { ComponentType } from "react";
import {
  NavSticky,
  HeroCentered,
  HeroSplit,
  HeroVideo,
  ContentFeatures,
  ContentSplit,
  ContentText,
  ContentStats,
  ContentAccordion,
  ContentTimeline,
  ContentLogos,
  ContentSteps,
  ContentComparison,
  ContentMap,
  BlogPreview,
  CtaBanner,
  FormContact,
  ProofTestimonials,
  ProofBeforeAfter,
  TeamGrid,
  CommerceServices,
  PricingTable,
  MediaGallery,
  FooterStandard,
} from "@/components/library";

/* eslint-disable @typescript-eslint/no-explicit-any */
const COMPONENT_REGISTRY: Record<string, ComponentType<any>> = {
  "nav-sticky": NavSticky,
  "hero-centered": HeroCentered,
  "hero-split": HeroSplit,
  "content-features": ContentFeatures,
  "content-split": ContentSplit,
  "content-text": ContentText,
  "content-stats": ContentStats,
  "content-accordion": ContentAccordion,
  "content-timeline": ContentTimeline,
  "content-logos": ContentLogos,
  "cta-banner": CtaBanner,
  "form-contact": FormContact,
  "proof-testimonials": ProofTestimonials,
  "proof-beforeafter": ProofBeforeAfter,
  "team-grid": TeamGrid,
  "commerce-services": CommerceServices,
  "media-gallery": MediaGallery,
  "pricing-table": PricingTable,
  "content-steps": ContentSteps,
  "content-comparison": ContentComparison,
  "hero-video": HeroVideo,
  "blog-preview": BlogPreview,
  "content-map": ContentMap,
  "footer-standard": FooterStandard,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Look up a React component by its string ID.
 * Returns undefined if the component is not registered.
 */
export function getComponent(
  componentId: string
): ComponentType<Record<string, unknown>> | undefined {
  return COMPONENT_REGISTRY[componentId];
}

/**
 * Check if a component ID is registered.
 */
export function isRegistered(componentId: string): boolean {
  return componentId in COMPONENT_REGISTRY;
}

/**
 * Components that should NOT be wrapped in a Section layout component.
 * They handle their own full-width rendering.
 */
export const UNWRAPPED_COMPONENTS = new Set(["nav-sticky", "footer-standard"]);
