# Database reference

`backend/prisma/schema.prisma` plus ordered migrations define the checked-in PostgreSQL contract. Supabase is the documented intended provider; no live database state is verified here.

## Implemented schema

| Domain | Models |
|---|---|
| Identity/RBAC foundation | `Role`, `User`, `RefreshToken` |
| Financial identity/data | `FinancialProfile`, `FinancialSnapshot`, `TransactionCategory`, `Transaction`, `FinancialGoal` |
| AI outcomes | `AIModelVersion`, `CreditAssessment`, `AssessmentFactor`, `FinancialRecommendation`, `InvestmentRecommendation` |
| System | `Notification`, `AuditLog` |

Most primary/foreign keys are UUIDs. Financial values use PostgreSQL `Decimal`; query-oriented indexes exist for user/time access across snapshots, transactions, assessments, goals, recommendations, and notifications.

## Implemented relations

- A role has many users; a user has one optional financial profile and many refresh tokens, snapshots, transactions, goals, assessments, recommendations, notifications, and audit logs.
- Snapshots belong to a profile/user; assessments belong to user, snapshot, and AI model version; factors/recommendations belong to assessments.
- User-owned records generally cascade on user deletion. Shared role/category/model-version relations are restrictive by default.

## In progress / planned use

Financial and AI models are schema support for roadmap phases, not proof of a mounted module. No consent ledger, canonical source events, feature store, KYC, loan/payment, file, chat, outbox, or MLOps tables are implemented.

## Migration history

1. Initial schema/domain indexes and relations.
2. Email-verification fields.
3. Password-reset fields.
4. Account-lock fields and replacement of original `audit_logs` with `AuditLog`.

## Technical debt

- `RefreshToken` has no `deviceInfo` field, though auth code creates/selects it.
- Current `AuditLog` uses string actions; the old `AuditAction` enum remains unused. The last audit migration drops the former audit table, so future audit changes require a migration/data-retention plan.
- No verified database check constraints enforce documented score or monetary bounds.

Use [BACKEND_GUIDELINES.md](BACKEND_GUIDELINES.md) for schema-change rules and [AI_CONTEXT.md](AI_CONTEXT.md) for future feature/model provenance requirements.
