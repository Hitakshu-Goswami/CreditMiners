# CreditMiners Project Memory

This file is the shared handoff log for humans and AI assistants working on this repo.

## How To Use

- Read this file before starting work after a sync, pull, branch switch, or long break.
- Add a new entry after every meaningful change.
- Keep entries short but specific: what changed, where it changed, why it changed, and how it was verified.
- Do not delete earlier entries unless the team intentionally rewrites project history.
- If an AI assistant makes changes, it should append an entry here before finishing.

## Current Product Direction

CreditMiners is a hackathon MVP for transparent credit-likelihood scoring and micro-investment guidance for underserved users. For the prescreening round, the project uses synthetic consent-style data instead of live integrations.

The demo story:

1. Synthetic digital signals represent user-consented mobile recharge, utility payment, e-commerce, and cashflow behavior.
2. A transparent weighted scorecard generates a credit-likelihood score.
3. The UI shows the top 3 score drivers and improvement pathway.
4. A six-question risk profile maps users to a micro-investment allocation and 1/3/5 year growth projection.
5. All investment outputs display the educational/non-advice disclaimer.

## Change Log

### 2026-07-25 - Prescreening MVP implemented

Changed by: AI assistant

Summary:
- Added synthetic sample data for 12 users across low, medium, and high risk buckets.
- Added backend demo APIs under `/api/demo`.
- Added transparent digital-signal scoring service.
- Added investment risk-profile and projection service.
- Added a full Vite + React frontend.
- Upgraded the frontend into a polished multi-screen prescreening demo.
- Added local development defaults for backend env validation.

Key files:
- `data/sample-data/users.csv`
- `data/sample-data/mobile_recharges.csv`
- `data/sample-data/utility_payments.csv`
- `data/sample-data/ecommerce_transactions.csv`
- `backend/src/services/signals.service.js`
- `backend/src/services/investment.service.js`
- `backend/src/controllers/demo.controller.js`
- `backend/src/routes/demo.routes.js`
- `backend/src/app.js`
- `backend/src/config/env.validation.js`
- `frontend/src/App.jsx`
- `frontend/src/styles.css`
- `frontend/package.json`
- `frontend/vite.config.js`
- `frontend/index.html`

Verification:
- `cd frontend && npm run build` passed.
- Backend service checks returned 12 profiles: 7 low risk, 2 medium risk, 3 high risk.
- Live API check passed for `GET /api/demo/summary`.
- Live frontend check returned HTTP 200 at `http://127.0.0.1:5173`.

Notes:
- The demo path is intentionally database-independent.
- Existing auth routes are lazy-loaded so demo startup is not blocked by Prisma/auth imports.
- Live integrations are deferred until after prescreening. Future sources can be Account Aggregator, Gmail/Takeout, payment gateway webhooks, BBPS APIs, and manual uploads.

### 2026-07-25 - Supabase setup documented

Changed by: AI assistant

Summary:
- Confirmed Prisma is already configured for PostgreSQL/Supabase through `DATABASE_URL`.
- Updated `backend/.env.example` with Supabase connection-string guidance.
- Added `.project/SUPABASE.md` with local `.env`, migration, seed, and verification steps.

Notes:
- Real Supabase credentials must stay in `backend/.env`, which is ignored by Git.
- The demo `/api/demo` flow is database-independent; Supabase is needed for Prisma-backed auth and future persisted product data.
