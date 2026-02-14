# Virtual Boardroom — Adversarial Tension Map

**Purpose**: Documents the 20 core tensions between boardroom personas. These tensions are the engine of the `/boardroom` debate — they force genuine disagreement, prevent groupthink, and surface trade-offs that a single advisor would gloss over.

**Note**: The **Delight Champion** operates with **elevated authority** under Strategic Principle P0. Tensions involving Delight carry special weight — see tensions 16-20.

**Last Updated**: February 2026

---

## How Tensions Work

Each tension represents a **genuine strategic trade-off** where both sides have legitimate arguments. There are no "right answers" — only context-dependent priorities. The boardroom debate forces these tensions into the open so decisions are made with full awareness of trade-offs.

---

## The 20 Core Tensions

### 1. Traffic vs Funnel

|                       |                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**            | **CMO** (Growth Strategist)                                                                                                      |
| **Side B**            | **CRO** (Conversion Architect)                                                                                                   |
| **Core Disagreement** | More users at the top of funnel vs better conversion of existing users                                                           |
| **CMO argues**        | "We have zero users. Optimizing conversion on zero traffic is optimizing zero. We need volume first to even know what converts." |
| **CRO argues**        | "Sending 10,000 users through a leaky funnel wastes CAC. Fix the conversion path first, then scale traffic."                     |
| **Resolution signal** | When conversion rate is measurable and stable, shift investment to traffic. Before that, optimize the funnel.                    |

---

### 2. Traffic vs Margin

|                       |                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Side A**            | **CMO** (Growth Strategist)                                                                                                 |
| **Side B**            | **Infra** (Technical Infrastructure)                                                                                        |
| **Core Disagreement** | Growth investment vs profitability at current scale                                                                         |
| **CMO argues**        | "Zero users means zero revenue regardless of margin. Spend on growth now, optimize unit economics at scale."                |
| **Infra argues**      | "At $0.15/session in AI costs, 10,000 users/month = $1,500 in API alone. Growth without margin control is a burning match." |
| **Resolution signal** | When per-session cost × projected users fits within a funded budget. Requires cost model from Infra.                        |

---

### 3. Depth vs Breadth

|                       |                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**            | **Product** (Product Architect)                                                                                                         |
| **Side B**            | **CEO** (Strategic Vision)                                                                                                              |
| **Core Disagreement** | Deeper character capture system vs more features and capabilities                                                                       |
| **Product argues**    | "If character capture doesn't actually produce different output, our moat claim is fiction. Deepen the 9 steps before adding features." |
| **CEO argues**        | "Revenue features (multi-page, deployment, integrations) unlock paying users. Depth without revenue is an academic exercise."           |
| **Resolution signal** | When character capture demonstrably produces different output for different inputs (A/B comparison). Then shift to revenue features.    |

---

### 4. Steps vs Speed

|                       |                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**            | **Product** (Product Architect)                                                                                                                      |
| **Side B**            | **CRO** (Conversion Architect)                                                                                                                       |
| **Core Disagreement** | 9 rich character capture steps vs streamlined minimal-friction flow                                                                                  |
| **Product argues**    | "Steps 5-7 (emotion, voice, culture) ARE the competitive advantage. Cutting them makes us another generic AI builder."                               |
| **CRO argues**        | "Every step is a drop-off point. If Step 5 loses 20% of users, Steps 5-7 collectively lose 50%. That's half your funnel gone for 'differentiation.'" |
| **Resolution signal** | Funnel analytics showing actual drop-off per step. If Steps 5-7 convert at >80% each, keep them. If <60%, reconsider.                                |

---

### 5. Generosity vs Revenue

|                         |                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Side A**              | **CMO** + **CRO**                                                                                                      |
| **Side B**              | **Monetization** (SaaS Economist)                                                                                      |
| **Core Disagreement**   | Generous free tier for growth vs capturing revenue before users leave                                                  |
| **CMO/CRO argue**       | "Users must experience the full wow moment for free. Gating before value demonstration kills virality and conversion." |
| **Monetization argues** | "Every free user costs us API tokens. A generous free tier with no conversion mechanism is a charity, not a business." |
| **Resolution signal**   | When free-to-paid conversion rate exceeds 5%. Below that, free tier may be too generous or paywall is too abrupt.      |

---

### 6. Rich Prompts vs Costs

