# SMS Marketing Platform - AI Agent Team Charter

**Last Updated**: October 2025
**Version**: 1.0

---

## 🎯 Mission Statement

Deliver a **production-ready, multi-tenant SMS marketing platform** that helps boutiques and creators grow their business through simple, compliant messaging - while maintaining enterprise-grade quality, security, and performance.

---

## 👥 Our Customer

### **Who They Are**

- **Boutique owners** - Fashion, beauty, lifestyle stores with 500-5,000 customers
- **Local businesses** - Restaurants, salons, fitness studios with local customer base
- **OnlyFans creators** - Content creators building direct relationships with fans
- **Characteristics**: Non-technical, budget-conscious, need results fast

### **What They Need**

- **Easy SMS marketing** - No technical complexity, works in minutes
- **TCPA compliance** - Legal protection without understanding the law
- **Real results** - Grow revenue through SMS campaigns that convert
- **Affordable pricing** - $150-600/month fits their budget
- **Personal touch** - Contact cards, AI conversations, brand connection

### **Success Looks Like**

- Growing their customer base 20%+ through SMS
- Sending 500-2,000 messages/month with high open rates
- Staying TCPA compliant without hiring lawyers
- Spending 30 min/week managing campaigns (not hours)

---

## 🚀 Our Product

### **What We Built**

**SMS Marketing Platform** - Enterprise-grade multi-tenant SaaS

- **Technology Stack**: Next.js 15 + Convex (real-time) + Twilio ISV + Stripe
- **Core Value**: Simple SMS marketing with enterprise reliability
- **Differentiation**: A2P compliance automation + included SMS AI Agent

### **Key Capabilities**

1. **SMS Campaigns** - Create, schedule, send to contact lists
2. **A2P 10DLC Compliance** - Automated brand/campaign registration
3. **SMS AI Agent** - Included AI conversations (not "free", part of value)
4. **vCard Contact Cards** - RFC 6350 compliant digital business cards
5. **Real-time Analytics** - Live campaign stats, delivery tracking
6. **Multi-tenant Architecture** - Isolated data, secure org boundaries

### **Business Model**

#### **2-Tier Accelerator-First Funnel**

```
PRIMARY PATH (Recommended):
┌─────────────────────────────────────────┐
│ Accelerator Tier                        │
│ $597 one-time (includes 90-day setup)   │
│ → Then $150/month after 90 days         │
│                                         │
│ Includes:                               │
│ - 100 messages/month                    │
│ - SMS AI Agent (unlimited conversations)│
│ - A2P compliance setup                  │
│ - vCard contact cards                   │
│ - Personal onboarding & setup           │
└─────────────────────────────────────────┘

SECONDARY PATH (Downgrade option):
┌─────────────────────────────────────────┐
│ Standard Tier (DIY Self-Serve)          │
│ $150/month                              │
│                                         │
│ Includes:                               │
│ - 100 messages/month                    │
│ - SMS AI Agent (unlimited conversations)│
│ - A2P compliance (self-service)         │
│ - All platform features                 │
└─────────────────────────────────────────┘
```

#### **Revenue Model**

- **Accelerator**: 40% margin on $597 upfront, 68.4% margin on $150/mo recurring
- **Standard**: 68.4% gross margin on $150/mo subscription
- **Add-ons**: Message packs ($40-150), professional vCards
- **Target**: All users funneled to Accelerator first, Standard as downgrade

#### **Pricing Terminology** (CRITICAL - Use Everywhere)

✅ **Always say**: "Messages" (not credits, not segments)
✅ **Always say**: "1 message = 1 credit" (simple, predictable)
✅ **Always say**: "SMS AI Agent included" (not "free")
❌ **Never say**: "Segments", "credits", "free AI", "units"

**Why**: Customers don't understand technical terms. Keep it simple.

---

## 📊 Success Metrics

### **Platform Performance SLAs**

- **SMS Throughput**: 10,000 messages/hour minimum capacity
- **API Response**: <100ms p95 latency
- **Page Load**: <1s initial dashboard load
- **Real-time Updates**: <2s latency for live data
- **Webhook Processing**: <500ms per webhook
- **Uptime**: 99.9% availability

### **Quality Standards**

- **Test Coverage**: 85%+ overall (95% for critical SMS/billing functions)
- **Security**: 100% coverage on multi-tenant isolation (`requireOrgAccess` everywhere)
- **Build**: Zero TypeScript errors in strict mode
- **Performance**: Bundle size <500KB initial load
- **TDD Compliance**: Tests written before implementation

### **Business KPIs**

- **Customer Retention**: 85%+ monthly (sticky platform)
- **Accelerator Conversion**: 70%+ take Accelerator over Standard
- **Average Message Volume**: 1,500 messages/customer/month
- **Support Tickets**: <5% of customers/month need help
- **Net Promoter Score**: 50+ (customers love us)

