# Product Requirements Document: FixItMixit

## 1. Overview

**FixItMixit** is a structured web application that guides two individuals through a rigorous, AI-assisted conflict resolution process. By enforcing mutual understanding, transparent communication, and focused argumentation, the app creates a neutral space where conflicts are resolved through evidence and empathy rather than emotion.

The core value proposition: conflicts that would otherwise spiral or end relationships are resolved constructively, with both parties understanding each other's perspectives and reaching agreement on actionable solutions.

> **Note on AI feedback**: AI pattern detection runs asynchronously (up to 5s latency) during text submissions. References to "real-time" feedback throughout this document mean near-real-time async analysis that surfaces flags before the other user responds—not synchronous, inline-as-you-type checking.

---

## 2. Problem Statement

### The Challenge
Interpersonal conflicts typically escalate due to:
- **Lack of mutual understanding**: Each party assumes the worst of the other's intentions
- **Unstructured communication**: Conversations loop, repeat, and never reach resolution
- **Emotional escalation**: Without guardrails, discussions become heated and unproductive
- **No neutral arbiter**: Disputes lack a fair, unbiased framework for resolution
- **Lost progress**: Conflict records disappear; lessons aren't captured

### Current Solutions & Gaps
- **Couples/family therapy**: Expensive ($100-300/hour), requires scheduling, therapist dependency
- **Mediation services**: Similar cost barriers; designed for legal/business disputes, not personal conflicts
- **DIY communication**: Self-help books and frameworks lack enforcement and real-time guidance
- **Online conflict forums**: Anonymous, unmoderated, low-quality resolutions

**FixItMixit fills this gap** by providing an affordable, structured, always-available framework that enforces best-practice communication patterns while providing near-real-time, async AI feedback on submissions.

---

## 3. Target Users

### Primary User Persona: "The Stuck Couple"
- **Demographics**: Ages 25-55, in relationships (romantic, family, business partnerships)
- **Motivation**: Have a specific conflict they're stuck on and want resolution without external mediators
- **Tech comfort**: Moderate to high; comfortable with web apps and collaborative digital tools
- **Willingness to engage**: Both parties agree something needs to change

### Secondary Personas
- **Co-founders in dispute**: Business partners with operational disagreements
- **Roommates**: Shared-living conflicts (noise, chores, guests)
- **Family mediators**: Adult siblings resolving inheritance or care disputes
- **Workplace peers**: Team members addressing interpersonal friction (HR-approved)

### User Goals
- Resolve the specific issue decisively
- Understand the other person's perspective
- Reach agreement without resentment
- Have a documented record of the resolution

---

## 4. User Stories

### Core Resolution Flow
- **As a frustrated partner**, I want to follow a structured process **so that** our discussions actually make progress instead of going in circles
- **As an empathetic person**, I want to understand my partner's perspective deeply **so that** I can find solutions that work for both of us
- **As someone avoiding therapy**, I want an affordable, immediate conflict resolution tool **so that** I don't have to wait weeks for an appointment
- **As a procedural person**, I want documented agreements **so that** we both remember what we committed to

### AI & Feedback
- **As a communicator**, I want real-time feedback when I'm using inflammatory language **so that** I can adjust before escalating the conflict
- **As someone skeptical of AI**, I want to challenge flagged patterns **so that** I keep control of the narrative
- **As someone wanting growth**, I want to see what patterns I'm repeating **so that** I can break them in future conversations

### Resolution & Closure
- **As a satisfied user**, I want to export our agreement **so that** we have a record we can refer back to
- **As someone concerned about privacy**, I want encrypted storage and clear data handling **so that** I trust the platform with sensitive information
- **As a reflective person**, I want to record how my perspective shifted **so that** I can acknowledge growth

---

## 5. Features and Requirements

### 5.1 Core Phase System

#### Phase 1: Issue Agreement
**Goal**: Both users agree on a single, clearly-worded issue statement

**Requirements**:
- [ ] User A proposes an issue statement (max 250 chars)
- [ ] User B can accept, reject with counter-proposal, or suggest edits
- [ ] Iteration until both accept
- [ ] Proposed statement must be neutral (not accusatory)
- [ ] AI flag triggers if statement contains "always/never" language
- **Exit criteria**: Both users have approved the same statement

#### Phase 2: Steel-Manning
**Goal**: Each user demonstrates they understand the *best* version of the other's perspective

**Requirements**:
- [ ] User A articulates User B's core position in User B's best light
- [ ] User B reviews, can request edits or approve
- [ ] Same process in reverse
- [ ] Prevents strawmanning and bad-faith arguments
- [ ] AI detects dismissive language ("you just want X" vs. "you value X")
- **Exit criteria**: Both users confirm the other's articulation is fair

