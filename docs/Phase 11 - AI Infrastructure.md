# Phase 11 - AI Infrastructure

**Status:** Planned

## Objective

Create the versioned AI infrastructure needed to make CreditMiners models, datasets, predictions, explanations, recommendations, and projections reproducible and observable.

This phase should not introduce opaque AI behavior, untracked model changes, unversioned datasets, or provider-specific logic inside HTTP controllers.

It should only answer:

> "How can every AI output be reproduced, monitored, explained, and safely upgraded?"

---

## Phase Architecture

```text
Synthetic Dataset / Consented Dataset
        |
        v
Dataset Registry
        |
        v
Preprocessing Pipeline
        |
        v
Feature Store
        |
        v
Training and Evaluation Pipeline
        |
        v
Model Registry
        |
        v
Inference Service
        |
        +--> Credit Scoring
        +--> Risk Profiling
        +--> Recommendations
        +--> Growth Projections
        |
        v
Explanation Services
        |
        v
Prediction History
        |
        v
Monitoring and Admin Dashboard
```

---

## Layer 1 - Dataset Versioning

Every dataset used for training, validation, demonstration, or evaluation should be registered with explicit metadata.

Dataset metadata:

- Dataset ID
- Dataset name
- Dataset version
- Source type
- Synthetic or consented flag
- Generation method
- Row count
- Feature count
- Label definitions
- Data dictionary reference
- Train/test split strategy
- Quality score
- Created timestamp

Source types:

- `SYNTHETIC`
- `CONSENTED_SAMPLE`
- `USER_CONSENTED`
- `MANUAL_UPLOAD`
- `FUTURE_EXTERNAL_CONNECTOR`

Rules:

- Keep synthetic and real data clearly separated.
- Store provenance for every dataset.
- Never train production models on unknown-origin data.
- Never overwrite an existing dataset version.
- Store label-generation logic for synthetic datasets.

---

## Layer 2 - Feature Versioning

Feature engineering must remain reproducible across model versions.

Feature version metadata:

- Feature version ID
- Feature group
- Feature name
- Definition
- Formula
- Dependencies
- Normalization method
- Window
- Quality scoring method
- Created timestamp
- Active status

Feature registry benefits:

- Model reproducibility
- Explainability
- Historical comparisons
- Safer feature upgrades
- Backward compatibility for old predictions

Feature compatibility checks:

- Required features exist
- Feature data types match model expectations
- Normalized ranges are valid
- Feature windows are available
- Quality score meets threshold

---

## Layer 3 - Model Versioning

Every trained model or rule-based AI component should be versioned.

Model metadata:

- Model ID
- Model name
- Model type
- Model version
- Training dataset version
- Feature version
- Preprocessing version
- Hyperparameters
- Evaluation metrics
- Explainability method
- Artifact path or storage reference
- Created timestamp
- Active status

Model categories:

- Credit scoring model
- Risk profiling model or rules
- Investment recommendation engine
- Growth projection engine
- Explanation mapping service

Rules:

- Never replace a model artifact without a new version.
- Keep one active production or demo version per model family.
- Preserve historical prediction compatibility.
- Record evaluation metrics before activation.
- Track the dataset and feature version used by each model.

---

## Layer 4 - Training and Evaluation Pipeline

The training pipeline should produce auditable model artifacts and evaluation reports.

Pipeline steps:

- Load registered dataset
- Validate dataset quality
- Apply preprocessing version
- Generate or load engineered features
- Train model
- Evaluate model
- Generate explainability artifacts
- Save model artifact
- Register model version
- Mark candidate model

Evaluation outputs:

- Accuracy
- Precision
- Recall
- F1 score
- ROC-AUC, when applicable
- MAE/RMSE, when applicable
- Confidence distribution
- Risk bucket distribution
- Synthetic fairness checks
- Explanation quality checks

Activation requirements:

- Evaluation report exists
- Required metrics meet threshold
- Feature compatibility passes
- Explanation service supports the model
- Rollback target exists

---

## Layer 5 - Inference Service

Inference should be isolated from controllers behind explicit service contracts.

Inference input:

- User ID
- Feature snapshot ID
- Model family
- Requested model version, optional
- Request source
- Trace ID

Inference output:

- Prediction ID
- Model version
- Feature version
- Score or decision output
- Confidence
- Risk bucket, when applicable
- Explanation reference
- Created timestamp

Inference rules:

- Use the active model version by default.
- Store every prediction.
- Return confidence with AI outputs.
- Include enough metadata for reproducibility.
- Avoid expensive training or document processing in synchronous request paths.

---

## Layer 6 - Prediction History

Prediction history is required for explainability, auditing, and dashboard trends.

Suggested storage:

```text
ai_prediction_history
---------------------
id
userId
predictionType
modelVersion
featureVersion
featureSnapshotId
inputHash
output
confidence
explanationId
createdAt
traceId
```

Prediction types:

