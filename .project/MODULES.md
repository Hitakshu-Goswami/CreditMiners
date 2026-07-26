# Module status

| Module | Status | Verified scope |
|---|---|---|
| Authentication | Implemented | JWT/password/email/session lifecycle; refresh-token device metadata included in Phase 2 migration. |
| Roles / RBAC | Implemented foundation | Roles/seed, authenticated role loading, JWT role claim, `authorize` helper. Permission CRUD/hierarchy not implemented. |
| User Financial Identity | Implemented | Personal profile, financial profile, goals, preferences, onboarding, trust profile, email/phone changes. |
| Admin user management | Implemented | Search/filter/paginate/view users; status, role, soft-delete, analytics operations. |
| Demo alternative signals / scoring | Implemented | Synthetic CSV data deterministic score/recommendation flow. |
| Dashboard / insights | In Progress | Demo dashboard exists; persistent user insights are planned. |
| Financial Data Engine | Implemented foundation | Transactions, utility bills, mobile recharges, e-commerce orders, merchants, categories, tags, imports, consent, provenance models/APIs exist. |
| Feature Engineering Engine | Implemented | Versioned financial feature store, compute/list/runs APIs, granular behavior features, synthetic population-benchmark percentiles, validation issues, quality scoring, explainability metadata, documentation endpoint, calculation tests, and prototype async jobs. |
| Explainable Credit Intelligence Engine | Implemented baseline | Feature readiness validation, feature selection, calibrated credit score, risk dimensions, confidence, additive explanations, narrative, improvement roadmap, history, model registry baseline, and authenticated APIs. |
| AI infrastructure / MLOps | In Progress | Phase 5 baseline model registry exists; trained models, offline metrics, SHAP/LIME, monitoring, and admin model operations are not implemented. |
| KYC, lending, payments, chat, search | Future Production | Explicitly outside current implemented phases. |

## Technical debt

- Audit-log model/migration history inconsistent.
- Alternate `rbac.middleware.js` unused incompatible current user role shape.
- No SMS or object-storage provider is configured for phone verification/image binaries.
- Feature async jobs are in-process prototype jobs; durable workers and retry persistence are Future Production.
- Synthetic benchmark thresholds are prototype-only and must be replaced with consented population benchmarks before production credit or investment use.
- Phase 5 uses deterministic additive attributions; trained ML model comparison and SHAP/LIME integration remain future AI work.
