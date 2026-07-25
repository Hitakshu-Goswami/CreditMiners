# Implementation status

## Summary

CreditMiners currently delivers a synthetic-data hackathon prototype plus an authentication and role foundation. The official roadmaps define the next implementation sequence; they are not present as completed product modules.

## Implemented

- Public demo API and React dashboard.
- Synthetic alternative-signal datasets and deterministic feature/score/recommendation flow.
- Stateless conversational risk profile, educational allocation, and growth projections.
- Authentication lifecycle and foundational role-based authorization.
- Prisma schema/migrations for future financial and AI domains.

## In progress

- User Financial Identity / Financial Profile direction: schema support exists; endpoints, validators, ownership flows, and consent layer are absent.
- Feature/assessment persistence design: schema support exists; demo does not persist features or scoring output.
- Audit logging: used by auth but needs contract reconciliation.

## Planned

- Financial data engine, persistent feature engineering, explainable scoring history, dashboard insights, and admin platform.

## Future Production

- Consent-driven bank/Account Aggregator/salary/investment/bureau and alternative-signal ingestion.
- ML/XAI service, model evaluation, MLOps, jobs, observability, CI/CD, secure deployment, KYC, lending, and payments.

## Technical debt

1. Auth service/schema mismatch for refresh-token `deviceInfo`.
2. Audit-log migration/model inconsistency and unused enum.
3. Alternate RBAC middleware is not safe for use as written.

See [ROADMAP.md](ROADMAP.md), [AI_CONTEXT.md](AI_CONTEXT.md), [DATABASE.md](DATABASE.md), and [SECURITY.md](SECURITY.md).
