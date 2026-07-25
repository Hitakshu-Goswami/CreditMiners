# Tasks

## Done

- Created synthetic prescreening datasets.
- Added explainable scorecard backend service.
- Added investment profiling backend service.
- Added demo API routes.
- Created Vite + React frontend app.
- Built polished multi-screen demo UI.
- Verified frontend production build.
- Verified demo scoring produces profiles across all risk buckets.
- Added project documentation and memory protocol.

## Next Before Prescreening

- Record a short demo video or screen walkthrough.
- Add 3-5 screenshots to `presentation/demo-images/`.
- Update main `readme.md` with current run/demo instructions.
- Prepare a short pitch explaining why synthetic data is used for prescreening.
- Add a small API test file for `/api/demo/summary` and `/api/demo/profiles/:id/assessment`.
- Confirm the UI works on the presentation laptop.

## After Prescreening

- Add canonical event schema for real ingestion.
- Build manual CSV upload adapter.
- Add Gmail/Takeout parser proof of concept.
- Explore Account Aggregator sandbox provider onboarding.
- Persist assessments into Prisma models.
- Add audit trail for user consent and data source.
- Add fairness and bias checks for scorecard features.

## Suggested Current Commit Split

Use several small commits rather than one giant commit:

1. Synthetic datasets.
2. Demo scoring and investment backend APIs.
3. Frontend Vite setup.
4. Prescreening dashboard UI.
5. Documentation updates.
