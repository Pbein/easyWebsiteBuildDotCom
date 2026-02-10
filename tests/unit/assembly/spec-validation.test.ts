import { describe, it, expect } from "vitest";
import {
  createMinimalSpec,
  createFullSpec,
  createSpecWithInvalidComponent,
} from "../../helpers/fixtures";
import { isRegistered } from "@/lib/assembly/component-registry";

describe("SiteIntentDocument validation", () => {
  it("minimal spec has all required fields", () => {
    const spec = createMinimalSpec();
    expect(spec.sessionId).toBeTruthy();
    expect(spec.siteType).toBe("business");
    expect(spec.conversionGoal).toBe("contact");
    expect(spec.businessName).toBe("TestBiz Co");
    expect(spec.personalityVector).toHaveLength(6);
    expect(spec.pages).toHaveLength(1);
    expect(spec.metadata.method).toBe("deterministic");
  });

  it("full spec contains all 18 component types", () => {
    const spec = createFullSpec();
    const componentIds = spec.pages[0].components.map((c) => c.componentId);
    const uniqueIds = new Set(componentIds);
    expect(uniqueIds.size).toBe(18);
  });

  it("all components in minimal spec are registered", () => {
    const spec = createMinimalSpec();
    for (const component of spec.pages[0].components) {
      expect(isRegistered(component.componentId)).toBe(true);
    }
  });

  it("components have sequential order values", () => {
    const spec = createMinimalSpec();
    const orders = spec.pages[0].components.map((c) => c.order);
    for (let i = 0; i < orders.length; i++) {
      expect(orders[i]).toBe(i);
    }
  });

  it("metadata has valid method field", () => {
    const spec = createMinimalSpec();
    expect(["ai", "deterministic"]).toContain(spec.metadata.method);
  });

  it("supports overrides", () => {
    const spec = createMinimalSpec({
      businessName: "Override Inc",
      siteType: "portfolio",
    });
    expect(spec.businessName).toBe("Override Inc");
    expect(spec.siteType).toBe("portfolio");
  });

  it("spec with invalid component has unregistered component", () => {
    const spec = createSpecWithInvalidComponent();
    const comp = spec.pages[0].components[0];
    expect(isRegistered(comp.componentId)).toBe(false);
  });

  it("personality vector values are in 0-1 range", () => {
    const spec = createMinimalSpec();
    for (const val of spec.personalityVector) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1);
    }
  });

  it("metadata generatedAt is a valid timestamp", () => {
    const spec = createMinimalSpec();
    expect(spec.metadata.generatedAt).toBeGreaterThan(0);
    expect(spec.metadata.generatedAt).toBeLessThanOrEqual(Date.now() + 1000);
  });
});
