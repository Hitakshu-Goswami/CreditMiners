# System Architecture

## Overview

CreditMiners follows a modular three-tier architecture that separates the presentation layer, application logic, and machine learning components. This design improves maintainability, scalability, and allows each module to evolve independently.

The system consists of three primary layers:

1. Frontend (User Interface)
2. Backend (Business Logic & REST APIs)
3. Machine Learning Engine (Credit Scoring & Investment Recommendation)

---

# High-Level Architecture

```
+------------------------------------------------------+
|                     Frontend                         |
|          React + Tailwind CSS Dashboard             |
+-------------------------+----------------------------+
                          |
                          | REST API Requests
                          ▼
+------------------------------------------------------+
|                     Backend                          |
|                    FastAPI Server                    |
|------------------------------------------------------|
| User Management                                      |
| Credit Scoring API                                   |
| Risk Profiling API                                   |
| Investment Recommendation API                        |
| Growth Projection API                                |
+-------------------------+----------------------------+
                          |
                          ▼
+------------------------------------------------------+
|              Machine Learning Layer                  |
|------------------------------------------------------|
| Feature Engineering                                  |
| Credit Scoring Model                                 |
| Explainability (SHAP)                                |
| Risk Classification                                  |
| Investment Mapping Engine                            |
+-------------------------+----------------------------+
                          |
                          ▼
+------------------------------------------------------+
|                 SQLite Database                      |
|  Sample Users | Synthetic Data | Predictions         |
+------------------------------------------------------+
```

---

# Frontend Layer

The frontend provides a user-friendly dashboard where users can interact with the system.

### Responsibilities

- Upload sample financial data
- Display credit score
- Show explainable AI insights
- Conduct conversational risk assessment
- Display investment recommendations
- Visualize projected portfolio growth

### Proposed Technologies

- React.js
- Tailwind CSS
- Recharts
- Axios

---

# Backend Layer

The backend acts as the central processing unit of the application.

### Responsibilities

- Validate user inputs
- Receive financial data
- Perform feature engineering
- Invoke machine learning models
- Generate credit scores
- Process risk assessment responses
- Return investment recommendations
- Serve REST APIs

### Proposed Framework

- FastAPI

---

# Machine Learning Layer

The machine learning layer performs intelligent decision-making based on alternative financial signals.

### Components

## Feature Engineering

Transforms raw behavioural data into numerical features suitable for machine learning.

Example features include:

- Recharge frequency
- Utility payment consistency
- Monthly transaction count
- Spending behaviour
- Purchase regularity

---

## Credit Scoring Model

Generates an estimated credit-likelihood score based on engineered features.

Possible algorithms:

- Random Forest
- XGBoost
- Gradient Boosting

---

## Explainability Engine

Uses SHAP values to explain why a particular score was assigned.

Outputs include:

- Top three influencing features
- Feature importance
- Human-readable explanations
- Personalized improvement suggestions

---

## Risk Assessment Engine

Processes responses from the conversational questionnaire.

Outputs:

- Low Risk
- Medium Risk
- High Risk

---

## Investment Recommendation Engine

Maps each risk profile to educational investment categories.

Example recommendations:

- Fixed Deposits
- Debt Mutual Funds
- Hybrid Funds
- Index Funds
- Equity Mutual Funds

---

# Database

The prototype uses SQLite for simplicity during development.

The database stores:

- Sample users
- Financial behaviour
- Credit scores
- Risk profiles
- Investment recommendations

---

# Data Flow

The following sequence summarizes the application workflow.

```
User

↓

Dashboard

↓

REST API

↓

Feature Engineering

↓

Credit Model

↓

Explainability

↓

Credit Score

↓

Risk Questionnaire

↓

Risk Classification

↓

Investment Recommendation

↓

Growth Simulation

↓

Dashboard
```

---

# API Communication

The frontend communicates with the backend through REST APIs.

Example endpoints include:

- POST /credit-score
- POST /risk-profile
- POST /investment-plan
- GET /sample-users

---

# Security Considerations

Although the prototype uses synthetic data, the architecture is designed with privacy in mind.

Future enhancements may include:

- Authentication
- Authorization
- Encrypted communication
- Consent management
- Secure API access

---

# Scalability

The modular architecture enables future enhancements without major redesign.

Possible extensions include:

- Account Aggregator integration
- Real banking APIs
- OCR-based document processing
- SMS parsing
- Cloud deployment
- Containerization using Docker

---

# Conclusion

The proposed architecture provides a clean separation between the user interface, backend services, and machine learning components. This modular approach simplifies development during the hackathon while providing a strong foundation for future production-scale deployment.