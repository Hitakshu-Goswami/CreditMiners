# Delivery tasks

Official phase sequence is [ROADMAP.md](ROADMAP.md); this file is a compact execution view.

## Technical debt first

- Reconcile `RefreshToken.deviceInfo` across auth service, Prisma schema, migration, client.
- Reconcile audit-log table/model/event contract.
- Validate and standardize RBAC middleware usage before expanding protected modules.
- Establish test, configuration, CORS, logging/redaction, verification baselines.
- Replace in-process feature-computation jobs with durable workers before production use.
- Replace synthetic feature percentile benchmarks with consented population/cohort benchmarks before production credit or investment use.

## Next hackathon-direction work

1. Phase 5: explainable score generation/history backed by implemented feature contracts.
2. Phase 6-8: persisted conversational profiling, advisor, projections.
3. Phase 9-11: dashboard/insights, admin, AI infrastructure.
4. Phase 12: production readiness.

## Recently completed

- Implemented expanded financial feature calculations for income seasonality, salary delay, night spending ratio, recharge growth, merchant switching frequency, spending drift, savings streak, and utility seasonality.
- Implemented synthetic population-benchmark percentile scoring for configured financial features.
- Implemented authenticated feature documentation and prototype async feature-computation job APIs.
- Added automated financial feature calculation tests.

Do not start later phase bypassing consent, ownership, validation, provenance, explanation requirements earlier phases.
