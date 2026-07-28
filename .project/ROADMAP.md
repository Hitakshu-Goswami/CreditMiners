# Delivery roadmap

This is the internal delivery view of the official backend roadmap in `docs/creditminers roadmap.md`. It summarizes direction; it does not replace that source or mark roadmap work as implemented.

## Foundation status

| Area | Status | Verified evidence |
|---|---|---|
| Phase 1 — Authentication | Implemented foundation | Auth routes, validation, service, JWT utilities, email/reset flows, account locking, sessions, and audit calls exist. |
| RBAC foundation | Implemented foundation | Roles are seeded, loaded with users, embedded in JWT payloads, and checked by `authorize(...roles)`. Permission CRUD/hierarchy is not verified. |
| Demo scoring/advisor | Implemented | Synthetic CSV scorecard and investment-risk/projection endpoints power the current frontend. |

## Hackathon delivery phases

### Phase 2 — User Financial Identity

- **Goal:** capture the financial identity and consented alternative signals that later engines require.
- **Modules:** user profile, financial profile, financial goals, consent, preferences, occupation/education/location, income and employment details, digital-signal records.
- **Responsibilities:** validate subject-owned data, preserve consent and source provenance, expose safe user-facing APIs.
- **Dependencies:** authentication and role/ownership authorization.
- **Deliverables:** persisted financial identity plus consent-aware records for recharge, utilities, e-commerce, UPI/wallet, savings, and income consistency.
- **Status:** In progress at schema/design level; only demo CSV equivalents and broader Prisma models are present.

### Phase 3 — Financial Data Engine

- **Goal:** create canonical financial records that drive feature engineering.
- **Modules:** transactions, bills, recharge history, e-commerce records, categories/tags.
- **Responsibilities:** ingestion validation, normalization, temporal integrity, source provenance, and user ownership.
- **Dependencies:** Phase 2 identity/consent and storage conventions.
- **Deliverables:** queryable financial event APIs and durable records.
- **Status:** Planned; transaction/category models exist, but no corresponding API/service flow is mounted.

### Phase 4 — Feature Engineering Engine

- **Goal:** produce reusable, versioned financial behavior features.
- **Modules:** feature calculation, feature snapshots/store, quality checks, feature documentation.
- **Responsibilities:** derive ratios and stability/discipline measures without relying on raw events at inference time.
- **Dependencies:** validated canonical financial data from Phase 3.
- **Deliverables:** features such as savings/expense ratios, bill regularity, recharge consistency, digital-payment score, cash flow, and spend variance.
- **Status:** Partially implemented only in the synthetic demo scorecard; no persisted feature engine exists.

### Phase 5 — Explainable Credit Scoring

- **Goal:** generate transparent credit-likelihood assessments and improvement pathways.
- **Modules:** assessment generation/history, explanation factors, confidence/risk bands, recommendations.
- **Responsibilities:** version input/features and decisions; present top contributors and actionable guidance.
- **Dependencies:** Phases 3–4 and AI lifecycle controls in [AI_CONTEXT.md](AI_CONTEXT.md).
- **Deliverables:** score, risk, confidence, explanations, recommendations, history API.
- **Status:** Demo implementation is deterministic and synthetic; persisted/model-backed scoring is planned.

### Phase 6 — Conversational Risk Profiling

- **Goal:** collect investment suitability inputs through 5–8 guided questions.
- **Modules:** questionnaire/session flow, goal/horizon extraction, risk classification.
- **Responsibilities:** produce an explainable risk profile with clear non-advice framing.
- **Dependencies:** authenticated user identity for persistence; Phase 2 profile data where available.
- **Deliverables:** conversational profiling API and user-facing flow.
- **Status:** Implemented as a stateless six-question demo; persisted/session-aware profiling is planned.

### Phase 7 — AI Micro-Investment Advisor

- **Goal:** recommend educational, risk-aligned micro-investment allocations.
- **Modules:** allocation and explanation engine, instrument categories, disclaimer policy.
- **Responsibilities:** consider risk profile, capacity, goals, and safety buffer; explain volatility and uncertainty.
- **Dependencies:** Phase 6 and validated financial identity.
- **Deliverables:** allocation, monthly amount, SIP/category guidance, rationale, risks, disclaimer.
- **Status:** Implemented as deterministic demo guidance; personalized production advisor is planned.

### Phase 8 — Growth Projection Engine

- **Goal:** produce chart-ready 1/3/5-year scenarios.
- **Modules:** projection/simulation engine and assumption explanation.
- **Responsibilities:** calculate conservative, moderate/base, and aggressive outcomes without promising returns.
- **Dependencies:** Phase 7 inputs and documented assumptions.
- **Deliverables:** projection values and UI/API visualization data.
- **Status:** Implemented as deterministic demo projections; production-grade assumptions/governance are planned.

### Phase 9 — Insights & Dashboard

- **Goal:** turn scores, features, trends, and recommendations into actionable dashboards.
- **Modules:** financial health, credit, insights, timelines, habits, reports.
- **Dependencies:** durable data and assessments from earlier phases.
- **Deliverables:** explainability input contract, financial health dashboard, credit explainability dashboard, insight cards, trend analytics, improvement timeline, monthly report storage/generation, safety disclaimer, and source trace metadata.
- **Status:** Implemented baseline APIs over persisted feature runs, credit assessments, recommendations, goals, and monthly report records. Future Production still requires trained-model SHAP/LIME payloads, durable report jobs, calibrated cohort benchmarks, and compliance review.

### Phase 10 — Admin Platform

- **Goal:** operate users, datasets, model health, risk distributions, audits, and system analytics.
- **Dependencies:** audited domain records and mature authorization.
- **Deliverables:** role-protected admin dashboard API, user analytics views, synthetic dataset analytics, AI model monitoring, feature statistics, risk distribution analytics, API monitoring, append-only admin audit log viewer, and system analytics.
- **Status:** Implemented baseline APIs using the existing authentication/authorization model. Future Production still requires durable APM storage, formal permission hierarchy, admin UI, CSV exports, model activation workflows, real evaluation/fairness metrics, and audited override policy.

### Phase 11 — AI Infrastructure

- **Goal:** operationalize datasets, features, models, explanations, recommendations, and projections.
- **Dependencies:** validated data contracts and [AI_CONTEXT.md](AI_CONTEXT.md) lifecycle controls.
- **Deliverables:** dataset/model versioning, inference integration, prediction history, explanation service.
- **Status:** Planned; schema reserves model/assessment records but no ML service exists.

### Phase 12 — Production Readiness

- **Goal:** harden the platform for reliable and secure operation.
- **Modules:** caching, jobs, notifications, monitoring, testing, CI/CD, containerization, deployment.
- **Dependencies:** stable APIs, data contracts, security decisions, and operational ownership.
- **Deliverables:** test coverage, observability, recovery practices, secure deployment path.
- **Status:** Planned.

## Future production guardrails

Production data integrations, credit outcomes, and investment guidance require consent, privacy/security controls, provenance, explainability, governance, and legal/compliance decisions. They are not current product behavior.
