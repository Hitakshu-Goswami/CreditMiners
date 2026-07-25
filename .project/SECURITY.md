# Security reference

## Implemented controls

- Helmet, CORS middleware, body-size limit, compression, cookie parser, request logging, and rate limiting.
- bcrypt password hashing; JWT access/refresh utilities; hashed refresh/reset/verification tokens.
- Email-verification login gate, password reset expiry, session deletion on credential changes, lockout after repeated failed login, inactive-account check.
- Route validation, custom HTTP errors, Prisma access, and auth audit calls.

## In progress

- Authentication and role foundations exist, but refresh-token schema alignment must be resolved before production reliance.
- Audit logging exists but event/table contract and retention controls need definition.

## Future Production

Consent management, authorization/ownership policy across financial records, MFA, token-family/reuse controls, distributed rate limiting, secret manager, RLS/encryption strategy, webhook verification, document security, security monitoring, incident response, and compliance controls.

## Technical debt

- `RefreshToken.deviceInfo` code/schema mismatch.
- Unused/misaligned alternate RBAC middleware.
- Direct `process.env` usage alongside validated config; production CORS/secrets policy needs reconciliation.
- No verified redaction/retention/centralization policy for logs.

## Rule

Design consent, data classification, access control, validation, audit event, error handling, and logging redaction before exposing any new financial or AI data path.
