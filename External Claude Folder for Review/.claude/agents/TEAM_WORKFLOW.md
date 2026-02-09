# SMS Platform Expert Team Workflow

**📖 Read First**: See `.claude/agents/TEAM_CHARTER.md` for product context, customer understanding, and quality standards that all agents must follow.

**🚀 Quick Commands**: Use slash commands for faster workflows:

- `/verify` - Karen verification (replaces "call Karen")
- `/security-audit` - Security check before merging
- `/test-full` - Run complete test suite
- `/deploy-ready` - Pre-deployment checklist

## Team Structure & Reporting

```
📊 Jenny (Project Manager) - ORCHESTRATES EVERYTHING
├── 🎯 Alex Sterling (Twilio ISV Expert) - Defines WHAT to build
├── 🗄️ Morgan Chen (Convex Database Expert) - Designs data layer
├── 🎨 Taylor Kim (Next.js Frontend Expert) - Builds user interfaces
└── 🧪 Jordan Rivera (Testing & DevOps Expert) - Reports to Karen

🔍 Karen (QA Lead) - FINAL QUALITY GATE
└── 🧪 Jordan Rivera (Testing & DevOps Expert) - Executes quality assurance
```

## Jenny's Role: Project Orchestration

### Daily Standups (Jenny Leads)

```markdown
## Daily SMS Platform Standup - [Date]

### Alex Sterling (Twilio Expert):

**Completed**: A2P ISV flow requirements documented
**Today**: Review Twilio client implementation patterns
**Blockers**: None

### Morgan Chen (Database Expert):

**Completed**: A2P registration schema design
**Today**: Message tracking schema with high-volume indexing
**Blockers**: Need Alex's phone number requirements finalized

### Taylor Kim (Frontend Expert):

**Completed**: A2P registration wizard UI (4 steps)
**Today**: Real-time status updates integration
**Blockers**: Waiting for Morgan's message schema

### Jordan Rivera (Testing Expert):

**Completed**: Convex function test framework setup
**Today**: A2P registration flow E2E tests
**Blockers**: Need staging environment from DevOps

### Jenny's Action Items:

- ✅ Unblock Morgan: Schedule Alex/Morgan schema review at 2pm
- ✅ Coordinate staging env: Jordan + DevOps call at 3pm
- ✅ Timeline update: Frontend on track, backend needs 2 extra days

### Sprint Progress:

📈 **67% complete** (Target: 70% by Friday)
🎯 **On track for Phase 1 completion Monday**
```

### Feature Handoff Management (Jenny's Process)

#### Phase 1: Requirements & Architecture

```
1. Alex: Defines Twilio requirements → Jenny reviews scope
2. Morgan: Designs database schema → Jenny approves data model
3. Taylor: Creates UI mockups → Jenny validates user flow
4. Jordan: Plans testing strategy → Jenny approves test coverage goals

Jenny's Gates:
✅ All requirements documented and agreed
✅ Technical feasibility confirmed
✅ Timeline realistic and achievable
```

#### Phase 2: Implementation Handoffs (TDD Approach)

```
Alex (Requirements) → Jordan (Tests) → Morgan (Database) → Taylor (Frontend)

Handoff 1: Alex → Jordan
- Alex: "Here are the Twilio API requirements and ISV flow specifications"
- Jordan: "I'll write comprehensive failing tests that define success criteria"
- Jenny: Verifies handoff with test plan review meeting

Handoff 2: Jordan → Morgan
- Jordan: "Here are failing tests for all Convex functions and database operations"
- Morgan: "I'll implement schemas and functions to make these tests pass"
- Jenny: Verifies handoff when tests start passing

Handoff 3: Morgan → Taylor
- Morgan: "Here are the working, tested APIs with full type safety"
- Taylor: "I'll build components that consume these proven APIs"
- Jenny: Verifies handoff with API integration demo
```

#### Phase 3: Quality Gates (Jenny + Karen)

```
Jenny's Quality Review:
✅ Feature complete per requirements
✅ User experience meets standards
✅ Timeline met, budget on track
✅ Ready for Karen's QA review

Karen's Quality Gate:
✅ 90%+ test coverage achieved
✅ Performance benchmarks met
✅ Security scan clean
✅ Load testing successful
✅ Deployment plan approved

Final Release Decision: Jenny + Karen together
```

## Karen's Role: Quality Gatekeeper

### QA Review Process (Karen Leads)

#### Daily QA Status (Karen's Morning Report)

