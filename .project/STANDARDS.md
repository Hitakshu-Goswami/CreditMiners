# Engineering standards

## Status vocabulary

- **Implemented:** present and used by current source.
- **In Progress:** partially present, scaffolded, or awaiting integration.
- **Planned:** defined roadmap work not yet implemented.
- **Future Production:** requires production data, governance, infrastructure, or external integration.
- **Technical Debt:** verified inconsistency or limitation requiring remediation.

## Code standards

- Preserve backend layering and shared validation/error/response patterns.
- Keep functions focused, names meaningful, and domain rules out of routes/controllers.
- Use CommonJS in backend and ESM in frontend unless an approved migration changes this.
- Validate at route boundaries, authorize/verify ownership in services, and propagate expected failures through `AppError` subclasses.

## Data and AI standards

- Use only synthetic or explicitly consented data; never commit sensitive customer data.
- Treat Prisma schema/migrations as reviewed contract; use `Decimal` for money and transactions for atomic operations.
- Build each roadmap data/AI phase with source provenance, consent, versioning, and explainability from the start.
- Do not claim prototype score/advisor output is regulated advice or credit approval.

## Quality/documentation standards

- Verify current repository state before work and report only checks actually run.
- Make focused changes and preserve unrelated work.
- Update relevant `.project` documents and `memory.md` when behavior, contracts, decisions, or status changes.
- Record only verified issues as Technical Debt; move an item to resolved only after source proves it.
