# Supabase / PostgreSQL notes

## Current status

Prisma is configured for PostgreSQL through `DATABASE_URL`; Supabase is the documented intended provider. The synthetic `/api/demo` path does not require a database. Authentication and future persisted modules do.

## Implemented repository support

- Prisma schema, migrations, client configuration, and a role seed (`ADMIN`, `USER`).
- `backend/.env.example` documents required database/auth/mail values.

## In progress / technical debt

- No live Supabase project, migration state, backup configuration, RLS policy, or connection verification is represented in source control.
- Resolve current auth refresh-token schema mismatch before relying on database-backed sessions.

## Future Production requirements

Use environment-managed secrets, separate environments, least-privilege database access, backup/recovery testing, migration review, data-retention controls, and monitoring. Do not use `db push` as a substitute for reviewed migration history in a shared or production environment.
