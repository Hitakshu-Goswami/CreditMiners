const prisma = require("../config/prisma");

const sanitizeMetadata = (metadata = {}) => {
  const blockedKeys = new Set([
    "password",
    "passwordHash",
    "token",
    "refreshToken",
    "accessToken",
    "authorization",
    "cookie",
  ]);

  return Object.entries(metadata).reduce((result, [key, value]) => {
    if (blockedKeys.has(key)) return result;
    result[key] = value;
    return result;
  }, {});
};

class AdminAuditService {
  async log({
    actorUserId,
    actorRole,
    action,
    entityType,
    entityId,
    metadata,
    ipAddress,
    userAgent,
  }) {
    return prisma.adminAuditLog.create({
      data: {
        actorUserId,
        actorRole,
        action,
        entityType,
        entityId,
        metadata: metadata ? sanitizeMetadata(metadata) : undefined,
        ipAddress,
        userAgent,
      },
    });
  }

  async list(query = {}) {
    const limit = Math.min(Number(query.limit || 50), 200);
    const page = Number(query.page || 1);
    const where = {};

    if (query.actorUserId) where.actorUserId = query.actorUserId;
    if (query.actorRole) where.actorRole = query.actorRole;
    if (query.action) where.action = { contains: query.action };
    if (query.entityType) where.entityType = query.entityType;
    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.gte = new Date(query.from);
      if (query.to) where.createdAt.lte = new Date(query.to);
    }

    const [total, logs] = await prisma.$transaction([
      prisma.adminAuditLog.count({ where }),
      prisma.adminAuditLog.findMany({
        where,
        include: {
          actor: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new AdminAuditService();
