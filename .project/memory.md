# Project memory

## Current baseline

- Current product: synthetic-data hackathon prototype with explainable scorecard and educational investment advisor, plus authentication/RBAC foundation.
- Backend roadmap authority: `docs/creditminers roadmap.md`.
- AI roadmap authority: `docs/AI creditminers.md`.
- Current delivery state: [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).

## Verified technical debt

1. Auth service expects `RefreshToken.deviceInfo`; current schema/migrations omit it.
2. Audit-log migration/model contract is inconsistent; `AuditAction` is unused.
3. Alternate RBAC middleware does not match current authenticated role shape.

## Documentation maintenance

- Append a dated entry after material changes: what changed, why, verification, and documents updated.
- Do not record planned work as complete. Move debt to resolved only after source/migrations verify it.

## 2026-07-25 — roadmap synchronization

Internal documentation and `AGENTS.md` were synchronized to the latest backend/AI roadmap direction without modifying `/docs` roadmap sources or application code. Added `IMPLEMENTATION_STATUS.md`. The requested `docs/CREDITMINERS_PROJECT_CONTEXT_COMPLETED_TILL_NOW.md` was absent from the working tree at review time.
