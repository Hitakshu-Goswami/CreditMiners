# Delivery tasks

Official phase sequence is [ROADMAP.md](ROADMAP.md); this file is a compact execution view.

## Technical debt first

- Reconcile `RefreshToken.deviceInfo` across auth service, Prisma schema, migration, client.
- Reconcile audit-log table/model/event contract.
- Validate and standardize RBAC middleware usage before expanding protected modules.
- Establish test, configuration, CORS, logging/redaction, verification baselines.
- Replace in-process feature-computation jobs with durable workers before production use.
- Replace synthetic feature percentile benchmarks with consented population/cohort benchmarks before production credit or investment use.
- Replace Phase 5 deterministic baseline with trained model comparison, calibrated production model, and SHAP/LIME explainability when labelled data exists.

## Next hackathon-direction work

1. Phase 6-8: persisted conversational profiling, advisor, projections.
2. Phase 9-11: dashboard/insights, admin, AI infrastructure.
3. Phase 12: production readiness.

## Recently completed

- Implemented expanded financial feature calculations for income seasonality, salary delay, night spending ratio, recharge growth, merchant switching frequency, spending drift, savings streak, and utility seasonality.
- Implemented synthetic population-benchmark percentile scoring for configured financial features.
- Implemented authenticated feature documentation and prototype async feature-computation job APIs.
- Added automated financial feature calculation tests.
- Implemented Phase 5 explainable credit intelligence APIs, history, readiness validation, feature selection, calibrated baseline scoring, risk/confidence engines, additive explanations, narrative generation, and improvement roadmap output.
- Added automated explainable credit intelligence calculation tests.

Do not start later phase bypassing consent, ownership, validation, provenance, explanation requirements earlier phases.
