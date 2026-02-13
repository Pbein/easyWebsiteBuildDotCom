export type { SiteIntentDocument, PageSpec, ComponentPlacement, VisualConfig } from "./spec.types";
export { AssemblyRenderer } from "./AssemblyRenderer";
export { getComponent, isRegistered, UNWRAPPED_COMPONENTS } from "./component-registry";
export { loadGoogleFonts } from "./font-loader";
export { validateSpecContent, fixSpecContent } from "./validate-spec";
export type { ValidationResult, ValidationWarning, AutoFix, FixResult } from "./validate-spec";