#### Phase 3: Statement Locking
**Goal**: Each user states their position, which becomes immutable ground truth for discussion

**Requirements**:
- [ ] User A writes their position statement (300-500 chars)
- [ ] User B writes their position statement
- [ ] Statements cannot be edited after locking
- [ ] Both users must acknowledge they understand the other's locked statement
- [ ] Provides clarity and prevents goalpost-moving
- **Exit criteria**: Both statements locked and acknowledged

#### Phase 4: Discussion (Contention/Rebuttal)
**Goal**: Structured point-by-point argumentation

**Requirements**:
- [ ] User A proposes a contention (specific claim or argument)
- [ ] User B must directly address it with a rebuttal
- [ ] Cannot introduce new issues; stays on locked positions
- [ ] A "cycle" is one complete contention round: it starts when either user submits a new contention and ends when the other user submits the direct rebuttal to that contention
- [ ] Each user may submit at most 3 contentions total during their opportunity to raise contention rounds in Phase 4; after each contention receives its direct rebuttal, the next contention starts a new cycle
- [ ] AI pattern detection flags:
  - Ad hominem attacks ("You're selfish" vs. "I felt disrespected when...")
  - Logical fallacies (false dichotomy, appeal to authority)
  - Recurring complaints (signs of circular reasoning)
  - Inflammatory tone
- [ ] Manual review available for contested flags
- **Exit criteria**: Both users agree the topic is exhausted or reach common ground

#### Phase 5: Resolution Agreement
**Goal**: Reach mutually-agreed-upon resolution

**Requirements**:
- [ ] User A proposes a resolution statement
- [ ] User B can accept, reject, or counter-propose
- [ ] Focus on actionable steps, not blame
- [ ] Must reference the locked position statements
- [ ] AI reviews for vagueness ("we'll communicate better" requires specifics)
- **Exit criteria**: Both users accept the same resolution statement

#### Phase 6: Summary & Export
**Goal**: Create a consolidated record

**Requirements**:
- [ ] Auto-generated summary: issue → positions → resolutions
- [ ] Timeline of the discussion
- [ ] Downloadable as PDF or markdown
- [ ] Option to share with therapist/mediator
- [ ] Archive in user's account for later reference

#### Phase 7: Perspective Update (Optional)
**Goal**: Reflect on how each person's thinking shifted

**Requirements**:
- [ ] Optional, non-debated section
- [ ] Each user records personal insights (not critiques of the other)
- [ ] Captures growth, changed mind on specific points
- [ ] Cannot be used to re-litigate the issue

#### Phase 8: Session Closure & Feedback
**Goal**: Formally end session and gather product feedback

**Requirements**:
- [ ] Confirm both users agree the conflict is resolved
- [ ] Optional follow-up survey (NPS, feature requests, pain points)
- [ ] Session marked as complete
- [ ] Users can start new sessions for different issues

---

### 5.2 AI Pattern Detection

**Powered by Google Gemini API** | **Manual review available**

#### Flagged Patterns

| Pattern | Trigger | AI Response | Example |
|---------|---------|-------------|---------|
| **Inflammatory language** | "always," "never," "you're X" | Gentle warning to rephrase | "You always ignore me" → suggest "I felt ignored when..." |
| **Ad hominem** | Personal attacks on character | Flag and suggest focus on behavior | "You're selfish" → suggest "That decision affected me because..." |
| **Circular reasoning** | Same complaint repeated 3+ times in session | Suggest moving to resolution phase | Repeated complaints about lateness |
| **Vague resolution** | Resolution without specifics | Request action items with dates | "We'll be nicer" → suggest "Weekly 15-min check-ins, Sundays at 7pm" |
| **Denial of reality** | Contradicting previously locked statements | Alert to inconsistency | Position locked as "I didn't know she was upset"; later says "Obviously I knew" |
| **Strawmanning** | Misrepresenting the other person's position | Compare to steel-manned version; flag divergence | Their position: "I want more time together"; Your claim: "She wants to control me" |

#### Manual Review Process
- [ ] User can dispute any AI flag
- [ ] Flag goes to human reviewer queue
- [ ] Reviewer examines context, decides: overrule or confirm
- [ ] Decision sent to both users with explanation
- **Post-v1 cost model only**: First 3 disputes free; additional disputes may be charged at $2/flag. Payment processing and billing enforcement are out of scope for v1.

---

### 5.3 Authentication & Security
- [ ] Secure sign-up with email verification
- [ ] Supabase Auth (OAuth optional for future: Google, Apple)
- [ ] Session access requires both users' agreement to join
- [ ] Invite links are time-limited and one-use
- [ ] End-to-end encrypted messaging (future v2)

