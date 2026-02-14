# Strategic Principles

> Core principles that ALL boardroom decisions must align to. Overriding a principle requires explicit rationale and updating this document.
>
> Last updated: 2026-02-14
> Updated by: Strategic Decision — User Delight Champion Establishment

---

## Mission

**EasyWebsiteBuild makes professional, brand-authentic websites accessible to anyone — powered by AI that understands who you are, not just what you want.**

## Core Principles

### P0: People Must Love It

> Source: `.agents/agents/USER_DELIGHT_MANIFESTO.md`
> Champion: User Delight Champion (elevated authority)

**This is the foundation all other principles rest on.** Like a game that needs the best monetization and the smartest analytics — if the game isn't fun, nobody plays. If nobody plays, nothing else matters. Revenue (P1) only flows when the product creates genuine delight. The question "Will this make someone love being here?" comes before "Will this make someone pay?"

The Delight Champion holds **elevated authority** under this principle: any boardroom persona may propose, but the Delight Champion can challenge any decision that degrades the user experience. The burden of proof shifts to the proposer to demonstrate that the experience remains lovable, not just functional.

**In practice:** The free experience must be genuinely wonderful. The reveal moment is sacred. Polish is not optional. We build for people, not personas. If not for the users, who are we helping?

### P1: Revenue Validates

> Source: `business/HORMOZI_ANALYSIS.md`
> Relationship to P0: Revenue is the RESULT of delight, not the cause of it. P1 works because P0 is satisfied.

No feature matters until someone pays for it. Every development decision must trace to a revenue path. Free features exist to create desire for paid features, not as charity. We measure success in dollars, not compliments.

### P2: Intelligence Is the Moat

> Source: `docs/STRATEGIC_ROADMAP.md`

Our competitive advantage is deep brand understanding — the 9-step character capture, personality vectors, emotional overrides, voice-keyed content. If we commoditize ourselves into a drag-and-drop editor, we lose. Every feature should make the AI smarter or the output more characterful, not just add manual control.

### P3: The User Owns the Feeling

> Source: Boardroom Session 001

The generated site is a starting point, not a final answer. Users must feel creative ownership through customization. But customization should AMPLIFY the AI's brand understanding, not replace it. Guided customization > raw control.

### P4: Zero-Marginal-Cost First

> Source: `business/boardroom/sessions/2026-02-12-customization-system.md`

Prioritize features that cost nothing to serve at scale (client-side CSS, theme tokens, font swaps) over features that have per-use cost (AI regeneration, server-side rendering). Gate expensive operations behind paid tiers. This is a solo-developer business — unit economics matter from day one.

### P5: Ship the Simplest Useful Thing

> Source: Boardroom consensus

When choosing between an architecturally elegant solution and a simpler one that delivers 80% of the value, ship the simpler one. Iterate from real user feedback, not theoretical perfection. Every week without shipping is a week without learning.

### P6: Integration Over Invention

> Source: `docs/STRATEGIC_ROADMAP.md`

We build beautiful, branded interfaces that connect to established services (Stripe, Calendly, Formspree, Mailchimp). We do NOT build payments, booking, or CMS from scratch. Our value is the design layer and AI intelligence, not commodity infrastructure.

### P7: The Journey Is the Product

> Source: Boardroom UX Psych (Dr. Sato)

The emotional arc from intake through preview to customization IS the product experience. Every step should deepen psychological ownership (IKEA effect, endowment effect). Breaking this arc — with jarring transitions, feature walls, or generic UI — destroys the value proposition.

### P8: Past Decisions Are Respected

> Source: `business/boardroom/PROCESS.md`

New decisions must be reconciled with past decisions. If we change direction, we document WHY. No silent contradictions. No "we just forgot." The decisions log is the institutional memory that prevents strategic whiplash.

---

## Anti-Principles (What We Explicitly Reject)

### AP0: "Good Enough Is Good Enough"

We do not ship experiences that are merely functional. "It works" is not the bar. "People love it" is the bar. Tolerance is not love, and we don't build for tolerance.

### AP1: "Build It and They Will Come"

We do not build features without a revenue hypothesis. Every feature needs a clear answer to: "How does this make someone pay us?"

### AP2: "Match Every Competitor Feature"

We do not chase Wix/Squarespace feature parity. We differentiate through AI intelligence and guided design. Matching their drag-and-drop is a losing strategy.

### AP3: "Free Forever"

Generosity is a growth strategy, not a business model. Free tiers exist to create desire. If a free user never converts, the free tier failed.

### AP4: "Perfect Then Ship"

We do not wait for architectural perfection. Ship, measure, iterate. The codebase can be refactored; lost time cannot.

---

## Principle Evolution Log

| Date       | Principle     | Change                                                | Reason                                                                                                       | Session |
| ---------- | ------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------- |
| 2026-02-12 | P1-P8 created | Initial principles                                    | First boardroom session established foundations                                                              | 001     |
| 2026-02-14 | P0 created    | Added "People Must Love It" as foundational principle | User delight established as precondition for all other principles; Delight Champion given elevated authority | —       |
| 2026-02-14 | AP0 created   | Added "Good Enough Is Good Enough" anti-principle     | Complement to P0; sets the bar at love, not tolerance                                                        | —       |
