# Implementation status

## Implemented

- Public synthetic demo API and React dashboard with deterministic alternative-signal scoring, explanations, investment-risk profiling, allocations, and projections.
- Authentication foundation: JWT, refresh rotation, email verification, password lifecycle, lockout, sessions, and audit calls.
- Role/RBAC foundation: `ADMIN`/`USER`, user role loading, JWT role claim, and `authorize(...roles)`.
- **Phase 2 — User Financial Identity:** personal profile, HTTPS profile-image reference, email/phone change verification flows, financial identity, goals, preferences, onboarding progress, and derived trust badges.
- **Phase 2 admin:** user search/filter/pagination, full profile view, ban/suspend/activate/soft-delete, role change, and analytics.
- **Phase 4 — Financial Feature Engineering Engine:** versioned feature store, authenticated compute/list/run APIs, granular optional behavior features, synthetic population-benchmark percentiles, validation issues, quality scoring, explainability metadata, feature documentation API, prototype async compute jobs, and dashboard-ready composite indicators.
- **Phase 5 — Explainable Credit Intelligence Engine:** authenticated explainable credit-score APIs, feature readiness validation, feature selection, calibrated baseline scoring, multidimensional risk, confidence estimation, additive explanation layer, plain-language narrative, personalized improvement roadmap, score history, and model registry baseline.
- Swagger UI at `/api/docs`, OpenAPI JSON at `/api/openapi.json`, and native unit tests for trust/completion calculations.
- Native unit tests for financial feature calculations, feature documentation, and explainable credit intelligence calculations.

## In progress

- Audit logging is used by auth and Phase 2 operations but its table/event contract needs reconciliation.
- Phone verification and image reference APIs are provider-agnostic; no SMS or object-storage provider is configured.
- Feature-computation background jobs are in-process prototype jobs, not durable queue workers.
- Phase 5 uses a deterministic calibrated baseline with additive attributions; trained Random Forest/XGBoost/LightGBM/CatBoost and SHAP/LIME are not yet implemented.

## Planned

Dashboard insights and admin model/dataset operations.

## Future Production

Consent-driven financial-source ingestion, ML/XAI service, model evaluation/MLOps, durable background workers, observability, CI/CD, KYC, lending, and payments.

## Technical debt

1. Audit-log migration/model inconsistency and unused enum.
2. Alternate `rbac.middleware.js` does not match the current authenticated role shape.
3. No SMS delivery or image-binary object-storage provider is configured.
4. Synthetic percentile benchmarks must be replaced with consented population/cohort benchmarks before production decisions.
5. Phase 5 model metrics, labelled training datasets, and production SHAP/LIME explainability are pending.
