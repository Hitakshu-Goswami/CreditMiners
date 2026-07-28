-- Phase 10: Append-only privileged admin audit trail.

CREATE TABLE "admin_audit_logs" (
    "id" UUID NOT NULL,
    "actorUserId" UUID,
    "actorRole" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "admin_audit_logs_actorUserId_idx"
ON "admin_audit_logs"("actorUserId");

CREATE INDEX "admin_audit_logs_actorRole_idx"
ON "admin_audit_logs"("actorRole");

CREATE INDEX "admin_audit_logs_action_idx"
ON "admin_audit_logs"("action");

CREATE INDEX "admin_audit_logs_entityType_idx"
ON "admin_audit_logs"("entityType");

CREATE INDEX "admin_audit_logs_createdAt_idx"
ON "admin_audit_logs"("createdAt");

ALTER TABLE "admin_audit_logs"
ADD CONSTRAINT "admin_audit_logs_actorUserId_fkey"
FOREIGN KEY ("actorUserId") REFERENCES "users"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
