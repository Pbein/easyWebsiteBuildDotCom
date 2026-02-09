# Agent Directory

Quick reference for finding the right agent for any task.

**Last Updated**: December 5, 2025

---

## Slash Commands (Fastest Way to Work)

Use these commands for common workflows - they're faster than calling agents directly:

| Command           | What It Does                           | When to Use                            |
| ----------------- | -------------------------------------- | -------------------------------------- |
| `/verify`         | Invokes Karen for quality verification | After completing ANY task              |
| `/security-audit` | Runs security-compliance-expert audit  | Before merging security-sensitive code |
| `/test-full`      | Runs complete test suite with coverage | Before committing changes              |
| `/deploy-ready`   | Pre-deployment checklist               | Before deploying to production         |

**Usage**: Type the command directly in chat. Example: `/verify`

---

## Quick Lookup Table

| Agent                              | Use For                                                   | File                                |
| ---------------------------------- | --------------------------------------------------------- | ----------------------------------- |
| **twilio-isv-expert**              | A2P 10DLC, SMS integration, ISV setup, carrier compliance | `twilio-isv-expert.md`              |
| **stripe-payment-expert**          | Billing, subscriptions, webhooks, usage tracking          | `stripe-payment-expert.md`          |
| **convex-database-expert**         | Schema design, queries, indexes, multi-tenant data        | `convex-database-expert.md`         |
| **convex-fullstack-expert**        | Convex functions, actions, HTTP endpoints, real-time      | `convex-fullstack-expert.md`        |
| **nextjs-frontend-expert**         | App Router, RSC, UI/UX, WorkOS auth integration           | `nextjs-frontend-expert.md`         |
| **security-compliance-expert**     | TCPA, multi-tenant isolation, webhooks, legal             | `security-compliance-expert.md`     |
| **embed-security-expert**          | XSS, CSP, iframe security, embedded forms                 | `embed-security-expert.md`          |
| **sms-platform-test-engineer**     | Unit tests, integration tests, 85%+ coverage, TDD         | `tdd-test-engineer.md`              |
| **testing-devops-expert**          | CI/CD, deployment, monitoring, performance tests          | `testing-devops-expert.md`          |
| **code-quality-reviewer**          | Refactoring, DRY, performance, TypeScript best practices  | `code-quality-reviewer.md`          |
| **architecture-decision-recorder** | ADRs, tech decisions, pattern documentation               | `architecture-decision-recorder.md` |
| **karen**                          | Reality check, verify completion, validate claims         | `karen-pmo-expert.md`               |
| **link-analytics-expert**          | Dub.co, link shortening, QR codes, click analytics        | `link-analytics-expert.md`          |
| **sam-torres-dub-expert**          | Dub.co API implementation, webhooks, QR generation        | `sam-torres-dub-expert.md`          |
| **alex-hormozi-marketing-expert**  | Offers, landing pages, value props, conversion            | `alex-hormozi-marketing-expert.md`  |
| **vercel-migration-expert**        | Vercel deployment, env config, edge functions             | `vercel-migration-expert.md`        |

---

## By Category

### Domain Experts (Core Platform)

| Agent                     | Domain        | When to Use                           |
| ------------------------- | ------------- | ------------------------------------- |
| `twilio-isv-expert`       | SMS/Messaging | Any Twilio, A2P, or SMS sending work  |
| `stripe-payment-expert`   | Payments      | Any billing, Stripe, or revenue work  |
| `convex-database-expert`  | Database      | Schema changes, query optimization    |
| `convex-fullstack-expert` | Full-Stack    | Backend + frontend Convex integration |
| `nextjs-frontend-expert`  | Frontend      | UI components, routing, auth flows    |

### Security & Compliance

| Agent                        | Focus             | When to Use                         |
| ---------------------------- | ----------------- | ----------------------------------- |
| `security-compliance-expert` | Platform Security | TCPA, multi-tenant, webhooks, legal |
| `embed-security-expert`      | Embed Security    | XSS, CSP, iframe, embedded widgets  |

### Quality & Process

| Agent                            | Role          | When to Use                                 |
| -------------------------------- | ------------- | ------------------------------------------- |
| `karen`                          | Reality Check | **ALWAYS** - final verification of any work |
| `sms-platform-test-engineer`     | Testing       | Write tests, achieve coverage goals         |
| `testing-devops-expert`          | DevOps        | CI/CD, deployment, monitoring               |
| `code-quality-reviewer`          | Code Quality  | Refactoring, performance, patterns          |
| `architecture-decision-recorder` | Documentation | Record major tech decisions                 |

