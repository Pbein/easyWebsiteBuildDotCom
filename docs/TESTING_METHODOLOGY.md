# Testing Methodology — Requirements-First Testing

> **Core principle**: Every test must be traceable to a requirement, contract, or specification that exists independently of the source code. If you can't articulate what the test is protecting without referencing how the code currently works, it's not a real test — it's a mirror.

## The Problem This Solves

The most common testing failure is **tautological testing**: reading source code, then writing tests that confirm the code does what it currently does. These tests:

- Pass even when the code has bugs (because the test was written to match the bug)
- Break on any refactor (because they test implementation, not behavior)
- Give false confidence ("864 tests passing!" but none catch real issues)
- Waste time maintaining tests that protect nothing

## The Requirements-First Process

### Before Writing ANY Test — Complete This Checklist

Every test file must begin with the author completing these steps mentally (and documenting in the test file header):

#### Step 1: Identify the Requirement Source

Where does the expected behavior come from? Valid sources:

| Source                     | Example                                                       | Reliability                        |
| -------------------------- | ------------------------------------------------------------- | ---------------------------------- |
| **Type interface**         | `PersonalityVector` is a 6-element tuple of numbers 0-1       | HIGH — compiler-enforced           |
| **CLAUDE.md rule**         | "Library components NEVER hardcode visual values"             | HIGH — architectural law           |
| **Product spec / UX rule** | "Express path completes in 3 steps"                           | HIGH — user-visible contract       |
| **Bug report**             | "Nav logo click breaks out of iframe"                         | HIGH — defined failure case        |
| **API contract**           | `getSiteSpec(sessionId)` returns the most recent spec or null | HIGH — documented interface        |
| **Business logic**         | "Anti-references must change theme output"                    | MEDIUM — intent is clear           |
| **Domain knowledge**       | "Warm voice should feel conversational"                       | MEDIUM — subjective but defensible |

**Invalid source**: "I read the code and it returns X, so I'll test that it returns X."

#### Step 2: Write the Assertion BEFORE Looking at Implementation

For each test, write the `expect()` line first. Ask: "What SHOULD the answer be?" — not "What does the code return?"

```typescript
// WRONG process: Read code → see it returns "Let's chat" → test for "Let's chat"
// RIGHT process: Read spec → warm voice = "conversational, friendly" → test for conversational qualities
```

#### Step 3: Classify the Test

Every test must fit one of these categories:

| Category        | What It Tests                         | Example                                            |
| --------------- | ------------------------------------- | -------------------------------------------------- |
| **Requirement** | A product/UX behavior users depend on | "Express path skips steps 4-8"                     |
| **Contract**    | An API or type interface boundary     | "personalityVector has exactly 6 elements"         |
| **Invariant**   | A rule that must ALWAYS hold          | "No component renders hardcoded hex colors"        |
| **Boundary**    | Edge cases and limits                 | "Max 2 emotions enforced even with rapid clicks"   |
| **Regression**  | A specific bug that was fixed         | "Iframe links don't navigate to platform homepage" |
| **Smoke**       | Basic "doesn't crash" sanity          | "Component renders without throwing"               |

**Smoke tests are the LOWEST tier.** A test file with only smoke tests is incomplete.

#### Step 4: Document the Requirement in the Test

Every `describe` block should have a comment stating what requirement it protects:

```typescript
/**
 * Requirement: Warm voice tone produces conversational, approachable language.
 * Source: VOICE_TONE_CARDS definition — "Conversational, friendly, uses
 *         contractions and inclusive language"
 * Source: docs/BRAND_CHARACTER_SYSTEM.md
 */
describe("warm voice CTA generation", () => {
  // ...
});
```

---

## Test Quality Tiers

### Tier 1: Requirements Tests (MUST HAVE for all features)

These test what the product SHOULD do based on specs, not what the code happens to do.

**Pattern — Test observable outcomes against stated requirements:**

