# Standards

## Data

- Use synthetic or explicitly consented data only.
- Keep demo source data in `data/sample-data/`.
- Do not commit secrets or real personal financial data.
- If adding a new source, document whether it is synthetic, uploaded, or consented.

## Backend

- Keep demo endpoints under `/api/demo`.
- Keep scoring logic explainable.
- Return disclaimers with investment outputs.
- Prefer small services over placing business logic in route files.

## Frontend

- Show the working product first.
- Keep explanation and improvement actions visible.
- Keep investment advice framed as educational simulation.
- Verify with `npm run build` after UI changes.

## Documentation

- Update `.project/memory.md` after meaningful changes.
- Update `.project/API.md` when endpoints change.
- Update `.project/ARCHITECTURE.md` when data flow or service boundaries change.
