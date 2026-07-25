# Architecture

## Hackathon prototype — implemented architecture

```text
React/Vite dashboard
  → Express /api/demo
  → demo controller/service
  → synthetic CSV datasets
  → deterministic features, scorecard, explanations, recommendations
```

The current prototype intentionally consumes synthetic datasets. `signals.service.js` calculates alternative-signal features from recharge, utility, e-commerce, and financial sample data; `investment.service.js` provides risk profiling, allocation, and projections.

Authentication follows a separate API path:

```text
client → /api/auth → validation → controller → auth service
       → JWT/utilities + Prisma → PostgreSQL
```

Routes, controllers, services, middleware, utilities, config, and Prisma form the current modular-monolith boundary. The request lifecycle is: security/parsing middleware → request logger/rate limit → route middleware → controller → service → response/global error handler.

## Production transition — planned

```text
Consented traditional and non-traditional sources
  → consent / access controls
  → validation, cleaning, normalization
  → canonical financial data + feature store
  → versioned AI inference APIs
  → explainability and recommendation services
  → backend/domain APIs and dashboards
```

Traditional data may include bank/Account Aggregator, salary, investment, and future bureau data. Alternative signals may include recharge, utilities, UPI/wallet, e-commerce, spending, savings, and financial-discipline behavior. These integrations are Future Production only.

## Coupling rule

Backend modules own domain validation, authorization, persistence, and API contracts. AI components consume versioned, consented data through explicit contracts and return versioned outcomes; they must remain loosely coupled from controllers and raw ingestion. See [AI_CONTEXT.md](AI_CONTEXT.md) and [BACKEND_GUIDELINES.md](BACKEND_GUIDELINES.md).

## Status and debt

- Prisma models support future financial/AI domains, but they do not create implemented modules.
- No worker, queue, cache, model service, external connector, or production observability stack is present.
- Auth/session schema alignment and audit-log contract reconciliation remain technical debt; see [DATABASE.md](DATABASE.md).
