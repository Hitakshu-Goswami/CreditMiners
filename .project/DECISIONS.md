# Architecture decisions

## Active decisions

### Synthetic, explainable hackathon prototype

Use synthetic/consent-style datasets and deterministic scorecard/advisor logic for the current demonstration. This makes the workflow reproducible and explainable without claiming trained-model or regulated-decision behavior.

### PostgreSQL with Prisma

Use Prisma/PostgreSQL for identity, financial, AI-outcome, and system records. Schema and migrations are a single contract; see [DATABASE.md](DATABASE.md).

### Modular monolith and explicit AI boundary

Keep backend modules within the existing layered Express architecture. Future AI work is a separate API/data-contract concern, not controller logic. See [ARCHITECTURE.md](ARCHITECTURE.md).

### Roadmap-led product delivery

Use the official backend and AI roadmaps to sequence work: financial identity/data → features → explainable score → risk/advisor/projections → insight/admin → AI infrastructure/production readiness.

## Resolved decisions

- Demo scoring deliberately remains database-independent and reads synthetic CSVs.
- Auth routes are lazy-mounted, preserving separation between demo and auth import paths.
- Authentication and role foundations are present in current source; future authorization work must build on them rather than bypass them.

## Technical debt requiring a decision

- Reconcile refresh-token device/session metadata with the Prisma schema and migrations.
- Establish one controlled audit-event/table contract, including retention and access needs.
- Decide production consent, feature-store, AI API, model-governance, and MLOps architecture before real data/model deployment.

## Not decided in verified source

Model/provider selection, queue/cache stack, external financial/KYC/payment providers, API versioning/OpenAPI approach, deployment topology, RLS strategy, and production compliance posture remain planned/unknown.