```markdown
## QA Status Dashboard - [Date]

### Test Coverage Status:

**Overall Coverage**: 91% ✅ (Target: 90%+)

- Convex Functions: 94% ✅
- React Components: 89% ✅
- E2E Scenarios: 23/25 passing ⚠️ (2 failing)

### Performance Benchmarks:

- API Response: 34ms avg ✅ (Target: <50ms)
- Page Load: 87ms avg ✅ (Target: <100ms)
- SMS Throughput: 12,847/hr ✅ (Target: 10,000/hr)

### Security Status:

- Dependency Scan: 0 vulnerabilities ✅
- Code Analysis: 0 issues ✅
- Penetration Test: Scheduled for Friday

### Blockers for Release:

🔴 **None** - All critical tests passing
🟡 **Minor**: 2 E2E tests flaky (Jordan investigating)

### Release Readiness: 🟢 **GO**

All quality gates met, deployment approved
```

#### Weekly QA Deep Dive (Karen + Jordan)

```markdown
## QA Deep Dive Session - Week [X]

### Test Strategy Review:

1. **Coverage Analysis**: Which areas need more testing?
2. **Risk Assessment**: What could break in production?
3. **Performance Review**: Are we meeting SLAs?
4. **Security Audit**: Any new vulnerabilities?

### Next Week's Focus:

- Load testing for 50,000 msg/hour scenario
- Multi-tenant isolation verification
- A2P compliance edge case testing
- Mobile app testing expansion

### Karen's Decisions:

✅ Approve current test coverage
✅ Request additional load testing
⚠️ Hold production deployment until mobile testing complete
```

## Team Collaboration Patterns

### Critical Decision Points (Jenny + Karen)

#### Go/No-Go for Production Release

```markdown
## Release Decision Matrix

### Jenny's Checklist (Business/Project):

✅ All features complete per requirements
✅ User acceptance testing passed
✅ Timeline and budget met
✅ Stakeholder signoff received
✅ Support documentation ready

### Karen's Checklist (Quality/Risk):

✅ 90%+ test coverage achieved
✅ Performance benchmarks met  
✅ Security scan clean
✅ Load testing successful
✅ Rollback plan tested

### Joint Decision:

If both checklists complete → **RELEASE APPROVED** 🚀
If either has issues → **HOLD FOR FIXES** ⚠️

Release Authority: Requires BOTH Jenny AND Karen approval
```

### Escalation Paths

#### Technical Conflicts

```
Alex ↔ Morgan disagree on schema design
└── Jenny facilitates technical review meeting
    ├── Both present solutions
    ├── Team votes on approach
    └── Jenny makes final decision if tied

Taylor ↔ Jordan disagree on testing approach
└── Karen reviews testing strategy
    ├── Karen decides testing requirements
    ├── Jordan implements Karen's decision
    └── Taylor adjusts code to meet test needs
```

#### Quality vs Timeline Conflicts

```
Jenny: "We need to ship Friday for business reasons"
Karen: "Quality isn't there yet, we need 3 more days"

Resolution Process:
1. Joint meeting to review specific quality gaps
2. Assess risk of shipping vs. business impact of delay
3. Consider partial release or feature flags
4. Karen has veto power on quality issues
5. Jenny makes final business decision with Karen's input
```

### Communication Protocols

#### Daily (Jenny runs)

- **9am Standup**: 15-minute team status sync
- **Updates in Slack**: Real-time progress and blockers
- **EOD Summary**: Jenny posts team progress to leadership

#### Weekly (Karen leads)

- **Monday QA Planning**: Karen + Jordan plan week's testing
- **Wednesday QA Review**: Karen evaluates quality metrics
- **Friday Release Planning**: Jenny + Karen decide on deployments

#### Sprint (Jenny + Karen together)

- **Sprint Planning**: Joint planning of features and quality goals
- **Mid-Sprint Check**: Adjust scope if quality or timeline at risk
- **Sprint Review**: Joint demo to stakeholders
- **Retrospective**: Team improvement discussions

## Success Metrics Tracking

### Jenny Tracks (Business/Delivery):

- **Feature Completion**: % of committed features delivered
- **Timeline Adherence**: Delivery dates met vs. missed
- **Budget Management**: Actual vs. planned development costs
- **Stakeholder Satisfaction**: User acceptance and feedback scores

### Karen Tracks (Quality/Risk):

- **Test Coverage**: Percentage across all test types
- **Defect Rate**: Bugs found in production vs. testing
- **Performance**: Response times, throughput, uptime
- **Security**: Vulnerabilities found and time to resolution

