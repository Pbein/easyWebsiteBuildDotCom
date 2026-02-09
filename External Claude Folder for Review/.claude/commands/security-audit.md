Use the **security-compliance-expert** agent to audit the current changes for security vulnerabilities.

## Security Audit Scope

Analyze all modified files for security issues, focusing on:

### 1. Multi-Tenant Isolation (CRITICAL)

- [ ] All Convex queries use `orgQuery` wrapper (NOT bare `query`)
- [ ] All Convex mutations use `orgMutation` wrapper (NOT bare `mutation`)
- [ ] Every function includes `organizationId: v.id("organizations")` in args
- [ ] Handler uses `{ user, membership }` context from wrapper
- [ ] Resources are verified to belong to the organization before access

### 2. Authentication & Authorization

- [ ] No unauthenticated access to sensitive data
- [ ] RBAC checks in place where needed
- [ ] Session validation occurring correctly
- [ ] WorkOS auth integration used properly

### 3. Payment Gates

- [ ] Premium features use `requirePayment: true`
- [ ] Features that should be gated:
  - `sendCampaign`
  - `scheduleAICampaign`
  - A2P registration
  - SMS AI Agent
- [ ] Features that should NOT be gated:
  - Dashboard access
  - Contacts management
  - Draft creation
  - Settings

### 4. Webhook Security

- [ ] Webhook handlers use `internalMutation` (not exposed to clients)
- [ ] Signature validation in place for Stripe/Twilio/WorkOS
- [ ] Timing-safe comparison for signatures
- [ ] Organization resolution for multi-tenant webhooks

### 5. Data Security

- [ ] No sensitive data in logs (passwords, tokens, PII)
- [ ] No hardcoded secrets
- [ ] Environment variables used for configuration
- [ ] Input validation on all user inputs

### 6. TCPA Compliance

- [ ] Consent validation before SMS sending
- [ ] Opt-out handling implemented
- [ ] Message content compliant with regulations
- [ ] Proper disclosure in forms

## Output Format

```
## Security Audit Report

### Multi-Tenant Isolation: [SCORE/10]
- Files checked: [X files]
- Issues found: [None/List]
- Security wrappers: [All correct/Issues found]

### Authentication: [SCORE/10]
- Auth patterns: [Correct/Issues]
- RBAC usage: [Correct/Issues]

### Payment Gates: [SCORE/10]
- Premium features gated: [Yes/No - list missing]
- Incorrect gates: [None/List]

### Webhook Security: [SCORE/10]
- Signature validation: [Present/Missing]
- Internal mutations: [Used/Not used]

### Data Security: [SCORE/10]
- Sensitive data exposure: [None/Found]
- Input validation: [Present/Missing]

### TCPA Compliance: [SCORE/10]
- Consent flows: [Correct/Issues]
- Opt-out handling: [Present/Missing]

## Overall Security Score: [X/10]

### Critical Issues (Fix Immediately)
[List any critical security issues]

### Warnings (Should Fix)
[List any security warnings]

### Recommendations
[List any security improvements]
```
