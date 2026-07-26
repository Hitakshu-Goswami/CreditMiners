 # Real ML Layer Plan for CreditMiners

  ## Summary

  The current Phase 5 backend is an explainable deterministic baseline: it
  validates Phase 4 features, scores them with fixed weights, explains the result,
  stores history, and exposes APIs.

  The future real ML layer should live mainly in ml/ and provide trained model
  artifacts, preprocessing objects, evaluation reports, SHAP/LIME explainers, and
  an inference contract that the backend can call. The backend should remain the
  API, auth, persistence, and explainability-response owner.

  Current repo state: ml/ has folders for datasets/, preprocessing/, training/,
  models/, explainability/, inference/, and notebooks/, but no actual ML
  implementation yet.

  ## Checkpoints

  ### Checkpoint 1 — Dataset Contract

  - Create a labelled training dataset from synthetic Phase 4-style feature rows.
  - Each row should include:
      - userId or synthetic profile id
      - featureVersion
      - engineered feature columns from Phase 4
      - target label: credit score, credit likelihood, or risk bucket

  - Add a data dictionary describing every feature, type, range, and source.
  - Output files should go under ml/datasets/.

  Acceptance:

  - Dataset can be loaded by Python.
  - Labels are reproducible.
  - Feature names match backend Phase 4 financialFeature.featureName.

  ### Checkpoint 2 — Preprocessing Pipeline

  - Implement preprocessing in ml/preprocessing/.
  - Handle:
      - missing features
      - numeric validation
      - scaling
      - train/test split
      - feature ordering
      - saved preprocessing object

  - Save preprocessing artifact beside model artifacts.

  Acceptance:

  - Same input feature JSON always becomes the same ordered model vector.
  - Missing/extra features are handled predictably.
  - Backend and ML agree on supported featureVersion.

  ### Checkpoint 3 — Model Training

  - Implement training scripts in ml/training/.
  - Start with:
      - Logistic Regression baseline
      - Random Forest
      - XGBoost or LightGBM if dependencies are acceptable

  - Compare models using:
      - MAE/RMSE for credit score regression, or
      - ROC-AUC/F1/precision/recall for likelihood/risk classification

  - Save the selected trained model to ml/models/.

  Acceptance:

  - Training command produces model artifact, metrics report, and selected model
    version.

  - Metrics are written to a JSON report.
  - Model version includes dataset version and feature version.

  ### Checkpoint 4 — Explainability Layer

  - Implement SHAP first in ml/explainability/.
  - Add LIME only if time permits.
  - Generate:
      - global feature importance
      - local explanation for one prediction
      - top positive and negative factors

  - Keep raw SHAP values inside ML output, but backend converts them to user-safe
    explanations.

  Acceptance:

  - Given a feature vector, explainer returns top contributing factors.
  - Explanation feature names map back to Phase 4 feature definitions.
  - No raw prediction is returned directly to frontend without backend narrative
    formatting.

  ### Checkpoint 5 — Inference Interface

  - Implement ml/inference/ with a stable prediction function or FastAPI service.
  - Input:
      - feature vector from backend
      - feature version
      - model version optional

  - Output:
      - raw probability or raw score
      - calibrated score
      - risk bucket
      - model confidence signal
      - SHAP/LIME factor contributions
      - model metadata

  Recommended first version:

  - Python module callable from tests.
  - Later upgrade to FastAPI service if needed.

  Acceptance:

  - Backend can call one stable inference contract.
  - ML service never owns auth or database writes.
  - Backend still owns final explanation, recommendation, and history persistence.

  ### Checkpoint 6 — Backend Integration

  - Replace Phase 5 fixed-weight scoring with an adapter in backend/src/services/
    aiCredit.service.js.

  - Keep current backend pipeline:
      - feature readiness validation
      - feature selection
      - ML inference adapter
      - calibration verification
      - risk/confidence engine
      - explainability/narrative layer
      - recommendations
      - persisted history

  - Store model metadata in AIModelVersion.

  Acceptance:

  - Existing /api/ai/credit-score response shape stays dashboard-compatible.
  - Assessment history remains reproducible with modelVersion, featureVersion, and
    featureRunId.

  - If ML inference fails, backend returns a clear error or optionally falls back
    to deterministic baseline.

  ### Checkpoint 7 — Evaluation and Fairness

  - Add model evaluation reports under ml/models/<version>/.
  - Evaluate:
      - accuracy or regression error
      - stability across income groups
      - stability across city tiers
      - stability across employment types
      - explanation consistency

  - Record limitations clearly.

  Acceptance:

  - Every model version has metrics.
  - No model is marked production-ready without evaluation.
  - Bias/fairness checks are documented, even if synthetic.

  ## Public Interfaces

  - Keep existing backend API:
      - POST /api/ai/credit-score
      - GET /api/ai/credit-score/:id
      - GET /api/ai/credit-score/history
      - GET /api/ai/credit-score/latest
      - GET /api/ai/credit-score/factors
      - GET /api/ai/credit-score/improvement-plan
      - GET /api/ai/credit-score/confidence
      - GET /api/ai/credit-score/explanation

  - Add internal ML inference contract, not public frontend API.
  - Do not expose raw model output directly to frontend.

  ## Test Plan

  - Python tests:
      - dataset loads correctly
      - preprocessing creates stable feature vectors
      - model training produces artifacts
      - inference returns expected fields
      - SHAP/LIME explanation returns mapped feature factors

  - Backend tests:
      - backend calls ML adapter successfully
      - ML output passes through explainability layer
      - failed ML inference is handled cleanly
      - persisted assessment stores model version and feature version

  - End-to-end test:
      - compute Phase 4 features
      - generate Phase 5 score through ML adapter
      - retrieve history and explanation

  “Implement the real ML layer for CreditMiners using the existing ml/ folder.
  Start with synthetic Phase 4 feature datasets, preprocessing, Logistic
  Regression and Random Forest training, model evaluation, saved artifacts, SHAP
  explainability, and a stable inference adapter that the backend Phase 5 service
  can call. Keep backend APIs unchanged and make sure no raw ML prediction is
  returned without the backend explainability layer.”

  ## Assumptions

  - First real ML version will use synthetic labelled data.
  - Backend remains the source of truth for auth, persistence, API responses, and
    user-facing explanations.

  - ml/ owns training, preprocessing, saved models, metrics, and explainer
    artifacts.

  - SHAP is the first explainability target; LIME is secondary.
  - FastAPI model serving is optional until the Python inference contract is
    stable.