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

# ✅ Phase 13 — Loan Marketplace & Investment Discovery Engine (Completed)

**Status:** ✅ Completed (Hackathon MVP)

## Objective

Build a complete AI-powered peer-to-peer loan marketplace where verified borrowers can publish funding requests, investors can discover opportunities, express interest, and leverage AI-generated credit intelligence to make informed funding decisions.

This phase also lays the foundation for future lending, investment, escrow, and financial marketplace capabilities.

---

## ✅ Loan Management

- ✅ Create Loan Request
- ✅ Update Draft Loan
- ✅ Delete Draft Loan
- ✅ View Own Loans
- ✅ View Single Loan
- ✅ Publish Loan
- ✅ Close Loan
- ✅ Loan Ownership Verification
- ✅ Loan Validation before Publishing
- ✅ Loan Statistics Dashboard

---

## ✅ Marketplace

- ✅ Public Marketplace Listing
- ✅ Published Loan Listing
- ✅ Loan Details API
- ✅ Featured Loans
- ✅ Trending Loans
- ✅ Recommended Loans
- ✅ Dynamic Marketplace Ranking

---

## ✅ Search & Discovery

- ✅ Keyword Search
- ✅ Category Filter
- ✅ Risk Level Filter
- ✅ Funding Status Filter
- ✅ Country Filter
- ✅ State Filter
- ✅ City Filter
- ✅ Loan Amount Range Filter
- ✅ Interest Rate Range Filter
- ✅ Duration Filter
- ✅ Pagination
- ✅ Multiple Sorting Options

---

## ✅ Loan Media

- ✅ Upload Loan Images
- ✅ Upload Supporting Documents
- ✅ List Media
- ✅ Delete Media
- ✅ Cover Image Support
- ✅ Collateral Information Support

---

## ✅ Investor Interest Module

- ✅ Express Interest
- ✅ Prevent Duplicate Interest
- ✅ View Interested Investors
- ✅ Accept Investor
- ✅ Reject Investor
- ✅ Withdraw Interest
- ✅ Investor Tracking

---

## ✅ AI Credit Intelligence

- ✅ AI Credit Score Generation
- ✅ Risk Level Prediction
- ✅ AI Confidence Score
- ✅ AI Recommendation
- ✅ AI Financial Summary
- ✅ AI Evaluation Timestamp
- ✅ Automatic AI Analysis on Loan Publish
- ✅ Manual AI Re-analysis Endpoint

---

## ✅ Dashboard & Analytics

### Borrower Dashboard

- ✅ Total Loans
- ✅ Draft Loans
- ✅ Published Loans
- ✅ Funded Loans
- ✅ Closed Loans
- ✅ Total Marketplace Views
- ✅ Total Interested Investors
- ✅ Average AI Credit Score

### Investor Dashboard

- ✅ Interests Sent
- ✅ Accepted
- ✅ Pending
- ✅ Rejected

### Marketplace Dashboard

- ✅ Active Loans
- ✅ Funded Loans
- ✅ Total Borrowers
- ✅ Total Investors
- ✅ Average Loan Amount
- ✅ Average Interest Rate
- ✅ Marketplace Intelligence

---

## ✅ Loan Analytics

- ✅ Loan View Tracking
- ✅ Dynamic Trending Score
- ✅ Trending Score Calculation
- ✅ Automatic Marketplace Ranking
- ✅ Activity Tracking

---

## ✅ Financial Metadata

- ✅ Funding Deadline
- ✅ Expiry Date
- ✅ Minimum Investment
- ✅ Interest Rate
- ✅ Funding Progress
- ✅ Funding Status
- ✅ Verification Status
- ✅ Published Timestamp
- ✅ Closed Timestamp
- ✅ Last Activity Timestamp

---

## ✅ Geographic Intelligence

- ✅ Country
- ✅ State
- ✅ City
- ✅ Latitude
- ✅ Longitude

---

## ✅ Audit & Security

- ✅ Audit Logging
- ✅ Authentication Integration
- ✅ Ownership Authorization
- ✅ Input Validation
- ✅ Error Handling
- ✅ Secure Protected APIs

---

## ✅ API Features

- ✅ RESTful API Design
- ✅ Pagination
- ✅ Filtering
- ✅ Sorting
- ✅ Search
- ✅ Validation
- ✅ Consistent Response Format
- ✅ Async Error Handling

---

## Deliverables

- ✅ Complete Loan Management System
- ✅ AI-Assisted Marketplace
- ✅ Investor Discovery Workflow
- ✅ Borrower & Investor Dashboards
- ✅ AI Credit Analysis Engine Integration
- ✅ Marketplace Ranking & Analytics
- ✅ Production-Ready Backend Architecture