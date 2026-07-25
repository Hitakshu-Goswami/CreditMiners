# Delivery tasks

The official phase sequence is [ROADMAP.md](ROADMAP.md); this file is a compact execution view.

## Technical debt first

- Reconcile `RefreshToken.deviceInfo` across auth service, Prisma schema, migration, and client.
- Reconcile audit-log table/model/event contract.
- Validate and standardize RBAC middleware usage before expanding protected modules.
- Establish test, configuration, CORS, logging/redaction, and verification baselines.

## Next hackathon-direction work

1. Phase 2: user financial identity, financial profile, consent, and alternative digital-signal contracts.
2. Phase 3: canonical financial data engine for transactions, bills, recharges, and e-commerce.
3. Phase 4: persisted/versioned feature engineering.
4. Phase 5: explainable score generation/history backed by defined data contracts.
5. Phase 6–8: persisted conversational profiling, advisor, and projections.
6. Phase 9–11: dashboard/insights, admin, and AI infrastructure.
7. Phase 12: production readiness.

Do not start a later phase by bypassing the consent, ownership, validation, provenance, and explanation requirements of earlier phases.