- `CREDIT_SCORE`
- `RISK_PROFILE`
- `INVESTMENT_RECOMMENDATION`
- `GROWTH_PROJECTION`
- `INSIGHT_GENERATION`

Benefits:

- Score history
- Model comparison
- Auditability
- Reproducibility
- Dashboard trends
- Debugging support

---

## Layer 7 - SHAP/LIME Explanation Service

Explainability should be a first-class AI infrastructure service.

Service responsibilities:

- Generate local explanations
- Generate global feature importance
- Store explanation artifacts
- Map features to plain-language reason codes
- Return top positive and negative factors
- Record explanation method and version

Explanation metadata:

- Explanation ID
- Prediction ID
- Model version
- Feature version
- Method
- Top factors
- Contribution values
- Confidence
- Generated timestamp

Rules:

- Do not expose raw technical explanation data without user-safe translation.
- Keep technical explanation artifacts for audit and analysis.
- Store reason-code mapping versions.
- Preserve old explanation outputs after model upgrades.

---

## Layer 8 - Feature Importance Service

Feature importance helps admins, analysts, and user-facing dashboards understand model behavior.

Outputs:

- Global feature importance
- Model-family feature importance
- Segment-level feature importance
- Top feature families
- Low-impact features
- Feature drift warnings, when production data exists

Use cases:

- Admin dashboard model monitoring
- Explainability reporting
- Feature engineering prioritization
- Fairness analysis
- Model debugging

---

## Layer 9 - Recommendation Engine Infrastructure

The recommendation engine should be versioned and explainable.

Inputs:

- Credit readiness features
- Financial discipline features
- Investment capacity features
- Risk profile
- Financial goals
- Growth projections

Outputs:

- Recommendation ID
- Recommendation type
- Suggested action
- Reason
- Expected impact label
- Confidence
- Educational disclaimer
- Engine version

Recommendation types:

- Savings improvement
- Expense control
- Utility payment discipline
- Recharge consistency
- Emergency fund
- Micro-investment allocation
- Goal progress

Important boundary:

- Recommendations should be educational guidance.
- Recommendations should not be framed as guaranteed returns.
- Recommendations should not be presented as regulated investment advice.

---

## Layer 10 - Projection Engine Infrastructure

The projection engine should generate reproducible growth scenarios for dashboards.

Projection inputs:

- Monthly investment amount
- Investment horizon
- Risk profile
- Recommended allocation
- Scenario assumptions
- Engine version

Projection scenarios:

- Conservative
- Moderate
- Aggressive

Projection windows:

- 1 year
- 3 years
- 5 years

Outputs:

- Projection ID
- Scenario
- Horizon
- Assumptions
- Projected values
- Chart-ready time series
- Explanation
- Disclaimer
- Engine version

Rules:

- Store assumptions with every projection.
- Avoid implying guaranteed returns.
- Keep projection logic versioned.
- Allow dashboards to compare historical projections.

---

## Layer 11 - Monitoring and Observability

AI infrastructure must expose operational health.

Monitoring metrics:

- Prediction volume
- Prediction latency
- Prediction failures
- Explanation latency
- Low-confidence outputs
- Model version usage
- Feature version usage
- Dataset version usage
- Score distribution
- Risk bucket distribution
- Recommendation distribution
- Projection scenario distribution

Future production metrics:

- Data drift
- Feature drift
- Prediction drift
- Model degradation
- Retraining triggers
- External adapter failures

---

## Suggested Backend and AI Modules

Keep AI and backend domain logic loosely coupled through explicit contracts.

Suggested backend modules:

- `ai-infrastructure.routes`
- `ai-infrastructure.validator`
- `ai-infrastructure.controller`
- `ai-infrastructure.service`
- `dataset-registry.service`
- `model-registry.service`
- `prediction-history.service`
- `feature-importance.service`

Suggested AI modules:

- `dataset_registry`
- `feature_registry`
- `model_registry`
- `training_pipeline`
- `evaluation_pipeline`
- `inference_service`
- `explanation_service`
- `recommendation_engine`
- `projection_engine`

Suggested endpoints:

```http
GET  /ai-infra/datasets
GET  /ai-infra/datasets/:id
GET  /ai-infra/models
GET  /ai-infra/models/:id
GET  /ai-infra/predictions
GET  /ai-infra/predictions/:id
GET  /ai-infra/feature-importance
POST /ai-infra/models/:id/activate
```

---

## Deliverables

At the end of Phase 11, CreditMiners should have:

- Dataset registry
- Dataset versioning
- Feature registry
- Feature versioning
- Model registry
- Model versioning
- Training and evaluation pipeline contract
- Inference service contract
- Prediction history storage
- SHAP/LIME explanation service
- Feature importance service
- Versioned recommendation engine
- Versioned projection engine
- AI monitoring metrics
- Reproducibility metadata for every AI output

This phase makes CreditMiners AI safer to operate, easier to explain, and ready for future production-grade model governance.