|                       |                                                                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**            | **Product** (Product Architect)                                                                                                                             |
| **Side B**            | **Infra** (Technical Infrastructure)                                                                                                                        |
| **Core Disagreement** | Detailed AI prompts for better output vs token cost per session                                                                                             |
| **Product argues**    | "The quality gap between a 500-token prompt and a 2000-token prompt is the difference between generic and genuinely personalized output."                   |
| **Infra argues**      | "At ~$0.003/1K input tokens, a 2000-token prompt is 4x the cost of a 500-token prompt. At scale, this is the difference between profitable and underwater." |
| **Resolution signal** | A/B test output quality at different prompt sizes. Find the minimum prompt size that produces "wow" quality.                                                |

---

### 7. Integration vs Focus

|                         |                                                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**              | **Partnerships** (Integrations Lead)                                                                                             |
| **Side B**              | **CEO** (Strategic Vision)                                                                                                       |
| **Core Disagreement**   | Ecosystem stickiness through integrations vs focused AI moat                                                                     |
| **Partnerships argues** | "A website that can't collect payments, book appointments, or capture emails is a pretty PDF. Integrations make us functional."  |
| **CEO argues**          | "Integrations are commodity. Every builder does them. Our moat is the intelligence that gets smarter. Don't distract from that." |
| **Resolution signal**   | When core AI generation is demonstrably superior AND users are asking for integrations (not the reverse).                        |

---

### 8. Integration vs Simplicity

|                         |                                                                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**              | **Partnerships** (Integrations Lead)                                                                                                         |
| **Side B**              | **Infra** (Technical Infrastructure)                                                                                                         |
| **Core Disagreement**   | More third-party connections vs fewer failure modes                                                                                          |
| **Partnerships argues** | "Each integration makes the platform stickier. Users with 3+ connected services have 90% lower churn."                                       |
| **Infra argues**        | "Each integration adds API keys to manage, webhook endpoints to monitor, and third-party outages to handle. Complexity grows exponentially." |
| **Resolution signal**   | Embed-first strategy (Calendly widget, Stripe Payment Links) minimizes backend complexity while adding functionality.                        |

---

### 9. Parity vs Differentiation

|                        |                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**             | **Competitive** (Intelligence Analyst)                                                                                                      |
| **Side B**             | **Product** (Product Architect)                                                                                                             |
| **Core Disagreement**  | Match competitor features vs deepen unique capabilities                                                                                     |
| **Competitive argues** | "Wix has deployment, Framer has visual editing, Squarespace has e-commerce. Without these, we lose on comparison tables."                   |
| **Product argues**     | "Comparison tables are for commodity products. We win by being categorically different — the builder that actually understands your brand." |
| **Resolution signal**  | When prospects are choosing competitors specifically for missing table-stakes (deployment, multi-page), not for depth features.             |

---

### 10. Polish vs Performance

|                       |                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Side A**            | **UX Psych** (Behavioral Psychologist)                                                                                         |
| **Side B**            | **Infra** (Technical Infrastructure)                                                                                           |
| **Core Disagreement** | Rich animations and emotional UX vs page load speed and bundle size                                                            |
| **UX Psych argues**   | "framer-motion animations create the emotional journey that builds commitment. A fast but sterile experience doesn't convert." |
| **Infra argues**      | "framer-motion adds ~30KB to the bundle. Every animation is a render cycle. Users on slow connections see jank, not elegance." |
| **Resolution signal** | Core Web Vitals scores. If LCP < 2.5s and CLS < 0.1 with animations, keep them. If not, optimize or lazy-load.                 |

---

### 11. Emotion vs Conversion

|                       |                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Side A**            | **UX Psych** (Behavioral Psychologist)                                                                                                     |
| **Side B**            | **CRO** (Conversion Architect)                                                                                                             |
| **Core Disagreement** | Emotional journey richness vs minimizing steps to conversion                                                                               |
| **UX Psych argues**   | "The IKEA effect means users who invest effort value the result more. Steps 5-7 BUILD conversion, they don't hinder it."                   |
| **CRO argues**        | "The IKEA effect assumes completion. If users drop off at Step 5, there's no IKEA effect — just abandonment. Show me the completion data." |
| **Resolution signal** | Step-by-step completion analytics. Theory vs data.                                                                                         |

---

### 12. Ship Fast vs Stay Focused

|                        |                                                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**             | **Competitive** (Intelligence Analyst)                                                                                                |
| **Side B**             | **CEO** (Strategic Vision)                                                                                                            |
| **Core Disagreement**  | Feature velocity to match competitors vs strategic focus on fewer, deeper bets                                                        |
| **Competitive argues** | "Framer ships updates weekly. We're still on single-page static export. The market won't wait for our 12-month roadmap."              |
| **CEO argues**         | "Shipping fast without strategy is how you become a feature graveyard. Every feature we ship must deepen the moat or unlock revenue." |
| **Resolution signal**  | Monthly shipping cadence with clear moat/revenue justification for each feature. Not "ship everything" and not "ship nothing."        |

