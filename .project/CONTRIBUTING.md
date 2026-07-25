# Contributing

1. Inspect current source and `git status`; read [CONTEXT.md](CONTEXT.md), [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md), and applicable roadmap references.
2. Classify work as Implemented, In Progress, Planned, Future Production, or Technical Debt; do not claim roadmap work exists before it is built.
3. Follow [BACKEND_GUIDELINES.md](BACKEND_GUIDELINES.md), [SECURITY.md](SECURITY.md), and [AI_CONTEXT.md](AI_CONTEXT.md) for backend/data/AI changes.
4. Keep commits focused. Do not mix unrelated formatting, application changes, or destructive migrations.
5. Run proportionate checks and state exactly what ran. The repository has no verified test script/framework.
6. Update API/database/architecture/module/decision documentation as appropriate and append material work to `memory.md`.

Never commit secrets, tokens, real financial/identity data, or raw sensitive documents. Schema changes require a reviewed migration, query/index rationale, data/recovery considerations, and documentation update.
