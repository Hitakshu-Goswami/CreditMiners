# CreditMiners AI/ML Roadmap

## Explainable Credit Scoring & AI Micro-Investment Advisor

---

# Phase AI-0 — Research & Problem Understanding

**Goal:** Translate the problem statement into AI tasks.

## Deliverables

- Define AI architecture
- Define ML pipeline
- Identify input features
- Define model outputs
- Define explainability strategy
- Define evaluation metrics
- Create AI documentation

---

# Phase AI-1 — Synthetic Dataset Design

The hackathon explicitly allows synthetic data, so build a realistic dataset.

## User Attributes

- Age
- Occupation
- Education
- Monthly income
- Employment type
- City tier
- Family size

## Alternative Financial Signals

- Mobile recharge frequency
- Recharge amount
- Utility bill payment history
- Electricity bill consistency
- Water bill consistency
- Internet bill consistency
- UPI transaction frequency
- E-commerce purchases
- Refund percentage
- Wallet usage
- Monthly savings
- Monthly expenses
- Cash flow
- Existing loans
- Existing investments

## Labels

- Credit likelihood score (300–900)
- Risk bucket
- Investment capacity
- Financial discipline
- Savings behavior

## Deliverables

- CSV dataset
- Data dictionary
- Feature descriptions
- Label generation logic

---

# ⭐ Phase AI-1.5 — Data Acquisition & Financial Data Pipeline (Future Production Pipeline)

**Status:** Planned (Post-Prescreening / Production Roadmap)

---

# Objective

Transition CreditMiners from a synthetic-data prototype to a real-world AI-powered financial intelligence platform by building scalable, consent-driven data ingestion pipelines that collect both traditional and non-traditional financial signals while maintaining user privacy, transparency, and regulatory compliance.

---

# Stage 1 — Prescreening (Current)

## Data Source

- Synthetic datasets
- Consented sample datasets
- Simulated financial profiles
- Generated transaction histories
- Generated bill payment records
- Generated recharge histories
- Generated investment histories

## Purpose

- AI model development
- Feature engineering
- Explainability testing
- API development
- Dashboard development
- Hackathon demonstration

---

# Stage 2 — Production Data Pipeline

## Traditional Financial Sources

Future integrations include:

- Bank transaction APIs
- Account Aggregator Framework (India)
- Salary statements
- Bank statements
- Loan repayment history
- Credit bureau data (if available)
- Existing investment portfolios
- Insurance payments

---

## Non-Traditional Digital Signals

Exactly aligned with the problem statement.

### Mobile Behaviour

- Recharge frequency
- Recharge amount
- Recharge consistency
- Recharge interval

### Utility Payments

- Electricity
- Water
- Gas
- Internet
- Mobile Postpaid

#### Features

- On-time payment ratio
- Payment delay
- Payment regularity
- Missed payments

### Digital Payment Behaviour

- UPI transactions
- Wallet usage
- QR payments
- Debit/Credit card usage

#### Features

- Transaction frequency
- Payment consistency
- Digital adoption score

### E-Commerce Behaviour

- Purchase frequency
- Average order value
- Refund ratio
- Category diversity
- Spending trends

### Income Stability

- Salary consistency
- Freelance income
- Gig economy income
- Cash-flow stability

### Savings Behaviour

- Monthly savings
- Savings growth
- Emergency fund consistency

### Investment Behaviour

- SIP consistency
- Mutual fund investments
- Gold investments
- Recurring deposits

### Financial Discipline

Derived features:

- Budget adherence
- Expense discipline
- Savings ratio
- Cash-flow management
- Financial habit score

---

# Data Ingestion Pipeline

```text
External APIs
      │
      ▼
Consent Management Layer
      │
      ▼
Data Validation
      │
      ▼
Data Cleaning
      │
      ▼
Normalization
      │
      ▼
Feature Extraction
      │
      ▼
Feature Store
      │
      ▼
ML Pipeline
```

---

# Data Connectors (Future)

## Banking APIs

- RBI Account Aggregator ecosystem
- Open Banking APIs
- Partner financial institutions

## Payment Platforms

- UPI ecosystem
- Digital wallets
- Banking transactions

## Utility Providers

- Electricity boards
- Water boards
- Broadband providers
- Mobile recharge/payment services

## E-Commerce Platforms

- Purchase history (user-consented)
- Order summaries
- Spending categories

---

# Manual Uploads

Users may also upload:

- Bank statements (PDF/CSV)
- Salary slips
- Utility bills
- Transaction exports

The system will parse these documents using OCR/LLM-assisted extraction to generate structured financial features.

---

# Consent & Privacy Layer

Every external integration follows:

- Explicit user consent
- Granular permission management
- Consent revocation
- Data minimization
- Encryption at rest
- Encryption in transit
- Audit logging
- Privacy-first architecture

---

# Feature Store

Instead of feeding raw data directly into ML, build a centralized feature store.

## Example Engineered Features

- Recharge Consistency Score
- Utility Reliability Score
- Digital Spending Score
- Income Stability Score
- Savings Discipline Score
- Financial Behaviour Score
- Credit Readiness Score
- Investment Capacity Score

This ensures every model consumes standardized, reusable features.

---

# AI Pipeline Evolution

## Phase 1 (Hackathon)

```text
Synthetic Data
        │
        ▼
Feature Engineering
        │
        ▼
Credit Scoring Model
        │
        ▼
Explainable AI
        │
        ▼
Investment Advisor
```

---

## Phase 2 (Production)

