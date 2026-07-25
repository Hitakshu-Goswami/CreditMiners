# Implementation status

## Implemented

- Public synthetic demo API and React dashboard with deterministic alternative-signal scoring, explanations, investment-risk profiling, allocations, and projections.
- Authentication foundation: JWT, refresh rotation, email verification, password lifecycle, lockout, sessions, and audit calls.
- Role/RBAC foundation: `ADMIN`/`USER`, user role loading, and `authorize(...roles)`.
- **Phase 2 — User Financial Identity:** personal profile, HTTPS profile-image reference, email/phone change verification flows, financial identity, goals, preferences, onboarding progress, and derived trust badges.
- **Phase 2 admin:** user search/filter/pagination, full profile view, ban/suspend/activate/soft-delete, role change, and analytics.
- Swagger UI at `/api/docs`, OpenAPI JSON at `/api/openapi.json`, and native unit tests for trust/completion calculations.

## In progress

- Audit logging is used by auth and Phase 2 operations but its table/event contract needs reconciliation.
- Phone verification and image reference APIs are provider-agnostic; no SMS or object-storage provider is configured.

## Planned

Financial data engine, persisted feature engineering, explainable scoring history, dashboard insights, and admin model/dataset operations.

## Future Production

Consent-driven financial-source ingestion, ML/XAI service, model evaluation/MLOps, jobs, observability, CI/CD, KYC, lending, and payments.

## Technical debt

1. Audit-log migration/model inconsistency and unused enum.
2. Alternate `rbac.middleware.js` does not match the current authenticated role shape.
3. No SMS delivery or image-binary object-storage provider is configured.
