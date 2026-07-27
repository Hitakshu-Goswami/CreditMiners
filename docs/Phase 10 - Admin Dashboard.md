# Phase 10 - Admin Dashboard

**Status:** Planned

## Objective

Build an internal administration and monitoring dashboard for CreditMiners operations, synthetic dataset management, AI model observability, feature statistics, audit review, and system analytics.

This phase should not create a separate business workflow that bypasses user ownership, authentication, role authorization, audit logging, or existing backend patterns.

It should only answer:

> "How can authorized admins understand platform health, data quality, AI behavior, and operational risk?"

---

## Phase Architecture

```text
Admin User
    |
    v
Admin Authentication
    |
    v
Role Authorization
    |
    v
Admin Validators
    |
    v
Admin Controllers
    |
    v
Admin Services
    |
    +--> User Analytics
    +--> Dataset Analytics
    +--> AI Model Monitoring
    +--> Feature Statistics
    +--> API Monitoring
    +--> Audit Logs
    +--> System Analytics
    |
    v
Prisma / Explicit External Adapters
```

---

## Layer 1 - Admin Access Control

Admin functionality must be protected by explicit authentication and role authorization.

Suggested roles:

- `SUPER_ADMIN`
- `ADMIN`
- `AI_ANALYST`
- `SUPPORT`
- `AUDITOR`

Role boundaries:

- `SUPER_ADMIN`: full administrative access
- `ADMIN`: operational dashboard and user management
- `AI_ANALYST`: AI monitoring, dataset statistics, model metrics
- `SUPPORT`: limited user support views
- `AUDITOR`: read-only audit and compliance access

Required controls:

- Admin-only middleware
- Role-based route guards
- Record-level access checks where applicable
- Audit logs for all privileged actions
- No sensitive data exposure unless required by role
- No manual score edits without an audited override policy

---

## Layer 2 - User Management

Admin user management should support operational visibility while respecting privacy.

Capabilities:

- List users
- Search users
- Filter by status
- View profile completion
- View consent state
- View account activity summary
- View risk bucket distribution
- View dashboard eligibility status
- Suspend or reactivate accounts, if supported by product policy

Do not expose:

- Raw sensitive financial data by default
- Secrets, tokens, passwords, or private auth material
- Full financial documents unless a future consented workflow requires it

Suggested user metrics:

- Total users
- Active users
- New users
- Profile completion rate
- Consent completion rate
- Users with complete feature data
- Users with generated credit scores
- Users with generated risk profiles
- Users with generated investment recommendations

---

## Layer 3 - Dataset Management

Because the hackathon prototype depends on synthetic data, admins need visibility into dataset quality and provenance.

Dataset views:

- Synthetic dataset versions
- Dataset size
- Feature coverage
- Label distribution
- Missing value rates
- Outlier counts
- Data generation rules
- Training/test split summary
- Dataset quality score

Dataset actions:

- View dataset metadata
- Compare dataset versions
- Mark dataset as active for experimentation
- Archive old synthetic datasets
- Export aggregate dataset reports

Important boundary:

- Do not mix synthetic data with real user-consented data without explicit provenance fields and approval.
- Do not describe synthetic model metrics as production performance.

---

## Layer 4 - AI Model Monitoring

Admin monitoring should make AI behavior visible and auditable.

Model registry fields:

- Model ID
- Model name
- Model type
- Model version
- Training dataset version
- Feature version
- Evaluation metrics
- Created timestamp
- Active status
- Deployment status

Monitoring panels:

- Active credit scoring model
- Active risk profiling version
- Active recommendation logic version
- Prediction volume
- Average confidence score
- Low-confidence prediction count
- Risk bucket distribution
- Score distribution
- Feature importance summary
- Explanation generation success rate

Metrics:

- Accuracy
- Precision
- Recall
- F1 score
- ROC-AUC, when applicable
- MAE/RMSE, when applicable
- Confidence distribution
- Fairness checks across synthetic groups
- Drift indicators, when production data exists

