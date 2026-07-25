# Phase 2 — User Financial Identity (Highest Priority)

This is the foundation for both the credit scoring engine and investment advisor.

## User Module

- User profile
- Profile completion
- Occupation
- Education
- City / State
- Monthly income
- Financial goals
- Consent management
- Notification preferences

## Financial Profile

- Monthly income
- Monthly expenses
- Savings
- Existing loans
- Existing investments
- Dependents
- Emergency fund
- Employment type

## Digital Behaviour Module (Core Hackathon Requirement)

Instead of generic transaction history, model the exact alternative signals from the problem statement:

- Mobile recharge frequency
- Utility bill payment regularity
- E-commerce transaction patterns
- UPI usage
- Wallet usage
- Subscription payments
- Salary consistency
- Savings consistency

These are the features your ML pipeline will consume.

---

# Phase 3 — Financial Data Engine

Instead of generic CRUD modules, build the data pipeline.

## Transactions

- Income
- Expense
- Merchant
- Category
- Tags

## Bills

- Electricity
- Water
- Gas
- Internet
- Due dates
- Paid on time

## Recharge History

- Recharge amount
- Recharge interval
- Missed recharge
- Frequency score

## E-commerce

- Order count
- Refund ratio
- Average order value
- Spending categories

Everything here feeds feature engineering.

---

# Phase 4 — Feature Engineering Engine ⭐

This is one of the hackathon's key evaluation points.

Generate features like:

- Expense/Income Ratio
- Savings Ratio
- Bill Payment Regularity
- Recharge Consistency
- Digital Payment Score
- Spending Stability
- Income Stability
- Financial Discipline Score
- Cash Flow
- Merchant Diversity
- Essential vs Luxury Spend
- Monthly Variance

Store engineered features separately for ML.

---

# Phase 5 — Explainable Credit Scoring AI ⭐⭐⭐

Exactly matches the problem statement.

## Endpoints

- Generate Credit Score
- Get Score
- Score History

## Outputs

- Credit Likelihood Score
- Low / Medium / High Risk
- Top 3 contributing factors
- SHAP/LIME explanation
- Confidence score
- Improvement roadmap

### Example

**Score:** 742

#### Top Factors

- Consistent utility payments (+18)
- Stable recharge frequency (+13)
- High discretionary spending (-11)

#### Improvement Plan

- Reduce luxury spending by 15%
- Maintain bill payment streak
- Increase monthly savings by ₹500

---

# Phase 6 — Conversational Risk Profiling ⭐⭐⭐

Another explicit hackathon requirement.

## Build

- 5–8 question assessment
- Conversation/session handling
- Risk scoring
- Low / Medium / High profile
- Goal extraction
- Investment horizon

## Questions Include

- Investment goal
- Monthly investment budget
- Risk tolerance
- Emergency fund
- Time horizon
- Income stability
- Loss tolerance
- Previous investment experience

---

# Phase 7 — AI Micro-Investment Advisor ⭐⭐⭐

This directly satisfies the problem statement.

## Generate

- Recommended allocation
- Instrument categories
- Monthly investment amount
- SIP suggestions
- Gold
- Debt
- Equity
- Emergency fund

## Also Provide

- Plain-language explanation
- Why this allocation?
- Risks
- Expected volatility

Include the mandatory disclaimer on every response.

---

# Phase 8 — Growth Projection Engine ⭐⭐⭐

Produce:

- 1-year projection
- 3-year projection
- 5-year projection

For each:

- Conservative
- Moderate
- Aggressive

Generate chart data for the frontend.

---

# Phase 9 — Explainability & Insights

## Financial Health Dashboard

## Credit Dashboard

## AI Insights

## Improvement Timeline

## Financial Habit Trends

## Monthly Reports

## Achievement Badges (Optional)

---

# Phase 10 — Admin Dashboard

- User management
- Dataset management
- AI model monitoring
- Feature statistics
- Risk bucket distribution
- API monitoring
- Audit logs
- System analytics

---

# Phase 11 — AI Infrastructure

- Dataset versioning
- Model versioning
- Prediction history
- SHAP/LIME service
- Feature importance service
- Recommendation engine
- Projection engine

---

# Phase 12 — Production Readiness

- Caching
- Background jobs
- Notifications
- Rate limiting
- Monitoring
- Testing
- CI/CD
- Docker
- Deployment