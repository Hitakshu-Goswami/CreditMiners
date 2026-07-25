# CreditMiners — Repository Instructions

## Direction

- Align every change with the official hackathon problem statement and the long-term CreditMiners vision: explainable, inclusive financial intelligence and educational micro-investment guidance.
- Treat `docs/creditminers roadmap.md` and `docs/AI creditminers.md` as the backend and AI roadmap source of truth. Do not edit or reinterpret them without explicit approval.
- Build production-grade modular code while keeping the synthetic-data hackathon prototype clearly distinct from Future Production behavior.

## Verify before changing

- Inspect current source, schema, migrations, routes, and working-tree state before assuming a feature exists or is complete.
- Use the status vocabulary consistently: **Implemented**, **In Progress**, **Planned**, **Future Production**, and **Technical Debt**.
- Never describe roadmap items, Prisma models, directories, or documentation as implemented functionality without source evidence.

## Architecture and backend

- Preserve the backend flow: `route → validator → authentication/authorization middleware → controller → service → Prisma or explicit external adapter`.
- Reuse existing response, error, validation, authentication, audit, and Prisma patterns; keep routes declarative and controllers HTTP-focused.
- Enforce authentication, role authorization, and record ownership for protected data. Do not use an alternate or new RBAC pattern without validating it against current auth shape.
- Keep AI and backend domain logic loosely coupled through explicit, versioned API/data contracts. Do not embed model/provider details in controllers.
- Do not introduce breaking architectural changes, destructive migrations, or new external integrations without approval and a migration/security plan.

## Data, AI, and safety

- Prioritize explainability, financial inclusion, privacy, security, maintainability, and scalability.
- Use only synthetic or explicitly consented data. Design consent scope, provenance, access control, retention, feature versioning, model versioning, output confidence, and explanations before real-data or AI work.
- Never present prototype output as a regulated credit decision, lending approval/denial, or investment advice.
- Keep expensive, retryable, document-processing, or external-model work out of synchronous request paths when production job infrastructure is introduced.

## Database, quality, and documentation

- Treat Prisma schema and migrations as a single reviewed contract. Use UUID relations, `Decimal` for money, indexes from access patterns, and transactions for atomic writes.
- Never commit secrets, tokens, credentials, real financial/identity data, or sensitive logs.
- Make focused changes, preserve unrelated work, and report only checks actually run.
- Keep `.project` synchronized with implementation. Record verified gaps as Technical Debt and mark them resolved only after source/migrations demonstrate the fix.