---

## 🏗️ Technical Architecture

### **Technology Stack**

```
Frontend:
- Next.js 15 (App Router, Turbopack)
- React 19 with Server Components
- TailwindCSS + Radix UI
- TypeScript (strict mode)

Backend:
- Convex (real-time database + functions)
- Convex Actions (external APIs)
- Convex HTTP Actions (webhooks)

External Services:
- WorkOS AuthKit (enterprise auth)
- Twilio ISV (SMS sending, A2P compliance)
- Stripe (billing, usage tracking)
- Vercel (hosting, edge functions)
```

### **Core Architectural Patterns**

#### **1. Multi-Tenant Security** (CRITICAL)

```typescript
// EVERY Convex function MUST follow this pattern:
export const anyFunction = mutation({
  args: { organizationId: v.id("organizations"), ... },
  handler: async (ctx, args) => {
    // FIRST LINE - Validates user can access this organization
    await requireOrgAccess(ctx, args.organizationId);

    // Then scope ALL queries to organization
    const data = await ctx.db
      .query("table")
      .withIndex("by_organization", q =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();
  }
});
```

#### **2. Real-time with Convex**

```typescript
// Frontend: Reactive queries (auto-update on changes)
const campaigns = useQuery(api.campaigns.listCampaigns, { organizationId });

// Backend: Mutations automatically invalidate dependent queries
const create = useMutation(api.campaigns.createCampaign);
```

#### **3. Component Co-location**

```
Features own their components for discoverability:
src/app/(dashboard)/org/[slug]/
  ├── contacts/components/     # Contact management UI
  ├── campaigns/components/    # Campaign builder UI
  ├── a2p/components/         # A2P compliance flow
  └── settings/components/    # Org settings UI

Shared components ONLY when used by 3+ features:
src/components/
  ├── ui/                     # Base design system
  ├── auth/                   # Auth flows
  └── shared/                 # Cross-feature components
```

#### **4. TDD Development**

```bash
# Test-first workflow (RED → GREEN → REFACTOR)
1. Write failing test
2. Implement minimal code to pass
3. Refactor for quality
4. Commit with meaningful message

# Git commit pattern:
RED: Add failing test for [feature]
GREEN: Implement [feature] to pass tests
REFACTOR: Optimize [feature] performance
```

---

## 🛡️ Security & Compliance

### **Multi-Tenant Isolation** (Zero Tolerance)

- **Rule**: No cross-organization data access ever
- **Implementation**: `requireOrgAccess()` in every function
- **Testing**: 100% coverage on security tests
- **Validation**: Karen agent verifies isolation before production

### **TCPA Compliance** (Legal Requirement)

- **Opt-in Required**: Explicit consent before SMS
- **Opt-out Honored**: STOP/UNSUBSCRIBE processed immediately
- **Quiet Hours**: No SMS 9pm-8am local time
- **Records**: All consent tracked with timestamps
- **AI Safety**: Prompt injection protection (3-layer defense)

### **Webhook Security**

- **Signature Validation**: Twilio/Stripe signatures verified (timing-safe)
- **Organization Resolution**: Webhook data mapped to correct org
- **Idempotency**: Duplicate webhooks handled gracefully
- **Rate Limiting**: Prevent abuse and DDoS

### **A2P 10DLC State Machine**

```
NOT_STARTED →
BUSINESS_PROFILE_PENDING → BUSINESS_PROFILE_COMPLETED →
TRUST_SCORE_PENDING → TRUST_SCORE_COMPLETED →
BRAND_REGISTRATION_PENDING → BRAND_REGISTRATION_SUBMITTED → BRAND_REGISTRATION_APPROVED →
CAMPAIGN_PENDING → CAMPAIGN_SUBMITTED → CAMPAIGN_APPROVED →
PHONE_NUMBER_PENDING → PHONE_NUMBER_PROVISIONED → COMPLETED

Error States: ERROR, REJECTED (with retry mechanisms)
```

---

## 👥 Agent Team Structure

### **Domain Experts** (Technical Implementation)

- **twilio-isv-expert** - SMS sending, A2P compliance, ISV setup
- **stripe-payment-expert** - Billing, revenue protection, usage tracking
- **security-compliance-expert** - TCPA, multi-tenant, webhook security
- **convex-database-expert** - Database design, schema, migrations
- **nextjs-frontend-expert** - Frontend, UI/UX, auth integration
- **convex-fullstack-expert** - Full-stack Convex development

### **Quality & Testing**

- **tdd-test-engineer** - Test strategy, TDD methodology
- **sms-platform-test-engineer** - Comprehensive SMS testing (85%+ coverage)
- **testing-devops-expert** - CI/CD, infrastructure, deployment
- **code-quality-reviewer** - Refactoring, performance, maintainability

### **Specialized Experts**