```text
External APIs
        │
        ▼
Consent Layer
        │
        ▼
Data Pipelines
        │
        ▼
Data Validation
        │
        ▼
Feature Store
        │
        ▼
Feature Engineering
        │
        ▼
Credit Scoring
        │
        ▼
Explainable AI
        │
        ▼
Risk Profiling
        │
        ▼
Investment Advisor
```

# Phase AI-2 — Data Preprocessing

Clean and prepare data.

## Tasks

- Missing values
- Outlier handling
- Normalization
- Feature scaling
- Label encoding
- One-hot encoding
- Train/Test split

## Deliverables

- Clean dataset
- Preprocessing pipeline
- Serialized preprocessing objects

---

# Phase AI-3 — Feature Engineering ⭐

This is one of the most important phases.

Generate features such as:

## Financial Features

- Savings Ratio
- Expense Ratio
- Income Stability
- Monthly Cash Flow
- Investment Capacity
- Emergency Fund Ratio

## Behavior Features

- Recharge Consistency
- Bill Payment Consistency
- Digital Payment Score
- Spending Stability
- Merchant Diversity
- Weekend Spending
- Luxury Spending Ratio

## AI Features

- Financial Discipline Score
- Credit Utilization Estimate
- Transaction Health Score
- Digital Trust Index

## Deliverables

- Engineered dataset
- Feature engineering module
- Feature documentation

---

# Phase AI-4 — Credit Scoring Model ⭐⭐⭐

**Objective:**  
Predict Credit Likelihood Score.

## Possible Models

- Random Forest
- XGBoost
- LightGBM
- CatBoost

## Outputs

- Credit score
- Confidence score
- Risk bucket

## Deliverables

- Trained model
- Evaluation report
- Saved model
- Model API

---

# Phase AI-5 — Explainable AI (XAI) ⭐⭐⭐

The hackathon specifically evaluates interpretability.

## Implement

### SHAP

- Global explanations
- Local explanations
- Feature importance

### LIME

- Individual prediction explanations

## Outputs

Top 3 contributing factors

### Example

**Credit Score:** 742

#### Positive

- Consistent utility payments
- Stable recharge frequency
- High savings ratio

#### Negative

- High discretionary spending

## Deliverables

- SHAP integration
- LIME integration
- Explanation API

---

# Phase AI-6 — Improvement Recommendation Engine ⭐⭐⭐

Convert AI outputs into actionable guidance.

### Example

**Problem:**  
Expense Ratio High

**Recommendation:**  
Reduce discretionary spending by ₹1,000/month.

**Problem:**  
Savings Low

**Recommendation:**  
Increase savings rate to 20%.

**Problem:**  
Recharge irregularity

**Recommendation:**  
Maintain a consistent recharge cycle.

## Deliverables

- Rule engine
- Recommendation generator
- Plain-language explanation

---

# Phase AI-7 — Conversational Risk Assessment ⭐⭐⭐

Build the conversational engine required by the problem statement.

## Questions

- Monthly investment amount?
- Investment goal?
- Time horizon?
- Risk tolerance?
- Emergency fund?
- Existing investments?
- Income stability?
- Expected return?

## Outputs

- Low risk
- Medium risk
- High risk
- Investor persona
- Investment horizon

## Deliverables

- Conversation flow
- Risk scoring logic
- Persona mapping

---

# Phase AI-8 — Investment Recommendation Engine ⭐⭐⭐

## Input

- Credit score
- Financial profile
- Risk profile
- Monthly budget
- Goals

## Output

Suggested allocation, for example:

- 40% Equity Mutual Funds
- 30% Debt Funds
- 20% Gold ETF
- 10% Emergency Fund

Also generate:

- Plain-language explanation
- Why this allocation
- Educational disclaimer

## Deliverables

- Allocation engine
- Recommendation service
- Explanation service

---

# Phase AI-9 — Growth Projection Engine ⭐⭐⭐

Generate projected outcomes for:

- 1 Year
- 3 Years
- 5 Years

For each:

- Conservative
- Moderate
- Aggressive

## Outputs

- Projection values
- Chart-ready data
- CAGR assumptions
- Scenario explanations

## Deliverables

- Projection engine
- Simulation module
- Visualization data API

---

# Phase AI-10 — AI REST API

Expose endpoints such as:

```http
POST /ai/credit-score
POST /ai/explain
POST /ai/recommendations
POST /ai/risk-profile
POST /ai/investment
POST /ai/projection
GET  /ai/history
```

## Deliverables

- FastAPI service
- OpenAPI/Swagger docs
- Docker support

---

# Phase AI-11 — Model Evaluation

## Metrics

- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC (if classification)
- MAE/RMSE (if regression)

Also validate:

- Explainability quality
- Recommendation consistency
- Fairness across synthetic user groups

---

# Phase AI-12 — Production AI

- Model versioning
- Experiment tracking
- Dataset versioning
- Logging
- Monitoring
- Model registry
- Retraining pipeline
- Secure inference API

---

# Final AI Pipeline

```text
Synthetic Dataset
        │
        ▼
Data Validation
        │
        ▼
Preprocessing
        │
        ▼
Feature Engineering
        │
        ▼
Credit Scoring Model
        │
        ▼
Explainable AI (SHAP/LIME)
        │
        ▼
Improvement Recommendation Engine
        │
        ▼
Conversational Risk Assessment
        │
        ▼
Investment Recommendation Engine
        │
        ▼
Growth Projection Engine
        │
        ▼
FastAPI AI Service
        │
        ▼
React Dashboard
```