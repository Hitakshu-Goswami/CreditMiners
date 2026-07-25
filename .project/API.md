# API reference

Local API base URL: `http://localhost:5000`. Vite proxies `/api` during development.

## Response and error conventions

Most successful controllers use `utils/response`:

```json
{ "success": true, "message": "…", "data": {}, "timestamp": "ISO-8601" }
```

The global error middleware returns `{ "success": false, "message": "…" }` and includes a stack outside production. Health and 404 handlers are separate simple responses. Do not treat undocumented fields as stable contracts.

## Implemented routes

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | No | Basic API health response. |
| GET | `/api/demo/summary` | No | Synthetic demo metrics. |
| GET | `/api/demo/profiles` | No | Synthetic profile summaries. |
| GET | `/api/demo/profiles/:userId/assessment` | No | Full synthetic explainable assessment. |
| POST | `/api/demo/score` | No | Assessment from `{ "userId": "…" }`. |
| GET | `/api/demo/investment/questions` | No | Six demo risk questions. |
| POST | `/api/demo/investment/assess` | No | Educational risk/allocation/projection response. |
| POST | `/api/auth/register` | No | Register with strong password validation. |
| POST | `/api/auth/login` | No | Login verified user. |
| POST | `/api/auth/refresh` | No | Rotate a refresh token. |
| POST | `/api/auth/logout` | Bearer | Delete supplied refresh-token session. |
| GET | `/api/auth/verify-email?token=` | No | Verify email token. |
| POST | `/api/auth/resend-verification` | No | Resend verification email. |
| POST | `/api/auth/forgot-password` | No | Initiate reset without revealing account existence. |
| POST | `/api/auth/reset-password` | No | Reset password from token. |
| POST | `/api/auth/change-password` | Bearer | Change password and revoke sessions. |
| GET | `/api/auth/sessions` | Bearer | List current user's sessions. |
| DELETE | `/api/auth/sessions/:sessionId` | Bearer | Delete owned session. |
| DELETE | `/api/auth/sessions` | Bearer | Delete all current-user sessions. |

Authenticated requests use `Authorization: Bearer <access-token>`. Authentication loads the user and role from the database. `authorize(...roleNames)` is the verified role middleware foundation; no role-management API is mounted.

## In progress / planned APIs

Financial identity, consent, transactions, bills, recharges, e-commerce data, features, persisted scoring, dashboard, admin, and AI-service APIs are roadmap work. Follow [ROADMAP.md](ROADMAP.md) and do not expose them as existing contracts.

## Technical debt

The auth service expects a refresh-token `deviceInfo` field absent from the checked-in schema/migrations, so session/token persistence must be reconciled before treating the auth path as production-ready.
