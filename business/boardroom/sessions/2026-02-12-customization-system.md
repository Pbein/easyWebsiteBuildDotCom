# Boardroom Session 001: Customization System Architecture

> **Date**: 2026-02-12
> **Topic**: How should we design a comprehensive customization system? What should be free vs paid? How do we structure tiers?
> **Participants**: All 9 personas
> **Decisions**: See `business/boardroom/DECISIONS_LOG.md` — BD-001-01 through BD-001-05
> **Principles established**: See `business/boardroom/STRATEGIC_PRINCIPLES.md` — P1 through P8

---

## Context

After AI generates a site from the 9-step intake flow, users land on `/demo/preview`. Currently the sites look "fine but generic" — they lack personality and life. The preview page offers only: A/B theme toggle, viewport switching, screenshot, ZIP export, and start over. Zero post-generation customization.

We have 215+ design system elements (24 components, 7 theme presets, 87 tokens, 14 font pairings, 8 CSS effects, 14 CSS patterns, 4 section dividers, 5 decorative elements) that could be exposed for customization.

---

## ROUND 1: CEO FRAMES THE DEBATE

### Current State (from codebase)

| Asset Category        | Count | Source File                               |
| --------------------- | ----- | ----------------------------------------- |
| Components registered | 24    | `src/lib/assembly/component-registry.ts`  |
| Theme presets         | 7     | `src/lib/theme/presets.ts`                |
| Theme tokens          | 87    | `src/lib/theme/theme.types.ts`            |
| Font pairings         | 14    | `src/lib/theme/generate-theme.ts`         |
| CSS effects           | 8     | `src/lib/css-effects/registry.ts`         |
| CSS patterns          | 14    | `src/lib/visuals/css-patterns.ts`         |
| Section dividers      | 4     | `src/lib/visuals/section-dividers.tsx`    |
| Decorative elements   | 5     | `src/lib/visuals/decorative-elements.tsx` |
| Personality axes      | 6     | `src/lib/theme/theme.types.ts`            |
| Emotional goals       | 10    | `src/lib/types/brand-character.ts`        |
| Brand archetypes      | 6     | `src/lib/types/brand-character.ts`        |
| Anti-references       | 8     | `src/lib/types/brand-character.ts`        |

### Success Metrics

1. Free-to-paid conversion rate
2. Time-to-value (seconds from preview load to "I want to keep this")
3. Customization engagement (% of users who tweak at least one thing)
4. Export/deploy rate
5. LTV expansion

### Constraints

- No user accounts yet (Clerk is Phase 7)
- No deployment pipeline (Vercel API is Phase 6)
- Preview uses iframe PostMessage protocol (`ewb:` prefix)
- AI costs ~$0.04-0.07 per session
- Solo-developer operation

---

## ROUND 2: STRATEGY PRESENTATIONS

### CEO — Marcus Chen

The question is not whether to build customization, but how to structure it for maximum conversion while preserving our differentiation thesis. Our moat is character-depth-driven AI assembly. If we turn customization into a drag-and-drop editor, we become a worse Framer. If we gate too aggressively, we lose users before they feel value.

### CMO — Sierra Washington

The customization layer is our greatest growth lever if designed for virality. The free tier should include the most visually dramatic customizations — the ones that create before/after moments users want to share. Primary color picker, theme presets, font selection, and branded exports turn every user into a distribution channel.

**Free**: 7 presets, primary color, all 14 fonts, branded export.
**Paid**: Fine-grained color, effects, patterns, component reordering, content editing, image upload, clean export.

### CRO — Diego Morales

The preview page has zero conversion CTAs. Users invest 9 steps, the IKEA effect peaks, then they hit a wall. Customization creates the conversion inflection point — demonstrate enough control to make users invested, then present the upgrade at the exact moment they want more.

**Free**: Presets, primary color, 3 of 14 fonts (show all with locks), headline editing.
**Paid**: Full colors, all fonts, component control, patterns, effects, multi-page, clean export.

### Product — Amara Okafor

Customization must deepen character expression, not undo it. If users override every AI decision, we've built a bad Figma clone. Raw token manipulation (87 CSS properties) undermines the intelligence. The customization model should be GUIDED — expose meaningful design intents, not raw controls.

**Free**: "Mood" sliders (personality axes), presets, headline editing, component visibility.
**Paid**: Full font selection, color palette from brand color, variant switching, effects, patterns, spacing.

### Infra — Viktor Petrov

Every customization has a cost model. Visual/theme customizations are zero-marginal-cost (client-side CSS). Content regeneration is expensive ($0.03+/call). The architecture strongly favors visual customization: all 87 tokens, 14 fonts, 14 patterns, 8 effects, and 4 dividers can be swapped client-side at zero cost. Only content GENERATION costs money.

**Zero-cost**: Theme tokens, fonts, patterns, effects, dividers, component visibility, color changes.
**Expensive**: Content regeneration, component addition, layout restructuring.

### Monetization — Priya Sharma

Proposed 4-tier structure: Free Demo → Free Account ($0) → Pro ($19/mo) → Agency ($49/mo). Revenue projection: ~$1,800/mo MRR at 10K sessions with conservative conversion rates. Gate at export — let users customize freely, require account to save or download.

### Competitive — James Whitfield

We lose on 9 out of 10 customization categories vs competitors. But competitors offer RAW customization that produces generic results. None offer GUIDED customization that preserves brand coherence. Brand this as "Guided Design" — every option curated for the user's brand. Ship ANY customization within 30 days.