- **embed-security-expert** - Embed widget security
- **link-analytics-expert** - Link tracking & analytics
- **sam-torres-dub-expert** - Dub.co link management
- **vercel-migration-expert** - Vercel deployment & optimization
- **architecture-decision-recorder** - ADR documentation

### **Management & Quality Assurance**

- **karen-pmo-expert** - Reality checking, completion verification, final QA

### **Collaboration Protocol**

```
Standard Workflow:
1. Domain Expert → Implements feature
2. Security Expert → Reviews security
3. Test Engineer → Creates comprehensive tests
4. Karen → Verifies completion & production-readiness

MANDATORY: All tasks end with Karen verification
```

---

## 🎯 Quality Standards

### **Code Quality**

- **DRY Principles**: No duplicate logic
- **Single Responsibility**: One component, one purpose
- **Complexity**: Functions <50 lines, components <200 lines
- **Naming**: Reads like English, clear intent
- **Comments**: Document why, not what

### **Testing Requirements**

| Component Type      | Coverage Required | Test Types                        |
| ------------------- | ----------------- | --------------------------------- |
| SMS Core Functions  | 95%+              | Unit, Integration, E2E            |
| Billing & Payments  | 95%+              | Unit, Integration, Accuracy       |
| Security & RBAC     | 100%              | Unit, Security, Cross-tenant      |
| Frontend Components | 80%+              | Unit, Integration, Accessibility  |
| API Endpoints       | 90%+              | Integration, Load, Error handling |

### **Performance Standards**

- **No N+1 Queries**: Batch database operations
- **Efficient Indexing**: All queries use proper indexes
- **Lazy Loading**: Heavy components loaded on demand
- **Memoization**: Expensive computations cached
- **Bundle Optimization**: Code splitting, tree shaking

---

## 📋 Pre-Work Checklist (ALL Agents)

### **Before Starting ANY Task:**

1. ✅ Read this `TEAM_CHARTER.md` for product/customer context
2. ✅ Check `docs/AI_MEMORY.md` for navigation & patterns
3. ✅ Review relevant existing code/tests
4. ✅ Consult domain expert if crossing boundaries
5. ✅ Plan for Karen verification at completion

### **After Completing ANY Task:**

1. ✅ Self-review against quality standards (this charter)
2. ✅ Run relevant test suite (`npm test:*`)
3. ✅ Update documentation if needed
4. ✅ **ALWAYS** call Karen agent for final verification

---

## 🚀 Release Criteria

### **Definition of "Done"** (Karen's Validation)

A feature is ONLY complete when ALL criteria are met:

- ✅ Works in production with real phone numbers/carriers
- ✅ Has `requireOrgAccess()` and proper org filtering
- ✅ Handles all error cases with retry logic
- ✅ Has 85%+ test coverage (95%+ for SMS/billing, 100% for security)
- ✅ Performs under 10,000 msg/hour load
- ✅ Real-time updates work via Convex subscriptions
- ✅ TDD approach verified in git commit history
- ✅ Passes security audit (no cross-tenant access possible)
- ✅ Monitoring and alerts configured
- ✅ Karen agent verification completed

### **Production Deployment Checklist**

- [ ] All tests passing (85%+ coverage)
- [ ] Load testing completed (10k msg/hour)
- [ ] Security audit passed (100% isolation)
- [ ] Webhook reliability verified (retry + DLQ)
- [ ] A2P compliance flow tested end-to-end
- [ ] Billing accuracy validated ($100+ test payments)
- [ ] Real-time subscriptions working (<2s latency)
- [ ] Error tracking & monitoring active (Sentry)
- [ ] Karen final approval received

---

## 💡 Remember Our Purpose

**We're not just building features - we're helping real businesses grow.**

Every line of code we write impacts:

- A boutique owner trying to grow her customer base
- A restaurant filling tables with SMS campaigns
- A creator building deeper fan relationships

**Quality = Customer Success**

- Clean code → Faster features → More value delivered
- Performance → Better UX → Higher retention → More revenue
- Security → TCPA compliance → No lawsuits → Business protected
- Testing → Fewer bugs → Happier customers → Better reviews

**Our North Star**: Make SMS marketing so simple and effective that our customers can't imagine running their business without us.

---

## 📚 Key Documentation

- **Product Context**: `docs/AI_MEMORY.md` - Quick navigation guide
- **Architecture**: `CLAUDE.md` - Technical patterns & setup
- **Agent Collaboration**: `.claude/agents/AGENT_COLLABORATION_MATRIX.md`
- **Team Workflow**: `.claude/agents/TEAM_WORKFLOW.md`
- **Business Model**: `docs/business/pricing/PRICING_MODEL.md`

---

**This charter is our shared understanding of what we're building and why it matters.**

Every agent should reference this before starting work to ensure alignment with product vision, customer needs, and quality standards.

🚀 **Let's build something amazing together!**