```typescript
// GOOD: Tests the REQUIREMENT that warm voice is conversational
it("warm CTAs use approachable, low-pressure language", () => {
  const cta = getVoiceKeyedCtaText("contact", "warm", []);
  // Requirement: warm = "conversational, friendly" (VOICE_TONE_CARDS)
  expect(cta.toLowerCase()).not.toMatch(/buy|purchase|order|subscribe|now!/);
  expect(cta.length).toBeLessThan(40); // conversational = brief
});

// GOOD: Tests the REQUIREMENT that anti-refs constrain output
it("salesy anti-reference removes urgency language from ALL CTAs", () => {
  const goals = ["contact", "sell", "book", "hire", "showcase"];
  for (const goal of goals) {
    const withAntiRef = getVoiceKeyedCtaText(goal, "warm", ["salesy"]);
    const withoutAntiRef = getVoiceKeyedCtaText(goal, "warm", []);
    // Requirement: anti-references "actively avoid" the flagged quality
    expect(withAntiRef).not.toBe(withoutAntiRef);
    expect(withAntiRef.toLowerCase()).not.toMatch(/now|today|hurry|act fast/);
  }
});
```

**Anti-pattern — Tests that mirror the code:**

```typescript
// BAD: This is just a code mirror. How do we know "Let's chat" is correct?
it("warm + contact returns 'Let's chat'", () => {
  expect(getVoiceKeyedCtaText("contact", "warm", [])).toBe("Let's chat");
});
```

### Tier 2: Contract Tests (MUST HAVE for all interfaces)

These test that functions honor their documented interface — input/output shape, not specific values.

```typescript
// GOOD: Tests the CONTRACT of generateThemeFromVector
it("produces valid ThemeTokens with all required categories", () => {
  const tokens = generateThemeFromVector([0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
  // Contract: ThemeTokens has 6 categories (theme.types.ts)
  expect(tokens.colorPrimary).toMatch(/^#[0-9a-f]{6}$/i);
  expect(tokens.colorBackground).toMatch(/^#[0-9a-f]{6}$/i);
  expect(tokens.fontHeading).toBeTruthy();
  expect(tokens.fontBody).toBeTruthy();
  expect(tokens.spacingBase).toBeTruthy();
  expect(tokens.radiusBase).toBeTruthy();
});

// GOOD: Tests CONTRACT that distinct inputs produce distinct outputs
it("opposite personality vectors produce visually distinct themes", () => {
  const minimal = generateThemeFromVector([0, 0, 0, 0, 0, 0]);
  const maximal = generateThemeFromVector([1, 1, 1, 1, 1, 1]);
  expect(minimal.colorPrimary).not.toBe(maximal.colorPrimary);
  expect(minimal.fontHeading).not.toBe(maximal.fontHeading);
});
```

### Tier 3: Invariant Tests (MUST HAVE for architectural rules)

These test rules that must ALWAYS hold, across all inputs.

```typescript
// GOOD: Tests INVARIANT from CLAUDE.md — "never hardcode colors"
it("no component renders inline hex color styles", () => {
  for (const [name, createProps] of allComponentFactories) {
    const { container } = renderWithTheme(
      createElement(components[name], createProps())
    );
    const allStyles = container.querySelectorAll("[style]");
    allStyles.forEach((el) => {
      const style = el.getAttribute("style") || "";
      expect(style).not.toMatch(/#[0-9a-f]{3,8}/i);
    });
  }
});

// GOOD: Tests INVARIANT — all site types must produce valid output
it("every site type produces a non-empty headline for every voice", () => {
  const siteTypes = ["restaurant", "business", "portfolio", ...];
  const tones = ["warm", "polished", "direct"];
  for (const type of siteTypes) {
    for (const tone of tones) {
      const result = getVoiceKeyedHeadline("TestBiz", type, tone);
      expect(result.length).toBeGreaterThan(5);
      expect(result).toContain("TestBiz");
    }
  }
});
```

### Tier 4: Boundary Tests (SHOULD HAVE for complex logic)

Test edge cases, limits, and error states.

