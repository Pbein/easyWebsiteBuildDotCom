import type { SiteIntentDocument } from "@/lib/assembly/spec.types";

/** Assert a spec has the minimal required structure */
export function assertValidSpec(spec: SiteIntentDocument): void {
  expect(spec).toBeDefined();
  expect(spec.sessionId).toBeTruthy();
  expect(spec.siteType).toBeTruthy();
  expect(spec.conversionGoal).toBeTruthy();
  expect(spec.businessName).toBeTruthy();
  expect(spec.tagline).toBeTruthy();
  expect(spec.personalityVector).toHaveLength(6);
  expect(spec.pages).toHaveLength(1);
  expect(spec.pages[0].components.length).toBeGreaterThan(0);
  expect(spec.metadata).toBeDefined();
  expect(spec.metadata.method).toMatch(/^(ai|deterministic)$/);
  expect(spec.metadata.generatedAt).toBeGreaterThan(0);
}

/** Assert that the business name appears in key content areas */
export function assertBusinessNameUsed(spec: SiteIntentDocument, businessName: string): void {
  const heroComponent = spec.pages[0].components.find(
    (c) => c.componentId === "hero-centered" || c.componentId === "hero-split"
  );
  expect(heroComponent).toBeDefined();
  const headline = (heroComponent?.content?.headline as string) || "";
  expect(headline.toLowerCase()).toContain(businessName.toLowerCase());
}

/** Assert that the CTA text matches the conversion goal's voice */
export function assertCTAMatchesGoal(spec: SiteIntentDocument): void {
  const ctaBanner = spec.pages[0].components.find((c) => c.componentId === "cta-banner");
  expect(ctaBanner).toBeDefined();
  const ctaPrimary = ctaBanner?.content?.ctaPrimary as { text: string } | undefined;
  expect(ctaPrimary?.text).toBeTruthy();
}
