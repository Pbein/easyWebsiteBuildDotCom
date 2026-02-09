# Agent Collaboration Matrix

**Purpose**: Define when and how agents should work together for optimal results.

**Last Updated**: December 5, 2025

---

## 🚀 Slash Commands (Fastest Collaboration)

Before reading this matrix, know that **slash commands** provide the fastest path for common workflows:

| Command           | What It Does                     | Replaces                       |
| ----------------- | -------------------------------- | ------------------------------ |
| `/verify`         | Invokes Karen for quality check  | "Karen, please verify..."      |
| `/security-audit` | Security-compliance-expert audit | Manual security review request |
| `/test-full`      | Run complete test suite          | Multiple test commands         |
| `/deploy-ready`   | Pre-deployment checklist         | Manual deployment verification |

**Use commands first, then this matrix for complex multi-agent coordination.**

---

## 🎯 Primary Collaboration Patterns

### Task Type → Primary Agent → Supporting Agents

| Task Type                    | Primary Agent                  | Must Collaborate With                                   | Optional Support                                                           |
| ---------------------------- | ------------------------------ | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| **SMS Sending**              | twilio-isv-expert              | security-compliance-expert (TCPA), karen (verify)       | convex-database-expert (schema)                                            |
| **Stripe Billing**           | stripe-payment-expert          | convex-database-expert (usage tracking), karen (verify) | security-compliance-expert (webhooks)                                      |
| **A2P Compliance**           | twilio-isv-expert              | security-compliance-expert (legal), karen (verify)      | -                                                                          |
| **Database Schema**          | convex-database-expert         | karen (verify)                                          | twilio-isv-expert (message schema), stripe-payment-expert (billing schema) |
| **Frontend UI**              | nextjs-frontend-expert         | convex-database-expert (data layer), karen (verify)     | -                                                                          |
| **Testing**                  | sms-platform-test-engineer     | karen (verify tests work)                               | All domain experts for their areas                                         |
| **Security Audit**           | security-compliance-expert     | karen (verify), all agents (check their code)           | -                                                                          |
| **DevOps/Deploy**            | testing-devops-expert          | karen (production ready), all agents (pre-deploy check) | -                                                                          |
| **Code Quality/Refactoring** | code-quality-reviewer          | karen (verify improvement), domain experts (validate)   | -                                                                          |
| **Architecture Decision**    | architecture-decision-recorder | karen (validate), all relevant domain experts           | -                                                                          |
| **Reality Check**            | karen                          | N/A (karen reviews everyone's work)                     | All agents report to karen                                                 |

---

## 🔄 Mandatory Collaboration Workflows

### 1. **SMS Sending Implementation**

```
1. twilio-isv-expert: Implement Twilio integration
2. /security-audit: Quick TCPA compliance check
   (OR security-compliance-expert for deep review)
3. sms-platform-test-engineer: Create comprehensive tests
4. /verify: Karen verification ← FASTEST
   (OR call karen directly for complex validation)
```

### 2. **Billing Implementation**

```
1. stripe-payment-expert: Implement Stripe integration
2. convex-database-expert: Design usage tracking schema
3. /security-audit: Verify webhook security
4. sms-platform-test-engineer: Test billing accuracy
5. /verify: Karen verification for revenue protection
```

### 3. **New Feature Development**

```
1. Domain expert: Implement core functionality
   - Frontend? → nextjs-frontend-expert
   - Backend? → convex-database-expert
   - SMS? → twilio-isv-expert
   - Payment? → stripe-payment-expert
2. sms-platform-test-engineer: Create comprehensive tests
3. /security-audit: Security review (if touching sensitive code)
4. /verify: Karen verification before "done"
```

### 4. **Production Deployment**

```
1. testing-devops-expert: Prepare deployment
2. /test-full: Run complete test suite
3. /security-audit: Final security check
4. /deploy-ready: Pre-deployment checklist
5. /verify: Karen's production readiness verification
6. testing-devops-expert: Execute deployment
```

---

## 🤝 Agent-Specific Collaboration Rules

### Karen (Reality-Check Agent)

**Role**: FINAL APPROVAL FOR EVERYTHING
**Collaborates with**: ALL agents (reviews their work)
**When to call**: After completing ANY task
**Pattern**: "Karen, please verify [task] is complete and production-ready"

### Twilio ISV Expert

**Collaborates with**:

- security-compliance-expert: TCPA compliance, opt-out handling
- convex-database-expert: Message schema, A2P state tracking
- sms-platform-test-engineer: SMS delivery tests
- karen: Final verification

### Stripe Payment Expert

**Collaborates with**:

- convex-database-expert: Usage tracking, billing schema
- security-compliance-expert: Webhook security, PCI compliance
- sms-platform-test-engineer: Billing accuracy tests
- karen: Revenue protection verification

### Security Compliance Expert

**Collaborates with**:

- ALL agents: Security review of their implementations
- twilio-isv-expert: TCPA compliance
- stripe-payment-expert: Webhook security
- karen: Security completeness verification

### Convex Database Expert

**Collaborates with**:

- twilio-isv-expert: Message/A2P schema
- stripe-payment-expert: Billing/usage schema
- nextjs-frontend-expert: Data layer integration
- karen: Schema completeness verification

### Next.js Frontend Expert

**Collaborates with**:

- convex-database-expert: Data queries and mutations
- security-compliance-expert: Client-side security
- karen: UI completeness verification

### SMS Platform Test Engineer

**Collaborates with**:

- ALL domain experts: Test their implementations
- karen: Verify tests actually work

### Testing DevOps Expert

**Collaborates with**:

- ALL agents: Pre-deployment verification
- karen: Production readiness check

---

## 📋 Pre-Work Checklist (ALL Agents)

### **Before Starting ANY Task:**

1. ✅ Read `.claude/agents/TEAM_CHARTER.md` for product/customer context
2. ✅ Check `docs/AI_MEMORY.md` for navigation & platform patterns
3. ✅ Review relevant existing code/tests to understand current state
4. ✅ Consult domain expert if crossing specialty boundaries
5. ✅ Plan for Karen verification at task completion

### **After Completing ANY Task:**

1. ✅ Self-review against quality standards (TEAM_CHARTER.md)
2. ✅ Run relevant test suite (`npm test:*` commands)
3. ✅ Update documentation if introducing new patterns
4. ✅ **ALWAYS** call Karen agent for final verification

---

## 📋 Collaboration Protocol

### How to Request Agent Collaboration

**Pattern 1: Slash Commands (FASTEST)**

```typescript
// For most workflows, use commands:
"Implement with domain expert, then /security-audit, then /verify";

// Example:
"Use twilio-isv-expert for SMS sending → /security-audit → /verify";
```

**Pattern 2: Sequential (one after another)**

```typescript
"Use twilio-isv-expert to implement SMS sending,
then use security-compliance-expert to validate TCPA compliance,
then use karen to verify completion"

// Modern equivalent:
"Use twilio-isv-expert to implement SMS sending,
then /security-audit for TCPA check,
then /verify for Karen's approval"
```

**Pattern 3: Parallel (multiple agents together)**

```typescript
"Use twilio-isv-expert and security-compliance-expert together
to implement TCPA-compliant SMS sending,
then /verify"
```

**Pattern 4: Consultation (get expert input)**

```typescript
"Consult twilio-isv-expert about A2P compliance requirements
before implementing with convex-database-expert"
```

### When to Use Commands vs Direct Agent Calls

| Scenario              | Use Command       | Call Agent Directly               |
| --------------------- | ----------------- | --------------------------------- |
| Standard verification | `/verify`         | Complex multi-part validation     |
| Quick security check  | `/security-audit` | Deep security architecture review |
| Pre-commit testing    | `/test-full`      | Custom testing strategy           |
| Standard deployment   | `/deploy-ready`   | High-risk production changes      |
| Feature complete?     | `/verify`         | Karen for complex assessment      |

---

## ⚠️ Common Mistakes to Avoid

### ❌ Don't Do This:

```
User: "Implement SMS sending"
→ Implement directly without agents
→ Mark as complete without Karen
Result: Incomplete, no TCPA compliance, fails in production
```

### ✅ Do This Instead:

```
User: "Implement SMS sending"
→ "Use twilio-isv-expert to implement SMS sending"
→ "Use security-compliance-expert to validate TCPA compliance"
→ "Use sms-platform-test-engineer to create tests"
→ "Use karen to verify everything is complete"
Result: Complete, TCPA compliant, tested, production-ready
```

---

## 🎯 Success Patterns

### Pattern 1: "Build → Secure → Test → Verify"

```
1. Domain expert builds feature
2. Security expert reviews
3. Test engineer creates tests
4. Karen verifies completion
```

### Pattern 2: "Plan → Collaborate → Implement → Verify"

```
1. Multiple experts plan together
2. Domain expert implements
3. Supporting experts review
4. Karen verifies completion
```

### Pattern 3: "Research → Implement → Validate → Verify"

```
1. Domain expert researches approach
2. Domain expert implements
3. Security/Testing experts validate
4. Karen verifies completion
```

---

## 📊 Agent Priority Matrix

### When Multiple Agents Are Needed, This Is The Order:

1. **Domain Expert** (primary implementer)
   - twilio-isv-expert for SMS
   - stripe-payment-expert for billing
   - convex-database-expert for database
   - nextjs-frontend-expert for UI

2. **Security Review** (always required for production)
   - security-compliance-expert

3. **Testing** (always required for production)
   - sms-platform-test-engineer

4. **Final Verification** (ALWAYS MANDATORY)
   - karen (nothing is complete without Karen's approval)

---

## 🔍 Karen's Special Role

Karen is **NOT just another agent** - Karen is the **FINAL AUTHORITY** on completion.

**Karen's Mandate**:

- Reviews ALL work from ALL agents
- Determines "actually done" vs "looks done"
- Has veto power over "complete" claims
- Reports to project stakeholders

**How to invoke Karen**:

| Method                    | When to Use                            |
| ------------------------- | -------------------------------------- |
| `/verify` command         | Standard verification (FASTEST)        |
| Call karen agent directly | Complex validation, deep investigation |

**The `/verify` command IS Karen** - it invokes Karen's verification workflow automatically.

**How Karen works with other agents**:

- Agents do the work
- `/verify` or direct karen call for verification
- Karen verifies and approves
- Only then is task "complete"

---

## 🎉 Expected Outcomes

With this collaboration matrix:

- ✅ Every task uses appropriate domain expert
- ✅ Security is always reviewed
- ✅ Tests are always created
- ✅ Karen always verifies completion
- ✅ No "complete but broken" features
- ✅ Consistent quality across all work

---

## 🚀 Quick Reference: Command-Based Workflows

### Most Common Workflows

```
Feature Development:
  domain-expert → /test-full → /verify

Security-Sensitive Feature:
  domain-expert → /security-audit → /test-full → /verify

Database Changes:
  convex-database-expert → /security-audit → /verify

Production Deployment:
  /test-full → /deploy-ready → /verify

Quick Verification:
  /verify (anytime you need Karen's check)
```

### Agent + Command Combinations

| Task             | Agent(s)                                       | Commands                                   |
| ---------------- | ---------------------------------------------- | ------------------------------------------ |
| SMS Feature      | twilio-isv-expert                              | `/security-audit` → `/verify`              |
| Billing Feature  | stripe-payment-expert + convex-database-expert | `/security-audit` → `/verify`              |
| Frontend Feature | nextjs-frontend-expert                         | `/test-full` → `/verify`                   |
| Database Schema  | convex-database-expert                         | `/security-audit` → `/verify`              |
| Security Audit   | security-compliance-expert                     | `/verify`                                  |
| Deploy to Prod   | testing-devops-expert                          | `/test-full` → `/deploy-ready` → `/verify` |

---

**Last Updated**: December 5, 2025
**Maintained By**: AI team leads
**Review Cadence**: After adding new agents, commands, or identifying new patterns
