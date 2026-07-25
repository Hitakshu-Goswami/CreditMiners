# Requirements

## Hackathon Problem Requirements

- Ingest non-traditional digital signals.
- Generate an interpretable credit-likelihood score.
- Show top 3 feature explanations.
- Provide actionable score-improvement recommendations.
- Classify users into low, medium, and high risk buckets.
- Provide a REST API.
- Show at least 10 sample profiles across risk buckets.
- Provide a 5-8 question conversational risk assessment.
- Map risk appetite to suitable instrument categories.
- Generate micro-investment allocation recommendation.
- Show simulated 1-5 year projected growth chart with scenarios.
- Display prominent educational/non-advice disclaimer.

## Current Implementation

Implemented for prescreening:

- 12 synthetic profiles in `data/sample-data/users.csv`.
- Non-traditional signal CSVs for mobile recharge, utility payments, and e-commerce transactions.
- Weighted transparent scorecard in `backend/src/services/signals.service.js`.
- Top 3 explanations and improvement recommendations from score drivers.
- Demo REST API under `/api/demo`.
- React dashboard with overview, profile explorer, explainability drill-down, risk wizard, and advisor view.
- Investment risk profile with six questions in `backend/src/services/investment.service.js`.
- 1/3/5 year conservative/base/optimistic projection.
- Disclaimer in API responses and UI footer.

## Deferred Until After Prescreening

- Account Aggregator integration.
- Gmail/Google Takeout parser.
- Bank statement PDF/CSV upload parser.
- Payment gateway webhook ingestion.
- BBPS/utility provider API integration.
- Persisting demo assessments into Prisma tables.
- Automated backend API tests.
