# AI context and lifecycle

The AI roadmap source of truth is `docs/AI creditminers.md`. This document ties that roadmap to current architecture and implementation status.

## Current hackathon prototype

### Implemented

- Synthetic CSV profiles and simulated recharge, utility, and e-commerce records.
- Deterministic JavaScript feature calculations and weighted scorecard.
- Explainable factors, risk bands, confidence proxy, recommendations, investment-risk questionnaire, allocation, and projections.

The prototype consumes synthetic/consent-style sample data only. It does not contain trained ML models, Python inference, SHAP/LIME, external data connectors, or production AI APIs.

### In progress

- Prisma models reserve space for model versions, assessments, factors, and recommendations, but the demo does not persist or consume them.
- The repository has an `ml/` structure, but its directories and requirements are placeholders.

## AI lifecycle

| Phase | Objective | Inputs | Outputs / deliverables | Dependencies | Status |
|---|---|---|---|---|---|
| AI-0 Problem understanding | map problem statement to responsible AI tasks | hackathon requirements, product constraints | tasks, outputs, explanations, evaluation strategy | product vision | In progress in documentation and demo design |
| AI-1 Synthetic dataset design | create realistic, safe demo data | simulated users and digital behavior | CSVs, label logic, data dictionary/feature definitions | AI-0 | Partially implemented: CSVs exist; complete data dictionary/label documentation is not verified |
| AI-1.5 Data acquisition, integration & feature pipeline | transition to consent-led production data | traditional/non-traditional sources | connectors, consent, validation, cleaning, normalized events, feature store | consent/security architecture | Future Production |
| AI-2 Data preprocessing | clean/encode/scale data | validated datasets | reproducible preprocessing pipeline | AI-1 or AI-1.5 | Planned |
| AI-3 Feature engineering | derive behavioral and financial measures | preprocessed records | versioned feature set/documentation | AI-2 | Demo-only partial implementation |
| AI-4 Credit scoring | estimate credit likelihood/risk | versioned features | score, confidence, risk bucket, evaluation artifacts | AI-3 | Demo scorecard implemented; trained model planned |
| AI-5 Explainable AI | explain individual/global score drivers | assessment and feature context | factors, importance, user-safe explanations | AI-4 | Demo explanations implemented; SHAP/LIME planned |
| AI-6 Recommendation engine | generate improvement actions | assessment/explanations | prioritized, plain-language recommendations | AI-5 | Demo rules implemented; production engine planned |
| AI-7 Conversational risk profiling | assess investment profile | 5–8 answers, goals/horizon/capacity | risk profile/persona | identity/profile data | Stateless demo implemented; persisted flow planned |
| AI-8 Investment recommendation | create risk-aligned allocation | financial/risk profile and goals | allocation, explanation, disclaimer | AI-7 | Demo allocation implemented; personalized production advisor planned |
| AI-9 Growth projection | simulate scenarios | amount, horizon, return assumptions | chart-ready 1/3/5-year scenarios | AI-8 | Demo projections implemented; governed production engine planned |
| AI-10 AI REST APIs | expose AI capabilities through bounded APIs | validated requests | API contract/OpenAPI/service boundary | AI-4–9 | Planned |
| AI-11 Model evaluation | measure quality, consistency, fairness | labeled/holdout data and outcomes | evaluation and fairness reports | AI-4 | Planned |
| AI-12 Production AI/MLOps | operate models safely | versioned datasets/models/features | registry, monitoring, retraining, secure inference | AI-1.5–11 | Future Production |

## Production data pipeline — Future Production

```text
External sources
  → consent layer
  → data validation
  → data cleaning / normalization
  → feature store
  → feature engineering
  → ML models
  → explainable AI
  → recommendations
```

Traditional sources may include bank APIs, Account Aggregator, salary statements, investment data, and future credit-bureau data. Non-traditional signals may include mobile recharge, utilities, UPI/wallet use, e-commerce/spending patterns, savings behavior, and financial discipline. Every source must be explicitly consented, legally permissible, and governed before use.

## Architecture rule

Keep backend domain services and AI inference loosely coupled through explicit API/data contracts. Do not embed provider/model-specific logic in controllers or raw transactional flows. Version consent, raw-source references, feature calculations, model outputs, confidence, and explanations.

## Technical debt / future work

- No canonical event model, consent ledger, feature store, Python/FastAPI service, model training/evaluation code, or MLOps implementation is present.
- The current scorecard is explainable but should not be described as a validated credit model or production decision engine.