---

### 5.4 Session Management
- [ ] Users can create sessions based on plan limits: free tier capped at 2 new sessions/month; premium tier unlimited
- [ ] Pause/resume sessions (48-hour inactivity limit before auto-resume prompt)
- [ ] Archive completed sessions
- [ ] View session history and past resolutions
- [ ] Session timeline: see discussion flow

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **Page load**: < 2s (Core Web Vitals: LCP, INP, CLS)
- **Phase transitions**: < 500ms
- **Sync updates between users**: < 1s (real-time updates via WebSocket/polling)
- **Search/archive queries**: < 3s for 1000+ sessions

### 6.2 Scalability
- Support 10,000+ concurrent users
- Supabase scaling plan: upgrade PostgreSQL compute/storage tiers as load grows, add read replicas for read-heavy workloads, enable connection pooling for high concurrent traffic, and use CDN/caching for static assets
- AI batch processing for pattern detection (async, max 5s latency)

### 6.3 Security
- [ ] OWASP Top 10 protections (SQL injection, XSS, CSRF)
- [ ] Supabase Row-Level Security (RLS) for data isolation
- [ ] PII not logged; minimal retention (30 days for debugging)
- [ ] Compliance: GDPR, CCPA (data deletion, portability)
- [ ] Regular security audits (quarterly)

### 6.4 Accessibility (WCAG 2.1 Level AA)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader support (ARIA labels, semantic HTML)
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] High-contrast theme option
- [ ] Reduced motion support
- [ ] Closed captions (if video content added)

### 6.5 Usability
- [ ] Intuitive phase progression (no hidden steps)
- [ ] Clear error messages with recovery steps
- [ ] Mobile-friendly (responsive design, touch targets ≥ 44px)
- [ ] Offline support (draft caching; sync on reconnect)

---

## 7. Constraints

### Technical
- **Frontend**: React 18, TypeScript, Vite (build tool)
- **Backend**: Supabase (managed PostgreSQL + auth)
- **AI**: Google Gemini API (rate-limited, latency acceptable for async)
- **Hosting**: Vercel (frontend), Supabase Cloud (backend)
- **No payment processing initially** (future: Stripe integration)

### Business
- **MVP scope**: 8-phase system, AI pattern detection, basic export
- **User acquisition**: Organic (word-of-mouth, SEO) until v1 launch
- **Pricing**: v1 launches without payment processing and is free to use; post-v1 plan is a free tier (2 sessions/month) + premium ($9.99/mo unlimited) once billing is added
- **Language**: English only (v1); i18n structure ready for future localization

### Legal & Ethical
- **Not therapy**: Clear disclaimers; cannot replace professional mediation
- **Neutral tool**: Both users must consent to participate
- **Data privacy**: GDPR-compliant, encrypted at rest
- **No coercion detection**: App assumes good-faith participation (cannot enforce consent)

---

## 8. Success Metrics

### Core Metrics
1. **Resolution rate**: % of sessions reaching "Closure" phase ≥ 70%
2. **User satisfaction**: NPS ≥ 40 (from exit survey)
3. **Session completion time**: Median 4-7 days (not hours; thoughtful process)
4. **Time to resolution**: Users report 40% less back-and-forth than pre-FixItMixit

### Engagement Metrics
5. **Monthly active users (MAU)**: Growth target 10% MoM in first 12 months
6. **Retention**: 40% of users return for a second session within 6 months
7. **Feature usage**: ≥ 80% of users reach Discussion phase (core value)

### Quality Metrics
8. **AI flag accuracy**: ≥ 85% of flags confirmed valid (manual review data)
9. **System uptime**: 99.9%
10. **Accessibility compliance**: WCAG 2.1 AA, zero critical a11y bugs

### Financial (v1+)
11. **Free-to-premium conversion**: 8-12% of free users upgrade
12. **LTV:CAC ratio**: ≥ 3:1 (lifetime value vs. customer acquisition cost)

---

## 9. Timeline & Phases

### Phase 0: Foundation (Weeks 1-4)
- [ ] Supabase setup, auth flow, RLS policies
- [ ] React component library (buttons, inputs, modals)
- [ ] Accessibility provider and theme system
- [ ] Home page & session setup flow

**Deliverable**: Users can sign up, create a session, invite a partner

---

### Phase 1: Core Resolution (Weeks 5-12)
- [ ] Issue Agreement phase (UI + logic)
- [ ] Steel-Manning phase
- [ ] Statement Locking phase
- [ ] Real-time sync between users
- [ ] Error handling & edge cases

**Deliverable**: Users can progress through first 3 phases together

---