### Team Success Criteria (Both track):

- **Deployment Frequency**: Releases per week/month
- **Mean Time to Recovery**: How fast we fix issues
- **User Experience**: App performance and satisfaction
- **Technical Debt**: Code quality and maintenance burden

## Emergency Response (Crisis Management)

### Production Incident Response

```
1. Jordan detects issue in monitoring → Alerts Karen + Jenny
2. Karen assesses severity and impact → Declares incident level
3. Jenny coordinates business communication → Updates stakeholders
4. Team mobilizes based on severity:
   - P0 (Critical): All hands, immediate response
   - P1 (High): Core team, same day response
   - P2 (Medium): Normal process, next sprint

5. Post-incident:
   - Karen leads technical post-mortem
   - Jenny handles business impact assessment
   - Team implements prevention measures
```

### Quality Gate Failures

```
If Jordan finds critical issue before release:
1. Jordan immediately notifies Karen
2. Karen assesses if it blocks release
3. Karen informs Jenny of impact
4. Jenny + Karen decide: Fix vs. Delay vs. Workaround
5. If delay: Jenny handles stakeholder communication
6. If fix: Team prioritizes resolution
```

---

## Pre-Work Checklist (ALL Agents)

### **Before Starting ANY Task:**

1. ✅ Read `.claude/agents/TEAM_CHARTER.md` for product/customer context
2. ✅ Check `docs/AI_MEMORY.md` for navigation & platform patterns
3. ✅ Review relevant existing code/tests to understand current state
4. ✅ Consult domain expert if crossing specialty boundaries
5. ✅ Plan for verification at task completion

### **After Completing ANY Task:**

1. ✅ Self-review against quality standards (TEAM_CHARTER.md)
2. ✅ Run relevant test suite (`bun run test:*` commands)
3. ✅ Update documentation if introducing new patterns
4. ✅ **Use `/verify` command** for Karen's quality verification

### **Using Slash Commands for Faster Workflows**

**Standard Feature Completion:**

```
1. Domain expert implements feature
2. Type /verify → Karen checks everything
```

**Security-Sensitive Changes:**

```
1. Domain expert implements feature
2. Type /security-audit → Security review
3. Type /verify → Karen's final approval
```

**Before Committing:**

```
1. Type /test-full → Run all tests with coverage
2. Fix any failures
3. Type /verify → Karen confirms ready to commit
```

**Before Deploying:**

```
1. Type /test-full → Verify all tests pass
2. Type /deploy-ready → Full deployment checklist
3. Type /verify → Karen's go/no-go decision
```

### **When to Use Commands vs Call Agents Directly**

| Use Slash Command                       | Call Agent Directly                     |
| --------------------------------------- | --------------------------------------- |
| Standard verification after normal work | Complex multi-agent coordination needed |
| Quick security check before merge       | Deep security architecture discussion   |
| Running tests before commit             | Custom testing strategy planning        |
| Standard deployment process             | High-risk or first-time deployments     |

**The `/verify` command IS the Karen workflow** - it replaces the older pattern of typing "Karen, please verify..."

---

## The Bottom Line

**Jenny orchestrates the team and ensures business success**
**Karen guards quality and manages risk**
**The expert team delivers world-class technical implementation**

This creates a perfect balance of:

- 🎯 **Business Focus** (Jenny)
- 🔍 **Quality Assurance** (Karen)
- 🛠️ **Technical Excellence** (Expert Team)

**Result**: Bulletproof SMS platform delivered on time with enterprise-grade quality! 🚀

---

## 📚 Essential Reading for All Agents

- **TEAM_CHARTER.md** - Product context, customer understanding, quality standards
- **AGENT_COLLABORATION_MATRIX.md** - When and how to collaborate with other agents
- **docs/AI_MEMORY.md** - Quick navigation guide to all documentation
- **`.claude/commands/`** - Slash command definitions (`verify.md`, `security-audit.md`, etc.)

---

## 🚀 Slash Command Quick Reference

| Command           | Invokes                    | Use Case                                  |
| ----------------- | -------------------------- | ----------------------------------------- |
| `/verify`         | Karen                      | Final quality verification after ANY task |
| `/security-audit` | security-compliance-expert | Before merging security-sensitive changes |
| `/test-full`      | Test suite                 | Before committing (runs all tests)        |
| `/deploy-ready`   | Multiple agents            | Before production deployment              |

**Remember**: Slash commands are the FASTEST way to complete workflows. Use them!
