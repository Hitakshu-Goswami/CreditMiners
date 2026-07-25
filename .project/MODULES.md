# Module status

| Module | Status | Verified scope |
|---|---|---|
| Authentication | Implemented foundation | Auth routes/service/validators/JWT/password/email/session flows; see technical debt below. |
| Roles / RBAC | Implemented foundation | `Role` model/seed, loaded role, role claim, `authorize` helper. Permission CRUD/hierarchy is not verified. |
| Audit logging | In progress | Auth writes `AuditLog`; contract/migration history requires reconciliation. |
| Demo alternative signals | Implemented | Synthetic recharge, utility, e-commerce, and user CSV data. |
| Demo feature engineering | Implemented | Deterministic feature calculations inside `signals.service.js`. |
| Demo explainable scoring | Implemented | Score, risk, confidence proxy, factors, recommendations. |
| Demo risk profile/advisor/projection | Implemented | Six-question stateless profile, allocation, 1/3/5-year scenarios. |
| User financial identity | In progress | Prisma profile/goal models and roadmap direction; no mounted service/API. |
| Financial data engine | Planned | Transaction/category models exist; canonical data engine absent. |
| Persisted assessments/recommendations | Planned | Prisma models exist; demo does not write them. |
| Dashboard/insights | In progress | Demo dashboard exists; persisted user analytics planned. |
| Admin platform | Planned | No protected admin routes/UI. |
| AI infrastructure / MLOps | Future Production | No model/inference/evaluation/MLOps implementation. |
| KYC, lending, payments, chat, search | Future Production | No implementation. |
| Tests, jobs, cache, monitoring, CI/CD | Future Production | No verified implementation. |

## Technical debt

- `RefreshToken.deviceInfo` is used in auth service but absent in schema/migrations.
- `rbac.middleware.js` is unused and does not match the `req.user.role` object shape used by current authentication.
- Audit-log model/migration history is inconsistent.

Status definitions are in [STANDARDS.md](STANDARDS.md). A model, directory, or roadmap entry alone is never evidence of a completed module.
