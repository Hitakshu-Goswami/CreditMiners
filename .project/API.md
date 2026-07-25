# API Documentation

Base URL:

```text
http://localhost:5000
```

## Health

```http
GET /api/health
```

Returns API status.

## Demo Summary

```http
GET /api/demo/summary
```

Returns profile count, risk-bucket distribution, average score, and demo data source note.

Example fields:

```json
{
  "totalProfiles": 12,
  "buckets": {
    "LOW": 7,
    "MEDIUM": 2,
    "HIGH": 3
  },
  "averageScore": 730
}
```

## Sample Profiles

```http
GET /api/demo/profiles
```

Returns all sample users with score, risk level, city, occupation, income, confidence, and top reason.

## User Assessment

```http
GET /api/demo/profiles/:userId/assessment
```

Returns a full explainable credit-likelihood assessment for one sample user.

Includes:

- User profile
- Score
- Estimated credit score
- Financial health score
- Confidence score
- Risk level
- Raw engineered features
- Category scores
- Top 3 factors
- Improvement recommendations
- Disclaimer

## Score Profile

```http
POST /api/demo/score
Content-Type: application/json

{
  "userId": "u001"
}
```

Returns the same assessment shape as the user assessment endpoint.

## Investment Questions

```http
GET /api/demo/investment/questions
```

Returns six risk-profile questions and answer options.

## Investment Risk Assessment

```http
POST /api/demo/investment/assess
Content-Type: application/json

{
  "answers": {
    "monthlyAmount": 2000,
    "horizonYears": 3,
    "lossComfort": "medium",
    "emergencyFundMonths": 2,
    "incomeStability": "mostly_stable",
    "experience": "some"
  }
}
```

Returns:

- Low/medium/high appetite
- Plain-language recommendation
- Suggested allocation
- Conservative/base/optimistic expected returns
- 1/3/5 year projection
- Disclaimer
