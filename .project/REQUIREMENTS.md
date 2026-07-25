# Requirements baseline

## Implemented

- Synthetic alternative-credit demo using recharge, utility, e-commerce, and financial sample inputs.
- Explainable score/risk/confidence/recommendation output and educational disclaimer.
- Six-question risk profile, allocation categories, and 1/3/5-year projections.
- Authentication and foundational role authorization.
- Prisma model foundation for financial and AI-outcome domains.

## In progress

- User Financial Identity and financial profile requirements are represented in roadmap/schema but lack mounted APIs, consent records, and ownership workflows.
- Audit recording exists for auth actions but requires contract reconciliation.

## Planned

Financial data engine, reusable/persisted features, scoring history, user insights/dashboard, and admin platform. Their scope is defined in [ROADMAP.md](ROADMAP.md).

## Future Production

Consent-driven traditional/non-traditional data acquisition; model-backed scoring/XAI; evaluation/MLOps; KYC; payments/lending; background jobs; observability; CI/CD; testing; deployment; compliance controls.

## Non-functional requirements

- Explainability, inclusion, privacy, security, modularity, and maintainability are mandatory product principles.
- Real-data or high-impact decisions require consent/provenance, auditability, authorization, data minimization, evaluation, governance, and applicable legal/compliance review.
- The current demo has no verified production SLA, live integration, test suite, or deployment capability.
