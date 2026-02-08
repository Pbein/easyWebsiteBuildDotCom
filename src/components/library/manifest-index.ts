/**
 * Component manifest index — used by the assembly engine to discover,
 * filter, and configure library components.
 *
 * Each manifest describes a component's metadata, personality fit ranges,
 * required/optional props, consumed tokens, and available variants.
 */

import navStickyManifest from "./navigation/nav-sticky/nav-sticky.manifest.json";
import sectionManifest from "./layout/section/section.manifest.json";
import heroCenteredManifest from "./hero/hero-centered/hero-centered.manifest.json";
import heroSplitManifest from "./hero/hero-split/hero-split.manifest.json";
import contentFeaturesManifest from "./content/content-features/content-features.manifest.json";
import contentSplitManifest from "./content/content-split/content-split.manifest.json";
import contentTextManifest from "./content/content-text/content-text.manifest.json";
import ctaBannerManifest from "./cta/cta-banner/cta-banner.manifest.json";
import formContactManifest from "./forms/form-contact/form-contact.manifest.json";
import footerStandardManifest from "./footer/footer-standard/footer-standard.manifest.json";
import proofTestimonialsManifest from "./social-proof/proof-testimonials/proof-testimonials.manifest.json";

export interface ComponentManifest {
  id: string;
  category: string;
  name: string;
  description: string;
  siteTypes: string[];
  personalityFit: Record<string, number[]>;
  requiredProps: { name: string; type: string; description?: string }[];
  optionalProps: { name: string; type: string; description?: string }[];
  consumedTokens: string[];
  variants: { id: string; name: string; description?: string }[];
  tags: string[];
}

/** All component manifests in the library. */
export const COMPONENT_MANIFESTS: ComponentManifest[] = [
  navStickyManifest,
  sectionManifest,
  heroCenteredManifest,
  heroSplitManifest,
  contentFeaturesManifest,
  contentSplitManifest,
  contentTextManifest,
  ctaBannerManifest,
  formContactManifest,
  footerStandardManifest,
  proofTestimonialsManifest,
] as ComponentManifest[];

/** Look up a component manifest by its ID. */
export function getManifestById(id: string): ComponentManifest | undefined {
  return COMPONENT_MANIFESTS.find((m) => m.id === id);
}

/** Filter manifests by category. */
export function getManifestsByCategory(category: string): ComponentManifest[] {
  return COMPONENT_MANIFESTS.filter((m) => m.category === category);
}

/** Filter manifests by site type. */
export function getManifestsBySiteType(siteType: string): ComponentManifest[] {
  return COMPONENT_MANIFESTS.filter((m) => m.siteTypes.includes(siteType));
}
