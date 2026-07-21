# API Documentation

## Overview

CreditMiners exposes a RESTful API built using FastAPI. The API serves as the communication layer between the frontend dashboard and the backend services responsible for credit scoring, explainability, risk profiling, and investment recommendations.

The current API specification represents the planned endpoints for the prototype and may evolve during development.

---

# Base URL

```
http://localhost:8000/
```

---

# Authentication

The prototype does not require authentication.

Future versions may implement:

- JWT Authentication
- OAuth2
- API Keys

---

# API Endpoints

---

## Health Check

### Endpoint

```
GET /
```

### Description

Checks whether the API is running.

### Response

```json
{
  "message": "CreditMiners API is running."
}
```

---

## Credit Score Prediction

### Endpoint

```
POST /credit-score
```

### Description

Accepts alternative financial behaviour data and returns an explainable credit score.

### Sample Request

```json
{
  "recharge_frequency": 4,
  "utility_payment_rate": 0.95,
  "monthly_transactions": 48,
  "monthly_spending": 12000,
  "shopping_frequency": 6
}
```

### Sample Response

```json
{
  "credit_score": 742,
  "risk_level": "Medium",
  "top_features": [
    "Utility Payment Regularity",
    "Recharge Frequency",
    "Monthly Transactions"
  ],
  "recommendations": [
    "Maintain consistent bill payments.",
    "Increase digital payment activity."
  ]
}
```

---

## Risk Assessment

### Endpoint

```
POST /risk-profile
```

### Description

Evaluates the user's investment risk appetite based on questionnaire responses.

### Sample Request

```json
{
  "investment_goal": "Long Term",
  "monthly_investment": 2000,
  "risk_preference": "Medium",
  "investment_horizon": 5,
  "experience": "Beginner"
}
```

### Sample Response

```json
{
  "risk_bucket": "Medium"
}
```

---

## Investment Recommendation

### Endpoint

```
POST /investment-plan
```

### Description

Generates an educational investment allocation based on the user's risk profile.

### Sample Response

```json
{
  "allocation": {
    "Index Funds": "50%",
    "Debt Mutual Funds": "30%",
    "Fixed Deposits": "20%"
  }
}
```

---

## Growth Projection

### Endpoint

```
GET /projection
```

### Description

Returns simulated investment growth for different market scenarios.

### Sample Response

```json
{
  "conservative": [...],
  "moderate": [...],
  "optimistic": [...]
}
```

---

## Sample Users

### Endpoint

```
GET /sample-users
```

### Description

Returns synthetic user profiles for demonstration.

---

# HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Request Successful |
| 201 | Resource Created |
| 400 | Invalid Request |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

# API Workflow

```
Frontend Dashboard

↓

REST API

↓

FastAPI Backend

↓

Machine Learning Models

↓

Prediction

↓

JSON Response

↓

Frontend Visualization
```

---

# Future API Enhancements

Future versions of the API may include:

- User Authentication
- User Registration
- Report Generation
- Model Retraining
- Real Banking API Integration
- Account Aggregator Integration

---

# Disclaimer

The API returns educational predictions using synthetic or consented data. The generated investment recommendations are intended solely for educational purposes and do not constitute regulated financial advice.