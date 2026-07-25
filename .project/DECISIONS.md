# Decisions

## 2026-07-25 - Use synthetic data for prescreening

Decision:
Use synthetic consent-style CSV datasets for the prescreening round.

Reason:
The team has limited time before July 29. Live financial-data integrations need onboarding, consent flows, and compliance review. Synthetic data keeps the demo reproducible and safe.

Consequence:
The product must clearly explain that production ingestion can later come from Account Aggregator, Gmail/Takeout, uploads, payment gateways, or BBPS APIs.

## 2026-07-25 - Use transparent scorecard before ML model

Decision:
Use a deterministic weighted scorecard for the MVP.

Reason:
Judges can understand the scoring logic, feature weights, and top-3 explanations. It is easier to defend than a black-box model trained on synthetic labels.

Consequence:
Future ML can be added later as logistic regression or gradient boosting, but the explanation contract should stay stable.

## 2026-07-25 - Keep demo scoring database-independent

Decision:
Read sample CSVs directly in the demo scoring service.

Reason:
The existing Prisma/auth stack is not necessary for prescreening and can slow setup.

Consequence:
After prescreening, assessments should be persisted into the existing Prisma tables.

## 2026-07-25 - Lazy-load auth routes

Decision:
Mount `/api/auth` through a lazy require in `backend/src/app.js`.

Reason:
This prevents demo startup from being blocked by the auth/Prisma import path.

Consequence:
Auth behavior should be re-tested before any production-style release.