### Phase 2: AI & Discussion (Weeks 13-20)
- [ ] Gemini API integration
- [ ] Pattern detection service
- [ ] Discussion/Contention phase UI
- [ ] Flag notification system
- [ ] Manual review workflow

**Deliverable**: Full discussion with AI assistance; users see flags and can challenge

---

### Phase 3: Resolution & Closure (Weeks 21-26)
- [ ] Resolution Agreement phase
- [ ] Summary generation & export (PDF)
- [ ] Perspective Update phase
- [ ] Session Closure & feedback survey
- [ ] Session history & archive

**Deliverable**: Users complete full 8-phase cycle; can export and review

---

### Phase 4: Polish & Launch (Weeks 27-30)
- [ ] Comprehensive test suite (unit, integration, E2E)
- [ ] Performance optimization
- [ ] Security audit & pen testing
- [ ] Documentation (user guide, admin FAQs)
- [ ] Launch marketing (landing page, early-access list)

**Deliverable**: Production-ready v1 launch

---

## 10. Out of Scope (v1)

### Explicitly Not Included
- **Payment processing**: Free launch; Stripe integration in v1.1
- **Therapist integration**: Cannot replace licensed professionals; referral links only
- **Video/audio**: Text-based only; no voice or video calls
- **Multi-party conflicts**: Designed for 2 people only (groups in v2)
- **Legal documentation**: Resolutions are not binding contracts
- **Mobile app**: Web-first; native apps (iOS/Android) in v2
- **Integrations**: No Slack, Discord, or calendar integrations (v2+)
- **Concurrent sessions**: Users can't have overlapping conversations (sequential only)
- **Anonymous mode**: Both users must sign up with email (no anonymous access)

---

## 11. Key Design Decisions

### Why This Phase Order?
1. **Issue Agreement first** → Ensures both parties agree on what they're fighting about
2. **Steel-Manning second** → Prevents bad-faith arguments before they start
3. **Locking third** → Stabilizes positions so discussion can be productive
4. **Discussion fourth** → Only after guardrails are in place
5. **Resolution fifth** → Final agreement phase after understanding is built

### Why AI as Assistant, Not Arbiter?
- Humans must maintain agency over their words
- AI flags are suggestions, not verdicts
- Manual review prevents algorithmic bias
- Builds user trust (not "the app said you're wrong")

### Why Text-Only (v1)?
- Fewer technical barriers (video = bandwidth, latency, moderation challenges)
- Encourages thoughtful, measured communication (vs. reactive speech)
- Accessible to low-bandwidth users
- Easier to record and export

### Why Freemium Model?
- Viral acquisition (free tier drives word-of-mouth)
- Premium funds ongoing costs (Gemini API, support)
- Aligns incentives: only pay for value received
- Entry barrier for serious users (spam reduction)

---

## Appendix: Comparison to Alternatives

| Feature | FixItMixit | Therapy | Mediation | DIY Apps |
|---------|-----------|---------|-----------|----------|
| **Cost** | Free/9.99/mo | $100-300/hr | $200-500/session | Free |
| **Availability** | 24/7 | 1x/week | Weeks to schedule | Whenever |
| **Enforced structure** | Yes (8 phases) | Therapist-led (variable) | Mediator-led (formal) | None |
| **AI feedback** | Yes | No | No | Varies |
| **Export/record** | Yes (PDF) | Therapist notes (no access) | Court documents | No |
| **Relationship focus** | Specific conflict | Holistic | Legal/formal | DIY |
| **Scalability** | ∞ users | Limited therapists | Limited mediators | N/A |

---

## IMPROVEMENTS OVER ORIGINAL VISION

This PRD includes several strategic improvements:

1. **Explicit phase exit criteria** - Original docs lacked clarity on when to advance; now each phase has clear "done" conditions
2. **AI flag specificity** - Defined actual detectable patterns rather than abstract "pattern detection"
3. **Manual review economics** - Monetizes disputed flags; prevents abuse
4. **Session pause/resume** - Users can step away without losing progress
5. **Offline drafting** - Critical for trust (users want to compose privately)
6. **Timeline specificity** - Broke down 8-phase build into 5 concrete phases (Phase 0–4) with deliverables
7. **Success metrics tied to business** - NPS, LTV:CAC, retention tell the real story
8. **Freemium clarity** - Free tier (2 sessions) is specific; signals scarcity without hard paywalls
9. **Out of Scope section** - Prevents scope creep (mobile, legal docs, multi-party are explicitly v2+)
10. **Design rationale** - Explains *why* text-only, *why* 2-person, *why* AI assists not judges

---

**Status**: Ready for development | **Next Step**: Break down Phase 0 into detailed task tickets
