# CreditMiners context

## Vision

CreditMiners is an AI-first financial-intelligence platform designed for financial inclusion. The hackathon problem is addressed through transparent alternative-credit scoring, understandable improvement guidance, conversational risk profiling, educational micro-investment advice, and growth projections.

The long-term product must remain explainable, privacy-conscious, secure, modular, and scalable. It must not treat synthetic demo output as lending approval, a regulated credit score, or investment advice.

## Current implementation

### Implemented

- React/Vite demo dashboard for synthetic user profiles, explanation drill-down, risk profiling, allocation, and projections.
- Express `/api/demo` endpoints backed by synthetic CSV data and deterministic services.
- Authentication foundation: registration/login, refresh rotation, logout/sessions, email verification, password reset/change, lockout, validators, JWT helpers, and audit calls.
- Role foundation: `ADMIN`/`USER` seed roles, role loading, JWT role claims, and the `authorize(...roles)` helper.
- PostgreSQL/Prisma schema for authentication, financial, AI, and system domains.

### In progress

- The roadmap's financial-identity, data-engine, and feature-engine foundations are represented by schema/model design and demo signals, not mounted production modules.
- AI data/assessment models exist in Prisma but are not used by the demo pipeline.

### Planned / Future Production

Consent-led ingestion, feature store, model-backed scoring, SHAP/LIME, persisted profiling/advice, dashboards, admin platform, AI infrastructure, and production hardening. See [ROADMAP.md](ROADMAP.md) and [AI_CONTEXT.md](AI_CONTEXT.md).

## Source hierarchy

1. Current source, schema, migrations, and routes define implementation truth.
2. `docs/creditminers roadmap.md` and `docs/AI creditminers.md` define current backend/AI planning direction.
3. This `.project` knowledge base synchronizes engineering context; it must not override the source documents.

`docs/CREDITMINERS_PROJECT_CONTEXT_COMPLETED_TILL_NOW.md` was requested for review but is absent from the current working tree; its current content is unknown.

## Technical debt

- Auth service references `RefreshToken.deviceInfo`, absent from checked-in Prisma schema/migrations.
- Audit-log schema/migration evolution is inconsistent; an unused `AuditAction` enum remains.
- RBAC has a verified role helper, but permissions CRUD/hierarchy and consistent use of the alternate RBAC middleware are not verified.
