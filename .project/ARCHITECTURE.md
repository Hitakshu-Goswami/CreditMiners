# Architecture

## Current Prescreening Architecture

```text
Synthetic CSV data
        ↓
Backend demo services
        ↓
Feature engineering and scorecard
        ↓
Top 3 explanations + recommendations
        ↓
Express REST API
        ↓
React/Vite dashboard
```

## Data Sources

Current MVP:

- `data/sample-data/users.csv`
- `data/sample-data/mobile_recharges.csv`
- `data/sample-data/utility_payments.csv`
- `data/sample-data/ecommerce_transactions.csv`

Future adapters:

- Account Aggregator
- Gmail API / Google Takeout
- Bank statement upload
- Payment gateway webhooks
- BBPS / utility APIs

## Backend

Runtime: Node.js + Express.

Important files:

- `backend/src/app.js` mounts `/api/demo`.
- `backend/src/routes/demo.routes.js` defines demo routes.
- `backend/src/controllers/demo.controller.js` maps requests to services.
- `backend/src/services/signals.service.js` loads CSVs, extracts features, scores users, and creates explanations.
- `backend/src/services/investment.service.js` classifies investment appetite and generates projections.

The demo scoring path does not require the database. This keeps the prescreening demo reproducible.

## Frontend

Runtime: React + Vite.

Important files:

- `frontend/src/App.jsx` contains the demo app screens and API wiring.
- `frontend/src/styles.css` contains the visual system and responsive layout.
- `frontend/vite.config.js` proxies `/api` to `http://localhost:5000`.

Screens:

- Overview
- Profiles
- Risk profile
- Advisor

## Scoring Model

The credit-likelihood score is a transparent scorecard:

```text
Utility regularity: 30%
Recharge consistency: 20%
E-commerce discipline: 20%
Cashflow strength: 20%
Data completeness: 10%
```

Score range:

```text
300-619: High risk
620-739: Medium risk
740-900: Low risk
```

## Migration To Real Data

Keep the scorecard and feature layer stable. Replace only the ingestion layer:

```text
CSV adapter today
AA/Gmail/upload/payment adapters later
        ↓
Canonical event format
        ↓
Same feature engineering
        ↓
Same scorecard and explanations
```