---

### 13. Free Wow vs Paid Gate

|                         |                                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**              | **CRO** (Conversion Architect)                                                                                                            |
| **Side B**              | **Monetization** (SaaS Economist)                                                                                                         |
| **Core Disagreement**   | Users must experience full value for free vs gate premium features early                                                                  |
| **CRO argues**          | "The preview page IS the conversion event. If users can't see their generated site for free, they'll never know what they're paying for." |
| **Monetization argues** | "Export, premium presets, and multi-page should be gated. The free wow is seeing the preview — paying is keeping and deploying it."       |
| **Resolution signal**   | Gate AFTER the wow moment. Preview is free; export/deploy/premium features are paid. Both sides can win here.                             |

---

### 14. Intelligence vs Ecosystem

|                         |                                                                                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**              | **CEO** (Strategic Vision)                                                                                                                            |
| **Side B**              | **Partnerships** (Integrations Lead)                                                                                                                  |
| **Core Disagreement**   | AI intelligence as primary moat vs ecosystem connectivity as primary moat                                                                             |
| **CEO argues**          | "Intelligence that gets smarter with every user is a compounding advantage. Integrations are a commodity any builder can add."                        |
| **Partnerships argues** | "Intelligence without functionality is a demo. Users need working contact forms, payment processing, and booking — today, not after the AI improves." |
| **Resolution signal**   | Both are necessary. Intelligence for differentiation, integrations for functionality. Sequence: core AI quality first, then layer integrations.       |

---

### 15. Velocity vs Depth

|                        |                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**             | **Competitive** (Intelligence Analyst)                                                                                                      |
| **Side B**             | **Product** (Product Architect)                                                                                                             |
| **Core Disagreement**  | Shipping more features quickly vs making each feature deeply differentiated                                                                 |
| **Competitive argues** | "We have 18 components. Framer has ~40 sections. Feature count matters for comparison shopping."                                            |
| **Product argues**     | "18 deeply themed, character-responsive components > 40 generic template blocks. Our components respond to emotional goals and voice tone." |
| **Resolution signal**  | When output quality consistently exceeds competitors despite fewer components, depth wins. Until proven, it's a hypothesis.                 |

---

### 16. Delight vs Revenue Capture (ELEVATED)

|                         |                                                                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**              | **Delight Champion** (User Delight) — ELEVATED AUTHORITY                                                                           |
| **Side B**              | **Monetization** (SaaS Economist)                                                                                                  |
| **Core Disagreement**   | Joy-first free experience vs gating value early to capture revenue                                                                 |
| **Delight argues**      | "A user who hits a paywall before experiencing magic never comes back. Delight drives desire to pay. Gates drive desire to leave." |
| **Monetization argues** | "Every free user costs tokens. Ungated delight without a conversion path is a charity. At some point joy must become revenue."     |
| **Resolution signal**   | Gate AFTER the wow moment, never before. The free experience must be genuinely wonderful — then offer more depth for payment.      |
| **P0 weight**           | Delight Champion's position carries elevated weight under P0. Monetization must prove gating doesn't kill the joy.                 |

---

### 17. Delight vs Conversion Optimization (ELEVATED)

|                       |                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**            | **Delight Champion** (User Delight) — ELEVATED AUTHORITY                                                                                  |
| **Side B**            | **CRO** (Conversion Architect)                                                                                                            |
| **Core Disagreement** | Experience quality vs conversion rate percentage                                                                                          |
| **Delight argues**    | "A 5% conversion from users who love us is worth more than 15% from users pressured through a funnel. Loyalty > quick conversion."        |
| **CRO argues**        | "Unmeasured delight is a feel-good hypothesis. Show me completion rates, time-to-value, and conversion data."                             |
| **Resolution signal** | Both matter. Measure delight signals (NPS, shares, return visits) alongside conversion. If conversion tactics hurt delight signals, stop. |
| **P0 weight**         | When conversion tactics make the experience feel transactional, Delight Champion's challenge takes priority.                              |

---

### 18. Delight vs Shipping Speed (ELEVATED)

|                       |                                                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**            | **Delight Champion** (User Delight) — ELEVATED AUTHORITY                                                                                        |
| **Side B**            | **CEO** (Strategic Vision) + **Competitive** (Intelligence)                                                                                     |
| **Core Disagreement** | Polish and craft vs velocity and market response                                                                                                |
| **Delight argues**    | "Shipping something unpolished is shipping something that kills first impressions. You don't get a second chance to make someone fall in love." |
| **CEO argues**        | "Every week without shipping is a week without learning. Ship, measure, iterate. Polish is a luxury."                                           |
| **Resolution signal** | Ship FAST but never ship UGLY. The minimum bar is "Would I show this to a friend?" If no, it needs one more pass. If yes, ship it.              |
| **P0 weight**         | Delight Champion can delay a ship if the experience doesn't pass the Five Questions test. Speed serves nothing if users don't love the result.  |