---

## Layer 5 - Feature Statistics

Admins and AI analysts need visibility into engineered feature quality.

Feature panels:

- Feature family coverage
- Missing feature counts
- Average quality score
- Feature freshness
- Normalized value distribution
- Percentile distribution
- Outlier rates
- Version usage
- Source data completeness

Feature families:

- Income
- Expense
- Savings
- Cash flow
- Utility payments
- Recharge behavior
- Digital payments
- Merchant behavior
- Spending behavior
- Financial discipline
- Credit readiness
- Investment capacity

Outputs:

- Feature distribution charts
- Feature quality reports
- Feature coverage by user segment
- Top missing features
- Feature drift warnings, when historical data exists

---

## Layer 6 - Risk Bucket Distribution

Risk distribution monitoring helps detect suspicious model behavior and data imbalance.

Risk panels:

- Low risk users
- Medium risk users
- High risk users
- Bucket movement over time
- Average confidence by bucket
- Top factors by bucket
- Score ranges by bucket
- Segment comparison

Use cases:

- Detect overly concentrated model outputs
- Identify synthetic dataset imbalance
- Monitor score movement
- Validate explainability consistency
- Support hackathon demos with transparent aggregate analytics

---

## Layer 7 - API Monitoring

Admin dashboards should expose operational health for backend and AI APIs.

API metrics:

- Request count
- Error rate
- Latency
- Timeout count
- Validation failure count
- Authentication failure count
- Authorization failure count
- Most used endpoints
- Slowest endpoints

AI-specific metrics:

- Credit score generation latency
- Explanation generation latency
- Recommendation generation latency
- Projection generation latency
- Prediction failure rate
- Low-confidence output count

---

## Layer 8 - Audit Logs

Audit logs are mandatory for trust, security, and accountability.

Audit log events:

- Admin login
- Admin user lookup
- User status change
- Dataset activation
- Model activation
- Report generation
- Sensitive record access
- Permission change
- Failed admin authorization

Audit record fields:

```text
admin_audit_logs
----------------
id
actorUserId
actorRole
action
entityType
entityId
metadata
ipAddress
userAgent
createdAt
```

Rules:

- Audit logs should be append-only.
- Audit logs should not store secrets.
- Sensitive metadata should be minimized.
- Admin actions should be traceable to a role and authenticated user.

---

## Layer 9 - System Analytics

System analytics should help the team understand product usage and system health.

Panels:

- User growth
- Profile completion funnel
- Consent funnel
- Feature generation funnel
- Credit score generation funnel
- Risk profiling completion
- Investment recommendation usage
- Growth projection usage
- Marketplace activity, when applicable
- Error trends

Outputs:

- Daily metrics
- Weekly metrics
- Monthly metrics
- Chart-ready aggregate data
- CSV exports for aggregate reports

---

## Suggested Backend Modules

Follow the repository backend flow:

```text
route -> validator -> authentication/authorization middleware -> controller -> service -> Prisma or explicit adapter
```

Suggested modules:

- `admin.routes`
- `admin.validator`
- `admin.controller`
- `admin.service`
- `admin-analytics.service`
- `admin-ai-monitoring.service`
- `admin-audit.service`

Suggested endpoints:

```http
GET  /admin/users
GET  /admin/users/:id
GET  /admin/datasets
GET  /admin/models
GET  /admin/features/statistics
GET  /admin/risk-distribution
GET  /admin/api-metrics
GET  /admin/audit-logs
GET  /admin/system-analytics
```

---

## Deliverables

At the end of Phase 10, CreditMiners should have:

- Admin authentication and role authorization
- Admin dashboard API
- User management views
- Dataset management views
- AI model monitoring
- Feature statistics dashboards
- Risk bucket distribution analytics
- API monitoring dashboard
- Audit log viewer
- System analytics dashboard
- Admin validation and error handling
- Secure, auditable privileged workflows

This phase gives the CreditMiners team operational visibility without compromising user privacy, explainability, or platform trust.
