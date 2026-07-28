# Module status

| Module | Status | Verified scope |
|---|---|---|
| Authentication | Implemented | JWT/password/email/session lifecycle; refresh-token device metadata included in Phase 2 migration. |
| Roles / RBAC | Implemented foundation | Roles/seed, authenticated role loading, JWT role claim, `authorize` helper. Permission CRUD/hierarchy not implemented. |
| User Financial Identity | Implemented | Personal profile, financial profile, goals, preferences, onboarding, trust profile, email/phone changes. |
| Admin user management | Implemented | Search/filter/paginate/view users; status, role, soft-delete, analytics operations. |
| Admin observability dashboard | Implemented baseline | Role-guarded Phase 10 APIs expose admin dashboard aggregates, synthetic dataset analytics, AI model monitoring, feature statistics, risk distribution, in-memory API metrics, append-only admin audit logs, and system analytics. |
| Demo alternative signals / scoring | Implemented | Synthetic CSV data deterministic score/recommendation flow. |
| Dashboard / insights | Implemented baseline | Phase 9 authenticated APIs generate explainability input contracts, financial health and credit dashboards, insight cards, habit trends, improvement timelines, monthly reports, source traces, confidence, data completeness, and educational disclaimers over persisted features/assessments. |
| Financial Data Engine | Implemented foundation | Transactions, utility bills, mobile recharges, e-commerce orders, merchants, categories, tags, imports, consent, provenance models/APIs exist. |
| Feature Engineering Engine | Implemented | Versioned financial feature store, compute/list/runs APIs, granular behavior features, synthetic population-benchmark percentiles, validation issues, quality scoring, explainability metadata, documentation endpoint, calculation tests, and prototype async jobs. |
| Explainable Credit Intelligence Engine | Implemented baseline | Feature readiness validation, feature selection, calibrated credit score, risk dimensions, confidence, additive explanations, narrative, improvement roadmap, history, model registry baseline, and authenticated APIs. |
| AI infrastructure / MLOps | In Progress | Phase 5 baseline model registry and Phase 10 monitoring views exist; trained models, offline metrics, SHAP/LIME, drift monitoring, and admin model activation workflows are not implemented. |
| KYC, lending, payments, chat, search | Future Production | Explicitly outside current implemented phases. |

## Technical debt

- Audit-log model/migration history inconsistent.
- Alternate `rbac.middleware.js` unused incompatible current user role shape.
- No SMS or object-storage provider is configured for phone verification/image binaries.
- Feature async jobs are in-process prototype jobs; durable workers and retry persistence are Future Production.
- Synthetic benchmark thresholds are prototype-only and must be replaced with consented population benchmarks before production credit or investment use.
- Phase 5 uses deterministic additive attributions; trained ML model comparison and SHAP/LIME integration remain future AI work.
- Phase 9 monthly report generation is synchronous baseline logic; Future Production should use durable jobs, report delivery preferences, and reviewed explanation-quality metrics.
- Phase 10 API metrics are in-memory process metrics; Future Production should persist request telemetry through OpenTelemetry/APM and define formal permission hierarchy and override policies.