---

### 19. Delight vs Infrastructure Cost (ELEVATED)

|                       |                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Side A**            | **Delight Champion** (User Delight) — ELEVATED AUTHORITY                                                                                    |
| **Side B**            | **Infra** (Technical Infrastructure)                                                                                                        |
| **Core Disagreement** | Beautiful, alive experiences vs lean, fast, cheap operations                                                                                |
| **Delight argues**    | "The 200ms animation that makes a transition magical isn't waste — it's the difference between a tool and a product people love."           |
| **Infra argues**      | "Animation = render cycles = bundle size = slower load = worse Core Web Vitals. Fast + plain beats slow + pretty."                          |
| **Resolution signal** | Performance budget with delight floor. CWV must pass, AND experience must be alive. Optimize to achieve both, never sacrifice one entirely. |
| **P0 weight**         | A fast, sterile experience fails P0. Infra must find ways to make it fast AND beautiful, not choose between them.                           |

---

### 20. Delight vs Feature Depth (ELEVATED)

|                       |                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Side A**            | **Delight Champion** (User Delight) — ELEVATED AUTHORITY                                                                                                                             |
| **Side B**            | **Product** (Product Architect)                                                                                                                                                      |
| **Core Disagreement** | Magical user experience vs deep technical differentiation                                                                                                                            |
| **Delight argues**    | "Depth means nothing if it doesn't feel magical. The character system should feel like the AI 'gets me', not like I'm filling out a form."                                           |
| **Product argues**    | "The differentiation IS the depth. Without 10 emotional goals, 3 voice tones, 6 archetypes, output is generic. Depth creates the magic."                                             |
| **Resolution signal** | Depth serves delight. If depth adds complexity users feel (more steps, more confusion), it hurts. If depth adds magic users experience (better output, more personalized), it helps. |
| **P0 weight**         | Product must prove depth creates joy, not just differentiation. Differentiation users don't feel is invisible. Joy they feel is everything.                                          |

---

## Tension Network Diagram

```
                    CMO ←——————→ CRO
                   / |  Traffic    | \
                  /  |  vs Funnel  |  \
        Traffic  /   |             |   \ Emotion
        vs      /    |             |    \ vs
        Margin /     |             |     \ Conversion
              /      |             |      \
          Infra ←————|—————————————|———→ UX Psych
            ↑  \     |             |    / ↑
            |   \    |             |   /  |
   Rich     |    \   |             |  /   | Polish
   Prompts  |     \  |             | /    | vs
   vs Costs |      \ |             |/     | Performance
            |       \|             |      |
        Product ←——————————→ Competitive
            ↑    Parity vs      ↗     ↑
            |    Differentiation     |
            |                  Ship Fast
   Depth    |                  vs Focused
   vs       |                        |
   Breadth  |                        |
            ↓                        ↓
           CEO ←—————————→ Partnerships
              Intelligence    Integration
              vs Ecosystem    vs Focus

        Monetization ←————→ CMO/CRO
              Generosity vs Revenue
              Free Wow vs Paid Gate

    ╔══════════════════════════════════════════╗
    ║          ★ DELIGHT CHAMPION ★            ║
    ║        (Elevated Authority — P0)         ║
    ║                                          ║
    ║  Challenges ALL personas when            ║
    ║  user experience is at stake:            ║
    ║                                          ║
    ║  ←→ Monetization (Joy vs Revenue)        ║
    ║  ←→ CRO (Love vs Conversion)            ║
    ║  ←→ CEO/Competitive (Polish vs Speed)   ║
    ║  ←→ Infra (Beauty vs Performance)       ║
    ║  ←→ Product (Magic vs Depth)            ║
    ║  ←→ UX Psych (natural ally)             ║
    ╚══════════════════════════════════════════╝
```

---

## Using This Map

### In `/boardroom` Debates

The command automatically selects relevant tensions based on the strategic question. For a pricing question, expect Monetization vs CMO/CRO/Product to dominate. For a roadmap question, expect CEO vs Competitive vs Product.

### For Individual Consultation

When calling a single persona (e.g., `@infra`), reference this map to understand which counter-arguments the persona should address proactively.

### For Decision Making

Every major decision should name:

1. Which tension it resolves
2. Which side it favors
3. What the losing side's risk becomes (and how to mitigate)

---

**Last Updated**: February 2026
