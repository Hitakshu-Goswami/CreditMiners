# Backend guidelines

## Required shape

```text
route → validator → authentication/authorization → controller → service → Prisma or explicit adapter
```

- Routes define paths/methods/middleware only.
- Validators use `express-validator` at the HTTP edge.
- Controllers validate collected errors, call one domain operation, and return shared response envelopes.
- Services own domain rules, ownership checks, transactions, persistence orchestration, and explicit adapter calls.
- Utilities/configuration contain reusable mechanics, not domain policy.

## Current patterns

Use `asyncHandler`, `AppError` subclasses, `utils/response`, shared Prisma config, JWT authentication, and `authorize(...roles)` where applicable. `rbac.middleware.js` is not a reusable pattern until reconciled with current auth shape.

## Financial-data roadmap rule

Implement Phases 2–5 in [ROADMAP.md](ROADMAP.md) as data contracts, not generic CRUD: subject ownership, consent, source provenance, normalization, temporal integrity, data-quality checks, and explicit feature/assessment versioning are required from the first migration.

## AI boundary rule

Backend domain services must remain independent of model providers. Exchange validated, versioned payloads with future AI APIs/services; persist model/feature/explanation references where applicable. Do not call expensive/retryable inference or document extraction synchronously once job infrastructure exists.

## Database/security rule

Use `Decimal` for money, UUIDs/relations consistently, indexes for actual query patterns, and `$transaction` for atomic multi-write changes. Apply authentication, role checks, and object ownership before data access. Never log credentials, tokens, raw financial data, or sensitive AI features.

## Technical debt guardrail

Do not extend auth session behavior until `RefreshToken.deviceInfo` is reconciled between service, schema, migrations, and generated client. Do not expand audit reliance until the audit event contract is reconciled.
