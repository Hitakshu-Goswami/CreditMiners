const prisma = require("../config/prisma");

class AuditService {
  async log({
    userId,
    action,
    description,
    ipAddress,
    userAgent,
  }) {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        description,
        ipAddress,
        userAgent,
      },
    });
  }
}

module.exports = new AuditService();