### Integrations & Marketing

| Agent                           | Integration | When to Use                         |
| ------------------------------- | ----------- | ----------------------------------- |
| `link-analytics-expert`         | Dub.co      | Link shortening strategy, analytics |
| `sam-torres-dub-expert`         | Dub.co API  | Implement Dub.co integration        |
| `alex-hormozi-marketing-expert` | Marketing   | Offers, landing pages, conversion   |
| `vercel-migration-expert`       | Vercel      | Deployment, hosting migration       |

---

## Decision Tree

```
What are you working on?

SMS/Twilio/A2P?
└─→ twilio-isv-expert

Billing/Stripe/Payments?
└─→ stripe-payment-expert

Database schema/queries?
└─→ convex-database-expert

Frontend UI/UX?
└─→ nextjs-frontend-expert

Security/Compliance?
├─→ Platform-wide → security-compliance-expert
└─→ Embeds/iframes → embed-security-expert

Testing?
├─→ Write tests → sms-platform-test-engineer
└─→ CI/CD/Deploy → testing-devops-expert

Link shortening/QR?
├─→ Strategy → link-analytics-expert
└─→ Implementation → sam-torres-dub-expert

Marketing/Offers?
└─→ alex-hormozi-marketing-expert

Vercel deployment?
└─→ vercel-migration-expert

Code quality/refactoring?
└─→ code-quality-reviewer

Document a decision?
└─→ architecture-decision-recorder

Verify something is done?
└─→ karen (ALWAYS use at end of tasks)
```

---

## Mandatory Workflow

**Every task MUST end with verification:**

```
Standard Tasks (use /verify command):
1. Use domain expert for implementation
2. Use security expert if touching sensitive code
3. Use test engineer for test coverage
4. Type /verify for Karen's quality check ← FASTEST

Security-Sensitive Tasks:
1. Use domain expert for implementation
2. Type /security-audit for security review
3. Type /verify for Karen's final approval

Pre-Deployment:
1. Type /test-full to run all tests
2. Type /deploy-ready for deployment checklist
3. Type /verify for final go/no-go
```

### When to Use Commands vs Direct Agent Calls

| Situation                     | Use Command       | Call Agent Directly                |
| ----------------------------- | ----------------- | ---------------------------------- |
| Standard feature verification | `/verify`         | Complex multi-component validation |
| Quick security check          | `/security-audit` | Deep security architecture review  |
| Pre-commit testing            | `/test-full`      | Custom test strategy needed        |
| Standard deployment           | `/deploy-ready`   | High-risk production changes       |

**Rule of thumb**: Commands for speed, direct agent calls for depth.

---

## Supporting Documentation

| File                            | Purpose                          |
| ------------------------------- | -------------------------------- |
| `AGENT_COLLABORATION_MATRIX.md` | When/how agents work together    |
| `TEAM_WORKFLOW.md`              | Standard workflows and patterns  |
| `TEAM_CHARTER.md`               | Product context all agents share |
| `AGENT_TEAM_ENHANCEMENTS.md`    | Future improvement plans         |
| `_product_context_template.md`  | Template for new agents          |

---

## Quick Reference

### Slash Commands (Use These First)

```bash
/verify           # Karen verification (after any task)
/security-audit   # Security check (before merging)
/test-full        # Run all tests (before committing)
/deploy-ready     # Deployment checklist (before deploying)
```

### Finding Agents

```bash
# List all agents
ls .claude/agents/*.md | grep -v -E "(README|TEAM|AGENT_|_product)"

# Find agent by keyword
grep -l "twilio" .claude/agents/*.md
grep -l "billing" .claude/agents/*.md
```

### Agent Collaboration Quick Reference

```
SMS Feature → twilio-isv-expert → security-compliance-expert → /verify
Billing Feature → stripe-payment-expert → convex-database-expert → /verify
Database Change → convex-database-expert → /security-audit → /verify
Frontend Feature → nextjs-frontend-expert → sms-platform-test-engineer → /verify
Any Security Work → security-compliance-expert → /verify
Any Deployment → /test-full → /deploy-ready → /verify
```