```typescript
// GOOD: Tests BOUNDARY — what happens at the limit?
it("rejects a 3rd emotional goal when 2 are already selected", () => {
  // Setup: 2 goals already selected
  mockStore.emotionalGoals = ["trust", "luxury"];
  renderWithTheme(<Step5Emotion onComplete={fn} onBack={fn} />);

  // The 3rd option should be disabled
  const calmButton = screen.getByText("Calm").closest("button");
  expect(calmButton).toBeDisabled();
});

// GOOD: Tests BOUNDARY — empty/null inputs
it("handles missing businessName gracefully", () => {
  const result = getVoiceKeyedHeadline("", "business", "warm");
  expect(result.length).toBeGreaterThan(0);
  expect(result).not.toContain("undefined");
  expect(result).not.toContain("null");
});
```

### Tier 5: Smoke Tests (ACCEPTABLE but never sufficient alone)

Basic "doesn't crash" tests. These are the floor, not the ceiling.

```typescript
// ACCEPTABLE as ONE test — but a file with ONLY this is incomplete
it("renders without throwing", () => {
  expect(() => {
    renderWithTheme(<CommerceServices {...createCommerceServicesProps()} />);
  }).not.toThrow();
});
```

---

## Component Testing Standards

### What to Test for Every Component

| Test Type             | What to Assert                                     | Requirement Source           |
| --------------------- | -------------------------------------------------- | ---------------------------- |
| **Props rendering**   | Key content props appear in output                 | Type interface contract      |
| **Variant behavior**  | Each variant produces distinct layout/structure    | Component spec               |
| **Theme consumption** | No hardcoded colors; uses CSS variables            | CLAUDE.md architectural rule |
| **Accessibility**     | Interactive elements have labels/roles             | WCAG / UX standards          |
| **Responsive**        | Mobile-first patterns present                      | CLAUDE.md mobile-first rule  |
| **Edge cases**        | Empty arrays, missing optional props, long strings | Boundary testing             |

### What NOT to Test for Components

- ❌ Exact CSS class names (implementation detail)
- ❌ Exact rendered HTML structure (fragile)
- ❌ That specific Tailwind utilities are applied (implementation)
- ❌ Internal state values (test observable behavior instead)

---

## Integration Testing Standards

### What Makes a Good Integration Test

Integration tests verify that **multiple units work together correctly**. The requirement comes from the system behavior, not individual function behavior.

```typescript
// GOOD: Tests the SYSTEM behavior of theme composition
it("5-layer composition produces valid, distinct output at each layer", () => {
  // Layer 1: Base preset
  const base = getPresetTokens("luxury-dark");

  // Layer 2: Color override changes primary but preserves structure
  const withColor = deriveFromPrimary(base, "#ff6600");
  expect(withColor.colorPrimary).not.toBe(base.colorPrimary);
  expect(withColor.fontHeading).toBe(base.fontHeading); // fonts unchanged

  // Layer 3: Font override
  const withFont = applyFontPairing(withColor, "sora-dm-sans");
  expect(withFont.fontHeading).not.toBe(withColor.fontHeading);
  expect(withFont.colorPrimary).toBe(withColor.colorPrimary); // colors unchanged

  // Layer 4: Emotional override
  const withEmotion = applyEmotionalOverrides(withFont, ["trust"], []);
  // Trust = stability → should affect spacing/radius, not fonts
  expect(withEmotion.fontHeading).toBe(withFont.fontHeading);
});
```

---

## Anti-Patterns — NEVER Do These

### 1. Code-Mirror Testing

```typescript
// ❌ The expected value was copied from the source code
it("returns the theme name", () => {
  expect(getPresetName("luxury-dark")).toBe("Luxury Dark");
});
```

**Why it's wrong**: If the preset name is misspelled in the source ("Luxery Dark"), this test passes. Test the REQUIREMENT instead: "preset names are human-readable, title-cased strings."

### 2. Testing Props Pass-Through

```typescript
// ❌ This tests that React renders props — React already guarantees this
it("displays the headline", () => {
  renderWithTheme(<ContentText headline="Hello" body="World" />);
  expect(screen.getByText("Hello")).toBeTruthy();
});
```

**Better**: Test something meaningful about HOW the headline renders:

