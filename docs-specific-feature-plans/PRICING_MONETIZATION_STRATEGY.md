# Pricing, Monetization & Premium Value Strategy

> **Status:** Planned (BD-003-01, BD-003-03, BD-003-04)
> **Decision source:** `business/boardroom/sessions/2026-02-14-rd-training-and-pricing.md`
> **Priority:** P1 (highest — revenue foundation)
> **Timeline:** Weeks 1-6
> **Last updated:** 2026-02-14

---

## Philosophy

**"Other companies make websites.. we make 'your' website."**

The personalization IS the product. Our competitive advantage isn't templates or drag-and-drop — it's deep brand understanding through the 9-step character capture system. Pricing should reflect this: the AI intelligence is the premium, not arbitrary feature locks.

### Anti-Lock-In as Brand Identity

Unlike Squarespace (cancel = site disappears), Wix (can't export), and base44 (lock-in complaints), we explicitly make it easy to leave:

- $99 one-time export: full project, all dependencies, deployment guide
- No proprietary format — standard HTML/CSS (Next.js upgrade planned)
- Positioned as: "We're so confident you'll stay, we make it trivially easy to leave"

This is a trust signal and marketing differentiator, not a revenue leak.

---

## Tier Structure (Boardroom Consensus)

| Tier          | Price        | Target User                                  | Core Value                               |
| ------------- | ------------ | -------------------------------------------- | ---------------------------------------- |
| **Free Demo** | $0           | Everyone — first experience                  | "Fall in love first"                     |
| **Starter**   | $12/mo       | Small business owners who want a live site   | "Your site, live, for less than Netflix" |
| **Pro**       | $29/mo       | Users who want ongoing AI design partnership | "Your AI design partner"                 |
| **Own It**    | $99 one-time | Users who want zero lock-in                  | "Build with AI, own forever"             |

### Free Demo (no account required)

**What you get:**

- Full 9-step intake flow with AI-powered discovery
- AI site generation (single-page)
- Real-time preview with viewport switching
- Full customization: 7 presets, primary color picker, 5 fonts, headline editing
- Reset to AI Original
- Export with "Built with EasyWebsiteBuild" footer badge

**What it costs us:**

- ~$0.05 per generation (AI API)
- Zero hosting cost (client renders in-browser)
- Zero ongoing cost

**Why it's generous:**

- The free experience must be genuinely wonderful (P0: People Must Love It)
- Creates IKEA effect → psychological ownership → conversion desire
- Every exported site with badge = free billboard
- Nothing gets removed from this tier. Ever. (Delight Champion condition)

### Starter ($12/mo)

**What you get (everything in Free, plus):**

- **Live site with real URL** (Vercel hosting)
- **Clean export** (no badge)
- **Working contact form** (Formspree integration)
- **1 free AI Design Chat message** (taste the magic)
- Email support

**What it costs us:**

- ~$0.20-0.40/mo hosting (Vercel)
- ~$0.10 for 1 AI Chat message
- Total: ~$0.50/mo → **96% gross margin**

**Why $12/mo:**

- Below Squarespace entry ($16/mo) and Wix ($17/mo)
- Feels like Netflix, not a burden (founder's "not strangling" principle)
- The value is clear: "Your site is live, with a real URL"
- Low enough for impulse decision, high enough to be real revenue

### Pro ($29/mo)

**What you get (everything in Starter, plus):**

- **All 14 font pairings** (9 unlocked)
- **Full color control** (secondary, accent, surface tokens)
- **CSS effects selector** (8 effects per section)
- **Unlimited AI Design Chat** (conversational redesign)
- **Booking integration** (Calendly embed, themed)
- **Payment integration** (Stripe Payment Links)
- **Custom domain** (CNAME setup)
- Priority support

**What it costs us:**

- ~$0.20-0.40/mo hosting
- ~$0.50-1.50/mo AI Chat (5 turns estimated average)
- Total: ~$1-2/mo → **93% gross margin**

**Why $29/mo:**

- AI Design Chat is the killer feature — no competitor offers this at this price
- Below Squarespace Business ($33/mo) and Wix VIP ($59/mo)
- Integrations (booking, payment) add functional value beyond design
- "Your AI design partner" is a unique positioning

### Own It ($99 one-time)

**What you get:**

- Full project export (HTML/CSS → Next.js upgrade planned)
- All dependencies included
- Deployment guide (Vercel, Netlify, GitHub Pages)
- Zero lock-in — take it anywhere
- Available to any tier (Free, Starter, or Pro)

**What it costs us:**

- $0 (ZIP file generation is client-side)
- **100% gross margin**

**Why $99:**

- Anchored against agency websites ($3,000-$15,000)
- Positioned as "Build it with AI, own it forever"
- Anti-lock-in messaging differentiates from every competitor
- Trust signal: "We make it easy to leave because you won't want to"

---

## Conversion Funnel

```
Homepage → Demo (9 steps) → Generate → "Wow!" → Customize (IKEA effect)
  ↓
"Make It Yours" Modal (3 options):
  ├── "Go Live" ($12/mo) → Stripe Checkout → Vercel Deploy → Live URL
  ├── "Download Project" ($99) → Stripe Checkout → ZIP Download
  └── "Free Preview" (with badge) → ZIP Download → Badge included
  ↓
Post-conversion:
  ├── Starter users: customize more, eventually want AI Chat → Pro upgrade
  └── Free users: see badge, share link, come back later → conversion
```

### Key Conversion Principles

1. **Never paywall the reveal moment** — users see their site before any money conversation
2. **"Go Live" framing, not "Upgrade"** — gain frame, not loss frame
3. **The conversion happens AFTER customization** — IKEA effect first, then convert
4. **Email capture during loading screen** — after wireframe animation (~7.5s), before final polish
5. **First AI Chat message is free** — taste the magic, then pay for the supply

---

## Implementation Sequence

### Week 1-2: Payment Infrastructure

| Task                  | Details                                            | Files                                                  |
| --------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| Stripe Checkout       | One product ($12/mo), webhook listener             | `src/app/api/stripe/webhook/route.ts`, env vars        |
| Clerk Auth            | Minimal setup — email login, no social             | `src/app/layout.tsx` (ClerkProvider), middleware.ts    |
| "Make It Yours" modal | Three-option conversion UI                         | `src/components/platform/preview/MakeItYoursModal.tsx` |
| Auth gate             | Gate at "Go Live" and "$99 Export", NOT at preview | `src/app/demo/preview/page.tsx`                        |

### Week 2-3: Hosting Pipeline

| Task                  | Details                                      | Files                               |
| --------------------- | -------------------------------------------- | ----------------------------------- |
| Vercel deployment API | Deploy from export pipeline                  | `src/app/api/deploy/route.ts`       |
| Live URL display      | Show user their URL post-deploy              | Preview page update                 |
| Subscription status   | Check active subscription via Clerk metadata | `src/lib/hooks/use-subscription.ts` |

### Week 3-4: Distribution

| Task            | Details                      | Files                                             |
| --------------- | ---------------------------- | ------------------------------------------------- |
| Homepage fix    | Real examples, correct stats | `src/app/page.tsx`                                |
| Email capture   | Loading screen integration   | `src/components/platform/intake/Step6Loading.tsx` |
| Shareable links | Phase 6B implementation      | Convex schema + share component                   |
| PostHog events  | Full funnel tracking         | Throughout                                        |

### Week 4-5: $99 Export

| Task                    | Details                       | Files                                |
| ----------------------- | ----------------------------- | ------------------------------------ |
| Stripe one-time payment | $99 product, separate webhook | Stripe config                        |
| Enhanced export         | Better HTML/CSS output        | `src/lib/export/generate-project.ts` |
| Export confirmation     | Post-payment download flow    | New component                        |

### Week 5-6: AI Design Chat (MVP)

| Task               | Details                                                                  | Files              |
| ------------------ | ------------------------------------------------------------------------ | ------------------ |
| Chat UI            | Sidebar panel or bottom sheet                                            | New component      |
| Claude integration | Patch types: adjust_theme, rewrite_copy, add_component, remove_component | Convex action      |
| Usage tracking     | 1 free / unlimited Pro                                                   | Subscription check |
| PostHog events     | chat_started, chat_message, chat_upgrade_prompted                        | Throughout         |

---

## Revenue Projections (Conservative)

| Timeframe | Starter ($12/mo)   | Pro ($29/mo)      | Export ($99)          | Total MRR            |
| --------- | ------------------ | ----------------- | --------------------- | -------------------- |
| Month 1   | 5 users = $60      | 1 user = $29      | 2 exports = $198\*    | ~$89 MRR + $198      |
| Month 3   | 20 users = $240    | 5 users = $145    | 8 exports = $792\*    | ~$385 MRR + $792     |
| Month 6   | 50 users = $600    | 15 users = $435   | 20 exports = $1,980\* | ~$1,035 MRR + $1,980 |
| Month 12  | 150 users = $1,800 | 50 users = $1,450 | 50 exports = $4,950\* | ~$3,250 MRR + $4,950 |

\*Export revenue is one-time, not recurring.

**Break-even analysis:**

- Vercel Pro: $20/mo (covers ~100 sites)
- Convex Pro: $25/mo (at scale)
- Claude API: ~$0.05/user/mo generation + ~$0.50/Pro user/mo chat
- **Break-even: ~4 Starter users OR 2 Pro users**

---

## Competitive Positioning

| Feature             | Squarespace ($16-65/mo) | Wix ($17-159/mo) | Framer ($5-30/mo) | EWB ($12-29/mo)                          |
| ------------------- | ----------------------- | ---------------- | ----------------- | ---------------------------------------- |
| AI generation       | Text only               | ADI (basic)      | AI page gen       | Deep brand capture (9-step)              |
| Customization       | Drag-drop editor        | Drag-drop        | Visual editor     | Guided + AI Chat                         |
| Export/own code     | No                      | No               | Limited           | **Yes ($99)**                            |
| Lock-in             | High                    | High             | Medium            | **Zero**                                 |
| Brand understanding | None                    | Basic            | None              | **Deep (personality, voice, archetype)** |
| Starting price      | $16/mo                  | $17/mo           | $5/mo             | **$12/mo**                               |

**Our tagline:** "Other companies make websites. We make YOUR website."

---

## Delight Champion Conditions (ELEVATED — Must Be Honored)

1. Free tier remains complete and lovable — nothing removed, ever
2. Reveal moment (site generation → preview) is never paywalled
3. First AI Chat message is free for all users
4. No flow-interrupting upgrade modals or popups
5. "Built with EWB" badge must be tasteful and themed, not embarrassing
6. Downgrade and cancel must be trivially easy
7. $99 export must be genuinely useful (real project files, not garbage dump)

---

## Metrics to Track

| Metric                     | Target                 | Tool    |
| -------------------------- | ---------------------- | ------- |
| Free → Starter conversion  | 5%                     | PostHog |
| Starter → Pro upgrade      | 15%                    | PostHog |
| Export purchase rate       | 3% of all users        | Stripe  |
| AI Chat → Pro conversion   | 30% of free chat users | PostHog |
| Monthly churn (Starter)    | <5%                    | Stripe  |
| Monthly churn (Pro)        | <3%                    | Stripe  |
| Email capture rate         | 20%                    | PostHog |
| Share rate                 | 10% of preview viewers | PostHog |
| Revenue per user (blended) | >$15/mo                | Stripe  |
