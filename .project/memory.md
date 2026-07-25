# Project memory

## Current baseline

- Product: synthetic-data hackathon prototype plus Phase 2 User Financial Identity implementation.
- Roadmap authorities: `docs/creditminers roadmap.md` and `docs/AI creditminers.md`.
- Current delivery state: [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).

## Verified technical debt

1. Audit-log migration/model contract is inconsistent; `AuditAction` is unused.
2. Alternate RBAC middleware does not match the authenticated role shape.
3. No SMS phone-verification or image object-storage provider is configured.

## 2026-07-26 — Phase 2 User Financial Identity

Implemented profile, financial identity, goals, preferences, onboarding, derived trust profile, email/phone change flows, admin user management, OpenAPI/Swagger documentation, and native unit tests. Added the corresponding Prisma migration. KYC, scoring, loans, and other future modules were intentionally not implemented.

## Maintenance rule

Append a dated entry after material work with scope, verification, and documentation updates. Do not mark future roadmap work complete without source evidence.
