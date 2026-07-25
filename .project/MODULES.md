# Module status

| Module | Status | Verified scope |
|---|---|---|
| Authentication | Implemented | JWT/password/email/session lifecycle; refresh-token device metadata is included in the Phase 2 migration. |
| Roles / RBAC | Implemented foundation | Roles/seed, authenticated role loading, JWT role claim, and `authorize` helper. Permission CRUD/hierarchy is not implemented. |
| User Financial Identity | Implemented | Personal profile, financial profile, goals, preferences, onboarding, trust profile, email/phone changes. |
| Admin user management | Implemented | Search/filter/paginate/view users; status, role, soft-delete, analytics operations. |
| Demo alternative signals / scoring | Implemented | Synthetic CSV data and deterministic score/recommendation flow. |
| Dashboard / insights | In Progress | Demo dashboard exists; persistent user insights are planned. |
| Financial Data Engine | Planned | Transaction/category models exist; canonical ingestion/API flow absent. |
| AI infrastructure / MLOps | Future Production | No model/inference/evaluation/MLOps implementation. |
| KYC, lending, payments, chat, search | Future Production | Explicitly outside Phase 2. |

## Technical debt

- Audit-log model/migration history is inconsistent.
- Alternate `rbac.middleware.js` is unused and incompatible with current user role shape.
- No SMS or object-storage provider is configured for phone verification/image binaries.