### Partnerships — Elena Vasquez

The customization layer is the integration upsell ladder. Free = visual only. Free Account = Formspree. Pro = Calendly + Mailchimp + Analytics. Agency = Stripe + Snipcart. Each integration creates switching costs.

### UX Psych — Dr. Miriam Sato

By preview, users have made ~25-30 decisions. Endowment Effect and IKEA Effect are at peak. Customization resolves the Zeigarnik tension ("this is close but not perfect"). Critical: progressive disclosure (3 levels, not 87 sliders), immediate feedback, guided recommendations ("Recommended for your brand"), undo safety ("Reset to AI Original"), celebration moments. Free tier must feel GENEROUS, not crippled.

---

## ROUND 3: ADVERSARIAL CROSS-EXAMINATION

### Exchange 1: CMO vs Monetization — Free Generosity vs Revenue

- **CMO**: 3 free fonts is crippled. Framer's free tier includes full customization.
- **Monetization**: Framer is subsidized by $300M+. If free is too generous, no upgrade incentive.
- **Resolution**: Compromise at 5 free fonts (including AI-selected default). Show all 14 with soft locks. The current AI-selected font always stays free.

### Exchange 2: CRO vs UX Psych — Steps vs Journey

- **CRO**: Where's the conversion CTA in the 3-level model?
- **UX Psych**: Conversion comes when they ATTEMPT a Level 2 action. "Desire before gate" converts better.
- **Resolution**: Add time-based engagement nudge (5+ min) framed as celebration, not interruption.

### Exchange 3: Product vs CEO — Deep vs Fast

- **Product**: Personality sliders via `generateThemeFromVector()` are architecturally superior to raw color pickers.
- **CEO**: Users want predictable control, not exploration.
- **Resolution**: Phase 1: simple controls (color, font, preset). Phase 2: personality sliders as Pro feature.

### Exchange 4: Competitive vs Product — Parity vs Differentiate

- **Competitive**: We need inline editing, drag-and-drop, image upload. Table stakes.
- **Product**: Iframe PostMessage architecture prevents contentEditable. Cross-origin constraint.
- **Resolution**: Sidebar editing panel for Phase 1. User edits in sidebar, `ewb:update-content` PostMessage updates iframe.

### Exchange 5: Infra vs UX Psych — Performance vs Polish

- **Infra**: Real-time preview could send 30+ PostMessages/sec during color picker drag.
- **UX Psych**: Debounce to 100ms. 10fps for color changes is perceptually smooth.
- **Resolution**: 100ms debounce on all customization PostMessages.

### Exchange 6: CRO vs Monetization — Prove Value vs Gate Early

- **CRO**: Gating headline editing at Pro is punitive. If AI writes wrong headline, users NEED to fix it.
- **Monetization**: Counter: free tier gets H1/H2 editing. Body text is Pro only.
- **Resolution**: First headline edit triggers contextual upgrade prompt for body text editing.

---

## ROUND 4: DECISIONS

### Top 3 Priorities

**P1: Ship Free-Tier Customization Panel (Weeks 1-3)**

- Sidebar: 7 presets, primary color picker (chroma-js auto-palette), 5/14 fonts, H1/H2 editing, Reset button
- Zero marginal cost (all client-side)
- Decision ID: BD-001-01

**P2: Shareable Preview Links + Badge (Weeks 3-5)**

- Unique shareable URLs, "Built with EWB" badge, Open Graph meta tags
- Every share = free acquisition
- Decision ID: BD-001-02

**P3: Account Wall + Pro Gate (Weeks 5-8)**

- Clerk auth + Stripe billing ($19/mo Pro, $49/mo Agency)
- Pro unlocks: all fonts, full color, effects, patterns, dividers, variant switching, body text, clean export
- Decision ID: BD-001-03

### Risk Table

| Risk                                  | Probability | Impact | Mitigation                                                                     |
| ------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------------ |
| Customization breaks design coherence | Medium      | High   | Auto-derive palette from primary color; personality-constrained font selection |
| Free tier too generous                | Low         | High   | Gate high-value controls behind Pro; time-based engagement nudges              |
| Free tier too stingy                  | Medium      | High   | 7 presets + color + 5 fonts + headline editing = substantial; test with users  |
| PostMessage latency during color drag | Medium      | Medium | 100ms debounce                                                                 |
| AI regen costs spike                  | Medium      | High   | Usage-based credits (5/mo Pro, unlimited Agency)                               |
| Competitors ship faster               | High        | Medium | "Guided Design" positioning; focus on brand-coherent customization             |

### KPI Dashboard

| Metric                     | Current | Phase 1 Target | Phase 3 Target |
| -------------------------- | ------- | -------------- | -------------- |
| Customization rate         | 0%      | 40%            | 60%            |
| Gate click rate            | N/A     | 15%            | 25%            |
| Free-to-account conversion | 0%      | N/A            | 15%            |
| Account-to-Pro             | N/A     | N/A            | 5%             |
| Avg controls changed       | 0       | 2.5            | 4+             |
| Time-in-preview            | Unknown | 3+ min         | 5+ min         |
| Share rate                 | 0%      | 5%             | 10%            |
| MRR                        | $0      | $0             | $1,500-2,000   |

### CEO Final Directive

Ship Phase 1 in 3 weeks. Do not wait for Clerk, Stripe, or account infrastructure. Phase 1 is a free experience improvement that proves users want customization, creates the conversion surface, and costs nothing to serve.