```typescript
// ✅ Tests the REQUIREMENT that headlines use the heading font
it("headline uses the theme heading font family", () => {
  renderWithTheme(<ContentText headline="Hello" body="World" />);
  const heading = screen.getByText("Hello");
  expect(heading.tagName).toMatch(/^H[1-6]$/); // semantic HTML
  const style = window.getComputedStyle(heading);
  expect(style.fontFamily).toContain("var(--font-heading)");
});
```

### 3. Snapshot-As-Specification

```typescript
// ❌ Snapshot tells you something CHANGED, not that it's CORRECT
expect(component).toMatchSnapshot();
```

### 4. Testing Internal State

```typescript
// ❌ Tests Zustand store internals instead of user-visible behavior
it("sets the store value", () => {
  act(() => useIntakeStore.getState().setSiteType("business"));
  expect(useIntakeStore.getState().siteType).toBe("business");
});
```

**Better**: Test that the store change produces the correct downstream behavior.

### 5. Relaxing Assertions to Make Tests Pass

```typescript
// ❌ Changed from .toBe("Book Now") to .toBeTruthy() because the value was different
expect(cta).toBeTruthy();
```

If the expected value is wrong, investigate WHY — don't weaken the test.

---

## Process for Writing Test Files

### Step-by-step for each test file:

1. **Read the requirement documents** (CLAUDE.md, component spec, type interfaces, product docs) — NOT the source code.

2. **Write a test plan as comments** before any test code:

   ```typescript
   // REQUIREMENTS for ContentFeatures:
   // - Renders feature cards with icon, title, description (ComponentSpec)
   // - Uses Lucide icon lookup by string name (CLAUDE.md)
   // - Never hardcodes colors (CLAUDE.md architectural rule)
   // - Supports "icon-cards" variant (component manifest)
   // - Responsive grid layout (CLAUDE.md mobile-first rule)
   ```

3. **Write `expect()` assertions** for each requirement BEFORE implementing the test body.

4. **THEN read the source code** only to understand how to set up the test (what props to pass, what to import).

5. **Review each test** and ask: "Would this test catch a bug, or would it pass even if the feature were broken?"

### Test File Header Template

Every test file should start with:

```typescript
/**
 * @requirements
 * - [REQ-1]: <requirement description> (Source: <where this comes from>)
 * - [REQ-2]: <requirement description> (Source: <where this comes from>)
 *
 * @tested-module <path to module under test>
 * @see <link to relevant docs>
 */
```

---

## Convex Backend Testing

Since Convex handlers run in a special runtime and cannot be directly imported into Vitest:

1. **Test the handler LOGIC** by replicating it with mock ctx — but verify the replicated logic matches the source file on every test run.
2. **Add a staleness guard**: Include a hash or line-count check of the source file so tests fail if the handler changes without the test being updated.
3. **Test the CONTRACT, not the implementation**: "getSiteSpec returns the most recent spec for a session" — not "it calls .order('desc').take(1)".

---

## When to Write Tests

- **New feature**: Tests FIRST (or at minimum, concurrently). Never "ship now, test later."
- **Bug fix**: Write the failing test BEFORE fixing the bug. The test proves the bug exists and proves the fix works.
- **Refactor**: Existing tests should pass without modification. If they break, either the refactor changed behavior (fix the code) or the tests were testing implementation details (fix the tests).

---

## Test Review Checklist

Before considering any test file complete, verify:

- [ ] Every `describe` block has a `@requirements` comment or documents the requirement being tested
- [ ] No test assertion was derived by reading the source code's return value
- [ ] At least one test per file tests a REQUIREMENT or INVARIANT (not just smoke)
- [ ] Edge cases tested: empty inputs, null/undefined, boundary values, maximum limits
- [ ] Test names describe the expected BEHAVIOR, not the implementation
- [ ] No exact string comparisons unless the string IS the requirement (e.g., error messages users see)
- [ ] Component tests verify accessibility basics (semantic HTML, ARIA labels on interactive elements)
- [ ] Tests would still be valid if the implementation were completely rewritten
