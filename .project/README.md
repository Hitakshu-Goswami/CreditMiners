# CreditMiners Project Notes

CreditMiners is a hackathon prototype for:

- Transparent credit-likelihood scoring for credit-invisible or thin-file users.
- Explainable feature attribution from non-traditional digital signals.
- Actionable score-improvement pathways.
- Conversational micro-investment risk profiling.
- Plain-language allocation and 1/3/5 year growth projection.

## Current MVP

The prescreening MVP uses synthetic consent-style data and a deterministic scorecard. This is deliberate: it keeps the demo ethical, reproducible, and easy to explain to judges before live financial-data integrations are introduced.

## Main Demo Flow

1. Start backend API.
2. Start frontend Vite app.
3. Open the dashboard.
4. Show overview metrics and risk mix.
5. Open profiles and drill into top 3 explanations.
6. Show improvement recommendations.
7. Complete the risk-profile wizard.
8. Show advisor allocation and growth projections.

## Run Locally

Backend:

```bash
cd backend
npm start
```

Frontend:

```bash
cd frontend
npm run dev -- --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:5173
```

## Shared Memory

Read `.project/memory.md` before starting work. Append a new entry there after meaningful changes.

## Supabase

See `.project/SUPABASE.md` for database connection setup. Keep real Supabase credentials in `backend/.env` only.
